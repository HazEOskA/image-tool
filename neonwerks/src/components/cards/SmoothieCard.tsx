import { useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import CardShell from '../ui/CardShell';
import { blobFragment, blobVertex } from '../../shaders/blob.glsl';

function Blob() {
  const meshRef = useRef<THREE.Mesh>(null);
  const { pointer, viewport } = useThree();

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: blobVertex,
        fragmentShader: blobFragment,
        uniforms: {
          uTime: { value: 0 },
          uIntensity: { value: 0 },
          uMouse: { value: new THREE.Vector3(0, 0, 1) },
          uColorA: { value: new THREE.Color('#4f8bff') },
          uColorB: { value: new THREE.Color('#9b6bff') },
          uColorC: { value: new THREE.Color('#ff5ed3') },
        },
      }),
    [],
  );

  // high-resolution sphere so vertex displacement stays smooth
  const geometry = useMemo(() => new THREE.IcosahedronGeometry(1.25, 48), []);

  // mutable eased targets
  const eased = useRef({ intensity: 0, mx: 0, my: 0 });

  useFrame((_, delta) => {
    const m = meshRef.current;
    if (!m) return;
    material.uniforms.uTime.value += delta;

    const targetIntensity = pointer.length() > 0.02 ? 1 : 0.15;
    // high damping = slow, organic catch-up ("dociąganie")
    eased.current.intensity += (targetIntensity - eased.current.intensity) * 0.04;
    material.uniforms.uIntensity.value = eased.current.intensity;

    // pointer direction in object space drives the travelling bulge
    (material.uniforms.uMouse.value as THREE.Vector3).set(pointer.x, pointer.y, 0.6).normalize();

    // blob body slowly drifts toward the cursor (lerp with high damping)
    const targetX = pointer.x * viewport.width * 0.18;
    const targetY = pointer.y * viewport.height * 0.18;
    eased.current.mx += (targetX - eased.current.mx) * 0.03;
    eased.current.my += (targetY - eased.current.my) * 0.03;
    m.position.set(eased.current.mx, eased.current.my, 0);

    m.rotation.y += delta * 0.15;
    m.rotation.z += delta * 0.05;
  });

  return <mesh ref={meshRef} geometry={geometry} material={material} />;
}

export default function SmoothieCard() {
  return (
    <CardShell
      index="03"
      title="SMOOTHIE"
      concept="Fluid Interpolation"
      accent="#4f8bff"
      tags={['Lerp damping', 'Simplex noise', 'Morphing mesh']}
    >
      <div className="h-56 w-full">
        <Canvas
          dpr={[1, 2]}
          camera={{ position: [0, 0, 3.4], fov: 50 }}
          gl={{ antialias: true, powerPreference: 'high-performance' }}
        >
          <color attach="background" args={['#070710']} />
          <Blob />
        </Canvas>
      </div>
    </CardShell>
  );
}
