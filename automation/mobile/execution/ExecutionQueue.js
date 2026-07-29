export class ExecutionQueue {
    constructor() {
        this.queue = [];
        this.retryQueue = [];
    }

    enqueue(testJob) {
        this.queue.push(testJob);
        // Sort by priority if needed
        this.queue.sort((a, b) => (b.priority || 0) - (a.priority || 0));
    }

    enqueueRetry(testJob) {
        this.retryQueue.push(testJob);
    }

    dequeue() {
        if (this.retryQueue.length > 0) return this.retryQueue.shift();
        return this.queue.shift();
    }

    hasJobs() {
        return this.queue.length > 0 || this.retryQueue.length > 0;
    }
}