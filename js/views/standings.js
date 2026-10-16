// Classements pilotes et constructeurs.
import * as api from '../api.js';
import { pageHead, driverCard, teamCard, driverRow, teamRow, empty } from '../ui.js';

export const title = (tab) => (tab === 'ecuries' ? 'Classement constructeurs' : 'Classement pilotes');

export async function render(tab = 'pilotes') {
  const isTeams = tab === 'ecuries';
  const tabs = `<div class="wrap" style="padding-top:8px"><div class="tabs" role="tablist">
    <a href="#/classements/pilotes" role="tab" aria-selected="${!isTeams}"><span>Pilotes</span></a>
    <a href="#/classements/ecuries" role="tab" aria-selected="${isTeams}"><span>Constructeurs</span></a>
  </div></div>`;

  if (isTeams) {
    const [cs, ds] = await Promise.all([api.constructorStandings(), api.driverStandings()]);
    const byTeam = {};
    for (const s of ds.rows) (byTeam[s.Constructors.at(-1)?.constructorId] ??= []).push(s.Driver);
    return `${pageHead('Constructeurs', roundLabel(cs.round))}${tabs}
      <div class="wrap section">
        <div class="podium">${cs.rows.slice(0, 3).map((s) => teamCard({ team: s.Constructor, pos: s.position, stat: s.points, drivers: byTeam[s.Constructor.constructorId] })).join('')}</div>
        <div class="rows">${cs.rows.slice(3).map(teamRow).join('')}</div>
        ${cs.rows.length ? '' : empty('Pas encore de classement cette saison.')}
      </div>`;
  }

  const [ds, photos] = await Promise.all([api.driverStandings(), api.driverPhotos()]);
  return `${pageHead('Pilotes', roundLabel(ds.round))}${tabs}
    <div class="wrap section">
      <div class="podium">${ds.rows.slice(0, 3).map((s) => driverCard({ driver: s.Driver, team: s.Constructors.at(-1), pos: s.position, stat: s.points, photo: photos[s.Driver.permanentNumber]?.photo })).join('')}</div>
      <div class="rows">${ds.rows.slice(3).map(driverRow).join('')}</div>
      ${ds.rows.length ? '' : empty('Pas encore de classement cette saison.')}
    </div>`;
}

const roundLabel = (r) => (r ? `Après ${r} manche${r > 1 ? 's' : ''}.` : 'Saison en cours.');
