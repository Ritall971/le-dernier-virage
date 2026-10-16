// Réglages du site. C'est le seul fichier à modifier pour changer de source de données.
export const CONFIG = {
  // API Jolpica (successeur d'Ergast) : calendrier, résultats, classements, pilotes, écuries, circuits.
  jolpica: 'https://api.jolpi.ca/ergast/f1',

  // API OpenF1 : positions, écarts et messages de la direction de course.
  // En gratuit, les données d'une session arrivent environ 30 min après sa fin.
  // Pour le vrai direct (abonnement OpenF1), remplace cette adresse par celle de ton petit serveur relais
  // qui ajoute le jeton d'accès : ne mets jamais d'identifiants directement dans ce fichier.
  openf1: 'https://api.openf1.org/v1',

  // Durée de cache des données de saison dans le navigateur (en minutes).
  cacheMinutes: 10,

  // Fréquence de rafraîchissement de la page Direct pendant une session (en secondes).
  // OpenF1 gratuit autorise 30 requêtes par minute, une mise à jour en coûte 4.
  liveRefreshSeconds: 15,

  // Supabase : comptes des joueurs, pronostics et classement.
  // La clé « anon » est faite pour être publique : la sécurité est assurée par les règles de supabase/schema.sql.
  // Ne mets jamais ici la clé « service_role ».
  supabaseUrl: 'https://ysfbhegmxwnfrmpcvvxu.supabase.co',
  supabaseAnonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlzZmJoZWdteHduZnJtcGN2dnh1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTIxNTQwNjksImV4cCI6MjEwNzczMDA2OX0.RyKaYY6GB_3uRW15tsKx8P3vTWdCUv9y9uV4eBpHhOM',

  // Adresse de contact affichée sur la page Confidentialité (obligatoire avec le RGPD). À remplir.
  contactEmail: '',
};
