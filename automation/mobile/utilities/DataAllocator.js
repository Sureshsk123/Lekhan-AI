export class DataAllocator {
    constructor() {
        this.leased = new Set();
    }

    lease(dataset) {
        const available = dataset.find(item => !this.leased.has(item.id));
        if (!available) throw new Error('No available data to lease in dataset');
        
        this.leased.add(available.id);
        return available;
    }

    release(id) {
        this.leased.delete(id);
    }

    reset() {
        this.leased.clear();
    }
}