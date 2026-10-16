// Liste des pilotes de la saison, regroupés par écurie.
import * as api from '../api.js';
import { pageHead, driverCard, empty } from '../ui.js';

export const title = () => 'Pilotes';

export async function render() {
  const [ds, cs, photos] = await Promise.all([api.driverStandings(), api.constructorStandings(), api.driverPhotos()]);
  const teamOrder = Object.fromEntries(cs.rows.map((s, i) => [s.Constructor.constructorId, i]));
  const rows = [...ds.rows].sort((a, b) =>
    (teamOrder[a.Constructors.at(-1)?.constructorId] ?? 99) - (teamOrder[b.Constructors.at(-1)?.constructorId] ?? 99)
    || Number(a.position) - Number(b.position));

  return `${pageHead('Pilotes', `${rows.length} pilotes classés cette saison, regroupés par écurie.`)}
    <div class="wrap section">
      <div class="grid">
        ${rows.map((s) => driverCard({ driver: s.Driver, team: s.Constructors.at(-1), stat: s.points, photo: photos[s.Driver.permanentNumber]?.photo })).join('') || empty('Aucun pilote pour le moment.')}
      </div>
    </div>`;
}
