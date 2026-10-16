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
};
