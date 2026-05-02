"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { motion } from 'framer-motion';
import { ArrowLeft, BookOpen, CheckCircle, Play, HelpCircle, Loader2, Check, X } from 'lucide-react';
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

  const [quizStates, setQuizStates] = useState<Record<string, string>>({});

  const handleQuizOptionClick = (quizId: string, option: string) => {
    if (quizStates[quizId]) return; // already answered
    setQuizStates(prev => ({ ...prev, [quizId]: option }));
  };

  const handleComplete = async () => {
    if (!lesson) return;
    setIsCompleting(true);
    
    // Calculate score
    let score = 0;
    if (lesson.quizzes && lesson.quizzes.length > 0) {
      lesson.quizzes.forEach(quiz => {
        if (quizStates[quiz.id] === quiz.correctAnswer) {
          score++;
        }
      });
    }

    try {
      await updateProgress({ lessonId: lesson.id, completed: true, score });
      router.push('/dashboard');
    } catch (err: any) {
      console.warn('Authentication required to save progress:', err);
      // Redirect to login if user is not authenticated
      const errMsg = (err.message || '').toLowerCase();
      if (errMsg.includes('authentication') || errMsg.includes('session')) {
         alert('Please login to save your progress.');
         router.push('/login');
      } else {
         alert('An error occurred. Please try again.');
      }
    } finally {
      setIsCompleting(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#050505] text-white">
      <Loader2 className="w-16 h-16 text-secondary animate-spin" />
    </div>
  );

  if (error || !lesson) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#050505] text-white p-6">
      <div className="glass p-12 rounded-[2.5rem] border-red-500/20 text-center max-w-2xl">
        <h2 className="text-2xl font-bold text-red-500 mb-6">{error || 'Lesson not found'}</h2>
        <button onClick={() => router.back()} className="bg-secondary text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest hover:scale-105 transition-all inline-flex items-center gap-3">
          <ArrowLeft size={20} /> Go Back
        </button>
      </div>
    </div>
  );

  return (
    <main className="min-h-screen pb-24 bg-[#050505] text-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-secondary/5 rounded-full blur-[150px] pointer-events-none" />
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-6 relative z-10">
        <div className="max-w-4xl mx-auto">
          <button onClick={() => router.back()} className="text-muted-foreground hover:text-white mb-10 flex items-center gap-2 transition-colors font-bold uppercase tracking-widest text-sm">
            <ArrowLeft size={18} /> Back to Learning Path
          </button>
          
          <div className="flex items-center gap-5 mb-8">
            <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-secondary/30">
              {lesson.level}
            </div>
            <span className="text-secondary font-black uppercase tracking-[0.3em] text-sm">
              Lesson
            </span>
          </div>
          
          <h1 className="text-6xl md:text-7xl font-black mb-10 leading-[0.95] tracking-tight">{lesson.title}</h1>
          
          {lesson.audioUrl && (
            <button className="flex items-center gap-4 bg-white/5 border border-white/10 px-8 py-5 rounded-2xl shadow-xl hover:bg-white/10 hover:scale-105 transition-all group">
              <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-white group-hover:bg-secondary/80">
                <Play size={24} fill="currentColor" />
              </div>
              <span className="font-black uppercase tracking-widest text-sm">Listen to Audio</span>
            </button>
          )}
        </div>
      </section>

      {/* Content Section */}
      <section className="px-6 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="glass p-10 md:p-14 rounded-[3rem] border-white/5 relative overflow-hidden">
            <div className="prose prose-invert max-w-none prose-p:text-xl prose-p:leading-relaxed prose-p:text-muted-foreground prose-headings:font-black prose-headings:tracking-tight prose-headings:text-3xl">
              {lesson.content.split('\n').map((para, i) => (
                <p key={i} className="mb-8">{para}</p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Quizzes Section */}
      {lesson.quizzes.length > 0 && (
        <section className="mt-24 px-6 relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-12">
              <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center text-accent">
                <HelpCircle size={32} />
              </div>
              <div>
                <p className="text-accent font-black uppercase tracking-[0.2em] text-xs mb-1">Knowledge Test</p>
                <h2 className="text-4xl font-black tracking-tight">Quick Quiz</h2>
              </div>
            </div>

            <div className="space-y-10">
              {lesson.quizzes.map((quiz, idx) => {
                const selected = quizStates[quiz.id];
                const isCorrect = selected === quiz.correctAnswer;

                return (
                  <div key={quiz.id} className="glass p-10 md:p-12 rounded-[2.5rem] border-white/5">
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-secondary mb-6">Question {idx + 1}</p>
                    <h3 className="text-3xl font-black mb-10 leading-tight">{quiz.question}</h3>
                    
                    <div className="grid md:grid-cols-2 gap-5 mb-8">
                      {quiz.options.map((option) => (
                        <button 
                          key={option}
                          onClick={() => handleQuizOptionClick(quiz.id, option)}
                          disabled={!!selected}
                          className={`p-6 rounded-2xl border-2 transition-all text-left font-bold text-lg flex justify-between items-center ${
                            selected === option
                              ? isCorrect 
                                ? 'border-green-500 bg-green-500/10 text-green-400'
                                : 'border-secondary bg-secondary/10 text-secondary'
                              : selected && option === quiz.correctAnswer
                                ? 'border-green-500/50 bg-green-500/5 text-green-400'
                                : 'border-white/10 hover:border-secondary/50 hover:bg-white/5 bg-black/40 text-white'
                          }`}
                        >
                          <span>{option}</span>
                          {selected === option && (
                            isCorrect ? <Check size={24} className="text-green-500" /> : <X size={24} className="text-secondary" />
                          )}
                          {selected && option === quiz.correctAnswer && selected !== option && (
                            <Check size={24} className="text-green-500/50" />
                          )}
                        </button>
                      ))}
                    </div>

                    {selected && quiz.context && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, height: 0 }}
                        animate={{ opacity: 1, y: 0, height: 'auto' }}
                        className="p-6 rounded-2xl bg-white/5 border border-white/10 mt-6"
                      >
                        <p className="text-sm font-medium leading-relaxed text-muted-foreground">
                          <span className="text-accent font-black uppercase tracking-widest mr-2">Explanation:</span> 
                          {quiz.context}
                        </p>
                      </motion.div>
                    )}
                  </div>
                );
              })}
            </div>
            
            <div className="mt-16 text-center">
              <button 
                onClick={handleComplete}
                disabled={isCompleting}
                className="bg-secondary text-white px-14 py-6 rounded-2xl font-black text-lg hover:scale-105 transition-all shadow-2xl shadow-secondary/30 disabled:opacity-50 uppercase tracking-widest"
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
