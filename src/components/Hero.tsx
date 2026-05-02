"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Play, BookOpen, GraduationCap } from 'lucide-react';
import Link from 'next/link';

const Hero = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center pt-32 pb-20 overflow-hidden bg-[#050505] text-white">
      {/* Background Blobs */}
      <div className="absolute top-1/4 -left-20 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[150px] animate-pulse" />
      <div className="absolute bottom-1/4 -right-20 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[150px] animate-pulse" />

      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-sm font-black uppercase tracking-[0.2em] mb-8"
          >
            <GraduationCap size={18} />
            <span>Exzellenz in der Bildung</span>
          </motion.div>
          
          <h1 className="text-7xl md:text-8xl font-black leading-[0.95] mb-8 tracking-tighter">
            SPRICH <br />
            DEUTSCH <br />
            <span className="text-secondary italic">PERFEKT.</span>
          </h1>
          
          <p className="text-xl text-muted-foreground mb-12 max-w-lg leading-relaxed font-medium">
            Master German with precision. Our engineering-led approach combines interactive immersion with AI-powered fluency training.
          </p>

          <div className="flex flex-wrap gap-6">
            <Link href="/register" className="bg-secondary text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest flex items-center gap-3 hover:scale-105 transition-all shadow-2xl shadow-secondary/30 group">
              Start Now
              <ArrowRight className="group-hover:translate-x-2 transition-transform" />
            </Link>
            <button className="flex items-center gap-4 px-10 py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-white/5 transition-all border border-white/10 group">
              <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-secondary group-hover:bg-secondary group-hover:text-white transition-all">
                <Play size={24} fill="currentColor" />
              </div>
              Demo
            </button>
          </div>

          <div className="mt-16 flex items-center gap-12 border-t border-white/5 pt-12">
            <div>
              <p className="text-4xl font-black text-white">50K+</p>
              <p className="text-xs font-black uppercase tracking-widest text-muted-foreground mt-1">Students</p>
            </div>
            <div className="w-px h-12 bg-white/10" />
            <div>
              <p className="text-4xl font-black text-white">4.9</p>
              <p className="text-xs font-black uppercase tracking-widest text-muted-foreground mt-1">Rating</p>
            </div>
            <div className="w-px h-12 bg-white/10" />
            <div className="flex -space-x-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="w-12 h-12 rounded-full border-4 border-background bg-muted overflow-hidden">
                  <img src={`https://i.pravatar.cc/150?u=user${i}`} alt="user" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9, rotateY: 20 }}
          animate={{ opacity: 1, scale: 1, rotateY: 0 }}
          transition={{ duration: 1.2, delay: 0.2, ease: "easeOut" }}
          className="relative perspective-1000"
        >
          <div className="relative z-10 rounded-[3rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(227,30,36,0.3)] border border-white/10 aspect-[4/5] md:aspect-auto">
             <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10 opacity-60" />
             <img 
               src="/hero-german.png" 
               alt="DeutschFlow Experience" 
               className="w-full h-full object-cover"
             />
          </div>

          {/* Floating Element: Word of the Day */}
          <motion.div 
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-10 -left-10 glass p-8 rounded-[2rem] shadow-2xl z-20 border-secondary/20"
          >
             <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center text-white shadow-lg shadow-secondary/20">
                  <BookOpen size={24} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-secondary uppercase tracking-[0.2em]">Wort des Tages</p>
                  <p className="text-xl font-black">Fernweh</p>
                </div>
             </div>
             <p className="text-sm text-muted-foreground italic font-medium leading-relaxed">
               "A longing for far-off places; wanderlust."
             </p>
          </motion.div>

          {/* Floating Element: Achievements */}
          <motion.div 
            animate={{ y: [0, 20, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute -bottom-10 -right-10 glass p-8 rounded-[2rem] shadow-2xl z-20 border-accent/20"
          >
             <div className="flex items-center gap-5">
                <div className="w-14 h-14 rounded-2xl bg-accent/20 flex items-center justify-center text-accent">
                   <div className="w-8 h-8 rounded-full border-4 border-accent animate-spin" style={{ borderTopColor: 'transparent' }} />
                </div>
                <div>
                  <p className="text-sm font-black uppercase tracking-widest">Level Progress</p>
                  <div className="mt-2 w-32 h-2 bg-white/10 rounded-full overflow-hidden">
                    <div className="w-3/4 h-full bg-accent" />
                  </div>
                  <p className="text-xs font-bold text-accent mt-2">75% to A2 Mastery</p>
                </div>
             </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
