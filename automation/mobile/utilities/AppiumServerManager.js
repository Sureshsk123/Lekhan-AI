import { exec, spawn } from 'child_process';
import { logger } from './LoggerUtility.js';
import { ConfigReader } from './ConfigReader.js';
import net from 'net';

export class AppiumServerManager {
    static serverProcess = null;

    static async startServer() {
        const config = ConfigReader.getConfig();
        const port = config.appiumPort || 4723;

        const isPortInUse = await this.checkPort(port);
        if (isPortInUse) {
            logger.info(`Appium server is already running on port ${port}`);
            return;
        }

        logger.info(`Starting Appium server on port ${port}...`);
        
        return new Promise((resolve, reject) => {
            this.serverProcess = spawn('npx', ['appium', '-p', port.toString()], {
                cwd: process.cwd(),
                shell: true
            });

            this.serverProcess.stdout.on('data', (data) => {
                const output = data.toString();
                if (output.includes('Appium REST http interface listener started')) {
                    logger.info('Appium Server started successfully.');
                    resolve();
                }
            });

            this.serverProcess.stderr.on('data', (data) => {
                // Appium logs mostly to stderr even for info
                if (data.toString().includes('Appium REST http interface listener started')) {
                    logger.info('Appium Server started successfully.');
                    resolve();
                }
            });

            this.serverProcess.on('error', (err) => {
                logger.error(`Failed to start Appium server: ${err.message}`);
                reject(err);
            });

            // Failsafe timeout
            setTimeout(() => {
                resolve(); // Assume it started if we don't catch the exact string in time
            }, 10000);
        });
    }

    static async stopServer() {
        if (this.serverProcess) {
            logger.info('Stopping Appium server...');
            this.serverProcess.kill('SIGINT');
            this.serverProcess = null;
        }
    }

    static checkPort(port) {
        return new Promise((resolve) => {
            const server = net.createServer();
            server.once('error', (err) => {
                if (err.code === 'EADDRINUSE') {
                    resolve(true);
                }
            });
            server.once('listening', () => {
                server.close();
                resolve(false);
            });
            server.listen(port);
        });
    }
}
