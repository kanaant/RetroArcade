const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;
let board = Array.from({ length: BOARD_HEIGHT }, () => Array(BOARD_WIDTH).fill(0));
let score = 0;
let currentPiece = null;
let nextPiece = null;
let gameOver = false;
let dropTime = 0;
let dropInterval = 1000;

const tetrominoes = [
    { shape: [[1, 1, 1, 1]], color: 1 }, // I
    { shape: [[1, 1], [1, 1]], color: 2 }, // O
    { shape: [[0, 1, 0], [1, 1, 1]], color: 3 }, // T
    { shape: [[0, 1, 1], [1, 1, 0]], color: 4 }, // S
    { shape: [[1, 1, 0], [0, 1, 1]], color: 5 }, // Z
    { shape: [[1, 0, 0], [1, 1, 1]], color: 6 }, // J
    { shape: [[0, 0, 1], [1, 1, 1]], color: 7 }, // L
];

function getRandomTetromino() {
    return tetrominoes[Math.floor(Math.random() * tetrominoes.length)];
}

function rotate(piece) {
    const shape = piece.shape;
    const rotated = shape[0].map((_, index) => shape.map(row => row[index]).reverse());
    return { ...piece, shape: rotated };
}

function isValidMove(piece, newPosition, newShape) {
    for (let y = 0; y < newShape.length; y++) {
        for (let x = 0; x < newShape[y].length; x++) {
            if (newShape[y][x]) {
                const newX = newPosition.x + x;
                const newY = newPosition.y + y;
                if (newX < 0 || newX >= BOARD_WIDTH || newY >= BOARD_HEIGHT || (newY >= 0 && board[newY][newX])) {
                    return false;
                }
            }
        }
    }
    return true;
}

function placePiece(piece) {
    for (let y = 0; y < piece.shape.length; y++) {
        for (let x = 0; x < piece.shape[y].length; x++) {
            if (piece.shape[y][x]) {
                board[piece.position.y + y][piece.position.x + x] = piece.color;
            }
        }
    }
}

function clearLines() {
    for (let y = BOARD_HEIGHT - 1; y >= 0; y--) {
        if (board[y].every(cell => cell !== 0)) {
            board.splice(y, 1);
            board.unshift(Array(BOARD_WIDTH).fill(0));
            score += 100;
            updateScore();
            y++; // Check the same line again
        }
    }
}

function updateScore() {
    document.getElementById('score').textContent = `Score: ${score}`;
}

function drawBoard() {
    const gameBoard = document.getElementById('game-board');
    gameBoard.innerHTML = '';
    for (let y = 0; y < BOARD_HEIGHT; y++) {
        for (let x = 0; x < BOARD_WIDTH; x++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            let filled = false;
            if (board[y][x]) {
                filled = true;
            }
            if (currentPiece && y >= currentPiece.position.y && y < currentPiece.position.y + currentPiece.shape.length &&
                x >= currentPiece.position.x && x < currentPiece.position.x + currentPiece.shape[0].length &&
                currentPiece.shape[y - currentPiece.position.y][x - currentPiece.position.x]) {
                filled = true;
            }
            if (filled) {
                cell.classList.add('filled');
            }
            gameBoard.appendChild(cell);
        }
    }
}

function drawNextPiece() {
    const nextPieceDiv = document.getElementById('next-piece');
    nextPieceDiv.innerHTML = '';
    if (nextPiece) {
        for (let y = 0; y < 4; y++) {
            for (let x = 0; x < 4; x++) {
                const cell = document.createElement('div');
                cell.className = 'next-cell';
                if (nextPiece.shape[y] && nextPiece.shape[y][x]) {
                    cell.classList.add('next-filled');
                }
                nextPieceDiv.appendChild(cell);
            }
        }
    }
}

function spawnPiece() {
    if (!nextPiece) {
        nextPiece = getRandomTetromino();
    }
    currentPiece = nextPiece;
    nextPiece = getRandomTetromino();
    currentPiece.position = { x: Math.floor(BOARD_WIDTH / 2) - 1, y: 0 };
    if (!isValidMove(currentPiece, currentPiece.position, currentPiece.shape)) {
        gameOver = true;
    }
    drawNextPiece();
}

function drop() {
    if (gameOver) return;
    const newPosition = { x: currentPiece.position.x, y: currentPiece.position.y + 1 };
    if (isValidMove(currentPiece, newPosition, currentPiece.shape)) {
        currentPiece.position = newPosition;
    } else {
        placePiece(currentPiece);
        clearLines();
        spawnPiece();
        if (gameOver) {
            alert('Game Over!');
            return;
        }
    }
    drawBoard();
}

function moveLeft() {
    const newPosition = { x: currentPiece.position.x - 1, y: currentPiece.position.y };
    if (isValidMove(currentPiece, newPosition, currentPiece.shape)) {
        currentPiece.position = newPosition;
        drawBoard();
    }
}

function moveRight() {
    const newPosition = { x: currentPiece.position.x + 1, y: currentPiece.position.y };
    if (isValidMove(currentPiece, newPosition, currentPiece.shape)) {
        currentPiece.position = newPosition;
        drawBoard();
    }
}

function rotatePiece() {
    const rotated = rotate(currentPiece);
    if (isValidMove(rotated, currentPiece.position, rotated.shape)) {
        currentPiece = rotated;
        drawBoard();
    }
}

function gameLoop(time = 0) {
    const deltaTime = time - dropTime;
    if (deltaTime > dropInterval) {
        drop();
        dropTime = time;
    }
    requestAnimationFrame(gameLoop);
}

document.addEventListener('keydown', (e) => {
    if (gameOver) return;
    switch (e.key) {
        case 'ArrowLeft':
            moveLeft();
            break;
        case 'ArrowRight':
            moveRight();
            break;
        case 'ArrowDown':
            drop();
            break;
        case 'ArrowUp':
            rotatePiece();
            break;
    }
});

// Initialize game
spawnPiece();
drawBoard();
gameLoop();
