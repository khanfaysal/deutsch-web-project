"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Languages, User as UserIcon } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const Navbar = () => {
  const { user } = useAuth();

  return (
    <nav className="fixed top-0 w-full z-50 glass border-b border-white/5 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#050505] via-[#e31e24] to-[#ffcf00] flex items-center justify-center shadow-2xl group-hover:scale-110 transition-all duration-500 relative overflow-hidden p-[2px]">
            <div className="w-full h-full bg-black rounded-[14px] flex items-center justify-center">
              <Languages className="text-white w-6 h-6" />
            </div>
          </div>
          <span className="text-2xl font-black tracking-tighter">
            DEUTSCH<span className="text-secondary">FLOW</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-10 text-sm font-bold uppercase tracking-widest">
          <Link href="/lessons" className="hover:text-secondary transition-all">Lessons</Link>
          <Link href="/vocabulary" className="hover:text-secondary transition-all">Vocabulary</Link>
          <Link href="/quizzes" className="hover:text-secondary transition-all">Quizzes</Link>
          <Link href="/dashboard" className="hover:text-secondary transition-all">Dashboard</Link>
        </div>

        <div className="flex items-center gap-6">
          {user ? (
            <Link href="/dashboard" className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-secondary text-white font-black hover:scale-105 transition-all shadow-lg shadow-secondary/20">
              <UserIcon size={18} />
              {user.name.split(' ')[0]}
            </Link>
          ) : (
            <>
              <Link href="/login" className="text-sm font-bold uppercase tracking-widest hover:text-secondary transition-colors">Login</Link>
              <Link href="/register" className="bg-primary text-background px-6 py-2.5 rounded-2xl text-sm font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl">
                Start Learning
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
