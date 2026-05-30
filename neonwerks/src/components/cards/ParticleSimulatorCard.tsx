import { useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import CardShell from '../ui/CardShell';

const COUNT = 3400;

const particleVertex = /* glsl */ `
  attribute vec3 aColor;
  attribute float aScale;
  uniform float uSize;
  varying vec3 vColor;
  void main() {
    vColor = aColor;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = uSize * aScale * (1.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const particleFragment = /* glsl */ `
  precision mediump float;
  varying vec3 vColor;
  void main() {
    // circular glow falloff
    float d = length(gl_PointCoord - vec2(0.5));
    if (d > 0.5) discard;
    float alpha = smoothstep(0.5, 0.0, d);
    float core = smoothstep(0.25, 0.0, d);
    vec3 col = vColor + core * 0.6;
    gl_FragColor = vec4(col, alpha);
  }
`;

function ParticleField() {
  const pointsRef = useRef<THREE.Points>(null);
  const { pointer, viewport } = useThree();

  const palette = useMemo(
    () => [new THREE.Color('#34e2ff'), new THREE.Color('#9b6bff'), new THREE.Color('#ff5ed3'), new THREE.Color('#4f8bff')],
    [],
  );

  const { geometry, basePositions, velocities } = useMemo(() => {
    const positions = new Float32Array(COUNT * 3);
    const base = new Float32Array(COUNT * 3);
    const colors = new Float32Array(COUNT * 3);
    const scales = new Float32Array(COUNT);
    const vel = new Float32Array(COUNT * 3);

    for (let i = 0; i < COUNT; i++) {
      // distribute in a soft spherical cloud
      const r = 2.4 * Math.cbrt(Math.random());
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta) * 0.7;
      const z = r * Math.cos(phi);
      positions[i * 3] = base[i * 3] = x;
      positions[i * 3 + 1] = base[i * 3 + 1] = y;
      positions[i * 3 + 2] = base[i * 3 + 2] = z;

      const c = palette[Math.floor(Math.random() * palette.length)];
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
      scales[i] = 8 + Math.random() * 22;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('aColor', new THREE.BufferAttribute(colors, 3));
    geo.setAttribute('aScale', new THREE.BufferAttribute(scales, 1));
    return { geometry: geo, basePositions: base, velocities: vel };
  }, [palette]);

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: particleVertex,
        fragmentShader: particleFragment,
        uniforms: { uSize: { value: 18 } },
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    [],
  );

  useFrame((_, delta) => {
    const pts = pointsRef.current;
    if (!pts) return;
    const dt = Math.min(delta, 0.05);

    // gentle global rotation
    pts.rotation.y += dt * 0.12;

    // pointer projected onto the z=0 plane in local space (undo rotation)
    const mx = pointer.x * viewport.width * 0.5;
    const my = pointer.y * viewport.height * 0.5;
    const cosY = Math.cos(-pts.rotation.y);
    const sinY = Math.sin(-pts.rotation.y);
    const localMx = mx * cosY;
    const localMz = mx * sinY;

    const posAttr = geometry.getAttribute('position') as THREE.BufferAttribute;
    const arr = posAttr.array as Float32Array;
    const radius = 1.1;

    for (let i = 0; i < COUNT; i++) {
      const ix = i * 3;
      const px = arr[ix];
      const py = arr[ix + 1];
      const pz = arr[ix + 2];

      // repulsion from pointer
      const dx = px - localMx;
      const dy = py - my;
      const dz = pz - localMz;
      const dist2 = dx * dx + dy * dy + dz * dz;
      if (dist2 < radius * radius) {
        const dist = Math.max(Math.sqrt(dist2), 0.0001);
        const force = (1 - dist / radius) * 0.9;
        velocities[ix] += (dx / dist) * force * dt * 18;
        velocities[ix + 1] += (dy / dist) * force * dt * 18;
        velocities[ix + 2] += (dz / dist) * force * dt * 18;
      }

      // integrate + spring back to base (lerp) + damping
      velocities[ix] += (basePositions[ix] - px) * dt * 2.4;
      velocities[ix + 1] += (basePositions[ix + 1] - py) * dt * 2.4;
      velocities[ix + 2] += (basePositions[ix + 2] - pz) * dt * 2.4;
      velocities[ix] *= 0.9;
      velocities[ix + 1] *= 0.9;
      velocities[ix + 2] *= 0.9;

      arr[ix] = px + velocities[ix] * dt * 6;
      arr[ix + 1] = py + velocities[ix + 1] * dt * 6;
      arr[ix + 2] = pz + velocities[ix + 2] * dt * 6;
    }
    posAttr.needsUpdate = true;
  });

  return <points ref={pointsRef} geometry={geometry} material={material} />;
}

export default function ParticleSimulatorCard() {
  return (
    <CardShell
      index="04"
      title="AI PARTICLE SIMULATOR"
      concept="Particle Emitter"
      accent="#ff5ed3"
      tags={['3,400 points', 'Repulsion field', 'Additive glow']}
    >
      <div className="h-56 w-full">
        <Canvas
          dpr={[1, 2]}
          camera={{ position: [0, 0, 6], fov: 50 }}
          gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        >
          <ParticleField />
        </Canvas>
      </div>
    </CardShell>
  );
}
