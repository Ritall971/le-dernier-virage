// Fiches techniques et livrées des écuries. Données saisies à la main : à vérifier et compléter si besoin.
// Les livrées s'affichent avec une vraie photo Wikimedia Commons quand il en existe une, sinon en illustration (couleurs principale, secondaire, accent).

// Règlement technique 2026, commun à toutes les voitures.
export const SPECS_2026 = [
  ['Moteur', 'V6 1,6 L turbo hybride'],
  ['Répartition', 'environ 50 % thermique, 50 % électrique'],
  ['MGU-K', '350 kW (MGU-H supprimé)'],
  ['Carburant', '100 % durable'],
  ['Aérodynamique', 'ailerons avant et arrière mobiles'],
  ['Poids minimum', '768 kg avec pilote'],
  ['Empattement maxi', '3,40 m'],
  ['Largeur', '1,90 m'],
  ['Pneus', 'Pirelli 18 pouces'],
];

// q : recherche Wikipédia qui trouve l'article de la voiture (et donc sa photo).
const L = (year, car, primary, secondary, accent, note = '', q = '') => ({ year, car, primary, secondary, accent, note, q });

export const TEAM_DATA = {
  mercedes: {
    base: 'Brackley, Royaume-Uni', engine: 'Mercedes', car: 'W17',
    liveries: [
      L(2022, 'W13', '#c0c4c8', '#121212', '#00d2be', '', 'Mercedes-AMG F1 W13 Formula One car'),
      L(2023, 'W14', '#151515', '#c0c4c8', '#00d2be', '', 'Mercedes-AMG F1 W14 Formula One car'),
      L(2024, 'W15', '#151515', '#bfc3c7', '#00e5c8', '', 'Mercedes-AMG F1 W15 Formula One car'),
      L(2025, 'W16', '#141414', '#c9ccd0', '#00d7b6', '', 'Mercedes-AMG F1 W16 Formula One car'),
      L(2026, 'W17', '#c7cbcf', '#121212', '#00d2be', '', 'Mercedes-AMG F1 W17 Formula One car'),
    ],
  },
  ferrari: {
    base: 'Maranello, Italie', engine: 'Ferrari', car: 'SF-26',
    liveries: [
      L(2022, 'F1-75', '#d40000', '#141414', '#ffd600', '', 'Ferrari F1-75 Formula One car'),
      L(2023, 'SF-23', '#cc0000', '#141414', '#ffffff', '', 'Ferrari SF-23 Formula One car'),
      L(2024, 'SF-24', '#d00000', '#ffd600', '#ffffff', '', 'Ferrari SF-24 Formula One car'),
      L(2025, 'SF-25', '#e10600', '#ffffff', '#141414', '', 'Ferrari SF-25 Formula One car'),
      L(2026, 'SF-26', '#e8002d', '#141414', '#ffffff', '', 'Ferrari SF-26 Formula One car'),
    ],
  },
  mclaren: {
    base: 'Woking, Royaume-Uni', engine: 'Mercedes', car: 'MCL40',
    liveries: [
      L(2022, 'MCL36', '#ff8000', '#47c7fc', '#141414', '', 'McLaren MCL36 Formula One car'),
      L(2023, 'MCL60', '#ff8000', '#141414', '#47c7fc', '', 'McLaren MCL60 Formula One car'),
      L(2024, 'MCL38', '#ff8000', '#141414', '#ffffff', '', 'McLaren MCL38 Formula One car'),
      L(2025, 'MCL39', '#ff8000', '#141414', '#ffffff', '', 'McLaren MCL39 Formula One car'),
      L(2026, 'MCL40', '#ff8000', '#141414', '#e0e0e0', '', 'McLaren MCL40 Formula One car'),
    ],
  },
  red_bull: {
    base: 'Milton Keynes, Royaume-Uni', engine: 'Red Bull Ford', car: 'RB22',
    liveries: [
      L(2022, 'RB18', '#1e2a5a', '#e30613', '#ffcc00', '', 'Red Bull Racing RB18 Formula One car'),
      L(2023, 'RB19', '#1e2a5a', '#e30613', '#ffcc00', '', 'Red Bull Racing RB19 Formula One car'),
      L(2024, 'RB20', '#1b2550', '#e30613', '#ffcc00', '', 'Red Bull Racing RB20 Formula One car'),
      L(2025, 'RB21', '#1b2550', '#e30613', '#ffcc00', '', 'Red Bull Racing RB21 Formula One car'),
      L(2026, 'RB22', '#1b2550', '#e30613', '#ffcc00', '', 'Red Bull Racing RB22 Formula One car'),
    ],
  },
  aston_martin: {
    base: 'Silverstone, Royaume-Uni', engine: 'Honda', car: 'AMR26',
    liveries: [
      L(2022, 'AMR22', '#00594f', '#ff5fa2', '#cedc00', '', 'Aston Martin AMR22 Formula One car'),
      L(2023, 'AMR23', '#00594f', '#cedc00', '#ffffff', '', 'Aston Martin AMR23 Formula One car'),
      L(2024, 'AMR24', '#00574b', '#cedc00', '#ffffff', '', 'Aston Martin AMR24 Formula One car'),
      L(2025, 'AMR25', '#00594f', '#cedc00', '#ffffff', '', 'Aston Martin AMR25 Formula One car'),
      L(2026, 'AMR26', '#00665e', '#cedc00', '#ffffff', '', 'Aston Martin AMR26 Formula One car'),
    ],
  },
  alpine: {
    base: 'Enstone, Royaume-Uni', engine: 'Mercedes', car: 'A526',
    liveries: [
      L(2022, 'A522', '#0090ff', '#ff87bc', '#141414', '', 'Alpine A522 Formula One car'),
      L(2023, 'A523', '#0a2a6b', '#ff87bc', '#0090ff', '', 'Alpine A523 Formula One car'),
      L(2024, 'A524', '#0a1f5c', '#ff87bc', '#0090ff', '', 'Alpine A524 Formula One car'),
      L(2025, 'A525', '#ff87bc', '#0a1f5c', '#0090ff', '', 'Alpine A525 Formula One car'),
      L(2026, 'A526', '#ff87bc', '#0a1f5c', '#0090ff', '', 'Alpine A526 Formula One car'),
    ],
  },
  williams: {
    base: 'Grove, Royaume-Uni', engine: 'Mercedes', car: 'FW48',
    liveries: [
      L(2022, 'FW44', '#00205b', '#00a0de', '#ffffff', '', 'Williams FW44 Formula One car'),
      L(2023, 'FW45', '#041e42', '#00a0de', '#e4002b', '', 'Williams FW45 Formula One car'),
      L(2024, 'FW46', '#041e42', '#00a0de', '#ffffff', '', 'Williams FW46 Formula One car'),
      L(2025, 'FW47', '#041e42', '#1868db', '#ffffff', '', 'Williams FW47 Formula One car'),
      L(2026, 'FW48', '#041e42', '#1868db', '#ffffff', '', 'Williams FW48 Formula One car'),
    ],
  },
  rb: {
    base: 'Faenza, Italie', engine: 'Red Bull Ford', car: 'VCARB 03',
    liveries: [
      L(2022, 'AT03', '#1b2a4a', '#ffffff', '#e30613', 'AlphaTauri', 'AlphaTauri AT03 Formula One car'),
      L(2023, 'AT04', '#1b2a4a', '#ffffff', '#e30613', 'AlphaTauri', 'AlphaTauri AT04 Formula One car'),
      L(2024, 'VCARB 01', '#ffffff', '#1634cc', '#e30613', 'Visa Cash App RB', 'RB VCARB 01 Formula One car'),
      L(2025, 'VCARB 02', '#ffffff', '#1634cc', '#e30613', 'Racing Bulls', 'Racing Bulls VCARB 02 Formula One car'),
      L(2026, 'VCARB 03', '#ffffff', '#1634cc', '#e30613', 'Racing Bulls', 'Racing Bulls VCARB 03 Formula One car'),
    ],
  },
  haas: {
    base: 'Kannapolis, États-Unis', engine: 'Ferrari', car: 'VF-26',
    liveries: [
      L(2022, 'VF-22', '#ffffff', '#e6002b', '#0d1b3e', '', 'Haas VF-22 Formula One car'),
      L(2023, 'VF-23', '#141414', '#ffffff', '#e6002b', '', 'Haas VF-23 Formula One car'),
      L(2024, 'VF-24', '#f2f2f2', '#141414', '#e6002b', '', 'Haas VF-24 Formula One car'),
      L(2025, 'VF-25', '#f2f2f2', '#141414', '#e6002b', '', 'Haas VF-25 Formula One car'),
      L(2026, 'VF-26', '#f2f2f2', '#141414', '#e6002b', '', 'Haas VF-26 Formula One car'),
    ],
  },
  audi: {
    base: 'Hinwil, Suisse', engine: 'Audi', car: 'R26',
    liveries: [
      L(2022, 'C42', '#ffffff', '#9b0000', '#141414', 'Alfa Romeo (Sauber)', 'Alfa Romeo C42 Formula One car'),
      L(2023, 'C43', '#9b0000', '#141414', '#ffffff', 'Alfa Romeo (Sauber)', 'Alfa Romeo C43 Formula One car'),
      L(2024, 'C44', '#141414', '#52e252', '#141414', 'Stake (Sauber)', 'Kick Sauber C44 Formula One car'),
      L(2025, 'C45', '#141414', '#52e252', '#ffffff', 'Kick Sauber', 'Kick Sauber C45 Formula One car'),
      L(2026, 'R26', '#b8bec4', '#141414', '#e4002b', 'Audi', 'Audi R26 Formula One car'),
    ],
  },
  cadillac: {
    base: 'Fishers, États-Unis', engine: 'Ferrari', car: 'Cadillac 2026',
    liveries: [
      L(2026, 'Cadillac 2026', '#141414', '#f2f2f2', '#d9b45a', 'Première saison', 'Cadillac Formula One Team 2026 car'),
    ],
  },
};
