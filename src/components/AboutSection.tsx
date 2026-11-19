import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowUpRight, Coffee,
  Wrench, Database, BrainCircuit, LayoutDashboard,
  Laptop2, Bot, Zap, ShieldCheck
} from 'lucide-react';

/* ─── Tech Stack Data ─────────────────────────────────────────── */
const STACK = [
  {
    category: 'LANGUAGES',
    color: 'blue',
    items: ['C', 'Rust', 'TypeScript', 'JavaScript', 'Python', 'Dart', 'Bash / Shell', 'PowerShell', 'HTML', 'CSS'],
  },
  {
    category: 'FRAMEWORKS',
    color: 'violet',
    items: ['React 19', 'Next.js', 'Flutter', 'Express', 'Node.js', 'Tailwind CSS v4', 'Vite', 'Electron'],
  },
  {
    category: 'AI & ML',
    color: 'pink',
    items: ['TensorFlow', 'MediaPipe', 'PyTorch', 'OpenAI API', 'Anthropic Claude', 'LangChain', 'Hugging Face', 'ONNX'],
  },
  {
    category: 'DATABASES',
    color: 'amber',
    items: ['PostgreSQL', 'MongoDB', 'SQLite', 'Redis', 'Supabase', 'PlanetScale', 'Prisma ORM', 'Drizzle ORM'],
  },
  {
    category: 'DEVTOOLS & CLI',
    color: 'emerald',
    items: ['GSAP', 'Framer Motion', 'WebRTC', 'WebSockets', 'Chrome Extensions API', 'Crossterm', 'Ratatui', 'AES-256-GCM'],
  },
  {
    category: 'INFRA & OS',
    color: 'cyan',
    items: ['Arch Linux', 'CachyOS', 'KwamLinux', 'Windows 11', 'Vercel', 'Cloudflare', 'GitHub Actions', 'Docker'],
  },
  {
    category: 'AI CODING TOOLS',
    color: 'orange',
    items: ['Antigravity (AGY)', 'Claude Code', 'OpenCode', 'Freebuff', 'Cursor', 'GitHub Copilot', 'Aider', 'Continue.dev'],
  },
  {
    category: 'OTHER TOOLS',
    color: 'zinc',
    items: ['Git', 'NeoVim', 'VS Code', 'Postman', 'Figma', 'OBS Studio', 'Tmux', 'Alacritty'],
  },
];

const colorMap: Record<string, { pill: string; label: string; glow: string }> = {
  blue: { pill: 'bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100', label: 'text-blue-600', glow: 'bg-blue-400/10' },
  violet: { pill: 'bg-violet-50 text-violet-700 border border-violet-200 hover:bg-violet-100', label: 'text-violet-600', glow: 'bg-violet-400/10' },
  pink: { pill: 'bg-pink-50 text-pink-700 border border-pink-200 hover:bg-pink-100', label: 'text-pink-600', glow: 'bg-pink-400/10' },
  amber: { pill: 'bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100', label: 'text-amber-600', glow: 'bg-amber-400/10' },
  emerald: { pill: 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100', label: 'text-emerald-600', glow: 'bg-emerald-400/10' },
  cyan: { pill: 'bg-cyan-50 text-cyan-700 border border-cyan-200 hover:bg-cyan-100', label: 'text-cyan-600', glow: 'bg-cyan-400/10' },
  orange: { pill: 'bg-orange-50 text-orange-700 border border-orange-200 hover:bg-orange-100', label: 'text-orange-600', glow: 'bg-orange-400/10' },
  zinc: { pill: 'bg-zinc-100 text-zinc-700 border border-zinc-200 hover:bg-zinc-200', label: 'text-zinc-500', glow: 'bg-zinc-400/10' },
};

export const AboutSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'intro' | 'stack' | 'setup'>('intro');

  const tabs = [
    { id: 'intro', label: '01 // WHO I AM' },
    { id: 'stack', label: '02 // TECH STACK' },
    { id: 'setup', label: '03 // MY SETUP' },
  ];

  return (
    <section id="about" className="py-24 px-4 sm:px-8 bg-white border-t border-zinc-200 relative overflow-hidden">


      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 pb-8 border-b border-zinc-200">
          <div>
            <span className="font-tech text-[9px] uppercase tracking-[0.2em] text-[#0052FF] mb-3 block">
              ABOUT // KATRATE
            </span>
            <h2 className="font-display font-normal text-4xl sm:text-6xl text-[#0D0E12] tracking-[0.04em] leading-[1.1]">
              WHO TF IS KATRATE?
            </h2>
          </div>
          <a
            href="https://github.com/katrate"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0D0E12] text-white hover:bg-zinc-800 transition font-tech text-[9px] self-end"
          >
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>GITHUB.COM/KATRATE</span>
          </a>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 bg-zinc-100 p-1.5 rounded-2xl w-max mb-10 border border-zinc-200/80 font-tech text-[9px]">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-xl font-medium transition cursor-pointer ${activeTab === tab.id
                  ? 'bg-white text-zinc-950 shadow-sm border border-black/5 font-semibold'
                  : 'text-zinc-500 hover:text-zinc-900'
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">

          {/* ── WHO I AM ── */}
          {activeTab === 'intro' && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8"
            >
              {/* Bio Card */}
              <div className="lg:col-span-7 bg-[#0D0E12] text-white p-8 md:p-10 rounded-3xl border border-zinc-800 shadow-xl flex flex-col gap-6">
                <div className="flex items-center gap-3">
                  <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-[#0052FF]/10 border-l-2 border-[#0052FF] text-[#0052FF] font-bold uppercase tracking-wider text-xs font-mono-code">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    AVAILABLE FOR COLLABORATION
                  </div>
                </div>

                <div>
                  <h3 className="font-display font-bold text-2xl sm:text-3xl text-white mb-4 leading-tight">
                    Builder of languages, systems, and the tools in between.
                  </h3>
                  <div className="space-y-4 text-sm sm:text-base text-zinc-300 leading-relaxed font-normal">
                    <p>
                      I'm <strong className="text-white">Katrate</strong> — a systems engineer and creative developer who builds from the ground up. I don't just write apps on top of frameworks; I architect the primitives underneath them.
                    </p>
                    <p>
                      My work spans custom programming languages, Linux kernel distributions, Rust TUI tooling, full-stack web applications, and browser extensions. I'm obsessed with low-latency computing, compiler theory, and making interfaces that feel <em>alive</em>.
                    </p>
                    <p>
                      When I'm not building compilers or OS distributions, I'm pushing pixels in React, writing zero-storage P2P protocols, or architecting CLI tools that solve real friction in day-to-day development.
                    </p>

                    <blockquote className="border-l-2 border-[#0052FF] pl-4 italic text-zinc-400 mt-6 py-1">
                      "At some point you touched a computer and the computer did what you wanted, you made it do what you wanted it to do and you realized that you were a God... a small God in a very small world"
                      <footer className="text-xs text-zinc-500 mt-2 font-mono-code not-italic">— Robert C. Martin</footer>
                    </blockquote>
                  </div>
                </div>

                <div className="pt-6 border-t border-white/10 grid grid-cols-3 gap-4 font-mono-code text-xs">
                  {[
                    { label: 'REPOS', value: '16+' },
                    { label: 'LANGUAGES BUILT', value: '2' },
                    { label: 'CUSTOM OS', value: '1' },
                  ].map((stat) => (
                    <div key={stat.label}>
                      <div className="text-2xl font-display font-bold text-white">{stat.value}</div>
                      <div className="text-zinc-500 text-[11px] mt-0.5">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Side Pillar Cards */}
              <div className="lg:col-span-5 flex flex-col gap-4">
                {[
                  {
                    title: 'TECHNICAL',
                    desc: 'This is the thing which drives me. Digging deep down to see how things work and recreating them myself for my custom use is the best experience.',
                    icon: <Wrench className="w-5 h-5 text-[#0052FF]" />,
                  },
                  {
                    title: 'BACKEND & DATABASE',
                    desc: 'These two things are my type. Writing backend server-side code and database architecture for the best outcomes and results.',
                    icon: <Database className="w-5 h-5 text-[#0052FF]" />,
                  },
                  {
                    title: 'AI & AUTOMATION',
                    desc: 'My lifeline, the thing I depend on most. AI and automation are my fav part. Solving hard and complex problems together to deliver crazy outcomes.',
                    icon: <BrainCircuit className="w-5 h-5 text-[#0052FF]" />,
                  },
                  {
                    title: 'FRONTEND',
                    desc: 'AHMMM, TBH this is a bottleneck, but dw will figure out something for this too.',
                    icon: <LayoutDashboard className="w-5 h-5 text-[#0052FF]" />,
                  },
                ].map((pillar, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl bg-white border border-zinc-200/90 shadow-sm hover:border-zinc-400 hover:shadow-md transition"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 rounded-xl bg-zinc-100">{pillar.icon}</div>
                      <h4 className="font-display font-bold text-base text-zinc-900">{pillar.title}</h4>
                    </div>
                    <p className="text-xs text-zinc-600 leading-relaxed font-normal pl-11">{pillar.desc}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ── TECH STACK ── */}
          {activeTab === 'stack' && (
            <motion.div
              key="stack"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <p className="font-mono-code text-xs text-zinc-400 mb-2">
                // Everything I actually touch on a day-to-day basis — no padding, no fluff.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {STACK.map((group) => {
                  const c = colorMap[group.color];
                  return (
                    <div
                      key={group.category}
                      className="relative rounded-2xl bg-white border border-zinc-200 p-5 overflow-hidden hover:border-zinc-300 hover:shadow-md transition"
                    >
                      {/* Subtle glow blob */}
                      <div className={`absolute -top-6 -right-6 w-24 h-24 rounded-full blur-2xl ${c.glow} pointer-events-none`} />

                      <span className={`font-mono-code text-[11px] font-bold uppercase tracking-wider block mb-4 ${c.label}`}>
                        {group.category}
                      </span>

                      <div className="flex flex-wrap gap-2">
                        {group.items.map((item) => (
                          <span
                            key={item}
                            className={`inline-block px-2.5 py-1 rounded-lg text-[11px] font-mono-code font-medium transition cursor-default ${c.pill}`}
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Total count strip */}
              <div className="flex items-center gap-4 pt-4 border-t border-zinc-100 font-mono-code text-xs text-zinc-400">
                <span className="text-zinc-900 font-bold text-sm">{STACK.reduce((a, g) => a + g.items.length, 0)}</span>
                <span>TOOLS & TECHNOLOGIES ACROSS {STACK.length} CATEGORIES</span>
              </div>
            </motion.div>
          )}

          {/* ── MY SETUP ── */}
          {activeTab === 'setup' && (
            <motion.div
              key="setup"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
              className="bg-[#0D0E12] text-white p-8 md:p-10 rounded-3xl border border-zinc-800 shadow-xl"
            >
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                {[
                  {
                    icon: <Laptop2 className="w-5 h-5 text-[#0052FF]" />,
                    label: 'WORKSTATION',
                    title: 'ARCH / WINDOWS',
                    desc: 'My old laptop running dual boot CachyOS and Windows 11 (for gaming mostly — iGPU, but have faith.)',
                  },
                  {
                    icon: <Bot className="w-5 h-5 text-[#0052FF]" />,
                    label: 'AI CODING STACK',
                    title: 'AI Agents',
                    desc: 'Full library of AI agents working in parallel — Antigravity, Claude, OpenCode, Freebuff — each on different things.',
                  },
                  {
                    icon: <Coffee className="w-5 h-5 text-[#0052FF]" />,
                    label: 'POWER SOURCE',
                    title: 'CAFFEINE',
                    desc: 'OFC this is the thing keeping me pushing. Coffee & Monster — the only two dependencies that never break.',
                  },
                ].map((item, i) => (
                  <div key={i}>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="p-2 rounded-xl bg-white/5">{item.icon}</div>
                      <span className="font-mono-code text-xs text-[#0052FF] font-semibold">{item.label}</span>
                    </div>
                    <h4 className="font-display font-bold text-xl text-white mb-2">{item.title}</h4>
                    <p className="text-xs text-zinc-400 leading-relaxed font-mono-code">{item.desc}</p>
                  </div>
                ))}
              </div>

              <div className="mt-10 pt-8 border-t border-white/10 flex items-center gap-3 font-mono-code text-xs text-zinc-400">
                <Zap className="w-4 h-4 text-[#0052FF]" />
                <span>POWERED BY CAFFEINE AND A CONVICTION THAT MACHINES SHOULD DO WHAT YOU TELL THEM.</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};
