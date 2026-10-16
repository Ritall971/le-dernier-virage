// Calendrier de la saison avec le vainqueur de chaque course disputée.
import * as api from '../api.js';
import { pageHead, raceItem } from '../ui.js';
import { currentSession, nextRace, isDone } from '../season.js';

export const title = () => 'Calendrier';

export async function render() {
  const [races, wins] = await Promise.all([api.schedule(), api.winners().catch(() => [])]);
  const byRound = Object.fromEntries(wins.map((r) => [r.round, r]));
  const live = currentSession(races);
  const next = nextRace(races);
  const season = races[0]?.season || '';
  const done = races.filter((r) => isDone(r)).length;

  return `${pageHead(`Saison ${season}`, `${races.length} courses au programme, ${done} déjà disputée${done > 1 ? 's' : ''}. Horaires à l'heure de ton appareil.`)}
    <div class="wrap section">
      <div class="race-list">
        ${races.map((r) => raceItem(r, {
          state: isDone(r) ? 'done' : r === next ? 'next' : '',
          winner: byRound[r.round],
          live: live?.race.round === r.round,
        })).join('')}
      </div>
    </div>`;
}
