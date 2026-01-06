# 🎮 Retro Arcade

A collection of classic 80s-style arcade games built with **vanilla HTML, CSS, and JavaScript**. This project is a quick exercise in creating simple retro games without any frameworks or libraries.

![Retro Arcade](https://img.shields.io/badge/Vanilla-HTML%2FCSS%2FJS-blue)
![Games](https://img.shields.io/badge/Games-6-green)

## 🕹️ Games Included

| Game               | Description                               |
| ------------------ | ----------------------------------------- |
| **Tetris**         | Stack falling blocks and clear lines      |
| **Pac-Man**        | Navigate the maze, eat dots, avoid ghosts |
| **Snake**          | Grow your snake by eating food            |
| **Breakout**       | Destroy bricks with a bouncing ball       |
| **Space Invaders** | Defend Earth from alien invaders          |
| **Pong**           | Classic paddle vs paddle (AI or 2-player) |

## ✨ Features

- 🎨 Authentic 80s retro aesthetic with neon effects and CRT scanlines
- 💾 Persistent high scores saved to JSON file
- 🎵 Responsive design with pixel fonts
- ⌨️ Keyboard controls with WASD support
- 🏆 Top 10 leaderboards for each game

## 🚀 Quick Start

### Windows

```bash
# Double-click to run
start.bat
```

### Mac/Linux

```bash
# Make executable and run
chmod +x start.sh
./start.sh
```

### Manual

```bash
# Install dependencies
npm install

# Start the server
npm start

# Visit http://localhost:3000
```

### Docker

You can run the application in a Docker container.

```bash
# Build and start the container
docker compose up -d --build

# Stop the container
docker compose down
```

The application will be accessible at `http://localhost:3050`.

- **Image Name:** `darksenses-demos-retroarcade`
- **Container Name:** `ds-retroarcade`

## 📁 Project Structure

```
retroGames/
├── index.html          # Landing page / game selector
├── server.js           # Express server for high scores
├── package.json        # Dependencies
├── data/
│   └── highscores.json # Persistent high score storage
├── shared/
│   ├── arcade-theme.css # Global retro styling
│   └── highscore.js     # High score API module
├── tetris/
├── pacman/
├── snake/
├── breakout/
├── space-invaders/
└── pong/
```

## 🎯 Controls

| Game           | Controls                            |
| -------------- | ----------------------------------- |
| All Games      | **P** = Pause                       |
| Movement       | **Arrow Keys** or **WASD**          |
| Tetris         | **Space** = Hard Drop, **C** = Hold |
| Space Invaders | **Space** = Shoot                   |
| Breakout       | **Mouse** = Move Paddle             |

## 🛠️ Tech Stack

- **Frontend**: Vanilla HTML5, CSS3, JavaScript (ES6 Modules)
- **Backend**: Node.js + Express (for high score persistence)
- **Storage**: JSON file (`data/highscores.json`)
- **Fonts**: Press Start 2P, Orbitron (Google Fonts)

## 📝 License

MIT License - feel free to use and modify!

---

_Built as a fun exercise in vanilla web development_ 🕹️
