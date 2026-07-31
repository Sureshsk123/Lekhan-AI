import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const lesson = await prisma.lesson.findFirst();
  console.log('Lesson:', lesson);
}
main().catch(console.error).finally(() => prisma.$disconnect());
