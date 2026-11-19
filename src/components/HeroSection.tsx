import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { ArrowDownRight, ShieldCheck, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface HeroSectionProps {
  onAbout: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onAbout }) => {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const scale = useTransform(scrollYProgress, [0, 0.7], [1, 0.88]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.2]);
  const rotateX = useTransform(scrollYProgress, [0, 0.7], [0, 14]);
  const yTranslate = useTransform(scrollYProgress, [0, 0.7], [0, 100]);

  return (
    <section
      ref={containerRef}
      className="relative min-h-[100dvh] h-auto flex flex-col justify-between pt-24 pb-12 px-6 md:px-12 overflow-hidden bg-architectural-grid"
    >
      {/* Ambient background light gradients */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#0052FF]/8 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 -right-32 w-96 h-96 bg-zinc-400/10 rounded-full blur-3xl pointer-events-none" />

      {/* Decorative background Blanka watermark */}
      <div className="absolute bottom-8 right-4 select-none pointer-events-none overflow-hidden">
        <span className="font-accent text-[120px] md:text-[180px] font-bold text-black/[0.03] leading-none tracking-widest">
          KTR
        </span>
      </div>

      {/* Hero Morph Container with 3D perspective */}
      <div style={{ perspective: '1200px' }} className="w-full flex-1 flex flex-col justify-center pb-8 min-h-0">
        <motion.div
          style={{
            scale,
            opacity,
            rotateX,
            y: yTranslate,
            transformStyle: 'preserve-3d',
          }}
          className="max-w-7xl mx-auto w-full transition-transform duration-75"
        >
          {/* Eyebrow badge strip — Orbitron labels */}
          <div className="flex flex-wrap items-center gap-3 mb-6 font-tech text-[10px]">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-emerald-500/10 border-l-2 border-emerald-500 text-emerald-700 uppercase tracking-widest">
              <ShieldCheck className="w-3.5 h-3.5" />
              OPEN FOR COLLAB
            </div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-black/5 border border-black/10 text-zinc-700">
              !HOLA! SUP GNG?
            </div>
            <div className="hidden sm:inline text-zinc-400">
              [GITHUB.COM/KATRATE · 16 REPOS]
            </div>
          </div>

          {/* Main Headline — Azonix sci-fi font */}
          <h1 className="font-hero font-normal text-5xl sm:text-7xl lg:text-[5.5rem] tracking-[0.02em] text-[#0D0E12] leading-[1.08] max-w-5xl mb-8">
            COOKING UP <span className="text-[#0052FF]">HEAT</span>
          </h1>

          {/* Sub — Nasalization for this one for variety */}
          <p className="font-sub text-sm sm:text-base text-zinc-600 max-w-2xl leading-relaxed mb-10 tracking-wide">
            Code that actually slaps. W systems engineer, compiler nerd, and game dev. If it's broke, I'll fix it fr.
          </p>

          {/* CTAs — Orbitron labels inside */}
          <div className="flex flex-wrap items-center gap-4 mb-2">
            <button
              onClick={() => navigate('/work')}
              className="group relative inline-flex items-center gap-3 px-7 py-3.5 rounded-full bg-[#0D0E12] text-white font-tech text-[10px] hover:bg-[#0052FF] transition cursor-pointer shadow-lg shadow-black/10"
              data-cursor="EXPLORE"
            >
              <span>PEEK THE STASH (16)</span>
              <ArrowDownRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:translate-y-0.5 transition" />
            </button>

            <button
              onClick={onAbout}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white/90 hover:bg-white text-zinc-900 border border-zinc-200 font-tech text-[10px] transition cursor-pointer shadow-sm"
              data-cursor="VIEW"
            >
              <User className="w-4 h-4 text-[#0052FF]" />
              <span>WHO IS BLUD?</span>
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
