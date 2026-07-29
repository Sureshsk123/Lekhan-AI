import winston from 'winston';
import fs from 'fs';
import path from 'path';

let config = {};
try {
    const configPath = path.resolve(process.cwd(), 'config/config.json');
    if (fs.existsSync(configPath)) {
        config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    }
} catch (e) {
    // Ignore error
}

const browser = (process.env.BROWSER || config.browser || 'chrome').toLowerCase();
const workerId = process.env.MOCHA_WORKER_ID || '0';
const logDir = path.join('logs', browser);

if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
}

const customFormat = winston.format.printf(({ level, message, timestamp }) => {
    return `${timestamp} [Worker-${workerId}] [${level.toUpperCase()}]: ${message}`;
});

export const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        customFormat
    ),
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                customFormat
            )
        }),
        new winston.transports.File({ 
            filename: path.join(logDir, `automation-worker-${workerId}.log`),
            maxsize: 5242880, // 5MB
            maxFiles: 5
        })
    ]
});
