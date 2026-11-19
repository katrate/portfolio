import React, { useState } from 'react';
import { Mail, Copy, Check, ArrowUpRight, Send } from 'lucide-react';
import confetti from 'canvas-confetti';

export const ContactSection: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [formSent, setFormSent] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [messageInput, setMessageInput] = useState('');

  const email = 'my494stry@gmail.com';

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    confetti({
      particleCount: 60,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#0052FF', '#0D0E12', '#60A5FA'],
    });
    setTimeout(() => setCopied(false), 2400);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput || !messageInput) return;

    // Open mailto: to route message to the real inbox
    const subject = encodeURIComponent(`Portfolio Contact from ${nameInput || emailInput}`);
    const body = encodeURIComponent(
      `From: ${nameInput || 'Anonymous'}\nEmail: ${emailInput}\n\n${messageInput}`
    );
    window.open(`mailto:${email}?subject=${subject}&body=${body}`, '_blank');

    setFormSent(true);
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.7 },
      colors: ['#0052FF', '#10B981', '#F59E0B'],
    });
  };

  return (
    <footer id="contact" className="py-24 px-4 sm:px-8 bg-[#0D0E12] text-white border-t border-white/10 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#0052FF]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-0 left-0 w-[300px] h-[300px] bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-20">
          {/* Left Column: Big Statement & Quick Copy */}
          <div className="lg:col-span-7">
            <span className="font-tech text-[9px] uppercase tracking-[0.2em] text-[#0052FF] mb-4 block">
              INITIATE COLLABORATION // CONTACT
            </span>
            <h2 className="font-display font-normal text-3xl sm:text-5xl lg:text-6xl text-white tracking-[0.04em] leading-[1.1] mb-6">
              LET'S COOK SOMETHING <span className="text-[#0052FF]">CRAZY.</span>
            </h2>
            <p className="font-body text-sm text-zinc-400 max-w-xl leading-relaxed mb-8">
              Open for compiler dev, systems architecture, crazy web apps, and locking in on sick projects. Pull up.
            </p>
            {/* Direct Copy Email Box */}
            <div className="inline-flex items-center gap-3 p-2 pr-4 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition group mb-8">
              <div className="p-3 rounded-xl bg-[#0052FF] text-white">
                <Mail className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-tech text-[9px] tracking-wider text-zinc-400">DIRECT INBOX</span>
                <span className="font-mono-code text-xs sm:text-sm font-semibold text-white">
                  {email}
                </span>
              </div>
              <button
                onClick={handleCopyEmail}
                className="ml-4 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-mono-code text-zinc-200 transition flex items-center gap-1.5 cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>COPIED</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>COPY</span>
                  </>
                )}
              </button>
            </div>

            {/* Also reachable via */}
            <div className="flex items-center gap-4">
              <a
                href="https://github.com/katrate"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 text-zinc-300 hover:text-white transition font-mono-code text-xs font-semibold"
              >
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span>GITHUB.COM/KATRATE</span>
              </a>
            </div>
          </div>

          {/* Right Column: Direct Dispatch Terminal Form */}
          <div className="lg:col-span-5 bg-[#14151C] p-8 rounded-3xl border border-white/10 shadow-2xl">
            {formSent ? (
              <div className="py-12 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center">
                  <Check className="w-6 h-6" />
                </div>
                <h3 className="font-display font-bold text-xl text-white">
                  DISPATCH TRANSMITTED
                </h3>
                <p className="text-xs font-mono-code text-zinc-400">
                  Your message has been routed to my inbox. I'll respond within 24 hours.
                </p>
                <button
                  onClick={() => { setFormSent(false); setEmailInput(''); setNameInput(''); setMessageInput(''); }}
                  className="mt-4 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-mono-code text-zinc-300 transition cursor-pointer"
                >
                  SEND ANOTHER
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <span className="font-tech text-[9px] text-zinc-400">TRANSMISSION TERMINAL</span>
                  <span className="font-mono-code text-[11px] text-[#0052FF]">→ my494stry@gmail.com</span>
                </div>

                <div>
                  <label className="block font-tech text-[9px] text-zinc-400 mb-1.5 tracking-wider">
                    WHO DIS?
                  </label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#0052FF] transition font-sans"
                  />
                </div>

                <div>
                  <label className="block font-tech text-[9px] text-zinc-400 mb-1.5 tracking-wider">
                    YOUR EMAIL
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="name@company.com"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#0052FF] transition font-sans"
                  />
                </div>

                <div>
                  <label className="block font-tech text-[9px] text-zinc-400 mb-1.5 tracking-wider">
                    WHAT WE COOKING?
                  </label>
                  <textarea
                    required
                    rows={3}
                    placeholder="What are you building?"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#0052FF] transition font-sans resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-[#0052FF] hover:bg-blue-600 text-white font-tech text-[9px] font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-blue-500/20 tracking-[0.1em]"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>SEND IT BRO</span>
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Footer Sub-Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 font-tech text-[8px] text-zinc-500 tracking-widest">
          <div>
            © {new Date().getFullYear()} KATRATE. ALL SYSTEMS OPERATIONAL.
          </div>
        </div>
      </div>
    </footer>
  );
};
