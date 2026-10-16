// Mise en forme (dates en français, à l'heure locale du visiteur) et petites aides HTML.

export function esc(v) {
  return String(v ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

// Combine la date et l'heure Jolpica ("2026-10-25", "19:00:00Z") en objet Date.
export function toDate(date, time) {
  if (!date) return null;
  return new Date(`${date}T${time || '12:00:00Z'}`);
}

const dayFmt = new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'short' });
const longFmt = new Intl.DateTimeFormat('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
const timeFmt = new Intl.DateTimeFormat('fr-FR', { hour: '2-digit', minute: '2-digit' });
const fullFmt = new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });

export const fmtDay = (d) => (d ? dayFmt.format(d) : '');
export const fmtLong = (d) => (d ? longFmt.format(d) : '');
export const fmtTime = (d) => (d ? timeFmt.format(d) : '');
export const fmtFull = (d) => (d ? fullFmt.format(d) : '');

export function fmtRange(start, end) {
  if (!start) return fmtDay(end);
  if (start.getMonth() === end.getMonth()) return `${start.getDate()}–${fmtDay(end)}`;
  return `${fmtDay(start)} – ${fmtDay(end)}`;
}

export function countdown(target, now = new Date()) {
  let s = Math.max(0, Math.floor((target - now) / 1000));
  const d = Math.floor(s / 86400); s -= d * 86400;
  const h = Math.floor(s / 3600); s -= h * 3600;
  const m = Math.floor(s / 60);
  const pad = (n) => String(n).padStart(2, '0');
  return d > 0 ? `${d} j ${pad(h)} h ${pad(m)}` : `${pad(h)} h ${pad(m)} min`;
}

export function age(dob) {
  if (!dob) return '';
  const b = new Date(dob);
  const n = new Date();
  let a = n.getFullYear() - b.getFullYear();
  if (n < new Date(n.getFullYear(), b.getMonth(), b.getDate())) a -= 1;
  return a;
}

// Secondes (OpenF1) en "1:32.456"
export function lapTime(sec) {
  if (sec == null || Number.isNaN(sec)) return '';
  const m = Math.floor(sec / 60);
  const s = (sec - m * 60).toFixed(3).padStart(6, '0');
  return m ? `${m}:${s}` : s;
}

export function gap(v) {
  if (v == null) return '';
  if (typeof v === 'string') return v;
  return `+${v.toFixed(3)}`;
}

const NAT = {
  British: 'Britannique', Dutch: 'Néerlandais', Monegasque: 'Monégasque', Spanish: 'Espagnol', Mexican: 'Mexicain',
  Australian: 'Australien', French: 'Français', German: 'Allemand', Finnish: 'Finlandais', Canadian: 'Canadien',
  Japanese: 'Japonais', Thai: 'Thaïlandais', Danish: 'Danois', Chinese: 'Chinois', American: 'Américain',
  Italian: 'Italien', Brazilian: 'Brésilien', Argentine: 'Argentin', Argentinian: 'Argentin', 'New Zealander': 'Néo-Zélandais',
  Austrian: 'Autrichien', Swiss: 'Suisse', Belgian: 'Belge', Polish: 'Polonais', Swedish: 'Suédois',
};
export const nat = (n) => NAT[n] || n || '';

const COUNTRY = {
  Australia: 'Australie', China: 'Chine', Japan: 'Japon', Bahrain: 'Bahreïn', 'Saudi Arabia': 'Arabie saoudite',
  USA: 'États-Unis', 'United States': 'États-Unis', Canada: 'Canada', Monaco: 'Monaco', Spain: 'Espagne',
  Austria: 'Autriche', UK: 'Royaume-Uni', 'United Kingdom': 'Royaume-Uni', Belgium: 'Belgique', Hungary: 'Hongrie',
  Netherlands: 'Pays-Bas', Italy: 'Italie', Azerbaijan: 'Azerbaïdjan', Singapore: 'Singapour', Mexico: 'Mexique',
  Brazil: 'Brésil', Qatar: 'Qatar', UAE: 'Émirats arabes unis', 'United Arab Emirates': 'Émirats arabes unis',
  Malaysia: 'Malaisie', Portugal: 'Portugal', France: 'France',
};
export const country = (c) => COUNTRY[c] || c || '';

// "Australian Grand Prix" -> "GP d'Australie" serait fragile ; on garde le nom officiel en raccourcissant "Grand Prix".
export const raceName = (n = '') => n.replace(/Grand Prix/i, 'GP');

const STATUS = {
  Finished: 'Arrivé', Lapped: 'Doublé', Retired: 'Abandon', Disqualified: 'Disqualifié', 'Did not start': 'Non partant',
  Accident: 'Accident', Collision: 'Accrochage', Engine: 'Moteur', Gearbox: 'Boîte de vitesses', Hydraulics: 'Hydraulique',
  Brakes: 'Freins', Suspension: 'Suspension', Withdrew: 'Retrait', 'Power Unit': 'Moteur', 'Collision damage': 'Dégâts',
};
export function status(s = '') {
  if (/^\+\d+ Laps?$/.test(s)) return s.replace('Laps', 'tours').replace('Lap', 'tour');
  return STATUS[s] || s;
}
