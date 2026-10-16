// Liste des écuries.
import * as api from '../api.js';
import { pageHead, teamCard, empty } from '../ui.js';

export const title = () => 'Écuries';

export async function render() {
  const [cs, ds] = await Promise.all([api.constructorStandings(), api.driverStandings()]);
  const byTeam = {};
  for (const s of ds.rows) (byTeam[s.Constructors.at(-1)?.constructorId] ??= []).push(s.Driver);
  return `${pageHead('Écuries', `${cs.rows.length} écuries engagées cette saison, dans l'ordre du championnat.`)}
    <div class="wrap section">
      <div class="grid">
        ${cs.rows.map((s) => teamCard({ team: s.Constructor, pos: s.position, stat: s.points, drivers: byTeam[s.Constructor.constructorId] })).join('') || empty('Aucune écurie pour le moment.')}
      </div>
    </div>`;
}
