import { useEffect, useRef } from 'react';
import CardShell from '../ui/CardShell';
import { usePointer } from '../../hooks/useMousePosition';

const W = 360;
const H = 220;
const WORDS = 'STRING · TUNE · KINETIC · TYPE · ';

/**
 * STRING TUNE — kinetic typography on an animated sine path.
 * The SVG path `d` is rewritten every frame with a sine formula; amplitude and
 * frequency are eased (lerp) toward pointer activity so the strings "tune" as
 * you hover. Text rides the path via <textPath>. All animation runs in a single
 * requestAnimationFrame loop with zero React re-renders.
 */
export default function StringTuneCard() {
  const rootRef = useRef<HTMLDivElement>(null);
  const pointer = usePointer(rootRef);

  const pathRefs = useRef<(SVGPathElement | null)[]>([]);
  const dotRef = useRef<SVGCircleElement | null>(null);

  // eased animation state (mutable, no re-render)
  const state = useRef({ amp: 8, freq: 2.2, ampTarget: 8, freqTarget: 2.2 });

  useEffect(() => {
    let raf = 0;
    let t = 0;
    const lines = pathRefs.current.length;

    const buildPath = (phase: number, amp: number, freq: number, yMid: number) => {
      const steps = 48;
      let d = '';
      for (let i = 0; i <= steps; i++) {
        const x = (i / steps) * W;
        const y = yMid + Math.sin((i / steps) * Math.PI * 2 * freq + phase) * amp;
        d += `${i === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)} `;
      }
      return d;
    };

    const tick = () => {
      t += 0.02;
      const p = pointer.current;
      // pointer near = bigger amplitude / higher frequency
      state.current.ampTarget = p.inside ? 14 + Math.abs(p.y) * 22 : 8;
      state.current.freqTarget = p.inside ? 2.2 + p.u * 2.4 : 2.2;
      // high-damping lerp (organic "tuning")
      state.current.amp += (state.current.ampTarget - state.current.amp) * 0.06;
      state.current.freq += (state.current.freqTarget - state.current.freq) * 0.06;

      for (let i = 0; i < lines; i++) {
        const path = pathRefs.current[i];
        if (!path) continue;
        const yMid = H * (0.3 + i * 0.2);
        const phase = t + i * 0.8;
        path.setAttribute('d', buildPath(phase, state.current.amp, state.current.freq, yMid));
      }

      // travelling node on the middle line
      if (dotRef.current) {
        const x = ((t * 30) % W);
        const y = H * 0.5 + Math.sin((x / W) * Math.PI * 2 * state.current.freq + (t + 0.8)) * state.current.amp;
        dotRef.current.setAttribute('cx', x.toFixed(1));
        dotRef.current.setAttribute('cy', y.toFixed(1));
      }

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [pointer]);

  return (
    <CardShell
      index="01"
      title="STRING TUNE"
      concept="Kinetic Typography"
      accent="#34e2ff"
      tags={['Sine paths', 'textPath', 'Hover-reactive']}
    >
      <div ref={rootRef} className="relative h-56 w-full cursor-crosshair">
        <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" preserveAspectRatio="xMidYMid slice">
          <defs>
            <linearGradient id="st-grad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#34e2ff" />
              <stop offset="0.5" stopColor="#4f8bff" />
              <stop offset="1" stopColor="#9b6bff" />
            </linearGradient>
            <filter id="st-glow" x="-20%" y="-50%" width="140%" height="200%">
              <feGaussianBlur stdDeviation="2.4" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* three tuned strings; the middle one carries the text */}
          {[0, 1, 2].map((i) => (
            <path
              key={i}
              ref={(el) => (pathRefs.current[i] = el)}
              id={`st-path-${i}`}
              fill="none"
              stroke="url(#st-grad)"
              strokeWidth={i === 1 ? 2 : 1.2}
              strokeOpacity={i === 1 ? 0.95 : 0.4}
              filter="url(#st-glow)"
            />
          ))}

          <text fontSize="15" fontWeight="700" letterSpacing="2" fill="#dbeafe" fontFamily="'JetBrains Mono', monospace">
            <textPath href="#st-path-1" startOffset="0%">
              {WORDS + WORDS}
            </textPath>
          </text>

          <circle ref={dotRef} r="4" fill="#34e2ff" filter="url(#st-glow)" />

          {/* baseline caret */}
          <rect x={W - 22} y={H * 0.78} width="3" height="20" fill="#34e2ff" className="animate-pulse" />
        </svg>
      </div>
    </CardShell>
  );
}
