"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Play, BookOpen, GraduationCap } from 'lucide-react';

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute top-1/4 -left-20 w-72 h-72 bg-secondary/20 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-accent/20 rounded-full blur-[120px] animate-pulse" />

      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center relative z-10">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-sm font-bold mb-6">
            <GraduationCap size={16} />
            <span>Master German from A1 to C2</span>
          </div>
          <h1 className="text-6xl md:text-7xl font-black leading-tight mb-6">
            Sprich Deutsch <br />
            <span className="text-gradient">wie ein Profi.</span>
          </h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-lg">
            Experience the future of language learning. Interactive lessons, AI-powered conversations, and gamified progress tracking.
          </p>

          <div className="flex flex-wrap gap-4">
            <button className="bg-primary text-background px-8 py-4 rounded-2xl font-bold flex items-center gap-2 hover:scale-105 transition-transform group">
              Start Learning Free
              <ArrowRight className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="flex items-center gap-3 px-8 py-4 rounded-2xl font-bold hover:bg-muted transition-colors border border-border">
              <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center text-secondary">
                <Play size={20} fill="currentColor" />
              </div>
              Watch Demo
            </button>
          </div>

          <div className="mt-12 flex items-center gap-8 grayscale opacity-50">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold">50k+</span>
              <span className="text-sm">Active Students</span>
            </div>
            <div className="w-px h-8 bg-border" />
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold">4.9/5</span>
              <span className="text-sm">User Rating</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="relative"
        >
          <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl border border-white/10">
             <div className="absolute inset-0 bg-gradient-to-tr from-black/40 to-transparent z-10" />
             <img 
               src="https://images.unsplash.com/photo-1467269204594-9661b134dd2b?q=80&w=2070&auto=format&fit=crop" 
               alt="Berlin Architecture" 
               className="w-full h-[600px] object-cover"
             />
          </div>

          {/* Floating Cards */}
          <motion.div 
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-6 -right-6 glass p-6 rounded-2xl shadow-xl z-20 max-w-[200px]"
          >
             <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center text-accent">
                  <BookOpen size={18} />
                </div>
                <span className="font-bold">Vocabulary</span>
             </div>
             <p className="text-xs text-muted-foreground">Learn 10 new words today to reach your daily goal!</p>
          </motion.div>

          <motion.div 
            animate={{ y: [0, 20, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute -bottom-6 -left-6 glass p-6 rounded-2xl shadow-xl z-20"
          >
             <div className="flex items-center gap-4">
                <div className="flex -space-x-3">
                  {[1,2,3].map(i => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-background bg-muted overflow-hidden">
                       <img src={`https://i.pravatar.cc/100?u=${i}`} alt="user" />
                    </div>
                  ))}
                </div>
                <div>
                  <p className="text-sm font-bold">Live Group Study</p>
                  <p className="text-xs text-secondary font-bold">12 Active Now</p>
                </div>
             </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
