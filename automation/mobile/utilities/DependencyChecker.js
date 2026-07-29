import { execSync } from 'child_process';
import { logger } from './LoggerUtility.js';

export class DependencyChecker {
    static execCommand(command) {
        try {
            return {
                output: execSync(command, { stdio: 'pipe' }).toString().trim(),
                status: 'PASS'
            };
        } catch (error) {
            return {
                output: null,
                status: 'FAILED',
                error: error.message
            };
        }
    }

    static checkDependencies() {
        logger.info('Verifying system dependencies...');
        const results = {
            'Node.js': this.execCommand('node -v'),
            'npm': this.execCommand('npm -v'),
            'Java': this.execCommand('java -version 2>&1'),
            'ADB': this.execCommand('adb version'),
            'AAPT': this.execCommand('aapt v'),
            'Appium': this.execCommand('npx appium -v'),
            'Emulator': this.execCommand('emulator -version')
        };

        // Environment Variable Checks
        const androidHome = process.env.ANDROID_HOME || process.env.ANDROID_SDK_ROOT;
        results['Android SDK'] = androidHome ? 
            { output: androidHome, status: 'PASS' } : 
            { output: null, status: 'FAILED', error: 'ANDROID_HOME missing' };

        // Post-process the output for cleaner version strings
        Object.keys(results).forEach(key => {
            if (results[key].status === 'PASS' && results[key].output) {
                const output = results[key].output.split('\n')[0];
                results[key].version = output.length > 50 ? `${output.substring(0, 50)}...` : output;
            } else {
                results[key].version = 'Unknown';
            }
        });

        return results;
    }
}
