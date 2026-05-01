import 'dotenv/config';
import { PrismaClient, Level } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.progress.deleteMany();
  await prisma.quiz.deleteMany();
  await prisma.vocabulary.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.user.deleteMany();

  console.log('Seeding data...');

  // Create a Sample User
  const user = await prisma.user.create({
    data: {
      name: 'Test Student',
      email: 'student@example.com',
      password: 'hashed_password_here', // In a real app, hash this!
      role: 'STUDENT',
      progressLevel: 'A1',
    },
  });

  // Create Lessons
  const lesson1 = await prisma.lesson.create({
    data: {
      title: 'Greetings & Introductions',
      level: 'A1',
      content: 'Learn how to say hello, goodbye, and introduce yourself in German.',
      audioUrl: 'https://example.com/audio/greetings.mp3',
    },
  });

  // Create Vocabulary
  await prisma.vocabulary.createMany({
    data: [
      {
        word: 'Herausforderung',
        meaning: 'Challenge',
        example: 'Deutsch zu lernen ist eine große Herausforderung.',
        level: 'B2',
      },
      {
        word: 'Fernweh',
        meaning: 'Wanderlust',
        example: 'Ich habe Fernweh und möchte nach Berlin reisen.',
        level: 'A2',
      },
    ],
  });

  // Create Quizzes
  await prisma.quiz.create({
    data: {
      question: "How do you say 'Hello' in German?",
      options: ["Hallo", "Guten Tag", "Moin", "Servus"],
      correctAnswer: "Hallo",
      context: "'Hallo' is the most common way to say hello in German.",
      lessonId: lesson1.id,
    },
  });

  console.log('Seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
