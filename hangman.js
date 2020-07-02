const OFF = 0;
const ON = 1;


function startGame(game) {
    game.state = ON;
    
    renderHangmanCanvas(0);
}

function renderHangmanCanvas(misses) {
    const canvas = document.getElementById("hangmanCanvas");
    const context = canvas.getContext("2d");

    context.clearRect(0, 0, canvas.height, canvas.width);
    drawPlatform(context);
}

function drawPlatform() {
    const canvas = document.getElementById("hangmanCanvas");
    const context = canvas.getContext("2d");
    context.fillStyle = "black";

    const rectWidth = canvas.width / 50;
    const rectHeight = canvas.height / 50;

    const topLeftX = canvas.width / 5;
    const topLeftY = canvas.height / 6;

    const diagSize = canvas.width / 5;

    // bottom
    context.fillRect(canvas.width / 25, canvas.height * 13 / 15, canvas.width * 17 / 50, rectHeight);

    // vertical left part
    context.fillRect(topLeftX, topLeftY, rectWidth, canvas.height * 7 / 10);

    // top part
    context.fillRect(topLeftX, topLeftY, canvas.width * 3 / 7, rectHeight);

    // diagonal part
    context.beginPath();
    context.lineWidth = rectHeight * 2 / 3;
    context.moveTo(topLeftX + (rectWidth / 2), topLeftY + diagSize);
    context.lineTo(topLeftX + diagSize, topLeftY + (rectHeight / 2));
    context.stroke();
}