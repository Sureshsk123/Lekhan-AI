import ExcelJS from 'exceljs';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { execSync } from 'child_process';
import { envManager } from './EnvironmentManager.js';
import { logger } from './LoggerUtility.js';
import { CONSTANTS } from './Constants.js';

export class ExcelReportManager {
    static async generateReport() {
        try {
            logger.info('Starting Enterprise Excel Report Generation...');
            const reportsDir = path.resolve(process.cwd(), 'reports');
            const browser = envManager.getBrowser().toLowerCase();
            const browserReportsDir = path.join(reportsDir, browser);

            if (!fs.existsSync(browserReportsDir)) {
                logger.warn(`No JSON reports found in ${browserReportsDir}. Skipping Excel report.`);
                return;
            }

            const files = fs.readdirSync(browserReportsDir).filter(f => f.endsWith('.json'));
            if (files.length === 0) {
                logger.warn(`No JSON reports found in ${browserReportsDir}. Skipping Excel report.`);
                return;
            }

            let totalTests = 0;
            let passed = 0;
            let failed = 0;
            let skipped = 0;
            let totalDuration = 0;
            let executionStart = null;
            let executionEnd = null;

            const passedTests = [];
            const failedTests = [];
            const skippedTests = [];
            const processedTests = new Set();
            const allDurations = [];

            files.forEach(file => {
                const filePath = path.join(browserReportsDir, file);
                const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
                
                const start = new Date(data.stats.start);
                const end = new Date(data.stats.end);
                if (!executionStart || start < executionStart) executionStart = start;
                if (!executionEnd || end > executionEnd) executionEnd = end;
                
                const parseSuite = (suite) => {
                    suite.tests.forEach(test => {
                        // Prevent duplicate parsing if workers generated overlapping data
                        if (processedTests.has(test.uuid)) return;
                        processedTests.add(test.uuid);
                        
                        totalTests++;
                        totalDuration += test.duration || 0;
                        if (test.duration) allDurations.push({ name: test.title, duration: test.duration });
                        
                        let workerId = '0';
                        if (test.context) {
                            try {
                                const parsedCtx = typeof test.context === 'string' && test.context.startsWith('[') ? JSON.parse(test.context) : test.context;
                                const ctxArray = Array.isArray(parsedCtx) ? parsedCtx : [parsedCtx];
                                const workerCtx = ctxArray.find(c => c.title === 'Worker ID');
                                if (workerCtx) workerId = workerCtx.value;
                            } catch (e) {}
                        }

                        const testData = {
                            testName: test.title,
                            suite: suite.title,
                            browser: browser,
                            executionTime: test.duration || 0,
                            status: test.state || (test.pending ? 'skipped' : 'unknown'),
                            timestamp: start.toISOString(),
                            errorMessage: test.err?.message || '',
                            stackTrace: test.err?.estack || '',
                            screenshotPath: { text: 'View Screenshot', hyperlink: `../../screenshots/${browser}/${test.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.png` },
                            consoleLogPath: { text: 'View Log', hyperlink: `../../logs/${browser}/automation-worker-${workerId}.log` },
                            mochawesomeHtml: { text: 'View HTML Report', hyperlink: './mochawesome.html' },
                            currentUrl: 'Logged in Console',
                            reason: 'Skipped by Mocha'
                        };
                        
                        if (test.state === 'passed') {
                            passed++;
                            passedTests.push(testData);
                        } else if (test.state === 'failed') {
                            failed++;
                            failedTests.push(testData);
                        } else if (test.pending) {
                            skipped++;
                            skippedTests.push(testData);
                        }
                    });
                    
                    suite.suites.forEach(parseSuite);
                };
                
                data.results.forEach(parseSuite);
            });

            // Calculate Performance Metrics
            let avgTime = 0;
            let fastestTest = { name: 'N/A', duration: 0 };
            let slowestTest = { name: 'N/A', duration: 0 };
            
            if (allDurations.length > 0) {
                allDurations.sort((a, b) => a.duration - b.duration);
                fastestTest = allDurations[0];
                slowestTest = allDurations[allDurations.length - 1];
                avgTime = totalDuration / allDurations.length;
            }

            const workbook = new ExcelJS.Workbook();
            workbook.creator = 'Lekhan Automation';
            workbook.created = new Date();

            // Sheet 1: Execution Summary
            const sheet1 = workbook.addWorksheet('Execution Summary');
            const passPercentage = totalTests > 0 ? ((passed / totalTests) * 100).toFixed(2) + '%' : '0%';
            
            // Read config.json
            let config = {};
            const configPath = path.resolve(process.cwd(), 'config/config.json');
            if (fs.existsSync(configPath)) {
                config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
            }

            const summaryData = [
                ['Metric', 'Value'],
                ['Execution ID', `EXEC-${Date.now()}`],
                ['Execution Date', new Date().toISOString().split('T')[0]],
                ['Environment', process.env.NODE_ENV || CONSTANTS.ENVIRONMENTS.DEV],
                ['Browser', browser],
                ['Headless Mode', config.headless ? 'Yes' : 'No'],
                ['Parallel Mode', config.parallel ? 'Yes' : 'No'],
                ['Worker Count', config.workers || 1],
                ['Total Tests', totalTests],
                ['Passed', passed],
                ['Failed', failed],
                ['Skipped', skipped],
                ['Pass Percentage', passPercentage],
                ['Execution Start', executionStart ? executionStart.toISOString() : 'N/A'],
                ['Execution End', executionEnd ? executionEnd.toISOString() : 'N/A'],
                ['Total Duration', `${(totalDuration / 1000).toFixed(2)}s`]
            ];
            sheet1.addRows(summaryData);
            sheet1.getColumn(1).width = 25;
            sheet1.getColumn(2).width = 40;
            sheet1.getRow(1).font = { bold: true };

            // Sheet 2: Passed Tests
            const sheet2 = workbook.addWorksheet('Passed Tests');
            sheet2.columns = [
                { header: 'Test Name', key: 'testName', width: 40 },
                { header: 'Suite', key: 'suite', width: 30 },
                { header: 'Browser', key: 'browser', width: 15 },
                { header: 'Execution Time (ms)', key: 'executionTime', width: 20 },
                { header: 'Status', key: 'status', width: 15 },
                { header: 'Timestamp', key: 'timestamp', width: 25 },
                { header: 'Report Link', key: 'mochawesomeHtml', width: 20 }
            ];
            sheet2.getRow(1).font = { bold: true };
            passedTests.forEach(t => sheet2.addRow(t));

            // Sheet 3: Failed Tests
            const sheet3 = workbook.addWorksheet('Failed Tests');
            sheet3.columns = [
                { header: 'Test Name', key: 'testName', width: 40 },
                { header: 'Suite', key: 'suite', width: 30 },
                { header: 'Browser', key: 'browser', width: 15 },
                { header: 'Error Message', key: 'errorMessage', width: 50 },
                { header: 'Stack Trace', key: 'stackTrace', width: 50 },
                { header: 'Screenshot Path', key: 'screenshotPath', width: 40 },
                { header: 'Console Log Path', key: 'consoleLogPath', width: 40 },
                { header: 'Current URL', key: 'currentUrl', width: 40 },
                { header: 'Timestamp', key: 'timestamp', width: 25 },
                { header: 'Report Link', key: 'mochawesomeHtml', width: 20 }
            ];
            sheet3.getRow(1).font = { bold: true };
            failedTests.forEach(t => sheet3.addRow(t));

            // Sheet 4: Skipped Tests
            const sheet4 = workbook.addWorksheet('Skipped Tests');
            sheet4.columns = [
                { header: 'Test Name', key: 'testName', width: 40 },
                { header: 'Reason', key: 'reason', width: 30 },
                { header: 'Suite', key: 'suite', width: 30 },
                { header: 'Browser', key: 'browser', width: 15 },
                { header: 'Timestamp', key: 'timestamp', width: 25 },
                { header: 'Report Link', key: 'mochawesomeHtml', width: 20 }
            ];
            sheet4.getRow(1).font = { bold: true };
            skippedTests.forEach(t => sheet4.addRow(t));

            // Sheet 5: Environment Information
            const sheet5 = workbook.addWorksheet('Environment Information');
            
            const pkgPath = path.resolve(process.cwd(), 'package.json');
            const pkg = fs.existsSync(pkgPath) ? JSON.parse(fs.readFileSync(pkgPath, 'utf8')) : {};
            const frameworkVersion = pkg.version || 'Unknown';
            const seleniumVersion = (pkg.dependencies && pkg.dependencies['selenium-webdriver']) ? pkg.dependencies['selenium-webdriver'] : 'Unknown';
            
            let gitBranch = 'N/A';
            let gitCommit = 'N/A';
            try {
                gitBranch = execSync('git rev-parse --abbrev-ref HEAD').toString().trim();
                gitCommit = execSync('git rev-parse --short HEAD').toString().trim();
            } catch (e) {}

            const envData = [
                ['Attribute', 'Value'],
                ['Operating System', `${os.type()} ${os.release()} ${os.arch()}`],
                ['Node Version', process.version],
                ['Selenium Version', seleniumVersion],
                ['Chrome Version', 'Available via Driver'],
                ['Firefox Version', 'Available via Driver'],
                ['Edge Version', 'Available via Driver'],
                ['Framework Version', frameworkVersion],
                ['Git Branch', gitBranch],
                ['Git Commit', gitCommit]
            ];
            sheet5.addRows(envData);
            sheet5.getColumn(1).width = 25;
            sheet5.getColumn(2).width = 40;
            sheet5.getRow(1).font = { bold: true };

            // Sheet 6: Performance Metrics
            const sheet6 = workbook.addWorksheet('Performance Metrics');
            const perfData = [
                ['Metric', 'Value'],
                ['Average Test Time', `${avgTime.toFixed(2)} ms`],
                ['Slowest Test', `${slowestTest.name} (${slowestTest.duration} ms)`],
                ['Fastest Test', `${fastestTest.name} (${fastestTest.duration} ms)`],
                ['Browser Distribution', `100% ${browser}`],
                ['Failure Distribution', failed > 0 ? `${((failed / totalTests) * 100).toFixed(2)}% of total` : '0%'],
                ['Execution Timeline', executionStart && executionEnd ? `${executionStart.toLocaleTimeString()} to ${executionEnd.toLocaleTimeString()}` : 'N/A']
            ];
            sheet6.addRows(perfData);
            sheet6.getColumn(1).width = 25;
            sheet6.getColumn(2).width = 40;
            sheet6.getRow(1).font = { bold: true };

            // Sheet 7: Run Metadata
            const runMetadataSheet = workbook.addWorksheet('Run Metadata');
            
            const executionId = `EXEC-${Date.now()}`;
            const executionDate = new Date().toISOString().split('T')[0];
            const executionStartTimeStr = executionStart ? executionStart.toISOString() : 'N/A';
            const executionEndTimeStr = executionEnd ? executionEnd.toISOString() : 'N/A';
            let machineName = 'N/A';
            let username = 'N/A';
            try {
                machineName = os.hostname();
                username = os.userInfo().username || 'N/A';
            } catch (e) {}
            
            const operatingSystem = `${os.type()} ${os.release()} ${os.arch()}`;
            
            let trigger = 'Local';
            if (process.env.GITHUB_ACTIONS) {
                trigger = 'GitHub Actions';
            } else if (process.env.CI) {
                trigger = 'CI';
            }

            const mochaVersion = (pkg.dependencies && pkg.dependencies['mocha']) || (pkg.devDependencies && pkg.devDependencies['mocha']) || 'N/A';
            const mochawesomeVersion = (pkg.dependencies && pkg.dependencies['mochawesome']) || (pkg.devDependencies && pkg.devDependencies['mochawesome']) || 'N/A';
            const reportVersion = '1.0.0';

            const runMetadataData = [
                ['Field', 'Value'],
                ['Execution ID', executionId],
                ['Execution Date', executionDate],
                ['Execution Start Time', executionStartTimeStr],
                ['Execution End Time', executionEndTimeStr],
                ['Machine Name', machineName],
                ['Operating System', operatingSystem],
                ['Username', username],
                ['Trigger', trigger],
                ['Browser', browser],
                ['Headless Mode', config.headless ? 'Yes' : 'No'],
                ['Parallel Mode', config.parallel ? 'Yes' : 'No'],
                ['Worker Count', config.workers || 1],
                ['Environment', process.env.NODE_ENV || CONSTANTS.ENVIRONMENTS.DEV],
                ['Framework Version', frameworkVersion],
                ['Report Version', reportVersion],
                ['Git Branch', gitBranch],
                ['Git Commit Hash', gitCommit],
                ['Node.js Version', process.version],
                ['Selenium Version', seleniumVersion],
                ['Mocha Version', mochaVersion],
                ['Mochawesome Version', mochawesomeVersion]
            ];

            runMetadataSheet.addRows(runMetadataData);
            runMetadataSheet.getColumn(1).width = 30;
            runMetadataSheet.getColumn(2).width = 50;
            runMetadataSheet.getRow(1).font = { bold: true };

            // Save Workbook
            const reportFile = path.join(reportsDir, 'E2E_Report.xlsx');
            await workbook.xlsx.writeFile(reportFile);
            logger.info(`Enterprise Excel Report generated successfully at: ${reportFile}`);
        } catch (error) {
            logger.error(`Failed to generate Excel Report: ${error.message}`);
        }
    }
}
