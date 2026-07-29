/**
 * FlowContext
 * Tracks lightweight execution state across a single test run to prevent redundant operations.
 * Must be instantiated per test/worker to guarantee thread safety in parallel execution.
 */
export class FlowContext {
    constructor() {
        this.state = {
            currentUser: null,
            isAuthenticated: false,
            currentLesson: null,
            currentModule: null,
            flowStartTime: null,
            lastCompletedFlow: null,
            history: []
        };
    }

    startFlow(flowName) {
        this.state.flowStartTime = Date.now();
        this.state.history.push({ flow: flowName, status: 'STARTED', time: this.state.flowStartTime });
    }

    completeFlow(flowName) {
        const endTime = Date.now();
        const duration = endTime - this.state.flowStartTime;
        this.state.lastCompletedFlow = flowName;
        this.state.history.push({ flow: flowName, status: 'COMPLETED', duration });
    }

    setAuthenticated(user) {
        this.state.isAuthenticated = true;
        this.state.currentUser = user;
    }

    setLoggedOut() {
        this.state.isAuthenticated = false;
        this.state.currentUser = null;
    }

    isAuthenticated() {
        return this.state.isAuthenticated;
    }

    getCurrentUser() {
        return this.state.currentUser;
    }

    setCurrentLesson(lesson) {
        this.state.currentLesson = lesson;
    }

    getHistory() {
        return [...this.state.history];
    }
}
