// Comptes des joueurs (Supabase). La bibliothèque n'est chargée que sur les pages qui en ont besoin.
import { CONFIG } from './config.js';

let clientP = null;

export function sb() {
  clientP ??= import('./vendor/supabase.js').then(({ createClient }) =>
    createClient(CONFIG.supabaseUrl, CONFIG.supabaseAnonKey, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true, flowType: 'pkce' },
    }));
  return clientP;
}

export async function currentUser() {
  const client = await sb();
  const { data } = await client.auth.getSession();
  return data.session?.user ?? null;
}

// Adresse de retour des e-mails (confirmation, mot de passe oublié) : la page d'accueil du site.
export const returnUrl = () => `${location.origin}${location.pathname}`;

// Au retour d'un lien reçu par e-mail, l'adresse contient « ?code=… » : on ouvre la session puis on nettoie l'adresse.
export async function handleEmailReturn() {
  const q = new URLSearchParams(location.search);
  if (!q.has('code') && !q.has('error_description')) return false;
  const client = await sb();
  // La bibliothèque échange elle-même le code contre une session à son démarrage (detectSessionInUrl).
  await client.auth.getSession();
  history.replaceState(null, '', `${location.pathname}#/compte`);
  return true;
}

// Messages d'erreur Supabase traduits pour les joueurs.
export function authError(e) {
  const m = String(e?.message || e || '');
  if (/invalid login credentials/i.test(m)) return 'E-mail ou mot de passe incorrect.';
  if (/email not confirmed/i.test(m)) return 'Confirme d\'abord ton adresse avec le lien reçu par e-mail.';
  if (/already registered|already been registered/i.test(m)) return 'Un compte existe déjà avec cette adresse.';
  if (/password.*(6|characters)/i.test(m)) return 'Le mot de passe doit faire au moins 6 caractères.';
  if (/rate limit|too many/i.test(m)) return 'Trop de tentatives, réessaie dans quelques minutes.';
  if (/fermés/i.test(m)) return 'Les pronostics de cette course sont fermés.';
  if (/duplicate key.*pseudo|profiles_pseudo_key/i.test(m)) return 'Ce pseudo est déjà pris.';
  if (/failed to fetch|network/i.test(m)) return 'Connexion au serveur impossible. Vérifie ta connexion internet.';
  return m || 'Une erreur est survenue.';
}
