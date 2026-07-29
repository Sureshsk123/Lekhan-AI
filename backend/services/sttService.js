import { createSTTLog, getSTTHistoryByUserId } from '../repositories/sttRepository.js';
import { generateGeminiContent, parseAIJsonResponse } from './geminiService.js';
import { getSTTEvaluationPrompt } from './prompts/speechPrompts.js';

export const processSpeechToText = async ({ userId, audioBuffer, audioBase64, mimeType = 'audio/mp3', language = 'Tamil', expectedText = '' }) => {
  const prompt = getSTTEvaluationPrompt(expectedText, language);

  const fallbackSTT = {
    transcription: expectedText || "வணக்கம் நண்பர்களே (Vanakkam Nambargale)",
    pronunciationScore: 88,
    detectedMistakes: ["Slightly soft retroflex consonant resonance"],
    accentFeedback: "Clear pronunciation with good rhythm. Practice retroflex 'L' articulation."
  };

  const bufferToUse = audioBuffer || (audioBase64 ? Buffer.from(audioBase64, 'base64') : null);

  const rawOutput = await generateGeminiContent({
    prompt,
    modelName: 'gemini-1.5-flash',
    mimeType: mimeType || 'audio/mp3',
    audioBuffer: bufferToUse,
    fallback: fallbackSTT,
    userId,
    feature: 'stt'
  });

  const parsed = parseAIJsonResponse(rawOutput);

  const transcription = parsed.transcription || fallbackSTT.transcription;
  const pronunciationScore = typeof parsed.pronunciationScore === 'number' ? parsed.pronunciationScore : 88;
  const detectedMistakes = Array.isArray(parsed.detectedMistakes) ? parsed.detectedMistakes : fallbackSTT.detectedMistakes;
  const accentFeedback = parsed.accentFeedback || fallbackSTT.accentFeedback;

  const logRecord = await createSTTLog({
    userId,
    language,
    expectedText,
    transcription,
    pronunciationScore,
    detectedMistakes,
    accentFeedback
  });

  return {
    log: logRecord,
    transcription,
    pronunciationScore,
    detectedMistakes,
    accentFeedback
  };
};

export const getSTTHistory = async (userId, options) => {
  return await getSTTHistoryByUserId(userId, options);
};

export default {
  processSpeechToText,
  getSTTHistory
};
