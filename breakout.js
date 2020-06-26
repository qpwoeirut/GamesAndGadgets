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
    dx: 2.5,
};


var brickSetup = {
    row: 5,
    column: 8,
    w: 59,
    h: 25,
    padding: 2,
    top: 25,
    left: 0
};

var bricks = [];
for(var c=0; c<brickSetup.column; c++) {
    bricks[c] = [];
    for(var r=0; r<brickSetup.row; r++) {
        bricks[c][r] = {x: 0, y: 0, living: 1};
    }
}

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
    if (ball.y + ball.dy < (ball.w / 2)) {
        ball.dy = -ball.dy;
    } 
    else if (ball.y + ball.dy > canvas.height - ball.w) {
        if (ball.x > paddle.x && ball.x < paddle.x + paddle.w) {
            ball.dy = -ball.dy;
        }
        else {
            // ADD A LOSE CONDITION |ADD A LOSE CONDITION |ADD A LOSE CONDITION |ADD A LOSE CONDITION |ADD A LOSE CONDITION |ADD A LOSE CONDITION |ADD A LOSE CONDITION |ADD A LOSE CONDITION |ADD A LOSE CONDITION |ADD A LOSE CONDITION |ADD A LOSE CONDITION |
        }
    }
    // Left or right walls
    else if (ball.x + ball.dx > canvas.width - (ball.w / 2) || ball.x + ball.dx < 0) {
        ball.dx = -ball.dx;
    }


    // Draw the paddle
    context.fillStyle = "white";
    context.fillRect(paddle.x, paddle.y, paddle.w, paddle.h);

    // Update the paddle's posision when the user presses a key and prevent the player from leaving the canvas
    if (rightPressed) {
        paddle.x += paddle.dx;
        if (paddle.x + paddle.w > canvas.width){
            paddle.x = canvas.width - paddle.w;
        }
    }
    else if (leftPressed) {
        paddle.x -= paddle.dx;
        if (paddle.x < 0){
            paddle.x = 0;
        }
    }


    // Call the function to draw the bricks every frame
    drawBricks();

    // Call the function to detect brick and ball collision
    collisionDetection();
}

// Map and draw bricks
function drawBricks() {
    for (var c = 0; c < brickSetup.column; c++) {
        for (var r = 0; r < brickSetup.row; r++) {
            if (bricks[c][r].living === 1) {
                // Find out where the bricks are on the canvas
                var brickX = (c * (brickSetup.w + brickSetup.padding)) + brickSetup.left;
                var brickY = (r * (brickSetup.h + brickSetup.padding)) + brickSetup.top;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;

                // Draw the bricks
                context.beginPath();
                context.rect(brickX, brickY, brickSetup.w, brickSetup.h);
                context.fillStyle = "white";
                context.fill();
                context.closePath();
            }
        }
    }
}

// Detect collision between the ball and a brick and remove the brick
function collisionDetection() {
    for (var c = 0; c < brickSetup.column; c++) {
        for (var r = 0; r < brickSetup.row; r++) {
            var b = bricks[c][r];
            if (b.living === 1) {
                if (ball.x > b.x && ball.x < b.x + brickSetup.w && ball.y > b.y && ball.y < b.y + brickSetup.h) {
                    ball.dy = -ball.dy;
                    b.living = 0;
                }
            }
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