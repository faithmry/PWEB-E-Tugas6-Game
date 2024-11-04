const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score');
const startScreen = document.getElementById('startScreen');
const gameOverScreen = document.getElementById('gameOverScreen');
const finalScore = document.getElementById('finalScore');

const gridSize = 20;
const canvasWidth = canvas.width = window.innerWidth * 0.8;
const canvasHeight = canvas.height = window.innerHeight * 0.8;

let snake, direction, food, score, gameLoopInterval;
let speed = 100; // Speed in milliseconds, lower is faster

function initGame() {
    snake = [{ x: gridSize * 5, y: gridSize * 5 }];
    direction = { x: 0, y: 0 };
    food = { x: gridSize * 10, y: gridSize * 10 };
    score = 0;
    updateScore();
}

function drawRect(x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, gridSize, gridSize);
}

function drawGradientRect(x, y, color1, color2) {
    const gradient = ctx.createLinearGradient(x, y, x + gridSize, y + gridSize);
    gradient.addColorStop(0, color1);
    gradient.addColorStop(1, color2);
    ctx.fillStyle = gradient;
    ctx.fillRect(x, y, gridSize, gridSize);
}

function drawSnake() {
    snake.forEach(segment => drawGradientRect(segment.x, segment.y, 'green', 'lightgreen'));
}

function drawFood() {
    drawGradientRect(food.x, food.y, 'red', 'orange');
}

function moveSnake() {
    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };
    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        score += 10;
        updateScore();
        placeFood();
    } else {
        snake.pop();
    }
}

function placeFood() {
    food.x = Math.floor(Math.random() * (canvasWidth / gridSize)) * gridSize;
    food.y = Math.floor(Math.random() * (canvasHeight / gridSize)) * gridSize;
}

function checkCollision() {
    const head = snake[0];

    if (head.x < 0 || head.x >= canvasWidth || head.y < 0 || head.y >= canvasHeight) {
        return true;
    }

    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            return true;
        }
    }

    return false;
}

function update() {
    if (checkCollision()) {
        clearInterval(gameLoopInterval);
        finalScore.textContent = 'Final Score: ' + score;
        gameOverScreen.classList.add('visible');
    }

    moveSnake();
}

function draw() {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    drawSnake();
    drawFood();
}

function gameLoop() {
    update();
    draw();
}

function startGame() {
    initGame();
    startScreen.classList.remove('visible');
    gameOverScreen.classList.remove('visible');
    gameLoopInterval = setInterval(gameLoop, speed);
}

function updateScore() {
    scoreDisplay.textContent = 'Score: ' + score;
    scoreDisplay.style.transform = 'scale(1.2)';
    setTimeout(() => {
        scoreDisplay.style.transform = 'scale(1)';
    }, 300);
}

window.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'ArrowUp':
            if (direction.y === 0) direction = { x: 0, y: -gridSize };
            break;
        case 'ArrowDown':
            if (direction.y === 0) direction = { x: 0, y: gridSize };
            break;
        case 'ArrowLeft':
            if (direction.x === 0) direction = { x: -gridSize, y: 0 };
            break;
        case 'ArrowRight':
            if (direction.x === 0) direction = { x: gridSize, y: 0 };
            break;
    }
});