import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Home, Layers, User, Mail, GitBranch } from 'lucide-react';
import { useNav } from '../context/NavContext';

const DARK_SECTIONS = ['contact'];

const COLLAPSED_W = 56;   // px — icon rail width
const EXPANDED_W  = 192;  // px — full label width

interface NavItem {
  id: string;
  label: string;
  Icon: React.FC<{ className?: string }>;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'top',     label: 'SYS.INIT', Icon: Home   },
  { id: 'works',   label: 'WORKS',    Icon: Layers  },
  { id: 'about',   label: 'ABOUT',    Icon: User    },
  { id: 'contact', label: 'CONNECT',  Icon: Mail    },
];

export const FloatingNavbar: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('top');
  const [isDark, setIsDark]               = useState(false);
  const { isExpanded, setIsExpanded }     = useNav();
  const navigate = useNavigate();

  /* ── scroll spy ── */
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['about', 'contact'];
      let current = 'top';
      if (window.scrollY < 200) {
        current = 'top';
      } else {
        for (const section of sections) {
          const el = document.getElementById(section);
          if (el && el.getBoundingClientRect().top <= window.innerHeight / 2) current = section;
        }
      }
      setActiveSection(current);
      setIsDark(DARK_SECTIONS.includes(current));
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  /* ── navigation ── */
  const handleNav = (id: string) => {
    if (id === 'top')   window.scrollTo({ top: 0, behavior: 'smooth' });
    else if (id === 'works') navigate('/work');
    else document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  /* ── derived colours ── */
  const bg           = isDark ? '#0D0E12' : (isExpanded ? 'rgba(248,249,250,0.95)' : 'transparent');
  const trackColor   = isDark ? 'rgba(255,255,255,0.15)' : 'rgba(161,161,170,0.4)';
  const activeColor  = '#0052FF';
  const activeTxt    = isDark ? '#ffffff' : '#0a0a0a';
  const inactiveTxt  = isDark ? 'rgba(255,255,255,0.45)' : '#71717a';

  return (
    <motion.header
      onHoverStart={() => setIsExpanded(true)}
      onHoverEnd={()   => setIsExpanded(false)}
      initial={{ width: COLLAPSED_W }}
      animate={{ width: isExpanded ? EXPANDED_W : COLLAPSED_W }}
      transition={{ type: 'spring', stiffness: 320, damping: 30 }}
      className="fixed left-0 top-0 bottom-0 z-40 pointer-events-none hidden sm:flex overflow-hidden"
      style={{
        backgroundColor: bg,
        backdropFilter: isExpanded ? 'blur(12px)' : 'none',
        borderRight: isExpanded
          ? `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.07)'}`
          : '1px solid transparent',
        boxShadow: isExpanded ? '4px 0 32px rgba(0,0,0,0.07)' : 'none',
        transition: 'background-color 0.4s, border-color 0.3s, box-shadow 0.3s',
      }}
    >
      <nav className="pointer-events-auto flex flex-col items-start justify-center gap-8 h-full w-full px-3 relative">

        {/* ── Avatar / home ── */}
        <button
          onClick={() => handleNav('top')}
          data-cursor="NAV"
          className="flex items-center gap-3 group cursor-pointer w-full"
          style={{ minHeight: 44 }}
        >
          <div
            className={`w-9 h-9 shrink-0 rounded-full overflow-hidden border-2 transition-all shadow-md
              ${isDark ? 'border-white/25 group-hover:border-[#0052FF]' : 'border-zinc-300 group-hover:border-[#0052FF]'}`}
          >
            <img src="/pfp.jpg" alt="Profile" className="w-full h-full object-cover" />
          </div>

          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -6 }}
                transition={{ duration: 0.18, ease: 'easeOut' }}
                className="flex flex-col overflow-hidden"
              >
                <span className="font-tech text-[10px] tracking-[0.12em] whitespace-nowrap"
                  style={{ color: activeTxt }}>
                  KATRATE
                </span>
                <span className="font-mono-code text-[9px] tracking-widest whitespace-nowrap"
                  style={{ color: inactiveTxt }}>
                  DEV
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </button>

        {/* ── Divider ── */}
        <motion.div
          animate={{ backgroundColor: trackColor }}
          className="w-full h-[1px] shrink-0"
          transition={{ duration: 0.4 }}
        />

        {/* ── Nav items ── */}
        <div className="flex flex-col gap-1 w-full">
          {NAV_ITEMS.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                data-cursor="NAV"
                className="flex items-center gap-3 w-full rounded-lg px-2 py-2.5 cursor-pointer group transition-colors duration-150 relative"
                style={{
                  backgroundColor: isActive
                    ? (isDark ? 'rgba(0,82,255,0.15)' : 'rgba(0,82,255,0.08)')
                    : 'transparent',
                }}
              >
                {/* Active indicator bar */}
                <motion.div
                  animate={{ scaleY: isActive ? 1 : 0, opacity: isActive ? 1 : 0 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 24 }}
                  className="absolute left-0 top-2 bottom-2 w-[3px] rounded-r-full origin-center"
                  style={{ backgroundColor: activeColor }}
                />

                {/* Icon */}
                <div
                  className="w-5 h-5 flex items-center justify-center shrink-0 transition-colors duration-200"
                  style={{ color: isActive ? activeColor : (isExpanded ? inactiveTxt : (isDark ? 'rgba(255,255,255,0.5)' : '#a1a1aa')) }}
                >
                  <item.Icon className="w-[17px] h-[17px]" />
                </div>

                {/* Label */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.span
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -8 }}
                      transition={{ duration: 0.16, ease: 'easeOut' }}
                      className="font-tech text-[9px] tracking-[0.12em] whitespace-nowrap"
                      style={{ color: isActive ? activeColor : inactiveTxt }}
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>

                {/* Hover glow on icon when collapsed */}
                {!isExpanded && (
                  <span className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-150"
                    style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)' }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* ── Divider ── */}
        <motion.div
          animate={{ backgroundColor: trackColor }}
          className="w-full h-[1px] shrink-0"
          transition={{ duration: 0.4 }}
        />

        {/* ── GitHub ── */}
        <button
          onClick={() => window.open('https://github.com/katrate', '_blank')}
          data-cursor="LINK"
          className="flex items-center gap-3 w-full rounded-lg px-2 py-2.5 cursor-pointer group transition-colors duration-150"
          style={{ marginTop: -8 }}
        >
          <div
            className="w-5 h-5 flex items-center justify-center shrink-0 transition-colors duration-200 group-hover:text-[#0052FF]"
            style={{ color: isDark ? 'rgba(255,255,255,0.5)' : '#a1a1aa' }}
          >
            <GitBranch className="w-[17px] h-[17px]" />
          </div>

          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.16, ease: 'easeOut' }}
                className="flex items-center gap-2"
              >
                <span className="font-tech text-[9px] tracking-[0.12em] whitespace-nowrap group-hover:text-[#0052FF] transition-colors"
                  style={{ color: inactiveTxt }}>
                  GITHUB
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#0052FF] animate-pulse shrink-0" />
              </motion.div>
            )}
          </AnimatePresence>
        </button>

      </nav>
    </motion.header>
  );
};
