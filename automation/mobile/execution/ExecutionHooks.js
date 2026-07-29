export class ExecutionHooks {
    constructor() {
        this.hooks = { beforeSuite: [], beforeWorker: [], afterWorker: [], afterSuite: [] };
    }

    register(hookType, fn) {
        if (this.hooks[hookType]) this.hooks[hookType].push(fn);
    }

    async trigger(hookType, context = {}) {
        const fns = this.hooks[hookType];
        if (fns) {
            for (let fn of fns) {
                await fn(context);
            }
        }
    }
}