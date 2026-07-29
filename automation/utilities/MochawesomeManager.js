import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';
import { envManager } from './EnvironmentManager.js';
import { CONSTANTS } from './Constants.js';
import { logger } from './LoggerUtility.js';

const require = createRequire(import.meta.url);
const addContext = require('mochawesome/addContext');
const { merge } = require('mochawesome-merge');
const marge = require('mochawesome-report-generator');

export class MochawesomeManager {
    static async addTestContext(testContext, data) {
        try {
            const browser = envManager.getBrowser().toLowerCase();
            const env = process.env.NODE_ENV || CONSTANTS.ENVIRONMENTS.DEV;
            const workerId = process.env.MOCHA_WORKER_ID || '0';
            
            // Basic Metadata
            addContext(testContext, { title: 'Browser', value: browser });
            addContext(testContext, { title: 'Environment', value: env.toUpperCase() });
            addContext(testContext, { title: 'Worker ID', value: workerId });
            addContext(testContext, { title: 'Execution ID', value: `EXEC-${new Date().toISOString().split('T')[0]}` });
            addContext(testContext, { title: 'Timestamp', value: new Date().toISOString() });
            
            if (testContext.currentTest?.duration) {
                addContext(testContext, { title: 'Execution Duration', value: `${testContext.currentTest.duration} ms` });
            }

            addContext(testContext, { title: 'Excel Report', value: `../../reports/E2E_Report.xlsx` });
            addContext(testContext, { title: 'Log File', value: `../../logs/${browser}/automation-worker-${workerId}.log` });

            if (data.retryHistory) {
                addContext(testContext, { title: 'Retry History', value: data.retryHistory });
            }
            if (data.retryCount !== undefined) {
                addContext(testContext, { title: 'Retry Count', value: data.retryCount.toString() });
            }
            if (data.browserVersion) {
                addContext(testContext, { title: 'Browser Version', value: data.browserVersion });
            }
            if (data.seleniumVersion) {
                addContext(testContext, { title: 'Selenium Version', value: data.seleniumVersion });
            }

            // Failure specifics
            if (testContext.currentTest?.state === 'failed') {
                if (data.currentUrl) {
                    addContext(testContext, { title: 'Current URL', value: data.currentUrl });
                }
                
                // Stack trace is usually automatically captured by Mochawesome, but we can enforce it.
                if (testContext.currentTest.err) {
                     addContext(testContext, { title: 'Stack Trace', value: testContext.currentTest.err.stack });
                }

                if (data.logs && data.logs.length > 0) {
                    const formattedLogs = data.logs.map(log => `[${log.level.name}] ${log.message}`).join('\n');
                    addContext(testContext, { title: 'Browser Console Logs', value: formattedLogs });
                }
                if (data.base64Image) {
                    addContext(testContext, { title: 'Screenshot Inline', value: 'data:image/png;base64,' + data.base64Image });
                }
                if (data.screenshotPath) {
                    addContext(testContext, { title: 'Screenshot Path', value: data.screenshotPath });
                }
                if (data.failureTimestamp) {
                    addContext(testContext, { title: 'Failure Timestamp', value: data.failureTimestamp });
                }
            }
        } catch (error) {
            logger.error(`Error adding context to Mochawesome: ${error.message}`);
        }
    }

    static async generateFinalReport() {
        try {
            logger.info('Starting Final Mochawesome Report Generation...');
            const browser = envManager.getBrowser().toLowerCase();
            const reportsDir = path.resolve(process.cwd(), `reports/${browser}`);
            
            if (!fs.existsSync(reportsDir)) {
                logger.warn('No reports directory found. Skipping Mochawesome final generation.');
                return;
            }

            const jsonFiles = fs.readdirSync(reportsDir).filter(f => f.endsWith('.json'));
            if (jsonFiles.length === 0) {
                logger.warn('No JSON files found. Skipping Mochawesome final generation.');
                return;
            }

            // Merge all JSON files
            const mergedJson = await merge({
                files: [`reports/${browser}/*.json`]
            });

            // Group failures by category
            this.groupFailures(mergedJson);

            const env = process.env.NODE_ENV || CONSTANTS.ENVIRONMENTS.DEV;

            // Inject HTML Badges into test titles
            const injectBadges = (suite) => {
                suite.tests.forEach(test => {
                    const statusClass = test.pass ? '#28a745' : test.fail ? '#dc3545' : '#ffc107';
                    let badges = `<span style="background:${statusClass}; padding: 3px 6px; border-radius: 4px; color: white; margin-right: 5px; font-size: 11px;">${test.pass ? 'Passed' : test.fail ? 'Failed' : 'Skipped'}</span>`;
                    badges += `<span style="background:#007bff; padding: 3px 6px; border-radius: 4px; color: white; margin-right: 5px; font-size: 11px;">${browser.toUpperCase()}</span>`;
                    
                    let workerId = '0';
                    if (test.context) {
                        try {
                            const parsedCtx = typeof test.context === 'string' && test.context.startsWith('[') ? JSON.parse(test.context) : test.context;
                            const ctxArray = Array.isArray(parsedCtx) ? parsedCtx : [parsedCtx];
                            const workerCtx = ctxArray.find(c => c.title === 'Worker ID');
                            if (workerCtx) workerId = workerCtx.value;
                        } catch (e) {}
                    }
                    badges += `<span style="background:#6c757d; padding: 3px 6px; border-radius: 4px; color: white; margin-right: 5px; font-size: 11px;">Worker ${workerId}</span>`;
                    badges += `<span style="background:#17a2b8; padding: 3px 6px; border-radius: 4px; color: white; margin-right: 5px; font-size: 11px;">${env.toUpperCase()}</span>`;
                    test.title = `${badges} ${test.title}`;
                });
                suite.suites.forEach(injectBadges);
            };
            mergedJson.results.forEach(injectBadges);

            // Calculate Pass Percentage
            const total = mergedJson.stats.tests;
            const passed = mergedJson.stats.passes;
            const passPercent = total > 0 ? ((passed / total) * 100).toFixed(1) : 0;

            // Optional: You can create custom CSS in the dir if you want specific styling
            const cssContent = `
            .navbar { background-color: #2c3e50 !important; }
            .navbar-brand { color: #18bc9c !important; font-weight: bold; }
            `;
            const assetsDir = path.join(reportsDir, 'assets');
            if (!fs.existsSync(assetsDir)) {
                fs.mkdirSync(assetsDir);
            }
            fs.writeFileSync(path.join(assetsDir, 'custom.css'), cssContent);

            // Generate HTML using Marge
            const reportPaths = await marge.create(mergedJson, {
                reportDir: reportsDir,
                reportTitle: `Enterprise Selenium Automation Framework`,
                reportPageTitle: 'Automation Execution Report',
                inlineAssets: true,
                charts: true,
                enableCode: true
            });
            const htmlFile = Array.isArray(reportPaths) ? reportPaths[0] : reportPaths;

            if (htmlFile && fs.existsSync(htmlFile)) {
                let htmlContent = fs.readFileSync(htmlFile, 'utf8');
                const pkgPath = path.resolve(process.cwd(), 'package.json');
                const pkg = fs.existsSync(pkgPath) ? JSON.parse(fs.readFileSync(pkgPath, 'utf8')) : {};
                const fwkVersion = pkg.version || 'Unknown';

                const dashboardHtml = `
                <div id="enterprise-dashboard" style="padding: 20px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background: #f8f9fa; border-bottom: 2px solid #dee2e6;">
                    <h2 style="color: #2c3e50; margin-top: 0;">Enterprise Selenium Automation Framework <span style="font-size: 14px; background: #6c757d; color: white; padding: 3px 8px; border-radius: 12px; vertical-align: middle;">v${fwkVersion}</span></h2>
                    <p style="color: #6c757d; font-size: 14px;">Execution ID: EXEC-${new Date().toISOString().split('T')[0]}</p>
                    <div style="display: flex; flex-wrap: wrap; gap: 15px; margin-top: 20px;">
                        <div style="background: white; border: 1px solid #dee2e6; border-radius: 5px; padding: 15px; flex: 1; min-width: 200px; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
                            <h4 style="margin: 0 0 10px 0; color: #495057; font-weight: 600;">Run Details</h4>
                            <p style="margin: 5px 0; font-size: 14px;"><strong>Environment:</strong> ${env.toUpperCase()}</p>
                            <p style="margin: 5px 0; font-size: 14px;"><strong>Browser:</strong> ${browser.toUpperCase()}</p>
                            <p style="margin: 5px 0; font-size: 14px;"><strong>Date:</strong> ${new Date().toISOString().split('T')[0]}</p>
                        </div>
                        <div style="background: white; border: 1px solid #dee2e6; border-radius: 5px; padding: 15px; flex: 1; min-width: 200px; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
                            <h4 style="margin: 0 0 10px 0; color: #495057; font-weight: 600;">Execution Stats</h4>
                            <p style="margin: 5px 0; font-size: 14px;"><strong>Total Tests:</strong> ${total}</p>
                            <p style="margin: 5px 0; font-size: 14px; color: #28a745;"><strong>Passed:</strong> ${passed}</p>
                            <p style="margin: 5px 0; font-size: 14px; color: #dc3545;"><strong>Failed:</strong> ${mergedJson.stats.failures}</p>
                            <p style="margin: 5px 0; font-size: 14px; color: #17a2b8;"><strong>Pass %:</strong> ${passPercent}%</p>
                            
                            <div style="width: 100%; background: #e9ecef; border-radius: 3px; height: 10px; margin-top: 10px; overflow: hidden; display: flex;">
                                <div style="width: ${passPercent}%; background: #28a745;"></div>
                                <div style="width: ${total > 0 ? (mergedJson.stats.failures/total)*100 : 0}%; background: #dc3545;"></div>
                            </div>
                        </div>
                        <div style="background: white; border: 1px solid #dee2e6; border-radius: 5px; padding: 15px; flex: 1; min-width: 200px; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
                            <h4 style="margin: 0 0 10px 0; color: #495057; font-weight: 600;">Performance & Distribution</h4>
                            <p style="margin: 5px 0; font-size: 14px;"><strong>Total Duration:</strong> ${(mergedJson.stats.duration / 1000).toFixed(2)} s</p>
                            <p style="margin: 5px 0; font-size: 14px;"><strong>Avg Test Time:</strong> ${total > 0 ? (mergedJson.stats.duration / total).toFixed(0) : 0} ms</p>
                            <p style="margin: 5px 0; font-size: 14px;"><strong>Browser Distribution:</strong> 100% ${browser.toUpperCase()}</p>
                        </div>
                    </div>
                </div>
                `;
                
                htmlContent = htmlContent.replace(/<body[^>]*>/i, (match) => `${match}\n${dashboardHtml}`);
                
                const footerHtml = `
                <div style="text-align: center; padding: 20px; color: #6c757d; font-family: sans-serif; border-top: 1px solid #dee2e6; background: white; margin-top: 30px;">
                    Generated automatically by Enterprise Automation Framework
                </div>`;
                htmlContent = htmlContent.replace('</body>', `${footerHtml}\n</body>`);

                fs.writeFileSync(htmlFile, htmlContent);
                logger.info(`Final HTML report generated at ${htmlFile}`);
            } else {
                logger.error('HTML file was not generated properly by Marge.');
            }
        } catch (error) {
            logger.error(`Failed to generate final Mochawesome report: ${error.message}`);
        }
    }

    static groupFailures(mergedJson) {
        const failedTests = [];
        
        const extractFailed = (suite) => {
            suite.tests.forEach(test => {
                if (test.fail) {
                    failedTests.push(JSON.parse(JSON.stringify(test))); // deep clone
                }
            });
            suite.suites.forEach(extractFailed);
        };
        
        mergedJson.results.forEach(extractFailed);

        if (failedTests.length === 0) return;

        const categories = {
            'Authentication': [],
            'Forms': [],
            'Navigation': [],
            'UI': [],
            'Business': [],
            'Other': []
        };

        failedTests.forEach(test => {
            const fullTitle = (test.fullTitle || test.title).toLowerCase();
            if (fullTitle.includes('auth') || fullTitle.includes('login') || fullTitle.includes('register')) {
                categories['Authentication'].push(test);
            } else if (fullTitle.includes('form') || fullTitle.includes('input') || fullTitle.includes('submit')) {
                categories['Forms'].push(test);
            } else if (fullTitle.includes('nav') || fullTitle.includes('menu') || fullTitle.includes('route')) {
                categories['Navigation'].push(test);
            } else if (fullTitle.includes('ui') || fullTitle.includes('component') || fullTitle.includes('render')) {
                categories['UI'].push(test);
            } else if (fullTitle.includes('business') || fullTitle.includes('workflow') || fullTitle.includes('transaction')) {
                categories['Business'].push(test);
            } else {
                categories['Other'].push(test);
            }
        });

        const failuresSuite = {
            uuid: 'failures-by-category-uuid',
            title: 'Failures by Category (Aggregated)',
            fullFile: '',
            file: '',
            beforeHooks: [],
            afterHooks: [],
            tests: [],
            suites: [],
            passes: [],
            failures: [],
            pending: [],
            skipped: [],
            duration: 0,
            root: false,
            rootEmpty: false,
            _timeout: 0
        };

        for (const [catName, tests] of Object.entries(categories)) {
            if (tests.length > 0) {
                const subSuite = {
                    uuid: `failure-category-${catName.toLowerCase()}`,
                    title: catName,
                    fullFile: '',
                    file: '',
                    beforeHooks: [],
                    afterHooks: [],
                    tests: tests,
                    suites: [],
                    passes: [],
                    failures: tests.map(t => t.uuid),
                    pending: [],
                    skipped: [],
                    duration: tests.reduce((sum, t) => sum + (t.duration || 0), 0),
                    root: false,
                    rootEmpty: false,
                    _timeout: 0
                };
                failuresSuite.suites.push(subSuite);
                failuresSuite.duration += subSuite.duration;
            }
        }

        // Add to the front of results so it appears at the top
        mergedJson.results.unshift(failuresSuite);
    }
}
