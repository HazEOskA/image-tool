import { useEffect, useState } from 'react';

export default function NeonContactWarp() {
  const [active, setActive] = useState(false);

  useEffect(() => {
    const onWarp = () => {
      setActive(true);
      window.setTimeout(() => setActive(false), 980);
    };

    window.addEventListener('neon-contact-warp', onWarp);
    return () => window.removeEventListener('neon-contact-warp', onWarp);
  }, []);

  if (!active) return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[80] overflow-hidden bg-ink-950/35 backdrop-blur-[1px]"
    >
      <div className="absolute inset-y-0 left-1/2 w-[2px] -translate-x-1/2 bg-neon-cyan shadow-[0_0_42px_rgba(52,226,255,0.9)] contact-warp-core" />
      <div className="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full border border-neon-cyan/70 shadow-[0_0_60px_rgba(52,226,255,0.45)] contact-warp-lock" />
      <div className="absolute inset-x-0 top-[18%] h-px bg-gradient-to-r from-transparent via-neon-cyan to-transparent contact-warp-streak" />
      <div className="absolute inset-x-0 top-[42%] h-px bg-gradient-to-r from-transparent via-neon-purple to-transparent contact-warp-streak contact-warp-streak-delay" />
      <div className="absolute inset-x-0 top-[64%] h-px bg-gradient-to-r from-transparent via-neon-pink to-transparent contact-warp-streak" />
    </div>
  );
}

