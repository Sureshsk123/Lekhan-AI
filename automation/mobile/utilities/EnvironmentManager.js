export class EnvironmentManager {
    static getEnvironment() {
        return process.env.NODE_ENV || 'dev';
    }

    static getBaseUrl() {
        const env = this.getEnvironment();
        const urls = {
            dev: 'https://dev.lekhan.api',
            qa: 'https://qa.lekhan.api',
            prod: 'https://prod.lekhan.api'
        };
        return urls[env] || urls.dev;
    }

    static getAppPath(appName) {
        return `${process.cwd()}/apk/${appName}`;
    }
}
