"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Languages, User as UserIcon } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const Navbar = () => {
  const { user } = useAuth();

  return (
    <nav className="fixed top-0 w-full z-50 glass border-b border-white/10 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-black via-red-600 to-yellow-400 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
            <Languages className="text-white w-6 h-6" />
          </div>
          <span className="text-xl font-bold tracking-tight">
            Deutsch<span className="text-secondary">Flow</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium">
          <Link href="/lessons" className="hover:text-secondary transition-colors">Lessons</Link>
          <Link href="/vocabulary" className="hover:text-secondary transition-colors">Vocabulary</Link>
          <Link href="/quizzes" className="hover:text-secondary transition-colors">Quizzes</Link>
          <Link href="/dashboard" className="hover:text-secondary transition-colors">Dashboard</Link>
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <Link href="/dashboard" className="flex items-center gap-2 px-4 py-2 rounded-xl bg-secondary/10 text-secondary font-bold hover:bg-secondary hover:text-white transition-all">
              <UserIcon size={18} />
              {user.name.split(' ')[0]}
            </Link>
          ) : (
            <>
              <Link href="/login" className="text-sm font-medium hover:text-secondary transition-colors">Login</Link>
              <Link href="/register" className="bg-primary text-background px-5 py-2 rounded-full text-sm font-bold hover:opacity-90 transition-opacity">
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
