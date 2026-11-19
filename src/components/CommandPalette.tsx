import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, FolderGit2, Cpu, Mail, Sparkles, ExternalLink, X, Code2, User } from 'lucide-react';
import confetti from 'canvas-confetti';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProject?: (id: string) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        isOpen ? onClose() : undefined;
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const runConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#0052FF', '#0D0E12', '#93C5FD', '#10B981'],
    });
    onClose();
  };

  const copyEmail = () => {
    navigator.clipboard.writeText('katrate.engineering@gmail.com');
    runConfetti();
    alert('Copied to clipboard: katrate.engineering@gmail.com');
  };

  const commands = [
    {
      id: 'works',
      label: 'Jump to Selected Works & Repositories',
      category: 'Navigation',
      icon: <FolderGit2 className="w-4 h-4 text-[#0052FF]" />,
      action: () => {
        document.getElementById('works')?.scrollIntoView({ behavior: 'smooth' });
        onClose();
      },
    },
    {
      id: 'about',
      label: 'Jump to About Katrate & DNA',
      category: 'Navigation',
      icon: <User className="w-4 h-4 text-[#0052FF]" />,
      action: () => {
        document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
        onClose();
      },
    },
    {
      id: 'lab',
      label: 'Jump to Engineering Lab & Sandbox',
      category: 'Navigation',
      icon: <Cpu className="w-4 h-4 text-[#0052FF]" />,
      action: () => {
        document.getElementById('lab')?.scrollIntoView({ behavior: 'smooth' });
        onClose();
      },
    },
    {
      id: 'contact',
      label: 'Initiate Contact / Commission',
      category: 'Action',
      icon: <Mail className="w-4 h-4 text-[#0052FF]" />,
      action: () => {
        document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
        onClose();
      },
    },
    {
      id: 'github',
      label: 'Open github.com/katrate Profile',
      category: 'External',
      icon: <Code2 className="w-4 h-4 text-zinc-800" />,
      action: () => {
        window.open('https://github.com/katrate', '_blank');
        onClose();
      },
    },
    {
      id: 'copy-email',
      label: 'Copy Direct Email Address',
      category: 'Action',
      icon: <Sparkles className="w-4 h-4 text-emerald-500" />,
      action: copyEmail,
    },
    {
      id: 'confetti',
      label: 'Celebrate / Fire Confetti Engine',
      category: 'Fun',
      icon: <Sparkles className="w-4 h-4 text-amber-500" />,
      action: runConfetti,
    },
  ];

  const filteredCommands = commands.filter((cmd) =>
    cmd.label.toLowerCase().includes(query.toLowerCase()) ||
    cmd.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-md"
          />

          {/* Palette Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -10 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-xl bg-white border border-zinc-200 rounded-2xl shadow-2xl overflow-hidden z-10"
          >
            {/* Search Input Bar */}
            <div className="flex items-center px-4 py-3.5 border-b border-zinc-100">
              <Search className="w-5 h-5 text-zinc-400 mr-3 shrink-0" />
              <input
                type="text"
                autoFocus
                placeholder="Type a command or search sections..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-transparent text-sm md:text-base text-zinc-900 placeholder-zinc-400 focus:outline-none font-sans"
              />
              <button
                onClick={onClose}
                className="p-1 rounded-md text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Results list */}
            <div className="max-h-80 overflow-y-auto p-2 divide-y divide-zinc-50">
              {filteredCommands.length > 0 ? (
                filteredCommands.map((cmd) => (
                  <button
                    key={cmd.id}
                    onClick={cmd.action}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-zinc-50 transition text-left cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-1.5 rounded-lg bg-zinc-100 group-hover:bg-white group-hover:shadow-xs transition">
                        {cmd.icon}
                      </div>
                      <span className="text-sm font-medium text-zinc-800 group-hover:text-black">
                        {cmd.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono-code text-[11px] text-zinc-400 uppercase tracking-wider">
                        {cmd.category}
                      </span>
                      <ExternalLink className="w-3.5 h-3.5 text-zinc-300 opacity-0 group-hover:opacity-100 transition" />
                    </div>
                  </button>
                ))
              ) : (
                <div className="py-8 text-center text-sm text-zinc-400 font-mono-code">
                  No commands matching "{query}"
                </div>
              )}
            </div>

            {/* Footer hints */}
            <div className="flex items-center justify-between px-4 py-2.5 bg-zinc-50 border-t border-zinc-100 text-[11px] font-mono-code text-zinc-500">
              <div className="flex items-center gap-3">
                <span>↑↓ navigate</span>
                <span>↵ select</span>
                <span>esc close</span>
              </div>
              <span className="text-[#0052FF]">KATRATE_SYSTEM: ONLINE</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
