import { simplexNoise3D } from './noise.glsl';

/**
 * SMOOTHIE blob — organic vertex displacement driven by layered simplex noise.
 * uMouse pushes a travelling bulge toward the pointer; uIntensity is lerped
 * from the React side for a high-damping "catch up" feel. The fragment shader
 * applies a fresnel-weighted cyan→purple→pink gradient with an inner glow.
 */

export const blobVertex = /* glsl */ `
  ${simplexNoise3D}

  uniform float uTime;
  uniform float uIntensity;   // 0..1, eased toward pointer activity
  uniform vec3  uMouse;       // pointer direction in object space

  varying vec3  vNormal;
  varying vec3  vViewPos;
  varying float vDisp;

  // Re-compute a displaced position so we can derive a smooth normal
  // by sampling neighbours — keeps lighting correct as the mesh morphs.
  float displace(vec3 p) {
    float t = uTime * 0.35;
    float n  = snoise(p * 1.1 + vec3(0.0, t, 0.0)) * 0.6;
    n       += snoise(p * 2.3 - vec3(t * 0.7, 0.0, 0.0)) * 0.25;
    n       += snoise(p * 4.7 + vec3(0.0, 0.0, t * 1.3)) * 0.12;

    // Pointer-driven travelling bulge
    float pull = smoothstep(0.2, 1.0, dot(normalize(p), normalize(uMouse + 0.0001)));
    n += pull * uIntensity * 0.5;

    return n;
  }

  void main() {
    float d = displace(position);
    vDisp = d;

    vec3 displaced = position + normal * d * (0.35 + uIntensity * 0.25);

    // Numerical normal via tangent basis offsets
    float eps = 0.05;
    vec3 tangent = normalize(cross(normal, vec3(0.0, 1.0, 0.0) + 0.001));
    vec3 bitangent = normalize(cross(normal, tangent));
    vec3 pa = position + tangent * eps;
    vec3 pb = position + bitangent * eps;
    vec3 da = pa + normal * displace(pa) * (0.35 + uIntensity * 0.25);
    vec3 db = pb + normal * displace(pb) * (0.35 + uIntensity * 0.25);
    vec3 newNormal = normalize(cross(da - displaced, db - displaced));

    vNormal = normalize(normalMatrix * newNormal);
    vec4 mvPosition = modelViewMatrix * vec4(displaced, 1.0);
    vViewPos = -mvPosition.xyz;
    gl_Position = projectionMatrix * mvPosition;
  }
`;

export const blobFragment = /* glsl */ `
  precision highp float;

  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform vec3 uColorC;

  varying vec3  vNormal;
  varying vec3  vViewPos;
  varying float vDisp;

  void main() {
    vec3 N = normalize(vNormal);
    vec3 V = normalize(vViewPos);

    float fres = pow(1.0 - clamp(dot(N, V), 0.0, 1.0), 2.0);
    float band = clamp(vDisp * 0.5 + 0.5, 0.0, 1.0);

    vec3 base = mix(uColorA, uColorB, smoothstep(0.1, 0.7, band));
    base = mix(base, uColorC, fres);

    // soft inner light
    float core = clamp(dot(N, V), 0.0, 1.0);
    base += uColorB * core * 0.15;
    base += uColorC * fres * 0.6;

    gl_FragColor = vec4(base, 1.0);
  }
`;
