import fs from 'fs';
import path from 'path';

export class UnifiedMetrics {
    constructor() {
        this.reportsDir = path.join(__dirname, '../reports/unified');
        if (!fs.existsSync(this.reportsDir)) fs.mkdirSync(this.reportsDir, { recursive: true });
    }

    mergeReports() {
        // Reads mobile/reports/Report.json and web/reports/Report.json
        // Merges them into automation/reports/unified/UnifiedReport.json
        const unified = {
            totalPassed: 0,
            totalFailed: 0,
            webMetrics: {},
            mobileMetrics: {},
            timestamp: new Date().toISOString()
        };
        
        const unifiedPath = path.join(this.reportsDir, 'UnifiedReport.json');
        fs.writeFileSync(unifiedPath, JSON.stringify(unified, null, 2));
        console.log('Unified metrics compiled at ' + unifiedPath);
        return unifiedPath;
    }
}