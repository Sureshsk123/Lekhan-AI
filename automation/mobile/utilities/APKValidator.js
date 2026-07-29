import fs from 'fs';
import { logger } from './LoggerUtility.js';
import { APKMetadata } from './APKMetadata.js';

export class APKValidator {
    static validateAPK(apkPath, expectedVariant = null) {
        logger.info(`Validating APK at: ${apkPath}`);

        const result = {
            isValid: false,
            message: ''
        };

        try {
            if (!apkPath) {
                result.message = 'APK path is undefined or null.';
                return result;
            }

            if (!fs.existsSync(apkPath)) {
                result.message = 'APK does not exist at the specified path.';
                return result;
            }

            if (!apkPath.toLowerCase().endsWith('.apk')) {
                result.message = 'File extension is not .apk.';
                return result;
            }

            const stats = fs.statSync(apkPath);
            if (stats.size === 0) {
                result.message = 'APK file size is 0 bytes (corrupted).';
                return result;
            }

            try {
                fs.accessSync(apkPath, fs.constants.R_OK);
            } catch (err) {
                result.message = 'APK file lacks read permissions.';
                return result;
            }

            if (expectedVariant) {
                const metadata = APKMetadata.extractMetadata(apkPath);
                if (metadata.buildVariant !== 'Unknown' && metadata.buildVariant !== expectedVariant) {
                    result.message = `Build variant mismatch. Expected: ${expectedVariant}, Found: ${metadata.buildVariant}`;
                    return result;
                }
            }

            result.isValid = true;
            result.message = 'APK Validation Successful';
            logger.info(result.message);

        } catch (error) {
            result.message = `Validation encountered a fatal error: ${error.message}`;
            logger.error(result.message);
        }

        return result;
    }
}
