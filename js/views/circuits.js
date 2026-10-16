// Liste des circuits de la saison, dans l'ordre du calendrier.
import * as api from '../api.js';
import { esc, country, fmtRange, raceName } from '../fmt.js';
import { pageHead } from '../ui.js';
import { weekendStart, raceStart, isDone } from '../season.js';

export const title = () => 'Circuits';

export async function render() {
  const races = await api.schedule();
  return `${pageHead('Circuits', `${races.length} circuits accueillent la Formule 1 cette saison.`)}
    <div class="wrap section">
      <div class="grid">
        ${races.map((r) => {
          const loc = r.Circuit.Location;
          return `<a class="card" href="#/circuits/${esc(r.Circuit.circuitId)}" style="--c:${isDone(r) ? '#55524e' : '#ff2a3c'}">
            <div class="card__num" aria-hidden="true">${esc(r.round)}</div>
            <div class="card__pos">${esc(country(loc.country))}</div>
            <div class="card__name" style="font-size:28px">${esc(r.Circuit.circuitName)}</div>
            <div class="card__team">${esc(loc.locality)} · ${esc(raceName(r.raceName))}</div>
            <div class="card__team">${esc(fmtRange(weekendStart(r), raceStart(r)))}${isDone(r) ? ' · couru' : ''}</div>
          </a>`;
        }).join('')}
      </div>
    </div>`;
}
