"use client";

import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import { motion } from 'framer-motion';
import { BookOpen, CheckCircle, Lock, Play, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { fetchLessons } from '@/lib/api';

interface Lesson {
  id: string;
  title: string;
  level: string;
  content: string;
  audioUrl?: string;
  completed?: boolean;
  locked?: boolean;
  duration?: string;
}

interface LevelGroup {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
}

const levelMetadata: Record<string, { title: string, description: string }> = {
  'A1': { title: 'Beginner (Anfänger)', description: 'Master basic greetings, numbers, and simple present tense.' },
  'A2': { title: 'Elementary (Grundlagen)', description: 'Learn to talk about your day, shopping, and past events.' },
  'B1': { title: 'Intermediate (Mittelstufe)', description: 'Can express opinions and deal with most travel situations.' },
  'B2': { title: 'Upper Intermediate (Obere Mittelstufe)', description: 'Can talk about complex topics and abstract ideas.' },
  'C1': { title: 'Advanced (Fortgeschritten)', description: 'Can use language flexibly for social and professional purposes.' },
  'C2': { title: 'Mastery (Kompetente Sprachverwendung)', description: 'Near-native fluency in all situations.' },
};

const LessonsPage = () => {
  const [levelGroups, setLevelGroups] = useState<LevelGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadLessons = async () => {
      try {
        const data = await fetchLessons();
        
        // Group lessons by level
        const groups: Record<string, Lesson[]> = {};
        data.forEach((lesson: Lesson) => {
          if (!groups[lesson.level]) groups[lesson.level] = [];
          groups[lesson.level].push({
            ...lesson,
            duration: '15 min', // Placeholder since it's not in DB yet
            completed: false, // Mock for now
            locked: false, // Mock for now
          });
        });

        const formattedGroups = Object.keys(groups).sort().map(levelId => ({
          id: levelId,
          title: levelMetadata[levelId]?.title || levelId,
          description: levelMetadata[levelId]?.description || '',
          lessons: groups[levelId] || [],
        }));

        setLevelGroups(formattedGroups);
      } catch (err) {
        setError('Failed to load lessons. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadLessons();
  }, []);

  return (
    <main className="min-h-screen pt-24">
      <Navbar />
      <div className="max-w-5xl mx-auto px-6 py-12">
        <header className="mb-20 text-center max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block px-4 py-1.5 rounded-full bg-secondary/10 text-secondary text-xs font-black uppercase tracking-[0.2em] mb-6 border border-secondary/20"
          >
            Lernpfad
          </motion.div>
          <h1 className="text-6xl font-black mb-6 tracking-tight">Your Learning Path</h1>
          <p className="text-xl text-muted-foreground leading-relaxed">Systematic German acquisition from A1 to C2. Master the language with precision.</p>
        </header>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-6">
            <div className="relative w-16 h-16">
              <Loader2 className="animate-spin text-secondary absolute inset-0" size={64} />
              <div className="absolute inset-0 bg-secondary/20 blur-xl animate-pulse rounded-full" />
            </div>
            <p className="text-muted-foreground font-bold tracking-widest animate-pulse">SYNCHRONIZING CONTENT...</p>
          </div>
        ) : error ? (
          <div className="glass p-12 rounded-[2.5rem] border-red-500/20 text-center max-w-2xl mx-auto">
            <p className="text-red-500 font-bold text-lg mb-6">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-red-500 text-white px-10 py-3 rounded-2xl font-black hover:scale-105 transition-all shadow-xl shadow-red-500/20"
            >
              System Restart
            </button>
          </div>
        ) : (
          <div className="grid gap-16">
            {levelGroups.map((level, levelIdx) => (
              <section key={level.id} className="relative">
                <div className="absolute left-6 top-24 bottom-0 w-px bg-gradient-to-b from-border to-transparent -z-10" />
                
                <Link href={`/lessons/${level.id}`} className="flex items-center gap-6 mb-10 group inline-flex">
                  <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center text-white font-black text-2xl shadow-2xl group-hover:scale-110 transition-all duration-500 shadow-secondary/20">
                    {level.id}
                  </div>
                  <div>
                    <h2 className="text-3xl font-black group-hover:text-secondary transition-colors tracking-tight">{level.title}</h2>
                    <p className="text-muted-foreground font-medium">{level.description}</p>
                  </div>
                </Link>

                <div className="grid gap-5 pl-12 md:pl-20">
                  {level.lessons.map((lesson, lessonIdx) => (
                    <motion.div 
                      key={lesson.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: (levelIdx * 0.1) + (lessonIdx * 0.05) }}
                    >
                      <div className={`glass p-8 rounded-[2rem] flex items-center justify-between group transition-all duration-500 relative overflow-hidden ${lesson.locked ? 'opacity-40 grayscale cursor-not-allowed' : 'hover:bg-white dark:hover:bg-card hover:translate-x-2 border-white/5 hover:border-secondary/30'}`}>
                        <div className="flex items-center gap-8 relative z-10">
                          <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-500 ${lesson.completed ? 'bg-green-500 text-white shadow-lg shadow-green-500/20' : 'bg-muted text-muted-foreground group-hover:bg-secondary/10 group-hover:text-secondary'}`}>
                            {lesson.completed ? <CheckCircle size={24} /> : <Play size={24} className="ml-1" />}
                          </div>
                          <div>
                            <p className="text-xs font-black text-secondary uppercase tracking-widest mb-1">Lektion {lessonIdx + 1}</p>
                            <h3 className="text-xl font-bold tracking-tight">{lesson.title}</h3>
                          </div>
                        </div>

                        {!lesson.locked && (
                          <Link 
                            href={`/lessons/view/${lesson.id}`}
                            className="bg-primary text-background px-8 py-3 rounded-2xl text-sm font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all hover:scale-105 shadow-xl relative z-10"
                          >
                            Start
                          </Link>
                        )}
                        
                        {/* Background subtle number */}
                        <span className="absolute right-8 top-1/2 -translate-y-1/2 text-9xl font-black text-white/[0.02] pointer-events-none select-none">
                          {lessonIdx + 1}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default LessonsPage;
