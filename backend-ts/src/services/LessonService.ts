import { prisma } from '../server';
import { AppError } from '../middlewares/errorHandler';

export class LessonService {
  async getModulesForLanguage(languageCode: string) {
    const language = await prisma.language.findFirst({
      where: {
        OR: [
          { code: languageCode },
          { name: { equals: languageCode, mode: 'insensitive' } }
        ]
      }
    });
    if (!language) throw new AppError('Language not found', 404);

    return prisma.module.findMany({
      where: { course: { languageId: language.id } },
      include: {
        course: { select: { level: true, title: true } },
        topics: {
          include: {
            lessons: {
              select: {
                id: true, title: true, type: true,
                xpReward: true, order: true, content: true
              },
              orderBy: { order: 'asc' }
            }
          },
          orderBy: { order: 'asc' }
        }
      },
      orderBy: { order: 'asc' }
    });
  }

  async getLessonDetails(lessonId: string, userId?: string) {
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: {
        exercises: true,
        quizzes: {
          select: {
            id: true, title: true, type: true,
            _count: { select: { questions: true } }
          }
        },
        topic: {
          include: {
            module: {
              include: {
                course: {
                  include: { language: { select: { code: true, name: true } } }
                }
              }
            }
          }
        }
      }
    });
    if (!lesson) throw new AppError('Lesson not found', 404);

    let hasPassedQuiz = true; // Default true if no quizzes exist
    let isCompleted = false;

    if (userId) {
      if (lesson.quizzes.length > 0) {
        const quizId = lesson.quizzes[0]!.id;
        const attempt = await prisma.attempt.findFirst({
          where: { userId, quizId, passed: true }
        });
        hasPassedQuiz = !!attempt;
      }

      const progress = await prisma.progress.findUnique({
        where: { userId_lessonId: { userId, lessonId } }
      });
      if (progress) {
        isCompleted = progress.isCompleted;
      }
    }

    return { ...lesson, hasPassedQuiz, isCompleted };
  }

  async completeLesson(userId: string, lessonId: string) {
    const lesson = await prisma.lesson.findUnique({ 
      where: { id: lessonId },
      include: { 
        quizzes: { select: { id: true } },
        topic: {
          include: {
            lessons: { orderBy: { order: 'asc' }, select: { id: true, order: true } },
            module: {
              include: {
                topics: {
                  orderBy: { order: 'asc' },
                  include: { lessons: { orderBy: { order: 'asc' }, select: { id: true, order: true } } }
                }
              }
            }
          }
        }
      }
    });
    if (!lesson) throw new AppError('Lesson not found', 404);

    let quizXp = 0;
    if (lesson.quizzes.length > 0) {
      const quizId = lesson.quizzes[0]!.id;
      const passedAttempt = await prisma.attempt.findFirst({
        where: { userId, quizId, passed: true },
        include: { quiz: true }
      });
      if (!passedAttempt) {
        throw new AppError('Cannot complete lesson without passing the quiz', 403);
      }
      quizXp = (passedAttempt.quiz?.xpReward && passedAttempt.quiz.xpReward > 0) 
        ? passedAttempt.quiz.xpReward 
        : 15; // Default quiz XP
    }

    const progress = await prisma.progress.findUnique({
      where: { userId_lessonId: { userId, lessonId } }
    });

    const lessonXp    = (lesson.xpReward && lesson.xpReward > 0) ? lesson.xpReward : 25; // Default lesson XP
    const totalXp     = lessonXp + quizXp;
    const coinsReward = Math.floor(totalXp / 2);

    if (progress?.isCompleted) {
       // Do not award XP again, but return the value so UI shows what was earned.
       // Still find the nextLessonId so the UI can navigate forward
       const topicLessons2 = lesson.topic?.lessons || [];
       const currentIdx2 = topicLessons2.findIndex((l: any) => l.id === lessonId);
       let nextId: string | null = null;
       if (currentIdx2 !== -1 && currentIdx2 + 1 < topicLessons2.length) {
         nextId = topicLessons2[currentIdx2 + 1]!.id;
       }
       return { message: 'Already completed', xpEarned: totalXp, coinsEarned: coinsReward, lessonId, nextLessonId: nextId };
    }

    await prisma.progress.upsert({
      where: { userId_lessonId: { userId, lessonId } },
      update: { isCompleted: true, status: 'COMPLETED', lastAccessed: new Date(), completedAt: new Date() },
      create: {
        userId, lessonId,
        isCompleted: true, status: 'COMPLETED',
        lastAccessed: new Date(), completedAt: new Date()
      }
    });

    await prisma.user.update({
      where: { id: userId },
      data: { xp: { increment: totalXp }, coins: { increment: coinsReward } }
    });

    // Find the next lesson ID for auto-navigation
    let nextLessonId: string | null = null;
    const topicLessons = lesson.topic?.lessons || [];
    const currentIdx = topicLessons.findIndex((l) => l.id === lessonId);
    if (currentIdx !== -1 && currentIdx + 1 < topicLessons.length) {
      nextLessonId = topicLessons[currentIdx + 1]!.id;
    } else {
      // Try next topic in same module
      const allTopics = lesson.topic?.module?.topics || [];
      const topicIdx = allTopics.findIndex((t: any) => t.id === lesson.topic?.id);
      if (topicIdx !== -1 && topicIdx + 1 < allTopics.length) {
        const nextTopic = allTopics[topicIdx + 1];
        if (nextTopic?.lessons?.length > 0) {
          nextLessonId = nextTopic.lessons[0]!.id;
        }
      }
    }

    return { xpEarned: totalXp, coinsEarned: coinsReward, lessonId, nextLessonId };
  }

  async getUserProgress(userId: string, languageCode?: string) {
    const allProgress = await prisma.progress.findMany({
      where: { userId },
      include: {
        lesson: {
          include: {
            topic: {
              include: {
                module: {
                  include: {
                    course: {
                      include: { language: { select: { code: true, name: true } } }
                    }
                  }
                }
              }
            }
          }
        }
      },
      orderBy: { lastAccessed: 'desc' }
    });

    let actualCode = languageCode;
    if (languageCode) {
      const language = await prisma.language.findFirst({
        where: {
          OR: [
            { code: languageCode },
            { name: { equals: languageCode, mode: 'insensitive' } }
          ]
        }
      });
      if (language) actualCode = language.code;
    }

    const filtered = actualCode
      ? allProgress.filter(p => p.lesson.topic.module.course.language.code === actualCode)
      : allProgress;

    const completed = filtered.filter(p => p.isCompleted);

    return {
      lessonsCompleted: completed.map(p => ({
        lessonId: p.lessonId,
        title:    p.lesson.title,
        date:     p.lastAccessed
      })),
      totalCompleted: completed.length,
      xpEarned: completed.reduce((sum: number, p: any) => sum + ((p.lesson.xpReward && p.lesson.xpReward > 0) ? p.lesson.xpReward : 25) + 15, 0),
      weeklyActivity: buildWeeklyActivity(filtered)
    };
  }
}

function buildWeeklyActivity(progress: any[]) {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const now  = new Date();
  return days.map((day, i) => {
    const count = progress.filter(p => new Date(p.lastAccessed).getDay() === i).length;
    return { day, count, xp: count * 40 };
  });
}

export const lessonService = new LessonService();
