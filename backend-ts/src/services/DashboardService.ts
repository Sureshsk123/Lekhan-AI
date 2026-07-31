import { prisma } from '../server';

export class DashboardService {
  async getDashboardData(userId: string, languageCode?: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true, firstName: true, lastName: true, email: true,
        xp: true, coins: true, streak: true,
        avatarUrl: true
      }
    });
    if (!user) throw new Error('User not found');

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

    // Recent lesson progress
    let recentProgress = await prisma.progress.findMany({
      where: { userId },
      take: 20,
      orderBy: { lastAccessed: 'desc' },
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
      }
    });

    if (actualCode) {
      recentProgress = recentProgress.filter(p => p.lesson.topic.module.course.language.code === actualCode);
    }
    recentProgress = recentProgress.slice(0, 5);

    let completedProgress = await prisma.progress.findMany({
      where: { userId, isCompleted: true },
      include: { lesson: { include: { topic: { include: { module: { include: { course: { include: { language: true } } } } } } } } }
    });

    if (actualCode) {
      completedProgress = completedProgress.filter(p => p.lesson.topic.module.course.language.code === actualCode);
    }

    const totalCompleted = completedProgress.length;
    const xpFromLessons = completedProgress.reduce(
      (s: number, p: any) => {
        const lessonXp = (p.lesson.xpReward && p.lesson.xpReward > 0) ? p.lesson.xpReward : 25;
        const quizXp = 15; // Assume 15 for passed quiz if lesson is completed
        return s + lessonXp + quizXp;
      }, 0
    );

    // Quiz attempts (Keep global or filter by language if possible. Quizzes are linked to lessons, which have languages)
    const attempts = await prisma.attempt.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: { quiz: { select: { title: true, lesson: { include: { topic: { include: { module: { include: { course: { include: { language: true } } } } } } } } } } }
    });

    let filteredAttempts = attempts;
    if (actualCode) {
      filteredAttempts = attempts.filter(a => a.quiz?.lesson?.topic?.module?.course?.language?.code === actualCode);
    }

    const languageXp = actualCode ? xpFromLessons : user.xp;
    const level = Math.max(1, Math.floor(languageXp / 100) + 1);

    // Weekly heatmap
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    let weekProgress = await prisma.progress.findMany({
      where: { userId, lastAccessed: { gte: sevenDaysAgo } },
      include: { lesson: { include: { topic: { include: { module: { include: { course: { include: { language: true } } } } } } } } }
    });

    if (actualCode) {
      weekProgress = weekProgress.filter(p => p.lesson.topic.module.course.language.code === actualCode);
    }

    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const heatmap = days.map((day, i) => ({
      day,
      count: weekProgress.filter((p: any) => new Date(p.lastAccessed).getDay() === i).length,
      xp:    weekProgress.filter((p: any) => new Date(p.lastAccessed).getDay() === i).length * 40
    }));

    // Recommended lessons (not yet started)
    const completedIds: string[] = completedProgress.map((p: any) => p.lessonId);

    const recommendedWhere: any = completedIds.length > 0
        ? { id: { notIn: completedIds } }
        : {};
        
    let recommended = await prisma.lesson.findMany({
      where: recommendedWhere,
      take: 10,
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
      },
      orderBy: { order: 'asc' }
    });

    if (actualCode) {
      recommended = recommended.filter(l => l.topic.module.course.language.code === actualCode);
    }
    recommended = recommended.slice(0, 3);

    const inventory = await prisma.userReward.count({ where: { userId } });

    return {
      user: { 
        ...user, 
        fullName: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
        title: 'Beginner', // Synthesize title based on level or default
        level, 
        totalCompleted, 
        inventoryCount: inventory 
      },
      stats: {
        xp: languageXp, coins: user.coins, streak: user.streak,
        level, totalCompleted, quizzesAttempted: filteredAttempts.length
      },
      xpMetrics: {
        totalXP:  languageXp,
        weeklyXP: heatmap.reduce((s: number, d: any) => s + d.xp, 0),
        dailyXP:  heatmap[new Date().getDay()]?.xp || 0
      },
      recentActivity: recentProgress.map((p: any) => ({
        lessonId:    p.lessonId,
        lessonTitle: p.lesson.title,
        language:    p.lesson.topic.module.course.language.name,
        status:      p.isCompleted ? 'COMPLETED' : 'IN_PROGRESS',
        date:        p.lastAccessed
      })),
      recentAttempts: filteredAttempts.map((a: any) => ({
        quizTitle: a.quiz.title,
        score:     a.score,
        passed:    a.passed,
        date:      a.createdAt
      })),
      heatmap,
      recommended: recommended.map((l: any) => ({
        id:       l.id,
        title:    l.title,
        type:     l.type,
        language: l.topic.module.course.language.code,
        xpReward: l.xpReward
      }))
    };
  }
}

export const dashboardService = new DashboardService();
