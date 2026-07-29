import fs from 'fs';
import path from 'path';

export class HtmlReportManager {
    constructor(outputDir) {
        this.outputDir = outputDir;
    }

    async generate(aggregatedData) {
        // Simple HTML generation logic
        const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Enterprise Automation Report</title>
            <style>body { font-family: sans-serif; } .pass { color: green; } .fail { color: red; }</style>
        </head>
        <body>
            <h1>Test Execution Report</h1>
            <p>Total: ${aggregatedData.totalTests} | Passed: <span class="pass">${aggregatedData.passed}</span> | Failed: <span class="fail">${aggregatedData.failed}</span></p>
            <table border="1">
                <tr><th>Test Name</th><th>Status</th><th>Worker ID</th><th>Duration</th></tr>
                ${aggregatedData.results.map(r => 
                    `<tr><td>${r.testName}</td><td class="${r.status.toLowerCase()}">${r.status}</td><td>${r.workerId}</td><td>${r.duration}ms</td></tr>`
                ).join('')}
            </table>
        </body>
        </html>
        `;
        
        const filePath = path.join(this.outputDir, 'Report.html');
        fs.writeFileSync(filePath, html);
        return filePath;
    }
}