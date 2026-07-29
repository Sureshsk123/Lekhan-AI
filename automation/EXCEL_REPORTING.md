# Enterprise ExcelJS Reporting

This document explains the architecture and usage of the Enterprise Excel Reporting module integrated into the Selenium test framework.

## Architecture

The Excel reporting functionality leverages **Mocha's Global Teardown hook** combined with **Mochawesome JSON aggregations** to generate a single, robust `.xlsx` report after parallel test execution.

1. **Parallel Execution via Mochawesome**: When tests run in parallel, Mochawesome is configured (`overwrite=false`) to output independent `.json` files per worker thread into `reports/{browser}/`.
2. **Global Teardown Hook**: `utilities/GlobalTeardown.js` registers a `mochaGlobalTeardown` hook. Mocha ensures this hook is executed exactly once in the master process after all parallel worker threads complete.
3. **Report Generation**: The hook calls `ExcelReportManager.generateReport()`.
4. **Data Aggregation**: `ExcelReportManager` scans the `reports/{browser}/` directory, parses all JSON files, deduplicates tests by their UUID (handling any overlapping worker results), calculates performance metrics, and injects the aggregated data into a structured Excel workbook using `exceljs`.

## Workbook Design

The generated workbook (`reports/{browser}/E2E_Report.xlsx`) consists of 7 core sheets:

1. **Execution Summary**: A high-level overview detailing the total tests, pass percentage, execution timestamps, total duration, and parallel worker count.
2. **Passed Tests**: A comprehensive list of all passing tests, their parent suite, browser context, execution time, and timestamp.
3. **Failed Tests**: Detailed logs of failed tests, isolating error messages, stack traces, console log paths, and screenshot paths to accelerate root cause analysis.
4. **Skipped Tests**: Tests bypassed during execution, noting the explicit reason or `pending` state provided by Mocha.
5. **Environment Information**: Hardware, software, and CI details (Operating System, Node Version, Selenium version, Framework version, and current Git Branch/Commit).
6. **Performance Metrics**: Calculates fastest, slowest, and average test durations across the suite to help identify flakiness or performance regressions.
7. **Run Metadata**: An automated dataset capturing detailed infrastructure metadata, software versions, and trigger events for auditing and compliance (e.g., Execution ID, OS Username, CI status).

## How Reports Are Generated

The report generation happens entirely automatically when you run:

```bash
npm run test
```

*Note: If you run multiple test suites sequentially without cleaning up, the report will aggregate all JSON files currently in the `reports/` folder. It is recommended to use `npm run clean` to wipe out old logs before generating a new unified report.*

## How Parallel Execution Merges Results

Because the Mocha workers operate in complete isolation, each worker emits isolated test statistics. `ExcelReportManager.js` handles merging by:
- Storing a `Set` of parsed test `uuid`s to ignore duplicates.
- Re-calculating global durations and max/min start/end timestamps from the component JSON logs.
- Grouping environment information into a unified dataset.

## How to Customize Report Columns

If you need to add more data points (like JIRA Ticket IDs or execution tags):

1. **Add Custom Context in Tests**: Use `addContext()` in your tests to append metadata to the Mochawesome JSON.
2. **Modify the Sheet Columns**: In `utilities/ExcelReportManager.js`, locate the `workbook.addWorksheet` segment for your desired sheet. Update the `columns` array with your new header.
   ```javascript
   // Example for adding a 'Tag' column
   sheet2.columns = [
       { header: 'Test Name', key: 'testName', width: 40 },
       { header: 'Tag', key: 'tag', width: 20 },
       // ... existing columns
   ];
   ```
3. **Extract Data**: During the JSON parsing loop in `ExcelReportManager.js`, extract the custom property from the `test` object and push it into your `testData` dictionary before passing it to `.addRow()`.
