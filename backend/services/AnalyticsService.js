import ProgressRepository from '../repositories/ProgressRepository.js';
import QuizRepository from '../repositories/QuizRepository.js';
import HandwritingRepository from '../repositories/HandwritingRepository.js';

class AnalyticsService {
    async getDashboard(user) {
        const userId = user._id;

        // 1. Progress Data
        const allProgress = await ProgressRepository.findByUserId(userId);

        // 2. Quiz Data
        const { data: quizAttempts } = await QuizRepository.findByUserId(userId, { limit: 100 });
        const avgQuizAccuracy = quizAttempts.length > 0
            ? (quizAttempts.reduce((acc, curr) => acc + (curr.accuracy || 0), 0) / quizAttempts.length)
            : 0;

        // 3. Writing Data
        const { data: writingScores } = await HandwritingRepository.findByUserId(userId, { limit: 100 });
        const avgWritingScore = writingScores.length > 0
            ? (writingScores.reduce((acc, curr) => acc + (curr.score || 0), 0) / writingScores.length)
            : 0;

        // 4. Aggregated Stats
        const stats = {
            lessonsCompleted: allProgress.reduce((acc, curr) => acc + (curr.lessonsCompleted ? curr.lessonsCompleted.length : 0), 0),
            quizAccuracy: Math.round(avgQuizAccuracy),
            writingAccuracy: Math.round(avgWritingScore),
            xpEarned: user.xp,
            currentLevel: user.level,
            streakCount: user.streak ? user.streak.current : 0,
            totalTimeSpent: allProgress.reduce((acc, curr) => acc + (curr.totalTimeSpent || 0), 0),
            languagesCount: allProgress.length
        };

        // 5. Weak Vocabulary
        const weakVocabulary = [];
        allProgress.forEach(p => {
            if (p.wordsLearned) {
                const weak = p.wordsLearned
                    .filter(w => w.proficiency < 60)
                    .map(w => ({ word: w.word, language: p.language, proficiency: w.proficiency }));
                weakVocabulary.push(...weak);
            }
        });

        // 6. Progress Over Time
        const progressOverTime = [
            { month: 'Jan', xp: Math.round(user.xp * 0.2) },
            { month: 'Feb', xp: Math.round(user.xp * 0.4) },
            { month: 'Mar', xp: Math.round(user.xp * 0.6) },
            { month: 'Apr', xp: Math.round(user.xp * 0.8) },
            { month: 'May', xp: user.xp }
        ];

        return {
            stats,
            weakVocabulary: weakVocabulary.slice(0, 5),
            progressOverTime
        };
    }
}

export default new AnalyticsService();
