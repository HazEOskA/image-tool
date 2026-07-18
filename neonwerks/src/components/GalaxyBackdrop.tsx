import { useEffect, useRef } from 'react';

type Star = { x: number; y: number; z: number; size: number; hue: number; pulse: number };

export default function GalaxyBackdrop() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let width = 0;
    let height = 0;
    let dpr = 1;
    let raf = 0;
    let last = performance.now();
    let meteorClock = 0;
    const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
    let stars: Star[] = [];

    const makeStars = () => Array.from({ length: Math.min(260, Math.floor((width * height) / 6500)) }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      z: .2 + Math.random() * .8,
      size: .45 + Math.random() * 1.55,
      hue: Math.random() > .82 ? (Math.random() > .5 ? 184 : 326) : 205,
      pulse: Math.random() * Math.PI * 2,
    }));

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 1.6);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      stars = makeStars();
    };

    const onPointer = (event: PointerEvent) => {
      pointer.tx = (event.clientX / width - .5) * 18;
      pointer.ty = (event.clientY / height - .5) * 12;
    };

    const drawMeteor = (time: number) => {
      const life = (time % 9200) / 9200;
      if (life > .22) return;
      const p = life / .22;
      const x = width * (.78 - p * .55);
      const y = height * (.08 + p * .4);
      const trail = ctx.createLinearGradient(x, y, x + 130, y - 72);
      trail.addColorStop(0, 'rgba(0,229,234,.95)');
      trail.addColorStop(1, 'rgba(0,229,234,0)');
      ctx.strokeStyle = trail;
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + 130, y - 72);
      ctx.stroke();
    };

    const render = (now: number) => {
      const dt = Math.min(32, now - last);
      last = now;
      meteorClock += dt;
      pointer.x += (pointer.tx - pointer.x) * .035;
      pointer.y += (pointer.ty - pointer.y) * .035;
      ctx.clearRect(0, 0, width, height);

      for (const star of stars) {
        star.pulse += .008 + star.z * .012;
        star.y += (reduce ? .003 : .008) + star.z * (reduce ? .006 : .018);
        if (star.y > height + 4) star.y = -4;
        const alpha = .25 + star.z * .52 + Math.sin(star.pulse) * .13;
        const x = star.x + pointer.x * star.z;
        const y = star.y + pointer.y * star.z;
        ctx.fillStyle = `hsla(${star.hue},100%,78%,${alpha})`;
        ctx.shadowColor = `hsla(${star.hue},100%,65%,.8)`;
        ctx.shadowBlur = star.z > .72 ? 7 : 0;
        ctx.beginPath();
        ctx.arc(x, y, star.size * star.z, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.shadowBlur = 0;
      if (!reduce || meteorClock % 18000 < 2100) drawMeteor(meteorClock);
      raf = requestAnimationFrame(render);
    };

    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', onPointer, { passive: true });
    render(performance.now());
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onPointer);
    };
  }, []);

  return (
    <div className="galaxy-backdrop" aria-hidden="true">
      <div className="galaxy-nebula galaxy-nebula-a" />
      <div className="galaxy-nebula galaxy-nebula-b" />
      <canvas ref={canvasRef} className="galaxy-stars" />
      <div className="fleet-status">FLEET_ROTATION // 3×3 // TRACKING_ACTIVE</div>
      <div className="ship-squadron squadron-fast">
        <Ship className="fast-one" />
        <Ship className="fast-two" />
        <Ship className="fast-three" />
      </div>
      <div className="ship-squadron squadron-hover">
        <Ship className="hover-one" />
        <Ship className="hover-two" />
        <Ship className="hover-three" />
      </div>
      <div className="ship-squadron squadron-teleport">
        <Ship className="teleport-one" />
        <Ship className="teleport-two" />
        <Ship className="teleport-three" />
      </div>
      <div className="galaxy-horizon" />
    </div>
  );
}

function Ship({ className }: { className: string }) {
  return (
    <div className={`galaxy-ship ${className}`}>
      <svg viewBox="0 0 96 36" role="presentation">
        <path className="ship-hull" d="M4 19 30 8l31 2 29 9-28 7-31 1Z" />
        <path className="ship-wing" d="m34 11 13-9 13 10M31 24l14 10 17-10" />
        <path className="ship-cockpit" d="m48 10 8 3-8 4-8-4Z" />
        <path className="ship-engine" d="M7 18H0m12 5H3" />
      </svg>
      <span className="ship-trail" />
    </div>
  );
}
