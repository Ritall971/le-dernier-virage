// Données personnelles (RGPD) : ce que le site enregistre sur les joueurs, pourquoi, et leurs droits.
import { CONFIG } from '../config.js';
import { esc } from '../fmt.js';
import { pageHead } from '../ui.js';

export const title = () => 'Données personnelles';

export function contactLine() {
  return CONFIG.contactEmail
    ? `par e-mail à <a href="mailto:${esc(CONFIG.contactEmail)}">${esc(CONFIG.contactEmail)}</a>`
    : 'via la personne qui t\'a partagé le site';
}

export function render() {
  return `${pageHead('Données personnelles', 'Politique de confidentialité (RGPD). Mise à jour le 16 octobre 2026.')}
    <div class="wrap section prose">
      <p>Le dernier virage est un site de passionnés, non officiel et sans lien avec la Formula 1. On peut le consulter sans compte et sans donner aucune information. Cette page explique ce qui se passe quand tu crées un compte pour jouer aux pronostics. Pour les cookies et le stockage dans le navigateur, voir la page <a href="#/cookies">Cookies</a>.</p>

      <h2>Responsable du traitement</h2>
      <p>Le créateur du site Le dernier virage, joignable ${contactLine()}.</p>

      <h2>Données collectées</h2>
      <ul>
        <li><b>Compte :</b> adresse e-mail, mot de passe (stocké chiffré, personne ne peut le lire) ou identifiant Google si tu te connectes avec Google, et pseudo.</li>
        <li><b>Jeu :</b> tes pronostics, tes points et ton classement.</li>
        <li><b>Technique :</b> date de création du compte et de dernière connexion, gardées par le service d'authentification pour la sécurité.</li>
      </ul>
      <p>Si tu utilises la connexion Google, le site reçoit seulement ton adresse e-mail et ton nom. Ton prénom sert de pseudo de départ, modifiable à tout moment.</p>

      <h2>Pourquoi et sur quelle base</h2>
      <ul>
        <li><b>Faire fonctionner le jeu</b> (te connecter, enregistrer tes pronostics, calculer le classement) : exécution du service que tu demandes en créant un compte (article 6.1.b du RGPD).</li>
        <li><b>Sécurité du site</b> (éviter les abus et la triche) : intérêt légitime (article 6.1.f).</li>
        <li><b>Publicité</b> : seulement avec ton consentement, voir la page <a href="#/cookies">Cookies</a>.</li>
      </ul>
      <p>Aucune donnée n'est vendue, louée ni utilisée pour de la prospection. Le site n'envoie pas de newsletter.</p>

      <h2>Qui voit quoi</h2>
      <p>Ton pseudo, tes points et tes pronostics (une fois la course partie) sont visibles par tous les visiteurs, dans le classement. Ton e-mail n'est jamais affiché.</p>
      <p>Prestataires techniques qui hébergent les données pour le compte du site :</p>
      <ul>
        <li><b>Supabase</b> : base de données et comptes.</li>
        <li><b>Netlify</b> : hébergement du site.</li>
        <li><b>Google</b> : connexion avec Google si tu la choisis, et publicités AdSense.</li>
      </ul>
      <p>Certains de ces prestataires sont situés aux États-Unis. Les transferts sont encadrés par le cadre de protection des données UE–États-Unis (Data Privacy Framework) ou par les clauses contractuelles types de la Commission européenne.</p>

      <h2>Durée de conservation</h2>
      <p>Tes données sont gardées tant que ton compte existe. Quand tu le supprimes, ton e-mail, ton pseudo, tes pronostics et tes points sont effacés immédiatement et définitivement. Un compte inactif depuis 3 ans peut être supprimé.</p>

      <h2>Tes droits</h2>
      <p>Tu as le droit d'accéder à tes données, de les corriger, de les effacer, de les récupérer (portabilité), de limiter leur utilisation et de t'y opposer.</p>
      <ul>
        <li>Dans <a href="#/compte">Mon compte</a>, tu peux voir tes pronostics, changer ton pseudo et ton mot de passe, et supprimer ton compte d'un clic.</li>
        <li>Pour toute autre demande, contacte le responsable ${contactLine()}. Une réponse est donnée sous un mois.</li>
        <li>Si tu estimes que tes droits ne sont pas respectés, tu peux porter réclamation auprès de la <a href="https://www.cnil.fr/fr/plaintes" target="_blank" rel="noopener">CNIL</a>.</li>
      </ul>

      <h2>Âge minimum</h2>
      <p>Il faut avoir au moins 15 ans pour créer un compte, ou l'accord d'un parent en dessous (article 45 de la loi Informatique et Libertés).</p>

      <h2>Sécurité</h2>
      <p>Les échanges sont chiffrés (HTTPS), les mots de passe sont stockés chiffrés et chaque joueur ne peut modifier que ses propres données, contrôlé directement par la base de données.</p>

      <h2>Sources des données sportives</h2>
      <p>Résultats et calendrier : <a href="https://github.com/jolpica/jolpica-f1" target="_blank" rel="noopener">Jolpica F1</a> et <a href="https://openf1.org" target="_blank" rel="noopener">OpenF1</a>. Photos des voitures : Wikimedia Commons, avec le nom de chaque auteur.</p>
    </div>`;
}
