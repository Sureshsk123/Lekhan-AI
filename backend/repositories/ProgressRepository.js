import Progress from '../models/Progress.js';

class ProgressRepository {
    async findByUserAndLanguage(userId, language) {
        let progress = await Progress.findOne({
            user: userId,
            language: language.toLowerCase(),
            isDeleted: false
        });

        if (!progress) {
            progress = await Progress.create({
                user: userId,
                language: language.toLowerCase(),
                lessonsCompleted: [],
                wordsLearned: [],
                skillLevels: {
                    handwriting: 0,
                    pronunciation: 0,
                    vocabulary: 0,
                    culture: 0,
                    listening: 0,
                    reading: 0
                },
                currentLevel: 'alphabets',
                weeklyActivity: [],
                totalTimeSpent: 0,
                lastPracticeDate: null
            });
        }

        return progress;
    }

    async findByUserId(userId) {
        return await Progress.find({ user: userId, isDeleted: false }).lean();
    }

    async save(progressDoc) {
        return await progressDoc.save();
    }

    async addLessonCompletion(userId, language, lessonData) {
        const progress = await this.findByUserAndLanguage(userId, language);
        progress.lessonsCompleted.push(lessonData);
        progress.totalTimeSpent += (lessonData.timeSpent || 0);
        progress.lastPracticeDate = new Date();

        // Update weekly activity
        const todayStr = new Date().toISOString().split('T')[0];
        const dayActivity = progress.weeklyActivity.find(w => w.date === todayStr);
        if (dayActivity) {
            dayActivity.xp += (lessonData.xpEarned || 0);
            dayActivity.timeSpent += (lessonData.timeSpent || 0);
        } else {
            progress.weeklyActivity.push({
                date: todayStr,
                xp: lessonData.xpEarned || 0,
                timeSpent: lessonData.timeSpent || 0
            });
        }

        return await progress.save();
    }

    async addOrUpdateWord(userId, language, { word, translation, proficiency }) {
        const progress = await this.findByUserAndLanguage(userId, language);
        const existingWord = progress.wordsLearned.find(w => w.word === word);
        if (existingWord) {
            existingWord.proficiency = proficiency;
        } else {
            progress.wordsLearned.push({
                word,
                translation,
                learnedAt: new Date(),
                proficiency: proficiency || 50
            });
        }
        return await progress.save();
    }

    async updateSkillLevels(userId, language, skillLevels) {
        const progress = await this.findByUserAndLanguage(userId, language);
        progress.skillLevels = { ...progress.skillLevels.toObject(), ...skillLevels };
        return await progress.save();
    }
}

export default new ProgressRepository();
