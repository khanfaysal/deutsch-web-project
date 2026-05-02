"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Book, Brain, Zap, MessageSquare, Trophy, Headphones } from 'lucide-react';

const features = [
  {
    icon: <Book size={28} />,
    title: "Präzisions-Lernen",
    description: "Systematic grammar paths engineered for clarity. Master the structure of the language from A1 to C2."
  },
  {
    icon: <Brain size={28} />,
    title: "Gedächtnis-Algorithmen",
    description: "Our proprietary spaced-repetition system ensures you never forget a word. Optimization at its finest."
  },
  {
    icon: <MessageSquare size={28} />,
    title: "KI-Konversation",
    description: "Train with our state-of-the-art AI tutor. Realistic simulations for real-world fluency."
  },
  {
    icon: <Zap size={28} />,
    title: "Interaktive Dynamik",
    description: "Real-time feedback loops and adaptive challenges that evolve with your growing proficiency."
  },
  {
    icon: <Headphones size={28} />,
    title: "Audio-Immersions",
    description: "High-fidelity audio from native speakers. Perfect your accent with forensic accuracy."
  },
  {
    icon: <Trophy size={28} />,
    title: "Erfolgs-System",
    description: "Quantify your progress with detailed analytics and a performance-driven reward system."
  }
];

const Features = () => {
  return (
    <section className="py-32 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-end justify-between mb-20 gap-8">
          <div className="max-w-2xl">
            <motion.p 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="text-secondary font-black uppercase tracking-[0.3em] text-xs mb-4"
            >
              Kernfunktionen
            </motion.p>
            <h2 className="text-5xl font-black tracking-tight leading-tight">
              Why German Engineering for <br />
              <span className="text-muted-foreground">Language Learning?</span>
            </h2>
          </div>
          <p className="text-muted-foreground text-lg max-w-sm pb-1 font-medium">
            We've combined modern pedagogy with cutting-edge technology to create the ultimate German experience.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="glass p-10 rounded-[2.5rem] hover:bg-white dark:hover:bg-card transition-all duration-500 group border-white/5 hover:border-secondary/20 relative overflow-hidden"
            >
              <div className="w-16 h-16 rounded-2xl bg-secondary/10 flex items-center justify-center mb-8 group-hover:bg-secondary group-hover:text-white transition-all duration-500 text-secondary">
                {feature.icon}
              </div>
              <h3 className="text-2xl font-black mb-4 tracking-tight">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed font-medium">
                {feature.description}
              </p>
              
              {/* Subtle accent line on hover */}
              <div className="absolute bottom-0 left-0 w-0 h-1 bg-secondary transition-all duration-700 group-hover:w-full" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
