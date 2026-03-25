const express = require("express");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3000;

/* ===============================
   🧠 BANCO DE DADOS (FAKE)
=================================*/

let teams = [
  { id: "1", name: "Real Madrid", country: "Spain", titles: 14 },
  { id: "2", name: "Manchester City", country: "England", titles: 1 }
];

let players = [
  { id: "1", name: "Vinicius Jr", teamId: "1", position: "LW", goals: 5 },
  { id: "2", name: "Haaland", teamId: "2", position: "ST", goals: 8 }
];

let matches = [
  {
    id: "1",
    homeTeam: "1",
    awayTeam: "2",
    homeScore: 2,
    awayScore: 1,
    date: "2026-03-20"
  }
];

/* ===============================
   ⚽ UTIL
=================================*/

function getStandings() {
  const table = {};

  teams.forEach(team => {
    table[team.id] = {
      team: team.name,
      points: 0,
      played: 0,
      wins: 0,
      losses: 0,
      draws: 0,
      goalsFor: 0,
      goalsAgainst: 0
    };
  });

  matches.forEach(match => {
    const home = table[match.homeTeam];
    const away = table[match.awayTeam];

    home.played++;
    away.played++;

    home.goalsFor += match.homeScore;
    home.goalsAgainst += match.awayScore;

    away.goalsFor += match.awayScore;
    away.goalsAgainst += match.homeScore;

    if (match.homeScore > match.awayScore) {
      home.wins++;
      home.points += 3;
      away.losses++;
    } else if (match.homeScore < match.awayScore) {
      away.wins++;
      away.points += 3;
      home.losses++;
    } else {
      home.draws++;
      away.draws++;
      home.points += 1;
      away.points += 1;
    }
  });

  return Object.values(table).sort((a, b) => b.points - a.points);
}

/* ===============================
   🏆 ROTAS - TEAMS
=================================*/

// GET all teams
app.get("/teams", (req, res) => {
  res.json(teams);
});

// GET team by id
app.get("/teams/:id", (req, res) => {
  const team = teams.find(t => t.id === req.params.id);
  if (!team) return res.status(404).json({ error: "Team not found" });
  res.json(team);
});

// CREATE team
app.post("/teams", (req, res) => {
  const { name, country, titles } = req.body;
  const newTeam = { id: uuidv4(), name, country, titles };
  teams.push(newTeam);
  res.status(201).json(newTeam);
});

// UPDATE team
app.put("/teams/:id", (req, res) => {
  const team = teams.find(t => t.id === req.params.id);
  if (!team) return res.status(404).json({ error: "Team not found" });

  Object.assign(team, req.body);
  res.json(team);
});

// DELETE team
app.delete("/teams/:id", (req, res) => {
  teams = teams.filter(t => t.id !== req.params.id);
  res.json({ message: "Team deleted" });
});

/* ===============================
   👤 ROTAS - PLAYERS
=================================*/

// GET all players
app.get("/players", (req, res) => {
  const { team } = req.query;

  if (team) {
    return res.json(players.filter(p => p.teamId === team));
  }

  res.json(players);
});

// CREATE player
app.post("/players", (req, res) => {
  const { name, teamId, position, goals } = req.body;
  const newPlayer = {
    id: uuidv4(),
    name,
    teamId,
    position,
    goals: goals || 0
  };

  players.push(newPlayer);
  res.status(201).json(newPlayer);
});

// UPDATE player
app.put("/players/:id", (req, res) => {
  const player = players.find(p => p.id === req.params.id);
  if (!player) return res.status(404).json({ error: "Player not found" });

  Object.assign(player, req.body);
  res.json(player);
});

// DELETE player
app.delete("/players/:id", (req, res) => {
  players = players.filter(p => p.id !== req.params.id);
  res.json({ message: "Player deleted" });
});

/* ===============================
   🏟️ ROTAS - MATCHES
=================================*/

// GET matches
app.get("/matches", (req, res) => {
  res.json(matches);
});

// CREATE match
app.post("/matches", (req, res) => {
  const { homeTeam, awayTeam, homeScore, awayScore, date } = req.body;

  const newMatch = {
    id: uuidv4(),
    homeTeam,
    awayTeam,
    homeScore,
    awayScore,
    date
  };

  matches.push(newMatch);
  res.status(201).json(newMatch);
});

// DELETE match
app.delete("/matches/:id", (req, res) => {
  matches = matches.filter(m => m.id !== req.params.id);
  res.json({ message: "Match deleted" });
});

/* ===============================
   📊 CLASSIFICAÇÃO
=================================*/

app.get("/standings", (req, res) => {
  res.json(getStandings());
});

/* ===============================
   🔍 BUSCA GLOBAL
=================================*/

app.get("/search", (req, res) => {
  const { q } = req.query;

  const result = {
    teams: teams.filter(t => t.name.toLowerCase().includes(q.toLowerCase())),
    players: players.filter(p => p.name.toLowerCase().includes(q.toLowerCase()))
  };

  res.json(result);
});

/* ===============================
   🚀 START SERVER
=================================*/

app.listen(PORT, () => {
  console.log(`🔥 API rodando em http://localhost:${PORT}`);
});
