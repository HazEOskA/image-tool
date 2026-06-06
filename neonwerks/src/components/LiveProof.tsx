import { createRef, useEffect, useMemo, useRef, useState, type RefObject } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import {
  Physics, RigidBody, BallCollider, type RapierRigidBody,
  useSpringJoint, interactionGroups,
} from '@react-three/rapier';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { motion, useInView } from 'framer-motion';
import * as THREE from 'three';
import { useLang } from '../i18n';

/* ──────────────────────────────────────────────────────────────────────────
   LIVE PROOF — NEURAL CORE.  The exact "AI brain" engine from Bartosz's
   deployed portfolio (animatedportfolioOsa · SystemNetwork), ported 1:1 into
   NEONWERKS and repointed at the four signature tools.

   • R3F + three.js, neurons = Rapier rigid bodies (zero gravity) on spring-joint
     synapses → a living mesh shaped as two hemispheres with a central fissure.
   • OrbitControls = steering: drag to rotate, scroll to zoom, gentle auto-spin,
     reset button restores the view.
   • Bloom makes the emissive neurons + firing signals glow neon.
   • Hover any node for intel; click a tool to jump to its section.

   Skin: Street Cyber OS — hot orange #ff4500 / matrix green #39ff14 / steel.
   ────────────────────────────────────────────────────────────────────────── */

// ── CONFIG ───────────────────────────────────────────────────────────────────
const FILLER_COUNT = 90;
const SCALE = 2.6;
const COLLIDER_R = 0.1;
const COLLIDER_DENS = 240;
const SPRING_STIFF = 130;
const SPRING_DAMP = 14;
const LINEAR_DAMP = 1.3;
const SIGNAL_COUNT = 36;
const NO_COLLIDE = interactionGroups(0, []);

// ── 3-colour palette (Street Cyber OS): hot orange / matrix green / steel ──
const C_HOT = '#ff4500'; // engine · active / live
const C_KEY = '#39ff14'; // tools (the structure)
const C_DIM = '#5b6b78'; // every other node
const SIGNAL_COLORS = [C_HOT, C_KEY];

const CAT = {
  god: C_HOT,
  district: C_KEY,
  active: C_HOT,
  file: C_DIM,
} as const;

interface Def {
  id: string; label: string; cat: keyof typeof CAT;
  lobe: -1 | 0 | 1; dir: [number, number, number];
  parent?: string; desc: string; anchor?: string;
}

// ── NEONWERKS pipeline mapped onto the hemispheres ──
const DEFS: Def[] = [
  // engine + render hub
  { id: 'engine', label: 'NEON ENGINE', cat: 'god', lobe: 0, dir: [0, 0, 0.2], desc: 'Shared 60 FPS render core — every tool plugs into one rAF loop.' },

  // ── LEFT lobe: STRING TUNE + ASTRODITHER ──
  { id: 'st', label: 'STRING TUNE', cat: 'district', lobe: -1, dir: [-0.32, 0.7, 0.3], parent: 'engine', desc: 'Kinetic typography riding animated sine paths.', anchor: '#tools' },
  { id: 'st-sine', label: 'SINE PATHS', cat: 'file', lobe: -1, dir: [-0.5, 0.9, 0.25], parent: 'st', desc: 'Path d rewritten every frame from a sine formula.' },
  { id: 'st-text', label: 'textPath', cat: 'file', lobe: -1, dir: [-0.28, 0.92, 0.4], parent: 'st', desc: 'Text rides the live path via <textPath>.' },
  { id: 'st-hover', label: 'HOVER-REACTIVE', cat: 'file', lobe: -1, dir: [-0.6, 0.62, 0.1], parent: 'st', desc: 'Amplitude + frequency ease toward pointer activity.' },

  { id: 'ad', label: 'ASTRODITHER', cat: 'district', lobe: -1, dir: [-0.5, -0.5, 0.3], parent: 'engine', desc: 'Real-time GLSL dither shader.', anchor: '#tools' },
  { id: 'ad-glsl', label: 'GLSL', cat: 'file', lobe: -1, dir: [-0.66, -0.6, 0.35], parent: 'ad', desc: 'Hand-written fragment shader.' },
  { id: 'ad-bayer', label: 'BAYER 4×4', cat: 'file', lobe: -1, dir: [-0.5, -0.72, 0.2], parent: 'ad', desc: 'Ordered Bayer dithering matrix.' },
  { id: 'ad-low', label: 'LOW-POLY', cat: 'file', lobe: -1, dir: [-0.72, -0.4, 0.45], parent: 'ad', desc: 'Quantised low-poly look.' },

  // ── RIGHT lobe: SMOOTHIE + AI PARTICLE SIMULATOR ──
  { id: 'sm', label: 'SMOOTHIE', cat: 'district', lobe: 1, dir: [0.42, 0.7, 0.3], parent: 'engine', desc: 'Fluid interpolation — a morphing mesh.', anchor: '#showcase' },
  { id: 'sm-lerp', label: 'LERP DAMPING', cat: 'file', lobe: 1, dir: [0.56, 0.86, 0.3], parent: 'sm', desc: 'High-damping lerp toward the pointer.' },
  { id: 'sm-simplex', label: 'SIMPLEX NOISE', cat: 'file', lobe: 1, dir: [0.3, 0.9, 0.4], parent: 'sm', desc: 'Simplex-noise displacement.' },
  { id: 'sm-mesh', label: 'MORPHING MESH', cat: 'file', lobe: 1, dir: [0.66, 0.6, 0.15], parent: 'sm', desc: 'Continuously remeshing blob.' },

  { id: 'ps', label: 'AI PARTICLE SIMULATOR', cat: 'district', lobe: 1, dir: [0.5, -0.55, 0.25], parent: 'engine', desc: 'GPU particle emitter with a repulsion field.', anchor: '#showcase' },
  { id: 'ps-pts', label: '3,400 POINTS', cat: 'file', lobe: 1, dir: [0.6, -0.72, 0.25], parent: 'ps', desc: '3,400 additive points.' },
  { id: 'ps-rep', label: 'REPULSION FIELD', cat: 'file', lobe: 1, dir: [0.45, -0.76, 0.1], parent: 'ps', desc: 'Pointer repulsion force.' },
  { id: 'ps-glow', label: 'ADDITIVE GLOW', cat: 'file', lobe: 1, dir: [0.72, -0.45, 0.4], parent: 'ps', desc: 'Additive-blended glow.' },

  // ── system nodes ──
  { id: 'raf', label: 'rAF · 60FPS', cat: 'file', lobe: -1, dir: [-0.72, 0.15, 0.5], parent: 'engine', desc: 'Single requestAnimationFrame loop, zero React re-renders.' },
  { id: 'dpr', label: 'ADAPTIVE DPR', cat: 'file', lobe: -1, dir: [-0.8, 0.0, 0.1], parent: 'engine', desc: 'Device-pixel-ratio clamped for steady frame time.' },
  { id: 'vercel', label: 'VERCEL · LIVE', cat: 'active', lobe: 1, dir: [0.72, 0.1, 0.5], parent: 'engine', desc: 'Deployed to production on Vercel — not a mockup.' },
  { id: 'gpu', label: 'WEBGL', cat: 'file', lobe: 1, dir: [0.8, -0.05, 0.1], parent: 'engine', desc: 'WebGL render path.' },
];

// extra cross-links (corpus-callosum + real relationships)
const CROSS: [string, string][] = [
  ['engine', 'raf'], ['engine', 'gpu'],
  ['raf', 'st'], ['raf', 'ad'],
  ['gpu', 'sm'], ['gpu', 'ps'],
  ['vercel', 'sm'], ['vercel', 'ps'],
  ['ad-glsl', 'gpu'], ['ps-glow', 'gpu'],
];

interface NeuronData {
  pos: [number, number, number];
  named: boolean; cat: keyof typeof CAT;
  label?: string; desc?: string; anchor?: string; labelAlways?: boolean;
  color: string; radius: number; emissive: number;
}

function mulberry32(seed: number) {
  return function () {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function lobePos(lobe: -1 | 0 | 1, dir: [number, number, number], rad: number, rand: () => number): [number, number, number] {
  if (lobe === 0) return [dir[0] * SCALE, dir[1] * SCALE, dir[2] * SCALE];
  const [dx, dy, dz] = dir;
  const len = Math.hypot(dx, dy, dz) || 1;
  const nx = dx / len, ny = dy / len, nz = dz / len;
  let x = lobe * 0.42 * SCALE + nx * rad * 0.6 * SCALE;
  const y = ny * rad * 0.95 * SCALE;
  const z = nz * rad * 1.0 * SCALE;
  const gap = 0.14 * SCALE;
  if (lobe < 0 && x > -gap) x = -gap - rand() * 0.1 * SCALE;
  if (lobe > 0 && x < gap) x = gap + rand() * 0.1 * SCALE;
  return [x, y, z];
}

function buildBrain() {
  const rand = mulberry32(11);
  const neurons: NeuronData[] = [];
  const idIndex = new Map<string, number>();

  DEFS.forEach((d) => {
    idIndex.set(d.id, neurons.length);
    const isGod = d.cat === 'god';
    const isDistrict = d.cat === 'district';
    const rad = isGod ? 0 : isDistrict ? 0.62 : 0.5;
    neurons.push({
      pos: lobePos(d.lobe, d.dir, rad, rand),
      named: true, cat: d.cat, label: d.label, desc: d.desc, anchor: d.anchor,
      labelAlways: isGod || isDistrict,
      color: CAT[d.cat],
      radius: isGod ? 0.34 : isDistrict ? 0.16 : 0.095,
      emissive: isGod ? 3.4 : isDistrict ? 2.4 : 2.0,
    });
  });
  const namedCount = neurons.length;

  for (let i = 0; i < FILLER_COUNT; i++) {
    const lobe: -1 | 1 = rand() > 0.5 ? 1 : -1;
    let x = 0, y = 0, z = 0, d = 2;
    while (d > 1) { x = rand() * 2 - 1; y = rand() * 2 - 1; z = rand() * 2 - 1; d = x * x + y * y + z * z; }
    const shell = 0.4 + 0.6 * Math.cbrt(rand());
    const m = Math.sqrt(d) || 1;
    const pos = lobePos(lobe, [x / m, y / m, z / m], shell, rand);
    const c = rand();
    const color = c > 0.85 ? C_KEY : '#3b4a57';
    neurons.push({
      pos, named: false, cat: 'file', color,
      radius: 0.035 + rand() * 0.05,
      emissive: color === '#3b4a57' ? 0.5 : 0.9,
    });
  }

  const edges: [number, number][] = [];
  const rest: number[] = [];
  const seen = new Set<string>();
  const addEdge = (i: number, j: number) => {
    if (i === j) return;
    const key = i < j ? `${i}-${j}` : `${j}-${i}`;
    if (seen.has(key)) return;
    seen.add(key);
    const a = neurons[i].pos, b = neurons[j].pos;
    edges.push([i, j]);
    rest.push(Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]));
  };
  DEFS.forEach((d) => { if (d.parent) addEdge(idIndex.get(d.id)!, idIndex.get(d.parent)!); });
  CROSS.forEach(([a, b]) => { const ia = idIndex.get(a), ib = idIndex.get(b); if (ia != null && ib != null) addEdge(ia, ib); });

  const N = neurons.length;
  for (let i = 0; i < N; i++) {
    const a = neurons[i].pos;
    const dl: { j: number; d: number }[] = [];
    for (let j = 0; j < N; j++) {
      if (j === i) continue;
      const b = neurons[j].pos;
      const dx = a[0] - b[0], dy = a[1] - b[1], dz = a[2] - b[2];
      dl.push({ j, d: dx * dx + dy * dy + dz * dz });
    }
    dl.sort((p, q) => p.d - q.d);
    const k = i < namedCount ? 2 : 3;
    for (let n = 0; n < k && n < dl.length; n++) addEdge(i, dl[n].j);
  }

  return { neurons, edges, rest, namedCount };
}

function Spring({ a, b, rest }: { a: RefObject<RapierRigidBody>; b: RefObject<RapierRigidBody>; rest: number }) {
  useSpringJoint(a, b, [[0, 0, 0], [0, 0, 0], rest, SPRING_STIFF, SPRING_DAMP]);
  return null;
}

function Synapses({ refs, edges, namedCount }: {
  refs: RefObject<RapierRigidBody>[]; edges: [number, number][]; namedCount: number;
}) {
  const geomRef = useRef<THREE.BufferGeometry>(null);
  const V = edges.length * 2;
  const { positions, colors } = useMemo(() => {
    const positions = new Float32Array(V * 3);
    const colors = new Float32Array(V * 3);
    const tmp = new THREE.Color();
    edges.forEach(([i, j], e) => {
      const isHub = i < namedCount || j < namedCount;
      tmp.set(isHub ? '#ff5a1a' : '#33414d');
      const mul = isHub ? 1.5 : 1;
      const k = e * 2;
      colors[k * 3] = tmp.r * mul; colors[k * 3 + 1] = tmp.g * mul; colors[k * 3 + 2] = tmp.b * mul;
      colors[(k + 1) * 3] = colors[k * 3]; colors[(k + 1) * 3 + 1] = colors[k * 3 + 1]; colors[(k + 1) * 3 + 2] = colors[k * 3 + 2];
    });
    return { positions, colors };
  }, [V, edges, namedCount]);

  useFrame(() => {
    const geom = geomRef.current;
    if (!geom) return;
    const arr = geom.attributes.position.array as Float32Array;
    edges.forEach(([i, j], e) => {
      const A = refs[i].current?.translation(); const B = refs[j].current?.translation();
      const k = e * 6;
      if (A) { arr[k] = A.x; arr[k + 1] = A.y; arr[k + 2] = A.z; }
      if (B) { arr[k + 3] = B.x; arr[k + 4] = B.y; arr[k + 5] = B.z; }
    });
    geom.attributes.position.needsUpdate = true;
  });

  return (
    <lineSegments frustumCulled={false}>
      <bufferGeometry ref={geomRef}>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <lineBasicMaterial vertexColors transparent opacity={0.5} toneMapped={false} blending={THREE.AdditiveBlending} depthWrite={false} />
    </lineSegments>
  );
}

function Signals({ refs, edges }: { refs: RefObject<RapierRigidBody>[]; edges: [number, number][] }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const state = useMemo(() => Array.from({ length: SIGNAL_COUNT }, () => ({
    e: (Math.random() * edges.length) | 0, t: Math.random(), speed: 0.004 + Math.random() * 0.012,
  })), [edges.length]);

  useEffect(() => {
    const mesh = meshRef.current; if (!mesh) return;
    const c = new THREE.Color();
    for (let i = 0; i < SIGNAL_COUNT; i++) { c.set(SIGNAL_COLORS[(Math.random() * SIGNAL_COLORS.length) | 0]); mesh.setColorAt(i, c); }
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  }, []);

  useFrame(() => {
    const mesh = meshRef.current; if (!mesh) return;
    for (let i = 0; i < SIGNAL_COUNT; i++) {
      const s = state[i]; s.t += s.speed;
      if (s.t >= 1) { s.t = 0; s.e = (Math.random() * edges.length) | 0; s.speed = 0.004 + Math.random() * 0.012; }
      const [ia, ib] = edges[s.e];
      const A = refs[ia].current?.translation(); const B = refs[ib].current?.translation();
      if (A && B) {
        dummy.position.set(A.x + (B.x - A.x) * s.t, A.y + (B.y - A.y) * s.t, A.z + (B.z - A.z) * s.t);
        dummy.scale.setScalar(0.07); dummy.updateMatrix(); mesh.setMatrixAt(i, dummy.matrix);
      }
    }
    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, SIGNAL_COUNT]} frustumCulled={false}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshBasicMaterial toneMapped={false} />
    </instancedMesh>
  );
}

function Heartbeat({ refs, namedCount }: { refs: RefObject<RapierRigidBody>[]; namedCount: number }) {
  const acc = useRef(0);
  useFrame((_, dt) => {
    acc.current += dt;
    if (acc.current < 0.25) return;
    acc.current = 0;
    for (let n = 0; n < 14; n++) {
      const i = namedCount + ((Math.random() * (refs.length - namedCount)) | 0);
      const b = refs[i]?.current;
      if (b) b.applyImpulse({ x: (Math.random() - 0.5) * 0.02, y: (Math.random() - 0.5) * 0.02, z: (Math.random() - 0.5) * 0.02 }, true);
    }
  });
  return null;
}

function FpsMeter({ onFps }: { onFps: (n: number) => void }) {
  const frames = useRef(0); const last = useRef(performance.now());
  useFrame(() => {
    frames.current++;
    const now = performance.now();
    if (now - last.current >= 500) { onFps(Math.round((frames.current * 1000) / (now - last.current))); frames.current = 0; last.current = now; }
  });
  return null;
}

function BrainScene({ onFps, onHover, controlsRef }: {
  onFps: (n: number) => void;
  onHover: (h: { label: string; desc: string; anchor?: string } | null) => void;
  controlsRef: RefObject<any>;
}) {
  const { neurons, edges, rest, namedCount } = useMemo(buildBrain, []);
  const refs = useMemo(() => neurons.map(() => createRef<RapierRigidBody>()), [neurons]);
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <>
      <color attach="background" args={['#050505']} />
      <ambientLight intensity={0.4} />
      <pointLight position={[6, 6, 8]} intensity={30} color="#ff7a40" />

      <Physics gravity={[0, 0, 0]}>
        {neurons.map((n, i) => {
          const isHover = hovered === i;
          return (
            <RigidBody
              key={i}
              ref={refs[i]}
              type={i === 0 ? 'fixed' : 'dynamic'}
              position={n.pos}
              linearDamping={LINEAR_DAMP}
              angularDamping={2}
              colliders={false}
            >
              <BallCollider args={[COLLIDER_R]} density={COLLIDER_DENS} collisionGroups={NO_COLLIDE} />
              <mesh
                onPointerOver={n.named ? (e) => { e.stopPropagation(); setHovered(i); onHover({ label: n.label!, desc: n.desc!, anchor: n.anchor }); document.body.style.cursor = n.anchor ? 'pointer' : 'default'; } : undefined}
                onPointerOut={n.named ? () => { setHovered(null); onHover(null); document.body.style.cursor = 'default'; } : undefined}
                onClick={n.named && n.anchor ? (e) => { e.stopPropagation(); document.querySelector(n.anchor!)?.scrollIntoView({ behavior: 'smooth' }); } : undefined}
              >
                <sphereGeometry args={[n.radius * (isHover ? 1.5 : 1), n.named ? 18 : 8, n.named ? 18 : 8]} />
                <meshStandardMaterial color={n.color} emissive={n.color} emissiveIntensity={isHover ? n.emissive * 1.6 : n.emissive} toneMapped={false} roughness={0.4} />
                {n.named && (n.labelAlways || isHover) && (
                  <Html center distanceFactor={11} style={{ pointerEvents: 'none' }} zIndexRange={[10, 0]}>
                    <div
                      className="font-mono whitespace-nowrap select-none"
                      style={{
                        fontSize: n.cat === 'god' ? 11 : 8,
                        letterSpacing: '0.12em',
                        color: n.color,
                        textShadow: `0 0 6px ${n.color}`,
                        transform: `translateY(${n.radius * 36 + 6}px)`,
                        opacity: isHover ? 1 : n.cat === 'god' ? 1 : 0.85,
                        fontFamily: n.cat === 'god' ? "'Bebas Neue', Impact, sans-serif" : undefined,
                      }}
                    >
                      {n.label}
                    </div>
                  </Html>
                )}
              </mesh>
            </RigidBody>
          );
        })}

        {edges.map(([i, j], e) => <Spring key={e} a={refs[i]} b={refs[j]} rest={rest[e]} />)}

        <Synapses refs={refs} edges={edges} namedCount={namedCount} />
        <Signals refs={refs} edges={edges} />
        <Heartbeat refs={refs} namedCount={namedCount} />
      </Physics>

      <OrbitControls ref={controlsRef} enablePan={false} enableZoom minDistance={5} maxDistance={18} autoRotate autoRotateSpeed={0.55} rotateSpeed={0.7} dampingFactor={0.08} />

      <EffectComposer>
        <Bloom mipmapBlur intensity={1.25} luminanceThreshold={0.25} luminanceSmoothing={0.5} radius={0.7} />
      </EffectComposer>

      <FpsMeter onFps={onFps} />
    </>
  );
}

export default function LiveProof() {
  const { t } = useLang();
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' });
  const controlsRef = useRef<any>(null);
  const [fps, setFps] = useState(60);
  const [tip, setTip] = useState<{ label: string; desc: string; anchor?: string } | null>(null);

  return (
    <section id="live-proof" ref={sectionRef} className="relative section-mark overflow-hidden py-24">
      <div className="absolute inset-0 concrete opacity-60" />

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        {/* header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <span className="mb-2 block font-mono text-label tracking-[0.3em] text-orange">
            02 / WORKSPACE GRAPH · NEURAL CORE
          </span>
          <h2 className="font-display text-display-md text-off-white">{t.liveProof.title}</h2>
          <p className="mt-2 max-w-2xl font-mono text-sm leading-relaxed text-smoke">{t.liveProof.body}</p>
        </motion.div>

        {/* brain */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.2 }}
          className="relative border border-steel bg-[#050505]"
          style={{ height: 'clamp(480px, 70vh, 720px)', touchAction: 'none' }}
          data-testid="brain-canvas"
        >
          {isInView && (
            <Canvas dpr={[1, 1.8]} camera={{ position: [0, 0, 10], fov: 50 }} gl={{ antialias: true, powerPreference: 'high-performance' }}>
              <BrainScene onFps={setFps} onHover={setTip} controlsRef={controlsRef} />
            </Canvas>
          )}

          <div className="pointer-events-none absolute left-3 top-2 select-none font-mono text-[7px] tracking-widest text-fog/60">
            <div>NEURAL.CORE / WebGL · Rapier physics · pipeline-mapped</div>
            <div style={{ color: C_KEY }}>{DEFS.length} SYSTEM NODES · {DEFS.length + FILLER_COUNT} NEURONS · {fps} FPS</div>
          </div>

          <div className="pointer-events-none absolute right-3 top-2 select-none font-mono text-[6px] tracking-widest text-fog/40">
            DRAG ROTATE · SCROLL ZOOM
          </div>

          {/* reset view */}
          <button
            type="button"
            data-testid="reset-view"
            onClick={() => controlsRef.current?.reset()}
            className="absolute bottom-3 right-3 z-20 border border-steel bg-black/60 px-3 py-1.5 font-mono text-[8px] uppercase tracking-widest text-white/70 transition-colors hover:border-orange hover:text-orange"
          >
            ↻ Reset view
          </button>

          {tip && (
            <div className="pointer-events-none absolute bottom-3 left-3 z-20 border border-steel/50 bg-[#0d0d0d]/95 px-2.5 py-2" style={{ minWidth: 170, maxWidth: 240 }}>
              <div className="mb-1 font-mono text-[8px] tracking-widest text-off-white">{tip.label}</div>
              <div className="font-mono text-[7px] leading-snug text-fog">{tip.desc}</div>
              {tip.anchor && <div className="mt-1.5 font-mono text-[6px] tracking-wider text-orange/60">CLICK — SCROLL TO SECTION</div>}
            </div>
          )}
        </motion.div>

        {/* legend */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.6 }}
          className="mt-4 flex flex-wrap gap-x-6 gap-y-2 font-mono text-[8px] tracking-widest"
        >
          <span style={{ color: C_HOT }}>● ENGINE / LIVE</span>
          <span style={{ color: C_KEY }}>● TOOL</span>
          <span style={{ color: C_DIM }}>● NODE / TECHNIQUE</span>
        </motion.div>

        {/* CTAs */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <a
            href={LIVE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-orange px-7 py-3.5 text-sm font-bold uppercase tracking-wider text-black transition-transform hover:scale-[1.02]"
          >
            {t.liveProof.ctaPrimary}
            <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" aria-hidden>
              <path d="M5 3h8v8M13 3 4 12" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
          <a
            href={MAILTO}
            className="inline-flex items-center justify-center border border-steel px-7 py-3.5 text-sm font-bold uppercase tracking-wider text-white transition-colors hover:border-white/40"
          >
            {t.liveProof.ctaSecondary}
          </a>
        </div>
      </div>
    </section>
  );
}

const LIVE_URL = 'https://animatedportfolio-osa.vercel.app';
const MAILTO =
  'mailto:osabarca@gmail.com?subject=NEONWERKS%20%E2%80%94%20Build%20My%20Visual%20System';
