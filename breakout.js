var canvas = document.getElementById('Breakout');
var context = canvas.getContext('2d');

var ball = {
    x: canvas.width / 2,
    y: canvas.height - 30,
    w: 8,
    h: 8,
    dx: 1,
    dy: -1,
};

var paddle = {
    x: (canvas.width - 100) / 2,
    y: (canvas.height - 6),
    w: 100,
    h: 6,
    dx: 4,
};

var rightPressed = false;
var leftPressed = false;

function loop() {
    // Loop the game to create an animation and clear the canvas to prevent drawing
    requestAnimationFrame(loop);
    context.clearRect(0, 0, canvas.width, canvas.height);

    
    // Draw the ball
    context.fillStyle = "white";
    context.fillRect(ball.x, ball.y, ball.w, ball.h);

    // Update the ball's position by adding speed to it
    ball.x += ball.dx;
    ball.y += ball.dy;
    // Ball collision with walls
    // Top or bottom
    if (ball.y + ball.dy > canvas.height - (ball.w / 2) || ball.y + ball.dy < 0) {
        ball.dy = -ball.dy;
    }
    // Left or right walls
    else if (ball.x + ball.dx > canvas.width - (ball.w / 2) || ball.x + ball.dx < 0) {
        ball.dx = -ball.dx;
    }


    // Draw the paddle
    context.fillStyle = "white";
    context.fillRect(paddle.x, paddle.y, paddle.w, paddle.h);

    // Update the paddle's posision when the user presses a key and prevent the player from leaving the canvas
    if(rightPressed) {
        paddle.x += paddle.dx;
        if (paddle.x + paddle.w > canvas.width){
            paddle.x = canvas.width - paddle.w;
        }
    }
    else if(leftPressed) {
        paddle.x -= paddle.dx;
        if (paddle.x < 0){
            paddle.x = 0;
        }
    }


}

// Add action listeners
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
// Handle the user pressing down a key
function keyDownHandler(e) {
    // d or right arrow pressed
    if (e.key === "ArrowRight") {
        rightPressed = true
    }
    // a or left arrow pressed
    else if (e.key === "ArrowLeft") {
        leftPressed = true;
    }
}

// Handle the user releasing a key
function keyUpHandler(e) {
    // d or right arrow released
    if (e.key === "ArrowRight") {
        rightPressed = false;
    }
    // a or left arrow released
    else if (e.key === "ArrowLeft") {
        leftPressed = false;
    }
}

requestAnimationFrame(loop);