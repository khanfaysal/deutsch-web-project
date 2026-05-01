"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, RotateCcw } from 'lucide-react';

interface FlashcardProps {
  german: string;
  english: string;
  pronunciation: string;
  example: string;
}

const Flashcard = ({ german, english, pronunciation, example }: FlashcardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const speak = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card from flipping
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(german);
      utterance.lang = 'de-DE'; // Set to German
      window.speechSynthesis.speak(utterance);
    } else {
      alert('Text-to-speech is not supported in this browser.');
    }
  };

  return (
    <div 
      className="relative w-full h-[400px] cursor-pointer perspective-1000"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <motion.div
        className="w-full h-full relative preserve-3d"
        initial={false}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
      >
        {/* Front Side */}
        <div className="absolute inset-0 backface-hidden glass rounded-3xl p-12 flex flex-col items-center justify-center text-center shadow-2xl">
          <div className="w-16 h-1 w-16 bg-accent rounded-full mb-8" />
          <h2 className="text-5xl font-black mb-4">{german}</h2>
          <p className="text-muted-foreground italic mb-8">{pronunciation}</p>
          <button 
            onClick={speak}
            className="w-12 h-12 rounded-full bg-muted flex items-center justify-center hover:bg-accent hover:text-primary transition-colors z-10"
          >
            <Volume2 size={24} />
          </button>
          <div className="mt-auto flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-widest">
            <RotateCcw size={14} /> Click to flip
          </div>
        </div>

        {/* Back Side */}
        <div 
          className="absolute inset-0 backface-hidden rounded-3xl p-12 flex flex-col items-center justify-center text-center shadow-2xl bg-secondary text-white"
          style={{ 
            transform: 'rotateY(180deg)',
            WebkitBackfaceVisibility: 'hidden',
            backfaceVisibility: 'hidden'
          }}
        >
          <span className="text-xs font-bold uppercase tracking-widest opacity-70 mb-4">English Meaning</span>
          <h2 className="text-4xl font-black mb-8 leading-tight">{english}</h2>
          
          <div className="bg-white/10 p-6 rounded-2xl w-full max-w-sm border border-white/10">
            <p className="text-xs font-bold mb-2 opacity-60 uppercase tracking-tighter">Example Sentence</p>
            <p className="text-lg leading-relaxed font-medium italic">"{example}"</p>
          </div>

          <div className="mt-auto flex items-center gap-2 text-xs font-bold opacity-70 uppercase tracking-widest">
            <RotateCcw size={14} /> Click to flip back
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Flashcard;
