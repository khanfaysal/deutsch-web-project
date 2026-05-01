"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { motion } from 'framer-motion';
import { ArrowLeft, BookOpen, CheckCircle, Play, HelpCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { fetchLessonById, updateProgress } from '@/lib/api';

interface Quiz {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  context?: string;
}

interface Lesson {
  id: string;
  title: string;
  level: string;
  content: string;
  audioUrl?: string;
  quizzes: Quiz[];
}

const LessonViewPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCompleting, setIsCompleting] = useState(false);

  useEffect(() => {
    if (!id) return;
    const loadLesson = async () => {
      try {
        const data = await fetchLessonById(id as string);
        setLesson(data);
      } catch (err) {
        setError('Failed to load lesson content.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadLesson();
  }, [id]);

  const handleComplete = async () => {
    if (!lesson) return;
    setIsCompleting(true);
    try {
      await updateProgress({ lessonId: lesson.id, completed: true });
      router.push('/dashboard');
    } catch (err) {
      console.error('Failed to save progress:', err);
      alert('Failed to save progress. Please make sure you are logged in.');
    } finally {
      setIsCompleting(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Loader2 className="w-12 h-12 text-secondary animate-spin" />
    </div>
  );

  if (error || !lesson) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-6">
      <h2 className="text-2xl font-bold text-red-500 mb-4">{error || 'Lesson not found'}</h2>
      <button onClick={() => router.back()} className="text-secondary font-bold hover:underline flex items-center gap-2">
        <ArrowLeft size={20} /> Go Back
      </button>
    </div>
  );

  return (
    <main className="min-h-screen pb-24">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-12 px-6 bg-gradient-to-b from-secondary/10 to-transparent">
        <div className="max-w-4xl mx-auto">
          <button onClick={() => router.back()} className="text-muted-foreground hover:text-primary mb-8 flex items-center gap-2 transition-colors">
            <ArrowLeft size={18} /> Back to Learning Path
          </button>
          
          <div className="flex items-center gap-4 mb-6">
            <span className="bg-secondary text-white px-3 py-1 rounded-lg font-black text-sm">{lesson.level}</span>
            <span className="text-muted-foreground text-sm flex items-center gap-1">
              <BookOpen size={14} /> Lesson
            </span>
          </div>
          
          <h1 className="text-5xl font-black mb-6 leading-tight">{lesson.title}</h1>
          
          {lesson.audioUrl && (
            <button className="flex items-center gap-3 bg-white dark:bg-card px-6 py-3 rounded-2xl shadow-xl hover:scale-105 transition-all group">
              <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-white group-hover:bg-secondary/80">
                <Play size={20} fill="currentColor" />
              </div>
              <span className="font-bold">Listen to Lesson</span>
            </button>
          )}
        </div>
      </section>

      {/* Content Section */}
      <section className="px-6">
        <div className="max-w-4xl mx-auto">
          <div className="glass p-10 rounded-[2rem] border-white/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none" />
            
            <div className="prose prose-invert max-w-none prose-p:text-lg prose-p:leading-relaxed prose-headings:font-black">
              {lesson.content.split('\n').map((para, i) => (
                <p key={i} className="mb-6 opacity-90">{para}</p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Quizzes Section */}
      {lesson.quizzes.length > 0 && (
        <section className="mt-24 px-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-12">
              <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center text-accent">
                <HelpCircle size={24} />
              </div>
              <h2 className="text-3xl font-black">Quick Quiz</h2>
            </div>

            <div className="space-y-8">
              {lesson.quizzes.map((quiz, idx) => (
                <div key={quiz.id} className="glass p-8 rounded-3xl border-white/5">
                  <p className="text-xs font-bold uppercase tracking-widest text-secondary mb-4">Question {idx + 1}</p>
                  <h3 className="text-xl font-bold mb-8">{quiz.question}</h3>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    {quiz.options.map((option) => (
                      <button 
                        key={option}
                        className="p-4 rounded-2xl border border-white/5 bg-white/5 hover:bg-secondary hover:text-white transition-all text-left font-medium"
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-12 text-center">
              <button 
                onClick={handleComplete}
                disabled={isCompleting}
                className="bg-primary text-background px-12 py-5 rounded-2xl font-black text-xl hover:scale-105 transition-all shadow-2xl shadow-primary/20 disabled:opacity-50"
              >
                {isCompleting ? 'Saving...' : 'Complete Lesson'}
              </button>
            </div>
          </div>
        </section>
      )}
    </main>
  );
};

export default LessonViewPage;
