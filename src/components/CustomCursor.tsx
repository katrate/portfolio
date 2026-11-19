import React, { useEffect, useState, useRef } from 'react';
import { motion, useSpring, useMotionValue } from 'motion/react';
import {
  ArrowUpRight,
  Code2,
  Eye,
  Copy,
  Volume2,
  Compass,
  Terminal,
  Type,
  Send,
  X,
  Layers,
  Zap,
} from 'lucide-react';

type CursorTask =
  | 'default'
  | 'link'      // External links, GitHub
  | 'nav'       // Navigation, navbar items
  | 'code'      // Inspect code, syntax
  | 'copy'      // Copy to clipboard, email
  | 'audio'     // Sound FX toggle
  | 'terminal'  // Terminal CLI, commands
  | 'input'     // Text inputs
  | 'view'      // Tab switchers
  | 'explore'   // Bento cards, project items
  | 'close'     // Close buttons
  | 'send'      // Send / submit buttons
  | 'action';   // Generic buttons

export const CustomCursor: React.FC = () => {
  const [task, setTask] = useState<CursorTask>('default');
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const lastHighlightedRef = useRef<HTMLElement | null>(null);

  // Smooth spring physics for magnetic lag
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  const springConfig = { damping: 24, stiffness: 300, mass: 0.35 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  // Fast follow center dot
  const dotX = useSpring(mouseX, { damping: 32, stiffness: 480, mass: 0.1 });
  const dotY = useSpring(mouseY, { damping: 32, stiffness: 480, mass: 0.1 });

  // Border highlight helper
  const applyHighlight = (el: HTMLElement | null, color: string) => {
    // Remove from previous element
    if (lastHighlightedRef.current && lastHighlightedRef.current !== el) {
      const prev = lastHighlightedRef.current;
      prev.style.outline = '';
      prev.style.outlineOffset = '';
      prev.style.transition = '';
      lastHighlightedRef.current = null;
    }
    if (!el) return;
    el.style.outline = `2px solid ${color}`;
    el.style.outlineOffset = '4px';
    el.style.transition = 'outline 0.12s ease, outline-offset 0.12s ease';
    lastHighlightedRef.current = el;
  };

  const removeHighlight = () => {
    if (lastHighlightedRef.current) {
      lastHighlightedRef.current.style.outline = '';
      lastHighlightedRef.current.style.outlineOffset = '';
      lastHighlightedRef.current = null;
    }
  };

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const onMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);

      const target = e.target as HTMLElement | null;
      if (!target) return;

      // 1. Explicit data-cursor takes precedence
      const customEl = target.closest('[data-cursor]') as HTMLElement | null;
      if (customEl) {
        setIsHovered(true);
        const val = (customEl.getAttribute('data-cursor') || '').toUpperCase();

        if (val === 'COPY') { setTask('copy'); applyHighlight(customEl, '#10B981'); }
        else if (val === 'CODE') { setTask('code'); applyHighlight(customEl, '#0052FF'); }
        else if (val === 'LINK' || val === 'EXT') { setTask('link'); applyHighlight(customEl, '#0052FF'); }
        else if (val === 'NAV' || val === 'GO' || val === 'TOP') { setTask('nav'); applyHighlight(customEl, '#0052FF'); }
        else if (val === 'AUDIO' || val === 'SOUND') { setTask('audio'); applyHighlight(customEl, '#6366F1'); }
        else if (val === 'RUN' || val === 'TERMINAL') { setTask('terminal'); applyHighlight(customEl, '#10B981'); }
        else if (val === 'VIEW') { setTask('view'); applyHighlight(customEl, '#0052FF'); }
        else if (val === 'EXPLORE') { setTask('explore'); applyHighlight(customEl, '#F59E0B'); }
        else if (val === 'CLOSE') { setTask('close'); applyHighlight(customEl, '#EF4444'); }
        else if (val === 'SEND') { setTask('send'); applyHighlight(customEl, '#0052FF'); }
        else { setTask('action'); applyHighlight(customEl, '#0052FF'); }
        return;
      }

      // 2. Intelligent context-aware task detection
      const clickable = target.closest(
        'button, a, input, textarea, select, [role="button"]'
      ) as HTMLElement | null;

      if (clickable) {
        setIsHovered(true);

        const textContent = (clickable.innerText || clickable.textContent || '').toUpperCase();
        const ariaLabel = (clickable.getAttribute('aria-label') || '').toUpperCase();
        const title = (clickable.getAttribute('title') || '').toUpperCase();
        const href = clickable.getAttribute('href') || '';
        const isInput = clickable.tagName === 'INPUT' || clickable.tagName === 'TEXTAREA';

        if (isInput) {
          setTask('input');
          applyHighlight(clickable, '#0052FF');
        } else if (
          textContent.includes('COPY') ||
          ariaLabel.includes('COPY') ||
          textContent.includes('GMAIL')
        ) {
          setTask('copy');
          applyHighlight(clickable, '#10B981');
        } else if (
          textContent.includes('SEND') ||
          textContent.includes('SUBMIT') ||
          ariaLabel.includes('SEND')
        ) {
          setTask('send');
          applyHighlight(clickable, '#0052FF');
        } else if (
          textContent.includes('INSPECT') ||
          textContent.includes('CODE') ||
          ariaLabel.includes('CODE')
        ) {
          setTask('code');
          applyHighlight(clickable, '#0052FF');
        } else if (
          title.includes('MUTE') ||
          title.includes('SOUND') ||
          textContent.includes('FX:')
        ) {
          setTask('audio');
          applyHighlight(clickable, '#6366F1');
        } else if (
          clickable.closest('header, nav') ||
          textContent.includes('EXIT') ||
          textContent.includes('BACK') ||
          textContent.includes('SYS.INIT') ||
          textContent.includes('WORKS') ||
          textContent.includes('ABOUT') ||
          textContent.includes('CONNECT') ||
          textContent.includes('GITHUB') ||
          href.startsWith('#') ||
          href === '/'
        ) {
          setTask('nav');
          applyHighlight(clickable, '#0052FF');
        } else if (
          clickable.getAttribute('target') === '_blank' ||
          href.includes('github.com') ||
          title.includes('GITHUB') ||
          textContent.includes('LIVE DEMO') ||
          title.includes('LIVE DEMO')
        ) {
          setTask('link');
          applyHighlight(clickable, '#0052FF');
        } else if (
          title.includes('CLEAR') ||
          ariaLabel.includes('CLOSE') ||
          textContent === '✕' ||
          textContent === '×'
        ) {
          setTask('close');
          applyHighlight(clickable, '#EF4444');
        } else if (
          textContent.includes('BENTO') ||
          textContent.includes('TERMINAL') ||
          clickable.closest('[role="tablist"]')
        ) {
          setTask('view');
          applyHighlight(clickable, '#0052FF');
        } else if (
          textContent.includes('PEEK') ||
          textContent.includes('STASH') ||
          textContent.includes('EXPLORE')
        ) {
          setTask('explore');
          applyHighlight(clickable, '#F59E0B');
        } else {
          setTask('action');
          applyHighlight(clickable, '#0052FF');
        }
      } else {
        setIsHovered(false);
        setTask('default');
        removeHighlight();
      }
    };

    const onMouseDown = () => setIsClicked(true);
    const onMouseUp = () => setIsClicked(false);
    const onMouseLeave = () => {
      setIsVisible(false);
      removeHighlight();
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    document.addEventListener('mouseleave', onMouseLeave);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mouseleave', onMouseLeave);
      removeHighlight();
    };
  }, [isVisible, mouseX, mouseY]);

  if (!isVisible) return null;

  // Task-specific icon and colour for the small floating indicator
  const getTaskIcon = () => {
    switch (task) {
      case 'copy': return <Copy className="w-3 h-3 text-white" />;
      case 'audio': return <Volume2 className="w-3 h-3 text-white" />;
      case 'close': return <X className="w-3 h-3 text-white" />;
      case 'input': return <Type className="w-3 h-3 text-white" />;
      case 'code': return <Code2 className="w-3 h-3 text-white" />;
      case 'nav': return <Compass className="w-3 h-3 text-white" />;
      case 'terminal': return <Terminal className="w-3 h-3 text-emerald-300" />;
      case 'link': return <ArrowUpRight className="w-3 h-3 text-white" />;
      case 'view': return <Layers className="w-3 h-3 text-white" />;
      case 'explore': return <Eye className="w-3 h-3 text-amber-300" />;
      case 'send': return <Send className="w-3 h-3 text-white" />;
      case 'action': return <Zap className="w-3 h-3 text-white" />;
      default: return null;
    }
  };

  const getTaskColor = () => {
    switch (task) {
      case 'copy': return 'rgba(16, 185, 129, 0.9)';
      case 'audio': return 'rgba(99, 102, 241, 0.9)';
      case 'close': return 'rgba(239, 68, 68, 0.9)';
      case 'input': return 'rgba(0, 82, 255, 0.85)';
      case 'code': return 'rgba(0, 82, 255, 0.9)';
      case 'nav': return 'rgba(0, 82, 255, 0.9)';
      case 'terminal': return 'rgba(13, 14, 18, 0.95)';
      case 'link': return 'rgba(0, 82, 255, 0.9)';
      case 'view': return 'rgba(0, 82, 255, 0.9)';
      case 'explore': return 'rgba(245, 158, 11, 0.9)';
      case 'send': return 'rgba(0, 82, 255, 0.9)';
      case 'action': return 'rgba(0, 82, 255, 0.9)';
      default: return 'transparent';
    }
  };

  const icon = getTaskIcon();
  const indicatorSize = isHovered && icon ? 28 : 0;

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
      {/* Small floating task indicator — appears near cursor when hovering */}
      {isHovered && icon && (
        <motion.div
          style={{
            x: smoothX,
            y: smoothY,
            translateX: 12,
            translateY: -indicatorSize - 4,
          }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{
            scale: isClicked ? 0.85 : 1,
            opacity: 1,
            backgroundColor: getTaskColor(),
          }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ type: 'spring', damping: 20, stiffness: 380 }}
          className="fixed top-0 left-0 w-7 h-7 rounded-lg flex items-center justify-center shadow-lg shadow-black/20"
        >
          {icon}
        </motion.div>
      )}

      {/* Center precise dot */}
      <motion.div
        style={{
          x: dotX,
          y: dotY,
          translateX: -3,
          translateY: -3,
          boxShadow: '0 0 6px rgba(0, 82, 255, 0.6)',
        }}
        animate={{
          scale: isClicked ? 1.8 : isHovered ? 0.5 : 1,
          opacity: isHovered ? 0.6 : 1,
          backgroundColor: isHovered ? getTaskColor() : '#0052FF',
        }}
        transition={{ type: 'spring', damping: 30, stiffness: 500 }}
        className="fixed top-0 left-0 w-1.5 h-1.5 rounded-full pointer-events-none"
      />
    </div>
  );
};
