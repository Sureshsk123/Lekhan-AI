export class SuiteRegistry {
    constructor() {
        this.webSuites = {
            smoke: ['automation/web/tests/smoke/'],
            regression: ['automation/web/tests/regression/'],
            auth: ['automation/web/tests/auth/']
        };
        this.mobileSuites = {
            smoke: ['automation/mobile/tests/smoke/'],
            regression: ['automation/mobile/tests/business/'],
            hardware: ['automation/mobile/tests/hardware/']
        };
    }

    getSuites(mode, type) {
        let suites = [];
        if (mode === 'web' || mode === 'hybrid') {
            suites = suites.concat((this.webSuites[type] || []).map(p => ({ platform: 'web', path: p })));
        }
        if (mode === 'mobile' || mode === 'hybrid') {
            suites = suites.concat((this.mobileSuites[type] || []).map(p => ({ platform: 'mobile', path: p })));
        }
        return suites;
    }
}