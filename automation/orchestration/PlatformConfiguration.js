export class PlatformConfiguration {
    constructor(overrides = {}) {
        this.mode = overrides.mode || process.env.PLATFORM_MODE || 'hybrid'; // 'web', 'mobile', 'hybrid'
        this.executionOrder = overrides.executionOrder || 'parallel'; // 'sequential', 'parallel', 'dependency'
        this.environment = overrides.environment || 'qa';
        this.workerCount = parseInt(overrides.workerCount || 4, 10);
        
        // Mobile specific
        this.apiLevel = overrides.apiLevel || 33;
        
        // Web specific
        this.browser = overrides.browser || 'chrome';
    }
}