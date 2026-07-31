import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config';
import { EN_CURRICULUM } from './data/curriculum-en';
import { TA_CURRICULUM } from './data/curriculum-ta';
import { HI_CURRICULUM } from './data/curriculum-hi';
import { TE_CURRICULUM } from './data/curriculum-te';
import { ML_CURRICULUM } from './data/curriculum-ml';
import { KN_CURRICULUM } from './data/curriculum-kn';
import { STORIES_DATA } from './data/stories';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const LANGUAGES = [
  { code: 'en', name: 'English', flagUrl: '🇬🇧', curriculum: EN_CURRICULUM },
  { code: 'ta', name: 'Tamil', flagUrl: '🇮🇳', curriculum: TA_CURRICULUM },
  { code: 'hi', name: 'Hindi', flagUrl: '🇮🇳', curriculum: HI_CURRICULUM },
  { code: 'te', name: 'Telugu', flagUrl: '🇮🇳', curriculum: TE_CURRICULUM },
  { code: 'ml', name: 'Malayalam', flagUrl: '🇮🇳', curriculum: ML_CURRICULUM },
  { code: 'kn', name: 'Kannada', flagUrl: '🇮🇳', curriculum: KN_CURRICULUM },
];

const SHOP_ITEMS = [
  { name: 'Dark Theme', description: 'Unlock the sleek dark mode.', cost: 200, category: 'themes', icon: '🌙' },
  { name: 'Ocean Theme', description: 'A calming ocean-blue theme.', cost: 150, category: 'themes', icon: '🌊' },
  { name: 'Language Master Title', description: 'Show off your progress.', cost: 250, category: 'titles', icon: '🎓' },
  { name: 'XP Booster 2x', description: 'Double your XP for 5 lessons.', cost: 50, category: 'boosters', icon: '⚡' },
  { name: 'Streak Shield', description: 'Protect your streak for 1 day.', cost: 75, category: 'boosters', icon: '🛡️' },
  { name: 'Coin Magnet', description: 'Earn 50% more coins for 24h.', cost: 100, category: 'boosters', icon: '🧲' },
  { name: 'First Lesson Badge', description: 'Completed your first lesson!', cost: 0, category: 'badges', icon: '🎖️' },
  { name: 'Week Streak Badge', description: '7-day learning streak.', cost: 0, category: 'badges', icon: '🔥' },
  { name: 'Quiz Champion', description: 'Scored 100% on a quiz.', cost: 0, category: 'badges', icon: '🏆' },
  { name: 'Polyglot Badge', description: 'Studied 3+ languages.', cost: 0, category: 'badges', icon: '🌍' },
];

async function main() {
  console.log('🌱 Starting V1.0 database seed...');

  // Clear existing data
  console.log('🗑️  Clearing existing data...');
  await prisma.storyPage.deleteMany({});
  await prisma.story.deleteMany({});
  await prisma.answer.deleteMany({});
  await prisma.question.deleteMany({});
  await prisma.quiz.deleteMany({});
  await prisma.exercise.deleteMany({});
  await prisma.lesson.deleteMany({});
  await prisma.topic.deleteMany({});
  await prisma.module.deleteMany({});
  await prisma.course.deleteMany({});
  await prisma.language.deleteMany({});
  await prisma.reward.deleteMany({});

  // Create roles
  const studentRole = await prisma.role.upsert({ where: { name: 'student' }, update: {}, create: { name: 'student' } });
  const adminRole = await prisma.role.upsert({ where: { name: 'admin' }, update: {}, create: { name: 'admin' } });
  console.log('✅ Roles upserted');

  // Seed Shop Items
  await prisma.reward.createMany({ data: SHOP_ITEMS });
  console.log(`✅ ${SHOP_ITEMS.length} shop items seeded`);

  let totalLessons = 0;
  let totalQuestions = 0;
  let totalStories = 0;

  for (const lang of LANGUAGES) {
    const dbLang = await prisma.language.create({
      data: { code: lang.code, name: lang.name, flagUrl: lang.flagUrl }
    });
    console.log(`\n🌍 Seeding ${lang.name}...`);

    const levelKeys = ['beginner', 'intermediate', 'advanced'] as const;
    const levelEnums = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'] as const;

    for (let li = 0; li < levelKeys.length; li++) {
      const levelKey = levelKeys[li]!;
      const levelEnum = levelEnums[li]!;
      const modules = ((lang.curriculum as any)[levelKey] as any[]) || [];

      const course = await prisma.course.create({
        data: {
          languageId: dbLang.id,
          title: `${lang.name} — ${levelEnum}`,
          level: levelEnum,
          description: `Complete ${levelEnum.toLowerCase()} course for ${lang.name}`
        }
      });

      for (let mi = 0; mi < modules.length; mi++) {
        const moduleData = modules[mi];
        const dbModule = await prisma.module.create({
          data: { courseId: course.id, title: moduleData.moduleTitle, order: mi + 1 }
        });

        for (let ti = 0; ti < moduleData.topics.length; ti++) {
          const topicData = moduleData.topics[ti];
          const dbTopic = await prisma.topic.create({
            data: { moduleId: dbModule.id, title: topicData.topicTitle, order: ti + 1 }
          });

          for (let lsi = 0; lsi < topicData.lessons.length; lsi++) {
            const lessonData = topicData.lessons[lsi];
            const dbLesson = await prisma.lesson.create({
              data: {
                topicId: dbTopic.id,
                title: lessonData.title,
                content: lessonData.content,
                type: lessonData.type,
                xpReward: lessonData.xpReward,
                order: lsi + 1
              }
            });
            totalLessons++;

            // Create exercises
            if (lessonData.exercises) {
              for (const ex of lessonData.exercises) {
                await prisma.exercise.create({
                  data: {
                    lessonId: dbLesson.id,
                    type: ex.type,
                    content: JSON.stringify(ex.content)
                  }
                });
              }
            }

            // Create quiz with questions
            if (lessonData.quizQuestions && lessonData.quizQuestions.length > 0) {
              const dbQuiz = await prisma.quiz.create({
                data: {
                  lessonId: dbLesson.id,
                  title: `${lessonData.title} Quiz`,
                  type: 'LESSON',
                  xpReward: Math.floor(lessonData.xpReward * 0.5)
                }
              });

              for (const q of lessonData.quizQuestions) {
                const dbQuestion = await prisma.question.create({
                  data: { quizId: dbQuiz.id, text: q.text, type: 'MULTIPLE_CHOICE' }
                });
                totalQuestions++;

                await prisma.answer.createMany({
                  data: q.answers.map((a: any) => ({
                    questionId: dbQuestion.id,
                    text: a.text,
                    isCorrect: a.isCorrect
                  }))
                });
              }
            }
          }
        }
      }
    }

    // Seed Stories for this language
    const stories = STORIES_DATA[lang.code] || [];
    for (const storyData of stories) {
      const dbStory = await prisma.story.create({
        data: {
          title: storyData.title,
          description: storyData.description,
          languageCode: lang.code,
          level: storyData.level,
        }
      });

      await prisma.storyPage.createMany({
        data: storyData.pages.map((p: any) => ({
          storyId: dbStory.id,
          pageNumber: p.pageNumber,
          text: p.text,
          translation: p.translation
        }))
      });
      totalStories++;
    }

    console.log(`✅ ${lang.name}: lessons + quizzes + ${stories.length} stories seeded`);
  }

  console.log(`\n✅ SEED COMPLETE:`);
  console.log(`   📚 Total Lessons:   ${totalLessons}`);
  console.log(`   ❓ Total Questions:  ${totalQuestions}`);
  console.log(`   🛍️  Shop Items:      ${SHOP_ITEMS.length}`);
  console.log(`   📖 Stories:         ${totalStories}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
