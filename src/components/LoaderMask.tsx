import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Terminal, ArrowRight } from 'lucide-react';

interface LoaderMaskProps {
  onComplete: () => void;
}

export const LoaderMask: React.FC<LoaderMaskProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const { initialStep, dynamicSteps } = useMemo(() => {
    const POOL = [
      'WAKING UP THE KERNEL NO CAP...',
      'COOKING UP HEAT SHADERS...',
      'REWRITING IT IN RUST FR FR...',
      'LOCKING IN THE ARCHITECTURE...',
      'VIBE CHECKING THE DOM...',
      'WE SO BACK // READY TO COOK'
    ];
    // Shuffle and pick 2
    const shuffled = [...POOL].sort(() => 0.5 - Math.random());
    return {
      initialStep: shuffled[0],
      dynamicSteps: [
        { at: 40, label: shuffled[1] },
        { at: 85, label: 'SYSTEM READY // ENGAGING UI' }
      ]
    };
  }, []);

  const [currentStep, setCurrentStep] = useState(initialStep);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            setIsFinished(true);
            setTimeout(onComplete, 1100);
          }, 400);
          return 100;
        }
        const increment = Math.floor(Math.random() * 8) + 3;
        const next = Math.min(100, prev + increment);
        const match = dynamicSteps.find((s) => next >= s.at);
        if (match) setCurrentStep(match.label);
        return next;
      });
    }, 45);

    return () => clearInterval(timer);
  }, [onComplete, dynamicSteps]);

  const handleManualSkip = () => {
    setProgress(100);
    setIsFinished(true);
    setTimeout(onComplete, 1100);
  };

  return (
    <AnimatePresence>
      {!isFinished ? (
        <motion.div
          key="preloader-content"
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-50 flex flex-col justify-between p-6 md:p-12 bg-[#0A0B0E] text-white selection:bg-[#0052FF]"
        >
          {/* Top Bar */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <span className="flex h-3 w-3 rounded-full bg-[#0052FF] animate-pulse" />
              <span className="font-mono-code text-xs uppercase tracking-widest text-zinc-400">
                SYS.INIT // LOCKING IN
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span className="font-mono-code text-xs text-zinc-500 hidden sm:inline">
                GPU: WebGL2_ACCELERATED
              </span>
              <button
                onClick={handleManualSkip}
                className="font-mono-code text-xs text-zinc-400 hover:text-white border border-white/15 px-3 py-1 rounded hover:bg-white/5 transition flex items-center gap-1 cursor-pointer"
              >
                SKIP THIS FR <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Center Centerpiece */}
          <div className="max-w-3xl w-full mx-auto my-auto py-12 flex flex-col items-center">
            <div className="flex items-baseline justify-center gap-4 mb-4">
              <span className="font-display font-black text-6xl md:text-9xl tracking-tighter text-white">
                {progress.toString().padStart(3, '0')}
              </span>
              <span className="font-mono-code text-2xl md:text-3xl text-[#0052FF] font-bold">
                %
              </span>
            </div>

            {/* Kinetic Progress Track */}
            <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden mb-6 relative">
              <motion.div
                className="h-full bg-gradient-to-r from-[#0052FF] via-[#3B82F6] to-[#60A5FA]"
                style={{ width: `${progress}%` }}
                transition={{ ease: 'easeOut', duration: 0.1 }}
              />
            </div>

            {/* Dynamic Status Log */}
            <div className="flex items-center justify-center gap-2 font-mono-code text-xs md:text-sm text-zinc-300 text-center">
              <Terminal className="w-4 h-4 text-[#0052FF] shrink-0" />
              <span className="truncate">{currentStep}</span>
            </div>
          </div>


        </motion.div>
      ) : (
        /* The Crazy Shutter Tear Mask Curtain Animation */
        <div className="fixed inset-0 z-50 pointer-events-none flex">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ scaleY: 1 }}
              animate={{ scaleY: 0 }}
              transition={{
                duration: 0.9,
                delay: i * 0.08,
                ease: [0.76, 0, 0.24, 1],
              }}
              style={{ originY: i % 2 === 0 ? 0 : 1 }}
              className="flex-1 h-full bg-[#0A0B0E] border-r border-white/5 relative"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-[#0052FF]/10 to-transparent pointer-events-none" />
            </motion.div>
          ))}
        </div>
      )}
    </AnimatePresence>
  );
};
