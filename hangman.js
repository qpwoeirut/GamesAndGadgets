const OFF = 0;
const ON = 1;


function startGame(game) {
    game.state = ON;

    const canvas = document.getElementById("hangmanCanvas");
    game.lineSize = canvas.width / 50;
    game.topLeftX = canvas.width / 4;
    game.topRightX = canvas.width * 3 / 4;
    game.baseSize = canvas.width / 5;
    game.bottomLeftX = game.topLeftX - game.baseSize + (game.lineSize / 2);
    game.bottomRightX = game.topLeftX + game.baseSize - (game.lineSize / 2);
    game.topY = canvas.height / 10;
    game.bottomY = canvas.height * 9 / 10;
    
    game.diagSize = canvas.width / 5;

    game.headY = game.topY + (game.lineSize * 5);
    game.headRadius = canvas.width / 12;

    game.topBodyY = game.headY + game.headRadius + game.headRadius;
    game.bottomBodyY = game.topBodyY + canvas.height * 3 / 10;
    game.middleBodyY = (game.topBodyY + game.bottomBodyY) / 2;

    game.armWidth = canvas.width / 6;
    game.legWidth = canvas.width / 8;
    game.legY = game.bottomBodyY + canvas.height / 8;
    
    renderHangmanCanvas(0);
}

const drawPartFunctions = [
    function(ctx) {
        ctx.arc(game.topRightX, game.headY + game.headRadius, game.headRadius, 0, 2 * Math.PI);
    },
    function(ctx) {
        ctx.moveTo(game.topRightX, game.topBodyY);
        ctx.lineTo(game.topRightX, game.bottomBodyY);
    },
    function(ctx) {
        ctx.moveTo(game.topRightX, game.middleBodyY);
        ctx.lineTo(game.topRightX - game.armWidth, game.topBodyY);
    },
    function(ctx) {
        ctx.moveTo(game.topRightX, game.middleBodyY);
        ctx.lineTo(game.topRightX + game.armWidth, game.topBodyY);
    },
    function(ctx) {
        ctx.moveTo(game.topRightX, game.bottomBodyY);
        ctx.lineTo(game.topRightX - game.legWidth, game.legY);
    },
    function(ctx) {
        ctx.moveTo(game.topRightX, game.bottomBodyY);
        ctx.lineTo(game.topRightX + game.legWidth, game.legY);
    },
];

function renderHangmanCanvas(misses) {
    const canvas = document.getElementById("hangmanCanvas");
    const context = canvas.getContext("2d");

    context.clearRect(0, 0, canvas.height, canvas.width);

    context.fillStyle = "black";
    context.lineWidth = game.lineSize;

    drawPlatform(context);

    for (let i=0; i<misses; i++) {
        context.beginPath();
        drawPartFunctions[i](context);
        context.stroke();

        if (i === 5) {
            loseGame();
            break;
        }
    }
}

function drawPlatform(context) {
    logMessage("invoked drawPlatform");

    // bottom
    context.beginPath();
    context.moveTo(game.bottomLeftX, game.bottomY);
    context.lineTo(game.bottomRightX, game.bottomY);
    context.stroke();

    // vertical left part
    context.beginPath();
    context.moveTo(game.topLeftX, game.topY);
    context.lineTo(game.topLeftX, game.bottomY);
    context.stroke();

    // top part
    context.beginPath();
    context.moveTo(game.topLeftX - (game.lineSize / 2), game.topY);
    context.lineTo(game.topRightX + (game.lineSize / 2), game.topY);
    context.stroke();

    // diagonal part
    context.beginPath();
    context.moveTo(game.topLeftX, game.topY + game.diagSize);
    context.lineTo(game.topLeftX + game.diagSize, game.topY);
    context.stroke();

    // vertical thing at the top
    context.beginPath();
    context.moveTo(game.topRightX, game.topY);
    context.lineTo(game.topRightX, game.headY);
    context.stroke();
}

function loseGame() {
    alert("You lost!");
}