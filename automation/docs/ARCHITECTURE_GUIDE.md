# Architecture Guide

## The Testing Pyramid
1. **Execution**: The underlying Selenium and Appium runners.
2. **Orchestration**: The `PlatformExecutionManager` routes jobs across the grid.
3. **Data**: The `DataManager` guarantees state safety.
4. **Reporting**: The `UnifiedMetrics` stitches outputs together.

This layered approach guarantees that switching from Selenium to Playwright (or Appium to Maestro) in the future requires only replacing the bottom tier without rewriting Data or Orchestration logic.
