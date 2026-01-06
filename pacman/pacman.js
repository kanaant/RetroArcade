const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const blockSize = 20;
const rows = 31;
const cols = 28;

let score = 0;
let lives = 3;
let gameOver = false;
let frameCount = 0;
let totalDots = 0;

// Maze layout: 0=empty, 1=wall, 2=dot, 3=power pellet, 4=pacman start, 5=ghost start
const maze = [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,2,2,2,2,2,2,2,2,2,2,2,2,1,1,2,2,2,2,2,2,2,2,2,2,2,2,1],
    [1,2,1,1,1,1,2,1,1,1,1,1,2,1,1,2,1,1,1,1,1,2,1,1,1,1,2,1],
    [1,3,1,1,1,1,2,1,1,1,1,1,2,1,1,2,1,1,1,1,1,2,1,1,1,1,3,1],
    [1,2,1,1,1,1,2,1,1,1,1,1,2,1,1,2,1,1,1,1,1,2,1,1,1,1,2,1],
    [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
    [1,2,1,1,1,1,2,1,1,2,1,1,1,1,1,1,1,1,2,1,1,2,1,1,1,1,2,1],
    [1,2,1,1,1,1,2,1,1,2,1,1,1,1,1,1,1,1,2,1,1,2,1,1,1,1,2,1],
    [1,2,2,2,2,2,2,1,1,2,2,2,2,1,1,2,2,2,2,1,1,2,2,2,2,2,2,1],
    [1,1,1,1,1,1,2,1,1,1,1,1,0,1,1,0,1,1,1,1,1,2,1,1,1,1,1,1],
    [0,0,0,0,0,1,2,1,1,1,1,1,0,1,1,0,1,1,1,1,1,2,1,0,0,0,0,0],
    [0,0,0,0,0,1,2,1,1,0,0,0,0,0,0,0,0,0,0,1,1,2,1,0,0,0,0,0],
    [0,0,0,0,0,1,2,1,1,0,1,1,1,1,1,1,1,1,0,1,1,2,1,0,0,0,0,0],
    [1,1,1,1,1,1,2,1,1,0,1,0,0,0,0,0,0,1,0,1,1,2,1,1,1,1,1,1],
    [0,0,0,0,0,0,2,0,0,0,1,0,0,0,0,0,0,1,0,0,0,2,0,0,0,0,0,0],
    [1,1,1,1,1,1,2,1,1,0,1,0,0,0,0,0,0,1,0,1,1,2,1,1,1,1,1,1],
    [0,0,0,0,0,1,2,1,1,0,1,1,1,1,1,1,1,1,0,1,1,2,1,0,0,0,0,0],
    [0,0,0,0,0,1,2,1,1,0,0,0,0,0,0,0,0,0,0,1,1,2,1,0,0,0,0,0],
    [0,0,0,0,0,1,2,1,1,1,1,1,0,1,1,0,1,1,1,1,1,2,1,0,0,0,0,0],
    [1,1,1,1,1,1,2,1,1,1,1,1,0,1,1,0,1,1,1,1,1,2,1,1,1,1,1,1],
    [1,2,2,2,2,2,2,2,2,2,2,2,2,1,1,2,2,2,2,2,2,2,2,2,2,2,2,1],
    [1,2,1,1,1,1,2,1,1,1,1,1,2,1,1,2,1,1,1,1,1,2,1,1,1,1,2,1],
    [1,3,2,2,1,1,2,2,2,2,2,2,2,0,0,2,2,2,2,2,2,2,1,1,2,2,3,1],
    [1,1,1,2,1,1,2,1,1,2,1,1,1,1,1,1,1,1,2,1,1,2,1,1,2,1,1,1],
    [1,1,1,2,1,1,2,1,1,2,1,1,1,1,1,1,1,1,2,1,1,2,1,1,2,1,1,1],
    [1,2,2,2,2,2,2,2,2,2,2,2,2,1,1,2,2,2,2,2,2,2,2,2,2,2,2,1],
    [1,2,1,1,1,1,1,1,1,1,1,1,2,1,1,2,1,1,1,1,1,1,1,1,1,1,2,1],
    [1,2,1,1,1,1,1,1,1,1,1,1,2,1,1,2,1,1,1,1,1,1,1,1,1,1,2,1],
    [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
];

// Pacman
let pacman = { x: 14, y: 23, dir: 0, nextDir: 0 }; // 0=right, 1=down, 2=left, 3=up

// Ghosts
let ghosts = [
    { x: 13, y: 11, dir: 0, color: 'red' },
    { x: 14, y: 11, dir: 0, color: 'pink' },
    { x: 13, y: 13, dir: 0, color: 'cyan' },
    { x: 14, y: 13, dir: 0, color: 'orange' }
];

let powerMode = false;
let powerTime = 0;

// Count initial dots
for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
        if (maze[y][x] === 2 || maze[y][x] === 3) totalDots++;
    }
}

function drawMaze() {
    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            const blockX = x * blockSize;
            const blockY = y * blockSize;
            if (maze[y][x] === 1) {
                ctx.fillStyle = '#0000ff';
                ctx.fillRect(blockX, blockY, blockSize, blockSize);
            } else if (maze[y][x] === 2) {
                ctx.fillStyle = '#ffffff';
                ctx.beginPath();
                ctx.arc(blockX + blockSize / 2, blockY + blockSize / 2, 3, 0, 2 * Math.PI);
                ctx.fill();
            } else if (maze[y][x] === 3) {
                ctx.fillStyle = '#ffff00';
                ctx.beginPath();
                ctx.arc(blockX + blockSize / 2, blockY + blockSize / 2, 6, 0, 2 * Math.PI);
                ctx.fill();
            }
        }
    }
}

function drawPacman() {
    const centerX = pacman.x * blockSize + blockSize / 2;
    const centerY = pacman.y * blockSize + blockSize / 2;
    ctx.fillStyle = '#ffff00';
    ctx.beginPath();
    ctx.arc(centerX, centerY, blockSize / 2 - 2, 0.2 * Math.PI, 1.8 * Math.PI);
    ctx.lineTo(centerX, centerY);
    ctx.closePath();
    ctx.fill();
}

function drawGhosts() {
    ghosts.forEach(ghost => {
        const centerX = ghost.x * blockSize + blockSize / 2;
        const centerY = ghost.y * blockSize + blockSize / 2;
        ctx.fillStyle = ghost.color;
        ctx.beginPath();
        ctx.arc(centerX, centerY, blockSize / 2 - 2, 0, 2 * Math.PI);
        ctx.fill();
    });
}

function movePacman() {
    // Try to change direction
    let newX = pacman.x;
    let newY = pacman.y;
    if (pacman.nextDir !== pacman.dir) {
        if (pacman.nextDir === 0 && maze[pacman.y][pacman.x + 1] !== 1) pacman.dir = 0;
        else if (pacman.nextDir === 1 && maze[pacman.y + 1][pacman.x] !== 1) pacman.dir = 1;
        else if (pacman.nextDir === 2 && maze[pacman.y][pacman.x - 1] !== 1) pacman.dir = 2;
        else if (pacman.nextDir === 3 && maze[pacman.y - 1][pacman.x] !== 1) pacman.dir = 3;
    }

    // Move
    if (pacman.dir === 0 && maze[pacman.y][pacman.x + 1] !== 1) newX++;
    else if (pacman.dir === 1 && maze[pacman.y + 1][pacman.x] !== 1) newY++;
    else if (pacman.dir === 2 && maze[pacman.y][pacman.x - 1] !== 1) newX--;
    else if (pacman.dir === 3 && maze[pacman.y - 1][pacman.x] !== 1) newY--;

    pacman.x = newX;
    pacman.y = newY;

    // Eat dots
    if (maze[pacman.y][pacman.x] === 2) {
        maze[pacman.y][pacman.x] = 0;
        score += 10;
        updateScore();
    } else if (maze[pacman.y][pacman.x] === 3) {
        maze[pacman.y][pacman.x] = 0;
        score += 50;
        powerMode = true;
        powerTime = 0;
        updateScore();
    }

    // Wrap around
    if (pacman.x < 0) pacman.x = cols - 1;
    if (pacman.x >= cols) pacman.x = 0;
}

function moveGhosts() {
    ghosts.forEach(ghost => {
        // Simple random movement
        const directions = [0, 1, 2, 3];
        let moved = false;
        while (!moved) {
            const dir = directions[Math.floor(Math.random() * directions.length)];
            let newX = ghost.x;
            let newY = ghost.y;
            if (dir === 0 && maze[ghost.y][ghost.x + 1] !== 1) newX++;
            else if (dir === 1 && maze[ghost.y + 1][ghost.x] !== 1) newY++;
            else if (dir === 2 && maze[ghost.y][ghost.x - 1] !== 1) newX--;
            else if (dir === 3 && maze[ghost.y - 1][ghost.x] !== 1) newY--;
            if (newX !== ghost.x || newY !== ghost.y) {
                ghost.x = newX;
                ghost.y = newY;
                moved = true;
            }
        }
    });
}

function checkCollisions() {
    ghosts.forEach(ghost => {
        if (ghost.x === pacman.x && ghost.y === pacman.y) {
            if (powerMode) {
                // Eat ghost
                ghost.x = 13;
                ghost.y = 11;
                score += 200;
                updateScore();
            } else {
                lives--;
                if (lives <= 0) {
                    gameOver = true;
                    alert('Game Over!');
                } else {
                    // Reset positions
                    pacman.x = 14;
                    pacman.y = 23;
                    pacman.dir = 0;
                    pacman.nextDir = 0;
                    ghosts.forEach(g => {
                        g.x = 13 + (g === ghosts[1] || g === ghosts[3] ? 1 : 0);
                        g.y = 11 + (g === ghosts[2] || g === ghosts[3] ? 2 : 0);
                    });
                }
            }
        }
    });
}

function updateScore() {
    document.getElementById('score').textContent = `Score: ${score}`;
}

function gameLoop() {
    if (gameOver) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawMaze();
    drawPacman();
    drawGhosts();

    movePacman();
    moveGhosts();
    checkCollisions();

    // Check win condition
    let dotsLeft = 0;
    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            if (maze[y][x] === 2 || maze[y][x] === 3) dotsLeft++;
        }
    }
    if (dotsLeft === 0) {
        gameOver = true;
        alert('You Win!');
    }

    if (powerMode) {
        powerTime++;
        if (powerTime > 150) { // 5 seconds at 30fps
            powerMode = false;
        }
    }
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') pacman.nextDir = 0;
    else if (e.key === 'ArrowDown') pacman.nextDir = 1;
    else if (e.key === 'ArrowLeft') pacman.nextDir = 2;
    else if (e.key === 'ArrowUp') pacman.nextDir = 3;
});

// Start game loop at 30 FPS
setInterval(gameLoop, 1000 / 30);
