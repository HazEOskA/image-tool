/**
 * ASTRODITHER material — a stylized ordered-dithering (Bayer 4x4) shader.
 *
 * The fragment shader lights the surface with a cheap wrap-lambert term, maps
 * the luminance onto a cyan→purple→pink neon ramp, then quantizes brightness
 * using a screen-space 4x4 Bayer threshold map to produce a crisp retro
 * pixel-dither look. A little animated grain keeps it alive.
 */

export const ditherVertex = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vViewPos;
  varying vec2 vUv;

  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vViewPos = -mvPosition.xyz;
    gl_Position = projectionMatrix * mvPosition;
  }
`;

export const ditherFragment = /* glsl */ `
  precision highp float;

  uniform float uTime;
  uniform float uPixelSize;   // size of a dither cell in pixels
  uniform vec3  uColorA;      // shadow / low
  uniform vec3  uColorB;      // mid
  uniform vec3  uColorC;      // highlight
  uniform vec3  uLightDir;

  varying vec3 vNormal;
  varying vec3 vViewPos;
  varying vec2 vUv;

  // 4x4 ordered Bayer matrix -> threshold in [0,1)
  float bayer4x4(vec2 p) {
    int x = int(mod(p.x, 4.0));
    int y = int(mod(p.y, 4.0));
    int index = x + y * 4;
    // Normalized Bayer matrix values (0..15)/16
    float m[16];
    m[0]=0.0;  m[1]=8.0;  m[2]=2.0;  m[3]=10.0;
    m[4]=12.0; m[5]=4.0;  m[6]=14.0; m[7]=6.0;
    m[8]=3.0;  m[9]=11.0; m[10]=1.0; m[11]=9.0;
    m[12]=15.0;m[13]=7.0; m[14]=13.0;m[15]=5.0;
    float v = 0.0;
    for (int i = 0; i < 16; i++) { if (i == index) v = m[i]; }
    return (v + 0.5) / 16.0;
  }

  void main() {
    vec3 N = normalize(vNormal);
    vec3 L = normalize(uLightDir);
    vec3 V = normalize(vViewPos);

    // Wrap lambert + rim for a soft, sculpted read
    float diff = clamp(dot(N, L) * 0.5 + 0.5, 0.0, 1.0);
    float rim  = pow(1.0 - clamp(dot(N, V), 0.0, 1.0), 2.5);
    float lum  = clamp(diff * 0.85 + rim * 0.6, 0.0, 1.0);

    // Animated grain folded into luminance before quantization
    float grain = fract(sin(dot(vUv * (uTime * 0.05 + 1.0), vec2(12.9898, 78.233))) * 43758.5453);
    lum += (grain - 0.5) * 0.06;

    // Neon ramp
    vec3 col = mix(uColorA, uColorB, smoothstep(0.0, 0.6, lum));
    col = mix(col, uColorC, smoothstep(0.55, 1.0, lum));

    // Ordered dithering in screen space (quantize to stepped bands)
    vec2 cell = floor(gl_FragCoord.xy / uPixelSize);
    float threshold = bayer4x4(cell);
    float levels = 5.0;
    float quant = floor(lum * levels + threshold) / levels;

    col *= mix(0.55, 1.25, quant);
    // subtle additive rim glow so edges read as neon
    col += uColorC * rim * 0.35;

    gl_FragColor = vec4(col, 1.0);
  }
`;
