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
        <header className="mb-12">
          <h1 className="text-4xl font-black mb-4">Your Learning Path</h1>
          <p className="text-muted-foreground">Continue where you left off and reach your German goals.</p>
        </header>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <Loader2 className="animate-spin text-secondary" size={48} />
            <p className="text-muted-foreground animate-pulse">Loading lessons...</p>
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
        ) : (
          <div className="space-y-12">
            {levelGroups.map((level) => (
              <section key={level.id}>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center text-white font-black text-xl">
                    {level.id}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">{level.title}</h2>
                    <p className="text-sm text-muted-foreground">{level.description}</p>
                  </div>
                </div>

                <div className="grid gap-4">
                  {level.lessons.map((lesson) => (
                    <div 
                      key={lesson.id}
                      className={`glass p-6 rounded-2xl flex items-center justify-between group transition-all ${lesson.locked ? 'opacity-60 grayscale cursor-not-allowed' : 'hover:bg-white dark:hover:bg-card hover:translate-x-1'}`}
                    >
                      <div className="flex items-center gap-6">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${lesson.completed ? 'bg-green-500/10 text-green-500' : 'bg-muted text-muted-foreground'}`}>
                          {lesson.completed ? <CheckCircle size={20} /> : <Play size={20} />}
                        </div>
                        <div>
                          <h3 className="font-bold">{lesson.title}</h3>
                          <p className="text-xs text-muted-foreground">{lesson.duration}</p>
                        </div>
                      </div>

                      {lesson.locked ? (
                        <Lock size={18} className="text-muted-foreground" />
                      ) : (
                        <Link 
                          href={`/lessons/view/${lesson.id}`}
                          className="bg-primary text-background px-4 py-2 rounded-xl text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          Start Lesson
                        </Link>
                      )}
                    </div>
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
