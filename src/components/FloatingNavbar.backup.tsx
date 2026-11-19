import React from 'react';
import { motion } from 'motion/react';

interface FloatingNavbarProps { }

export const FloatingNavbar: React.FC<FloatingNavbarProps> = () => {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header className="fixed top-5 inset-x-0 z-40 flex justify-center px-4 pointer-events-none">
      <motion.nav
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="pointer-events-auto flex items-center justify-between gap-6 md:gap-12 px-4 py-2 rounded-full bg-white/85 backdrop-blur-xl border border-black/10 shadow-[0_12px_30px_-10px_rgba(0,0,0,0.08)] w-auto"
      >
        {/* Brand Monogram */}
        <div
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex items-center gap-2 cursor-pointer group"
          data-cursor="TOP"
        >
          <div className="w-8 h-8 rounded-full overflow-hidden bg-[#0D0E12] border-2 border-transparent group-hover:border-[#0052FF] transition shrink-0">
            <img src="/pfp.jpg" alt="Profile" className="w-full h-full object-cover" />
          </div>
          <div className="flex flex-col">
            <span className="font-display font-bold text-xs md:text-sm text-zinc-900 leading-tight">
              KATRATE
            </span>
            <span className="font-mono-code text-[10px] text-zinc-400 leading-none">
              404 // Stability Not Found
            </span>
          </div>
        </div>

        {/* Center Nav Links */}
        <div className="hidden md:flex items-center gap-1 bg-zinc-100/80 p-1 rounded-full border border-black/5">
          {[
            { id: 'works', label: 'Works' },
            { id: 'about', label: 'About' },
            { id: 'contact', label: 'Connect' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className="px-3.5 py-1 text-xs font-medium text-zinc-600 hover:text-black hover:bg-white rounded-full transition cursor-pointer"
              data-cursor="GO"
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Right Action Cluster */}
        <div className="flex items-center gap-2">
          {/* GitHub direct badge */}
          <a
            href="https://github.com/katrate"
            target="_blank"
            rel="noreferrer"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 hover:bg-zinc-200 text-[11px] font-mono-code text-zinc-800 transition"
            data-cursor="LINK"
          >
            <span>GITHUB</span>
          </a>

        </div>
      </motion.nav>
    </header>
  );
};
