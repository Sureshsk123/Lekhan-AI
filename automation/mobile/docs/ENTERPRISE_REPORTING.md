# Enterprise Reporting Platform

## Architecture
The Reporting Platform operates completely asynchronously from the main test execution loop. It relies on the `ExecutionAggregator` to safely absorb test results pushed by concurrent workers in real-time, preventing file-write lock collisions.

At the conclusion of the test suite, the `ReportManager` converts the aggregated JSON buffer into multiple formats simultaneously.

## Formats Generated
- **HTML**: Human-readable graphical summary, mapping pass/fail tables with embedded screenshot artifacts.
- **Excel (xlsx)**: Data-rich spreadsheet powered by `exceljs`. Includes discrete tabs for Environment data, Metrics, and granular Test Steps.
- **JSON**: Raw stringified payload suitable for REST ingestion.

## Integrations
- `DashboardDataGenerator`: Converts the JSON payload into a strict Kibana/ElasticSearch compatible telemetry push.
- `TrendAnalyzer`: Loads previously run JSON payloads from the local cache and calculates Delta differences. Identifies tests that flip-flop between PASS/FAIL (Flaky).
- `ArtifactCollector`: Correlates random log files and screenshot buffers into discrete paths linked to a specific `WorkerId` and `TestId`.

## Thread Safety
Because V8 Arrays handle `.push()` synchronously without blocking the event loop on the main Node thread, the `ExecutionAggregator` guarantees no race conditions. We explicitly avoid writing to Disk from the workers, instead letting the `ReportManager` flush to disk exactly once at the end of the suite.
