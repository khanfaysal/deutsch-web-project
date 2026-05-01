"use client";

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Flashcard from '@/components/Flashcard';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Search, RotateCcw, Filter, Loader2, CheckCircle } from 'lucide-react';
import { fetchVocabulary } from '@/lib/api';

interface Word {
  id: string;
  word: string;
  meaning: string;
  example: string;
  level: string;
  audioUrl?: string;
}

const VocabularyPage = () => {
  const [allWords, setAllWords] = useState<Word[]>([]);
  const [filteredWords, setFilteredWords] = useState<Word[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<string>('All');

  useEffect(() => {
    const loadVocab = async () => {
      try {
        const data = await fetchVocabulary();
        setAllWords(data);
        setFilteredWords(data);
      } catch (err) {
        setError('Failed to load vocabulary.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadVocab();
  }, []);

  useEffect(() => {
    let result = allWords;
    
    if (searchTerm) {
      result = result.filter(w => 
        w.word.toLowerCase().includes(searchTerm.toLowerCase()) || 
        w.meaning.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedLevel !== 'All') {
      result = result.filter(w => w.level === selectedLevel);
    }
    
    setFilteredWords(result);
    setCurrentIndex(0);
  }, [searchTerm, selectedLevel, allWords]);

  const nextCard = () => {
    if (filteredWords.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % filteredWords.length);
  };

  const prevCard = () => {
    if (filteredWords.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + filteredWords.length) % filteredWords.length);
  };

  const shuffleCards = () => {
    const shuffled = [...filteredWords].sort(() => Math.random() - 0.5);
    setFilteredWords(shuffled);
    setCurrentIndex(0);
  };

  const handleAction = (type: 'known' | 'retry') => {
    if (filteredWords.length === 0) return;

    const currentWord = filteredWords[currentIndex];
    
    if (type === 'known') {
      // Remove word from the current study session
      const newFiltered = filteredWords.filter((_, i) => i !== currentIndex);
      setFilteredWords(newFiltered);
      
      // If we removed the last item, go to 0, otherwise stay at same index (which is now the next word)
      if (currentIndex >= newFiltered.length) {
        setCurrentIndex(0);
      }
    } else {
      // Move to the end of the queue to see it again later
      const newFiltered = [...filteredWords];
      const [removed] = newFiltered.splice(currentIndex, 1);
      newFiltered.push(removed);
      setFilteredWords(newFiltered);
      
      // Stay at the same index if there are more words, or wrap to 0
      if (currentIndex >= newFiltered.length) {
        setCurrentIndex(0);
      }
    }
  };

  const levels = ['All', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

  return (
    <main className="min-h-screen pt-24 bg-muted/30">
      <Navbar />
      <div className="max-w-4xl mx-auto px-6 py-12">
        <header className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
          <div>
            <h1 className="text-4xl font-black mb-2">Vocabulary Builder</h1>
            <p className="text-muted-foreground">Master German words with spaced repetition.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
             <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <input 
                  type="text" 
                  placeholder="Search words..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 rounded-xl border border-border bg-background focus:ring-2 focus:ring-secondary outline-none w-64 shadow-sm"
                />
             </div>
             <select 
               value={selectedLevel}
               onChange={(e) => setSelectedLevel(e.target.value)}
               className="px-4 py-2 rounded-xl border border-border bg-background focus:ring-2 focus:ring-secondary outline-none shadow-sm font-bold cursor-pointer"
             >
               {levels.map(l => <option key={l} value={l}>{l}</option>)}
             </select>
             <button 
               onClick={shuffleCards}
               className="px-4 py-2 rounded-xl border border-border bg-background hover:bg-muted transition-colors shadow-sm font-bold flex items-center gap-2"
             >
                <RotateCcw size={18} /> Shuffle
             </button>
          </div>
        </header>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <Loader2 className="animate-spin text-secondary" size={48} />
            <p className="text-muted-foreground">Loading vocabulary...</p>
          </div>
        ) : error ? (
          <div className="text-center py-24">
            <p className="text-red-500 font-bold">{error}</p>
          </div>
        ) : filteredWords.length === 0 ? (
          <div className="text-center py-24 glass rounded-[3rem] border-white/10 shadow-2xl relative overflow-hidden bg-gradient-to-br from-green-500/10 to-emerald-500/10">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-green-500/20 rounded-full blur-3xl" />
            <div className="relative z-10">
              <div className="w-20 h-20 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-green-500/20">
                <CheckCircle size={40} />
              </div>
              <h2 className="text-4xl font-black mb-4">Session Complete!</h2>
              <p className="text-muted-foreground text-lg mb-8 max-w-sm mx-auto">
                {allWords.length > 0 && searchTerm === '' && selectedLevel === 'All' 
                  ? "Outstanding! You've mastered all the words in this session."
                  : "You've finished all the words matching your current filters."}
              </p>
              <button 
                onClick={() => {setSearchTerm(''); setSelectedLevel('All'); setFilteredWords(allWords); setCurrentIndex(0);}} 
                className="bg-primary text-background px-8 py-4 rounded-2xl font-bold hover:scale-105 transition-all shadow-xl"
              >
                Start New Session
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-12">
            <div className="w-full max-w-lg">
              <AnimatePresence mode="wait">
                <motion.div
                  key={filteredWords[currentIndex]?.id || currentIndex}
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Flashcard 
                    german={filteredWords[currentIndex]?.word || ''} 
                    english={filteredWords[currentIndex]?.meaning || ''}
                    example={filteredWords[currentIndex]?.example || ''}
                    pronunciation={filteredWords[currentIndex]?.level || 'A1'}
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="flex items-center gap-8 bg-background px-8 py-4 rounded-3xl shadow-xl border border-border">
              <button 
                onClick={prevCard}
                className="w-12 h-12 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-all"
              >
                <ChevronLeft size={24} />
              </button>
              <div className="text-lg font-black text-primary w-20 text-center">
                {currentIndex + 1} <span className="text-muted-foreground text-sm font-bold">/ {filteredWords.length}</span>
              </div>
              <button 
                onClick={nextCard}
                className="w-12 h-12 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-all"
              >
                <ChevronRight size={24} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-6 w-full max-w-lg">
               <button 
                 onClick={() => handleAction('known')}
                 className="group p-6 rounded-3xl border-2 border-green-500/20 bg-green-500/5 text-green-600 font-black text-xl hover:bg-green-500 hover:text-white transition-all shadow-lg shadow-green-500/10 flex flex-col items-center gap-2"
               >
                  <CheckCircle size={28} />
                  <span>I Know This</span>
               </button>
               <button 
                 onClick={() => handleAction('retry')}
                 className="group p-6 rounded-3xl border-2 border-red-500/20 bg-red-500/5 text-red-600 font-black text-xl hover:bg-red-500 hover:text-white transition-all shadow-lg shadow-red-500/10 flex flex-col items-center gap-2"
               >
                  <RotateCcw size={28} />
                  <span>Study Again</span>
               </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};
export default VocabularyPage;
