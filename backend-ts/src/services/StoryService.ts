import { prisma } from '../server';
import { AppError } from '../middlewares/errorHandler';

export class StoryService {
  async getStories(languageCode: string, level?: string) {
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

    const where: any = { languageCode: actualCode };
    if (level) where.level = level;

    return await prisma.story.findMany({
      where,
      include: {
        _count: { select: { pages: true } }
      }
    });
  }

  async getStoryById(storyId: string) {
    const story = await prisma.story.findUnique({
      where: { id: storyId },
      include: {
        pages: {
          orderBy: { pageNumber: 'asc' }
        }
      }
    });

    if (!story) throw new AppError('Story not found', 404);
    return story;
  }
}

export const storyService = new StoryService();
