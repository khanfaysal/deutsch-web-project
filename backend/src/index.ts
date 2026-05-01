import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import authRoutes from './routes/auth.js';
import chatRoutes from './routes/chat.js';
import { authenticate, authorize, AuthRequest } from './middleware/auth.js';

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'DeutschFlow API is running 🇩🇪' });
});

// Lessons Routes
app.get('/api/lessons', async (req: AuthRequest, res) => {
  try {
    const lessons = await prisma.lesson.findMany();
    const token = req.cookies.token;
    let userProgress: any[] = [];
    
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret') as { userId: string };
        userProgress = await prisma.progress.findMany({
          where: { userId: decoded.userId }
        });
      } catch (e) {}
    }

    const lessonsWithProgress = lessons.map(lesson => ({
      ...lesson,
      completed: userProgress.some(p => p.lessonId === lesson.id && p.completed)
    }));

    res.json(lessonsWithProgress);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch lessons' });
  }
});

app.get('/api/lessons/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const lesson = await prisma.lesson.findUnique({
      where: { id },
      include: { quizzes: true }
    });
    if (!lesson) return res.status(404).json({ error: 'Lesson not found' });
    res.json(lesson);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch lesson' });
  }
});

app.post('/api/lessons', authenticate, authorize(['ADMIN']), async (req, res) => {
  try {
    const { title, level, content, audioUrl } = req.body;
    const lesson = await prisma.lesson.create({
      data: { title, level, content, audioUrl }
    });
    res.status(201).json(lesson);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create lesson' });
  }
});

// Vocabulary Routes
app.get('/api/vocabulary', async (req, res) => {
  try {
    const vocab = await prisma.vocabulary.findMany();
    res.json(vocab);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch vocabulary' });
  }
});

app.post('/api/vocabulary', authenticate, authorize(['ADMIN']), async (req, res) => {
  try {
    const { word, meaning, example, level, audioUrl } = req.body;
    const vocab = await prisma.vocabulary.create({
      data: { word, meaning, example, level, audioUrl }
    });
    res.status(201).json(vocab);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create vocabulary' });
  }
});

// Progress Routes
app.post('/api/progress', authenticate, async (req: AuthRequest, res) => {
  try {
    const { lessonId, completed, score } = req.body;
    const userId = req.user!.userId;

    const progress = await prisma.progress.upsert({
      where: {
        userId_lessonId: { userId, lessonId }
      },
      update: { completed, score },
      create: { userId, lessonId, completed, score }
    });

    res.json(progress);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update progress' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
