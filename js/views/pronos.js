// Pronostics : pole et podium de la prochaine course, puis classement général des joueurs.
import * as api from '../api.js';
import { sb, currentUser, authError } from '../auth.js';
import { esc, countdown, fmtLong, fmtTime, raceName } from '../fmt.js';
import { pageHead, sectionHead, empty } from '../ui.js';

export const title = () => 'Pronos';

// Barème : doit rester identique à la fonction points_for de supabase/schema.sql.
export const SCORING = [
  ['Vainqueur exact', 10],
  ['2e exact', 6],
  ['3e exact', 4],
  ['Pilote sur le podium, mauvaise place', 2],
  ['Pole position exacte', 5],
  ['Bonus podium parfait', 5],
];

let state = null;

// Pilotes de la saison, dans l'ordre du championnat, avec la couleur de leur écurie.
export async function driverList() {
  const ds = await api.driverStandings().catch(() => ({ rows: [] }));
  let list = ds.rows.map((s) => ({ id: s.Driver.driverId, name: `${s.Driver.givenName} ${s.Driver.familyName}`, short: s.Driver.familyName, team: s.Constructors.at(-1) }));
  if (!list.length) {
    const ds2 = await api.drivers();
    list = ds2.map((d) => ({ id: d.driverId, name: `${d.givenName} ${d.familyName}`, short: d.familyName, team: null }));
  }
  return list;
}

export async function render() {
  const client = await sb();
  const [user, drivers, next, board] = await Promise.all([
    currentUser(),
    driverList(),
    client.from('races').select('*').gt('race_start', new Date().toISOString()).order('race_start').limit(1),
    client.from('leaderboard').select('*').order('points', { ascending: false }).order('winners', { ascending: false }).order('pseudo'),
  ]);
  if (next.error) throw new Error(`Base des pronostics injoignable (${authError(next.error)})`);
  const race = next.data?.[0] ?? null;

  let mine = null;
  if (user && race) {
    const { data } = await client.from('predictions').select('*')
      .eq('user_id', user.id).eq('season', race.season).eq('round', race.round).maybeSingle();
    mine = data;
  }
  state = { user, race, mine, drivers };

  return `${pageHead('Pronos', 'Devine la pole et le podium de chaque Grand Prix, marque des points et grimpe au classement.')}
    <div class="wrap section">
      ${sectionHead(race ? raceName(race.name) : 'Prochaine course')}
      ${race ? form(race, user, mine, drivers) : empty('Aucune course à venir pour l\'instant. Le calendrier se met à jour tout seul.')}
    </div>
    <div class="wrap section">
      ${sectionHead('Classement des joueurs')}
      ${leaderboard(board.data || [], user)}
    </div>
    <div class="wrap section">
      ${sectionHead('Barème')}
      <div class="scoring">${SCORING.map(([l, p]) => `<div><span>${esc(l)}</span><b>${p} pts</b></div>`).join('')}</div>
      <p class="fine">La pole se ferme au début des qualifications, le podium au départ de la course. Les points sont comptés automatiquement quelques heures après l'arrivée, à partir des résultats officiels. Les pronostics des autres joueurs deviennent visibles au départ.</p>
    </div>`;
}

function form(race, user, mine, drivers) {
  const now = new Date();
  const quali = race.quali_start ? new Date(race.quali_start) : null;
  const start = new Date(race.race_start);
  const poleLocked = quali && now >= quali;
  const select = (name, label, value, disabled = false) => `
    <label class="field"><span>${label}</span>
      <select name="${name}" ${disabled ? 'disabled' : ''} ${name === 'pole' ? '' : 'required'}>
        <option value="">Choisir un pilote</option>
        ${drivers.map((d) => `<option value="${esc(d.id)}" ${d.id === value ? 'selected' : ''}>${esc(d.name)}${d.team ? ` · ${esc(d.team.name)}` : ''}</option>`).join('')}
      </select></label>`;

  const deadline = `<div class="prono-head">
      <div><small>Course</small>${esc(fmtLong(start))} à ${esc(fmtTime(start))}</div>
      ${quali ? `<div><small>Pole ${poleLocked ? 'fermée' : 'ferme dans'}</small>${poleLocked ? 'Qualifs commencées' : `<span data-countdown="${esc(race.quali_start)}">${esc(countdown(quali))}</span>`}</div>` : ''}
      <div><small>Podium ferme dans</small><span data-countdown="${esc(race.race_start)}">${esc(countdown(start))}</span></div>
    </div>`;

  if (!user) {
    return `${deadline}<div class="notice"><b>Crée un compte pour jouer.</b> C'est gratuit, il faut juste un e-mail et un pseudo.<a class="btn" href="#/compte" style="justify-self:start">Créer un compte</a></div>`;
  }
  return `${deadline}
    <form class="prono" id="prono-form" novalidate>
      <div class="prono__grid">
        ${select('pole', 'Pole position', mine?.pole, poleLocked)}
        ${select('p1', 'Vainqueur', mine?.p1)}
        ${select('p2', '2e', mine?.p2)}
        ${select('p3', '3e', mine?.p3)}
      </div>
      <div class="prono__actions">
        <button class="btn" type="submit">${mine ? 'Modifier mon prono' : 'Valider mon prono'}</button>
        <p class="form-msg" role="status" aria-live="polite">${mine ? `Prono enregistré le ${esc(fmtLong(new Date(mine.updated_at)))} à ${esc(fmtTime(new Date(mine.updated_at)))}. Tu peux le modifier jusqu'à la fermeture.` : ''}</p>
      </div>
    </form>`;
}

function leaderboard(rows, user) {
  if (!rows.length) return empty('Personne n\'a encore marqué de points. Le classement apparaît après la première course comptée.');
  let rank = 0, prev = null;
  return `<div class="rows">${rows.map((r, i) => {
    if (prev === null || r.points !== prev.points || r.winners !== prev.winners) rank = i + 1;
    prev = r;
    const me = user && r.id === user.id;
    return `<div class="row ${me ? 'row--me' : ''}" style="--c:${me ? 'var(--red)' : 'var(--line)'}">
      <div class="row__pos">${rank}</div>
      <div class="row__name">${esc(r.pseudo)}${me ? '<span>toi</span>' : ''}</div>
      <div class="row__extra">${r.races} course${r.races > 1 ? 's' : ''}${r.winners ? ` · ${r.winners} vainqueur${r.winners > 1 ? 's' : ''}` : ''}</div>
      <div class="row__pts">${r.points}<small>PTS</small></div>
    </div>`;
  }).join('')}</div>`;
}

export function mount(el) {
  const timers = [];
  const tick = () => {
    for (const s of el.querySelectorAll('[data-countdown]')) s.textContent = countdown(new Date(s.dataset.countdown));
  };
  timers.push(setInterval(tick, 30_000));

  const f = el.querySelector('#prono-form');
  f?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const msg = f.querySelector('.form-msg');
    const btn = f.querySelector('button');
    const v = Object.fromEntries(new FormData(f));
    const picks = [v.p1, v.p2, v.p3];
    msg.className = 'form-msg';
    if (picks.some((p) => !p)) { msg.textContent = 'Choisis le vainqueur, le 2e et le 3e.'; msg.classList.add('err'); return; }
    if (new Set(picks).size < 3) { msg.textContent = 'Un même pilote ne peut pas être à deux places du podium.'; msg.classList.add('err'); return; }

    const { race, user, mine } = state;
    const row = { p1: v.p1, p2: v.p2, p3: v.p3 };
    if (!f.elements.pole.disabled) row.pole = v.pole || null;
    btn.disabled = true;
    msg.textContent = 'Enregistrement…';
    try {
      const client = await sb();
      const q = mine
        ? client.from('predictions').update(row).eq('user_id', user.id).eq('season', race.season).eq('round', race.round)
        : client.from('predictions').insert({ ...row, season: race.season, round: race.round });
      const { error } = await q;
      if (error) throw error;
      state.mine = { ...mine, ...row, updated_at: new Date().toISOString() };
      msg.textContent = 'Prono enregistré. Tu peux le modifier jusqu\'à la fermeture.';
      msg.classList.add('ok');
      btn.textContent = 'Modifier mon prono';
    } catch (err) {
      msg.textContent = authError(err);
      msg.classList.add('err');
    } finally {
      btn.disabled = false;
    }
  });

  return () => timers.forEach(clearInterval);
}
