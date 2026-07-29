export class DependencyResolver {
    resolve(executionManifest) {
        // Very basic topological sort. 
        // Ensures 'auth' runs before 'business' if dependency mode is active.
        const sorted = [];
        const auth = executionManifest.jobs.filter(j => j.type === 'auth');
        const others = executionManifest.jobs.filter(j => j.type !== 'auth');
        
        return [...auth, ...others];
    }
}