defmodule Plausible.DataMigration.NumericIDs do
  use Plausible.DataMigration, dir: "NumericIDs"

  def run() do
    dict_url = System.get_env("DOMAINS_DICT_URL") || ""
    dict_password = System.get_env("DOMAINS_DICT_PASSWORD") || ""

    (byte_size(dict_url) > 0 and byte_size(dict_password) > 0) ||
      raise "Set DOMAINS_DICT_URL and DOMAINS_DICT_PASSWORD"

    cluster? = true

    table_settings = "SETTINGS index_granularity = 8192, storage_policy = 'tiered'"

    {:ok, _} = run_sql("drop-events-v2", cluster?: cluster?)
    {:ok, _} = run_sql("drop-sessions-v2", cluster?: cluster?)
    {:ok, _} = run_sql("drop-tmp-events-v2")
    {:ok, _} = run_sql("drop-tmp-sessions-v2")
    {:ok, _} = run_sql("drop-dict")

    {:ok, _} =
      run_sql("create-dict-from-static-file", dict_url: dict_url, dict_password: dict_password)

    {:ok, _} = run_sql("create-events-v2", table_settings: table_settings, cluster?: cluster?)

    {:ok, _} = run_sql("create-sessions-v2", table_settings: table_settings, cluster?: cluster?)

    {:ok, _} = run_sql("create-tmp-events-v2", table_settings: table_settings)
    {:ok, _} = run_sql("create-tmp-sessions-v2", table_settings: table_settings)

    IO.gets("Press enter to continue")

    IO.puts("start.. #{DateTime.utc_now()}")

    {:ok, _} = run_sql("insert-into-tmp-events-v2", partition: "202301")

    {:ok, _} = run_sql("attach-tmp-events-v2", partition: "202301")

    {:ok, _} = run_sql("truncate-tmp-events-v2")

    {:ok, _} = run_sql("insert-into-tmp-sessions-v2", partition: "202301")
    {:ok, _} = run_sql("attach-tmp-sessions-v2", partition: "202301")
    {:ok, _} = run_sql("truncate-tmp-sessions-v2")

    IO.puts("end.. #{DateTime.utc_now()}")
  end
end
