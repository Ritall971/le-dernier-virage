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
