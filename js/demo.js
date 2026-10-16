// Données d'EXEMPLE, utilisées seulement quand la vraie source est injoignable (aperçu hors ligne, tests).
// Les résultats sont tirés au sort de façon reproductible : ce ne sont pas les vrais résultats.

const TEAMS = [
  ['mercedes', 'Mercedes', 'German', 1.0],
  ['ferrari', 'Ferrari', 'Italian', 0.92],
  ['mclaren', 'McLaren', 'British', 0.9],
  ['red_bull', 'Red Bull', 'Austrian', 0.88],
  ['rb', 'RB F1 Team', 'Italian', 0.62],
  ['alpine', 'Alpine F1 Team', 'French', 0.56],
  ['haas', 'Haas F1 Team', 'American', 0.52],
  ['williams', 'Williams', 'British', 0.5],
  ['audi', 'Audi', 'German', 0.47],
  ['aston_martin', 'Aston Martin', 'British', 0.46],
  ['cadillac', 'Cadillac F1 Team', 'American', 0.3],
];

const DRIVERS = [
  ['antonelli', 'ANT', 12, 'Andrea Kimi', 'Antonelli', 'Italian', '2006-08-25', 'mercedes', 1.08],
  ['russell', 'RUS', 63, 'George', 'Russell', 'British', '1998-02-15', 'mercedes', 1.0],
  ['hamilton', 'HAM', 44, 'Lewis', 'Hamilton', 'British', '1985-01-07', 'ferrari', 1.0],
  ['leclerc', 'LEC', 16, 'Charles', 'Leclerc', 'Monegasque', '1997-10-16', 'ferrari', 1.0],
  ['norris', 'NOR', 4, 'Lando', 'Norris', 'British', '1999-11-13', 'mclaren', 1.0],
  ['piastri', 'PIA', 81, 'Oscar', 'Piastri', 'Australian', '2001-04-06', 'mclaren', 0.95],
  ['max_verstappen', 'VER', 1, 'Max', 'Verstappen', 'Dutch', '1997-09-30', 'red_bull', 1.08],
  ['hadjar', 'HAD', 6, 'Isack', 'Hadjar', 'French', '2004-09-28', 'red_bull', 0.9],
  ['lawson', 'LAW', 30, 'Liam', 'Lawson', 'New Zealander', '2002-02-11', 'rb', 1.0],
  ['lindblad', 'LIN', 41, 'Arvid', 'Lindblad', 'British', '2007-08-08', 'rb', 0.97],
  ['gasly', 'GAS', 10, 'Pierre', 'Gasly', 'French', '1996-02-07', 'alpine', 1.0],
  ['colapinto', 'COL', 43, 'Franco', 'Colapinto', 'Argentine', '2003-05-27', 'alpine', 0.96],
  ['bearman', 'BEA', 87, 'Oliver', 'Bearman', 'British', '2005-05-08', 'haas', 1.0],
  ['ocon', 'OCO', 31, 'Esteban', 'Ocon', 'French', '1996-09-17', 'haas', 0.98],
  ['albon', 'ALB', 23, 'Alexander', 'Albon', 'Thai', '1996-03-23', 'williams', 1.0],
  ['sainz', 'SAI', 55, 'Carlos', 'Sainz', 'Spanish', '1994-09-01', 'williams', 1.0],
  ['hulkenberg', 'HUL', 27, 'Nico', 'Hülkenberg', 'German', '1987-08-19', 'audi', 1.0],
  ['bortoleto', 'BOR', 5, 'Gabriel', 'Bortoleto', 'Brazilian', '2004-10-14', 'audi', 0.98],
  ['alonso', 'ALO', 14, 'Fernando', 'Alonso', 'Spanish', '1981-07-29', 'aston_martin', 1.0],
  ['stroll', 'STR', 18, 'Lance', 'Stroll', 'Canadian', '1998-10-29', 'aston_martin', 0.94],
  ['perez', 'PER', 11, 'Sergio', 'Pérez', 'Mexican', '1990-01-26', 'cadillac', 1.0],
  ['bottas', 'BOT', 77, 'Valtteri', 'Bottas', 'Finnish', '1989-08-28', 'cadillac', 1.0],
];

// [nom, circuitId, circuit, ville, pays, lat, long, date de la course, sprint ?]
const CAL = [
  ['Australian Grand Prix', 'albert_park', 'Albert Park Grand Prix Circuit', 'Melbourne', 'Australia', -37.8497, 144.968, '2026-03-08', false],
  ['Chinese Grand Prix', 'shanghai', 'Shanghai International Circuit', 'Shanghai', 'China', 31.3389, 121.22, '2026-03-15', true],
  ['Japanese Grand Prix', 'suzuka', 'Suzuka Circuit', 'Suzuka', 'Japan', 34.8431, 136.541, '2026-03-29', false],
  ['Miami Grand Prix', 'miami', 'Miami International Autodrome', 'Miami', 'USA', 25.9581, -80.2389, '2026-05-03', true],
  ['Canadian Grand Prix', 'villeneuve', 'Circuit Gilles Villeneuve', 'Montréal', 'Canada', 45.5, -73.5228, '2026-05-24', true],
  ['Monaco Grand Prix', 'monaco', 'Circuit de Monaco', 'Monte-Carlo', 'Monaco', 43.7347, 7.42056, '2026-06-07', false],
  ['Barcelona-Catalunya Grand Prix', 'catalunya', 'Circuit de Barcelona-Catalunya', 'Montmeló', 'Spain', 41.57, 2.26111, '2026-06-14', false],
  ['Austrian Grand Prix', 'red_bull_ring', 'Red Bull Ring', 'Spielberg', 'Austria', 47.2197, 14.7647, '2026-06-28', false],
  ['British Grand Prix', 'silverstone', 'Silverstone Circuit', 'Silverstone', 'UK', 52.0786, -1.01694, '2026-07-05', true],
  ['Belgian Grand Prix', 'spa', 'Circuit de Spa-Francorchamps', 'Spa', 'Belgium', 50.4372, 5.97139, '2026-07-19', false],
  ['Hungarian Grand Prix', 'hungaroring', 'Hungaroring', 'Budapest', 'Hungary', 47.5789, 19.2486, '2026-07-26', false],
  ['Dutch Grand Prix', 'zandvoort', 'Circuit Park Zandvoort', 'Zandvoort', 'Netherlands', 52.3888, 4.54092, '2026-08-23', true],
  ['Italian Grand Prix', 'monza', 'Autodromo Nazionale di Monza', 'Monza', 'Italy', 45.6156, 9.28111, '2026-09-06', false],
  ['Spanish Grand Prix', 'madring', 'Madring', 'Madrid', 'Spain', 40.4637, -3.6164, '2026-09-13', false],
  ['Azerbaijan Grand Prix', 'baku', 'Baku City Circuit', 'Baku', 'Azerbaijan', 40.3725, 49.8533, '2026-09-26', false],
  ['Singapore Grand Prix', 'marina_bay', 'Marina Bay Street Circuit', 'Marina Bay', 'Singapore', 1.2914, 103.864, '2026-10-11', true],
  ['United States Grand Prix', 'americas', 'Circuit of the Americas', 'Austin', 'USA', 30.1328, -97.6411, '2026-10-25', false],
  ['Mexico City Grand Prix', 'rodriguez', 'Autódromo Hermanos Rodríguez', 'Mexico City', 'Mexico', 19.4042, -99.0907, '2026-11-01', false],
  ['São Paulo Grand Prix', 'interlagos', 'Autódromo José Carlos Pace', 'São Paulo', 'Brazil', -23.7036, -46.6997, '2026-11-08', false],
  ['Las Vegas Grand Prix', 'vegas', 'Las Vegas Strip Street Circuit', 'Las Vegas', 'USA', 36.1147, -115.173, '2026-11-21', false],
  ['Qatar Grand Prix', 'losail', 'Losail International Circuit', 'Lusail', 'Qatar', 25.49, 51.4542, '2026-11-29', false],
  ['Abu Dhabi Grand Prix', 'yas_marina', 'Yas Marina Circuit', 'Abu Dhabi', 'UAE', 24.4672, 54.6031, '2026-12-06', false],
];

const POINTS = [25, 18, 15, 12, 10, 8, 6, 4, 2, 1];
const SPRINT_POINTS = [8, 7, 6, 5, 4, 3, 2, 1];

function rng(seed) {
  return () => {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const addDays = (date, n) => {
  const d = new Date(`${date}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
};

const teamObj = (id) => {
  const t = TEAMS.find((x) => x[0] === id);
  return { constructorId: t[0], url: '', name: t[1], nationality: t[2] };
};
const driverObj = (d) => ({
  driverId: d[0], permanentNumber: String(d[2]), code: d[1], url: '', givenName: d[3], familyName: d[4], dateOfBirth: d[6], nationality: d[5],
});

function buildRaces() {
  return CAL.map((c, i) => {
    const race = {
      season: '2026', round: String(i + 1), url: '', raceName: c[0],
      Circuit: { circuitId: c[1], url: `https://fr.wikipedia.org/wiki/${encodeURIComponent(c[2])}`, circuitName: c[2], Location: { lat: String(c[5]), long: String(c[6]), locality: c[3], country: c[4] } },
      date: c[7], time: '13:00:00Z',
      FirstPractice: { date: addDays(c[7], -2), time: '11:30:00Z' },
      Qualifying: { date: addDays(c[7], -1), time: '14:00:00Z' },
    };
    if (c[8]) {
      race.SprintQualifying = { date: addDays(c[7], -2), time: '15:30:00Z' };
      race.Sprint = { date: addDays(c[7], -1), time: '10:00:00Z' };
    } else {
      race.SecondPractice = { date: addDays(c[7], -2), time: '15:00:00Z' };
      race.ThirdPractice = { date: addDays(c[7], -1), time: '10:30:00Z' };
    }
    return race;
  });
}

function classify(round, salt) {
  const r = rng(round * 7919 + salt);
  return DRIVERS.map((d) => {
    const team = TEAMS.find((t) => t[0] === d[7]);
    return { d, score: team[3] * d[8] + r() * 0.55, dnf: r() < 0.06 };
  }).sort((a, b) => (a.dnf - b.dnf) || (b.score - a.score));
}

const fmtRaceTime = (sec) => {
  const h = Math.floor(sec / 3600), m = Math.floor((sec % 3600) / 60), s = (sec % 60).toFixed(3).padStart(6, '0');
  return `${h}:${String(m).padStart(2, '0')}:${s}`;
};

let cache = null;
function season() {
  if (cache) return cache;
  const now = Date.now();
  const races = buildRaces();
  const done = races.filter((r) => new Date(`${r.date}T${r.time}`).getTime() + 3 * 3600_000 < now);

  const results = {}, qualis = {}, sprints = {};
  for (const race of done) {
    const round = Number(race.round);
    const quali = classify(round, 1);
    const grid = Object.fromEntries(quali.map((q, i) => [q.d[0], i + 1]));
    qualis[round] = quali.map((q, i) => {
      const base = 78 + (round % 7) * 2 + i * 0.12;
      const t = (x) => `1:${(base - 60 + x).toFixed(3).padStart(6, '0')}`;
      return { number: String(q.d[2]), position: String(i + 1), Driver: driverObj(q.d), Constructor: teamObj(q.d[7]), Q1: t(0.8), ...(i < 16 ? { Q2: t(0.4) } : {}), ...(i < 10 ? { Q3: t(0) } : {}) };
    });
    const order = classify(round, 2);
    const laps = 55 + (round % 9);
    const fastest = 1 + Math.floor(rng(round)() * 8);
    results[round] = order.map((o, i) => ({
      number: String(o.d[2]), position: String(i + 1), positionText: o.dnf ? 'R' : String(i + 1),
      points: String((!o.dnf && POINTS[i]) || 0) , Driver: driverObj(o.d), Constructor: teamObj(o.d[7]),
      grid: String(grid[o.d[0]]), laps: String(o.dnf ? Math.floor(laps * 0.4) : laps),
      status: o.dnf ? 'Retired' : 'Finished',
      ...(o.dnf ? {} : { Time: { time: i === 0 ? fmtRaceTime(5400 + round * 37.3) : `+${(i * 3.7 + (round % 5)).toFixed(3)}` } }),
      ...(i === fastest ? { FastestLap: { rank: '1', lap: String(laps - 3), Time: { time: '1:31.842' } } } : {}),
    }));
    if (race.Sprint) {
      sprints[round] = classify(round, 3).map((o, i) => ({
        number: String(o.d[2]), position: String(i + 1), positionText: o.dnf ? 'R' : String(i + 1),
        points: String((!o.dnf && SPRINT_POINTS[i]) || 0), Driver: driverObj(o.d), Constructor: teamObj(o.d[7]),
        grid: String(i + 1), laps: '19', status: o.dnf ? 'Retired' : 'Finished',
        ...(o.dnf ? {} : { Time: { time: i === 0 ? '30:12.418' : `+${(i * 1.9).toFixed(3)}` } }),
      }));
    }
  }

  const dPts = {}, dWins = {}, tPts = {}, tWins = {};
  for (const list of [...Object.values(results), ...Object.values(sprints)]) {
    for (const x of list) {
      dPts[x.Driver.driverId] = (dPts[x.Driver.driverId] || 0) + Number(x.points);
      tPts[x.Constructor.constructorId] = (tPts[x.Constructor.constructorId] || 0) + Number(x.points);
    }
  }
  for (const list of Object.values(results)) {
    dWins[list[0].Driver.driverId] = (dWins[list[0].Driver.driverId] || 0) + 1;
    tWins[list[0].Constructor.constructorId] = (tWins[list[0].Constructor.constructorId] || 0) + 1;
  }
  const driverStandings = DRIVERS.map((d) => ({ d, pts: dPts[d[0]] || 0 }))
    .sort((a, b) => b.pts - a.pts)
    .map((x, i) => ({ position: String(i + 1), positionText: String(i + 1), points: String(x.pts), wins: String(dWins[x.d[0]] || 0), Driver: driverObj(x.d), Constructors: [teamObj(x.d[7])] }));
  const constructorStandings = TEAMS.map((t) => ({ t, pts: tPts[t[0]] || 0 }))
    .sort((a, b) => b.pts - a.pts)
    .map((x, i) => ({ position: String(i + 1), positionText: String(i + 1), points: String(x.pts), wins: String(tWins[x.t[0]] || 0), Constructor: teamObj(x.t[0]) }));

  cache = { races, done, results, qualis, sprints, driverStandings, constructorStandings };
  return cache;
}

const strip = (race) => {
  const { Results, QualifyingResults, SprintResults, ...rest } = race;
  return rest;
};
const raceTable = (Races) => ({ series: 'f1', RaceTable: { season: '2026', Races } });

export function demo(fullPath) {
  const path = fullPath.split('?')[0];
  const s = season();
  const lastRound = s.done.length;
  let m;

  if (path === 'current.json') return raceTable(s.races.map(strip));
  if (path === 'current/driverstandings.json') return { StandingsTable: { StandingsLists: [{ season: '2026', round: String(lastRound), DriverStandings: s.driverStandings }] } };
  if (path === 'current/constructorstandings.json') return { StandingsTable: { StandingsLists: [{ season: '2026', round: String(lastRound), ConstructorStandings: s.constructorStandings }] } };
  if (path === 'current/last/results.json') return raceTable(lastRound ? [{ ...strip(s.races[lastRound - 1]), Results: s.results[lastRound] }] : []);
  if (path === 'current/results/1.json') return raceTable(s.done.map((r) => ({ ...strip(r), Results: [s.results[r.round][0]] })));
  if ((m = path.match(/^current\/(\d+)\/results\.json$/))) return raceTable(s.results[m[1]] ? [{ ...strip(s.races[m[1] - 1]), Results: s.results[m[1]] }] : []);
  if ((m = path.match(/^current\/(\d+)\/qualifying\.json$/))) return raceTable(s.qualis[m[1]] ? [{ ...strip(s.races[m[1] - 1]), QualifyingResults: s.qualis[m[1]] }] : []);
  if ((m = path.match(/^current\/(\d+)\/sprint\.json$/))) return raceTable(s.sprints[m[1]] ? [{ ...strip(s.races[m[1] - 1]), SprintResults: s.sprints[m[1]] }] : []);
  if (path === 'current/drivers.json') return { DriverTable: { Drivers: DRIVERS.map(driverObj) } };
  if (path === 'current/constructors.json') return { ConstructorTable: { Constructors: TEAMS.map((t) => teamObj(t[0])) } };
  if (path === 'current/circuits.json') return { CircuitTable: { Circuits: s.races.map((r) => r.Circuit) } };
  if ((m = path.match(/^current\/drivers\/([\w-]+)\/results\.json$/))) {
    return raceTable(s.done.map((r) => ({ ...strip(r), Results: s.results[r.round].filter((x) => x.Driver.driverId === m[1]) })).filter((r) => r.Results.length));
  }
  if ((m = path.match(/^current\/constructors\/([\w-]+)\/results\.json$/))) {
    return raceTable(s.done.map((r) => ({ ...strip(r), Results: s.results[r.round].filter((x) => x.Constructor.constructorId === m[1]) })).filter((r) => r.Results.length));
  }
  return raceTable([]);
}
