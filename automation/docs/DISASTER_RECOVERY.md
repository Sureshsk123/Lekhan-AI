# Disaster Recovery

## Driver Zombie Processes
If tests crash hard locally without hitting the `PlatformHooks.afterAll()` teardown, run:
```bash
pkill -f chromedriver
pkill -f emulator
adb kill-server
```

## Data Lock Exhaustion
If the `DataAllocator` throws an exhaustion error, either increase the size of the JSON datasets or reduce the parallel `workerCount`.
