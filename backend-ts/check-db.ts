import { prisma } from './src/server';

async function run() {
  const languages = await prisma.language.findMany();
  console.log("Languages:", languages);
  
  const courses = await prisma.course.findMany({ include: { language: true } });
  console.log("Courses:", courses.map(c => ({ id: c.id, level: c.level, language: c.language?.name, languageCode: c.language?.code })));
  
  process.exit(0);
}
run();
