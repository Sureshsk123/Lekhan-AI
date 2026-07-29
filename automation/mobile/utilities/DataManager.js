import { DataFactory } from './DataFactory.js';
import { DataValidator } from './DataValidator.js';
import { DataAllocator } from './DataAllocator.js';
import { EnvironmentDataResolver } from './EnvironmentDataResolver.js';
import { DataSeeder } from './DataSeeder.js';
import path from 'path';

export class DataManager {
    constructor() {
        const dataDir = path.join(__dirname, '../data');
        this.factory = new DataFactory();
        this.allocator = new DataAllocator();
        this.resolver = new EnvironmentDataResolver(dataDir);
        this.seeder = new DataSeeder(dataDir);
        
        this.envConfig = this.resolver.resolveEnvConfig();
    }

    _loadAndValidate(category, filename, schemaName) {
        const data = this.seeder.loadDataset(category, filename);
        const schema = this.seeder.loadSchema(schemaName);
        data.forEach(item => DataValidator.validate(schema, item));
        return data;
    }

    getUser(type = 'validUsers') {
        const dataset = this._loadAndValidate('users', `${type}.json`, 'User.schema.json');
        return this.allocator.lease(dataset);
    }

    getLesson(lessonId) {
        const dataset = this._loadAndValidate('lessons', 'lessons.json', 'Lesson.schema.json');
        return dataset.find(l => l.id === lessonId) || dataset[0]; // fallback to first
    }

    getReward(rewardId) {
        const dataset = this._loadAndValidate('rewards', 'rewards.json', 'Reward.schema.json');
        return dataset.find(r => r.id === rewardId) || dataset[0];
    }

    getOCRDocument(docId) {
        const dataset = this._loadAndValidate('ocr', 'documents.json', 'OCR.schema.json');
        return dataset.find(d => d.id === docId) || dataset[0];
    }

    generateReward() {
        return this.factory.createTestReward();
    }
    
    release(item) {
        if (item && item.id) {
            this.allocator.release(item.id);
        }
    }
}