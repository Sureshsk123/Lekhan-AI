# Enterprise Parallel Execution Engine

## Architecture
The Parallel Execution Engine is the orchestration heart of the Mobile Framework. It is designed to handle highly concurrent execution of test suites across multiple physical devices, emulators, and cloud Appium Grids.

It relies on a single-threaded asynchronous Promise loop to dispatch tasks without the overhead of native OS threads, while strictly isolating instance states.

## Core Components
- `DevicePool`: Hardware registry tracking availability.
- `WorkerManager`: Constructs completely isolated V8 contexts. Every worker receives a brand new `FlowManager` and `CompatibilityManager`.
- `ExecutionQueue`: FIFO/Priority queue supporting auto-retries.
- `SessionManager`: Handles webdriverio connection creation and destruction.
- `ExecutionScheduler`: Polls the queue and matches available `DevicePool` nodes to idle workers.

## Worker Lifecycle
1. **Allocate**: The `ExecutionScheduler` reserves a worker slot and a device.
2. **Session Start**: `SessionManager` spins up an Appium session on the target hardware.
3. **Execution**: The `WorkerManager` runs the job.
4. **Recovery**: If the driver crashes, `ExecutionManager` catches the fatal error, logs a recovery event, requeues the test, and releases the hardware.
5. **Teardown**: The session is explicitly destroyed to prevent driver leakage.

## Thread Safety Guarantee
**Zero Shared Mutable State**. 
No singleton instances of `FlowManager`, `CompatibilityManager`, or `DataManager` are shared across tests. Everything is injected via constructor at the moment the Worker spins up.

## Scaling
By modifying `ParallelConfiguration`, you can dynamically increase the `workerCount`. The engine acts as a reverse-proxy load balancer: if you supply 10 tests but only 2 workers, the tests will be processed 2 at a time. If a cloud grid provides 50 devices, set `workerCount=50` to exhaust the queue simultaneously.
