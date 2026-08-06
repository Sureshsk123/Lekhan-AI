import { prisma } from '../server';
import { AppError } from '../middlewares/errorHandler';

export class QuizService {
  async getQuizData(quizId: string) {
    // Check if quizId is a lessonId (for lesson-linked quizzes)
    let quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
      include: {
        lesson: { select: { id: true, title: true, xpReward: true } },
        questions: {
          include: {
            answers: { select: { id: true, text: true } } // Never send isCorrect to client
          },
          orderBy: { id: 'asc' }
        }
      }
    });

    // If not found by quizId, try looking for a quiz linked to this lessonId
    if (!quiz) {
      quiz = await prisma.quiz.findFirst({
        where: { lessonId: quizId },
        include: {
          lesson: { select: { id: true, title: true, xpReward: true } },
          questions: {
            include: {
              answers: { select: { id: true, text: true } }
            },
            orderBy: { id: 'asc' }
          }
        }
      });
    }

    if (!quiz) throw new AppError('Quiz not found', 404);

    // Shuffle answers for each question
    const shuffled = {
      ...quiz,
      questions: quiz.questions.map(q => ({
        ...q,
        answers: [...q.answers].sort(() => Math.random() - 0.5)
      }))
    };

    return shuffled;
  }

  async evaluateAttempt(
    userId: string,
    quizId: string,
    answers: { questionId: string; answerId: string }[]
  ) {
    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
      include: {
        questions: { include: { answers: true } },
        lesson: { select: { xpReward: true, id: true } }
      }
    });

    if (!quiz) throw new AppError('Quiz not found', 404);
    if (quiz.questions.length === 0) throw new AppError('Quiz has no questions', 400);

    const totalQuestions = quiz.questions.length;
    let correctCount = 0;

    const questionResults = quiz.questions.map(question => {
      const submitted = answers.find(a => a.questionId === question.id);
      const correctAnswer = question.answers.find(a => a.isCorrect);
      const isCorrect = submitted && correctAnswer
        ? submitted.answerId === correctAnswer.id
        : false;

      if (isCorrect) correctCount++;

      return {
        questionId:       question.id,
        questionText:     question.text,
        submittedAnswerId: submitted?.answerId || null,
        correctAnswerId:  correctAnswer?.id || null,
        correctAnswerText: correctAnswer?.text || null,
        isCorrect
      };
    });

    const score  = Math.round((correctCount / totalQuestions) * 100);
    const passed = score >= 60; // Lowered to 60% per requirement

    // Record attempt
    const attempt = await prisma.attempt.create({
      data: { userId, quizId, score, passed }
    });

    const xpEarned = passed ? ((quiz.xpReward && quiz.xpReward > 0) ? quiz.xpReward : 15) : 0;
    const coinsEarned = Math.floor(xpEarned / 2);

    // Check if this is the FIRST time the user passed this quiz
    const passedCount = await prisma.attempt.count({
      where: { userId, quizId, passed: true }
    });

    const isFirstPass = passed && passedCount === 1;
    const finalXpEarned = isFirstPass ? xpEarned : 0;
    const finalCoinsEarned = isFirstPass ? coinsEarned : 0;

    // Award XP and coins only on first pass
    if (isFirstPass && finalXpEarned > 0) {
      await prisma.user.update({
        where: { id: userId },
        data: {
          xp: { increment: finalXpEarned },
          coins: { increment: finalCoinsEarned }
        }
      });
    }

    // Automatically complete linked lesson on quiz pass
    if (passed && quiz.lessonId) {
      await prisma.progress.upsert({
        where: { userId_lessonId: { userId, lessonId: quiz.lessonId } },
        create: { userId, lessonId: quiz.lessonId, isCompleted: true, status: 'COMPLETED' },
        update: { isCompleted: true, status: 'COMPLETED' }
      });
    }

    return {
      attemptId: attempt.id, score, passed, correctCount, totalQuestions,
      xpEarned: finalXpEarned, coinsEarned: finalCoinsEarned, isFirstPass, questionResults,
      lessonId: quiz.lessonId
    };
  }

  async getAttemptHistory(userId: string, limit = 10) {
    return prisma.attempt.findMany({
      where: { userId },
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        quiz: {
          select: {
            id: true,
            title: true,
            lesson: { select: { id: true, title: true } }
          }
        }
      }
    });
  }

  async getQuizByLesson(lessonId: string) {
    const quiz = await prisma.quiz.findFirst({
      where: { lessonId },
      include: {
        questions: {
          include: { answers: { select: { id: true, text: true } } },
          orderBy: { id: 'asc' }
        }
      }
    });
    if (!quiz) throw new AppError('No quiz found for this lesson', 404);
    return quiz;
  }
}

export const quizService = new QuizService();
