import { logger } from './LoggerUtility.js';

export class RetryUtility {
    static async retryBlock(action, retries = 3, delay = 1000) {
        for (let i = 0; i < retries; i++) {
            try {
                return await action();
            } catch (error) {
                logger.warn(`Action failed on attempt ${i + 1}/${retries}: ${error.message}`);
                if (i === retries - 1) throw error;
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }
    }
}
