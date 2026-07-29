import { RandomDataGenerator } from './RandomDataGenerator.js';

export class DataFactory {
    constructor() {
        this.generator = new RandomDataGenerator();
    }

    createTestUser(role) {
        return this.generator.generateUser(role);
    }
    
    createTestLesson() {
        return this.generator.generateLesson();
    }
    
    createTestReward() {
        return this.generator.generateReward();
    }
    
    createTestDocument() {
        return this.generator.generateDocument();
    }
}