import { FlowManager } from '../flows/FlowManager.js';
import { CompatibilityManager } from '../drivers/CompatibilityManager.js';
import { LoggerUtility as logger } from '../utilities/LoggerUtility.js';

export class WorkerManager {
    constructor(workerId, sessionDriver) {
        this.workerId = workerId;
        this.driver = sessionDriver;
        
        // Zero shared state - fully isolated instances
        this.compatibilityManager = new CompatibilityManager(this.driver);
        this.flowManager = new FlowManager(this.driver);
    }

    async executeJob(job) {
        logger.info(`[Worker ${this.workerId}] Executing job: ${job.name}`);
        try {
            await this.compatibilityManager.initialize();
            await job.execute(this);
            return { status: 'PASS' };
        } catch (error) {
            logger.error(`[Worker ${this.workerId}] Job failed: ${error.message}`);
            return { status: 'FAIL', error };
        }
    }
}