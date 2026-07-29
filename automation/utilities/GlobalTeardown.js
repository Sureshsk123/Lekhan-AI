import { ExcelReportManager } from './ExcelReportManager.js';
import { MochawesomeManager } from './MochawesomeManager.js';
import { logger } from './LoggerUtility.js';

export async function mochaGlobalTeardown() {
    try {
        logger.info('Executing mochaGlobalTeardown hook...');
        await ExcelReportManager.generateReport();
        await MochawesomeManager.generateFinalReport();
    } catch (error) {
        logger.error(`Error during global teardown: ${error.message}`);
    }
}
