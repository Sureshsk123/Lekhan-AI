export class WorkerAllocator {
    constructor(maxWorkers) {
        this.maxWorkers = maxWorkers;
        this.activeWorkers = new Set();
    }

    canAllocate() {
        return this.activeWorkers.size < this.maxWorkers;
    }

    allocateWorker(workerId) {
        if (!this.canAllocate()) throw new Error('Worker pool exhausted');
        this.activeWorkers.add(workerId);
    }

    releaseWorker(workerId) {
        this.activeWorkers.delete(workerId);
    }
}