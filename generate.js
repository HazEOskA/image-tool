const fs = require('fs');
const { Resvg } = require('@resvg/resvg-js');

// ---------- config ----------
const W = 1680;
const H = 2160;
const SANS = "Liberation Sans, DejaVu Sans, sans-serif";
const MONO = "DejaVu Sans Mono, monospace";

// palette
const C = {
  cyan: '#34e2ff',
  blue: '#4f8bff',
  violet: '#9b6bff',
  magenta: '#f06ff0',
  ink: '#f3f6ff',
  muted: '#9aa6cc',
  faint: '#6b769e',
};

// seeded rng
let _s = 1337;
function rnd() { _s = (_s * 1103515245 + 12345) & 0x7fffffff; return _s / 0x7fffffff; }
const r = (a, b) => a + (b - a) * rnd();

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
function text(x, y, s, o = {}) {
  const {size=16, w=400, fill=C.ink, anchor='start', ls=0, ff=SANS, op=1, fam} = o;
  return `<text x="${x}" y="${y}" font-family="${fam||ff}" font-size="${size}" font-weight="${w}" fill="${fill}" text-anchor="${anchor}" letter-spacing="${ls}" opacity="${op}">${esc(s)}</text>`;
}
function rrect(x, y, w, h, rad, o = {}) {
  const {fill='none', stroke='none', sw=1, op=1} = o;
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rad}" ry="${rad}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}" opacity="${op}"/>`;
}

let out = [];
const P = s => out.push(s);

// ---------- defs ----------
P(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">`);
P(`<defs>
  <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#070a18"/>
    <stop offset="0.5" stop-color="#080b1c"/>
    <stop offset="1" stop-color="#05060f"/>
  </linearGradient>
  <radialGradient id="glowCyan" cx="0.5" cy="0.5" r="0.5">
    <stop offset="0" stop-color="${C.cyan}" stop-opacity="0.55"/>
    <stop offset="1" stop-color="${C.cyan}" stop-opacity="0"/>
  </radialGradient>
  <radialGradient id="glowViolet" cx="0.5" cy="0.5" r="0.5">
    <stop offset="0" stop-color="${C.violet}" stop-opacity="0.55"/>
    <stop offset="1" stop-color="${C.violet}" stop-opacity="0"/>
  </radialGradient>
  <radialGradient id="glowMag" cx="0.5" cy="0.5" r="0.5">
    <stop offset="0" stop-color="${C.magenta}" stop-opacity="0.5"/>
    <stop offset="1" stop-color="${C.magenta}" stop-opacity="0"/>
  </radialGradient>
  <linearGradient id="accent" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0" stop-color="${C.cyan}"/>
    <stop offset="0.5" stop-color="${C.blue}"/>
    <stop offset="1" stop-color="${C.violet}"/>
  </linearGradient>
  <linearGradient id="accent2" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0" stop-color="${C.violet}"/>
    <stop offset="1" stop-color="${C.magenta}"/>
  </linearGradient>
  <linearGradient id="glass" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#ffffff" stop-opacity="0.07"/>
    <stop offset="1" stop-color="#ffffff" stop-opacity="0.02"/>
  </linearGradient>
  <linearGradient id="glassHi" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#ffffff" stop-opacity="0.10"/>
    <stop offset="1" stop-color="#ffffff" stop-opacity="0.025"/>
  </linearGradient>
  <linearGradient id="titleGrad" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0" stop-color="#ffffff"/>
    <stop offset="0.55" stop-color="#cfe3ff"/>
    <stop offset="1" stop-color="${C.cyan}"/>
  </linearGradient>
  <linearGradient id="cyanV" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="${C.cyan}"/><stop offset="1" stop-color="${C.blue}"/>
  </linearGradient>
  <linearGradient id="violetV" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="${C.violet}"/><stop offset="1" stop-color="${C.magenta}"/>
  </linearGradient>
  <linearGradient id="orb" x1="0.2" y1="0.1" x2="0.8" y2="1">
    <stop offset="0" stop-color="${C.cyan}"/>
    <stop offset="0.5" stop-color="${C.violet}"/>
    <stop offset="1" stop-color="${C.magenta}"/>
  </linearGradient>
  <radialGradient id="orbHi" cx="0.35" cy="0.3" r="0.5">
    <stop offset="0" stop-color="#ffffff" stop-opacity="0.85"/>
    <stop offset="0.4" stop-color="#ffffff" stop-opacity="0.12"/>
    <stop offset="1" stop-color="#ffffff" stop-opacity="0"/>
  </radialGradient>
  <filter id="soft" x="-60%" y="-60%" width="220%" height="220%">
    <feGaussianBlur stdDeviation="7"/>
  </filter>
  <filter id="soft2" x="-80%" y="-80%" width="260%" height="260%">
    <feGaussianBlur stdDeviation="3"/>
  </filter>
  <filter id="cardShadow" x="-30%" y="-30%" width="160%" height="160%">
    <feDropShadow dx="0" dy="10" stdDeviation="18" flood-color="#000000" flood-opacity="0.45"/>
  </filter>
  <pattern id="grid" width="46" height="46" patternUnits="userSpaceOnUse">
    <path d="M46 0 L0 0 0 46" fill="none" stroke="#9fb4ff" stroke-opacity="0.05" stroke-width="1"/>
  </pattern>
  <clipPath id="heroClip"><rect x="0" y="0" width="1" height="1"/></clipPath>
</defs>`);

// ---------- background ----------
P(rrect(0, 0, W, H, 0, {fill: 'url(#bg)'}));
P(`<rect x="0" y="0" width="${W}" height="${H}" fill="url(#grid)"/>`);
// ambient glows
P(`<circle cx="${W*0.16}" cy="${H*0.10}" r="420" fill="url(#glowCyan)" filter="url(#soft)"/>`);
P(`<circle cx="${W*0.88}" cy="${H*0.07}" r="380" fill="url(#glowViolet)" filter="url(#soft)"/>`);
P(`<circle cx="${W*0.92}" cy="${H*0.78}" r="460" fill="url(#glowMag)" filter="url(#soft)"/>`);
P(`<circle cx="${W*0.10}" cy="${H*0.62}" r="420" fill="url(#glowCyan)" opacity="0.7" filter="url(#soft)"/>`);

const PAD = 84;
const INW = W - PAD * 2;

// ================= HEADER =================
let y = 120;
// eyebrow badge
const ebw = 360, ebx = W/2 - ebw/2;
P(rrect(ebx, y-34, ebw, 46, 23, {fill: 'url(#glass)', stroke: 'rgba(120,170,255,0.28)', sw: 1}));
P(`<circle cx="${ebx+30}" cy="${y-11}" r="5" fill="${C.cyan}"/>`);
P(`<circle cx="${ebx+30}" cy="${y-11}" r="9" fill="none" stroke="${C.cyan}" stroke-opacity="0.4" stroke-width="1.5"/>`);
P(text(ebx+50, y-4, 'DESIGN SYSTEM · CASE STUDY', {size: 16, w: 700, fill: '#cbd8ff', ls: 3, ff: MONO}));

// title
y += 118;
P(`<text x="${W/2}" y="${y}" font-family="${SANS}" font-size="74" font-weight="800" fill="url(#titleGrad)" text-anchor="middle" letter-spacing="-1">Modern Animated Web Design Pipeline</text>`);

// subtitle
y += 56;
P(text(W/2, y, 'From typography, visual style, 3D motion and particles', {size: 25, w: 400, fill: C.muted, anchor: 'middle'}));
y += 38;
P(text(W/2, y, 'to one polished interactive website.', {size: 25, w: 400, fill: C.muted, anchor: 'middle'}));

// section label
y += 86;
P(`<line x1="${PAD}" y1="${y-8}" x2="${PAD+44}" y2="${y-8}" stroke="url(#accent)" stroke-width="3"/>`);
P(text(PAD+60, y, 'THE TOOLKIT', {size: 17, w: 700, fill: C.cyan, ls: 4, ff: MONO}));
P(text(W-PAD, y, 'Four tools · one workflow', {size: 17, w: 600, fill: C.faint, anchor: 'end', ff: MONO}));

// ================= CARDS =================
const cardsY = y + 36;
const gap = 30;
const cw = (INW - gap * 3) / 4;
const ch = 470;

const tools = [
  {
    n: '01', title: 'String Tune', accent: C.cyan, av: 'url(#cyanV)', glow: 'url(#glowCyan)',
    tag: 'Typography',
    desc: 'Interactive type, animated letters & fluid text motion.',
    pills: ['Kinetic type', 'Variable axes', 'Text flow'],
    icon: 'type',
  },
  {
    n: '02', title: 'Astrodither', accent: C.blue, av: 'url(#accent)', glow: 'url(#glowViolet)',
    tag: 'Visual style',
    desc: 'Shader textures & retro-futuristic dither effects.',
    pills: ['Shaders', 'Dither', 'Texture'],
    icon: 'dither',
  },
  {
    n: '03', title: 'Smoothie', accent: C.violet, av: 'url(#violetV)', glow: 'url(#glowViolet)',
    tag: '3D motion',
    desc: 'Smooth 3D motion, interpolation & polished transitions.',
    pills: ['Easing', '3D objects', 'Transitions'],
    icon: 'curve',
  },
  {
    n: '04', title: 'AI Particle Simulator', accent: C.magenta, av: 'url(#accent2)', glow: 'url(#glowMag)',
    tag: 'Particles',
    desc: 'Reactive particle systems & dynamic backgrounds.',
    pills: ['Particles', 'Mouse-reactive', 'Fields'],
    icon: 'particles',
  },
];

function card(cx, t) {
  const cy = cardsY;
  let s = [];
  // glow behind
  s.push(`<circle cx="${cx+cw/2}" cy="${cy+ch*0.62}" r="150" fill="${t.glow}" opacity="0.6"/>`);
  // card body
  s.push(`<g filter="url(#cardShadow)">`);
  s.push(rrect(cx, cy, cw, ch, 26, {fill: 'url(#glassHi)', stroke: 'rgba(255,255,255,0.10)', sw: 1.2}));
  s.push(`</g>`);
  // top accent line
  s.push(`<rect x="${cx+26}" y="${cy}" width="${cw-52}" height="3" rx="1.5" fill="${t.av}" opacity="0.9"/>`);

  // header row
  const ix = cx + 30, iy = cy + 38;
  s.push(rrect(ix, iy, 46, 46, 14, {fill: 'rgba(10,14,30,0.6)', stroke: t.accent, sw: 1.3, op: 0.9}));
  s.push(iconGlyph(t.icon, ix+23, iy+23, t.accent));
  s.push(text(cx+cw-26, iy+20, t.n, {size: 30, w: 800, fill: 'rgba(255,255,255,0.10)', anchor: 'end', ff: MONO}));
  // pill tag
  s.push(rrect(ix, iy+58, 116, 26, 13, {fill: 'none', stroke: 'rgba(255,255,255,0.14)', sw: 1}));
  s.push(text(ix+15, iy+76, t.tag.toUpperCase(), {size: 12.5, w: 700, fill: t.accent, ls: 1.5, ff: MONO}));

  // title
  const ty = cy + 168;
  if (t.title.length > 14) {
    const parts = t.title.split(' ');
    s.push(text(cx+30, ty, parts.slice(0,1).join(' '), {size: 27, w: 800}));
    s.push(text(cx+30, ty+32, parts.slice(1).join(' '), {size: 27, w: 800}));
  } else {
    s.push(text(cx+30, ty+14, t.title, {size: 27, w: 800}));
  }

  // description
  wrap(t.desc, cw - 60).forEach((ln, i) => {
    s.push(text(cx+30, ty+58 + i*23, ln, {size: 15.5, w: 400, fill: C.muted}));
  });

  // illustration zone
  const vz = {x: cx+24, y: cy+300, w: cw-48, h: ch-300-58};
  s.push(rrect(vz.x, vz.y, vz.w, vz.h, 18, {fill: 'rgba(4,6,16,0.55)', stroke: 'rgba(255,255,255,0.06)', sw: 1}));
  s.push(`<clipPath id="vz${t.n}"><rect x="${vz.x}" y="${vz.y}" width="${vz.w}" height="${vz.h}" rx="18"/></clipPath>`);
  s.push(`<g clip-path="url(#vz${t.n})">`);
  s.push(illustration(t.icon, vz, t));
  s.push(`</g>`);

  // pills row
  let px = cx + 30;
  const pyy = cy + ch - 26;
  t.pills.forEach(p => {
    const pw = 14 + p.length * 7.2;
    s.push(rrect(px, pyy-20, pw, 26, 13, {fill: 'rgba(255,255,255,0.05)', stroke: 'rgba(255,255,255,0.10)', sw: 1}));
    s.push(text(px+pw/2, pyy-2, p, {size: 12.5, w: 600, fill: '#c5cfee', anchor: 'middle'}));
    px += pw + 8;
  });
  return s.join('\n');
}

function iconGlyph(kind, cx, cy, col) {
  if (kind === 'type') {
    return `<g stroke="${col}" stroke-width="2.4" fill="none" stroke-linecap="round">
      <path d="M${cx-9} ${cy-7} H${cx+9} M${cx} ${cy-7} V${cy+8}"/>
      <path d="M${cx-9} ${cy+8} q9 -6 18 0" stroke-opacity="0.6"/></g>`;
  }
  if (kind === 'dither') {
    let d = `<g fill="${col}">`;
    for (let i=0;i<4;i++) for (let j=0;j<4;j++){ const o=(i+j)%2?0.85:0.3; d+=`<circle cx="${cx-8+i*5.3}" cy="${cy-8+j*5.3}" r="1.7" opacity="${o}"/>`; }
    return d+`</g>`;
  }
  if (kind === 'curve') {
    return `<path d="M${cx-10} ${cy+9} C ${cx-4} ${cy+9}, ${cx-2} ${cy-9}, ${cx+10} ${cy-9}" fill="none" stroke="${col}" stroke-width="2.4" stroke-linecap="round"/><circle cx="${cx-10}" cy="${cy+9}" r="2.4" fill="${col}"/><circle cx="${cx+10}" cy="${cy-9}" r="2.4" fill="${col}"/>`;
  }
  // particles
  let d = `<g fill="${col}">`;
  const pts = [[-8,-6],[6,-8],[9,5],[-6,7],[0,0]];
  pts.forEach(p=> d+=`<circle cx="${cx+p[0]}" cy="${cy+p[1]}" r="2" />`);
  d += `</g><g stroke="${col}" stroke-width="1" stroke-opacity="0.5">`;
  d += `<line x1="${cx-8}" y1="${cy-6}" x2="${cx}" y2="${cy}"/><line x1="${cx+6}" y1="${cy-8}" x2="${cx}" y2="${cy}"/><line x1="${cx+9}" y1="${cy+5}" x2="${cx}" y2="${cy}"/>`;
  return d+`</g>`;
}

function illustration(kind, z, t) {
  const cx = z.x + z.w/2, cy = z.y + z.h/2;
  let s = [];
  if (kind === 'type') {
    // wavy baseline with letters
    const amp = 16, n = 60;
    let path = '';
    for (let i=0;i<=n;i++){ const px = z.x+12 + (z.w-24)*i/n; const py = cy + amp*Math.sin(i/n*Math.PI*3); path += (i?'L':'M')+px.toFixed(1)+' '+py.toFixed(1)+' '; }
    s.push(`<path d="${path}" fill="none" stroke="url(#cyanV)" stroke-width="2.4" opacity="0.9"/>`);
    s.push(`<path d="${path}" fill="none" stroke="${C.cyan}" stroke-width="6" opacity="0.18" filter="url(#soft2)"/>`);
    // letters riding wave
    const letters = ['A','a','B','g','T','y'];
    letters.forEach((L,i)=>{ const ix = z.x+30 + i*(z.w-60)/(letters.length-1); const t2=(ix-z.x-12)/(z.w-24)*n; const iy = cy + amp*Math.sin(t2/n*Math.PI*3); s.push(text(ix, iy-22, L, {size: 30+ (i%2?6:0), w: 800, fill: i%2?C.cyan:'#dbe7ff', anchor:'middle'})); s.push(`<circle cx="${ix}" cy="${iy}" r="3" fill="${C.cyan}"/>`); });
    // small caret/cursor
    s.push(`<rect x="${z.x+z.w-34}" y="${cy+24}" width="3" height="20" fill="${C.cyan}"/>`);
  }
  else if (kind === 'dither') {
    // dithered sphere via halftone dots
    const R = Math.min(z.w, z.h)*0.34;
    s.push(`<circle cx="${cx}" cy="${cy}" r="${R}" fill="url(#accent)" opacity="0.18"/>`);
    let dots = `<g fill="${C.cyan}">`;
    const step = 7;
    for (let yy=-R; yy<=R; yy+=step) for (let xx=-R; xx<=R; xx+=step) {
      const dist = Math.sqrt(xx*xx+yy*yy); if (dist>R) continue;
      // shading: darker (bigger dots) on lower-right
      const shade = (xx + yy)/(2*R); // -1..1
      const rad = Math.max(0.3, 2.6*(0.5 - shade));
      if (rad < 0.5) continue;
      const op = 0.35 + 0.55*(0.5 - shade);
      dots += `<circle cx="${(cx+xx).toFixed(1)}" cy="${(cy+yy).toFixed(1)}" r="${rad.toFixed(2)}" opacity="${op.toFixed(2)}"/>`;
    }
    dots += `</g>`;
    s.push(dots);
    s.push(`<circle cx="${cx}" cy="${cy}" r="${R}" fill="none" stroke="${C.cyan}" stroke-width="1.2" opacity="0.5"/>`);
    s.push(`<circle cx="${cx-R*0.35}" cy="${cy-R*0.4}" r="${R*0.5}" fill="url(#orbHi)" opacity="0.5"/>`);
  }
  else if (kind === 'curve') {
    // smooth 3D orb + motion curve
    const oR = Math.min(z.w,z.h)*0.24;
    const ox = z.x + z.w*0.66, oy = z.y + z.h*0.4;
    // motion curve
    const cpath = `M${z.x+18} ${z.y+z.h-22} C ${z.x+z.w*0.3} ${z.y+z.h-26}, ${z.x+z.w*0.34} ${z.y+24}, ${ox} ${oy}`;
    s.push(`<path d="${cpath}" fill="none" stroke="url(#violetV)" stroke-width="2.4" stroke-dasharray="1 0" opacity="0.9"/>`);
    s.push(`<path d="${cpath}" fill="none" stroke="${C.violet}" stroke-width="7" opacity="0.16" filter="url(#soft2)"/>`);
    // ghost trail orbs
    [[0.0,0.10],[0.18,0.18],[0.4,0.32]].forEach(([f,op])=>{ const gx = z.x+18 + (ox-(z.x+18))*f; const gy = (z.y+z.h-22) + (oy-(z.y+z.h-22))*f; s.push(`<circle cx="${gx}" cy="${gy}" r="${oR*0.6}" fill="url(#orb)" opacity="${op}"/>`); });
    // node dots on curve
    s.push(`<circle cx="${z.x+18}" cy="${z.y+z.h-22}" r="3.5" fill="${C.violet}"/>`);
    // main orb
    s.push(`<circle cx="${ox}" cy="${oy}" r="${oR}" fill="url(#orb)"/>`);
    s.push(`<circle cx="${ox}" cy="${oy}" r="${oR}" fill="url(#orbHi)"/>`);
    s.push(`<ellipse cx="${ox}" cy="${oy+oR*0.9}" rx="${oR*0.9}" ry="${oR*0.22}" fill="#000" opacity="0.25" filter="url(#soft2)"/>`);
  }
  else {
    // particles network + cursor trail
    const N = 26;
    const pts = [];
    for (let i=0;i<N;i++) pts.push([z.x+10+ r(0,1)*(z.w-20), z.y+10 + r(0,1)*(z.h-20)]);
    // links
    let lines = `<g stroke="${C.magenta}" stroke-width="1">`;
    for (let i=0;i<N;i++) for (let j=i+1;j<N;j++){ const dx=pts[i][0]-pts[j][0], dy=pts[i][1]-pts[j][1]; const d=Math.sqrt(dx*dx+dy*dy); if (d<58){ lines += `<line x1="${pts[i][0].toFixed(1)}" y1="${pts[i][1].toFixed(1)}" x2="${pts[j][0].toFixed(1)}" y2="${pts[j][1].toFixed(1)}" stroke-opacity="${(0.4*(1-d/58)).toFixed(2)}"/>`; } }
    lines += `</g>`;
    s.push(lines);
    pts.forEach((p,i)=>{ const rr = r(1.3,2.8); const col = i%3===0?C.cyan:(i%3===1?C.violet:C.magenta); s.push(`<circle cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="${rr.toFixed(1)}" fill="${col}"/>`); });
    // cursor + trail
    const curx = z.x+z.w*0.72, cury = z.y+z.h*0.6;
    [0.0,0.12,0.26,0.42].forEach((f,i)=>{ s.push(`<circle cx="${curx - f*60}" cy="${cury - f*30}" r="${4-i*0.7}" fill="${C.magenta}" opacity="${0.5-i*0.1}"/>`); });
    s.push(`<path d="M${curx} ${cury} l0 17 l5 -5 l4 8 l3 -1.5 l-4 -8 l7 0 z" fill="#ffffff" stroke="${C.magenta}" stroke-width="1"/>`);
  }
  return s.join('\n');
}

function wrap(str, maxw) {
  const words = str.split(' '); const lines=[]; let cur='';
  const cpl = Math.floor(maxw/8.0);
  words.forEach(w=>{ if ((cur+' '+w).trim().length>cpl){ lines.push(cur.trim()); cur=w; } else cur=(cur+' '+w).trim(); });
  if (cur) lines.push(cur);
  return lines;
}

// connectors between cards
tools.forEach((t, i) => {
  const cx = PAD + i*(cw+gap);
  if (i < 3) {
    const lx = cx + cw + 2, rx = cx + cw + gap - 2, my = cardsY + ch*0.5;
    P(`<line x1="${lx}" y1="${my}" x2="${rx}" y2="${my}" stroke="url(#accent)" stroke-width="2.2"/>`);
    P(`<line x1="${lx}" y1="${my}" x2="${rx}" y2="${my}" stroke="${C.cyan}" stroke-width="6" opacity="0.2" filter="url(#soft2)"/>`);
    P(`<path d="M${rx-7} ${my-5} L${rx} ${my} L${rx-7} ${my+5}" fill="none" stroke="${C.violet}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>`);
    P(`<circle cx="${(lx+rx)/2}" cy="${my}" r="3" fill="${C.cyan}"/>`);
  }
});
// draw cards on top
tools.forEach((t, i) => P(card(PAD + i*(cw+gap), t)));

// ================= FLOW DOWN =================
const flowY = cardsY + ch;
const outTop = flowY + 110;
// converging lines from each card to center funnel
const fcx = W/2;
tools.forEach((t,i)=>{
  const sx = PAD + i*(cw+gap) + cw/2;
  const sy = flowY + 6;
  const my = flowY + 56;
  P(`<path d="M${sx} ${sy} C ${sx} ${sy+34}, ${fcx} ${my-10}, ${fcx} ${my+18}" fill="none" stroke="url(#accent)" stroke-width="1.8" opacity="0.55"/>`);
  P(`<circle cx="${sx}" cy="${sy}" r="3" fill="${t.accent}"/>`);
});
// merge node
P(`<circle cx="${fcx}" cy="${flowY+74}" r="34" fill="url(#glowViolet)"/>`);
P(rrect(fcx-90, flowY+58, 180, 34, 17, {fill:'url(#glassHi)', stroke:'rgba(255,255,255,0.16)', sw:1}));
P(text(fcx, flowY+80, 'COMPILE  ↓  BUILD', {size: 14, w:700, fill:'#d7e1ff', anchor:'middle', ls:2, ff:MONO}));
P(`<path d="M${fcx} ${flowY+92} L${fcx} ${outTop-18}" stroke="url(#accent)" stroke-width="2.2"/>`);
P(`<path d="M${fcx-7} ${outTop-25} L${fcx} ${outTop-16} L${fcx+7} ${outTop-25}" fill="none" stroke="${C.cyan}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>`);

// ================= OUTPUT =================
// section label
P(`<line x1="${PAD}" y1="${outTop-2}" x2="${PAD+44}" y2="${outTop-2}" stroke="url(#accent2)" stroke-width="3"/>`);
P(text(PAD+60, outTop+5, 'OUTPUT: MODERN ANIMATED WEB DESIGN', {size: 18, w:800, fill: C.magenta, ls: 3, ff: MONO}));
P(text(W-PAD, outTop+5, 'Live preview', {size: 16, w:600, fill: C.faint, anchor:'end', ff: MONO}));

const ow = INW, oh = 720, ox = PAD, oy = outTop + 30;
// outer panel
P(`<g filter="url(#cardShadow)">`);
P(rrect(ox, oy, ow, oh, 28, {fill:'url(#glassHi)', stroke:'rgba(255,255,255,0.12)', sw:1.3}));
P(`</g>`);
// glow behind
P(`<circle cx="${ox+ow*0.3}" cy="${oy+oh*0.7}" r="260" fill="url(#glowCyan)" opacity="0.5"/>`);
P(`<circle cx="${ox+ow*0.78}" cy="${oy+oh*0.3}" r="260" fill="url(#glowMag)" opacity="0.5"/>`);

// browser chrome
const bx = ox+26, by = oy+24, bw = ow-52, bh = oh-48;
P(`<clipPath id="browClip"><rect x="${bx}" y="${by}" width="${bw}" height="${bh}" rx="18"/></clipPath>`);
P(rrect(bx, by, bw, bh, 18, {fill:'#0a0e20', stroke:'rgba(255,255,255,0.08)', sw:1}));
P(`<g clip-path="url(#browClip)">`);
// hero bg gradient + grid + particles
P(`<rect x="${bx}" y="${by}" width="${bw}" height="${bh}" fill="#080b1c"/>`);
P(`<rect x="${bx}" y="${by}" width="${bw}" height="${bh}" fill="url(#grid)"/>`);
P(`<circle cx="${bx+bw*0.2}" cy="${by+bh*0.85}" r="220" fill="url(#glowCyan)" opacity="0.45"/>`);
P(`<circle cx="${bx+bw*0.85}" cy="${by+bh*0.2}" r="200" fill="url(#glowViolet)" opacity="0.5"/>`);
// subtle particles across hero
{
  let pp = `<g>`;
  for (let i=0;i<70;i++){ const px = bx+ r(0,1)*bw; const py = by+44 + r(0,1)*(bh-44); const rr = r(0.6,2.2); const col=[C.cyan,C.violet,C.magenta,'#ffffff'][Math.floor(r(0,4))]; pp += `<circle cx="${px.toFixed(1)}" cy="${py.toFixed(1)}" r="${rr.toFixed(1)}" fill="${col}" opacity="${r(0.15,0.6).toFixed(2)}"/>`; }
  pp += `</g>`; P(pp);
}

// top browser bar
P(rrect(bx, by, bw, 46, 0, {fill:'rgba(8,11,26,0.85)'}));
P(`<line x1="${bx}" y1="${by+46}" x2="${bx+bw}" y2="${by+46}" stroke="rgba(255,255,255,0.07)" stroke-width="1"/>`);
P(`<circle cx="${bx+24}" cy="${by+23}" r="6" fill="#ff5f57"/>`);
P(`<circle cx="${bx+44}" cy="${by+23}" r="6" fill="#febc2e"/>`);
P(`<circle cx="${bx+64}" cy="${by+23}" r="6" fill="#28c840"/>`);
// url bar
P(rrect(bx+96, by+11, 360, 24, 12, {fill:'rgba(255,255,255,0.06)', stroke:'rgba(255,255,255,0.10)', sw:1}));
P(`<circle cx="${bx+112}" cy="${by+23}" r="4" fill="${C.cyan}"/>`);
P(text(bx+126, by+27, 'studio.pipeline.design', {size: 13.5, w:500, fill:'#aeb9dd', ff:MONO}));
// window nav (right of bar)
['Home','Work','Studio'].forEach((m,i)=>{ P(text(bx+bw-300+i*86, by+27, m, {size:14, w:600, fill: i===0?C.ink:C.muted})); });
P(rrect(bx+bw-58, by+11, 42, 24, 12, {fill:'url(#accent)'}));
P(text(bx+bw-37, by+27, 'Go', {size:13, w:700, fill:'#06121f', anchor:'middle'}));

// ---- hero content ----
const hy = by + 46;
// left column
const lx = bx + 56;
P(rrect(lx, hy+44, 150, 30, 15, {fill:'rgba(255,255,255,0.05)', stroke:'rgba(120,170,255,0.3)', sw:1}));
P(`<circle cx="${lx+18}" cy="${hy+59}" r="4" fill="${C.magenta}"/>`);
P(text(lx+32, hy+64, 'NEW · v2.0', {size:12.5, w:700, fill:'#cdd8ff', ls:1.5, ff:MONO}));

P(`<text x="${lx}" y="${hy+136}" font-family="${SANS}" font-size="58" font-weight="800" fill="url(#titleGrad)" letter-spacing="-1">Design in</text>`);
P(`<text x="${lx}" y="${hy+198}" font-family="${SANS}" font-size="58" font-weight="800" fill="#ffffff" letter-spacing="-1">motion.</text>`);
// animated word underline
P(`<rect x="${lx}" y="${hy+210}" width="220" height="5" rx="2.5" fill="url(#accent)"/>`);

['Typography, shaders, 3D and particles —','composed into one fluid, interactive web','experience that responds to every scroll.'].forEach((ln,i)=>{
  P(text(lx, hy+250+i*26, ln, {size:16, w:400, fill:C.muted}));
});
// CTA buttons
P(rrect(lx, hy+340, 170, 50, 25, {fill:'url(#accent)'}));
P(text(lx+85, hy+371, 'Launch demo', {size:16, w:700, fill:'#06121f', anchor:'middle'}));
P(rrect(lx+186, hy+340, 150, 50, 25, {fill:'none', stroke:'rgba(255,255,255,0.2)', sw:1.4}));
P(text(lx+261, hy+371, 'View code', {size:16, w:600, fill:C.ink, anchor:'middle'}));
// stat row
const stats=[['60','FPS'],['4','Tools'],['∞','Scenes']];
stats.forEach((st,i)=>{ const sxx = lx + i*120; P(text(sxx, hy+440, st[0], {size:30, w:800, fill:C.ink})); P(text(sxx, hy+464, st[1].toUpperCase(), {size:12.5, w:600, fill:C.faint, ls:1.5, ff:MONO})); });

// right column: 3D orb + floating UI cards
const rcx = bx + bw*0.74, rcy = hy + bh*0.46;
// orbit rings
P(`<ellipse cx="${rcx}" cy="${rcy}" rx="190" ry="74" fill="none" stroke="${C.cyan}" stroke-opacity="0.25" stroke-width="1.4" transform="rotate(-18 ${rcx} ${rcy})"/>`);
P(`<ellipse cx="${rcx}" cy="${rcy}" rx="150" ry="58" fill="none" stroke="${C.violet}" stroke-opacity="0.3" stroke-width="1.4" transform="rotate(24 ${rcx} ${rcy})"/>`);
// big 3D orb
const ORB = 96;
P(`<circle cx="${rcx}" cy="${rcy}" r="${ORB+30}" fill="url(#glowViolet)" opacity="0.7"/>`);
P(`<circle cx="${rcx}" cy="${rcy}" r="${ORB}" fill="url(#orb)"/>`);
P(`<circle cx="${rcx}" cy="${rcy}" r="${ORB}" fill="url(#orbHi)"/>`);
P(`<ellipse cx="${rcx}" cy="${rcy+ORB*0.78}" rx="${ORB*0.85}" ry="${ORB*0.2}" fill="#000" opacity="0.3" filter="url(#soft2)"/>`);
// orbit dots
P(`<circle cx="${rcx+180}" cy="${rcy-22}" r="6" fill="${C.cyan}"/>`);
P(`<circle cx="${rcx-150}" cy="${rcy+40}" r="5" fill="${C.magenta}"/>`);

// floating glass UI card (top right)
const f1x = rcx+70, f1y = rcy-150;
P(`<g filter="url(#cardShadow)">`);
P(rrect(f1x, f1y, 170, 92, 16, {fill:'rgba(14,18,38,0.82)', stroke:'rgba(255,255,255,0.12)', sw:1}));
P(`</g>`);
P(`<circle cx="${f1x+24}" cy="${f1y+26}" r="11" fill="url(#cyanV)"/>`);
P(text(f1x+44, f1y+24, 'Smoothie', {size:14, w:700, fill:C.ink}));
P(text(f1x+44, f1y+42, 'easing · 3D', {size:11.5, w:400, fill:C.muted, ff:MONO}));
// mini sparkline
let sl='';
for(let i=0;i<=18;i++){ const px=f1x+18+i*7.3; const py=f1y+74 - 18*(0.5+0.5*Math.sin(i/2)); sl+=(i?'L':'M')+px.toFixed(1)+' '+py.toFixed(1)+' '; }
P(`<path d="${sl}" fill="none" stroke="${C.cyan}" stroke-width="2"/>`);

// floating card bottom-left of orb
const f2x = rcx-210, f2y = rcy+70;
P(`<g filter="url(#cardShadow)">`);
P(rrect(f2x, f2y, 176, 84, 16, {fill:'rgba(14,18,38,0.82)', stroke:'rgba(255,255,255,0.12)', sw:1}));
P(`</g>`);
P(text(f2x+18, f2y+30, 'Particles', {size:14, w:700, fill:C.ink}));
P(text(f2x+18, f2y+50, 'mouse-reactive', {size:11.5, w:400, fill:C.muted, ff:MONO}));
// mini particle cluster
for(let i=0;i<10;i++){ P(`<circle cx="${f2x+120+ r(-26,26)}" cy="${f2y+44+ r(-22,22)}" r="${r(1,2.4).toFixed(1)}" fill="${[C.cyan,C.violet,C.magenta][i%3]}" opacity="0.8"/>`); }

// bottom dither strip card
const f3x = rcx-40, f3y = rcy+150;
P(rrect(f3x, f3y, 150, 56, 14, {fill:'rgba(14,18,38,0.82)', stroke:'rgba(255,255,255,0.12)', sw:1}));
P(text(f3x+16, f3y+24, 'Astrodither', {size:13, w:700, fill:C.ink}));
P(text(f3x+16, f3y+42, 'shader texture', {size:11, w:400, fill:C.muted, ff:MONO}));
{ let dd=`<g fill="${C.cyan}">`; for(let i=0;i<5;i++)for(let j=0;j<3;j++){ const o=(i+j)%2?0.8:0.3; dd+=`<circle cx="${f3x+104+i*8}" cy="${f3y+20+j*9}" r="2" opacity="${o}"/>`; } P(dd+`</g>`); }

// bottom info bar inside hero
P(`<line x1="${bx+40}" y1="${by+bh-58}" x2="${bx+bw-40}" y2="${by+bh-58}" stroke="rgba(255,255,255,0.08)"/>`);
['String Tune','Astrodither','Smoothie','AI Particle Simulator'].forEach((nm,i)=>{
  const sxx = bx+44 + i*((bw-88)/4);
  const col=[C.cyan,C.blue,C.violet,C.magenta][i];
  P(`<circle cx="${sxx+6}" cy="${by+bh-30}" r="4" fill="${col}"/>`);
  P(text(sxx+18, by+bh-25, nm, {size:13.5, w:600, fill:'#c8d2f0'}));
});

P(`</g>`); // end browser clip

// ================= FOOTER =================
const fy = oy + oh + 56;
P(`<line x1="${PAD}" y1="${fy-26}" x2="${W-PAD}" y2="${fy-26}" stroke="rgba(255,255,255,0.08)"/>`);
P(text(PAD, fy, 'Modern Animated Web Design Pipeline', {size:15, w:700, fill:'#c8d2f0'}));
P(text(PAD, fy+24, 'Typography · Visual Style · 3D Motion · Particles', {size:13.5, w:400, fill:C.faint, ff:MONO}));
P(text(W-PAD, fy, 'Premium SaaS Case Study', {size:15, w:700, fill:'#c8d2f0', anchor:'end'}));
P(text(W-PAD, fy+24, 'Crafted for product & portfolio', {size:13.5, w:400, fill:C.faint, anchor:'end', ff:MONO}));

P(`</svg>`);

const svg = out.join('\n');
fs.writeFileSync('pipeline.svg', svg);

const resvg = new Resvg(svg, {
  fitTo: { mode: 'width', value: W * 2 },
  font: { loadSystemFonts: true, defaultFontFamily: 'Liberation Sans' },
  background: '#05060f',
});
const png = resvg.render().asPng();
fs.writeFileSync('pipeline.png', png);
console.log('done', png.length, 'bytes', W*2, 'x', Math.round(H*2));
