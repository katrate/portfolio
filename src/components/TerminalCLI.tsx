import React, { useState, useRef, useEffect } from 'react';
import { Terminal, Send, Trash2, ExternalLink } from 'lucide-react';
import { soundFX } from '../utils/audioFx';
import { KATRATE_PROJECTS } from './ProjectsStickyStack';

interface TerminalLine {
  id: string;
  type: 'cmd' | 'output' | 'error' | 'success';
  text: string | React.ReactNode;
}

const ASCII_BANNER = `
 ██████╗██╗   ██╗██████╗ ███████╗██████╗ 
██╔════╝╚██╗ ██╔╝██╔══██╗██╔════╝██╔══██╗
██║      ╚████╔╝ ██████╔╝█████╗  ██████╔╝
██║       ╚██╔╝  ██╔══██╗██╔══╝  ██╔══██╗
╚██████╗   ██║   ██████╔╝███████╗██║  ██║
 ╚═════╝   ╚═╝   ╚═════╝ ╚══════╝╚═╝  ╚═╝
KATRATE ARCHITECTURE OS // v3.2.0-STABLE
16 REPOSITORIES CATALOGUED // AVAILABLE COMMANDS:
ls | cat <repo> | init <repo> | grep <repo> | clear
`;

export const TerminalCLI: React.FC = () => {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<TerminalLine[]>([
    {
      id: '1',
      type: 'output',
      text: (
        <pre className="text-[#0052FF] font-mono-code text-[11px] leading-tight select-none">
          {ASCII_BANNER}
        </pre>
      ),
    },
    {
      id: '2',
      type: 'success',
      text: 'Telemetry initialized: 16 repositories mapped. Type "ls" to list repositories or "help" for syntax.',
    },
  ]);

  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const findProject = (query: string) => {
    const q = query.trim().toLowerCase();
    return KATRATE_PROJECTS.find(
      (p) => p.id.toLowerCase() === q || p.name.toLowerCase() === q
    );
  };

  const handleCommand = (cmdText: string) => {
    const raw = cmdText.trim();
    if (!raw) return;

    soundFX.playClick();
    const parts = raw.split(/\s+/);
    const cmd = parts[0].toLowerCase();
    const arg = parts.slice(1).join(' ').trim();

    const newHistory: TerminalLine[] = [
      ...history,
      { id: Math.random().toString(), type: 'cmd', text: `$ ${raw}` },
    ];

    switch (cmd) {
      case 'help':
        newHistory.push({
          id: Math.random().toString(),
          type: 'output',
          text: (
            <div className="text-zinc-300 space-y-1.5 font-mono-code text-xs">
              <p className="text-[#0052FF] font-bold">COMMAND MANUAL (16 REPOSITORIES):</p>
              <p>  <span className="text-emerald-400 font-bold">ls</span>             - List all 16 repositories with category & status</p>
              <p>  <span className="text-emerald-400 font-bold">cat &lt;repo&gt;</span>    - Open GitHub repository link in a new tab</p>
              <p>  <span className="text-emerald-400 font-bold">init &lt;repo&gt;</span>   - Open release or README page in a new tab</p>
              <p>  <span className="text-emerald-400 font-bold">grep &lt;repo&gt;</span>   - Output detailed card metadata for &lt;repo&gt;</p>
              <p>  <span className="text-emerald-400 font-bold">clear</span>          - Clear terminal output buffer</p>
            </div>
          ),
        });
        break;

      case 'ls':
        newHistory.push({
          id: Math.random().toString(),
          type: 'output',
          text: (
            <div className="py-2 space-y-2 font-mono-code text-xs">
              <p className="text-zinc-400 text-[11px]">
                TOTAL CATALOGUED: {KATRATE_PROJECTS.length} REPOSITORIES // Click any repo to run "grep &lt;repo&gt;"
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                {KATRATE_PROJECTS.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => handleCommand(`grep ${p.id}`)}
                    className="p-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-[#0052FF] hover:bg-white/10 cursor-pointer transition flex items-center justify-between group"
                  >
                    <div>
                      <span className="text-white font-bold group-hover:text-[#4d85ff] block">
                        {p.name}
                      </span>
                      <span className="text-[10px] text-zinc-500">{p.categoryLabel}</span>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 border border-white/10 text-emerald-400 uppercase">
                      {p.language}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ),
        });
        break;

      case 'cat': {
        if (!arg) {
          newHistory.push({
            id: Math.random().toString(),
            type: 'error',
            text: 'Usage: cat <repo> (e.g. "cat katlans", "cat kwamlinux")',
          });
          break;
        }
        const found = findProject(arg);
        if (found) {
          soundFX.playCompile();
          if (typeof window !== 'undefined') {
            window.open(found.githubUrl, '_blank', 'noopener,noreferrer');
          }
          newHistory.push({
            id: Math.random().toString(),
            type: 'success',
            text: (
              <div className="font-mono-code text-xs space-y-1">
                <p>[SUCCESS] Opening GitHub repository in new tab for: <span className="font-bold text-white">{found.name}</span></p>
                <a
                  href={found.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-[#0052FF] hover:underline"
                >
                  <span>{found.githubUrl}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            ),
          });
        } else {
          newHistory.push({
            id: Math.random().toString(),
            type: 'error',
            text: `Repository "${arg}" not found. Type "ls" to view the 16 repositories.`,
          });
        }
        break;
      }

      case 'init': {
        if (!arg) {
          newHistory.push({
            id: Math.random().toString(),
            type: 'error',
            text: 'Usage: init <repo> (e.g. "init katlans", "init palimpsest")',
          });
          break;
        }
        const found = findProject(arg);
        if (found) {
          soundFX.playCompile();
          const targetUrl = found.releasesUrl || `${found.githubUrl}#readme`;
          if (typeof window !== 'undefined') {
            window.open(targetUrl, '_blank', 'noopener,noreferrer');
          }
          newHistory.push({
            id: Math.random().toString(),
            type: 'success',
            text: (
              <div className="font-mono-code text-xs space-y-1">
                <p>[SUCCESS] Initializing release / README documentation for: <span className="font-bold text-white">{found.name}</span></p>
                <a
                  href={targetUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-emerald-400 hover:underline"
                >
                  <span>{targetUrl}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            ),
          });
        } else {
          newHistory.push({
            id: Math.random().toString(),
            type: 'error',
            text: `Repository "${arg}" not found. Type "ls" to view the 16 repositories.`,
          });
        }
        break;
      }

      case 'grep': {
        if (!arg) {
          newHistory.push({
            id: Math.random().toString(),
            type: 'error',
            text: 'Usage: grep <repo> (e.g. "grep katlans", "grep kwamlinux")',
          });
          break;
        }
        const found = findProject(arg);
        if (found) {
          soundFX.playSuccess();
          newHistory.push({
            id: Math.random().toString(),
            type: 'output',
            text: (
              <div className="p-4 bg-black/60 border border-white/10 rounded-2xl font-mono-code text-xs space-y-2 text-zinc-300">
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <span className="text-white font-bold text-sm tracking-wide">{found.name}</span>
                  <span className="text-[#0052FF] font-semibold text-[11px] uppercase">
                    {found.categoryLabel}
                  </span>
                </div>

                <div className="space-y-1 text-[11px] leading-relaxed">
                  <p><span className="text-zinc-500 uppercase">TAGLINE:</span> <span className="text-zinc-300">{found.tagline}</span></p>
                  <p><span className="text-zinc-500 uppercase">DESCRIPTION:</span> <span className="text-zinc-400">{found.description}</span></p>
                  <p><span className="text-zinc-500 uppercase">LANGUAGE:</span> <span className="text-emerald-400">{found.language}</span></p>
                  <p><span className="text-zinc-500 uppercase">STATUS:</span> <span className={found.status === 'active' ? 'text-emerald-400' : 'text-blue-400'}>{found.status === 'active' ? 'ACTIVE // CONTINUOUSLY UPDATED' : 'BUILDING'}</span></p>
                  {found.benchmark && (
                    <p><span className="text-zinc-500 uppercase">BENCHMARK:</span> <span className="text-cyan-400">{found.benchmark}</span></p>
                  )}
                  <p><span className="text-zinc-500 uppercase">TAGS:</span> <span className="text-zinc-300">{found.tags.join(', ')}</span></p>
                </div>

                <div className="pt-2 border-t border-white/10 flex flex-wrap items-center gap-4 text-[11px]">
                  <a
                    href={found.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#0052FF] hover:underline inline-flex items-center gap-1"
                  >
                    <span>[cat {found.id}] GITHUB</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  <a
                    href={found.releasesUrl ?? `${found.githubUrl}#readme`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-emerald-400 hover:underline inline-flex items-center gap-1"
                  >
                    <span>[init {found.id}] RELEASES / README</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  {found.liveUrl && (
                    <a
                      href={found.liveUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-cyan-400 hover:underline inline-flex items-center gap-1"
                    >
                      <span>LIVE DEMO</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            ),
          });
        } else {
          newHistory.push({
            id: Math.random().toString(),
            type: 'error',
            text: `Repository "${arg}" not found. Type "ls" to view the 16 repositories.`,
          });
        }
        break;
      }

      case 'clear':
        setHistory([]);
        return;

      default:
        newHistory.push({
          id: Math.random().toString(),
          type: 'error',
          text: `Command not recognized: "${cmd}". Allowed commands: ls | cat <repo> | init <repo> | grep <repo> | clear`,
        });
    }

    setHistory(newHistory);
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleCommand(input);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto mb-16 bg-[#090A0E] border border-white/10 rounded-3xl overflow-hidden shadow-2xl font-mono-code">
      {/* Terminal Title Bar */}
      <div className="px-6 py-4 bg-white/5 border-b border-white/10 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500/80" />
            <span className="w-3 h-3 rounded-full bg-amber-500/80" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
          </div>
          <span className="text-xs text-zinc-400 font-bold ml-2 flex items-center gap-2">
            <Terminal className="w-4 h-4 text-[#0052FF]" />
            KATRATE_OS_SHELL // 16 REPOSITORIES MAPPED
          </span>
        </div>

        {/* Quick Action Chips */}
        <div className="flex flex-wrap items-center gap-2">
          {['ls', 'grep katlans', 'cat katlans', 'init katlans', 'grep kwamlinux', 'grep palimpsest'].map((c) => (
            <button
              key={c}
              onClick={() => handleCommand(c)}
              className="px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] text-zinc-300 hover:text-white transition cursor-pointer"
            >
              ${c}
            </button>
          ))}
          <button
            onClick={() => {
              setHistory([]);
              soundFX.playClick();
            }}
            className="p-1.5 rounded bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition"
            title="Clear buffer"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Terminal Output Buffer (with data-lenis-prevent so wheel scrolling works) */}
      <div
        data-lenis-prevent
        className="p-6 h-[460px] overflow-y-auto space-y-3 text-xs leading-relaxed overscroll-contain select-text"
      >
        {history.map((line) => (
          <div key={line.id}>
            {line.type === 'cmd' ? (
              <p className="text-white font-bold">{line.text}</p>
            ) : line.type === 'error' ? (
              <p className="text-red-400">{line.text}</p>
            ) : line.type === 'success' ? (
              <div className="text-emerald-400">{line.text}</div>
            ) : (
              <div>{line.text}</div>
            )}
          </div>
        ))}
        <div ref={endRef} />
      </div>

      {/* Input Prompt */}
      <div className="px-6 py-4 bg-white/[0.03] border-t border-white/10 flex items-center gap-3">
        <span className="text-[#0052FF] font-bold">katrate@sys:~$</span>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder='Allowed commands: "ls", "cat <repo>", "init <repo>", "grep <repo>", "clear"...'
          className="flex-1 bg-transparent text-white text-xs outline-none placeholder-zinc-600 font-mono-code"
          autoFocus
        />
        <button
          onClick={() => handleCommand(input)}
          className="p-2 rounded-lg bg-[#0052FF] hover:bg-blue-600 text-white transition cursor-pointer"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
