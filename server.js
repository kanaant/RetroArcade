/**
 * Retro Arcade Server
 * Simple Express server for high score persistence
 */

const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, "data", "highscores.json");
const MAX_SCORES_PER_GAME = 10;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// Ensure data directory exists
const dataDir = path.join(__dirname, "data");
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Ensure highscores file exists
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(
    DATA_FILE,
    JSON.stringify(
      {
        tetris: [],
        pacman: [],
        snake: [],
        breakout: [],
        "space-invaders": [],
        pong: [],
      },
      null,
      2
    )
  );
}

// Helper function to read scores
function readScores() {
  try {
    const data = fs.readFileSync(DATA_FILE, "utf8");
    return JSON.parse(data);
  } catch (err) {
    console.error("Error reading scores:", err);
    return {};
  }
}

// Helper function to write scores
function writeScores(scores) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(scores, null, 2));
    return true;
  } catch (err) {
    console.error("Error writing scores:", err);
    return false;
  }
}

// API Routes

// Get all high scores
app.get("/api/scores", (req, res) => {
  const scores = readScores();
  res.json(scores);
});

// Get high scores for a specific game
app.get("/api/scores/:game", (req, res) => {
  const scores = readScores();
  const gameScores = scores[req.params.game] || [];
  res.json(gameScores);
});

// Get top score for a specific game
app.get("/api/scores/:game/top", (req, res) => {
  const scores = readScores();
  const gameScores = scores[req.params.game] || [];
  const topScore = gameScores.length > 0 ? gameScores[0].score : 0;
  res.json({ score: topScore });
});

// Add a new high score
app.post("/api/scores/:game", (req, res) => {
  const { name, score } = req.body;
  const game = req.params.game;

  if (!name || score === undefined) {
    return res.status(400).json({ error: "Name and score are required" });
  }

  const scores = readScores();

  if (!scores[game]) {
    scores[game] = [];
  }

  // Create new entry
  const newEntry = {
    name: String(name).substring(0, 3).toUpperCase(),
    score: Number(score),
    date: new Date().toISOString(),
  };

  // Add and sort
  scores[game].push(newEntry);
  scores[game].sort((a, b) => b.score - a.score);

  // Limit to max scores
  if (scores[game].length > MAX_SCORES_PER_GAME) {
    scores[game] = scores[game].slice(0, MAX_SCORES_PER_GAME);
  }

  // Find position
  const position = scores[game].findIndex(
    (s) =>
      s.name === newEntry.name &&
      s.score === newEntry.score &&
      s.date === newEntry.date
  );

  if (writeScores(scores)) {
    res.json({ success: true, position: position + 1 });
  } else {
    res.status(500).json({ error: "Failed to save score" });
  }
});

// Clear scores for a game
app.delete("/api/scores/:game", (req, res) => {
  const scores = readScores();
  scores[req.params.game] = [];

  if (writeScores(scores)) {
    res.json({ success: true });
  } else {
    res.status(500).json({ error: "Failed to clear scores" });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`
    ╔═══════════════════════════════════════════╗
    ║                                           ║
    ║   🎮 RETRO ARCADE SERVER 🎮               ║
    ║                                           ║
    ║   Server running on port ${PORT}            ║
    ║   http://localhost:${PORT}                  ║
    ║                                           ║
    ║   High scores stored in:                  ║
    ║   ./data/highscores.json                  ║
    ║                                           ║
    ╚═══════════════════════════════════════════╝
    `);
});
