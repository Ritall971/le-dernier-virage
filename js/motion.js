// Animations : apparitions au scroll, en-tête compact, boutons magnétiques, chiffres qui défilent.
// Tout passe par transform/opacity (gérés par la carte graphique) et requestAnimationFrame pour rester à 60 i/s.
// Rien ne bouge si le visiteur a demandé à réduire les animations dans son système.

const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
const enabled = !reduce && 'IntersectionObserver' in window;

if (enabled) document.documentElement.classList.add('motion');

// ---------- Apparitions au scroll ----------
const REVEAL = '.hero__inner, .page-head, .section__head, .card, .row, .race, .stat, .chart, .table-wrap, .session, .profile__inner, .track-wrap, .car-hero, .specs > div, .livery, .notice, .rc, .tabs';
const COUNT = '.card__stat, .row__pts, .stat b';

const io = enabled ? new IntersectionObserver((entries) => {
  for (const e of entries) {
    if (!e.isIntersecting) continue;
    const el = e.target;
    io.unobserve(el);
    el.classList.add('in');
    for (const n of el.matches(COUNT) ? [el] : el.querySelectorAll(COUNT)) countUp(n);
    // Une fois l'animation finie, on libère la couche graphique.
    el.addEventListener('transitionend', () => el.classList.add('done'), { once: true });
  }
}, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 }) : null;

export function enhance(root) {
  if (!enabled) return;
  const els = root.querySelectorAll(REVEAL);
  const groups = new Map();
  for (const el of els) {
    if (el.parentElement.closest('.rv')) continue; // le parent apparaît déjà, pas de double animation
    // Décalage en cascade entre éléments frères, plafonné pour ne pas faire attendre.
    const i = groups.get(el.parentElement) ?? 0;
    groups.set(el.parentElement, i + 1);
    el.style.setProperty('--d', `${Math.min(i, 10) * 45}ms`);
    el.classList.add('rv');
    io.observe(el);
  }
}

// ---------- Chiffres qui défilent ----------
const ease = (t) => 1 - Math.pow(1 - t, 3);

function countUp(el) {
  if (el.dataset.counted) return;
  el.dataset.counted = '1';
  const node = [...el.childNodes].find((n) => n.nodeType === 3 && /\d/.test(n.textContent));
  if (!node) return;
  const m = node.textContent.match(/^(\D*)(\d+)(\D*)$/);
  if (!m) return;
  const [, pre, num, post] = m;
  const target = Number(num);
  if (target < 2) return;
  const dur = Math.min(1200, 500 + target * 2);
  let start = null;
  const step = (t) => {
    start ??= t;
    const p = Math.min(1, (t - start) / dur);
    node.textContent = `${pre}${Math.round(target * ease(p))}${post}`;
    if (p < 1) requestAnimationFrame(step);
  };
  node.textContent = `${pre}0${post}`;
  requestAnimationFrame(step);
}

// ---------- En-tête qui se compacte ----------
export function initHeader(header) {
  let compact = false;
  let ticking = false;
  const update = () => {
    ticking = false;
    const want = window.scrollY > 40;
    if (want !== compact) {
      compact = want;
      header.classList.toggle('compact', compact);
    }
  };
  window.addEventListener('scroll', () => {
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  }, { passive: true });
  update();
}

// ---------- Boutons magnétiques ----------
const MAGNET = '.btn, .tabs a, .tabs button, .link-more, .map-link, .site-nav a, .logo, .menu-btn';

export function initMagnet() {
  if (!enabled || !finePointer) return;
  let active = null;
  let frame = 0;
  let tx = 0, ty = 0;

  const apply = () => {
    frame = 0;
    if (active) active.style.translate = `${tx}px ${ty}px`;
  };

  document.addEventListener('pointermove', (e) => {
    const el = e.target.closest(MAGNET);
    if (el !== active) {
      if (active) release(active);
      active = el;
      if (active) active.classList.add('magnet');
    }
    if (!active) return;
    const r = active.getBoundingClientRect();
    const strength = Math.min(10, Math.max(4, r.width / 14));
    tx = ((e.clientX - (r.left + r.width / 2)) / (r.width / 2)) * strength;
    ty = ((e.clientY - (r.top + r.height / 2)) / (r.height / 2)) * strength * 0.6;
    if (!frame) frame = requestAnimationFrame(apply);
  }, { passive: true });

  document.addEventListener('pointerleave', () => { if (active) { release(active); active = null; } });
  window.addEventListener('blur', () => { if (active) { release(active); active = null; } });

  function release(el) {
    el.classList.remove('magnet');
    el.style.translate = '';
  }
}
