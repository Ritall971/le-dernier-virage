// Fiche circuit : localisation, Grand Prix de la saison, programme et podium s'il a déjà eu lieu.
import * as api from '../api.js';
import { esc, country, raceName, fmtLong, fmtTime } from '../fmt.js';
import { teamColor } from '../teams.js';
import { kerb, sectionHead, empty } from '../ui.js';
import { sessionsOf, isDone } from '../season.js';

let currentTitle = 'Circuit';
export const title = () => currentTitle;

export async function render(id) {
  const races = await api.schedule();
  const race = races.find((r) => r.Circuit.circuitId === id);
  if (!race) throw new Error('Ce circuit n\'est pas au calendrier de la saison.');
  const circ = race.Circuit;
  const loc = circ.Location;
  currentTitle = circ.circuitName;

  const res = isDone(race) ? await api.raceResults(race.round).catch(() => null) : null;
  const lat = Number(loc.lat), lon = Number(loc.long);
  const osm = `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}#map=15/${lat}/${lon}`;

  return `
  <section class="hero">
    <div class="wrap hero__inner">
      <div>
        <div class="eyebrow">${esc(loc.locality)}, ${esc(country(loc.country))}</div>
        <h1>${esc(circ.circuitName)}</h1>
      </div>
      <div class="hero__side">
        <small>Manche ${esc(race.round)} · ${esc(raceName(race.raceName))}</small>
        <small>${lat.toFixed(4)}°, ${lon.toFixed(4)}°</small>
      </div>
    </div>
    ${kerb()}
  </section>

  <div class="wrap two-col">
    <section class="section">
      ${sectionHead(res ? 'Podium cette saison' : 'Grand Prix à venir', `#/course/${race.round}`, 'Voir le Grand Prix')}
      ${res?.Results?.length ? `<div class="rows">${res.Results.slice(0, 3).map((r) => `
        <a class="row" href="#/pilotes/${esc(r.Driver.driverId)}" style="--c:${teamColor(r.Constructor.constructorId)}">
          <div class="row__pos">${esc(r.position)}</div>
          <div class="row__name">${esc(r.Driver.familyName)}<span>${esc(r.Constructor.name)}</span></div>
          <div class="row__extra">${esc(r.Time?.time || '')}</div>
          <div class="row__pts">+${esc(r.points)}</div>
        </a>`).join('')}</div>` : empty(isDone(race) ? 'Résultats pas encore publiés.' : `Rendez-vous le ${fmtLong(sessionsOf(race).at(-1).start)}.`)}
      <div style="display:flex;gap:10px;flex-wrap:wrap">
        <a class="map-link" href="${esc(osm)}" target="_blank" rel="noopener">Voir sur la carte ↗</a>
        ${circ.url ? `<a class="map-link" href="${esc(circ.url)}" target="_blank" rel="noopener">Histoire du circuit ↗</a>` : ''}
      </div>
    </section>
    <section class="section">
      ${sectionHead('Programme du week-end')}
      <div class="sessions">
        ${sessionsOf(race).map((s) => `<div class="session"><b>${esc(s.label)}</b><span>${esc(fmtLong(s.start))}<br>${esc(fmtTime(s.start))}</span></div>`).join('')}
      </div>
    </section>
  </div>`;
}
