import { ParallelConfiguration } from './ParallelConfiguration.js';
import { ExecutionMetrics } from './ExecutionMetrics.js';
import { DevicePool } from './DevicePool.js';
import { SessionManager } from './SessionManager.js';
import { ExecutionQueue } from './ExecutionQueue.js';
import { WorkerAllocator } from './WorkerAllocator.js';
import { WorkerManager } from './WorkerManager.js';
import { ExecutionHooks } from './ExecutionHooks.js';
import { ExecutionScheduler } from './ExecutionScheduler.js';
import { LoggerUtility as logger } from '../utilities/LoggerUtility.js';

export class ExecutionManager {
    constructor(configOverrides) {
        this.config = new ParallelConfiguration(configOverrides);
        this.metrics = new ExecutionMetrics();
        this.devicePool = new DevicePool();
        this.sessionManager = new SessionManager();
        this.queue = new ExecutionQueue();
        this.workerAllocator = new WorkerAllocator(this.config.workerCount);
        this.hooks = new ExecutionHooks();
        
        this.scheduler = new ExecutionScheduler(
            this.queue, 
            this.devicePool, 
            this.sessionManager, 
            this.workerAllocator, 
            this.metrics
        );

        // Bind the actual dispatch logic to the scheduler
        this.scheduler._dispatchJob = this._dispatchJob.bind(this);
        this.runningPromises = new Set();
    }

    async start() {
        logger.info('Starting Enterprise Parallel Execution Engine');
        await this.hooks.trigger('beforeSuite', { config: this.config });

        // Event loop pumping the scheduler
        while (this.queue.hasJobs() || this.runningPromises.size > 0) {
            const scheduled = await this.scheduler.scheduleNext();
            if (!scheduled) {
                // If queue has jobs but no workers/devices available, wait briefly
                await new Promise(r => setTimeout(r, 1000));
            }
        }

        await this.hooks.trigger('afterSuite', { metrics: this.metrics.getSummary() });
        logger.info('Execution completed. Metrics: ' + JSON.stringify(this.metrics.getSummary()));
        return this.metrics.getSummary();
    }

    async _dispatchJob(job, device, workerId) {
        const promise = (async () => {
            let session = null;
            try {
                session = await this.sessionManager.createSession(device);
                this.devicePool.markBusy(device.id, workerId, session.sessionId);
                
                await this.hooks.trigger('beforeWorker', { workerId, device });

                const worker = new WorkerManager(workerId, session.driver);
                const result = await worker.executeJob(job);
                
                this.metrics.recordResult(result.status === 'PASS');
                if (result.status === 'FAIL' && (job.retries || 0) < this.config.maxRetries) {
                    this.metrics.recordRetry();
                    job.retries = (job.retries || 0) + 1;
                    this.queue.enqueueRetry(job);
                }

                await this.hooks.trigger('afterWorker', { workerId, result });

            } catch (error) {
                logger.error(`Worker ${workerId} failed fatally: ${error.message}`);
                this.metrics.recordRecovery();
            } finally {
                if (session) await this.sessionManager.destroySession(session.sessionId);
                this.devicePool.release(device.id);
                this.workerAllocator.releaseWorker(workerId);
            }
        })();

        this.runningPromises.add(promise);
        promise.then(() => this.runningPromises.delete(promise));
    }
}