// RON TRACK — ilustraciones oficiales de Ron.
// Cada pose reutiliza exactamente las mismas piezas de ron.mjs; solo cambian
// las rotaciones de cabeza, patas y cola. Así Ron nunca cambia de proporciones.
import { P, C, legShape, nextId } from './ron.mjs';

const GROUND = 72;
const rad = (d) => (d * Math.PI) / 180;
const rot = ([x, y], [px, py], deg) => {
  const a = rad(deg), dx = x - px, dy = y - py;
  return [px + dx * Math.cos(a) - dy * Math.sin(a), py + dx * Math.sin(a) + dy * Math.cos(a)];
};
const r = (deg, [x, y]) => `rotate(${deg} ${x} ${y})`;

const PIV = {
  neck: [104, 40],
  tail: [30, 38],
};
const legPivot = ([x, y, w]) => [x + w / 2, y + w / 2];

function leg(def, deg = 0, fill = C.forest, len) {
  const d = len ? [def[0], def[1], def[2], len] : def;
  return `<g transform="${r(deg, legPivot(def))}" fill="${fill}">${legShape(d)}</g>`;
}

function head({ deg = 0, eyes = 'open' } = {}) {
  const eye = eyes === 'open'
    ? `<circle cx="${P.eye.cx}" cy="${P.eye.cy}" r="${P.eye.r}" fill="${C.cream}"/>`
    : eyes === 'happy'
      ? `<path d="M${P.eye.cx - 2.8} ${P.eye.cy + 0.9} Q${P.eye.cx} ${P.eye.cy - 2.6} ${P.eye.cx + 2.8} ${P.eye.cy + 0.9}" stroke="${C.cream}" stroke-width="1.7" stroke-linecap="round" fill="none"/>`
      : `<path d="M${P.eye.cx - 2.8} ${P.eye.cy} Q${P.eye.cx} ${P.eye.cy + 2.6} ${P.eye.cx + 2.8} ${P.eye.cy}" stroke="${C.cream}" stroke-width="1.7" stroke-linecap="round" fill="none"/>`;
  return `<g transform="${r(deg, PIV.neck)}">
    <path d="${P.neck}" fill="${C.forest}"/>
    <path d="${P.head}" fill="${C.forest}"/>
    <path d="${P.snout}" fill="${C.forest}"/>
    <circle cx="149.2" cy="25.6" r="2.6" fill="${C.deep}"/>
    ${eye}
    <path d="${P.ear}" fill="${C.deep}"/>
    <circle cx="${P.tag.cx}" cy="${P.tag.cy}" r="${P.tag.r}" fill="${C.yellow}"/>
  </g>`;
}

const tail = (deg = 0) => `<path transform="${r(deg, PIV.tail)}" d="${P.tail}" fill="${C.forest}"/>`;
const body = () => `<path d="${P.body}" fill="${C.forest}"/>`;
const shadow = (cx, w, o = 1) => `<ellipse cx="${cx}" cy="${GROUND + 1.2}" rx="${w}" ry="3" fill="${C.softSage}" opacity="${o}"/>`;

// Elementos de marca reutilizables en las escenas
const spark = (x, y, s = 1, fill = C.yellow) =>
  `<path transform="translate(${x} ${y}) scale(${s})" d="M0 -6 C0.6 -1.6 1.6 -0.6 6 0 C1.6 0.6 0.6 1.6 0 6 C-0.6 1.6 -1.6 0.6 -6 0 C-1.6 -0.6 -0.6 -1.6 0 -6 Z" fill="${fill}"/>`;
const dot = (x, y, rr = 1.6, fill = C.sage) => `<circle cx="${x}" cy="${y}" r="${rr}" fill="${fill}"/>`;
const zz = (x, y, s) => `<path transform="translate(${x} ${y}) scale(${s})" d="M0 0 H7 L0 8 H7" stroke="${C.sage}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`;

const L = P.legs;

export const POSES = {
  // De pie, tranquilo: la pose base del isotipo
  standing: () => `
    ${shadow(78, 62)}
    ${tail(4)}
    ${leg(L.backFar, 0, C.deep)}${leg(L.frontFar, 0, C.deep)}
    ${body()}${head()}
    ${leg(L.backNear)}${leg(L.frontNear)}`,

  // Caminando: patas en zancada, cola arriba, rastro de recorrido detrás
  walking: () => `
    <path d="M-34 ${GROUND + 1} H20" stroke="${C.sage}" stroke-width="2" stroke-linecap="round" stroke-dasharray="0.1 7"/>
    ${dot(-40, GROUND + 1, 3.2, C.yellow)}
    ${shadow(80, 60)}
    <g transform="translate(0 -1.5)">
      ${tail(16)}
      ${leg(L.backFar, -17, C.deep)}${leg(L.frontFar, 15, C.deep)}
      ${body()}${head({ deg: -4 })}
      ${leg(L.backNear, 16)}${leg(L.frontNear, -17)}
    </g>`,

  // Descansando: tumbado, cabeza alerta, patas delanteras estiradas
  resting: () => `
    ${shadow(84, 66)}
    <g transform="translate(0 10)">
      ${tail(-44)}
      ${leg(L.frontFar, -86, C.deep, 30)}
      ${body()}${head({ deg: 2 })}
      <ellipse cx="44" cy="52" rx="15" ry="9.5" fill="${C.forest}"/>
      ${leg(L.backNear, -84)}
      ${leg(L.frontNear, -88, C.forest, 31)}
    </g>`,

  // Durmiendo: tumbado, hocico sobre las patas, ojos cerrados
  sleeping: () => { const cp = nextId('rt-floor-'); return `
    <clipPath id="${cp}"><rect x="60" y="-40" width="140" height="${GROUND - 10 + 40}"/></clipPath>
    ${shadow(84, 66)}
    ${zz(150, 30, 1)}${zz(162, 18, 0.75)}
    <g transform="translate(0 10)">
      ${tail(-50)}
      ${leg(L.frontFar, -86, C.deep, 30)}
      ${body()}
      <ellipse cx="44" cy="52" rx="15" ry="9.5" fill="${C.forest}"/>
      ${leg(L.backNear, -84)}
      <g clip-path="url(#${cp})"><g transform="translate(4 16)">${head({ deg: 10, eyes: 'closed' })}</g></g>
    </g>`; },

  // Sentado: grupa en el suelo, pecho erguido, patas delanteras rectas
  sitting: () => {
    const ang = -33, pivot = [40, 61.5];
    const shoulderN = rot([105, 54], pivot, ang), shoulderF = rot([94, 54], pivot, ang);
    const dy = 9; // baja la grupa hasta el suelo
    const frontLeg = ([sx, sy], w, fill) => {
      const top = sy + dy - 4, len = GROUND - top;
      return `<g fill="${fill}">${legShape([sx - w / 2, top, w, len])}</g>`;
    };
    return `
    ${shadow(72, 54)}
    ${frontLeg(shoulderF, 8, C.deep)}
    <g transform="translate(0 ${dy})">
      ${tail(-62)}
      <g transform="${r(ang, pivot)}">${body()}${head({ deg: 28 })}</g>
      <ellipse cx="43" cy="53" rx="14.5" ry="10" fill="${C.forest}"/>
      <g fill="${C.forest}">${legShape([40, GROUND - dy - 8, 22, 8])}</g>
    </g>
    ${frontLeg(shoulderN, 9, C.forest)}`;
  },

  // Celebrando: salto con las cuatro patas en el aire, cola arriba, destellos
  celebrating: () => `
    ${shadow(80, 44, 0.8)}
    ${spark(150, 2, 0.9)}${spark(166, 20, 0.6, C.sage)}${spark(96, -2, 0.55)}
    ${dot(138, -6, 1.8, C.sage)}${dot(170, 2, 1.4, C.yellow)}${dot(112, 6, 1.3, C.sage)}
    <g transform="translate(0 -15) ${r(-7, [80, 46])}">
      ${tail(28)}
      ${leg(L.backFar, 38, C.deep)}${leg(L.frontFar, -40, C.deep)}
      ${body()}${head({ deg: -10, eyes: 'happy' })}
      ${leg(L.backNear, 46)}${leg(L.frontNear, -48)}
    </g>`,
};

/** Escena completa de una pose, en un lienzo fijo (misma escala para todas). */
export function poseScene(name, { bg = null } = {}) {
  const vb = '-50 -30 240 112';
  return { vb, inner: `${bg ? `<rect x="-50" y="-30" width="240" height="112" fill="${bg}"/>` : ''}${POSES[name]()}` };
}
