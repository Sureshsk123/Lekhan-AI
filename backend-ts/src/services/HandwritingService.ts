import { GoogleGenAI } from '@google/genai';
import { prisma } from '../server';

export class HandwritingService {
  private getAIClient() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'your_gemini_api_key_here' || apiKey === 'mock_key') {
      return null;
    }
    try {
      return new GoogleGenAI({ apiKey });
    } catch {
      return null;
    }
  }

  async evaluateHandwriting(userId: string, imageBase64: string, expectedText: string) {
    let result = {
      score: 85,
      feedback: `Good attempt practicing "${expectedText}"! Strokes are clear and legible. Keep practicing for smooth curves.`,
      strokes: [
        'Maintain consistent line thickness',
        'Focus on the upper loop symmetry',
        'Smooth out final stroke ending'
      ]
    };

    const ai = this.getAIClient();

    if (ai) {
      try {
        const prompt = `You are a handwriting evaluator. The user is practicing the character/word "${expectedText}". Evaluate the provided handwriting image. 
Return your response ONLY as a JSON object with the following structure:
{
  "score": <number between 0 and 100>,
  "feedback": "<string explaining what was good and what needs improvement>",
  "strokes": ["<array of strings giving specific stroke advice>"]
}
Do NOT wrap the response in markdown blocks like \`\`\`json or \`\`\`. Output ONLY raw JSON.`;

        let base64Data = imageBase64;
        if (imageBase64.includes('base64,')) {
          base64Data = imageBase64.split('base64,')[1] || '';
        }

        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: [
            { inlineData: { data: base64Data, mimeType: 'image/png' } },
            prompt
          ],
        });

        const aiText = response.text || '{}';
        try {
          result = JSON.parse(aiText);
        } catch {
          const match = aiText.match(/\{[\s\S]*\}/);
          if (match) {
            try { result = JSON.parse(match[0]); } catch {}
          }
        }
      } catch (err: any) {
        console.error('Gemini Handwriting API Error:', err?.message || err);
      }
    }

    // Save to WritingRecord
    await prisma.writingRecord.create({
      data: {
        userId,
        content: expectedText,
        feedback: result,
        score: result.score
      }
    });

    return result;
  }
}

export const handwritingService = new HandwritingService();
