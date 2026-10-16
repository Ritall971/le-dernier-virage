// Un Grand Prix : programme du week-end, résultats de la course, des qualifications et du sprint.
import * as api from '../api.js';
import { esc, fmtLong, fmtTime, raceName, country, status, fmtRange } from '../fmt.js';
import { teamColor } from '../teams.js';
import { sessionsOf, isDone, weekendStart, raceStart, isSprintWeekend } from '../season.js';
import { kerb, sectionHead, empty } from '../ui.js';

let currentTitle = 'Grand Prix';
export const title = () => currentTitle;

export async function render(round) {
  const races = await api.schedule();
  const race = races.find((r) => r.round === String(round));
  if (!race) throw new Error(`La manche ${round} n'existe pas cette saison.`);
  currentTitle = raceName(race.raceName);

  const started = sessionsOf(race)[0].start < new Date();
  const [res, quali, spr] = started
    ? await Promise.all([api.raceResults(round), api.qualifying(round), isSprintWeekend(race) ? api.sprint(round) : null])
    : [null, null, null];

  const loc = race.Circuit.Location;
  const panels = [];
  if (res?.Results?.length) panels.push(['course', 'Course', resultsTable(res.Results, 'Results')]);
  if (spr?.SprintResults?.length) panels.push(['sprint', 'Sprint', resultsTable(spr.SprintResults, 'Sprint')]);
  if (quali?.QualifyingResults?.length) panels.push(['qualifs', 'Qualifications', qualiTable(quali.QualifyingResults)]);

  const winner = res?.Results?.[0];
  const accent = winner ? teamColor(winner.Constructor.constructorId) : '#ff2a3c';

  return `
  <section class="hero" style="--accent:${accent}">
    <div class="wrap hero__inner">
      <div>
        <div class="eyebrow">Manche ${esc(race.round)} · ${esc(fmtRange(weekendStart(race), raceStart(race)))}</div>
        <h1>${winner ? `<em>${esc(winner.Driver.familyName)}</em> gagne le ` : ''}${esc(raceName(race.raceName))}</h1>
      </div>
      <div class="hero__side">
        <small>${esc(race.Circuit.circuitName)}</small>
        <small>${esc(loc.locality)}, ${esc(country(loc.country))}</small>
        <a class="link-more" href="#/circuits/${esc(race.Circuit.circuitId)}">Fiche du circuit →</a>
      </div>
    </div>
    ${kerb()}
  </section>

  <div class="wrap two-col">
    <section class="section">
      ${sectionHead('Résultats')}
      ${panels.length ? `
        <div class="tabs" role="tablist">${panels.map(([k, l], i) => `<button role="tab" data-tab="${k}" aria-selected="${i === 0}"><span>${l}</span></button>`).join('')}</div>
        ${panels.map(([k, , html], i) => `<div data-panel="${k}" ${i ? 'hidden' : ''}>${html}</div>`).join('')}`
      : empty(isDone(race) ? 'Les résultats ne sont pas encore publiés. Ils arrivent en général quelques heures après la course.' : 'Pas encore de résultats : le week-end n\'a pas commencé ou est en cours.')}
    </section>
    <section class="section">
      ${sectionHead('Programme')}
      <div class="sessions">
        ${sessionsOf(race).map((s) => `<div class="session"><b>${esc(s.label)}</b><span>${esc(fmtLong(s.start))}<br>${esc(fmtTime(s.start))}</span></div>`).join('')}
      </div>
    </section>
  </div>`;
}

function resultsTable(rows, kind) {
  const fastestRank = (r) => r.FastestLap?.rank === '1';
  return `<div class="table-wrap"><table class="data">
    <thead><tr><th>Pos</th><th>Pilote</th><th>Écurie</th><th class="num">Grille</th><th class="num">Tours</th><th>Temps / statut</th><th class="num">Pts</th></tr></thead>
    <tbody>
      ${rows.map((r) => `<tr>
        <td class="pos">${esc(r.positionText === 'R' ? 'AB' : r.positionText)}</td>
        <td class="drv" style="--c:${teamColor(r.Constructor.constructorId)}"><a href="#/pilotes/${esc(r.Driver.driverId)}">${esc(r.Driver.familyName)}</a></td>
        <td class="muted">${esc(r.Constructor.name)}</td>
        <td class="num muted">${esc(r.grid === '0' ? 'Stands' : r.grid)}</td>
        <td class="num muted">${esc(r.laps)}</td>
        <td>${esc(r.Time?.time || status(r.status))}${kind === 'Results' && fastestRank(r) ? ` <span class="fastest" title="Meilleur tour en course">● ${esc(r.FastestLap.Time?.time || '')}</span>` : ''}</td>
        <td class="num">${esc(r.points)}</td>
      </tr>`).join('')}
    </tbody></table></div>
    ${kind === 'Results' && rows.some(fastestRank) ? '<p class="muted" style="font-size:13px;color:var(--dim)"><span class="fastest">●</span> Meilleur tour en course</p>' : ''}`;
}

function qualiTable(rows) {
  return `<div class="table-wrap"><table class="data">
    <thead><tr><th>Pos</th><th>Pilote</th><th>Écurie</th><th>Q1</th><th>Q2</th><th>Q3</th></tr></thead>
    <tbody>
      ${rows.map((r) => `<tr>
        <td class="pos">${esc(r.position)}</td>
        <td class="drv" style="--c:${teamColor(r.Constructor.constructorId)}"><a href="#/pilotes/${esc(r.Driver.driverId)}">${esc(r.Driver.familyName)}</a></td>
        <td class="muted">${esc(r.Constructor.name)}</td>
        <td class="muted">${esc(r.Q1 || '')}</td><td class="muted">${esc(r.Q2 || '')}</td><td>${esc(r.Q3 || '')}</td>
      </tr>`).join('')}
    </tbody></table></div>`;
}

export function mount(el) {
  const onClick = (e) => {
    const btn = e.target.closest('[data-tab]');
    if (!btn) return;
    for (const b of el.querySelectorAll('[data-tab]')) b.setAttribute('aria-selected', String(b === btn));
    for (const p of el.querySelectorAll('[data-panel]')) p.hidden = p.dataset.panel !== btn.dataset.tab;
  };
  el.addEventListener('click', onClick);
  return () => el.removeEventListener('click', onClick);
}
