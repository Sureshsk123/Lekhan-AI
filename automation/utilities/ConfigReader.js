import fs from 'fs';
import path from 'path';
import { logger } from './LoggerUtility.js';

export class ConfigReader {
    static getConfig(env) {
        try {
            const configPath = path.resolve(process.cwd(), `config/${env}.json`);
            if (!fs.existsSync(configPath)) {
                throw new Error(`Configuration file not found for environment: ${env}`);
            }
            const fileContents = fs.readFileSync(configPath, 'utf8');
            return JSON.parse(fileContents);
        } catch (error) {
            logger.error(`Error reading config for env ${env}: ${error.message}`);
            throw error;
        }
    }
}
