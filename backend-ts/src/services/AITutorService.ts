import { prisma } from '../server';
import { ollamaService } from './ai/OllamaService';

export class AITutorService {
  /**
   * Main AI Tutor Chat method using Supabase Curriculum Retrieval + Local Ollama (llama3.2:3b).
   */
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

    // 1. Resolve or create active conversation session safely
    let conversationId = sessionId;
    if (conversationId) {
      const existingConv = await prisma.conversation.findFirst({
        where: { id: conversationId, userId }
      });
      if (!existingConv) {
        conversationId = undefined;
      }
    }

    if (!conversationId) {
      const conv = await prisma.conversation.create({
        data: { userId, languageCode: actualCode || 'ta' }
      });
      conversationId = conv.id;
    }

    // 2. Save incoming user message
    await prisma.aiMessage.create({
      data: {
        conversationId,
        role: 'user',
        content: message
      }
    });

    // 3. Fetch User Profile & Progress State
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        progress: {
          take: 10,
          orderBy: { updatedAt: 'desc' },
          include: { lesson: true }
        }
      }
    });

    const targetLangName = language ? language.name : (actualCode === 'ta' ? 'Tamil' : actualCode === 'hi' ? 'Hindi' : 'English');
    const userXp = user?.xp || 0;
    const userCoins = user?.coins || 0;
    const userStreak = user?.streak || 0;
    const completedLessonsCount = user?.progress?.filter(p => p.isCompleted).length || 0;

    // 4. Retrieve Curriculum Knowledge from Supabase Database
    const curriculumKnowledge = await this.retrieveCurriculumKnowledge(actualCode, targetLangName, message);

    // 5. Retrieve Conversation Memory (Recent 6 Messages)
    const recentHistory = await prisma.aiMessage.findMany({
      where: { conversationId },
      orderBy: { createdAt: 'desc' },
      take: 6
    });
    recentHistory.reverse();

    const historyFormatted = recentHistory
      .map(m => `${m.role === 'user' ? 'Student' : 'AI Tutor'}: ${m.content}`)
      .join('\n');

    // 6. Construct Curriculum-Aware System Prompt
    const systemPrompt = `You are LangSphere AI, an expert, patient, and encouraging Indian language tutor for ${targetLangName}.

STUDENT PROFILE:
- Target Language: ${targetLangName} (${actualCode})
- XP: ${userXp} | Coins: ${userCoins} | Streak: ${userStreak} days
- Completed Lessons: ${completedLessonsCount}

SUPPLIED LANGSPHERE CURRICULUM CONTEXT:
${curriculumKnowledge}

TEACHING INSTRUCTIONS:
1. Teach slowly, step-by-step, using simple English and clear ${targetLangName} script with Romanized transliteration.
2. Provide pronunciation hints, word meanings, and practical example sentences.
3. Explain grammar rules, verb tenses, case markers, and sentence structures clearly.
4. When explaining quizzes or mistakes, explain WHY an answer is right or wrong, show the correct option, and give an example.
5. Maintain a warm, encouraging tone.

STRICT CURRICULUM GUARDRAIL RULE:
If the student asks about non-language topics (coding, math, stocks, politics, gossip, or general trivia) that are completely unrelated to language learning or LangSphere's curriculum, politely reply:
"I couldn't find that in the current LangSphere lessons. I am your ${targetLangName} AI Tutor dedicated to helping you master Indian languages! How can I assist with your current lesson, vocabulary, or grammar today?"`;

    // 7. Format Prompt with History and Current Student Query
    const prompt = `RECENT CONVERSATION HISTORY:
${historyFormatted}

CURRENT STUDENT QUESTION:
"${message}"

Please provide a helpful, curriculum-informed response to the student:`;

    // 8. Generate text via local Ollama
    const reply = await ollamaService.generateText(prompt, { systemPrompt, timeoutMs: 30000 });

    // 9. Save AI response to DB
    await prisma.aiMessage.create({
      data: {
        conversationId,
        role: 'model',
        content: reply
      }
    });

    return { response: reply, sessionId: conversationId };
  }

  /**
   * Helper function to search Supabase database for relevant lessons, quizzes, stories, and vocabulary.
   */
  private async retrieveCurriculumKnowledge(langCode: string, langName: string, query: string): Promise<string> {
    try {
      // Search Lessons
      const lessons = await prisma.lesson.findMany({
        where: {
          topic: {
            module: {
              course: {
                language: {
                  OR: [
                    { code: langCode },
                    { name: { equals: langName, mode: 'insensitive' } }
                  ]
                }
              }
            }
          }
        },
        take: 3,
        include: { topic: true, quizzes: { include: { questions: { include: { answers: true } } } } }
      });

      // Search Stories
      const stories = await prisma.story.findMany({
        where: {
          OR: [
            { languageCode: langCode },
            { title: { contains: query, mode: 'insensitive' } }
          ]
        },
        take: 2,
        include: { pages: true }
      });

      let contextStr = `=== LANGSPHERE CURRICULUM DATA (${langName}) ===\n`;

      if (lessons.length > 0) {
        contextStr += `\n--- LESSONS & EXERCISES ---\n`;
        lessons.forEach(l => {
          contextStr += `• Lesson Title: ${l.title} (Topic: ${l.topic.title})\n`;
          contextStr += `  Content Snippet: ${l.content.substring(0, 200)}...\n`;
          if (l.quizzes && l.quizzes.length > 0) {
            l.quizzes.forEach(q => {
              contextStr += `  [Quiz: ${q.title}]\n`;
              q.questions.forEach(quest => {
                const correctAns = quest.answers.find(a => a.isCorrect)?.text || 'N/A';
                contextStr += `    - Question: ${quest.text} (Correct Answer: ${correctAns})\n`;
              });
            });
          }
        });
      }

      if (stories.length > 0) {
        contextStr += `\n--- CURRICULUM STORIES ---\n`;
        stories.forEach(s => {
          contextStr += `• Story: ${s.title} (Level: ${s.level})\n`;
          const firstPage = s.pages?.[0];
          if (firstPage) {
            contextStr += `  Page 1: ${firstPage.text} | Translation: ${firstPage.translation || 'N/A'}\n`;
          }
        });
      }

      if (lessons.length === 0 && stories.length === 0) {
        contextStr += `General ${langName} curriculum available for beginner to advanced learners covering vocabulary, greetings, grammar, case markers, verb forms, and conversation practice.\n`;
      }

      return contextStr;
    } catch (error) {
      console.warn('⚠️ Curriculum Knowledge Retrieval Warning:', error);
      return `LangSphere ${langName} curriculum covering vocabulary, grammar rules, transliterations, and conversation exercises.`;
    }
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
