import { DependencyChecker } from './DependencyChecker.js';
import { SystemDiagnostics } from './SystemDiagnostics.js';
import { ConfigReader } from './ConfigReader.js';
import { logger } from './LoggerUtility.js';

export class EnvironmentVerifier {
    static verifyEnvironment() {
        logger.info('=============================================');
        logger.info('   ENTERPRISE ENVIRONMENT VERIFICATION       ');
        logger.info('=============================================');

        const deps = DependencyChecker.checkDependencies();
        let hasFatalError = false;

        logger.info('\\n--- DEPENDENCY REPORT ---');
        Object.keys(deps).forEach(key => {
            const status = deps[key].status;
            const paddedKey = key.padEnd(15, '.');
            logger.info(`${paddedKey} ${status}`);
            
            if (status === 'FAILED') {
                logger.error(`[ERROR] ${key} is missing or failing: ${deps[key].error}`);
                if (['Node.js', 'Java', 'ADB', 'Appium', 'Android SDK'].includes(key)) {
                    hasFatalError = true;
                }
            }
        });

        logger.info('\\n--- SYSTEM DIAGNOSTICS ---');
        const diagnostics = SystemDiagnostics.generateDiagnostics();
        
        logger.info(`Operating System: ${diagnostics.osPlatform} ${diagnostics.osRelease}`);
        logger.info(`Available RAM:    ${diagnostics.availableRAM} / ${diagnostics.totalRAM}`);
        
        const config = ConfigReader.getConfig();
        if (!config.isRealDevice) {
            logger.info('\\n--- EMULATOR CHECKS ---');
            logger.info(`Target AVD:       ${config.deviceName}`);
        }

        logger.info('\\n--- ANDROID CHECKS ---');
        if (diagnostics.deviceConnected) {
            logger.info(`Device Online:    ${diagnostics.deviceStatus === 'device' ? 'PASS' : 'WARNING (' + diagnostics.deviceStatus + ')'}`);
            logger.info(`Android Version:  ${diagnostics.androidVersion}`);
            logger.info(`API Level:        ${diagnostics.apiLevel}`);
            logger.info(`Boot Completed:   ${diagnostics.bootCompleted ? 'PASS' : 'WARNING'}`);
            logger.info(`Screen Unlocked:  ${diagnostics.screenUnlocked ? 'PASS' : 'WARNING'}`);
            
            if (diagnostics.deviceStatus === 'unauthorized') {
                logger.error('[ERROR] Device unauthorized. Please accept the RSA prompt on the device.');
                hasFatalError = true;
            }
        } else {
            logger.warn(`[WARNING] No devices currently connected. Emulator boot may be required.`);
        }

        logger.info('=============================================\\n');

        if (hasFatalError) {
            throw new Error('Environment Verification Failed: Critical dependencies missing or device unauthorized. Check logs for details.');
        }

        return diagnostics;
    }
}
