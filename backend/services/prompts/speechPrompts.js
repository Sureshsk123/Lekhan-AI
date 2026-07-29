/**
 * Speech & Audio Evaluation Prompt Templates
 */

export const getSTTEvaluationPrompt = (expectedText = '', language = 'Tamil') => {
  return `You are a speech recognition and pronunciation evaluation expert for ${language}.

Analyze the audio content provided${expectedText ? ` against expected phrase "${expectedText}"` : ''}.

Return strictly a JSON object:
{
  "transcription": "Transcribed spoken text",
  "pronunciationScore": 88,
  "detectedMistakes": [
    "Mispronounced vowel sound in word X",
    "Slight hesitation before word Y"
  ],
  "accentFeedback": "Good clarity. Work on soft retroflex consonant resonance."
}

Ensure pronunciationScore is an integer from 0 to 100.`;
};

export const getTTSGenerationPrompt = (text, language, style) => {
  return `Synthesize speech payload for text: "${text}" in ${language} with voice style "${style}".`;
};
