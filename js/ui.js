// Morceaux d'interface réutilisés par plusieurs pages.
import { esc, fmtRange, fmtDay, raceName, country } from './fmt.js';
import { teamColor } from './teams.js';
import { weekendStart, raceStart, isSprintWeekend } from './season.js';

export const kerb = () => '<div class="kerb" aria-hidden="true"></div>';

export function pageHead(title, sub = '') {
  return `<div class="wrap page-head"><h1>${esc(title)}</h1>${sub ? `<p>${esc(sub)}</p>` : ''}</div>`;
}

export function sectionHead(title, link, linkLabel) {
  return `<div class="section__head"><h2>${esc(title)}</h2>${link ? `<a class="link-more" href="${link}">${esc(linkLabel)} →</a>` : ''}</div>`;
}

// Carte « livrée » d'un pilote (podium du classement, liste des pilotes…)
export function driverCard({ driver, team, pos, stat, statLabel = 'PTS', photo }) {
  const c = teamColor(team?.constructorId || team?.name);
  const num = driver.permanentNumber || '';
  return `<a class="card" href="#/pilotes/${esc(driver.driverId)}" style="--c:${c}">
    ${photo ? `<img class="card__photo" src="${esc(photo)}" alt="" loading="lazy" onerror="this.remove()">` : `<div class="card__num" aria-hidden="true">${esc(num)}</div>`}
    ${pos ? `<div class="card__pos">P${esc(pos)}</div>` : `<div class="card__pos">#${esc(num)}</div>`}
    <div class="card__name"><small>${esc(driver.givenName)}</small>${esc(driver.familyName)}</div>
    <div class="card__team">${esc(team?.name || '')}</div>
    ${stat != null ? `<div class="card__stat">${esc(stat)}<small>${esc(statLabel)}</small></div>` : ''}
  </a>`;
}

export function teamCard({ team, pos, stat, statLabel = 'PTS', drivers = [] }) {
  const c = teamColor(team.constructorId || team.name);
  return `<a class="card" href="#/ecuries/${esc(team.constructorId)}" style="--c:${c}">
    <div class="card__num" aria-hidden="true">${pos ? esc(pos) : ''}</div>
    <div class="card__pos">${pos ? `P${esc(pos)}` : esc(team.nationality || '')}</div>
    <div class="card__name">${esc(team.name)}</div>
    <div class="card__team">${drivers.map((d) => esc(d.familyName)).join(' · ')}</div>
    ${stat != null ? `<div class="card__stat">${esc(stat)}<small>${esc(statLabel)}</small></div>` : ''}
  </a>`;
}

export function driverRow(s) {
  const team = s.Constructors?.[s.Constructors.length - 1];
  const c = teamColor(team?.constructorId || team?.name);
  return `<a class="row" href="#/pilotes/${esc(s.Driver.driverId)}" style="--c:${c}">
    <div class="row__pos">${esc(s.position ?? s.positionText ?? '–')}</div>
    <div class="row__name">${esc(s.Driver.familyName)}<span>${esc(team?.name || '')}</span></div>
    <div class="row__extra">${Number(s.wins) ? `${esc(s.wins)} victoire${Number(s.wins) > 1 ? 's' : ''}` : ''}</div>
    <div class="row__pts">${esc(s.points)}<small>PTS</small></div>
  </a>`;
}

export function teamRow(s) {
  const c = teamColor(s.Constructor.constructorId);
  return `<a class="row" href="#/ecuries/${esc(s.Constructor.constructorId)}" style="--c:${c}">
    <div class="row__pos">${esc(s.position ?? s.positionText ?? '–')}</div>
    <div class="row__name">${esc(s.Constructor.name)}</div>
    <div class="row__extra">${Number(s.wins) ? `${esc(s.wins)} victoire${Number(s.wins) > 1 ? 's' : ''}` : ''}</div>
    <div class="row__pts">${esc(s.points)}<small>PTS</small></div>
  </a>`;
}

// Ligne du calendrier
export function raceItem(race, { state = '', winner = null, live = false } = {}) {
  const start = weekendStart(race);
  const end = raceStart(race);
  const loc = race.Circuit.Location;
  const chips = [];
  if (live) chips.push('<span class="chip chip--live"><i class="live-dot"></i>En cours</span>');
  else if (state === 'next') chips.push('<span class="chip chip--next">Prochaine</span>');
  if (isSprintWeekend(race)) chips.push('<span class="chip chip--sprint">Sprint</span>');
  const w = winner?.Results?.[0];
  return `<a class="race ${state === 'done' ? 'race--done' : ''} ${state === 'next' || live ? 'race--next' : ''}" href="#/course/${esc(race.round)}">
    <div class="race__round"><small>Manche</small>${esc(race.round)}</div>
    <div style="min-width:0">
      <div class="race__name">${esc(raceName(race.raceName))}</div>
      <div class="race__meta">${esc(race.Circuit.circuitName)} · ${esc(loc.locality)}, ${esc(country(loc.country))}</div>
    </div>
    <div class="race__right">
      <div class="race__date">${esc(fmtRange(start, end))}</div>
      ${w ? `<span class="winner" style="--c:${teamColor(w.Constructor.constructorId)}"><i></i>${esc(w.Driver.givenName)} ${esc(w.Driver.familyName)}</span>` : ''}
      ${chips.length ? `<div style="display:flex;gap:6px;flex-wrap:wrap">${chips.join('')}</div>` : ''}
    </div>
  </a>`;
}

export function empty(msg) {
  return `<div class="empty">${esc(msg)}</div>`;
}

export { fmtDay };
