# Enterprise-Grade Parallel Execution in Selenium Framework

This document outlines how to configure and execute tests using the parallel execution capabilities built into the framework.

## Configuration

The parallel execution settings are controlled primarily through the global `config/config.json` file.

**Example `config/config.json`**:
```json
{
  "browser": "chrome",
  "headless": false,
  "parallel": true,
  "workers": 4
}
```

- `browser`: Specifies the target browser. Options: `chrome`, `firefox`, `edge`.
- `headless`: Run the browser in headless mode (`true` or `false`).
- `parallel`: Enables Mocha parallel execution (`true` or `false`).
- `workers`: The number of worker processes to spawn when parallel execution is enabled.

## Independent Artifacts

During parallel execution, each worker gets its own WebDriver instance, ensuring complete isolation.

- **Reports**: Stored per browser in `reports/{browser}/`. (e.g., `reports/chrome/`)
- **Screenshots**: Stored per browser in `screenshots/{browser}/`. The filename includes the worker ID.
- **Logs**: Stored per browser in `logs/{browser}/`. Each worker has its own dedicated log file (e.g., `automation-worker-0.log`, `automation-worker-1.log`).
- **Downloads**: Files downloaded by the browser during tests are stored per browser and per worker in `downloads/{browser}/worker-{workerId}/`.

## Execution Examples

### 1. Execute on Chrome in Parallel
Ensure `config/config.json` looks like this:
```json
{
  "browser": "chrome",
  "headless": false,
  "parallel": true,
  "workers": 4
}
```
Run:
```bash
npm run test
```

### 2. Execute on Firefox (Single Browser/Sequential)
Update `config/config.json`:
```json
{
  "browser": "firefox",
  "headless": false,
  "parallel": false
}
```
Run:
```bash
npm run test
```

### 3. Execute on Edge Headless in Parallel
Update `config/config.json`:
```json
{
  "browser": "edge",
  "headless": true,
  "parallel": true,
  "workers": 2
}
```
Run:
```bash
npm run test
```

### 4. Headless Execution (Chrome)
Update `config/config.json`:
```json
{
  "browser": "chrome",
  "headless": true,
  "parallel": true,
  "workers": 4
}
```
Run:
```bash
npm run test
```

## Troubleshooting

- **File Locks**: Since logs and screenshots are separated by browser and worker ID, you should not encounter file lock issues. However, if running sequential runs right after each other, you might want to run `npm run clean` first.
- **Out of Memory**: Spawning too many workers can cause resource exhaustion (RAM/CPU). Lower the `workers` count in `config/config.json` if you encounter browser crashes.
