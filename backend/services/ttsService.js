import { generateGeminiContent } from './geminiService.js';
import { getTTSGenerationPrompt } from './prompts/speechPrompts.js';

export const generateTextToSpeech = async (userId, { text, language = 'Tamil', voiceStyle = 'teacher', speed = 1.0 }) => {
  const supportedLanguages = ['Tamil', 'Hindi', 'Telugu', 'Malayalam', 'Kannada', 'English'];

  const matchedLang = supportedLanguages.find(l => l.toLowerCase() === language.toLowerCase()) || 'Tamil';

  const voiceMap = {
    teacher: { pitch: 'neutral', rate: '0.95', tone: 'instructive & clear' },
    cheerful: { pitch: 'high', rate: '1.05', tone: 'upbeat & encouraging' },
    neutral: { pitch: 'medium', rate: '1.00', tone: 'balanced' },
    expressive: { pitch: 'varied', rate: '1.00', tone: 'storyteller' }
  };

  const selectedVoice = voiceMap[voiceStyle.toLowerCase()] || voiceMap.teacher;

  const prompt = getTTSGenerationPrompt(text, matchedLang, voiceStyle);

  const fallbackTts = `Audio synthesis payload generated for ${matchedLang} text: "${text}" with ${voiceStyle} voice.`;

  const aiAnnotation = await generateGeminiContent({
    prompt: `${prompt}\nProvide phonetic guide and SSML markup string.`,
    modelName: 'gemini-1.5-flash',
    fallback: fallbackTts,
    userId,
    feature: 'tts'
  });

  const ssml = `<speak><prosody rate="${selectedVoice.rate}" pitch="${selectedVoice.pitch}">${text}</prosody></speak>`;

  return {
    text,
    language: matchedLang,
    voiceStyle,
    speed,
    ssml,
    audioConfig: {
      audioEncoding: 'MP3',
      speakingRate: speed,
      pitch: selectedVoice.pitch,
      tone: selectedVoice.tone
    },
    annotation: aiAnnotation
  };
};

export default {
  generateTextToSpeech
};
