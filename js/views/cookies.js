// Cookies et stockage dans le navigateur : liste de ce qui est déposé, et bouton pour revoir ses choix publicitaires.
import { pageHead } from '../ui.js';
import { contactLine } from './privacy.js';

export const title = () => 'Cookies';

const ROWS = [
  ['Session de connexion', 'Le dernier virage (Supabase)', 'Te garder connecté à ton compte', 'Jusqu\'à la déconnexion', 'Nécessaire, sans consentement'],
  ['Copie des résultats', 'Le dernier virage', 'Charger les pages plus vite', '10 minutes, effacée à la fermeture de l\'onglet', 'Nécessaire, sans consentement'],
  ['Photos des voitures', 'Le dernier virage', 'Ne pas rechercher les photos à chaque visite', '7 jours', 'Nécessaire, sans consentement'],
  ['Choix de consentement', 'Google', 'Retenir ton accord ou ton refus pour la publicité', '13 mois maximum', 'Nécessaire, sans consentement'],
  ['Publicité', 'Google AdSense et ses partenaires', 'Afficher des publicités, les mesurer et, si tu l\'acceptes, les personnaliser', '13 mois maximum', 'Seulement avec ton accord'],
];

export function render() {
  return `${pageHead('Cookies', 'Ce que le site enregistre dans ton navigateur, et comment changer d\'avis.')}
    <div class="wrap section prose">
      <p>Un cookie est un petit fichier enregistré par ton navigateur. Le site utilise aussi le stockage local du navigateur, qui fonctionne de la même façon. Les deux sont décrits ici.</p>

      <h2>Ce qui est utilisé</h2>
    </div>
    <div class="wrap section">
      <div class="table-wrap"><table class="data cookie-table">
        <thead><tr><th>Quoi</th><th>Déposé par</th><th>À quoi ça sert</th><th>Durée</th><th>Accord</th></tr></thead>
        <tbody>${ROWS.map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody>
      </table></div>
    </div>
    <div class="wrap section prose">
      <h2>Ce qui ne demande pas ton accord</h2>
      <p>La session de connexion et les copies temporaires servent seulement à faire fonctionner le site. Elles ne te suivent pas d'un site à l'autre et ne sont partagées avec personne. La loi les autorise sans consentement.</p>

      <h2>La publicité</h2>
      <p>Le site affiche des publicités Google AdSense pour couvrir ses frais. À ta première visite, une fenêtre de Google te demande si tu acceptes les cookies publicitaires. Tu peux refuser aussi facilement qu'accepter, et le site reste entièrement utilisable. Si tu refuses, Google peut encore afficher des publicités non personnalisées.</p>
      <p>Détails sur l'utilisation des données par Google : <a href="https://policies.google.com/technologies/partner-sites?hl=fr" target="_blank" rel="noopener">comment Google utilise les données des sites partenaires</a>.</p>

      <h2>Changer d'avis</h2>
      <p>Tu peux revoir ton choix à tout moment avec ce bouton :</p>
      <p><button class="btn" type="button" id="consent-btn">Gérer mes choix de cookies</button></p>
      <p class="form-msg" id="consent-msg" role="status" aria-live="polite"></p>
      <p>Tu peux aussi effacer les cookies et le stockage du site dans les réglages de ton navigateur. Sur Chrome ou Edge : clique sur le cadenas à gauche de l'adresse, puis « Cookies et données de site ». Tu seras alors déconnecté de ton compte.</p>

      <h2>Contact</h2>
      <p>Pour toute question, contacte le responsable du site ${contactLine()}. Voir aussi la page <a href="#/rgpd">Données personnelles</a>.</p>
    </div>`;
}

export function mount(el) {
  el.querySelector('#consent-btn')?.addEventListener('click', () => {
    const msg = el.querySelector('#consent-msg');
    // Fenêtre de consentement de Google (Confidentialité et messages dans AdSense).
    const fc = window.googlefc;
    if (fc?.callbackQueue && typeof fc.showRevocationMessage === 'function') {
      fc.callbackQueue.push(fc.showRevocationMessage);
      msg.textContent = '';
    } else {
      msg.className = 'form-msg err';
      msg.textContent = 'La fenêtre de choix n\'a pas pu s\'ouvrir (bloqueur de publicité, ou elle n\'est pas encore activée). Tu peux effacer les cookies du site dans les réglages de ton navigateur.';
    }
  });
}
