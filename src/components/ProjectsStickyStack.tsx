import React, { useState, useRef } from 'react';
import { Code2, ArrowUpRight, Search, Terminal, Globe, Cpu, Smartphone, Sparkles, ExternalLink, Wrench } from 'lucide-react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'motion/react';

import defaultProjects from '../../content/projects.json';

export type ProjectCategory = 'ALL' | 'LANGUAGES' | 'CLI' | 'WEBSITES' | 'APPS' | 'TOOLS';

export interface ProjectData {
  id: string;
  name: string;
  category: 'LANGUAGES' | 'CLI' | 'WEBSITES' | 'APPS' | 'TOOLS';
  categoryLabel: string;
  tagline: string;
  description: string;
  language: string;
  tags: string[];
  githubUrl: string;
  liveUrl?: string;
  releasesUrl?: string;
  image: string;
  status?: 'active' | 'building';
  benchmark?: string;
  codeSnippet: {
    lang: string;
    filename: string;
    code: string;
  };
}

export const KATRATE_PROJECTS: ProjectData[] = defaultProjects as ProjectData[];

import { soundFX } from '../utils/audioFx';

interface ProjectsStickyStackProps {
  onInspectCode?: (project: ProjectData) => void;
}

const BentoCard3D: React.FC<{ project: ProjectData; onInspectCode?: (p: ProjectData) => void }> = ({
  project,
  onInspectCode,
}) => {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 25 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 25 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['7deg', '-7deg']);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-7deg', '7deg']);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
      }}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.22 }}
      className="bg-[#14151C] border border-white/10 rounded-3xl flex flex-col justify-between hover:border-[#0052FF]/60 transition-colors duration-300 group overflow-hidden relative shadow-xl min-h-[380px]"
    >
      {/* Dynamic 3D holographic sheen overlay */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-3xl"
        style={{
          background: 'radial-gradient(circle at center, rgba(0, 82, 255, 0.12) 0%, transparent 70%)',
        }}
      />

      {/* Top Meta */}
      <div>
        <div className="flex items-center justify-between px-7 pt-7 pb-0 gap-2">
          <div className="flex items-center gap-2">
            {project.status && (
              <span
                className={`h-2.5 w-2.5 shrink-0 rounded-full ${
                  project.status === 'active' ? 'bg-emerald-400' : 'bg-blue-400'
                } animate-pulse`}
                title={project.status === 'active' ? 'Continuously updated' : 'In development'}
              />
            )}
            <span className="font-mono-code text-[11px] text-[#0052FF] font-bold uppercase tracking-wider">
              {project.categoryLabel}
            </span>
          </div>
          {project.benchmark ? (
            <span className="font-mono-code text-[10px] px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-semibold whitespace-nowrap">
              {project.benchmark}
            </span>
          ) : (
            <span className="font-mono-code text-[11px] px-2.5 py-1 rounded-md bg-white/5 border border-white/5 text-zinc-400">
              {project.language}
            </span>
          )}
        </div>

        {/* Card Body */}
        <div className="flex flex-col px-7 py-5">
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noreferrer"
            className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight mb-2 group-hover:text-[#4d85ff] transition-colors duration-300 block"
          >
            {project.name}
          </a>

          <p className="font-mono-code text-xs text-zinc-400 leading-relaxed mb-4">
            {project.tagline}
          </p>

          <p className="text-sm text-zinc-300 leading-relaxed mb-5 font-normal">
            {project.description}
          </p>

          <div className="flex flex-wrap gap-2 mb-2">
            {project.tags.slice(0, 5).map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-0.5 rounded-md bg-white/5 border border-white/8 text-[11px] font-mono-code text-zinc-300"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Card Footer Actions */}
      <div className="mx-7 mb-7 pt-5 border-t border-white/10 flex items-center gap-3">
        {onInspectCode ? (
          <button
            onClick={() => {
              soundFX.playClick();
              onInspectCode(project);
            }}
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#0052FF] text-white text-xs font-mono-code font-bold hover:bg-blue-600 active:scale-95 transition cursor-pointer"
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>INSPECT CODE</span>
          </button>
        ) : (
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noreferrer"
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#0052FF] text-white text-xs font-mono-code font-bold hover:bg-blue-600 transition cursor-pointer"
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>INSPECT CODE</span>
          </a>
        )}

        {project.liveUrl && (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center p-2.5 rounded-xl bg-white/5 border border-white/10 text-zinc-300 hover:text-white hover:bg-white/15 transition"
            title="Live Demo"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        )}

        <a
          href={project.releasesUrl ?? `${project.githubUrl}#readme`}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center justify-center p-2.5 rounded-xl bg-white/5 border border-white/10 text-zinc-300 hover:text-white hover:bg-white/15 transition"
          title={project.releasesUrl ? 'Latest Release' : 'README'}
        >
          <ArrowUpRight className="w-4 h-4" />
        </a>
      </div>
    </motion.div>
  );
};

export const ProjectsStickyStack: React.FC<ProjectsStickyStackProps> = ({ onInspectCode }) => {
  const [selectedCategory, setSelectedCategory] = useState<ProjectCategory>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProjects = KATRATE_PROJECTS.filter((p) => {
    const matchesCategory = selectedCategory === 'ALL' || p.category === selectedCategory;
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.language.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const counts = {
    ALL: KATRATE_PROJECTS.length,
    LANGUAGES: KATRATE_PROJECTS.filter((p) => p.category === 'LANGUAGES').length,
    CLI: KATRATE_PROJECTS.filter((p) => p.category === 'CLI').length,
    WEBSITES: KATRATE_PROJECTS.filter((p) => p.category === 'WEBSITES').length,
    APPS: KATRATE_PROJECTS.filter((p) => p.category === 'APPS').length,
    TOOLS: KATRATE_PROJECTS.filter((p) => p.category === 'TOOLS').length,
  };

  const categories: { id: ProjectCategory; label: string; icon: React.ReactNode }[] = [
    { id: 'ALL', label: `All Work (${counts.ALL})`, icon: <Sparkles className="w-3.5 h-3.5" /> },
    { id: 'LANGUAGES', label: `Languages & OS (${counts.LANGUAGES})`, icon: <Cpu className="w-3.5 h-3.5" /> },
    { id: 'CLI', label: `CLI & Devtools (${counts.CLI})`, icon: <Terminal className="w-3.5 h-3.5" /> },
    { id: 'WEBSITES', label: `Websites (${counts.WEBSITES})`, icon: <Globe className="w-3.5 h-3.5" /> },
    { id: 'APPS', label: `Apps (${counts.APPS})`, icon: <Smartphone className="w-3.5 h-3.5" /> },
    { id: 'TOOLS', label: `Tools (${counts.TOOLS})`, icon: <Wrench className="w-3.5 h-3.5" /> },
  ];

  return (
    <section id="works" className="relative bg-transparent text-white py-12 px-4 sm:px-8">
      {/* Section Header */}
      <div className="max-w-7xl mx-auto mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-6">
        <div>
          <span className="font-mono-code text-xs uppercase tracking-widest text-[#0052FF] mb-2 block">
            FULL CATALOG // GITHUB.COM/KATRATE
          </span>
          <h2 className="font-display font-extrabold text-3xl sm:text-5xl text-white tracking-tight">
            EXPLORE BY DOMAIN.
          </h2>
        </div>
        <div className="flex items-center gap-3 self-end">
          {/* Search */}
          <div className="relative w-56">
            <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-full pl-9 pr-4 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#0052FF] font-mono-code transition"
            />
          </div>
          <a
            href="https://github.com/katrate"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 text-zinc-300 hover:text-white transition font-mono-code text-xs font-semibold"
          >
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>GitHub</span>
          </a>
        </div>
      </div>

      {/* Category Pills */}
      <div className="max-w-7xl mx-auto flex flex-wrap items-center gap-2 mb-10">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => {
              setSelectedCategory(cat.id);
              soundFX.playClick();
            }}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-mono-code text-xs font-semibold transition cursor-pointer ${
              selectedCategory === cat.id
                ? 'bg-[#0052FF] text-white shadow-lg shadow-blue-500/20'
                : 'bg-white/5 border border-white/10 text-zinc-400 hover:text-white hover:bg-white/10'
            }`}
          >
            {cat.icon}
            <span>{cat.label}</span>
          </button>
        ))}
      </div>

      {/* Project Cards Grid with 3D Perspective Tilt */}
      <div className="max-w-7xl mx-auto">
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredProjects.map((project) => (
              <BentoCard3D
                key={project.id}
                project={project}
                onInspectCode={onInspectCode}
              />
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredProjects.length === 0 && (
          <div className="py-24 text-center">
            <p className="font-mono-code text-sm text-zinc-600">
              NO RESULTS FOR "{searchQuery.toUpperCase()}"
            </p>
          </div>
        )}
      </div>
    </section>
  );
};
