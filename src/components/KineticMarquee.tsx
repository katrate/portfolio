import React from 'react';

export const KineticMarquee: React.FC = () => {
  const items = [
    'COMPILER ENGINEERING',
    'SYSTEMS ARCHITECTURE',
    'AI & AUTOMATION',
    'CUSTOM PROGRAMMING LANGUAGES',
    'BACKEND & DATABASES',
    'PRODUCTION WEB APPS',
    'RUST & C SYSTEMS',
  ];

  return (
    <div className="w-full overflow-hidden bg-[#0D0E12] text-white py-6 border-y border-white/10 select-none">
      <div className="flex w-max animate-marquee">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex items-center gap-8 shrink-0 px-4">
            {items.map((item, idx) => (
              <div key={idx} className="flex items-center gap-8">
                <span className="font-display font-extrabold text-2xl md:text-3xl tracking-tight text-zinc-300 hover:text-white transition">
                  {item}
                </span>
                <span className="w-2.5 h-2.5 rounded-full bg-[#0052FF]" />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
