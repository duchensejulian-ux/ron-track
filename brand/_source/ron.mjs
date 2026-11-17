// RON TRACK — geometría oficial de Ron.
// Todas las piezas (logo, icono e ilustraciones) salen de este archivo,
// así las proporciones de Ron son idénticas en toda la marca.

export const C = {
  forest: '#203B32',
  deep: '#172C26',
  sage: '#A8B9A1',
  softSage: '#DCE6D8',
  cream: '#F6F3EB',
  white: '#FFFFFF',
  charcoal: '#282D2A',
  gray: '#898E87',
  yellow: '#E9D69B',
};

// ---------------------------------------------------------------------------
// Ron de pie, mirando a la derecha. Lienzo 160 x 80, suelo en y = 72.
// Pivotes para posar las piezas en las ilustraciones:
//   cuello (106,40) · hombros (95,52)/(105,52) · cadera (40,52)/(50,52) · cola (30,38)
// ---------------------------------------------------------------------------
export const P = {
  body: 'M39 31 H97 C108.5 31 118.5 39.5 118 49 C117.5 57.5 109.5 61.5 99.5 61.5 H39 A15.25 15.25 0 0 1 39 31 Z',
  neck: 'M93 34 L113 15 L131.5 29 C125 35 120.5 41.5 118 49.5 L104 51 Z',
  head: 'M112 21 A12 12 0 1 1 136 21 A12 12 0 1 1 112 21 Z',
  snout: 'M124 9.5 C133 10 141 15.5 148.5 22.5 C152.5 26 151.5 31.5 146.5 32 L127 33.5 Z',
  // oreja caída: nace atrás del cráneo y cae por debajo de la mandíbula
  ear: 'M112.5 12 C109 19.5 106.6 28.5 108 35.8 C109.2 42 116.6 43.2 119.6 37.6 C123 31.4 124.2 21 121.8 12 Z',
  // corte en negativo en U: separa la oreja sin cortar el cráneo
  earCut: 'M112.4 14.5 C109 21 106.6 28.5 108 35.8 C109.2 42 116.6 43.2 119.6 37.6 C123 31.4 124.2 21 122.2 14.5',
  eye: { cx: 129.5, cy: 18.5, r: 2.3 },
  tail: 'M29.5 41 C19 38.5 11.5 32 6.8 23.2 C5.9 21.2 8.4 19.8 9.9 21.4 C15.5 27.8 22.5 31.6 31 33.8 Z',
  // patas: [x, yTop, ancho, largo]
  legs: {
    frontNear: [100.5, 50, 9, 22],
    frontFar: [90, 50, 8, 22],
    backNear: [35, 48, 9, 24],
    backFar: [45.5, 48, 8, 24],
  },
  tag: { cx: 121.5, cy: 41.5, r: 4.2 }, // la placa: el "punto de seguimiento"
};

export const legShape = ([x, y, w, h], extra = '') =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${w / 2}"${extra}/>` +
  `<ellipse cx="${x + w * 0.66}" cy="${y + h - 2.3}" rx="${w * 0.6}" ry="2.3"${extra}/>`;

let uid = 0;
export const nextId = (p) => `${p}${++uid}`;

/**
 * Isotipo: silueta sólida de Ron con cortes en negativo (oreja, ojo)
 * y la placa como punto de seguimiento.
 * fill = color de la silueta · tag = color de la placa (null = sin placa)
 */
export function mark({ fill = C.forest, tag = C.yellow, id } = {}) {
  const m = id || nextId('rt-cut-');
  const L = P.legs;
  return `
  <defs>
    <mask id="${m}" maskUnits="userSpaceOnUse" x="-20" y="-20" width="200" height="120">
      <rect x="-20" y="-20" width="200" height="120" fill="#fff"/>
      <path d="${P.earCut}" fill="none" stroke="#000" stroke-width="3.6" stroke-linecap="round"/>
      <circle cx="${P.eye.cx}" cy="${P.eye.cy}" r="${P.eye.r}" fill="#000"/>
      ${tag ? `<circle cx="${P.tag.cx}" cy="${P.tag.cy}" r="${P.tag.r + 1.9}" fill="#000"/>` : ''}
    </mask>
  </defs>
  <g fill="${fill}">
    <g mask="url(#${m})">
      <path d="${P.tail}"/>
      ${legShape(L.backFar)}${legShape(L.frontFar)}
      <path d="${P.body}"/>
      <path d="${P.neck}"/>
      <path d="${P.head}"/>
      <path d="${P.snout}"/>
      <path d="${P.ear}"/>
      ${legShape(L.backNear)}${legShape(L.frontNear)}
    </g>
    ${tag ? `<circle cx="${P.tag.cx}" cy="${P.tag.cy}" r="${P.tag.r}" fill="${tag}"/>` : ''}
  </g>`;
}

export const svg = (w, h, vb, inner, extra = '') =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="${vb}" fill="none"${extra}>${inner}\n</svg>\n`;
