export class ExecutionManifest {
    constructor() {
        this.jobs = [];
    }
    
    addJob(platform, suitePath, type) {
        this.jobs.push({ id: `job_${Date.now()}_${Math.random()}`, platform, path: suitePath, type });
    }
}