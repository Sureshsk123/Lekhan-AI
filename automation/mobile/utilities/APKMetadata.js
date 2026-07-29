import fs from 'fs';
import { execSync } from 'child_process';
import { logger } from './LoggerUtility.js';

export class APKMetadata {
    static extractMetadata(apkPath) {
        logger.info(`Extracting metadata for APK: ${apkPath}`);
        
        const metadata = {
            packageName: 'Unknown',
            versionName: 'Unknown',
            versionCode: 'Unknown',
            buildVariant: 'Unknown',
            fileSize: 'Unknown',
            lastModifiedDate: 'Unknown'
        };

        try {
            if (fs.existsSync(apkPath)) {
                const stats = fs.statSync(apkPath);
                metadata.fileSize = `${(stats.size / (1024 * 1024)).toFixed(2)} MB`;
                metadata.lastModifiedDate = stats.mtime.toISOString();
            }

            try {
                // Attempt to use aapt to extract android badging info
                const output = execSync(`aapt dump badging "${apkPath}"`, { stdio: 'pipe' }).toString();
                
                const packageMatch = output.match(/package: name='([^']+)'/);
                const versionCodeMatch = output.match(/versionCode='([^']+)'/);
                const versionNameMatch = output.match(/versionName='([^']+)'/);
                
                if (packageMatch) metadata.packageName = packageMatch[1];
                if (versionCodeMatch) metadata.versionCode = versionCodeMatch[1];
                if (versionNameMatch) metadata.versionName = versionNameMatch[1];

                // Heuristic for build variant based on file path
                const pathLower = apkPath.toLowerCase();
                if (pathLower.includes('debug')) metadata.buildVariant = 'debug';
                else if (pathLower.includes('release')) metadata.buildVariant = 'release';
                else if (pathLower.includes('staging')) metadata.buildVariant = 'staging';
                else if (pathLower.includes('qa')) metadata.buildVariant = 'qa';
                
            } catch (aaptError) {
                logger.warn('aapt tool is not available or failed. Metadata extraction limited.');
            }
        } catch (error) {
            logger.warn(`Failed to extract metadata: ${error.message}`);
        }

        return metadata;
    }
}
