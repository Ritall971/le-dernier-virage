// Confidentialité : informations RGPD sur les comptes joueurs et la publicité.
import { CONFIG } from '../config.js';
import { esc } from '../fmt.js';
import { pageHead } from '../ui.js';

export const title = () => 'Confidentialité';

export function render() {
  const contact = CONFIG.contactEmail
    ? `à l'adresse <a href="mailto:${esc(CONFIG.contactEmail)}">${esc(CONFIG.contactEmail)}</a>`
    : 'via la personne qui t\'a partagé le site';
  return `${pageHead('Confidentialité', 'Ce que le site garde sur toi, pourquoi, et comment l\'effacer.')}
    <div class="wrap section prose">
      <h2>Qui est responsable</h2>
      <p>Le dernier virage est un site de passionnés, non officiel. Pour toute question sur tes données, contacte son créateur ${contact}.</p>

      <h2>Ce qui est enregistré</h2>
      <p>Seulement si tu crées un compte : ton adresse e-mail, ton mot de passe (chiffré, personne ne peut le lire), ton pseudo, tes pronostics et tes points.</p>
      <p>Ton pseudo, tes points et tes pronostics (une fois la course partie) sont visibles par tous les visiteurs. Ton e-mail n'est jamais affiché ni partagé.</p>

      <h2>Pourquoi</h2>
      <p>Uniquement pour faire fonctionner le jeu de pronostics : te connecter, enregistrer tes choix et calculer le classement. Aucune donnée n'est vendue ni utilisée pour de la prospection.</p>

      <h2>Où et combien de temps</h2>
      <p>Les comptes sont stockés chez Supabase, le service de base de données du site, et le site est hébergé par Netlify. Tes données sont gardées tant que ton compte existe.</p>

      <h2>Tes droits</h2>
      <p>Tu peux consulter et corriger tes informations dans <a href="#/compte">Mon compte</a>, et supprimer ton compte d'un clic : tout est alors effacé définitivement. Tu peux aussi porter réclamation auprès de la <a href="https://www.cnil.fr/fr/plaintes" target="_blank" rel="noopener">CNIL</a>.</p>

      <h2>Stockage dans le navigateur et publicité</h2>
      <p>Le site garde dans ton navigateur ta session de connexion et une copie temporaire des résultats, pour aller plus vite. C'est nécessaire au fonctionnement et ne sert pas à te suivre.</p>
      <p>Le site affiche des publicités Google AdSense. Google peut utiliser des cookies pour personnaliser ces publicités, seulement avec ton accord, que tu donnes ou refuses dans la fenêtre de consentement affichée par Google. Plus d'informations sur <a href="https://policies.google.com/technologies/ads?hl=fr" target="_blank" rel="noopener">la page de Google sur la publicité</a>.</p>

      <h2>Données sportives</h2>
      <p>Résultats et calendrier : <a href="https://github.com/jolpica/jolpica-f1" target="_blank" rel="noopener">Jolpica F1</a> et <a href="https://openf1.org" target="_blank" rel="noopener">OpenF1</a>. Photos des voitures : Wikimedia Commons, avec le nom de chaque auteur.</p>
    </div>`;
}
