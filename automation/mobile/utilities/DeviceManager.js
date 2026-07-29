import { exec } from 'child_process';
import { logger } from './LoggerUtility.js';
import { ConfigReader } from './ConfigReader.js';

export class DeviceManager {
    static async startEmulator() {
        const config = ConfigReader.getConfig();
        
        if (config.isRealDevice) {
            logger.info('Real device specified, skipping emulator startup.');
            return;
        }

        const deviceName = config.deviceName;
        const headlessFlag = config.headless ? '-no-window' : '';

        logger.info(`Checking if emulator ${deviceName} is already running...`);
        
        return new Promise((resolve, reject) => {
            exec('adb devices', (error, stdout) => {
                if (stdout.includes('emulator-')) {
                    logger.info('An emulator is already running.');
                    resolve();
                    return;
                }
                
                logger.info(`Starting emulator: ${deviceName} ${headlessFlag}`);
                const process = exec(`emulator -avd ${deviceName} ${headlessFlag} -no-snapshot -no-boot-anim`);
                
                // Wait for emulator to be online
                const waitForDevice = exec('adb wait-for-device');
                waitForDevice.on('exit', () => {
                    logger.info('Emulator is online. Waiting for boot complete...');
                    // Add an arbitrary wait or check sys.boot_completed
                    setTimeout(() => {
                        logger.info('Emulator boot presumed complete.');
                        resolve();
                    }, 15000);
                });
                
                process.on('error', (err) => {
                    logger.error(`Failed to start emulator: ${err.message}`);
                    reject(err);
                });
            });
        });
    }
}
