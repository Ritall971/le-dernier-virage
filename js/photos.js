// Vraies photos des voitures, chargées par le navigateur du visiteur depuis Wikipédia et Wikimedia Commons.
// On ne garde que les images libres de droits hébergées sur Commons, avec l'auteur et la licence à afficher.
// Si rien n'est trouvé (voiture trop récente, réseau coupé), la page garde l'illustration.

const WIKI = 'https://en.wikipedia.org/w/api.php';
const COMMONS = 'https://commons.wikimedia.org/w/api.php';
const TTL = 7 * 24 * 3600_000;

function load(key) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return undefined;
    const { t, v } = JSON.parse(raw);
    return Date.now() - t < TTL ? v : undefined;
  } catch { return undefined; }
}
function save(key, v) {
  try { localStorage.setItem(key, JSON.stringify({ t: Date.now(), v })); } catch { /* sans importance */ }
}

const strip = (html = '') => html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();

async function api(base, params) {
  const url = `${base}?${new URLSearchParams({ format: 'json', origin: '*', ...params })}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(String(res.status));
  return res.json();
}

// Cherche l'article Wikipédia de la voiture et sa photo principale.
async function find(query, must) {
  const d = await api(WIKI, {
    action: 'query', generator: 'search', gsrsearch: query, gsrlimit: '1', gsrnamespace: '0',
    prop: 'pageimages', piprop: 'name|thumbnail', pithumbsize: '1200',
  });
  const page = Object.values(d.query?.pages || {})[0];
  if (!page?.pageimage) return null;
  // L'article trouvé doit bien parler de cette voiture (sinon on risquerait la photo d'une autre saison).
  const norm = (t) => t.toLowerCase().replace(/[^a-z0-9]/g, '');
  if (must && !norm(page.title).includes(norm(must))) return null;

  // Vérifie que l'image est sur Commons (donc sous licence libre) et récupère l'auteur et la licence.
  const c = await api(COMMONS, {
    action: 'query', titles: `File:${page.pageimage}`, prop: 'imageinfo',
    iiprop: 'url|extmetadata', iiurlwidth: '1200',
  });
  const file = Object.values(c.query?.pages || {})[0];
  const info = file?.imageinfo?.[0];
  if (!info || file.missing !== undefined) return null; // image non libre, hébergée seulement sur Wikipédia
  const meta = info.extmetadata || {};
  return {
    src: info.thumburl || info.url,
    page: info.descriptionurl,
    article: `https://en.wikipedia.org/wiki/${encodeURIComponent(page.title.replace(/ /g, '_'))}`,
    title: page.title,
    author: strip(meta.Artist?.value) || 'auteur inconnu',
    license: strip(meta.LicenseShortName?.value) || 'licence libre',
  };
}

const inflight = new Map();
export function carPhoto(query, must = '') {
  if (!query) return Promise.resolve(null);
  const key = `photo:${query}|${must}`;
  const cached = load(key);
  if (cached !== undefined) return Promise.resolve(cached);
  if (!inflight.has(key)) {
    inflight.set(key, find(query, must)
      .then((v) => { save(key, v); return v; })
      .catch(() => null));
  }
  return inflight.get(key);
}

// Remplace les illustrations [data-photo] par la vraie photo quand elle est trouvée.
export function hydratePhotos(root) {
  for (const box of root.querySelectorAll('[data-photo]')) {
    carPhoto(box.dataset.photo, box.dataset.must).then((p) => {
      if (!p || !box.isConnected) return;
      const img = new Image();
      img.decoding = 'async';
      img.alt = p.title;
      img.className = 'car-photo';
      img.onload = () => {
        box.querySelector('.car')?.remove();
        box.prepend(img);
        requestAnimationFrame(() => img.classList.add('loaded'));
        const credit = document.createElement('a');
        credit.className = 'credit';
        credit.href = p.page;
        credit.target = '_blank';
        credit.rel = 'noopener';
        credit.textContent = `Photo : ${p.author}, ${p.license}, via Wikimedia Commons`;
        box.append(credit);
      };
      img.src = p.src;
    });
  }
}
