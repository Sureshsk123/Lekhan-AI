import { findProfileByUserId, updateProfile } from '../repositories/learningProfileRepository.js';
import OCRResult from '../models/OCRResult.js';
import HandwritingScore from '../models/HandwritingScore.js';
import STTLog from '../models/STTLog.js';
import QuizAttempt from '../models/QuizAttempt.js';
import Lesson from '../models/Lesson.js';
import Story from '../models/Story.js';

export const analyzeAndGetPersonalizedRecommendations = async (userId) => {
  let profile = await findProfileByUserId(userId);

  // 1. Analyze Handwriting
  const recentHandwriting = await HandwritingScore.find({ userId, isDeleted: false }).sort({ timestamp: -1 }).limit(10);
  const weakHandwriting = [];
  recentHandwriting.forEach(hw => {
    if (hw.score < 75) {
      weakHandwriting.push({
        character: hw.targetChar || 'A',
        score: hw.score,
        issue: hw.mistakes && hw.mistakes[0] ? hw.mistakes[0] : 'Form accuracy low',
        lastEvaluated: hw.timestamp
      });
    }
  });

  // 2. Analyze Pronunciation
  const recentSTT = await STTLog.find({ userId }).sort({ timestamp: -1 }).limit(10);
  const weakPronunciation = [];
  recentSTT.forEach(stt => {
    if (stt.pronunciationScore < 75) {
      weakPronunciation.push({
        phrase: stt.expectedText || stt.transcription,
        score: stt.pronunciationScore,
        language: stt.language,
        lastTested: stt.timestamp
      });
    }
  });

  // 3. Analyze OCR & Quizzes for Weak Alphabets/Vocabulary
  const recentOCR = await OCRResult.find({ userId, isDeleted: false }).sort({ timestamp: -1 }).limit(10);
  const weakAlphabets = [];
  recentOCR.forEach(ocr => {
    if (ocr.mistakes && ocr.mistakes.length > 0) {
      weakAlphabets.push({
        character: ocr.extractedText.slice(0, 3),
        language: ocr.detectedLanguage,
        errorCount: ocr.mistakes.length,
        lastPracticed: ocr.timestamp
      });
    }
  });

  // 4. Generate Recommendations
  const recommendations = [];

  // Recommend Lesson
  const sampleLesson = await Lesson.findOne({ isDeleted: false });
  if (sampleLesson) {
    recommendations.push({
      type: 'lesson',
      title: `Practice ${sampleLesson.title}`,
      targetId: sampleLesson._id.toString(),
      language: sampleLesson.language,
      reason: 'Reinforce foundational concepts'
    });
  }

  // Recommend Story
  const sampleStory = await Story.findOne({ isDeleted: false });
  if (sampleStory) {
    recommendations.push({
      type: 'story',
      title: `Read ${sampleStory.title}`,
      targetId: sampleStory._id.toString(),
      language: sampleStory.language,
      reason: 'Improve contextual vocabulary and reading speed'
    });
  }

  // Recommend Practice Quiz
  recommendations.push({
    type: 'quiz',
    title: 'Weak Topics Remedial Quiz',
    targetId: 'remedial-quiz',
    language: 'Tamil',
    reason: 'Target weak alphabets and pronunciation mistakes'
  });

  const updated = await updateProfile(userId, {
    weakHandwriting,
    weakPronunciation,
    weakAlphabets,
    recommendations
  });

  return {
    profile: updated,
    weakAreas: {
      weakHandwritingCount: weakHandwriting.length,
      weakPronunciationCount: weakPronunciation.length,
      weakAlphabetsCount: weakAlphabets.length
    },
    recommendations
  };
};

export default {
  analyzeAndGetPersonalizedRecommendations
};
