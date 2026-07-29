export class ParallelConfiguration {
    constructor(overrides = {}) {
        this.workerCount = overrides.workerCount || parseInt(process.env.MAX_WORKERS, 10) || 4;
        this.maxRetries = overrides.maxRetries || 3;
        this.timeoutMs = overrides.timeoutMs || 120000;
        this.environment = overrides.environment || process.env.NODE_ENV || 'qa';
        this.tags = overrides.tags || [];
        this.deviceFilters = overrides.deviceFilters || { platform: 'Android' };
    }
}