// Fiche écurie : chiffres de la saison, pilotes, points par course, résultats des deux voitures.
import * as api from '../api.js';
import { esc, nat, raceName } from '../fmt.js';
import { teamColor } from '../teams.js';
import { sectionHead, driverCard, empty } from '../ui.js';
import { pointsChart } from './chart.js';

let currentTitle = 'Écurie';
export const title = () => currentTitle;

export async function render(id) {
  const [cs, ds, races, photos] = await Promise.all([
    api.constructorStandings(), api.driverStandings(), api.constructorResults(id), api.driverPhotos(),
  ]);
  const st = cs.rows.find((s) => s.Constructor.constructorId === id);
  const team = st?.Constructor || races[0]?.Results[0]?.Constructor;
  if (!team) throw new Error('Cette écurie ne figure pas dans la saison en cours.');
  currentTitle = team.name;

  const c = teamColor(id);
  const drivers = ds.rows.filter((s) => s.Constructors.some((k) => k.constructorId === id));
  const all = races.flatMap((r) => r.Results);
  const podiums = all.filter((r) => Number(r.position) <= 3).length;
  const doubles = races.filter((r) => r.Results.filter((x) => /^\d+$/.test(x.positionText) && Number(x.points) > 0).length >= 2).length;

  return `
  <section class="profile" style="--c:${c}">
    <div class="wrap profile__inner">
      <div>
        <div class="eyebrow">${st ? `P${esc(st.position)} au championnat constructeurs` : 'Saison en cours'}</div>
        <h1>${esc(team.name)}</h1>
        <div class="facts"><span>Nationalité <b>${esc(nat(team.nationality))}</b></span><span>Pilotes <b>${drivers.map((d) => esc(d.Driver.familyName)).join(', ') || '–'}</b></span></div>
      </div>
      <div class="profile__bignum" aria-hidden="true">${st ? `P${esc(st.position)}` : ''}</div>
    </div>
  </section>
  <div class="kerb" aria-hidden="true"></div>

  <div class="wrap">
    <section class="section">
      <div class="stats" style="--c:${c}">
        <div class="stat"><b>${esc(st?.points ?? 0)}</b><span>Points</span></div>
        <div class="stat"><b>${esc(st?.wins ?? 0)}</b><span>Victoires</span></div>
        <div class="stat"><b>${podiums}</b><span>Podiums</span></div>
        <div class="stat"><b>${doubles}</b><span>Courses à 2 voitures dans les points</span></div>
      </div>
    </section>

    <section class="section">
      ${sectionHead('Pilotes')}
      <div class="grid">${drivers.map((s) => driverCard({ driver: s.Driver, team, pos: s.position, stat: s.points, photo: photos[s.Driver.permanentNumber]?.photo })).join('') || empty('Pas encore de pilote classé.')}</div>
    </section>

    ${races.length ? `<section class="section">
      ${sectionHead('Points marqués à chaque course')}
      <div class="chart">${pointsChart(races.map((r) => ({ label: r.round, value: r.Results.reduce((n, x) => n + Number(x.points), 0), title: raceName(r.raceName) })), c)}</div>
    </section>
    <section class="section">
      ${sectionHead('Résultats de la saison')}
      <div class="table-wrap"><table class="data">
        <thead><tr><th>Manche</th><th>Grand Prix</th><th>Arrivées</th><th class="num">Pts</th></tr></thead>
        <tbody>${races.map((r) => `<tr>
          <td class="pos">${esc(r.round)}</td>
          <td><a href="#/course/${esc(r.round)}">${esc(raceName(r.raceName))}</a></td>
          <td>${r.Results.map((x) => `${esc(x.Driver.code || x.Driver.familyName)} <b>${esc(/^\d+$/.test(x.positionText) ? `P${x.positionText}` : 'AB')}</b>`).join(' · ')}</td>
          <td class="num">${r.Results.reduce((n, x) => n + Number(x.points), 0)}</td>
        </tr>`).join('')}</tbody></table></div>
    </section>` : ''}
  </div>`;
}
