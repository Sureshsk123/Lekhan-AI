import { PlatformConfiguration } from './PlatformConfiguration.js';
import { SuiteRegistry } from './SuiteRegistry.js';
import { DependencyResolver } from './DependencyResolver.js';
import { ExecutionManifest } from './ExecutionManifest.js';
import { PlatformScheduler } from './PlatformScheduler.js';
import { UnifiedMetrics } from './UnifiedMetrics.js';
import { PlatformHooks } from './PlatformHooks.js';

export class PlatformExecutionManager {
    constructor(overrides) {
        this.config = new PlatformConfiguration(overrides);
        this.registry = new SuiteRegistry();
        this.resolver = new DependencyResolver();
        this.scheduler = new PlatformScheduler(this.config);
        this.metrics = new UnifiedMetrics();
        this.hooks = new PlatformHooks();
    }

    async execute(suiteType = 'smoke') {
        try {
            await this.hooks.beforeAll(this.config);
            
            const manifest = new ExecutionManifest();
            const suites = this.registry.getSuites(this.config.mode, suiteType);
            
            suites.forEach(s => manifest.addJob(s.platform, s.path, suiteType));
            
            let finalJobs = manifest.jobs;
            if (this.config.executionOrder === 'dependency') {
                finalJobs = this.resolver.resolve(manifest);
            }

            await this.scheduler.dispatch({ jobs: finalJobs });
            
            this.metrics.mergeReports();
            
        } catch (error) {
            console.error('Unified Execution failed: ', error);
        } finally {
            await this.hooks.afterAll();
        }
    }
}