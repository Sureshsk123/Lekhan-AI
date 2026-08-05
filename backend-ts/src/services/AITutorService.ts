import { prisma } from '../server';
import { ollamaService } from './ai/OllamaService';

export class AITutorService {
  async chatWithTutor(userId: string, languageCode: string, message: string, sessionId?: string) {
    let actualCode = languageCode;
    const language = await prisma.language.findFirst({
      where: {
        OR: [
          { code: languageCode },
          { name: { equals: languageCode, mode: 'insensitive' } }
        ]
      }
    });
    if (language) actualCode = language.code;

    let conversationId = sessionId;

    // Create conversation if it doesn't exist
    if (!conversationId) {
      const conv = await prisma.conversation.create({
        data: { userId, languageCode: actualCode || 'ta' }
      });
      conversationId = conv.id;
    }

    // Save user message
    await prisma.aiMessage.create({
      data: {
        conversationId,
        role: 'user',
        content: message
      }
    });

    const targetLangName = language ? language.name : (actualCode === 'ta' ? 'Tamil' : actualCode);
    const systemPrompt = `You are a native, friendly, and expert ${targetLangName} language tutor for LangSphere AI.
Your sole role is to assist the user with learning ${targetLangName}. You excel at:
- Explaining vocabulary, phrases, and word meanings in ${targetLangName}.
- Explaining grammar rules, tenses, case markers, and sentence structure.
- Translating text accurately between ${targetLangName} and English or other languages.
- Generating clear example sentences and practical conversation dialogues.
- Explaining quiz questions and lesson concepts in detail.

STRICT GUARDRAIL: If the user asks about topics unrelated to language learning (such as coding, math, science, politics, or entertainment), politely refuse by saying:
"I am your ${targetLangName} AI Tutor! I am here to help you learn languages, vocabulary, grammar, and translation. Let's get back to practice — how can I help with your ${targetLangName} studies today?"

Be concise, encouraging, and clear.`;

    const prompt = `User message: "${message}". Please respond as their ${targetLangName} language tutor.`;

    // Call Ollama Service (handles connection, timeout, and offline fallback safely)
    const reply = await ollamaService.generateText(prompt, { systemPrompt });

    // Save AI response
    await prisma.aiMessage.create({
      data: {
        conversationId,
        role: 'model',
        content: reply
      }
    });

    return { response: reply, sessionId: conversationId };
  }

  async getSessions(userId: string) {
    return await prisma.conversation.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });
  }

  async getHistory(userId: string, sessionId: string) {
    return await prisma.aiMessage.findMany({
      where: { conversationId: sessionId, conversation: { userId } },
      orderBy: { createdAt: 'asc' }
    });
  }

  async createSession(userId: string, languageCode: string) {
    let actualCode = languageCode;
    const language = await prisma.language.findFirst({
      where: {
        OR: [
          { code: languageCode },
          { name: { equals: languageCode, mode: 'insensitive' } }
        ]
      }
    });
    if (language) actualCode = language.code;

    return await prisma.conversation.create({
      data: { userId, languageCode: actualCode || 'ta' }
    });
  }

  async deleteSession(userId: string, sessionId: string) {
    await prisma.conversation.deleteMany({
      where: { id: sessionId, userId }
    });
    return { success: true };
  }
}

export const aiTutorService = new AITutorService();
