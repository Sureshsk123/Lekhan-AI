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

const dbUrl = (process.env.DIRECT_URL || process.env.DATABASE_URL || '').replace(/([?&])sslmode=[^&]*&?/, '$1').replace(/[?&]$/, '');
const isExternalDb = dbUrl.includes('supabase') || dbUrl.includes('pooler.supabase.com');

const pool = new Pool({
  connectionString: dbUrl,
  ...(isExternalDb && { ssl: { rejectUnauthorized: false } }),
});

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
  console.log('🌱 Starting V1.0 database seed to Supabase...');

  // Clear existing data safely
  console.log('🗑️  Clearing existing data...');
  try {
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
    console.log('✅ Cleared existing data');
  } catch (err) {
    console.warn('⚠️ Clear data notice (continuing seed):', (err as any).message || err);
  }

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
          data: {
            courseId: course.id,
            title: moduleData.moduleTitle,
            description: `Module ${mi + 1} of ${lang.name} ${levelEnum}`,
            order: mi + 1
          }
        });

        const topics = moduleData.topics || [];
        for (let ti = 0; ti < topics.length; ti++) {
          const topicData = topics[ti];
          const dbTopic = await prisma.topic.create({
            data: {
              moduleId: dbModule.id,
              title: topicData.topicTitle,
              order: ti + 1
            }
          });

          const lessons = topicData.lessons || [];
          for (let lei = 0; lei < lessons.length; lei++) {
            const lessonData = lessons[lei];
            const dbLesson = await prisma.lesson.create({
              data: {
                topicId: dbTopic.id,
                title: lessonData.title,
                content: lessonData.content || `Content for ${lessonData.title}`,
                type: lessonData.type || 'VOCABULARY',
                xpReward: lessonData.xpReward || 15,
                order: lei + 1
              }
            });
            totalLessons++;

            // Create exercises
            const exercises = lessonData.exercises || [];
            for (let ei = 0; ei < exercises.length; ei++) {
              const exData = exercises[ei];
              await prisma.exercise.create({
                data: {
                  lessonId: dbLesson.id,
                  type: exData.type || 'VOCABULARY',
                  content: JSON.stringify(exData.content || {})
                }
              });
            }

            // Create quiz for lesson
            const quizQuestions = lessonData.quizQuestions || [];
            if (quizQuestions.length > 0) {
              const dbQuiz = await prisma.quiz.create({
                data: {
                  lesson: { connect: { id: dbLesson.id } },
                  title: `${lessonData.title} — Practice Quiz`,
                  type: 'STANDARD',
                  xpReward: 15
                }
              });

              for (const qq of quizQuestions) {
                const dbQuestion = await prisma.question.create({
                  data: {
                    quizId: dbQuiz.id,
                    text: qq.text,
                    type: 'MULTIPLE_CHOICE'
                  }
                });
                totalQuestions++;

                const answers = qq.answers || [];
                for (const ans of answers) {
                  await prisma.answer.create({
                    data: {
                      questionId: dbQuestion.id,
                      text: ans.text,
                      isCorrect: ans.isCorrect || false
                    }
                  });
                }
              }
            }
          }
        }
      }
    }
  }

  // Seed Stories
  console.log('\n📚 Seeding Stories...');
  for (const [langCode, stories] of Object.entries(STORIES_DATA)) {
    const dbLang = await prisma.language.findUnique({ where: { code: langCode } });
    if (!dbLang || !Array.isArray(stories)) continue;

    for (const storyData of stories) {
      const story = await prisma.story.create({
        data: {
          languageCode: langCode,
          title: storyData.title,
          description: storyData.description || null,
          level: storyData.level || 'BEGINNER',
        }
      });
      totalStories++;

      const pages = storyData.pages || [];
      for (let pi = 0; pi < pages.length; pi++) {
        const pageData = pages[pi];
        await prisma.storyPage.create({
          data: {
            storyId: story.id,
            pageNumber: pi + 1,
            text: pageData.text,
            translation: pageData.translation || null,
            imageUrl: pageData.imageUrl || null
          }
        });
      }
    }
  }

  console.log(`\n🎉 Seed completed successfully!`);
  console.log(`   - Total Lessons: ${totalLessons}`);
  console.log(`   - Total Questions: ${totalQuestions}`);
  console.log(`   - Total Stories: ${totalStories}`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
    await pool.end();
  })
  .catch(async (e) => {
    console.error('❌ Seed error:', e);
    await prisma.$disconnect();
    await pool.end();
    process.exit(1);
  });
