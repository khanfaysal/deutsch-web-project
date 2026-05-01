"use client";

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import { motion } from 'framer-motion';
import { Book, TrendingUp, Award, Clock, LogOut } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const { user, logout } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground animate-pulse">Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen pt-24 pb-12">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-6">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <div>
            <h1 className="text-5xl font-black mb-4">Willkommen, {user.name}! 👋</h1>
            <p className="text-muted-foreground text-lg">You're making great progress. Ready for today's lesson?</p>
          </div>
          <button 
            onClick={logout}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-red-500/10 text-red-500 font-bold hover:bg-red-500 hover:text-white transition-all"
          >
            <LogOut size={18} /> Logout
          </button>
        </header>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="glass p-8 rounded-[2rem] border-white/5 bg-gradient-to-br from-secondary/20 to-transparent">
            <TrendingUp className="text-secondary mb-4" size={32} />
            <h3 className="text-3xl font-black mb-1">A1</h3>
            <p className="text-muted-foreground font-bold">Current Level</p>
          </div>
          <div className="glass p-8 rounded-[2rem] border-white/5">
            <Book className="text-primary mb-4" size={32} />
            <h3 className="text-3xl font-black mb-1">12</h3>
            <p className="text-muted-foreground font-bold">Lessons Completed</p>
          </div>
          <div className="glass p-8 rounded-[2rem] border-white/5">
            <Award className="text-accent mb-4" size={32} />
            <h3 className="text-3xl font-black mb-1">850</h3>
            <p className="text-muted-foreground font-bold">Total Points</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <section>
            <h2 className="text-2xl font-black mb-6">Recent Activity</h2>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="glass p-6 rounded-2xl border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
                      <Clock size={20} className="text-muted-foreground" />
                    </div>
                    <div>
                      <h4 className="font-bold">Numbers 1-100</h4>
                      <p className="text-xs text-muted-foreground">Completed 2 hours ago</p>
                    </div>
                  </div>
                  <span className="text-green-500 font-black">+50 XP</span>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-black mb-6">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-4">
              <Link href="/lessons" className="p-8 rounded-3xl bg-secondary text-white font-black text-xl hover:scale-105 transition-all text-center">
                Continue Learning
              </Link>
              <Link href="/vocabulary" className="p-8 rounded-3xl bg-primary text-background font-black text-xl hover:scale-105 transition-all text-center">
                Flashcards
              </Link>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
