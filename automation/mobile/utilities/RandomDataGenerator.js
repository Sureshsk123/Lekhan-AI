export class RandomDataGenerator {
    constructor() {
        this.seed = Date.now();
    }
    
    setSeed(seed) {
        this.seed = seed;
    }
    
    _random() {
        // Simple LCG PRNG for determinism
        this.seed = (this.seed * 1664525 + 1013904223) % 4294967296;
        return this.seed / 4294967296;
    }

    generateString(prefix = '') {
        return prefix + Math.floor(this._random() * 10000).toString();
    }

    generateUser(role = 'student') {
        return {
            id: this.generateString('usr_'),
            username: this.generateString('user_'),
            password: 'Password1!',
            role: role
        };
    }

    generateLesson() {
        return {
            id: this.generateString('lsn_'),
            title: this.generateString('Lesson '),
            difficulty: 'beginner'
        };
    }

    generateReward() {
        return {
            id: this.generateString('rew_'),
            name: this.generateString('Reward '),
            points: Math.floor(this._random() * 100)
        };
    }

    generateDocument() {
        return {
            id: this.generateString('doc_'),
            documentName: this.generateString('doc_') + '.jpg',
            expectedText: this.generateString('Text ')
        };
    }
}