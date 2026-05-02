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
      <section className="py-32 max-w-7xl mx-auto px-6 relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div>
            <p className="text-secondary font-black uppercase tracking-[0.3em] text-xs mb-4">Wähle dein Level</p>
            <h2 className="text-5xl font-black tracking-tight leading-tight">Identify Your <br /><span className="text-muted-foreground">Fluency Stage</span></h2>
          </div>
          <button className="px-8 py-4 rounded-2xl bg-white/5 border border-white/10 font-black uppercase tracking-widest text-sm hover:bg-secondary hover:text-white transition-all flex items-center gap-3 group">
            Placement Test <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {levels.map((level, idx) => (
            <Link 
              key={level.id} 
              href={`/lessons/${level.id}`}
              className="group glass p-10 rounded-[2.5rem] flex flex-col hover:bg-white dark:hover:bg-card transition-all duration-500 border-white/5 hover:border-secondary/20 relative overflow-hidden"
            >
              <div className="flex justify-between items-start mb-10">
                <span className="text-6xl font-black group-hover:text-secondary transition-colors duration-500">{level.id}</span>
                <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center group-hover:bg-secondary/10 group-hover:text-secondary transition-all">
                  <ArrowRight size={24} className="-rotate-45 group-hover:rotate-0 transition-transform duration-500" />
                </div>
              </div>
              <div>
                <span className="text-xs font-black uppercase tracking-[0.2em] text-secondary mb-2 block">{level.name}</span>
                <p className="text-muted-foreground font-medium leading-relaxed">{level.desc}</p>
              </div>
              
              {/* Progress Bar (Decorative) */}
              <div className="mt-8 h-1 w-full bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-secondary w-0 group-hover:w-full transition-all duration-1000 delay-100" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-40 bg-[#050505] relative overflow-hidden text-center px-6">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--secondary)_0%,_transparent_70%)] opacity-[0.03] pointer-events-none" />
        <div className="max-w-4xl mx-auto relative z-10">
          <h2 className="text-6xl md:text-7xl font-black mb-10 tracking-tighter leading-tight">
             bereit, deine <br /> Reise zu <span className="text-secondary">beginnen?</span>
          </h2>
          <p className="text-xl text-muted-foreground mb-16 max-w-2xl mx-auto font-medium leading-relaxed">
            Join 50,000+ students mastering German through precision engineering and AI-driven immersion.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link href="/register" className="bg-secondary text-white px-12 py-6 rounded-2xl font-black uppercase tracking-[0.2em] hover:scale-105 transition-all shadow-[0_20px_50px_-10px_rgba(227,30,36,0.5)]">
              Jetzt Starten
            </Link>
            <Link href="/login" className="px-12 py-6 rounded-2xl bg-white/5 border border-white/10 font-black uppercase tracking-[0.2em] hover:bg-white/10 transition-all">
              Anmelden
            </Link>
          </div>
        </div>
      </section>

      <footer className="py-20 px-6 border-t border-white/5 bg-[#050505]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-12 mb-20">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#050505] via-[#e31e24] to-[#ffcf00] p-[1.5px]">
                <div className="w-full h-full bg-black rounded-[9px] flex items-center justify-center">
                  <div className="w-4 h-4 bg-white rounded-sm" />
                </div>
              </div>
              <span className="text-2xl font-black tracking-tighter">DEUTSCHFLOW</span>
            </Link>
            
            <div className="flex flex-wrap justify-center gap-10 text-xs font-black uppercase tracking-[0.3em]">
              <Link href="/lessons" className="hover:text-secondary transition-all">Lessons</Link>
              <Link href="/vocabulary" className="hover:text-secondary transition-all">Vocabulary</Link>
              <Link href="/quizzes" className="hover:text-secondary transition-all">Quizzes</Link>
              <Link href="/dashboard" className="hover:text-secondary transition-all">Dashboard</Link>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-10 border-t border-white/5 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
            <p>© 2026 DEUTSCHFLOW. ALL RIGHTS RESERVED.</p>
            <div className="flex gap-10">
              <Link href="#" className="hover:text-secondary transition-all">Privacy</Link>
              <Link href="#" className="hover:text-secondary transition-all">Terms</Link>
              <Link href="#" className="hover:text-secondary transition-all">Cookies</Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
