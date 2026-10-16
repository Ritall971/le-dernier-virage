# Le dernier virage

Site de suivi de la saison de Formule 1 : direct, classements, calendrier, résultats, pilotes, écuries et circuits.
Site statique (HTML, CSS, JavaScript), sans installation ni compilation.

## Ouvrir le site sur ton PC Windows

Les navigateurs bloquent les modules JavaScript ouverts en double-cliquant sur `index.html`. Il faut un petit serveur local :

```powershell
cd chemin\vers\le-dernier-virage
python -m http.server 8000
```

Puis ouvre http://localhost:8000 dans le navigateur. (Avec Node : `npx serve .`)

## Mettre en ligne gratuitement

- **GitHub Pages** : pousse le dossier dans un dépôt GitHub, puis Settings > Pages > Deploy from a branch > `main` / racine.
- **Netlify** ou **Vercel** : glisse-dépose le dossier sur leur site, aucune configuration.

## Organisation

| Fichier | Rôle |
|---|---|
| `index.html` | Squelette de la page : en-tête, menu, pied de page |
| `css/style.css` | Tout le design « Livrée » : carbone, cartes coupées, vibreur, mobile |
| `js/config.js` | Adresses des API et fréquences de rafraîchissement (seul fichier à régler) |
| `js/app.js` | Navigation entre les pages (`#/classements`, `#/pilotes/norris`…) |
| `js/api.js` | Appels aux API, cache de 10 min, bascule sur les données d'exemple si hors ligne |
| `js/season.js` | Logique du week-end : sessions, session en cours, prochaine course |
| `js/teams.js` | Couleurs des écuries |
| `js/fmt.js` | Dates en français, traductions, mise en forme |
| `js/ui.js` | Éléments réutilisés : cartes pilotes, lignes de classement, lignes de calendrier |
| `js/views/*.js` | Une page par fichier |
| `js/motion.js` | Animations : apparitions au scroll, en-tête compact, boutons magnétiques, chiffres qui défilent (désactivées si le système demande moins d'animations) |
| `js/circuit-maps.js` | Tracés des circuits, générés depuis [bacinger/f1-circuits](https://github.com/bacinger/f1-circuits) (licence MIT) |
| `js/team-data.js` | Châssis, moteur, base et livrées de chaque écurie : saisi à la main, à corriger ici si besoin |
| `js/demo.js` | Données d'exemple tirées au sort (jamais affichées quand l'API répond) |

## Sources de données

- **Jolpica F1** (gratuit, sans clé) : calendrier, résultats, qualifications, sprints, classements. Mis à jour quelques heures après chaque course.
- **OpenF1** : positions, écarts et messages de la direction de course. En gratuit, les données d'une session arrivent environ 30 minutes après sa fin. Le vrai direct demande l'abonnement OpenF1 et un petit serveur relais qui ajoute le jeton : on ne met jamais d'identifiants dans un site public.
