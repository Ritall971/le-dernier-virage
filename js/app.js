// Point d'entrée : navigation entre les pages (routes en #/...), menu mobile, bandeau d'aperçu.
import { esc } from './fmt.js';
import { schedule } from './api.js';
import { currentSession } from './season.js';
import { enhance, initHeader, initMagnet } from './motion.js';

import * as home from './views/home.js';
import * as standings from './views/standings.js';
import * as calendar from './views/calendar.js';
import * as race from './views/race.js';
import * as driversView from './views/drivers.js';
import * as driver from './views/driver.js';
import * as teams from './views/teams.js';
import * as team from './views/team.js';
import * as circuitsView from './views/circuits.js';
import * as circuit from './views/circuit.js';
import * as live from './views/live.js';
import * as pronos from './views/pronos.js';
import * as account from './views/account.js';
import * as privacy from './views/privacy.js';
import * as cookies from './views/cookies.js';
import { handleEmailReturn } from './auth.js';

// [motif, vue, rubrique du menu]
const ROUTES = [
  [/^\/?$/, home, ''],
  [/^\/direct$/, live, 'direct'],
  [/^\/classements(?:\/(pilotes|ecuries))?$/, standings, 'classements'],
  [/^\/calendrier$/, calendar, 'calendrier'],
  [/^\/course\/(\d+)$/, race, 'calendrier'],
  [/^\/pilotes$/, driversView, 'pilotes'],
  [/^\/pilotes\/([\w-]+)$/, driver, 'pilotes'],
  [/^\/ecuries$/, teams, 'ecuries'],
  [/^\/ecuries\/([\w-]+)$/, team, 'ecuries'],
  [/^\/circuits$/, circuitsView, 'circuits'],
  [/^\/circuits\/([\w-]+)$/, circuit, 'circuits'],
  [/^\/pronos$/, pronos, 'pronos'],
  [/^\/compte$/, account, 'compte'],
  [/^\/(?:rgpd|confidentialite)$/, privacy, ''],
  [/^\/cookies$/, cookies, ''],
];

const main = document.getElementById('main');
const nav = document.getElementById('site-nav');
const menuBtn = document.getElementById('menu-btn');
let cleanup = null;
let renderId = 0;

async function render() {
  const path = location.hash.replace(/^#/, '') || '/';
  const id = ++renderId;
  if (typeof cleanup === 'function') cleanup();
  cleanup = null;

  let view = null, params = [], section = '';
  for (const [re, v, s] of ROUTES) {
    const m = path.match(re);
    if (m) { view = v; params = m.slice(1); section = s; break; }
  }

  for (const a of nav.querySelectorAll('a')) {
    if (a.dataset.nav === section) a.setAttribute('aria-current', 'page');
    else a.removeAttribute('aria-current');
  }
  nav.classList.remove('open');
  menuBtn.setAttribute('aria-expanded', 'false');

  if (!view) {
    main.innerHTML = errorBox('Page introuvable', 'Cette adresse ne correspond à aucune page du site.');
    return;
  }

  main.innerHTML = '<div class="loading">Chargement…</div>';
  try {
    const html = await view.render(...params);
    if (id !== renderId) return; // l'utilisateur a changé de page entre-temps
    main.innerHTML = html;
    document.title = view.title ? `${view.title(...params)} · Le dernier virage` : 'Le dernier virage';
    if (view.mount) cleanup = view.mount(main, ...params);
    window.scrollTo(0, 0);
    enhance(main);
  } catch (e) {
    if (id !== renderId) return;
    console.error(e);
    main.innerHTML = errorBox('Données indisponibles', e.message || 'Impossible de charger les données.', true);
    main.querySelector('[data-retry]')?.addEventListener('click', render);
  }
}

function errorBox(title, msg, retry = false) {
  return `<div class="error-box"><h2>${esc(title)}</h2><p>${esc(msg)}</p>${retry ? '<button class="btn" data-retry>Réessayer</button>' : '<a class="btn" href="#/">Retour à l\'accueil</a>'}</div>`;
}

menuBtn.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuBtn.setAttribute('aria-expanded', String(open));
});

window.addEventListener('demo-mode', () => { document.getElementById('demo-banner').hidden = false; });
window.addEventListener('hashchange', render);

// Point rouge sur « Direct » quand une session est en cours.
async function updateLiveDot() {
  try {
    const races = await schedule();
    document.getElementById('nav-live-dot').hidden = !currentSession(races);
  } catch { /* sans importance */ }
}

// L'en-tête est fixe : on réserve sa hauteur en haut de la page.
const header = document.querySelector('.site-header');
function measureHeader() {
  if (header.classList.contains('compact') || nav.classList.contains('open')) return;
  document.documentElement.style.setProperty('--hdr-h', `${header.offsetHeight}px`);
}
measureHeader();
window.addEventListener('resize', measureHeader);
document.fonts?.ready.then(measureHeader);
initHeader(header);
initMagnet();

// Retour d'un lien reçu par e-mail (confirmation du compte, mot de passe oublié) : on ouvre la session d'abord.
if (/[?&](code|error_description)=/.test(location.search)) handleEmailReturn().finally(render);
else render();
updateLiveDot();
setInterval(updateLiveDot, 60_000);
