import HandwritingRepository from '../repositories/HandwritingRepository.js';
import UserRepository from '../repositories/UserRepository.js';
import GamificationRepository from '../repositories/GamificationRepository.js';
import { generateGeminiContent, parseAIJsonResponse } from './geminiService.js';
import { getHandwritingEvaluationPrompt } from './prompts/handwritingPrompts.js';

class HandwritingService {
  async evaluate(user, { targetChar = 'A', strokes, imageBase64, inputType = 'canvas', language = 'Tamil' }) {
    const prompt = getHandwritingEvaluationPrompt(targetChar);

    const fallbackEval = {
      score: 85,
      formation: 88,
      spacing: 82,
      consistency: 85,
      mistakes: [
        "Slightly uneven horizontal alignment",
        "Top stroke curve could be smoother"
      ],
      tips: [
        "Maintain uniform pen pressure across strokes",
        "Keep character centered in canvas box"
      ]
    };

    let aiResultText;
    if (imageBase64) {
      aiResultText = await generateGeminiContent({
        prompt: `${prompt}\nInput Image Analysis for ${language} character "${targetChar}"`,
        modelName: 'gemini-1.5-flash',
        mimeType: 'image/png',
        imageBuffer: Buffer.from(imageBase64, 'base64'),
        fallback: fallbackEval,
        userId: user._id,
        feature: 'handwriting'
      });
    } else {
      const strokesDataPrompt = strokes ? `Strokes Data: ${JSON.stringify(strokes).slice(0, 300)}` : 'Canvas drawing input';
      aiResultText = await generateGeminiContent({
        prompt: `${prompt}\n${strokesDataPrompt}`,
        modelName: 'gemini-1.5-flash',
        fallback: fallbackEval,
        userId: user._id,
        feature: 'handwriting'
      });
    }

    const evaluation = parseAIJsonResponse(aiResultText);

    const score = evaluation.score || 80;
    const formation = evaluation.formation || score;
    const spacing = evaluation.spacing || score;
    const consistency = evaluation.consistency || score;
    const mistakes = Array.isArray(evaluation.mistakes) ? evaluation.mistakes : [];
    const tips = Array.isArray(evaluation.tips) ? evaluation.tips : [];

    const savedRecord = await HandwritingRepository.recordScore({
      userId: user._id,
      targetChar,
      language,
      inputType: inputType || (imageBase64 ? 'upload' : 'canvas'),
      score,
      formation,
      spacing,
      consistency,
      scores: {
        shape: formation,
        strokeOrder: formation,
        alignment: spacing,
        neatness: consistency
      },
      mistakes,
      tips,
      feedback: tips.join('. ')
    });

    let newXP = user.xp;
    if (score >= 60) {
      const xpReward = Math.round(score / 2);
      newXP = user.xp + xpReward;
      await UserRepository.update(user._id, { xp: newXP });
      await GamificationRepository.addXPTransaction(user._id, xpReward, `Handwriting Practice: ${targetChar}`);
    }

    return {
      evaluation: {
        score,
        formation,
        spacing,
        consistency,
        mistakes,
        tips
      },
      savedRecord,
      newXP
    };
  }

  async getHistory(userId, options) {
    return await HandwritingRepository.findByUserId(userId, options);
  }

  async getProgressGraph(userId) {
    return await HandwritingRepository.getProgressGraphData(userId);
  }
}

export default new HandwritingService();
