import fs from 'fs';
import path from 'path';

export class EnvironmentDataResolver {
    constructor(dataDir) {
        this.dataDir = dataDir;
        this.env = process.env.NODE_ENV || 'development';
    }

    resolveEnvConfig() {
        const envFile = path.join(this.dataDir, 'environments', `${this.env}.json`);
        if (fs.existsSync(envFile)) {
            return JSON.parse(fs.readFileSync(envFile, 'utf8'));
        }
        return {};
    }
}