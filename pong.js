const OFF = 0;
const ON = 1;
const PAUSED = 2;

function initializeGame() {
    var game = new Object();
    game.state = OFF;
    return game;
}


function startGame(game) {
    game.state = ON;
    game.score = 0;

    game.ballAcceleration = parseInt(document.getElementById("ballAccelInput").value) || 5;

    game.ballSpeed = 3;
    game.ballSize = 10;
    game.ballVelocityX = -1;
    game.ballVelocityY = 0;
    game.ballX = 400 - (game.ballSize / 2);
    game.ballY = 200 - (game.ballSize / 2);

    game.paddleSize = 100;
    game.paddleDir = 0;
    game.paddleY = 200 - (game.paddleSize / 2);

    game.renderer = setInterval(function() {
        if (game.state === PAUSED) return;
        moveObjects();
        renderGame();
    }, 10);

    updateScore(game.score);
}

function moveObjects() {
    game.paddleY = Math.max(game.paddleY, 0);
    game.paddleY = Math.min(game.paddleY, 400 - game.paddleSize);

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

function movePaddleMouse(event) {
    game.paddleY = event.offsetY - game.paddleSize / 2;
}

function updateBallAccel() {
    game.ballAcceleration = parseInt(document.getElementById("ballAccelInput").value) || 5;
}