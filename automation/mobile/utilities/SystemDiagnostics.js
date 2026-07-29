import os from 'os';
import { execSync } from 'child_process';
import { logger } from './LoggerUtility.js';

export class SystemDiagnostics {
    static getProp(propName) {
        try {
            return execSync(`adb shell getprop ${propName}`, { stdio: 'pipe' }).toString().trim();
        } catch (error) {
            return 'Unknown';
        }
    }

    static checkDeviceStatus() {
        try {
            const devicesOutput = execSync('adb devices', { stdio: 'pipe' }).toString();
            const lines = devicesOutput.split('\n').slice(1).filter(line => line.trim().length > 0);
            
            if (lines.length === 0) {
                return { connected: false, status: 'None' };
            }

            const deviceLine = lines[0].split('\\t');
            const status = deviceLine.length > 1 ? deviceLine[1].trim() : 'Unknown';
            
            return {
                connected: true,
                status: status,
                name: deviceLine[0].trim()
            };
        } catch (error) {
            return { connected: false, status: 'Error' };
        }
    }

    static generateDiagnostics() {
        logger.info('Generating System Diagnostics...');

        const totalRAM = os.totalmem();
        const freeRAM = os.freemem();
        
        // Convert to GB
        const totalGB = (totalRAM / 1073741824).toFixed(2);
        const freeGB = (freeRAM / 1073741824).toFixed(2);

        const deviceStatus = this.checkDeviceStatus();
        let androidVersion = 'Unknown';
        let apiLevel = 'Unknown';
        let bootCompleted = 'Unknown';
        let screenUnlocked = 'Unknown';

        if (deviceStatus.connected && deviceStatus.status === 'device') {
            androidVersion = this.getProp('ro.build.version.release');
            apiLevel = this.getProp('ro.build.version.sdk');
            bootCompleted = this.getProp('sys.boot_completed');
            
            try {
                const mFocusedWindow = execSync('adb shell dumpsys window | grep mCurrentFocus', { stdio: 'pipe' }).toString();
                screenUnlocked = !mFocusedWindow.includes('Keyguard') ? '1' : '0';
            } catch (e) {
                screenUnlocked = 'Unknown';
            }
        }

        return {
            osPlatform: os.platform(),
            osRelease: os.release(),
            totalRAM: `${totalGB} GB`,
            availableRAM: `${freeGB} GB`,
            deviceConnected: deviceStatus.connected,
            deviceStatus: deviceStatus.status,
            deviceName: deviceStatus.name || 'None',
            androidVersion: androidVersion,
            apiLevel: apiLevel,
            bootCompleted: bootCompleted === '1',
            screenUnlocked: screenUnlocked === '1',
            timestamp: new Date().toISOString()
        };
    }
}
