export class ExecutionMetrics {
    constructor() {
        this.startTime = Date.now();
        this.testsPassed = 0;
        this.testsFailed = 0;
        this.totalRetries = 0;
        this.recoveryEvents = 0;
        this.queueWaitTimes = [];
        this.workerUtilization = new Map();
    }

    recordResult(passed) { passed ? this.testsPassed++ : this.testsFailed++; }
    recordRetry() { this.totalRetries++; }
    recordRecovery() { this.recoveryEvents++; }
    recordWaitTime(ms) { this.queueWaitTimes.push(ms); }
    
    getSummary() {
        const duration = (Date.now() - this.startTime) / 1000;
        const avgWait = this.queueWaitTimes.length ? this.queueWaitTimes.reduce((a,b)=>a+b,0) / this.queueWaitTimes.length : 0;
        return {
            durationSeconds: duration,
            passed: this.testsPassed,
            failed: this.testsFailed,
            retries: this.totalRetries,
            recoveries: this.recoveryEvents,
            averageQueueWaitMs: avgWait
        };
    }
}