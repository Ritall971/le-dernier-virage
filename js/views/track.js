// Croquis SVG d'un circuit à partir de son tracé réel.
import { CIRCUIT_MAPS } from '../circuit-maps.js';

export const hasTrack = (id) => Boolean(CIRCUIT_MAPS[id]);
export const trackInfo = (id) => CIRCUIT_MAPS[id] || null;

export function trackSvg(id, { color = '#ff2a3c', mini = false } = {}) {
  const t = CIRCUIT_MAPS[id];
  if (!t) return '';
  const pad = mini ? 40 : 70;
  const vb = `${-pad} ${-pad} ${t.w + pad * 2} ${t.h + pad * 2}`;
  // Angle de la ligne de départ, pour poser le damier perpendiculairement au tracé.
  const ang = Math.atan2(t.next[1] - t.start[1], t.next[0] - t.start[0]) * 180 / Math.PI;
  return `<svg class="track ${mini ? 'track--mini' : ''}" viewBox="${vb}" role="img" aria-label="Tracé du circuit" preserveAspectRatio="xMidYMid meet">
    <path class="track__base" d="${t.d}" />
    <path class="track__line" d="${t.d}" pathLength="1000" style="stroke:${color}" />
    ${mini ? '' : `<g transform="translate(${t.start[0]} ${t.start[1]}) rotate(${ang + 90})">
      <rect x="-26" y="-7" width="52" height="14" fill="#f4f1ec"/>
      ${[...Array(6)].map((_, i) => `<rect x="${-26 + i * 8.66}" y="${i % 2 ? 0 : -7}" width="8.66" height="7" fill="#0b0b0c"/>`).join('')}
    </g>`}
  </svg>`;
}
