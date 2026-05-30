import { useLayoutEffect, useRef, useState, type RefObject } from 'react';

interface Props {
  containerRef: RefObject<HTMLElement>;
  itemRefs: RefObject<HTMLElement>[];
}

interface Line {
  d: string;
  id: string;
}

/**
 * Draws animated gradient connectors between consecutive pipeline cards.
 * Anchor points and path direction are measured live from the DOM, so it
 * adapts automatically to the 4-up row, 2×2 grid, or stacked mobile layout.
 */
export default function ConnectingLines({ containerRef, itemRefs }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [lines, setLines] = useState<Line[]>([]);

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const compute = () => {
      const cRect = container.getBoundingClientRect();
      setSize({ w: cRect.width, h: cRect.height });

      const boxes = itemRefs.map((r) => {
        const el = r.current;
        if (!el) return null;
        const b = el.getBoundingClientRect();
        return {
          left: b.left - cRect.left,
          top: b.top - cRect.top,
          right: b.right - cRect.left,
          bottom: b.bottom - cRect.top,
          cx: b.left - cRect.left + b.width / 2,
          cy: b.top - cRect.top + b.height / 2,
        };
      });

      const next: Line[] = [];
      for (let i = 0; i < boxes.length - 1; i++) {
        const a = boxes[i];
        const b = boxes[i + 1];
        if (!a || !b) continue;

        const dx = b.cx - a.cx;
        const dy = b.cy - a.cy;
        let sx: number, sy: number, ex: number, ey: number, c1x: number, c1y: number, c2x: number, c2y: number;

        if (Math.abs(dx) >= Math.abs(dy)) {
          // horizontal-dominant
          sx = dx > 0 ? a.right : a.left;
          sy = a.cy;
          ex = dx > 0 ? b.left : b.right;
          ey = b.cy;
          const mid = (sx + ex) / 2;
          c1x = mid;
          c1y = sy;
          c2x = mid;
          c2y = ey;
        } else {
          // vertical-dominant (stacked / 2x2 wrap)
          sx = a.cx;
          sy = dy > 0 ? a.bottom : a.top;
          ex = b.cx;
          ey = dy > 0 ? b.top : b.bottom;
          const mid = (sy + ey) / 2;
          c1x = sx;
          c1y = mid;
          c2x = ex;
          c2y = mid;
        }

        next.push({
          id: `flow-${i}`,
          d: `M ${sx.toFixed(1)} ${sy.toFixed(1)} C ${c1x.toFixed(1)} ${c1y.toFixed(1)}, ${c2x.toFixed(1)} ${c2y.toFixed(1)}, ${ex.toFixed(1)} ${ey.toFixed(1)}`,
        });
      }
      setLines(next);
    };

    compute();
    const ro = new ResizeObserver(compute);
    ro.observe(container);
    itemRefs.forEach((r) => r.current && ro.observe(r.current));
    window.addEventListener('resize', compute);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', compute);
    };
  }, [containerRef, itemRefs]);

  return (
    <svg
      ref={svgRef}
      className="pointer-events-none absolute inset-0 z-20 h-full w-full"
      width={size.w}
      height={size.h}
      viewBox={`0 0 ${size.w} ${size.h}`}
      fill="none"
    >
      <defs>
        <linearGradient id="flow-grad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#34e2ff" />
          <stop offset="0.5" stopColor="#9b6bff" />
          <stop offset="1" stopColor="#ff5ed3" />
        </linearGradient>
        <filter id="flow-glow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="3" />
        </filter>
      </defs>
      {lines.map((l) => (
        <g key={l.id}>
          {/* soft glow underlay */}
          <path d={l.d} stroke="url(#flow-grad)" strokeWidth={6} opacity={0.18} filter="url(#flow-glow)" />
          {/* crisp animated dashed line */}
          <path
            id={l.id}
            d={l.d}
            stroke="url(#flow-grad)"
            strokeWidth={1.6}
            strokeDasharray="6 10"
            className="flow-dash"
          />
          {/* travelling energy pulse */}
          <circle r={3.2} fill="#fff">
            <animateMotion dur="2.8s" repeatCount="indefinite" rotate="auto" keyPoints="0;1" keyTimes="0;1" calcMode="linear">
              <mpath href={`#${l.id}`} />
            </animateMotion>
            <animate attributeName="opacity" values="0;1;1;0" dur="2.8s" repeatCount="indefinite" />
          </circle>
        </g>
      ))}
    </svg>
  );
}
