import ProgressRepository from '../repositories/ProgressRepository.js';

class ProgressService {
    async getProgress(userId, language) {
        return await ProgressRepository.findByUserAndLanguage(userId, language);
    }

    async completeLesson(userId, { language, lessonId, score, accuracy, timeSpent, xpEarned }) {
        return await ProgressRepository.addLessonCompletion(userId, language, {
            lessonId,
            score,
            accuracy,
            timeSpent,
            xpEarned
        });
    }

    async addWord(userId, { language, word, translation, proficiency }) {
        return await ProgressRepository.addOrUpdateWord(userId, language, { word, translation, proficiency });
    }

    async updateSkills(userId, { language, skillLevels }) {
        return await ProgressRepository.updateSkillLevels(userId, language, skillLevels);
    }

    async getAnalytics(targetUserId) {
        const allProgress = await ProgressRepository.findByUserId(targetUserId);

        const analytics = {
            totalTimeSpent: 0,
            totalWordsLearned: 0,
            averageAccuracy: 0,
            skillLevels: {},
            weeklyActivity: [],
            languages: []
        };

        allProgress.forEach(progress => {
            analytics.totalTimeSpent += (progress.totalTimeSpent || 0);
            analytics.totalWordsLearned += (progress.wordsLearned ? progress.wordsLearned.length : 0);
            analytics.skillLevels[progress.language] = progress.skillLevels;
            analytics.languages.push(progress.language);

            if (progress.weeklyActivity && progress.weeklyActivity.length > 0) {
                analytics.weeklyActivity = analytics.weeklyActivity.concat(progress.weeklyActivity);
            }
        });

        return analytics;
    }
}

export default new ProgressService();
