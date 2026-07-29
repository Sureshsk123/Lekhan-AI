import QuizRepository from '../repositories/QuizRepository.js';
import LessonRepository from '../repositories/LessonRepository.js';
import UserRepository from '../repositories/UserRepository.js';
import GamificationRepository from '../repositories/GamificationRepository.js';
import { alphabetData } from '../config/seedData.js';

class QuizService {
    async generateQuiz(lessonId) {
        const lesson = await LessonRepository.findById(lessonId);
        if (!lesson) return null;

        const questions = [];
        const language = lesson.language;
        const langData = alphabetData[language] || alphabetData['tamil'];

        if (lesson.vocabulary && lesson.vocabulary.length > 0) {
            lesson.vocabulary.forEach(voc => {
                const distractors = langData.nouns
                    .filter(n => n.w !== voc.word)
                    .sort(() => 0.5 - Math.random())
                    .slice(0, 3)
                    .map(n => n.m);

                const options = [...distractors, voc.translation].sort(() => 0.5 - Math.random());

                questions.push({
                    type: 'mcq',
                    question: `What is the meaning of "${voc.word}"?`,
                    options,
                    correctAnswer: voc.translation,
                    xp: 20
                });
            });
        }

        while (questions.length < 5) {
            const randomNoun = langData.nouns[Math.floor(Math.random() * langData.nouns.length)];
            const options = langData.nouns
                .filter(n => n.w !== randomNoun.w)
                .sort(() => 0.5 - Math.random())
                .slice(0, 3)
                .map(n => n.m);
            options.push(randomNoun.m);
            options.sort(() => 0.5 - Math.random());

            questions.push({
                type: 'mcq',
                question: `Translate "${randomNoun.w}" to English`,
                options,
                correctAnswer: randomNoun.m,
                xp: 10
            });
        }

        return {
            lessonId,
            questions: questions.slice(0, 10)
        };
    }

    async submitQuiz(user, { lessonId, score, totalQuestions, timeSpent, accuracy }) {
        const xpEarned = Math.round((score || 0) * 10);
        const diamondBonus = score === totalQuestions ? 5 : 0;

        const attempt = await QuizRepository.createAttempt({
            userId: user._id,
            lessonId,
            score,
            totalQuestions,
            timeSpent,
            accuracy,
            xpEarned
        });

        const newXP = user.xp + xpEarned;
        const newDiamonds = user.diamonds + diamondBonus;
        const newLevel = Math.floor(newXP / 1000) + 1;
        const levelBonusDiamonds = newLevel > user.level ? 50 : 0;

        await UserRepository.update(user._id, {
            xp: newXP,
            diamonds: newDiamonds + levelBonusDiamonds,
            level: newLevel
        });

        await GamificationRepository.addXPTransaction(user._id, xpEarned, `Quiz Completion: ${lessonId}`);

        return {
            attempt,
            xpEarned,
            diamondBonus,
            newStats: {
                xp: newXP,
                level: newLevel,
                diamonds: newDiamonds + levelBonusDiamonds
            }
        };
    }
}

export default new QuizService();
