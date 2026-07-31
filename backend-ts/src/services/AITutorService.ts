import { GoogleGenAI } from '@google/genai';
import { prisma } from '../server';

export class AITutorService {
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

    let reply = '';
    const ai = this.getAIClient();

    if (!ai) {
      reply = `[AI Tutor Notice]: Gemini API Key is not configured yet. To enable real-time interactive responses, set your GEMINI_API_KEY in backend environment variables. Received your message: "${message}".`;
    } else {
      try {
        const prompt = `You are a native ${language ? language.name : actualCode} language tutor. The user says: "${message}". Respond helpfully in the target language. Do not output anything in english unless it's a translation they asked for. Be very encouraging and helpful.`;
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
        });
        reply = response.text || 'Sorry, I could not generate a response.';
      } catch (err: any) {
        console.error('Gemini API Error:', err?.message || err);
        reply = `I am currently experiencing connection issues to Gemini AI. Received: "${message}". Please check API key status.`;
      }
    }

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
