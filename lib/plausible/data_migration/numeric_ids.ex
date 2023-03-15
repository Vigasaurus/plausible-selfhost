defmodule Plausible.DataMigration.NumericIDs do
  use Plausible.DataMigration, dir: "NumericIDs"

  @table_settings "SETTINGS index_granularity = 8192, storage_policy = 'tiered'"

  def run() do
    db_url =
      System.get_env(
        "NUMERIC_IDS_MIGRATION_DB_URL",
        Application.get_env(:plausible, Plausible.IngestRepo)[:url]
      )

    max_threads = System.get_env("NUMERIC_IDS_MIGRATION_MAX_THREADS", "16")
    dict_url = System.get_env("DOMAINS_DICT_URL") || ""
    dict_password = System.get_env("DOMAINS_DICT_PASSWORD") || ""
    table_settings = System.get_env("NUMERIC_IDS_TABLE_SETTINGS") || @table_settings
    start_from = System.get_env("NUMERIC_IDS_PARTITION_START_FROM")

    (byte_size(dict_url) > 0 and byte_size(dict_password) > 0) ||
      raise "Set DOMAINS_DICT_URL and DOMAINS_DICT_PASSWORD"

    @repo.start(db_url, String.to_integer(max_threads))

    cluster? =
      case run_sql("check-replicas") do
        {:ok, %{num_rows: 0}} -> false
        {:ok, %{num_rows: 1}} -> true
      end

    {:ok, %{rows: partitions}} = run_sql("list-partitions", start_from: start_from)
    partitions = Enum.map(partitions, fn [part] -> part end)

    start_from = start_from || List.first(partitions)

    IO.puts("""
    Got the following migration settings: 

      - max_threads: #{max_threads}
      - dict_url: #{dict_url}
      - dict_password: ✅
      - table_settings: #{table_settings}
      - db url: #{db_url}
      - cluster?: #{cluster?}
      - partitions to do: #{inspect(partitions, pretty: true, width: 80)}
      - start from: #{start_from}
    """)

    {:ok, _} = run_sql_confirm("drop-events-v2", cluster?: cluster?)
    {:ok, _} = run_sql_confirm("drop-sessions-v2", cluster?: cluster?)
    {:ok, _} = run_sql_confirm("drop-tmp-events-v2")
    {:ok, _} = run_sql_confirm("drop-tmp-sessions-v2")
    {:ok, _} = run_sql_confirm("drop-dict")

    {:ok, _} =
      run_sql_confirm("create-dict-from-static-file",
        dict_url: dict_url,
        dict_password: dict_password
      )

    {:ok, _} =
      run_sql_confirm("create-events-v2", table_settings: table_settings, cluster?: cluster?)

    {:ok, _} =
      run_sql_confirm("create-sessions-v2", table_settings: table_settings, cluster?: cluster?)

    {:ok, _} = run_sql_confirm("create-tmp-events-v2", table_settings: table_settings)
    {:ok, _} = run_sql_confirm("create-tmp-sessions-v2", table_settings: table_settings)

    confirm("Start migration? (starting from partition: #{start_from})", fn ->
      IO.puts("start.. #{DateTime.utc_now()}")

      for part <- partitions do
        confirm("Run partition: #{part}?", fn ->
          {:ok, _} = run_sql("insert-into-tmp-events-v2", partition: part)
          {:ok, _} = run_sql("attach-tmp-events-v2", partition: part)
          {:ok, _} = run_sql("truncate-tmp-events-v2")
          {:ok, _} = run_sql("insert-into-tmp-sessions-v2", partition: part)
          {:ok, _} = run_sql("attach-tmp-sessions-v2", partition: part)
          {:ok, _} = run_sql("truncate-tmp-sessions-v2")
        end)
      end

      IO.puts("end.. #{DateTime.utc_now()}")
    end)
  end
end
