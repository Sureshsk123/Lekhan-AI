export class ExecutionAggregator {
    constructor() {
        this.results = [];
        this.startTime = Date.now();
    }

    addResult(resultPayload) {
        // Thread-safe push operation for V8 array
        this.results.push({
            ...resultPayload,
            timestamp: new Date().toISOString()
        });
    }

    getAggregatedPayload() {
        return {
            executionStart: new Date(this.startTime).toISOString(),
            executionEnd: new Date().toISOString(),
            totalDurationMs: Date.now() - this.startTime,
            totalTests: this.results.length,
            passed: this.results.filter(r => r.status === 'PASS').length,
            failed: this.results.filter(r => r.status === 'FAIL').length,
            skipped: this.results.filter(r => r.status === 'SKIP').length,
            results: this.results
        };
    }
}