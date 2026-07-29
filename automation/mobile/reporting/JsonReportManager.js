import fs from 'fs';
import path from 'path';

export class JsonReportManager {
    constructor(outputDir) {
        this.outputDir = outputDir;
    }

    async generate(aggregatedData) {
        const filePath = path.join(this.outputDir, 'Report.json');
        fs.writeFileSync(filePath, JSON.stringify(aggregatedData, null, 2));
        return filePath;
    }
}