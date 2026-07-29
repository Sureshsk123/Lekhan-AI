/**
 * Dynamic Quiz Generator Prompt Templates
 */

export const getDynamicQuizPrompt = ({ topic = 'Basic Greetings', language = 'Tamil', difficulty = 'Medium', questionTypes = ['MCQ', 'Fill blanks', 'Translation', 'Listening', 'Speaking', 'Image-based'], totalQuestions = 5 } = {}) => {
  return `Generate a dynamic language assessment quiz.

Parameters:
- Topic: ${topic}
- Target Language: ${language}
- Difficulty Level: ${difficulty}
- Allowed Types: ${questionTypes.join(', ')}
- Total Questions: ${totalQuestions}

Return strictly a JSON object with this schema:
{
  "quizTitle": "${topic} Quiz",
  "language": "${language}",
  "difficulty": "${difficulty}",
  "questions": [
    {
      "id": 1,
      "type": "MCQ | Fill blanks | Translation | Listening | Speaking | Image-based",
      "prompt": "Question or instructions prompt",
      "audioScript": "Optional script for listening type",
      "imagePrompt": "Optional description for image-based concept",
      "options": ["A", "B", "C", "D"],
      "correctAnswer": "A",
      "explanation": "Brief answer key explanation"
    }
  ]
}

Make questions engaging, accurate, and aligned with difficulty level.`;
};
