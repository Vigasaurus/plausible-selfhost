defmodule Plausible.Site.CacheTest do
  use Plausible.DataCase, async: true

  alias Plausible.Site
  alias Plausible.Site.Cache

  import ExUnit.CaptureLog

  describe "public cache interface" do
    test "cache process is started, but falls back to the database if cache is disabled" do
      insert(:site, domain: "example.test")
      refute Cache.enabled?()
      assert Process.alive?(Process.whereis(Cache.name()))
      refute Process.whereis(Cache.Warmer)
      assert %Site{domain: "example.test", from_cache?: false} = Cache.get("example.test")
      assert Cache.size() == 0
      refute Cache.get("other.test")
    end

    test "critical cache errors are logged and nil is returned" do
      log =
        capture_log(fn ->
          assert Cache.get("key", force?: true, cache_name: NonExistingCache) == nil
        end)

      assert log =~ "Error retrieving 'key' from 'NonExistingCache': :no_cache"
    end

    test "cache caches", %{test: test} do
      {:ok, _} =
        Supervisor.start_link([{Cache, [cache_name: test, child_id: :test_cache_caches_id]}],
          strategy: :one_for_one,
          name: Test.Supervisor.Cache
        )

      %{id: first_id} = site1 = insert(:site, domain: "site1.example.com")
      _ = insert(:site, domain: "site2.example.com")

      :ok = Cache.refresh_all(cache_name: test)

      {:ok, _} = Plausible.Repo.delete(site1)

      assert Cache.size(test) == 2

      assert %Site{from_cache?: true, id: ^first_id} =
               Cache.get("site1.example.com", force?: true, cache_name: test)

      assert %Site{from_cache?: true} =
               Cache.get("site2.example.com", force?: true, cache_name: test)

      assert %Site{from_cache?: false} = Cache.get("site2.example.com", cache_name: test)

      refute Cache.get("site3.example.com", cache_name: test, force?: true)
    end

    test "cache exposes hit rate", %{test: test} do
      {:ok, _} = start_test_cache(test)

      insert(:site, domain: "site1.example.com")
      :ok = Cache.refresh_all(cache_name: test)

      assert Cache.hit_rate(test) == 0
      assert Cache.get("site1.example.com", force?: true, cache_name: test)
      assert Cache.hit_rate(test) == 100
      refute Cache.get("nonexisting.example.com", force?: true, cache_name: test)
      assert Cache.hit_rate(test) == 50
    end

    test "a single cached site can be refreshed", %{test: test} do
      {:ok, _} = start_test_cache(test)

      domain1 = "site1.example.com"
      domain2 = "nonexisting.example.com"

      cache_opts = [cache_name: test, force?: true]

      assert Cache.get(domain1) == nil

      insert(:site, domain: domain1)

      assert {:ok, %{domain: ^domain1}} = Cache.refresh_one(domain1, cache_opts)
      assert %Site{domain: ^domain1} = Cache.get(domain1, cache_opts)

      assert {:ok, %Ecto.NoResultsError{}} = Cache.refresh_one(domain2, cache_opts)
      assert %Ecto.NoResultsError{} = Cache.get(domain2, cache_opts)
    end

    test "refreshing a single site sends a telemetry event indicating record not found in the database",
         %{
           test: test
         } do
      :ok =
        start_test_cache_with_telemetry_handler(test,
          event: Cache.telemetry_event_refresh(test, :one)
        )

      Cache.refresh_one("missing.example.com", force?: true, cache_name: test)
      assert_receive {:telemetry_handled, %{found_in_db?: false}}
    end

    test "refreshing a single site sends a telemetry event indicating record found in the database",
         %{
           test: test
         } do
      domain = "site1.example.com"
      insert(:site, domain: domain)

      :ok =
        start_test_cache_with_telemetry_handler(test,
          event: Cache.telemetry_event_refresh(test, :one)
        )

      Cache.refresh_one(domain, force?: true, cache_name: test)
      assert_receive {:telemetry_handled, %{found_in_db?: true}}
    end

    test "refreshing all sites sends a telemetry event",
         %{
           test: test
         } do
      domain = "site1.example.com"
      insert(:site, domain: domain)

      :ok =
        start_test_cache_with_telemetry_handler(test,
          event: Cache.telemetry_event_refresh(test, :all)
        )

      Cache.refresh_all(force?: true, cache_name: test)
      assert_receive {:telemetry_handled, %{}}
    end
  end

  describe "warming the cache" do
    test "cache warmer process warms up the cache", %{test: test} do
      test_pid = self()
      opts = [force_start?: true, warmer_fn: report_back(test_pid), cache_name: test]

      {:ok, _} = Supervisor.start_link([{Cache.Warmer, opts}], strategy: :one_for_one, name: test)
      assert Process.whereis(Cache.Warmer)

      assert_receive {:cache_warmed, %{opts: got_opts}}
      assert got_opts[:cache_name] == test
    end

    test "cache warmer warms periodically with an interval", %{test: test} do
      test_pid = self()

      opts = [
        force_start?: true,
        warmer_fn: report_back(test_pid),
        cache_name: test,
        interval: 30
      ]

      {:ok, _} = start_test_warmer(opts)

      assert_receive {:cache_warmed, %{at: at1}}, 100
      assert_receive {:cache_warmed, %{at: at2}}, 100
      assert_receive {:cache_warmed, %{at: at3}}, 100

      assert is_integer(at1)
      assert is_integer(at2)
      assert is_integer(at3)

      assert at1 < at2
      assert at3 > at2
    end

    test "deleted sites don't stay in cache on another refresh", %{test: test} do
      {:ok, _} = start_test_cache(test)

      domain1 = "site1.example.com"
      domain2 = "site2.example.com"

      site1 = insert(:site, domain: domain1)
      _site2 = insert(:site, domain: domain2)

      cache_opts = [cache_name: test, force?: true]

      :ok = Cache.refresh_all(cache_opts)

      assert Cache.get(domain1, cache_opts)
      assert Cache.get(domain2, cache_opts)

      Repo.delete!(site1)

      :ok = Cache.refresh_all(cache_opts)

      assert Cache.get(domain2, cache_opts)

      refute Cache.get(domain1, cache_opts)
      Cache.refresh_one(domain1, cache_opts)
      assert Cache.get(domain1, cache_opts) == %Ecto.NoResultsError{}
    end
  end

  defp report_back(test_pid) do
    fn opts ->
      send(test_pid, {:cache_warmed, %{at: System.monotonic_time(), opts: opts}})
      :ok
    end
  end

  defp start_test_cache(cache_name) do
    %{start: {m, f, a}} = Cache.child_spec(cache_name: cache_name)
    apply(m, f, a)
  end

  defp start_test_warmer(opts) do
    child_name_opt = {:child_name, {:local, Keyword.fetch!(opts, :cache_name)}}
    %{start: {m, f, a}} = Cache.Warmer.child_spec([child_name_opt | opts])
    apply(m, f, a)
  end

  defp start_test_cache_with_telemetry_handler(test, event: event) do
    {:ok, _} = start_test_cache(test)
    test_pid = self()

    :telemetry.attach(
      "#{test}-telemetry-handler",
      event,
      fn ^event, %{duration: d}, metadata, _ when is_integer(d) ->
        send(test_pid, {:telemetry_handled, metadata})
      end,
      %{}
    )
  end
end