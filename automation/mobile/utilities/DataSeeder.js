import fs from 'fs';
import path from 'path';

export class DataSeeder {
    constructor(dataDir) {
        this.dataDir = dataDir;
    }

    loadDataset(category, filename) {
        const filePath = path.join(this.dataDir, category, filename);
        if (!fs.existsSync(filePath)) throw new Error(`Dataset not found: ${filePath}`);
        return JSON.parse(fs.readFileSync(filePath, 'utf8'));
    }

    loadSchema(schemaName) {
        const filePath = path.join(this.dataDir, 'schemas', schemaName);
        if (!fs.existsSync(filePath)) throw new Error(`Schema not found: ${filePath}`);
        return JSON.parse(fs.readFileSync(filePath, 'utf8'));
    }
}