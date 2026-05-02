"use client";

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, ArrowRight, RefreshCcw, Check, X, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { fetchQuizzes } from '@/lib/api';

interface QuizItem {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  context?: string;
}

const QuizPage = () => {
  const [quizzes, setQuizzes] = useState<QuizItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentStep, setCurrentStep] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    const loadQuizzes = async () => {
      try {
        const data = await fetchQuizzes();
        if (data.length === 0) {
          setError('No quizzes available at the moment.');
        } else {
          setQuizzes(data);
        }
      } catch (err) {
        setError('Failed to load quizzes.');
      } finally {
        setLoading(false);
      }
    };
    loadQuizzes();
  }, []);

  const handleOptionClick = (option: string) => {
    if (selectedOption) return;
    
    setSelectedOption(option);
    const correct = option === quizzes[currentStep].correctAnswer;
    setIsCorrect(correct);
    if (correct) setScore(score + 1);
  };

  const nextQuestion = () => {
    if (currentStep + 1 < quizzes.length) {
      setCurrentStep(currentStep + 1);
      setSelectedOption(null);
      setIsCorrect(null);
    } else {
      setIsFinished(true);
    }
  };

  const restartQuiz = () => {
    setCurrentStep(0);
    setSelectedOption(null);
    setIsCorrect(null);
    setScore(0);
    setIsFinished(false);
  };

  if (loading) {
    return (
      <main className="min-h-screen pt-32 pb-24 bg-[#050505] text-white flex flex-col items-center justify-center">
        <Navbar />
        <Loader2 className="animate-spin text-secondary" size={64} />
        <p className="mt-6 text-muted-foreground font-black tracking-widest uppercase animate-pulse">Loading Quizzes...</p>
      </main>
    );
  }

  if (error || quizzes.length === 0) {
    return (
      <main className="min-h-screen pt-32 pb-24 bg-[#050505] text-white">
        <Navbar />
        <div className="max-w-2xl mx-auto px-6 text-center">
          <div className="glass p-12 rounded-[2.5rem] border-red-500/20">
            <p className="text-red-500 font-bold text-xl mb-6">{error || 'No quizzes found.'}</p>
            <Link href="/" className="bg-secondary text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest hover:scale-105 transition-all inline-block">
              Go Back
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-32 pb-24 bg-[#050505] text-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[150px] pointer-events-none" />
      <Navbar />
      
      <div className="max-w-3xl mx-auto px-6">
        <AnimatePresence mode="wait">
          {!isFinished ? (
            <motion.div
              key="quiz"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="glass p-10 md:p-14 rounded-[3rem] border-white/5 relative z-10"
            >
              <div className="flex flex-col md:flex-row justify-between md:items-center gap-6 mb-12">
                <div>
                  <p className="text-secondary font-black uppercase tracking-[0.3em] text-xs mb-2">Interactive Training</p>
                  <h1 className="text-3xl font-black tracking-tight">Knowledge Test</h1>
                </div>
                
                <div className="flex flex-col items-end gap-3">
                  <span className="text-sm font-bold text-muted-foreground uppercase tracking-widest">
                    Question {currentStep + 1} / {quizzes.length}
                  </span>
                  <div className="flex gap-2">
                     {quizzes.map((_, i) => (
                       <div 
                          key={i} 
                          className={`h-2 rounded-full transition-all duration-500 ${i === currentStep ? 'w-8 bg-secondary' : i < currentStep ? 'w-4 bg-secondary/50' : 'w-4 bg-white/10'}`} 
                       />
                     ))}
                  </div>
                </div>
              </div>

              <h2 className="text-4xl md:text-5xl font-black mb-12 leading-[1.1] tracking-tight">
                {quizzes[currentStep].question}
              </h2>

              <div className="grid gap-4 mb-10">
                {quizzes[currentStep].options.map((option) => (
                  <button
                    key={option}
                    onClick={() => handleOptionClick(option)}
                    disabled={!!selectedOption}
                    className={`w-full p-6 rounded-[1.5rem] text-left font-bold transition-all duration-300 border-2 flex justify-between items-center text-lg ${
                      selectedOption === option
                        ? isCorrect 
                          ? 'border-green-500 bg-green-500/10 text-green-400'
                          : 'border-secondary bg-secondary/10 text-secondary'
                        : selectedOption && option === quizzes[currentStep].correctAnswer
                          ? 'border-green-500/50 bg-green-500/5 text-green-400'
                          : 'border-white/10 hover:border-secondary/50 hover:bg-white/5 bg-black/40'
                    }`}
                  >
                    <span>{option}</span>
                    {selectedOption === option && (
                      isCorrect ? <Check size={24} className="text-green-500" /> : <X size={24} className="text-secondary" />
                    )}
                    {selectedOption && option === quizzes[currentStep].correctAnswer && selectedOption !== option && (
                      <Check size={24} className="text-green-500/50" />
                    )}
                  </button>
                ))}
              </div>

              {selectedOption && quizzes[currentStep].context && (
                <motion.div
                  initial={{ opacity: 0, y: 10, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: 'auto' }}
                  className="mb-10 p-6 rounded-2xl bg-white/5 border border-white/10"
                >
                  <p className="text-sm font-medium leading-relaxed text-muted-foreground">
                    <span className="text-accent font-black uppercase tracking-widest mr-2">Explanation:</span> 
                    {quizzes[currentStep].context}
                  </p>
                </motion.div>
              )}

              <div className="flex justify-end">
                <button
                  onClick={nextQuestion}
                  disabled={!selectedOption}
                  className={`px-10 py-5 rounded-2xl font-black flex items-center justify-center gap-3 transition-all uppercase tracking-widest text-sm ${
                    selectedOption 
                      ? 'bg-secondary text-white hover:scale-105 shadow-xl shadow-secondary/20' 
                      : 'bg-white/5 text-muted-foreground cursor-not-allowed border border-white/10'
                  }`}
                >
                  {currentStep + 1 === quizzes.length ? 'Show Results' : 'Next Question'}
                  <ArrowRight size={20} />
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass p-14 rounded-[3rem] border-white/5 text-center relative z-10"
            >
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#050505] via-accent to-accent/20 flex items-center justify-center text-[#050505] mx-auto mb-10 shadow-2xl p-[2px]">
                <div className="w-full h-full bg-black rounded-full flex items-center justify-center">
                  <Trophy size={56} className="text-accent" />
                </div>
              </div>
              
              <p className="text-secondary font-black uppercase tracking-[0.3em] text-xs mb-4">Result</p>
              <h2 className="text-5xl md:text-6xl font-black mb-6 tracking-tighter">Mission <br/>Accomplished!</h2>
              
              <div className="inline-block bg-white/5 border border-white/10 rounded-3xl px-10 py-6 mb-12">
                <p className="text-xl text-muted-foreground font-medium">
                  You got <span className="text-accent font-black text-4xl mx-2">{score}</span> out of <span className="text-white font-black">{quizzes.length}</span>
                </p>
                <p className="text-sm font-bold uppercase tracking-widest mt-2">Questions answered correctly</p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <button 
                   onClick={restartQuiz}
                   className="px-10 py-5 rounded-2xl bg-secondary text-white font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:scale-105 transition-all shadow-xl shadow-secondary/20"
                >
                  <RefreshCcw size={20} /> Try Again
                </button>
                <Link href="/lessons" className="px-10 py-5 rounded-2xl border border-white/10 font-black uppercase tracking-widest hover:bg-white/5 transition-colors flex items-center justify-center gap-3">
                  Back to Learning Path
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
};

export default QuizPage;
