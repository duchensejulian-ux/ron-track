// RON TRACK — wordmark propio.
// Letras geométricas de trazo constante, dibujadas a mano (no dependen de
// ninguna fuente instalada). Altura de mayúscula = 40 unidades.
// RON va en peso fuerte y TRACK en peso medio con más aire entre letras.
import { nextId } from './ron.mjs';

const H = 40;

// Cada letra: ancho y función que devuelve los trazos (línea central) según el grosor w.
const GLYPHS = {
  R: { w: 28, d: (w) => { const i = w / 2, r = (23 - i) / 2; return `M${i} -2 V42 M${i} ${i} H15 A${r} ${r} 0 0 1 15 23 H${i} M13 23 L27.5 42`; } },
  O: { w: 39, d: (w) => { const i = w / 2; return `M${19.5} ${i} A${19.5 - i} ${20 - i} 0 1 1 19.49 ${i} Z`; } },
  N: { w: 31, d: (w) => { const i = w / 2; return `M${i} 42 V-2 M${31 - i} -2 V42 M${i - 1} -3 L${31 - i + 1} 43`; } },
  T: { w: 28, d: (w) => { const i = w / 2; return `M-1 ${i} H29 M14 0 V42`; } },
  A: { w: 33, d: () => `M0 44 L16.5 -3 L33 44 M6 29 H27` },
  C: { w: 35, d: (w) => { const i = w / 2, rx = 19.5 - i, ry = 20 - i, a = 42 * Math.PI / 180;
    const x1 = 19.5 + rx * Math.cos(a), y1 = 20 - ry * Math.sin(a), y2 = 20 + ry * Math.sin(a);
    return `M${x1.toFixed(2)} ${y1.toFixed(2)} A${rx} ${ry} 0 1 0 ${x1.toFixed(2)} ${y2.toFixed(2)}`; } },
  K: { w: 28, d: (w) => { const i = w / 2; return `M${i} -2 V42 M29 -2 L${i} 27 M11.5 19 L30 42`; } },
};

function word(text, { x = 0, w = 6, gap = 5, color }) {
  let cx = x, out = '';
  for (const ch of text) {
    const g = GLYPHS[ch];
    const id = nextId('rt-g-');
    out += `<clipPath id="${id}"><rect x="0" y="0" width="${g.w}" height="${H}"/></clipPath>` +
      `<path clip-path="url(#${id})" transform="translate(${cx} 0)" d="${g.d(w)}" stroke="${color}" stroke-width="${w}" fill="none" stroke-linejoin="miter" stroke-miterlimit="12"/>`;
    cx += g.w + gap;
  }
  return { svg: out, width: cx - gap };
}

/** Devuelve { svg, width, height } del wordmark completo en altura 40. */
export function wordmark({ color = '#203B32', color2, bold = 6.2, light = 4.2 } = {}) {
  const ron = word('RON', { w: bold, gap: 6, color });
  const track = word('TRACK', { x: ron.width + 17, w: light, gap: 8.5, color: color2 || color });
  // track.width ya incluye el desplazamiento inicial (x)
  return { svg: ron.svg + track.svg, width: track.width, height: H };
}
