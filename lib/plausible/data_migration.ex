defmodule Plausible.DataMigration do
  defmacro __using__(opts) do
    dir = Keyword.fetch!(opts, :dir)
    repo = Keyword.get(opts, :repo, Plausible.DataMigration.Repo)

    quote bind_quoted: [dir: dir, repo: repo] do
      @dir dir
      @repo repo

      def run_sql_confirm(name, assigns \\ []) do
        query = unwrap(name, assigns)

        if String.downcase(String.trim(IO.gets("Continue? [Y/n]: "))) in ["y", "yes"] do
          do_run(query)
        else
          IO.puts("Skipped.")
        end
      end

      def run_sql(name, assigns \\ []) do
        query = unwrap(name, assigns)
        do_run(query)
      end

      defp do_run(query) do
        {:ok, res} = @repo.query(query, [], timeout: :infinity)
        IO.puts("Done!\n\n")
        {:ok, res}
      end

      defp unwrap(name, assigns) do
        IO.puts("-> -> Running #{name}")

        query =
          "priv/data_migrations"
          |> Path.join(@dir)
          |> Path.join("sql")
          |> Path.join(name <> ".sql.eex")
          |> EEx.eval_file(assigns: assigns)

        IO.puts("""
        -> Query:

        #{String.trim(query)}
        """)

        query
      end
    end
  end
end
