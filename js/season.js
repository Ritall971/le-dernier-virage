// Logique du week-end de course : sessions, session en cours, prochaine course.
import { toDate } from './fmt.js';

const SESSIONS = [
  ['FirstPractice', 'Essais libres 1', 60],
  ['SecondPractice', 'Essais libres 2', 60],
  ['ThirdPractice', 'Essais libres 3', 60],
  ['SprintQualifying', 'Qualifs sprint', 45],
  ['SprintShootout', 'Qualifs sprint', 45],
  ['Sprint', 'Sprint', 60],
  ['Qualifying', 'Qualifications', 60],
];

// Durée prise en compte pour considérer une session « en cours » (marge pour drapeaux rouges).
const MARGIN_MIN = 30;

export function sessionsOf(race) {
  const out = [];
  for (const [key, label, minutes] of SESSIONS) {
    if (race[key]?.date) out.push({ key, label, minutes, start: toDate(race[key].date, race[key].time) });
  }
  out.push({ key: 'Race', label: 'Course', minutes: 120, start: toDate(race.date, race.time) });
  return out.sort((a, b) => a.start - b.start);
}

export const isSprintWeekend = (race) => Boolean(race.Sprint);

export function raceStart(race) {
  return toDate(race.date, race.time);
}

export function weekendStart(race) {
  return sessionsOf(race)[0].start;
}

// Session en cours (ou sur le point de commencer dans les 10 minutes), sinon null.
export function currentSession(races, now = new Date()) {
  for (const race of races) {
    for (const s of sessionsOf(race)) {
      const from = s.start.getTime() - 10 * 60_000;
      const to = s.start.getTime() + (s.minutes + MARGIN_MIN) * 60_000;
      if (now >= from && now <= to) return { race, session: s };
    }
  }
  return null;
}

// Prochaine course dont l'épreuve principale n'a pas encore fini.
export function nextRace(races, now = new Date()) {
  return races.find((r) => raceStart(r).getTime() + 3 * 3600_000 > now.getTime()) || null;
}

export function nextSession(race, now = new Date()) {
  return sessionsOf(race).find((s) => s.start > now) || null;
}

export function isDone(race, now = new Date()) {
  return raceStart(race).getTime() + 3 * 3600_000 < now.getTime();
}
