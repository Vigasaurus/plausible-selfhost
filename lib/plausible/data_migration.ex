defmodule Plausible.DataMigration do
  defmacro __using__(opts) do
    dir = Keyword.fetch!(opts, :dir)
    repo = Keyword.get(opts, :repo, Plausible.ProdRepo)

    quote bind_quoted: [dir: dir, repo: repo] do
      @dir dir
      @repo repo

      def run_sql(name, assigns \\ []) do
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

        {:ok, res} = @repo.query(query, [], timeout: :infinity)

        IO.puts("Done!\n\n")
        {:ok, res}
      end
    end
  end
end
