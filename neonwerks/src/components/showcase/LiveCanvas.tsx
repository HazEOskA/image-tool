import { useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { blobFragment, blobVertex } from '../../shaders/blob.glsl';
import { ditherFragment, ditherVertex } from '../../shaders/dither.glsl';

/* ---------- Smoothie blob (centre piece) ---------- */
function ShowBlob() {
  const ref = useRef<THREE.Mesh>(null);
  const { pointer } = useThree();
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: blobVertex,
        fragmentShader: blobFragment,
        uniforms: {
          uTime: { value: 0 },
          uIntensity: { value: 0.4 },
          uMouse: { value: new THREE.Vector3(0, 0, 1) },
          uColorA: { value: new THREE.Color('#4f8bff') },
          uColorB: { value: new THREE.Color('#9b6bff') },
          uColorC: { value: new THREE.Color('#ff5ed3') },
        },
      }),
    [],
  );
  const geometry = useMemo(() => new THREE.IcosahedronGeometry(1.1, 40), []);
  const eased = useRef(0.4);

  useFrame((_, delta) => {
    if (!ref.current) return;
    material.uniforms.uTime.value += delta;
    const target = pointer.length() > 0.02 ? 1 : 0.35;
    eased.current += (target - eased.current) * 0.04;
    material.uniforms.uIntensity.value = eased.current;
    (material.uniforms.uMouse.value as THREE.Vector3).set(pointer.x, pointer.y, 0.6).normalize();
    ref.current.rotation.y += delta * 0.18;
  });

  return <mesh ref={ref} geometry={geometry} material={material} position={[0, 0, 0]} />;
}

/* ---------- Astrodither orbiting shapes ---------- */
function ShowDither() {
  const group = useRef<THREE.Group>(null);
  const geos = useMemo(
    () => [new THREE.IcosahedronGeometry(0.4, 1), new THREE.TorusGeometry(0.32, 0.13, 8, 14), new THREE.BoxGeometry(0.5, 0.5, 0.5, 2, 2, 2)],
    [],
  );
  const mats = useMemo(
    () =>
      ['#34e2ff', '#ff5ed3', '#9b6bff'].map((c) => {
        const m = new THREE.ShaderMaterial({
          vertexShader: ditherVertex,
          fragmentShader: ditherFragment,
          uniforms: {
            uTime: { value: 0 },
            uPixelSize: { value: 3.5 },
            uColorA: { value: new THREE.Color('#160e36') },
            uColorB: { value: new THREE.Color('#4f8bff') },
            uColorC: { value: new THREE.Color(c) },
            uLightDir: { value: new THREE.Vector3(0.5, 0.8, 0.6).normalize() },
          },
        });
        return m;
      }),
    [],
  );

  useFrame((_, delta) => {
    if (!group.current) return;
    group.current.rotation.y += delta * 0.25;
    mats.forEach((m) => (m.uniforms.uTime.value += delta));
    group.current.children.forEach((child, i) => {
      child.rotation.x += delta * (0.4 + i * 0.2);
      child.rotation.z += delta * 0.3;
    });
  });

  const radius = 2.2;
  return (
    <group ref={group}>
      {geos.map((g, i) => {
        const a = (i / geos.length) * Math.PI * 2;
        return (
          <mesh
            key={i}
            geometry={g}
            material={mats[i]}
            position={[Math.cos(a) * radius, Math.sin(a) * 0.8, Math.sin(a) * radius]}
          />
        );
      })}
    </group>
  );
}

/* ---------- Particle streams (background) ---------- */
const P_COUNT = 2400;
const pVert = /* glsl */ `
  attribute vec3 aColor; attribute float aScale;
  uniform float uSize; varying vec3 vColor;
  void main(){
    vColor=aColor;
    vec4 mv=modelViewMatrix*vec4(position,1.0);
    gl_PointSize=uSize*aScale*(1.0/-mv.z);
    gl_Position=projectionMatrix*mv;
  }`;
const pFrag = /* glsl */ `
  precision mediump float; varying vec3 vColor;
  void main(){
    float d=length(gl_PointCoord-vec2(0.5));
    if(d>0.5) discard;
    float a=smoothstep(0.5,0.0,d);
    gl_FragColor=vec4(vColor+smoothstep(0.2,0.0,d)*0.5,a);
  }`;

function ShowParticles() {
  const ref = useRef<THREE.Points>(null);
  const { pointer, viewport } = useThree();
  const palette = useMemo(
    () => [new THREE.Color('#34e2ff'), new THREE.Color('#9b6bff'), new THREE.Color('#ff5ed3')],
    [],
  );

  const { geometry, base, vel } = useMemo(() => {
    const pos = new Float32Array(P_COUNT * 3);
    const b = new Float32Array(P_COUNT * 3);
    const col = new Float32Array(P_COUNT * 3);
    const sc = new Float32Array(P_COUNT);
    const v = new Float32Array(P_COUNT * 3);
    for (let i = 0; i < P_COUNT; i++) {
      const r = 4.5 * Math.cbrt(Math.random());
      const th = Math.random() * Math.PI * 2;
      const ph = Math.acos(2 * Math.random() - 1);
      const x = r * Math.sin(ph) * Math.cos(th);
      const y = r * Math.sin(ph) * Math.sin(th) * 0.5;
      const z = r * Math.cos(ph);
      pos[i * 3] = b[i * 3] = x;
      pos[i * 3 + 1] = b[i * 3 + 1] = y;
      pos[i * 3 + 2] = b[i * 3 + 2] = z;
      const c = palette[i % palette.length];
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
      sc[i] = 6 + Math.random() * 16;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('aColor', new THREE.BufferAttribute(col, 3));
    geo.setAttribute('aScale', new THREE.BufferAttribute(sc, 1));
    return { geometry: geo, base: b, vel: v };
  }, [palette]);

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: pVert,
        fragmentShader: pFrag,
        uniforms: { uSize: { value: 14 } },
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    [],
  );

  useFrame((_, delta) => {
    const pts = ref.current;
    if (!pts) return;
    const dt = Math.min(delta, 0.05);
    pts.rotation.y += dt * 0.08;
    const mx = pointer.x * viewport.width * 0.5;
    const my = pointer.y * viewport.height * 0.5;
    const posAttr = geometry.getAttribute('position') as THREE.BufferAttribute;
    const arr = posAttr.array as Float32Array;
    const radius = 1.4;
    for (let i = 0; i < P_COUNT; i++) {
      const ix = i * 3;
      const dx = arr[ix] - mx;
      const dy = arr[ix + 1] - my;
      const dist2 = dx * dx + dy * dy + arr[ix + 2] * arr[ix + 2] * 0.0;
      if (dist2 < radius * radius) {
        const dist = Math.max(Math.sqrt(dist2), 0.0001);
        const f = (1 - dist / radius) * 0.8;
        vel[ix] += (dx / dist) * f * dt * 16;
        vel[ix + 1] += (dy / dist) * f * dt * 16;
      }
      vel[ix] += (base[ix] - arr[ix]) * dt * 2.0;
      vel[ix + 1] += (base[ix + 1] - arr[ix + 1]) * dt * 2.0;
      vel[ix + 2] += (base[ix + 2] - arr[ix + 2]) * dt * 2.0;
      vel[ix] *= 0.9;
      vel[ix + 1] *= 0.9;
      vel[ix + 2] *= 0.9;
      arr[ix] += vel[ix] * dt * 6;
      arr[ix + 1] += vel[ix + 1] * dt * 6;
      arr[ix + 2] += vel[ix + 2] * dt * 6;
    }
    posAttr.needsUpdate = true;
  });

  return <points ref={ref} geometry={geometry} material={material} />;
}

export default function LiveCanvas() {
  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [0, 0, 6], fov: 50 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
    >
      <color attach="background" args={['#06060d']} />
      <ShowParticles />
      <ShowDither />
      <ShowBlob />
    </Canvas>
  );
}
