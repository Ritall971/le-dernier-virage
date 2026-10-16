// Fiche pilote : identité, chiffres de la saison, points par course, résultats.
import * as api from '../api.js';
import { esc, age, nat, raceName, status, fmtFull } from '../fmt.js';
import { teamColor } from '../teams.js';
import { sectionHead, empty } from '../ui.js';
import { pointsChart } from './chart.js';

let currentTitle = 'Pilote';
export const title = () => currentTitle;

export async function render(id) {
  const [ds, races, photos] = await Promise.all([api.driverStandings(), api.driverResults(id), api.driverPhotos()]);
  const st = ds.rows.find((s) => s.Driver.driverId === id);
  const driver = st?.Driver || races[0]?.Results[0]?.Driver;
  if (!driver) throw new Error('Ce pilote ne figure pas dans la saison en cours.');
  currentTitle = `${driver.givenName} ${driver.familyName}`;

  const team = st?.Constructors.at(-1) || races.at(-1)?.Results[0]?.Constructor;
  const c = teamColor(team?.constructorId);
  const results = races.map((r) => ({ race: r, res: r.Results[0] }));
  const finishes = results.map((x) => Number(x.res.position));
  const classified = results.filter((x) => /^\d+$/.test(x.res.positionText));
  const podiums = finishes.filter((p) => p <= 3).length;
  const poles = results.filter((x) => x.res.grid === '1').length;
  const dnf = results.length - classified.length;
  const best = classified.length ? Math.min(...classified.map((x) => Number(x.res.position))) : null;
  const photo = photos[driver.permanentNumber]?.photo;

  return `
  <section class="profile" style="--c:${c}">
    <div class="wrap profile__inner">
      <div>
        <div class="eyebrow">${esc(team?.name || '')}${st ? ` · P${esc(st.position)} au championnat` : ''}</div>
        <h1><small>${esc(driver.givenName)}</small>${esc(driver.familyName)}</h1>
        <div class="facts">
          <span>Numéro <b>${esc(driver.permanentNumber || '–')}</b></span>
          <span>Code <b>${esc(driver.code || '–')}</b></span>
          <span>Nationalité <b>${esc(nat(driver.nationality))}</b></span>
          ${driver.dateOfBirth ? `<span>Âge <b>${age(driver.dateOfBirth)} ans</b> (né le ${esc(fmtFull(new Date(driver.dateOfBirth)))})</span>` : ''}
        </div>
      </div>
      ${photo ? `<img class="profile__photo" src="${esc(photo)}" alt="${esc(currentTitle)}" onerror="this.remove()">` : `<div class="profile__bignum" aria-hidden="true">${esc(driver.permanentNumber || '')}</div>`}
    </div>
  </section>
  <div class="kerb" aria-hidden="true"></div>

  <div class="wrap">
    <section class="section">
      <div class="stats" style="--c:${c}">
        <div class="stat"><b>${esc(st?.points ?? 0)}</b><span>Points</span></div>
        <div class="stat"><b>${esc(st?.wins ?? 0)}</b><span>Victoires</span></div>
        <div class="stat"><b>${podiums}</b><span>Podiums</span></div>
        <div class="stat"><b>${poles}</b><span>Départs en pole</span></div>
        <div class="stat"><b>${best ?? '–'}</b><span>Meilleur résultat</span></div>
        <div class="stat"><b>${dnf}</b><span>Non classé</span></div>
      </div>
    </section>

    ${results.length ? `<section class="section">
      ${sectionHead('Points marqués à chaque course')}
      <div class="chart">${pointsChart(results.map((x) => ({ label: x.race.round, value: Number(x.res.points), title: raceName(x.race.raceName) })), c)}</div>
    </section>` : ''}

    <section class="section">
      ${sectionHead('Résultats de la saison')}
      ${results.length ? `<div class="table-wrap"><table class="data">
        <thead><tr><th>Manche</th><th>Grand Prix</th><th class="num">Grille</th><th class="num">Arrivée</th><th>Statut</th><th class="num">Pts</th></tr></thead>
        <tbody>${results.map(({ race, res }) => `<tr>
          <td class="pos">${esc(race.round)}</td>
          <td><a href="#/course/${esc(race.round)}">${esc(raceName(race.raceName))}</a></td>
          <td class="num muted">${esc(res.grid === '0' ? 'Stands' : res.grid)}</td>
          <td class="num"><b>${esc(/^\d+$/.test(res.positionText) ? res.positionText : 'AB')}</b></td>
          <td class="muted">${esc(res.Time?.time ? 'Arrivé' : status(res.status))}</td>
          <td class="num">${esc(res.points)}</td>
        </tr>`).join('')}</tbody></table></div>` : empty('Aucun résultat pour l\'instant.')}
    </section>
  </div>`;
}
