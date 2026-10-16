// Direct : tour de classement, écarts, drapeau et messages de la direction de course (OpenF1).
import * as api from '../api.js';
import { CONFIG } from '../config.js';
import { esc, fmtTime, fmtLong, lapTime, gap, country } from '../fmt.js';
import { teamColor } from '../teams.js';
import { kerb, sectionHead, empty } from '../ui.js';
import { currentSession, nextRace, nextSession } from '../season.js';

export const title = () => 'Direct';

const NAMES = {
  'Practice 1': 'Essais libres 1', 'Practice 2': 'Essais libres 2', 'Practice 3': 'Essais libres 3',
  Qualifying: 'Qualifications', 'Sprint Qualifying': 'Qualifs sprint', 'Sprint Shootout': 'Qualifs sprint',
  Sprint: 'Sprint', Race: 'Course',
};
const FLAGS = {
  GREEN: 'Drapeau vert', YELLOW: 'Drapeau jaune', DOUBLE_YELLOW: 'Double drapeau jaune', RED: 'Drapeau rouge',
  CHEQUERED: 'Drapeau à damier', CLEAR: 'Piste dégagée', SC: 'Voiture de sécurité', VSC: 'Voiture de sécurité virtuelle',
};

let state = null;

export async function render() {
  state = { session: null, drivers: {}, locked: false, error: '' };
  const races = await api.schedule();
  const cur = currentSession(races);

  try {
    const [s] = await api.openf1('sessions?session_key=latest');
    state.session = s || null;
    if (s) {
      const list = await api.openf1(`drivers?session_key=${s.session_key}`);
      for (const d of list) state.drivers[d.driver_number] = d;
    }
  } catch (e) {
    if (e instanceof api.LiveLockedError) state.locked = true;
    else state.error = e.message;
  }

  const s = state.session;
  const sName = s ? (NAMES[s.session_name] || s.session_name) : cur?.session.label;
  const isLive = s ? new Date() < new Date(s.date_end) && new Date() > new Date(s.date_start) : Boolean(cur);
  const next = nextRace(races);
  const ns = next ? nextSession(next) : null;

  const head = `
  <section class="hero">
    <div class="wrap hero__inner">
      <div>
        <div class="eyebrow">${isLive ? '<span class="chip chip--live"><i class="live-dot"></i>En direct</span>' : 'Dernière session disponible'}</div>
        <h1>${esc(sName || 'Direct')}${s ? ` · <em>${esc(s.circuit_short_name || s.location)}</em>` : ''}</h1>
      </div>
      <div class="hero__side">
        ${s ? `<small>${esc(country(s.country_name))} · ${esc(fmtLong(new Date(s.date_start)))}</small><small>${esc(fmtTime(new Date(s.date_start)))} – ${esc(fmtTime(new Date(s.date_end)))}</small>` : ''}
        ${!isLive && ns ? `<small>Prochaine session : ${esc(ns.label)}, ${esc(fmtLong(ns.start))} à ${esc(fmtTime(ns.start))}</small>` : ''}
      </div>
    </div>
    ${kerb()}
  </section>`;

  if (state.locked || state.error || !s) {
    return `${head}<div class="wrap section">${lockedNotice(state.error)}</div>`;
  }

  return `${head}
  <div class="wrap two-col">
    <section class="section">
      <div class="section__head"><h2>Classement</h2><div class="live-head" id="live-meta"></div></div>
      <div class="rows tower" id="tower"><div class="loading" style="margin:0">Chargement des positions…</div></div>
    </section>
    <section class="section">
      ${sectionHead('Direction de course')}
      <div class="rc-list" id="rc"></div>
    </section>
  </div>`;
}

function lockedNotice(error) {
  return `<div class="notice">
    <b>${error ? esc(error) : 'Le suivi seconde par seconde n\'est pas accessible en gratuit.'}</b>
    <span>La source OpenF1 réserve le direct aux abonnés. En gratuit, le classement de la session apparaît ici environ 30 minutes après le drapeau à damier. Les résultats officiels arrivent ensuite dans le calendrier.</span>
    <a class="link-more" href="#/calendrier">Voir le calendrier →</a>
  </div>`;
}

const latestBy = (rows, key = 'driver_number') => {
  const m = {};
  for (const r of rows) m[r[key]] = r; // les données OpenF1 sont triées par date
  return m;
};

async function refresh(el) {
  const s = state.session;
  const isRace = /Race|Sprint$/.test(s.session_name) || s.session_type === 'Race';
  const k = s.session_key;
  const [pos, ints, rc, laps] = await Promise.all([
    api.openf1(`position?session_key=${k}`),
    isRace ? api.openf1(`intervals?session_key=${k}`).catch(() => []) : [],
    api.openf1(`race_control?session_key=${k}`).catch(() => []),
    isRace ? [] : api.openf1(`laps?session_key=${k}`).catch(() => []),
  ]);

  const tower = el.querySelector('#tower');
  const meta = el.querySelector('#live-meta');
  if (!tower) return;

  const p = latestBy(pos);
  const iv = latestBy(ints);
  const best = {};
  for (const l of laps) if (l.lap_duration && (!best[l.driver_number] || l.lap_duration < best[l.driver_number])) best[l.driver_number] = l.lap_duration;
  const overallBest = Math.min(...Object.values(best));

  const order = Object.values(p).sort((a, b) => a.position - b.position);
  if (!order.length) {
    tower.innerHTML = empty('Pas encore de positions pour cette session. En gratuit, elles apparaissent environ 30 minutes après la fin.');
  } else {
    tower.innerHTML = order.map((r) => {
      const d = state.drivers[r.driver_number] || {};
      const c = teamColor(d.team_name || '', d.team_colour);
      const i = iv[r.driver_number];
      const right = isRace
        ? (r.position === 1 ? 'Leader' : gap(i?.gap_to_leader))
        : (best[r.driver_number] ? lapTime(best[r.driver_number]) : '');
      const extra = isRace
        ? (r.position === 1 ? '' : `int. ${gap(i?.interval)}`)
        : (best[r.driver_number] && best[r.driver_number] !== overallBest ? `+${(best[r.driver_number] - overallBest).toFixed(3)}` : '');
      return `<div class="row" style="--c:${c}">
        <div class="row__pos">${r.position}</div>
        <div class="row__name">${esc(d.name_acronym || r.driver_number)}<span>${esc(d.full_name || '')}</span></div>
        <div class="row__extra">${esc(extra)}</div>
        <div class="row__pts" style="font-size:18px">${esc(right)}</div>
      </div>`;
    }).join('');
  }

  // Drapeau courant et tour
  const flags = rc.filter((m) => m.flag || m.category === 'SafetyCar');
  const last = flags.at(-1);
  let flagKey = last?.flag || '';
  if (last?.category === 'SafetyCar') flagKey = /VIRTUAL/i.test(last.message) ? (/ENDING|IN THIS LAP/i.test(last.message) ? 'GREEN' : 'VSC') : (/IN THIS LAP|ENDING/i.test(last.message) ? 'GREEN' : 'SC');
  const lap = Math.max(0, ...rc.map((m) => m.lap_number || 0));
  if (meta) {
    meta.innerHTML = `${flagKey ? `<span class="live-flag flag-${esc(flagKey)}">${esc(FLAGS[flagKey] || flagKey)}</span>` : ''}${isRace && lap ? `<span class="chip">Tour ${lap}</span>` : ''}<span class="chip">Mis à jour ${esc(fmtTime(new Date()))}</span>`;
  }

  const rcEl = el.querySelector('#rc');
  if (rcEl) {
    rcEl.innerHTML = rc.slice(-20).reverse().map((m) => `<div class="rc"><time>${esc(fmtTime(new Date(m.date)))}${m.lap_number ? ` · tour ${m.lap_number}` : ''}</time>${esc(m.message)}</div>`).join('') || empty('Aucun message pour le moment.');
  }
}

export function mount(el) {
  if (!state?.session) return null;
  let stopped = false;
  let timer = null;
  const tick = async () => {
    try { await refresh(el); } catch (e) {
      if (e instanceof api.LiveLockedError) {
        const t = el.querySelector('#tower');
        if (t) t.innerHTML = lockedNotice();
        return; // inutile d'insister
      }
      const m = el.querySelector('#live-meta');
      if (m) m.innerHTML = `<span class="chip">${esc(e.message)}</span>`;
    }
    const live = new Date() < new Date(state.session.date_end);
    if (!stopped && live) timer = setTimeout(tick, CONFIG.liveRefreshSeconds * 1000);
  };
  tick();
  return () => { stopped = true; clearTimeout(timer); };
}
