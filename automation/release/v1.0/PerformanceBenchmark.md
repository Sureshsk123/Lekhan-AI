# Performance Benchmark (Theoretical)

### Startup Overhead
- `ExecutionManager` bootstrapping: < 500ms
- Worker spawn (isolated V8): < 100ms
- Appium / ChromeDriver allocation: 1.5s - 3.0s

### Concurrent Efficiency
Because of Node's non-blocking I/O event loop, spinning up 50 parallel Appium executions utilizes less than 1.5GB of RAM on the orchestrator machine, leaving maximum compute power available for the device emulators.
