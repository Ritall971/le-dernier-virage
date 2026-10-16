// Couleurs des écuries, par identifiant Jolpica. OpenF1 fournit aussi une couleur qui prend le relais si besoin.
const COLORS = {
  mclaren: '#ff8000',
  ferrari: '#e8002d',
  mercedes: '#27f4d2',
  red_bull: '#3671c6',
  aston_martin: '#229971',
  alpine: '#ff87bc',
  williams: '#64c4ff',
  rb: '#6692ff',
  haas: '#b6babd',
  sauber: '#52e252',
  audi: '#c1c7cc',
  cadillac: '#d9b45a',
};

const ALIASES = [
  [/mclaren/i, 'mclaren'],
  [/ferrari/i, 'ferrari'],
  [/mercedes/i, 'mercedes'],
  [/racing bulls|visa|alphatauri|^rb$/i, 'rb'],
  [/red bull/i, 'red_bull'],
  [/aston/i, 'aston_martin'],
  [/alpine/i, 'alpine'],
  [/williams/i, 'williams'],
  [/haas/i, 'haas'],
  [/audi/i, 'audi'],
  [/sauber|kick/i, 'sauber'],
  [/cadillac/i, 'cadillac'],
];

export function teamKey(idOrName = '') {
  if (COLORS[idOrName]) return idOrName;
  for (const [re, key] of ALIASES) if (re.test(idOrName)) return key;
  return idOrName;
}

export function teamColor(idOrName, fallback) {
  const c = COLORS[teamKey(idOrName)];
  if (c) return c;
  if (fallback) return fallback.startsWith('#') ? fallback : `#${fallback}`;
  return '#777777';
}

// Logos officiels (version blanche, fond transparent), chargés depuis le site de la F1 comme les photos des pilotes.
const LOGOS = {
  mclaren: [2026, 'mclaren'],
  ferrari: [2026, 'ferrari'],
  mercedes: [2026, 'mercedes'],
  red_bull: [2026, 'redbullracing'],
  aston_martin: [2026, 'astonmartin'],
  alpine: [2026, 'alpine'],
  williams: [2026, 'williams'],
  rb: [2026, 'racingbulls'],
  haas: [2026, 'haasf1team'],
  sauber: [2025, 'kicksauber'],
  audi: [2026, 'audi'],
  cadillac: [2026, 'cadillac'],
};

export function teamLogo(idOrName, size = 128) {
  const l = LOGOS[teamKey(idOrName)];
  if (!l) return '';
  const [year, slug] = l;
  return `https://media.formula1.com/image/upload/c_fit,h_${size}/q_auto/v1740000000/common/f1/${year}/${slug}/${year}${slug}logowhite.webp`;
}
