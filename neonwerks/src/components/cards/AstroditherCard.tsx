import { useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import CardShell from '../ui/CardShell';
import { ditherFragment, ditherVertex } from '../../shaders/dither.glsl';
import { useLang } from '../../i18n';

function makeDitherMaterial() {
  return new THREE.ShaderMaterial({
    vertexShader: ditherVertex,
    fragmentShader: ditherFragment,
    uniforms: {
      uTime: { value: 0 },
      uPixelSize: { value: 4.0 },
      uColorA: { value: new THREE.Color('#1a1140') }, // shadow
      uColorB: { value: new THREE.Color('#4f8bff') }, // mid
      uColorC: { value: new THREE.Color('#34e2ff') }, // highlight
      uLightDir: { value: new THREE.Vector3(0.6, 0.8, 0.5).normalize() },
    },
  });
}

interface ShapeProps {
  geometry: THREE.BufferGeometry;
  position: [number, number, number];
  speed: number;
  color: string;
}

function DitherShape({ geometry, position, speed, color }: ShapeProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const material = useMemo(() => {
    const m = makeDitherMaterial();
    (m.uniforms.uColorC.value as THREE.Color).set(color);
    return m;
  }, [color]);

  useFrame((_, delta) => {
    const m = meshRef.current;
    if (!m) return;
    material.uniforms.uTime.value += delta;
    m.rotation.x += delta * speed * 0.6;
    m.rotation.y += delta * speed;
    m.position.y = position[1] + Math.sin(material.uniforms.uTime.value * speed) * 0.18;
  });

  return <mesh ref={meshRef} geometry={geometry} material={material} position={position} />;
}

function DitherScene() {
  const groupRef = useRef<THREE.Group>(null);
  const { pointer } = useThree();

  // low-poly geometries (sphere = icosahedron, plus cube & torus)
  const geos = useMemo(
    () => ({
      sphere: new THREE.IcosahedronGeometry(0.95, 1),
      cube: new THREE.BoxGeometry(1.1, 1.1, 1.1, 2, 2, 2),
      torus: new THREE.TorusGeometry(0.7, 0.28, 8, 14),
    }),
    [],
  );

  useFrame(() => {
    const g = groupRef.current;
    if (!g) return;
    // high-damping parallax toward pointer
    g.rotation.y += (pointer.x * 0.5 - g.rotation.y) * 0.05;
    g.rotation.x += (-pointer.y * 0.4 - g.rotation.x) * 0.05;
  });

  return (
    <group ref={groupRef}>
      <DitherShape geometry={geos.sphere} position={[-1.5, 0.2, 0]} speed={0.5} color="#34e2ff" />
      <DitherShape geometry={geos.cube} position={[1.5, -0.3, -0.5]} speed={0.4} color="#9b6bff" />
      <DitherShape geometry={geos.torus} position={[0.1, 0.6, 0.6]} speed={0.7} color="#ff5ed3" />
    </group>
  );
}

export default function AstroditherCard() {
  const { t } = useLang();
  const c = t.pipeline.cards.astrodither;
  return (
    <CardShell
      index="02"
      title="ASTRODITHER"
      concept={c.concept}
      accent="#9b6bff"
      tags={[...c.tags]}
    >
      <div className="h-56 w-full">
        <Canvas
          dpr={[1, 2]}
          camera={{ position: [0, 0, 5], fov: 45 }}
          gl={{ antialias: true, powerPreference: 'high-performance' }}
        >
          <color attach="background" args={['#070710']} />
          <DitherScene />
        </Canvas>
      </div>
    </CardShell>
  );
}
