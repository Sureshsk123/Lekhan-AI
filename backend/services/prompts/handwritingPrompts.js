/**
 * Handwriting Evaluation Prompt Templates
 */

export const getHandwritingEvaluationPrompt = (targetText = '') => {
  return `You are a master calligraphy, penmanship, and character formation evaluator for language scripts.

Evaluate the submitted handwriting sample${targetText ? ` intended for the character/phrase "${targetText}"` : ''}.

Return strictly a JSON object with this exact structure:
{
  "score": 85,
  "formation": 88,
  "spacing": 82,
  "consistency": 85,
  "mistakes": [
    "Slightly uneven top horizontal stroke",
    "Loop gap is slightly too wide"
  ],
  "tips": [
    "Practice steady downward stroke pressure",
    "Keep character spacing uniform"
  ]
}

Criteria:
- score: overall score out of 100.
- formation: character accuracy and stroke order score (0-100).
- spacing: inter-character and line spacing score (0-100).
- consistency: alignment and size uniformity score (0-100).
- mistakes: list of specific formation errors detected.
- tips: constructive tips to improve handwriting.
- Do NOT output any markdown formatting around JSON.`;
};
