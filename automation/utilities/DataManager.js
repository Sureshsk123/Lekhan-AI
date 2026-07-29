import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { envManager } from './EnvironmentManager.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, '../data');

class DataManager {
    constructor() {
        this.cache = {};
        // We could dynamically load env-specific data by suffixing file names, e.g. users_dev.json
        // For now, assuming static json files for the environment.
    }

    _loadJson(filename) {
        if (!this.cache[filename]) {
            const filePath = path.join(DATA_DIR, filename);
            if (!fs.existsSync(filePath)) {
                throw new Error(`Data file not found: ${filePath}`);
            }
            const rawData = fs.readFileSync(filePath, 'utf8');
            this.cache[filename] = JSON.parse(rawData);
        }
        return this.cache[filename];
    }

    // Role-based users
    getUser(role = 'student') {
        const users = this._loadJson('users.json');
        if (!users[role]) {
            throw new Error(`Role ${role} not found in users.json`);
        }
        return users[role];
    }

    // Login Data
    getLoginData(scenario = 'valid') {
        const data = this._loadJson('loginData.json');
        return data[scenario];
    }

    // Registration Data
    getRegistrationData(scenario = 'valid') {
        const data = this._loadJson('registrationData.json');
        return data[scenario];
    }

    // Forms Data
    getFormData(formName) {
        const data = this._loadJson('forms.json');
        return data[formName];
    }

    // Quiz Data
    getQuizData(quizId) {
        const data = this._loadJson('quizData.json');
        return data[quizId];
    }

    // Settings Data
    getSettingsData() {
        return this._loadJson('settingsData.json');
    }

    // Search Data
    getSearchData() {
        return this._loadJson('searchData.json');
    }

    // Helper: Random generators
    generateUniqueEmail() {
        return `user_${Date.now()}_${Math.floor(Math.random() * 1000)}@example.com`;
    }

    generateRandomString(length = 8) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }
}

export const dataManager = new DataManager();
