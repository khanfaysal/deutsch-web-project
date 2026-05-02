"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { motion } from 'framer-motion';
import { ArrowLeft, BookOpen, CheckCircle, Play, Lock, Loader2, GraduationCap } from 'lucide-react';
import Link from 'next/link';
import { fetchLessonsByLevel } from '@/lib/api';

interface Lesson {
  id: string;
  title: string;
  level: string;
  content: string;
  audioUrl?: string;
  completed?: boolean;
  locked?: boolean;
}

const levelMetadata: Record<string, { title: string; description: string; color: string; gradient: string }> = {
  'A1': {
    title: 'Beginner (Anfänger)',
    description: 'Master basic greetings, numbers, and simple present tense. Your first steps into the German language.',
    color: 'text-emerald-400',
    gradient: 'from-emerald-500/20 via-emerald-500/5 to-transparent',
  },
  'A2': {
    title: 'Elementary (Grundlagen)',
    description: 'Learn to talk about your day, shopping, and past events. Build on your foundations.',
    color: 'text-sky-400',
    gradient: 'from-sky-500/20 via-sky-500/5 to-transparent',
  },
  'B1': {
    title: 'Intermediate (Mittelstufe)',
    description: 'Express opinions and deal with most travel situations. You\'re becoming conversational.',
    color: 'text-violet-400',
    gradient: 'from-violet-500/20 via-violet-500/5 to-transparent',
  },
  'B2': {
    title: 'Upper Intermediate (Obere Mittelstufe)',
    description: 'Discuss complex topics and abstract ideas with confidence.',
    color: 'text-amber-400',
    gradient: 'from-amber-500/20 via-amber-500/5 to-transparent',
  },
  'C1': {
    title: 'Advanced (Fortgeschritten)',
    description: 'Use language flexibly for social, academic, and professional purposes.',
    color: 'text-rose-400',
    gradient: 'from-rose-500/20 via-rose-500/5 to-transparent',
  },
  'C2': {
    title: 'Mastery (Kompetente Sprachverwendung)',
    description: 'Near-native fluency in all situations. The summit of language mastery.',
    color: 'text-fuchsia-400',
    gradient: 'from-fuchsia-500/20 via-fuchsia-500/5 to-transparent',
  },
};

const LevelLessonsPage = () => {
  const { level } = useParams();
  const router = useRouter();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const levelKey = (level as string)?.toUpperCase();
  const meta = levelMetadata[levelKey] || {
    title: `Level ${levelKey}`,
    description: 'Explore lessons at this level.',
    color: 'text-secondary',
    gradient: 'from-secondary/20 via-secondary/5 to-transparent',
  };

  useEffect(() => {
    if (!level) return;
    const loadLessons = async () => {
      try {
        const data = await fetchLessonsByLevel(level as string);
        setLessons(data.map((l: Lesson) => ({ ...l, locked: false })));
      } catch (err) {
        setError('Failed to load lessons for this level.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadLessons();
  }, [level]);

  const completedCount = lessons.filter(l => l.completed).length;

  return (
    <main className="min-h-screen pb-24">
      <Navbar />

      {/* Hero Section */}
      <section className={`pt-32 pb-16 px-6 bg-gradient-to-b ${meta.gradient}`}>
        <div className="max-w-5xl mx-auto">
          <button
            onClick={() => router.push('/lessons')}
            className="text-muted-foreground hover:text-primary mb-8 flex items-center gap-2 transition-colors"
          >
            <ArrowLeft size={18} /> All Lessons
          </button>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-5 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-secondary/30">
                {levelKey}
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl font-black leading-tight">{meta.title}</h1>
                <p className="text-muted-foreground mt-2 max-w-xl">{meta.description}</p>
              </div>
            </div>

            {/* Progress bar */}
            {lessons.length > 0 && (
              <div className="mt-8 max-w-md">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-bold">{completedCount}/{lessons.length} lessons</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-secondary to-accent rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${lessons.length > 0 ? (completedCount / lessons.length) * 100 : 0}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                  />
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Lessons List */}
      <section className="px-6 -mt-4">
        <div className="max-w-5xl mx-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <Loader2 className="animate-spin text-secondary" size={48} />
              <p className="text-muted-foreground animate-pulse">Loading {levelKey} lessons...</p>
            </div>
          ) : error ? (
            <div className="bg-red-500/10 border border-red-500/20 p-8 rounded-3xl text-center">
              <p className="text-red-500 font-bold mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="bg-red-500 text-white px-6 py-2 rounded-xl font-bold"
              >
                Retry
              </button>
            </div>
          ) : lessons.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass p-16 rounded-3xl text-center"
            >
              <GraduationCap size={64} className="mx-auto text-muted-foreground mb-6 opacity-50" />
              <h2 className="text-2xl font-bold mb-3">No lessons yet for {levelKey}</h2>
              <p className="text-muted-foreground mb-8">Lessons for this level are coming soon. Check back later!</p>
              <Link
                href="/lessons"
                className="bg-primary text-background px-8 py-3 rounded-2xl font-bold hover:opacity-90 transition-opacity"
              >
                Browse All Levels
              </Link>
            </motion.div>
          ) : (
            <div className="grid gap-4">
              {lessons.map((lesson, idx) => (
                <motion.div
                  key={lesson.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: idx * 0.06 }}
                >
                  <div
                    className={`glass p-6 rounded-2xl flex items-center justify-between group transition-all ${
                      lesson.locked
                        ? 'opacity-60 grayscale cursor-not-allowed'
                        : 'hover:bg-white dark:hover:bg-card hover:translate-x-1'
                    }`}
                  >
                    <div className="flex items-center gap-6">
                      <div className="relative">
                        <div
                          className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-black ${
                            lesson.completed
                              ? 'bg-green-500/10 text-green-500'
                              : 'bg-muted text-muted-foreground'
                          }`}
                        >
                          {lesson.completed ? (
                            <CheckCircle size={24} />
                          ) : (
                            <span className="text-sm">{String(idx + 1).padStart(2, '0')}</span>
                          )}
                        </div>
                        {/* Connector line */}
                        {idx < lessons.length - 1 && (
                          <div className="absolute left-1/2 top-full w-px h-4 bg-border -translate-x-1/2" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">{lesson.title}</h3>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {lesson.content?.substring(0, 80)}...
                        </p>
                      </div>
                    </div>

                    {lesson.locked ? (
                      <Lock size={18} className="text-muted-foreground" />
                    ) : (
                      <Link
                        href={`/lessons/view/${lesson.id}`}
                        className="bg-primary text-background px-5 py-2.5 rounded-xl text-sm font-bold opacity-0 group-hover:opacity-100 transition-all hover:scale-105 flex items-center gap-2"
                      >
                        <Play size={14} fill="currentColor" />
                        {lesson.completed ? 'Review' : 'Start'}
                      </Link>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default LevelLessonsPage;
