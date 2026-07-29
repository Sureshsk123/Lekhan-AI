/**
 * AI Story Generator Prompt Templates
 */

export const getStoryGeneratorPrompt = ({ language = 'Tamil', difficulty = 'Medium', age = 'kids', topic = 'Folk Tales', length = 'short' } = {}) => {
  return `Generate an immersive, educational language story tailored for a language learner.

Parameters:
- Target Language: ${language}
- Difficulty Level: ${difficulty}
- Target Age: ${age}
- Topic / Theme: ${topic}
- Story Length: ${length}

Return strictly a JSON object matching this schema:
{
  "title": "Story Title in Target Language",
  "story": "Complete story in target language script...",
  "translation": "Full English translation of the story...",
  "vocabulary": [
    {
      "word": "Target Word",
      "transliteration": "Romanized Pronunciation",
      "meaning": "English Meaning"
    }
  ],
  "moral": "Moral or key take-away of the story",
  "readingQuestions": [
    {
      "question": "Question text in target language or English?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "answer": "Option A"
    }
  ],
  "speakingPractice": [
    "Practice sentence 1 in target language",
    "Practice sentence 2 in target language"
  ]
}

Ensure age-appropriate theme and vocabulary matching difficulty level.`;
};
