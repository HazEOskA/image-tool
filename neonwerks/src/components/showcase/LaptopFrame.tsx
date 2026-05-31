import type { ReactNode } from 'react';

/**
 * Pure CSS/SVG laptop mockup. The screen area renders `children` (the live
 * WebGL canvas) clipped to the bezel, with a layered UI/typography overlay.
 */
export default function LaptopFrame({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-5xl">
      {/* ----- Screen ----- */}
      <div className="relative mx-auto w-full rounded-[1.6rem] border border-white/12 bg-ink-950 p-2.5 shadow-card">
        {/* camera */}
        <div className="absolute left-1/2 top-1.5 z-30 flex -translate-x-1/2 items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-white/20" />
        </div>

        <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[1.1rem] border border-white/10 bg-[#06060d]">
          {/* live canvas */}
          <div className="absolute inset-0">{children}</div>

          {/* in-screen UI overlay */}
          <div className="pointer-events-none absolute inset-0 flex flex-col">
            {/* top browser bar */}
            <div className="flex items-center gap-2 border-b border-white/10 bg-black/40 px-4 py-2.5 backdrop-blur-sm">
              <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
              <div className="ml-3 flex items-center gap-2 rounded-md border border-white/10 bg-white/5 px-3 py-1">
                <span className="h-1.5 w-1.5 rounded-full bg-neon-cyan" />
                <span className="font-mono text-[10px] text-white/55">studio.neonwerks.io</span>
              </div>
              <div className="ml-auto hidden gap-5 sm:flex">
                {['Home', 'Work', 'Studio'].map((m, i) => (
                  <span key={m} className={`text-[11px] ${i === 0 ? 'text-white' : 'text-white/45'}`}>
                    {m}
                  </span>
                ))}
              </div>
            </div>

            {/* hero copy (String Tune typography) */}
            <div className="flex flex-1 items-center">
              <div className="max-w-md px-6 sm:px-10">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-white/70">
                  <span className="h-1.5 w-1.5 rounded-full bg-neon-pink" /> Live · v2.0
                </span>
                <h3 className="mt-3 text-2xl font-extrabold leading-[1.05] sm:mt-4 sm:text-5xl">
                  <span className="text-gradient-brand">Design</span>
                  <br />
                  <span className="text-white">in motion.</span>
                </h3>
                <div className="mt-3 h-1 w-28 rounded-full bg-gradient-to-r from-neon-cyan to-neon-purple" />
                <p className="mt-4 hidden max-w-xs text-xs leading-relaxed text-white/55 sm:block sm:text-sm">
                  Typography, shaders, fluid 3D and particles — composed into one interactive surface that
                  reacts to every cursor move.
                </p>
                <div className="mt-4 flex gap-3 sm:mt-5">
                  <span className="rounded-full bg-gradient-to-r from-neon-cyan to-neon-purple px-4 py-2 text-[11px] font-semibold text-ink-950 sm:text-xs">
                    Launch demo
                  </span>
                  <span className="rounded-full border border-white/20 px-4 py-2 text-[11px] font-semibold text-white sm:text-xs">
                    View code
                  </span>
                </div>
              </div>
            </div>

            {/* bottom tool legend */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-white/10 bg-black/30 px-4 py-2.5 backdrop-blur-sm sm:gap-4 sm:px-6">
              {[
                ['String Tune', '#34e2ff'],
                ['Astrodither', '#9b6bff'],
                ['Smoothie', '#4f8bff'],
                ['Particles', '#ff5ed3'],
              ].map(([label, color]) => (
                <div key={label} className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full" style={{ background: color }} />
                  <span className="text-[10px] text-white/60">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ----- Base / hinge ----- */}
      <div className="relative mx-auto -mt-0.5 h-3.5 w-[112%] -translate-x-[5.4%] rounded-b-2xl rounded-t-sm bg-gradient-to-b from-[#1a1a24] to-[#0c0c12] shadow-[0_18px_40px_-12px_rgba(0,0,0,0.8)]">
        <div className="absolute left-1/2 top-0 h-1.5 w-28 -translate-x-1/2 rounded-b-lg bg-black/60" />
      </div>
      {/* reflection */}
      <div className="mx-auto h-16 w-3/4 rounded-[50%] bg-neon-purple/10 blur-2xl" />
    </div>
  );
}
