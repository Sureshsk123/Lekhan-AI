import AIStory from '../models/AIStory.js';
import { generateGeminiContent, parseAIJsonResponse } from './geminiService.js';
import { getStoryGeneratorPrompt } from './prompts/storyPrompts.js';

export const generateAIStory = async (userId, { language = 'Tamil', difficulty = 'Medium', age = 'kids', topic = 'Folk Tales', length = 'short' }) => {
  const prompt = getStoryGeneratorPrompt({ language, difficulty, age, topic, length });

  const fallbackStory = {
    title: `${topic} - A ${language} Tale`,
    story: `ஒரு ஊரில் ஒரு முயல் வாழ்ந்து வந்தது. அது மிகவும் நேர்மையானது. (Once in a village lived an honest rabbit.)`,
    translation: `Once upon a time in a peaceful village, there lived an honest rabbit who taught everyone the value of truthfulness.`,
    vocabulary: [
      { word: "முயல்", transliteration: "Muyal", meaning: "Rabbit" },
      { word: "நேர்மை", transliteration: "Nermai", meaning: "Honesty" }
    ],
    moral: "Honesty is always rewarded.",
    readingQuestions: [
      {
        question: "Who lived in the village?",
        options: ["Rabbit", "Tiger", "Elephant", "Fox"],
        answer: "Rabbit"
      }
    ],
    speakingPractice: [
      "ஒரு ஊரில் ஒரு முயல் வாழ்ந்தது (Once in a village lived a rabbit)"
    ]
  };

  const rawOutput = await generateGeminiContent({
    prompt,
    modelName: 'gemini-1.5-flash',
    fallback: fallbackStory,
    userId,
    feature: 'story'
  });

  const parsed = parseAIJsonResponse(rawOutput);

  const newStory = new AIStory({
    userId,
    title: parsed.title || `${topic} Story`,
    language,
    difficulty,
    age,
    topic,
    length,
    story: parsed.story || fallbackStory.story,
    translation: parsed.translation || fallbackStory.translation,
    vocabulary: Array.isArray(parsed.vocabulary) ? parsed.vocabulary : fallbackStory.vocabulary,
    moral: parsed.moral || fallbackStory.moral,
    readingQuestions: Array.isArray(parsed.readingQuestions) ? parsed.readingQuestions : fallbackStory.readingQuestions,
    speakingPractice: Array.isArray(parsed.speakingPractice) ? parsed.speakingPractice : fallbackStory.speakingPractice
  });

  return await newStory.save();
};

export const getUserGeneratedStories = async (userId, { page = 1, limit = 10, language }) => {
  const skip = (page - 1) * limit;
  const filter = { userId };
  if (language) filter.language = language;

  const stories = await AIStory.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await AIStory.countDocuments(filter);

  return {
    stories,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      pages: Math.ceil(total / limit)
    }
  };
};

export default {
  generateAIStory,
  getUserGeneratedStories
};
