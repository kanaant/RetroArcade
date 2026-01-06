/**
 * High Score System for Retro Arcade
 * Uses server API for persistence (with localStorage fallback)
 */

const API_BASE = "/api/scores";
const MAX_SCORES_PER_GAME = 10;

// Stub for backwards compatibility (not used - using inline HTML now)
export function createHighScoreInput() {
  return document.createElement("div");
}

// Cache for scores to reduce API calls
let scoreCache = {};
let cacheTime = 0;
const CACHE_DURATION = 5000; // 5 seconds

/**
 * Get all high scores
 * @returns {Promise<Object>} All high scores by game
 */
export async function getAllHighScores() {
  // Use cache if fresh
  if (
    Date.now() - cacheTime < CACHE_DURATION &&
    Object.keys(scoreCache).length > 0
  ) {
    return scoreCache;
  }

  try {
    const response = await fetch(API_BASE);
    if (response.ok) {
      scoreCache = await response.json();
      cacheTime = Date.now();
      return scoreCache;
    }
  } catch (err) {
    console.warn("API unavailable, using localStorage fallback");
  }

  // Fallback to localStorage
  return getLocalScores();
}

/**
 * Get high scores for a specific game
 * @param {string} gameName - The name of the game
 * @returns {Promise<Array>} Array of score objects
 */
export async function getHighScores(gameName) {
  try {
    const response = await fetch(`${API_BASE}/${gameName}`);
    if (response.ok) {
      return await response.json();
    }
  } catch (err) {
    console.warn("API unavailable, using localStorage fallback");
  }

  // Fallback
  const scores = getLocalScores();
  return scores[gameName] || [];
}

/**
 * Get the top score for a game
 * @param {string} gameName - The name of the game
 * @returns {number} The top score or 0
 */
export function getTopScore(gameName) {
  // Synchronous version using cache or localStorage
  if (scoreCache[gameName] && scoreCache[gameName].length > 0) {
    return scoreCache[gameName][0].score;
  }

  const localScores = getLocalScores();
  if (localScores[gameName] && localScores[gameName].length > 0) {
    return localScores[gameName][0].score;
  }

  return 0;
}

/**
 * Get the top score entry (name + score) for a game
 * @param {string} gameName - The name of the game
 * @returns {Object|null} The top score entry or null
 */
export function getTopScoreEntry(gameName) {
  if (scoreCache[gameName] && scoreCache[gameName].length > 0) {
    return scoreCache[gameName][0];
  }

  const localScores = getLocalScores();
  if (localScores[gameName] && localScores[gameName].length > 0) {
    return localScores[gameName][0];
  }

  return null;
}

/**
 * Check if a score qualifies for the high score board
 * @param {string} gameName - The name of the game
 * @param {number} score - The score to check
 * @returns {boolean} True if score qualifies
 */
export function isHighScore(gameName, score) {
  if (score <= 0) return false;

  // Check cache first
  let scores = scoreCache[gameName];
  if (!scores) {
    const local = getLocalScores();
    scores = local[gameName] || [];
  }

  if (scores.length < MAX_SCORES_PER_GAME) {
    return true;
  }

  return score > scores[scores.length - 1].score;
}

/**
 * Add a high score
 * @param {string} gameName - The name of the game
 * @param {string} playerName - The player's name (max 3 chars)
 * @param {number} score - The score achieved
 * @returns {Promise<number>} The position (1-indexed) or -1 if not added
 */
export async function addHighScore(gameName, playerName, score) {
  if (score <= 0) return -1;

  const entry = {
    name: (playerName || "AAA").substring(0, 3).toUpperCase(),
    score: score,
  };

  try {
    const response = await fetch(`${API_BASE}/${gameName}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(entry),
    });

    if (response.ok) {
      const result = await response.json();
      // Invalidate cache
      cacheTime = 0;
      // Also save to localStorage as backup
      saveLocalScore(gameName, entry);
      return result.position;
    }
  } catch (err) {
    console.warn("API unavailable, saving to localStorage");
  }

  // Fallback to localStorage
  return saveLocalScore(gameName, entry);
}

/**
 * Clear high scores for a game
 * @param {string} gameName - The name of the game
 */
export async function clearHighScores(gameName) {
  try {
    await fetch(`${API_BASE}/${gameName}`, { method: "DELETE" });
    cacheTime = 0;
  } catch (err) {
    console.warn("API unavailable");
  }

  // Also clear from localStorage
  const local = getLocalScores();
  delete local[gameName];
  localStorage.setItem("retroArcade_highScores", JSON.stringify(local));
}

// LocalStorage fallback functions
function getLocalScores() {
  try {
    const stored = localStorage.getItem("retroArcade_highScores");
    return stored ? JSON.parse(stored) : {};
  } catch (e) {
    return {};
  }
}

function saveLocalScore(gameName, entry) {
  const scores = getLocalScores();
  if (!scores[gameName]) scores[gameName] = [];

  entry.date = new Date().toISOString();
  scores[gameName].push(entry);
  scores[gameName].sort((a, b) => b.score - a.score);

  if (scores[gameName].length > MAX_SCORES_PER_GAME) {
    scores[gameName] = scores[gameName].slice(0, MAX_SCORES_PER_GAME);
  }

  const position = scores[gameName].findIndex(
    (s) =>
      s.name === entry.name && s.score === entry.score && s.date === entry.date
  );

  localStorage.setItem("retroArcade_highScores", JSON.stringify(scores));

  // Update cache
  scoreCache = scores;
  cacheTime = Date.now();

  return position >= 0 ? position + 1 : -1;
}

/**
 * Initialize - load scores into cache
 */
export async function initHighScores() {
  try {
    const response = await fetch(API_BASE);
    if (response.ok) {
      scoreCache = await response.json();
      cacheTime = Date.now();
    }
  } catch (err) {
    scoreCache = getLocalScores();
    cacheTime = Date.now();
  }
}

// Initialize on load
initHighScores();

// Default export
export default {
  getAllHighScores,
  getHighScores,
  getTopScore,
  isHighScore,
  addHighScore,
  clearHighScores,
  initHighScores,
};
