// Petit graphique en barres (SVG) : points marqués à chaque manche.
import { esc } from '../fmt.js';

export function pointsChart(items, color) {
  const W = 760, H = 220, padL = 34, padB = 26, padT = 18, padR = 8;
  const max = Math.max(10, ...items.map((i) => i.value));
  const top = Math.ceil(max / 5) * 5;
  const step = (W - padL - padR) / Math.max(items.length, 1);
  const bw = Math.min(26, step * 0.62);
  const y = (v) => H - padB - (v / top) * (H - padB - padT);
  const ticks = [0, top / 2, top];

  return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Points par course">
    ${ticks.map((t) => `<line x1="${padL}" x2="${W - padR}" y1="${y(t)}" y2="${y(t)}" stroke="#ffffff1a"/><text x="${padL - 6}" y="${y(t) + 4}" text-anchor="end">${t}</text>`).join('')}
    ${items.map((it, i) => {
      const x = padL + i * step + (step - bw) / 2;
      const h = Math.max(0, y(0) - y(it.value));
      return `<g><title>${esc(it.title)} : ${it.value} pts</title>
        <polygon points="${x + 4},${y(it.value)} ${x + bw + 4},${y(it.value)} ${x + bw},${y(0)} ${x},${y(0)}" fill="${color}" opacity="${it.value ? 1 : 0}"/>
        ${it.value ? `<text class="lbl" x="${x + bw / 2 + 2}" y="${y(it.value) - 5}" text-anchor="middle">${it.value}</text>` : ''}
        <text x="${x + bw / 2}" y="${H - 8}" text-anchor="middle">${esc(it.label)}</text>
        ${h === 0 ? `<line x1="${x}" x2="${x + bw}" y1="${y(0)}" y2="${y(0)}" stroke="#ffffff40" stroke-width="2"/>` : ''}
      </g>`;
    }).join('')}
  </svg>`;
}
