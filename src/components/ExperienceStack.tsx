import React from 'react';

export const ExperienceStack: React.FC = () => {
  const experiences = [
    {
      period: '2024 — PRESENT',
      role: 'Principal Systems Architect',
      company: 'HYPERION COMPUTATIONAL LABS',
      scope: 'Leading the low-level graphics and distributed state synchronization engine. Reduced render loop latency from 16ms to 1.4ms across 400k+ global clients.',
      tags: ['WebGPU', 'Rust', 'Distributed State', 'WASM'],
    },
    {
      period: '2022 — 2024',
      role: 'Staff Infrastructure Engineer',
      company: 'AETHER PROTOCOL',
      scope: 'Engineered high-frequency settlement channels and BFT consensus verification services handling over $120M in monthly transactional volume.',
      tags: ['Go', 'TypeScript', 'Zero-Knowledge', 'K8s'],
    },
    {
      period: '2020 — 2022',
      role: 'Senior Creative Technologist',
      company: 'MONOLITH DESIGN RESEARCH',
      scope: 'Designed tactile 3D spatial web canvases and generative shader pipelines for award-winning digital installations.',
      tags: ['Three.js', 'React', 'GLSL', 'Interaction Physics'],
    },
  ];

  return (
    <section id="experience" className="py-24 px-4 sm:px-8 bg-white border-t border-zinc-200">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 pb-6 border-b border-zinc-200">
          <div>
            <span className="font-mono-code text-xs uppercase tracking-widest text-[#0052FF] mb-3 block">
              TRAJECTORY & ENGAGEMENTS
            </span>
            <h2 className="font-display font-extrabold text-4xl sm:text-5xl text-[#0D0E12] tracking-tight">
              ENGINEERING LEADERSHIP.
            </h2>
          </div>
          <div className="font-mono-code text-xs text-zinc-500 max-w-xs">
            Over 8 years building low-latency distributed networks, hardware acceleration, and human-first creative tools.
          </div>
        </div>

        {/* Roles List */}
        <div className="divide-y divide-zinc-200">
          {experiences.map((exp, i) => (
            <div
              key={i}
              className="py-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start hover:bg-zinc-50/70 px-4 -mx-4 rounded-2xl transition duration-200 group"
            >
              {/* Period */}
              <div className="lg:col-span-3 font-mono-code text-xs text-zinc-400 font-semibold group-hover:text-[#0052FF] transition">
                {exp.period}
              </div>

              {/* Role & Company */}
              <div className="lg:col-span-4">
                <h3 className="font-display font-bold text-xl text-zinc-900 mb-1">
                  {exp.role}
                </h3>
                <span className="font-mono-code text-xs text-zinc-500 uppercase tracking-wide">
                  {exp.company}
                </span>
              </div>

              {/* Description & Tags */}
              <div className="lg:col-span-5 flex flex-col justify-between h-full">
                <p className="text-sm text-zinc-600 leading-relaxed mb-4">
                  {exp.scope}
                </p>
                <div className="flex flex-wrap gap-2">
                  {exp.tags.map((t) => (
                    <span
                      key={t}
                      className="px-2.5 py-0.5 rounded-full bg-zinc-100 text-zinc-700 text-xs font-mono-code"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
