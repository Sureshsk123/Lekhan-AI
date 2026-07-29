import { ConfigReader } from './ConfigReader.js';
import { CONSTANTS } from './Constants.js';
import { logger } from './LoggerUtility.js';

class EnvironmentManager {
    constructor() {
        this.env = process.env.NODE_ENV || CONSTANTS.ENVIRONMENTS.DEV;
        this.config = ConfigReader.getConfig(this.env);
        logger.info(`Initialized EnvironmentManager for env: ${this.env}`);
    }

    getBaseUrl() {
        return this.config.baseUrl;
    }

    getApiUrl() {
        return this.config.apiUrl;
    }

    getBrowser() {
        return process.env.BROWSER || this.config.browser || CONSTANTS.BROWSERS.CHROME;
    }

    isHeadless() {
        return process.env.HEADLESS ? process.env.HEADLESS === 'true' : this.config.headless;
    }

    getImplicitWait() {
        return this.config.implicitWait || CONSTANTS.TIMEOUTS.IMPLICIT;
    }

    getExplicitWait() {
        return this.config.explicitWait || CONSTANTS.TIMEOUTS.EXPLICIT;
    }
}

export const envManager = new EnvironmentManager();
