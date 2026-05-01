import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const levels = [
  { id: 'A1', name: 'Beginner', desc: 'Can understand basic phrases.' },
  { id: 'A2', name: 'Elementary', desc: 'Can handle routine tasks.' },
  { id: 'B1', name: 'Intermediate', desc: 'Can express opinions.' },
  { id: 'B2', name: 'Upper Int.', desc: 'Can talk about complex topics.' },
  { id: 'C1', name: 'Advanced', desc: 'Can use language flexibly.' },
  { id: 'C2', name: 'Mastery', desc: 'Near-native fluency.' },
];

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <Features />

      {/* Level Selection Section */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <h2 className="text-4xl font-bold mb-4">Choose Your Level</h2>
            <p className="text-muted-foreground">Not sure where to start? Take our placement test.</p>
          </div>
          <button className="text-secondary font-bold flex items-center gap-2 hover:underline">
            Take Placement Test <ArrowRight size={20} />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {levels.map((level) => (
            <Link 
              key={level.id} 
              href={`/lessons/${level.id}`}
              className="group glass p-6 rounded-2xl flex flex-col items-center text-center hover:bg-secondary hover:text-white transition-all border-white/5"
            >
              <span className="text-3xl font-black mb-2 group-hover:scale-125 transition-transform">{level.id}</span>
              <span className="text-xs font-bold uppercase tracking-wider mb-2">{level.name}</span>
              <p className="text-[10px] opacity-60 group-hover:opacity-100">{level.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-24 bg-primary text-background text-center px-6">
        <h2 className="text-5xl font-black mb-8">Ready to start your journey?</h2>
        <p className="text-xl opacity-80 mb-12 max-w-2xl mx-auto">
          Join thousands of students who are already mastering German with DeutschFlow.
        </p>
        <button className="bg-accent text-primary px-10 py-5 rounded-2xl font-black text-xl hover:scale-105 transition-transform">
          Get Started for Free
        </button>
      </section>

      <footer className="py-12 px-6 border-t border-border">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-black via-red-600 to-yellow-400" />
            <span className="font-bold">DeutschFlow</span>
          </div>
          <div className="flex gap-8 text-sm text-muted-foreground">
            <Link href="#" className="hover:text-primary">Privacy Policy</Link>
            <Link href="#" className="hover:text-primary">Terms of Service</Link>
            <Link href="#" className="hover:text-primary">Contact</Link>
          </div>
          <p className="text-sm text-muted-foreground">© 2026 DeutschFlow. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
