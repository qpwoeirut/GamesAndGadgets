const OFF = 0;
const ON = 1;
const PAUSED = 2;

const EASY = 0;
const MEDIUM = 1;
const HARD = 2;

const HEIGHT = 400;
const WIDTH = 800;

const DEFAULT_INIT_SPEED = 3;
const DEFAULT_ACCEL = 5;

function initializeGame() {
    var game = new Object();
    game.state = OFF;
    return game;
}


function startGame(game) {
    const canvas = document.getElementById("pongCanvas");
    canvas.height = HEIGHT;
    canvas.width = WIDTH;

    game.state = ON;
    game.score = 0;

    game.ballSpeed = parseInt(document.getElementById("ballSpeedInput").value) || DEFAULT_INIT_SPEED;
    game.ballAcceleration = parseInt(document.getElementById("ballAccelInput").value) || DEFAULT_ACCEL;

    game.ballSize = 10;
    game.ballVelocityX = -1;
    game.ballVelocityY = 0;
    game.ballX = (WIDTH / 2) - (game.ballSize / 2);
    game.ballY = (HEIGHT / 2) - (game.ballSize / 2);

    game.paddleSize = 100;
    game.paddleDir = 0;
    game.paddleY = (HEIGHT / 2) - (game.paddleSize / 2);

    game.renderer = setInterval(function() {
        if (game.state === PAUSED) return;
        moveObjects();
        renderGame();
    }, 10);

    updateScore(game.score);
}

function moveObjects() {
    game.paddleY = Math.max(game.paddleY, 0);
    game.paddleY = Math.min(game.paddleY, HEIGHT - game.paddleSize);

    game.ballX += game.ballVelocityX * game.ballSpeed;
    game.ballY += game.ballVelocityY * game.ballSpeed;

    if (50 - game.ballSpeed <= game.ballX && game.ballX <= 50 && game.paddleY <= game.ballY + game.ballSize && game.ballY <= game.paddleY + game.paddleSize) {
        updateScore(++game.score);
        game.ballX = 50;
        game.ballVelocityX = -game.ballVelocityX;
        const paddleCenter = game.paddleY + (game.paddleSize / 2);
        game.ballVelocityY += (game.ballY + (game.ballSize / 2) - paddleCenter) / (game.paddleSize) + ((Math.random() - 0.5) / 1000);
        game.ballSpeed += Math.min(1, game.ballAcceleration / game.ballSpeed);
    }
    if (game.ballX + game.ballSize >= WIDTH) {
        game.ballX = WIDTH - game.ballSize;
        game.ballVelocityX = -game.ballVelocityX;
    }
    if (game.ballY <= 0) {
        game.ballY = 0;
        game.ballVelocityY = -game.ballVelocityY;
    }
    if (game.ballY + game.ballSize >= HEIGHT) {
        game.ballY = HEIGHT - game.ballSize;
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

function updateScore(score) {
    document.getElementById("score").textContent = score;
}

function loseGame() {
    logMessage("invoked loseGame");
    game.state = OFF;
    const buttonElem = document.getElementById("playPauseButton");
    buttonElem.textContent = "New Game";
    clearInterval(game.renderer);
    renderGame();

    setTimeout(function() {
        logMessage("You lost!", 5);
        alert("You lost!");
    }, 100);
}

function handlePauseKey(event) {
    if (event.key !== " ") return;
    playPauseGame();
}

function playPauseGame() {
    const buttonElem = document.getElementById("playPauseButton")
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

function setDifficulty(difficulty) {
    logMessage("invoked setDifficulty with difficulty=" + difficulty);
    const ballSpeedInput = document.getElementById("ballSpeedInput");
    const ballAccelInput = document.getElementById("ballAccelInput");
    if (difficulty === EASY) {
        ballSpeedInput.value = 2;
        ballAccelInput.value = 5;
    }
    else if (difficulty === MEDIUM) {
        ballSpeedInput.value = 5;
        ballAccelInput.value = 10;
    }
    else if (difficulty === HARD) {
        ballSpeedInput.value = 10;
        ballAccelInput.value = 50;
    }
    else {
        console.error("Unrecognized difficulty " + difficulty);
    }
}

function closeSettings(saveChanges) {
    closeId("settingsContainer");

    const ballSpeedInput = document.getElementById("ballSpeedInput");
    const ballAccelInput = document.getElementById("ballAccelInput");
    if (saveChanges === false) {
        ballSpeedInput.value = game.ballSpeed || DEFAULT_INIT_SPEED;
        ballAccelInput.value = game.ballAcceleration || DEFAULT_ACCEL;
        return;
    }
}

function movePaddleMouse(event) {
    game.paddleY = event.offsetY - game.paddleSize / 2;
}
