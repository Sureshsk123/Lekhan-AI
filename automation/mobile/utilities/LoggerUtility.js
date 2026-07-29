import winston from 'winston';
import path from 'path';

const logFormat = winston.format.printf(({ level, message, timestamp }) => {
    return `${timestamp} [${level.toUpperCase()}]: ${message}`;
});

const workerId = process.env.MOCHA_WORKER_ID || '0';
const logFilePath = path.resolve(process.cwd(), `logs/mobile-worker-${workerId}.log`);

export const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        logFormat
    ),
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.timestamp(),
                logFormat
            )
        }),
        new winston.transports.File({ 
            filename: logFilePath,
            options: { flags: 'a' } // Append mode
        })
    ]
});
