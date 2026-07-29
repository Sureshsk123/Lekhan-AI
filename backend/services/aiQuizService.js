import QuizRepository from '../repositories/QuizRepository.js';
import UserRepository from '../repositories/UserRepository.js';
import GamificationRepository from '../repositories/GamificationRepository.js';
import { generateGeminiContent, parseAIJsonResponse } from './geminiService.js';
import { getDynamicQuizPrompt } from './prompts/quizPrompts.js';

export const generateAIQuizService = async (userId, { topic = 'Tamil Vowels', language = 'Tamil', difficulty = 'Medium', totalQuestions = 5 }) => {
  const prompt = getDynamicQuizPrompt({
    topic,
    language,
    difficulty,
    questionTypes: ['MCQ', 'Fill blanks', 'Translation', 'Listening', 'Speaking', 'Image-based'],
    totalQuestions
  });

  const fallbackQuiz = {
    quizTitle: `${topic} Dynamic AI Quiz`,
    language,
    difficulty,
    questions: [
      {
        id: 1,
        type: "MCQ",
        prompt: `Which of the following is a ${language} vowel?`,
        options: ["அ (A)", "க (Ka)", "ச (Cha)", "த (Tha)"],
        correctAnswer: "அ (A)",
        explanation: "'அ' is the first primary vowel in Tamil."
      },
      {
        id: 2,
        type: "Fill blanks",
        prompt: `Complete the word: Vanak___ (Greeting)`,
        options: ["kam", "nam", "tam", "lam"],
        correctAnswer: "kam",
        explanation: "Vanakkam means Welcome/Greetings."
      },
      {
        id: 3,
        type: "Translation",
        prompt: "Translate 'Thank You' into Tamil",
        options: ["நன்றி (Nandri)", "வணக்கம் (Vanakkam)", "வரவேற்பு (Varaverpu)", "மகிழ்ச்சி (Magizhchi)"],
        correctAnswer: "நன்றி (Nandri)",
        explanation: "'Nandri' translates to Thank You."
      },
      {
        id: 4,
        type: "Listening",
        prompt: "Listen to the audio script: 'Kaalai Vanakkam' and choose the correct English meaning.",
        audioScript: "Kaalai Vanakkam",
        options: ["Good Morning", "Good Evening", "Good Night", "Goodbye"],
        correctAnswer: "Good Morning",
        explanation: "Kaalai Vanakkam means Good Morning."
      },
      {
        id: 5,
        type: "Speaking",
        prompt: "Say the phrase: 'En peyar ...' (My name is ...)",
        options: ["Completed Speaking Practice", "Skipped"],
        correctAnswer: "Completed Speaking Practice",
        explanation: "Speaking practice completed."
      }
    ]
  };

  const rawOutput = await generateGeminiContent({
    prompt,
    modelName: 'gemini-1.5-flash',
    fallback: fallbackQuiz,
    userId,
    feature: 'quiz'
  });

  const parsed = parseAIJsonResponse(rawOutput);

  return {
    quizTitle: parsed.quizTitle || fallbackQuiz.quizTitle,
    language,
    difficulty,
    questions: Array.isArray(parsed.questions) ? parsed.questions : fallbackQuiz.questions,
    totalQuestions: Array.isArray(parsed.questions) ? parsed.questions.length : fallbackQuiz.questions.length
  };
};

export const submitAIQuizService = async (user, { quizTitle, language, userAnswers = [], totalQuestions = 5, timeSpent = 60 }) => {
  let correctCount = 0;

  userAnswers.forEach(ans => {
    if (ans.isCorrect || ans.selectedAnswer === ans.correctAnswer) {
      correctCount++;
    }
  });

  const accuracy = Math.round((correctCount / Math.max(totalQuestions, 1)) * 100);
  const xpEarned = correctCount * 15;
  const diamondBonus = accuracy === 100 ? 10 : 0;

  const attempt = await QuizRepository.createAttempt({
    userId: user._id,
    lessonId: 'ai-dynamic-quiz',
    quizTitle: quizTitle || 'AI Dynamic Quiz',
    language: language || 'Tamil',
    score: correctCount,
    totalQuestions,
    timeSpent,
    accuracy,
    xpEarned
  });

  const newXP = user.xp + xpEarned;
  const newDiamonds = user.diamonds + diamondBonus;
  const newLevel = Math.floor(newXP / 1000) + 1;

  await UserRepository.update(user._id, {
    xp: newXP,
    diamonds: newDiamonds,
    level: newLevel
  });

  await GamificationRepository.addXPTransaction(user._id, xpEarned, `AI Dynamic Quiz: ${quizTitle || 'Practice'}`);

  return {
    attempt,
    score: correctCount,
    totalQuestions,
    accuracy,
    xpEarned,
    diamondBonus,
    newStats: {
      xp: newXP,
      level: newLevel,
      diamonds: newDiamonds
    }
  };
};

export default {
  generateAIQuizService,
  submitAIQuizService
};
