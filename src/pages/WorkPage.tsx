import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  Volume2,
  VolumeX,
  Terminal as TerminalIcon,
  LayoutGrid,
  ExternalLink,
} from 'lucide-react';

import { CyberMatrixCanvas } from '../components/CyberMatrixCanvas';
import { TerminalCLI } from '../components/TerminalCLI';
import { ProjectsStickyStack, KATRATE_PROJECTS, type ProjectData } from '../components/ProjectsStickyStack';
import { CodeModal } from '../components/CodeModal';
import { soundFX } from '../utils/audioFx';

type ViewMode = 'BENTO_GRID' | 'TERMINAL_CLI';

export function WorkPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('BENTO_GRID');
  const [selectedProject, setSelectedProject] = useState<ProjectData | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(soundFX.enabled);
  const [currentTime, setCurrentTime] = useState('');

  // Live system telemetry clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('en-US', {
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }) + ' UTC'
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Global hotkeys (1 for Bento, 2 for Terminal)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      if (e.key === '1') {
        setViewMode('BENTO_GRID');
        soundFX.playClick();
      } else if (e.key === '2') {
        setViewMode('TERMINAL_CLI');
        soundFX.playClick();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleToggleSound = () => {
    const next = soundFX.toggle();
    setSoundEnabled(next);
  };

  const handleInspectCode = (project: ProjectData) => {
    setSelectedProject(project);
  };

  return (
    <div className="min-h-screen bg-[#0D0E12] text-white relative selection:bg-[#0052FF] selection:text-white overflow-x-hidden">
      {/* Cyber Particle Graph Canvas */}
      <CyberMatrixCanvas />

      {/* ── TOP TELEMETRY HUD BAR ── */}
      <header className="sticky top-0 z-40 w-full bg-[#0D0E12]/80 backdrop-blur-xl border-b border-white/10 px-4 sm:px-8 py-3.5 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Left: Back Link & Core Status */}
          <div className="flex items-center gap-4">
            <Link
              to="/"
              onClick={() => soundFX.playClick()}
              data-cursor="GO"
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/5 border border-white/10 text-white text-[10px] font-tech hover:bg-white/10 hover:border-[#0052FF] transition-all group"
            >
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
              <span>EXIT TO BASE</span>
            </Link>

            <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-lg bg-white/5 border border-white/5 text-[9px] font-tech text-zinc-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>CORE: ACTIVE</span>
              <span className="text-zinc-600">|</span>
              <span className="text-zinc-300">{currentTime || 'SYS CLOCK'}</span>
            </div>
          </div>

          {/* Right: Sound FX + GitHub */}
          <div className="flex items-center gap-2.5">
            {/* Audio Toggle */}
            <button
              onClick={handleToggleSound}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-mono-code font-semibold transition cursor-pointer ${
                soundEnabled
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                  : 'bg-white/5 border-white/10 text-zinc-500 hover:text-zinc-300'
              }`}
              title={soundEnabled ? 'Mute Sound FX' : 'Enable Sci-Fi Sound FX'}
            >
              {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline font-tech text-[9px]">FX: {soundEnabled ? 'ON' : 'OFF'}</span>
            </button>

            {/* GitHub Profile */}
            <a
              href="https://github.com/katrate"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0052FF] hover:bg-blue-600 text-white text-[10px] font-tech transition"
            >
              <span>GITHUB</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </header>

      {/* ── MAIN CONTENT ── */}
      <main className="relative z-10 w-full px-4 sm:px-8 pt-10 pb-28">
        {/* Page Title & Hero Telemetry */}
        <section className="max-w-7xl mx-auto mb-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="px-2.5 py-0.5 rounded-md bg-[#0052FF]/20 border border-[#0052FF]/40 text-[#0052FF] font-tech text-[9px] tracking-[0.12em] uppercase">
                  SYSTEMS CATALOG // v3.2
                </span>
                <span className="text-zinc-500 font-mono-code text-xs">
                  {KATRATE_PROJECTS.length} REPOSITORIES VERIFIED
                </span>
              </div>
              <h1 className="font-hero font-normal text-4xl sm:text-6xl lg:text-7xl text-white tracking-[0.04em] leading-[1.1]">
                ENGINEERED WORKS.
              </h1>
            </div>

            {/* Telemetry metrics bar */}
            <div className="flex flex-wrap items-center gap-3 font-tech text-[9px]">
              <div className="px-3.5 py-2 rounded-xl bg-white/5 border border-white/10">
                <span className="text-zinc-500 block text-[10px]">TOTAL ARTIFACTS</span>
                <span className="text-white font-bold">{KATRATE_PROJECTS.length} REPOSITORIES</span>
              </div>
              <div className="px-3.5 py-2 rounded-xl bg-white/5 border border-white/10">
                <span className="text-zinc-500 block text-[10px]">CORE DOMAINS</span>
                <span className="text-emerald-400 font-bold">LANGUAGES · CLI · WEB · APPS</span>
              </div>
              <div className="px-3.5 py-2 rounded-xl bg-white/5 border border-white/10">
                <span className="text-zinc-500 block text-[10px]">STATUS</span>
                <span className="text-[#0052FF] font-bold">ALL SYSTEMS LIVE</span>
              </div>
            </div>
          </div>
        </section>

        {/* ── VIEW MODE SWITCHER TABS ── */}
        <section className="max-w-7xl mx-auto mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-2 bg-[#12131A] border border-white/10 rounded-2xl">
            <span className="font-mono-code text-xs text-zinc-400 px-3">
              SELECT INTERFACE PERSPECTIVE:
            </span>

            <div className="flex flex-wrap items-center gap-1.5">
              {/* Bento Grid */}
              <button
                onClick={() => {
                  setViewMode('BENTO_GRID');
                  soundFX.playClick();
                }}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl font-mono-code text-xs font-bold transition cursor-pointer ${
                  viewMode === 'BENTO_GRID'
                    ? 'bg-[#0052FF] text-white shadow-lg shadow-blue-500/20'
                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>BENTO CATALOG (3D TILT)</span>
                <kbd className="text-[10px] opacity-60 bg-black/30 px-1.5 py-0.5 rounded">1</kbd>
              </button>

              {/* Terminal CLI */}
              <button
                onClick={() => {
                  setViewMode('TERMINAL_CLI');
                  soundFX.playClick();
                }}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl font-mono-code text-xs font-bold transition cursor-pointer ${
                  viewMode === 'TERMINAL_CLI'
                    ? 'bg-[#0052FF] text-white shadow-lg shadow-blue-500/20'
                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <TerminalIcon className="w-3.5 h-3.5" />
                <span>HACKER TERMINAL CLI</span>
                <kbd className="text-[10px] opacity-60 bg-black/30 px-1.5 py-0.5 rounded">2</kbd>
              </button>
            </div>
          </div>
        </section>

        {/* ── ACTIVE VIEW CONTENT ── */}
        <AnimatePresence mode="wait">
          {viewMode === 'BENTO_GRID' && (
            <motion.div
              key="bento-grid"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
            >
              <ProjectsStickyStack onInspectCode={handleInspectCode} />
            </motion.div>
          )}

          {viewMode === 'TERMINAL_CLI' && (
            <motion.div
              key="terminal-cli"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
            >
              <TerminalCLI />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* ── CODE INSPECTION MODAL ── */}
      <CodeModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </div>
  );
}

export default WorkPage;
