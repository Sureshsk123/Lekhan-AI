import fs from 'fs';
import path from 'path';

let config = {};
try {
    const configPath = path.resolve(process.cwd(), 'config/config.json');
    if (fs.existsSync(configPath)) {
        config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    }
} catch (e) {
    // Ignore if not present
}

const browser = (config.browser || 'chrome').toLowerCase();
const isParallel = config.parallel === true;
const workers = config.workers || 1;

export default {
    extension: ['js'],
    spec: ['tests/**/*.test.js'],
    timeout: 60000,
    retries: 0,
    parallel: isParallel,
    jobs: workers,
    require: ['utilities/GlobalTeardown.js'],
    reporter: 'mochawesome',
    'reporter-option': [
        `reportDir=reports/${browser}`,
        'reportFilename=[status]_[datetime]-[name]-report',
        'html=false',
        'json=true',
        'overwrite=false',
        'timestamp=isoDateTime'
    ]
};
