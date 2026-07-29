import ExcelJS from 'exceljs';
import path from 'path';

export class ExcelReportManager {
    constructor(outputDir) {
        this.outputDir = outputDir;
    }

    async generate(aggregatedData) {
        const workbook = new ExcelJS.Workbook();
        workbook.creator = 'Enterprise Automation Framework';
        
        const summarySheet = workbook.addWorksheet('Summary');
        summarySheet.addRow(['Metric', 'Value']);
        summarySheet.addRow(['Total Tests', aggregatedData.totalTests]);
        summarySheet.addRow(['Passed', aggregatedData.passed]);
        summarySheet.addRow(['Failed', aggregatedData.failed]);
        
        const resultsSheet = workbook.addWorksheet('Results');
        resultsSheet.addRow(['Test Name', 'Status', 'Duration (ms)', 'Worker ID', 'Retries', 'Recovery Events']);
        
        for (const res of aggregatedData.results) {
            resultsSheet.addRow([
                res.testName, 
                res.status, 
                res.duration, 
                res.workerId, 
                res.retries || 0,
                res.recoveryEvents || 0
            ]);
        }
        
        const filePath = path.join(this.outputDir, 'ExecutionReport.xlsx');
        await workbook.xlsx.writeFile(filePath);
        return filePath;
    }
}