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

    const existingProgress = await prisma.progress.findUnique({
      where: { userId_lessonId: { userId, lessonId } }
    });
    const isFirstCompletion = !existingProgress || (!existingProgress.isCompleted && existingProgress.status !== 'COMPLETED');

    const lessonXp = (lesson.xpReward && lesson.xpReward > 0) ? lesson.xpReward : 25;
    const coinsReward = Math.floor(lessonXp / 2);

    const finalXpEarned = isFirstCompletion ? lessonXp : 0;
    const finalCoinsEarned = isFirstCompletion ? coinsReward : 0;

    await prisma.$transaction(async (tx) => {
      await tx.progress.upsert({
        where: { userId_lessonId: { userId, lessonId } },
        create: { userId, lessonId, isCompleted: true, status: 'COMPLETED' },
        update: { isCompleted: true, status: 'COMPLETED' }
      });

      if (isFirstCompletion && finalXpEarned > 0) {
        await tx.user.update({
          where: { id: userId },
          data: {
            xp: { increment: finalXpEarned },
            coins: { increment: finalCoinsEarned }
          }
        });
      }
    });

    try {
      const now = new Date();
      const streakRecord = await prisma.dailyStreak.findUnique({ where: { userId } });
      if (!streakRecord) {
        await prisma.dailyStreak.create({
          data: { userId, currentStreak: 1, longestStreak: 1, lastActiveAt: now }
        });
        await prisma.user.update({ where: { id: userId }, data: { streak: 1 } });
      } else if (streakRecord.lastActiveAt) {
        const lastActive = new Date(streakRecord.lastActiveAt);
        const isSameDay = lastActive.toDateString() === now.toDateString();
        if (!isSameDay) {
          const isYesterday = (now.getTime() - lastActive.getTime()) <= (48 * 60 * 60 * 1000);
          const newStreak = isYesterday ? streakRecord.currentStreak + 1 : 1;
          const newLongest = Math.max(streakRecord.longestStreak, newStreak);
          await prisma.dailyStreak.update({
            where: { userId },
            data: { currentStreak: newStreak, longestStreak: newLongest, lastActiveAt: now }
          });
          await prisma.user.update({ where: { id: userId }, data: { streak: newStreak } });
        }
      }
    } catch (streakErr) {
      console.error('Streak update error:', streakErr);
    }

    let nextLessonId: string | null = null;
    const topicLessons = lesson.topic?.lessons || [];
    const currentIdx = topicLessons.findIndex((l: any) => l.id === lessonId);
    if (currentIdx !== -1 && currentIdx + 1 < topicLessons.length) {
      nextLessonId = topicLessons[currentIdx + 1]!.id;
    } else {
      const allTopics = lesson.topic?.module?.topics || [];
      const topicIdx = allTopics.findIndex((t: any) => t.id === lesson.topic?.id);
      if (topicIdx !== -1 && topicIdx + 1 < allTopics.length) {
        const nextTopic = allTopics[topicIdx + 1];
        if (nextTopic && nextTopic.lessons && nextTopic.lessons.length > 0) {
          nextLessonId = nextTopic.lessons[0]!.id;
        }
      }
    }

    return {
      message: 'Lesson completed',
      xpEarned: finalXpEarned,
      coinsEarned: finalCoinsEarned,
      isFirstCompletion,
      lessonId,
      nextLessonId
    };
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
      orderBy: { createdAt: 'desc' }
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

    const completed = filtered.filter(p => p.isCompleted || p.status === 'COMPLETED');

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
