// Accueil : le direct s'il y a une session en cours, sinon le classement des pilotes.
import * as api from '../api.js';
import { esc, countdown, fmtLong, fmtTime, raceName, country } from '../fmt.js';
import { teamColor } from '../teams.js';
import { currentSession, nextRace, nextSession, sessionsOf } from '../season.js';
import { kerb, driverCard, driverRow, teamRow, sectionHead, empty } from '../ui.js';
import * as live from './live.js';

let liveMode = false;

export async function render() {
  const races = await api.schedule();
  liveMode = Boolean(currentSession(races));
  if (liveMode) return live.render();

  const [ds, cs, last, photos] = await Promise.all([
    api.driverStandings(), api.constructorStandings(), api.lastRace().catch(() => null), api.driverPhotos(),
  ]);
  const next = nextRace(races);
  const ns = next ? nextSession(next) : null;
  const rows = ds.rows;
  const leader = rows[0];
  const second = rows[1];

  let headline = 'La saison va commencer';
  let accent = '#ff2a3c';
  if (leader) {
    const diff = Number(leader.points) - Number(second?.points || 0);
    accent = teamColor(leader.Constructors.at(-1)?.constructorId);
    headline = diff > 0
      ? `<em>${esc(leader.Driver.familyName)}</em> mène de ${diff} point${diff > 1 ? 's' : ''}`
      : `<em>${esc(leader.Driver.familyName)}</em> et ${esc(second.Driver.familyName)} à égalité`;
  }

  const photo = (d) => photos[d.permanentNumber]?.photo;

  return `
  <section class="hero" style="--accent:${accent}">
    <div class="wrap hero__inner">
      <div>
        <div class="eyebrow">Championnat pilotes · ${ds.round ? `après ${ds.round} manche${ds.round > 1 ? 's' : ''}` : 'saison en cours'}</div>
        <h1>${headline}</h1>
      </div>
      ${ns ? `<div class="hero__side">
        <small>${esc(ns.label)} · ${esc(raceName(next.raceName))}</small>
        <div class="countdown" data-countdown="${ns.start.toISOString()}">${countdown(ns.start)}</div>
        <small>${esc(fmtLong(ns.start))} à ${esc(fmtTime(ns.start))}</small>
      </div>` : ''}
    </div>
    ${kerb()}
  </section>

  <div class="wrap">
    <section class="section" aria-label="Podium du championnat">
      <div class="podium">
        ${rows.slice(0, 3).map((s) => driverCard({ driver: s.Driver, team: s.Constructors.at(-1), pos: s.position, stat: s.points, photo: photo(s.Driver) })).join('') || empty('Aucun point attribué pour le moment.')}
      </div>
      <div class="rows">${rows.slice(3).map(driverRow).join('')}</div>
    </section>

    <div class="two-col">
      ${last ? lastRaceBlock(last) : ''}
      ${next ? nextRaceBlock(next) : ''}
    </div>

    <section class="section">
      ${sectionHead('Constructeurs', '#/classements/ecuries', 'Classement complet')}
      <div class="rows">${cs.rows.slice(0, 5).map(teamRow).join('') || empty('Pas encore de classement.')}</div>
    </section>
  </div>`;
}

function lastRaceBlock(race) {
  const top = race.Results.slice(0, 3);
  return `<section class="section">
    ${sectionHead(`Dernière course : ${raceName(race.raceName)}`, `#/course/${race.round}`, 'Résultat complet')}
    <div class="rows">
      ${top.map((r) => `<a class="row" href="#/pilotes/${esc(r.Driver.driverId)}" style="--c:${teamColor(r.Constructor.constructorId)}">
        <div class="row__pos">${esc(r.position)}</div>
        <div class="row__name">${esc(r.Driver.familyName)}<span>${esc(r.Constructor.name)}</span></div>
        <div class="row__extra">${esc(r.Time?.time || r.status)}</div>
        <div class="row__pts">+${esc(r.points)}</div>
      </a>`).join('')}
    </div>
  </section>`;
}

function nextRaceBlock(race) {
  const loc = race.Circuit.Location;
  return `<section class="section">
    ${sectionHead(`Prochaine course : manche ${race.round}`, `#/course/${race.round}`, 'Programme')}
    <a class="card" href="#/course/${esc(race.round)}" style="--c:#ff2a3c">
      <div class="card__pos">${esc(loc.locality)}, ${esc(country(loc.country))}</div>
      <div class="card__name">${esc(raceName(race.raceName))}</div>
      <div class="card__team">${esc(race.Circuit.circuitName)}</div>
      <div class="sessions" style="margin-top:14px;position:relative">
        ${sessionsOf(race).map((s) => `<div class="session"><b>${esc(s.label)}</b><span>${esc(fmtLong(s.start))} · ${esc(fmtTime(s.start))}</span></div>`).join('')}
      </div>
    </a>
  </section>`;
}

export function mount(el) {
  if (liveMode) return live.mount(el);
  const timer = setInterval(() => {
    for (const n of el.querySelectorAll('[data-countdown]')) n.textContent = countdown(new Date(n.dataset.countdown));
  }, 30_000);
  return () => clearInterval(timer);
}
