import fs from 'fs';
import path from 'path';
import { logger } from './LoggerUtility.js';

export class ConfigReader {
    static getConfig(env) {
        try {
            const envConfigPath = path.resolve(process.cwd(), `config/${env}.json`);
            const globalConfigPath = path.resolve(process.cwd(), 'config/config.json');
            
            let config = {};
            
            if (fs.existsSync(globalConfigPath)) {
                const globalConfig = JSON.parse(fs.readFileSync(globalConfigPath, 'utf8'));
                config = { ...config, ...globalConfig };
            }
            
            if (fs.existsSync(envConfigPath)) {
                const envConfig = JSON.parse(fs.readFileSync(envConfigPath, 'utf8'));
                config = { ...config, ...envConfig };
            }
            
            if (!fs.existsSync(envConfigPath) && !fs.existsSync(globalConfigPath)) {
                throw new Error(`Configuration files not found`);
            }
            
            return config;
        } catch (error) {
            logger.error(`Error reading config for env ${env}: ${error.message}`);
            throw error;
        }
    }
}
