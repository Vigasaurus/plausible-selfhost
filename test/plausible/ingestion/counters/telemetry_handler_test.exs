defmodule Plausible.Ingestion.Counters.TelemetryHandlerTest do
  use Plausible.DataCase, async: true

  alias Plausible.Ingestion.Counters.Buffer
  alias Plausible.Ingestion.Counters.TelemetryHandler
  alias Plausible.Ingestion.Event

  test "install/1 attaches a telemetry handler", %{test: test} do
    buffer = Buffer.new(test)
    assert :ok = TelemetryHandler.install(buffer)

    all_handlers = :telemetry.list_handlers([:plausible, :ingest, :event])

    assert Enum.find(all_handlers, fn handler ->
             handler.config == buffer and
               handler.event_name == Event.telemetry_event_dropped()
           end)

    assert Enum.find(all_handlers, fn handler ->
             handler.config == buffer and
               handler.event_name == Event.telemetry_event_buffered()
           end)
  end

  test "handles ingest events by aggregating the counts", %{test: test} do
    buffer = Buffer.new(test)
    assert :ok = TelemetryHandler.install(buffer)

    :ok = Event.emit_telemetry_dropped("a.example.com", :invalid)
    :ok = Event.emit_telemetry_dropped("b.example.com", :not_found)
    :ok = Event.emit_telemetry_buffered("c.example.com")
    :ok = Event.emit_telemetry_dropped("b.example.com", :not_found)

    future = DateTime.utc_now() |> DateTime.add(120, :second)

    assert aggregates =
             buffer
             |> Buffer.flush(future)
             |> Enum.sort_by(&elem(&1, 2))

    assert [
             {_, "dropped_invalid", "a.example.com", 1},
             {_, "dropped_not_found", "b.example.com", 2},
             {_, "buffered", "c.example.com", 1}
           ] = aggregates
  end
end