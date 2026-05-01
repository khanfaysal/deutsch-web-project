"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Book, Brain, Zap, MessageSquare, Trophy, Headphones } from 'lucide-react';

const features = [
  {
    icon: <Book className="text-secondary" />,
    title: "Comprehensive Lessons",
    description: "Structured grammar and vocabulary paths from A1 to C2 levels."
  },
  {
    icon: <Brain className="text-accent" />,
    title: "Spaced Repetition",
    description: "Master vocabulary faster with our advanced memory algorithms."
  },
  {
    icon: <MessageSquare className="text-primary dark:text-white" />,
    title: "AI Conversation",
    description: "Practice real-life scenarios with our intelligent German chatbot."
  },
  {
    icon: <Zap className="text-secondary" />,
    title: "Interactive Quizzes",
    description: "Instant feedback and adaptive difficulty to keep you challenged."
  },
  {
    icon: <Headphones className="text-accent" />,
    title: "Audio Pronunciation",
    description: "Listen to native speakers and refine your German accent."
  },
  {
    icon: <Trophy className="text-primary dark:text-white" />,
    title: "Gamified Progress",
    description: "Earn XP, badges, and climb the leaderboard as you learn."
  }
];

const Features = () => {
  return (
    <section className="py-24 bg-muted/50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Why Choose DeutschFlow?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            We've combined modern pedagogy with cutting-edge technology to create the ultimate German learning experience.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="glass p-8 rounded-3xl hover:bg-white dark:hover:bg-card transition-all group border-transparent hover:border-border"
            >
              <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
