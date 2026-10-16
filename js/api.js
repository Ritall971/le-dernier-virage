// Accès aux données. Jolpica pour la saison, OpenF1 pour le direct et les photos.
import { CONFIG } from './config.js';

let demoMode = false;
let demoModule = null;
export const isDemo = () => demoMode;

function cacheGet(key) {
  try {
    const raw = sessionStorage.getItem(key);
    if (!raw) return null;
    const { t, v } = JSON.parse(raw);
    if (Date.now() - t > CONFIG.cacheMinutes * 60_000) return null;
    return v;
  } catch { return null; }
}
function cacheSet(key, v) {
  try { sessionStorage.setItem(key, JSON.stringify({ t: Date.now(), v })); } catch { /* stockage plein ou bloqué */ }
}

const inflight = new Map();

async function jolpica(path) {
  const key = `j:${path}`;
  const cached = cacheGet(key);
  if (cached) return cached;
  if (inflight.has(key)) return inflight.get(key);

  const p = (async () => {
    if (!demoMode) {
      try {
        const res = await fetch(`${CONFIG.jolpica}/${path}`);
        if (res.status === 429) throw new ApiError('La source de données limite les requêtes. Réessaie dans une minute.');
        if (!res.ok) throw new ApiError(`La source de données a répondu ${res.status}.`);
        const json = await res.json();
        cacheSet(key, json.MRData);
        return json.MRData;
      } catch (e) {
        if (e instanceof ApiError) throw e;
        // Réseau injoignable (hors ligne, ou aperçu sans accès Internet) : données d'exemple.
        demoMode = true;
        window.dispatchEvent(new Event('demo-mode'));
      }
    }
    demoModule ??= await import('./demo.js');
    return demoModule.demo(path);
  })();
  inflight.set(key, p);
  try { return await p; } finally { inflight.delete(key); }
}

export class ApiError extends Error {}

// ---------- Saison (Jolpica) ----------
export async function schedule() {
  const d = await jolpica('current.json');
  return d.RaceTable.Races;
}
export async function driverStandings() {
  const d = await jolpica('current/driverstandings.json');
  const list = d.StandingsTable.StandingsLists[0];
  return { round: Number(list?.round || 0), rows: list?.DriverStandings || [] };
}
export async function constructorStandings() {
  const d = await jolpica('current/constructorstandings.json');
  const list = d.StandingsTable.StandingsLists[0];
  return { round: Number(list?.round || 0), rows: list?.ConstructorStandings || [] };
}
export async function raceResults(round) {
  const d = await jolpica(`current/${round}/results.json`);
  return d.RaceTable.Races[0] || null;
}
export async function qualifying(round) {
  const d = await jolpica(`current/${round}/qualifying.json`);
  return d.RaceTable.Races[0] || null;
}
export async function sprint(round) {
  const d = await jolpica(`current/${round}/sprint.json`);
  return d.RaceTable.Races[0] || null;
}
export async function lastRace() {
  const d = await jolpica('current/last/results.json');
  return d.RaceTable.Races[0] || null;
}
// Le vainqueur de chaque course déjà disputée, en une seule requête.
export async function winners() {
  const d = await jolpica('current/results/1.json?limit=100');
  return d.RaceTable.Races;
}
export async function drivers() {
  const d = await jolpica('current/drivers.json?limit=100');
  return d.DriverTable.Drivers;
}
export async function constructors() {
  const d = await jolpica('current/constructors.json?limit=100');
  return d.ConstructorTable.Constructors;
}
export async function circuits() {
  const d = await jolpica('current/circuits.json?limit=100');
  return d.CircuitTable.Circuits;
}
export async function driverResults(id) {
  const d = await jolpica(`current/drivers/${encodeURIComponent(id)}/results.json?limit=100`);
  return d.RaceTable.Races;
}
export async function constructorResults(id) {
  const d = await jolpica(`current/constructors/${encodeURIComponent(id)}/results.json?limit=100`);
  return d.RaceTable.Races;
}

// ---------- Direct (OpenF1) ----------
export class LiveLockedError extends Error {}

export async function openf1(path) {
  if (demoMode) throw new ApiError('Le direct n\'est pas disponible dans cet aperçu.');
  let res;
  try {
    res = await fetch(`${CONFIG.openf1}/${path}`);
  } catch {
    throw new ApiError('OpenF1 est injoignable pour le moment.');
  }
  if (res.status === 401 || res.status === 403) throw new LiveLockedError();
  if (res.status === 429) throw new ApiError('Trop de requêtes vers OpenF1, nouvel essai au prochain rafraîchissement.');
  if (res.status === 404) return [];
  if (!res.ok) throw new ApiError(`OpenF1 a répondu ${res.status}.`);
  return res.json();
}

// Photos et couleurs officielles des pilotes, par numéro de course. Facultatif : en cas d'échec on s'en passe.
let photosPromise = null;
export function driverPhotos() {
  if (demoMode) return Promise.resolve({});
  const cached = cacheGet('o:photos');
  if (cached) return Promise.resolve(cached);
  photosPromise ??= openf1('drivers?session_key=latest')
    .then((list) => {
      const map = {};
      for (const d of list) map[d.driver_number] = { photo: d.headshot_url, colour: d.team_colour, acronym: d.name_acronym };
      cacheSet('o:photos', map);
      return map;
    })
    .catch(() => ({}));
  return photosPromise;
}
