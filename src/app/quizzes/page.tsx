"use client";

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, ArrowRight, RefreshCcw, Check, X } from 'lucide-react';
import Link from 'next/link';

const quizData = [
  {
    question: "How do you say 'Hello' in German?",
    options: ["Hallo", "Guten Tag", "Moin", "Servus"],
    correct: "Hallo",
    context: "'Hallo' is the most common way to say hello in German."
  },
  {
    question: "What is the German word for 'The' (Masculine)?",
    options: ["Die", "Der", "Das", "Den"],
    correct: "Der",
    context: "German has three genders: Der (masculine), Die (feminine), and Das (neuter)."
  },
  {
    question: "Which of these means 'I eat'?",
    options: ["Ich trinke", "Ich esse", "Ich schlafe", "Ich gehe"],
    correct: "Ich esse",
    context: "'Essen' means to eat, while 'trinken' means to drink."
  }
];

const QuizPage = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const handleOptionClick = (option: string) => {
    if (selectedOption) return;
    
    setSelectedOption(option);
    const correct = option === quizData[currentStep].correct;
    setIsCorrect(correct);
    if (correct) setScore(score + 1);
  };

  const nextQuestion = () => {
    if (currentStep + 1 < quizData.length) {
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

  return (
    <main className="min-h-screen pt-24 bg-muted/30">
      <Navbar />
      <div className="max-w-2xl mx-auto px-6 py-12">
        <AnimatePresence mode="wait">
          {!isFinished ? (
            <motion.div
              key="quiz"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="glass p-8 md:p-12 rounded-3xl"
            >
              <div className="flex justify-between items-center mb-8">
                <span className="text-sm font-bold text-muted-foreground uppercase tracking-widest">
                  Question {currentStep + 1} of {quizData.length}
                </span>
                <div className="flex gap-1">
                   {quizData.map((_, i) => (
                     <div 
                        key={i} 
                        className={`h-1.5 w-8 rounded-full transition-colors ${i <= currentStep ? 'bg-secondary' : 'bg-muted'}`} 
                     />
                   ))}
                </div>
              </div>

              <h2 className="text-3xl font-black mb-8 leading-tight">
                {quizData[currentStep].question}
              </h2>

              <div className="grid gap-4 mb-8">
                {quizData[currentStep].options.map((option) => (
                  <button
                    key={option}
                    onClick={() => handleOptionClick(option)}
                    disabled={!!selectedOption}
                    className={`w-full p-6 rounded-2xl text-left font-bold transition-all border-2 flex justify-between items-center ${
                      selectedOption === option
                        ? isCorrect 
                          ? 'border-green-500 bg-green-500/10 text-green-500'
                          : 'border-red-500 bg-red-500/10 text-red-500'
                        : selectedOption && option === quizData[currentStep].correct
                          ? 'border-green-500 bg-green-500/10 text-green-500'
                          : 'border-border hover:border-secondary hover:bg-white dark:hover:bg-card'
                    }`}
                  >
                    {option}
                    {selectedOption === option && (
                      isCorrect ? <Check size={20} /> : <X size={20} />
                    )}
                    {selectedOption && option === quizData[currentStep].correct && selectedOption !== option && (
                      <Check size={20} />
                    )}
                  </button>
                ))}
              </div>

              {selectedOption && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mb-8 p-4 rounded-xl bg-accent/10 border border-accent/20"
                >
                  <p className="text-sm italic">
                    <span className="font-bold">Did you know?</span> {quizData[currentStep].context}
                  </p>
                </motion.div>
              )}

              <button
                onClick={nextQuestion}
                disabled={!selectedOption}
                className={`w-full py-4 rounded-2xl font-black flex items-center justify-center gap-2 transition-all ${
                  selectedOption 
                    ? 'bg-primary text-background hover:scale-[1.02]' 
                    : 'bg-muted text-muted-foreground cursor-not-allowed'
                }`}
              >
                {currentStep + 1 === quizData.length ? 'Finish Quiz' : 'Next Question'}
                <ArrowRight size={20} />
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass p-12 rounded-3xl text-center"
            >
              <div className="w-24 h-24 rounded-full bg-accent/20 flex items-center justify-center text-accent mx-auto mb-8 animate-bounce">
                <Trophy size={48} />
              </div>
              <h2 className="text-4xl font-black mb-4">Quiz Complete!</h2>
              <p className="text-xl text-muted-foreground mb-8">
                You scored <span className="text-primary font-black">{score}</span> out of <span className="font-black">{quizData.length}</span>
              </p>
              
              <div className="grid gap-4">
                <button 
                   onClick={restartQuiz}
                   className="w-full py-4 rounded-2xl bg-primary text-background font-black flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform"
                >
                  <RefreshCcw size={20} /> Try Again
                </button>
                <Link href="/lessons" className="w-full py-4 rounded-2xl border border-border font-bold hover:bg-muted transition-colors">
                  Back to Lessons
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
