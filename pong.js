const OFF = 0;
const ON = 1;
const PAUSED = 2;

const EASY = 3;
const MEDIUM = 5;
const HARD = 10;

function initializeGame() {
    var game = new Object();
    game.state = OFF;
    return game;
}


function startGame(game) {
    game.state = ON;
    game.difficulty = MEDIUM;
    game.score = 0;

    game.ballSpeed = 3;
    game.ballSize = 10;
    game.ballVelocityX = -1;
    game.ballVelocityY = 0;
    game.ballX = 400 - (game.ballSize / 2);
    game.ballY = 200 - (game.ballSize / 2);

    game.paddleSpeed = 5;
    game.paddleSize = 100;
    game.paddleDir = 0;
    game.paddleY = 200 - (game.paddleSize / 2);

    game.renderer = setInterval(function() {
        if (game.state === PAUSED) return;
        moveObjects();
        renderGame();
    }, 10);
}

function moveObjects() {
    logMessage("invoked moveObjects");
    game.paddleY += game.paddleDir * game.paddleSpeed;
    game.paddleY = Math.max(game.paddleY, 0);
    game.paddleY = Math.min(game.paddleY, 400 - game.paddleSize);

    game.ballX += game.ballVelocityX * game.ballSpeed;
    game.ballY += game.ballVelocityY * game.ballSpeed;

    if (50 - game.ballSpeed <= game.ballX && game.ballX <= 50 && game.paddleY <= game.ballY + game.ballSize && game.ballY <= game.paddleY + game.paddleSize) {
        incrementScore();
        game.ballX = 50;
        game.ballVelocityX = -game.ballVelocityX;
        const paddleCenter = game.paddleY + game.paddleSize;
        game.ballVelocityY += (game.ballY - paddleCenter) / (game.paddleSize * 2) + (Math.random() / 1000);
        game.ballSpeed += Math.min(0.5, game.difficulty / game.ballSpeed);
    }
    if (game.ballX + game.ballSize >= 800) {
        game.ballX = 800 - game.ballSize;
        game.ballVelocityX = -game.ballVelocityX;
    }
    if (game.ballY <= 0) {
        game.ballY = 0;
        game.ballVelocityY = -game.ballVelocityY;
    }
    if (game.ballY + game.ballSize >= 400) {
        game.ballY = 400 - game.ballSize;
        game.ballVelocityY = -game.ballVelocityY;
    }

    game.ballVelocityY = Math.min(game.ballVelocityY, 5);
    game.ballVelocityY = Math.max(game.ballVelocityY, -5);

    if (game.ballX < -game.ballSpeed) {
        game.ballX = 0;
        loseGame();
    }
}

function renderGame() {
    logMessage("invoked renderGame");
    const canvas = document.getElementById("pongCanvas");
    const context = canvas.getContext("2d");

    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "#ffffff";
    context.fillRect(game.ballX, game.ballY, game.ballSize, game.ballSize);
    context.fillRect(50, game.paddleY, -10, game.paddleSize);
}

function incrementScore() {
    document.getElementById("score").textContent = ++game.score;
}

function loseGame() {
    game.state = OFF;
    const buttonElem = document.getElementById("playButton");
    buttonElem.textContent = "New Game";
    clearInterval(game.renderer);
    renderGame();

    setTimeout(function() {
        alert("You lost!");
    }, 100);
}

function playButtonClick() {
    const buttonElem = document.getElementById("playButton");
    if (game.state === OFF) {
        buttonElem.textContent = "Pause Game";
        startGame(game);
    }
    else if (game.state === ON) {
        buttonElem.textContent = "Continue Game";
        game.state = PAUSED;
    }
    else if (game.state === PAUSED) {
        buttonElem.textContent = "Pause Game";
        game.state = ON;
    }
}

function startPaddleMove(event) {
    if (event.key === "ArrowUp" || event.key === "w") {
        game.paddleDir = -1;
    }
    if (event.key === "ArrowDown" || event.key === "s") {
        game.paddleDir = 1;
    }
}

function stopPaddleMove(event) {
    if (event.key === "ArrowUp" || event.key === "w") {
        game.paddleDir = 0;
    }
    if (event.key === "ArrowDown" || event.key === "s") {
        game.paddleDir = 0;
    }
}