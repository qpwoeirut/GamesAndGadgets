var canvas = document.getElementById('Breakout');
var context = canvas.getContext('2d');

var ballXRange = document.getElementById("ballXRange");
var ballYRange = document.getElementById("ballYRange");
var ballRandomRange = document.getElementById("ballRandomRange");
var paddleXRange= document.getElementById("paddleXRange");

var sliders = {
    ballX: 3,
    ballY: -3,
    ballRandom: 3,
    paddleX: 4.5
}

var ball = {
    x: canvas.width / 2,
    y: canvas.height - 18,
    w: 8,
    h: 8,
    dx: sliders.ballX,
    dy: sliders.ballY,
    center: 0
};
var paddle = {
    x: (canvas.width - 100) / 2,
    y: (canvas.height - 6),
    w: 100,
    h: 6,
    dx: sliders.paddleX,
    center: 0
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
var environment = {
    score: 0,
    lives: 3,
    speedUp: sliders.ballRandom,
    play: false,
    timesPaused: 0,
    timer: 0
}
var bricks = [];
for(var c=0; c<brickSetup.column; c++) {
    bricks[c] = [];
    for(var r=0; r<brickSetup.row; r++) {
        bricks[c][r] = {x: 0, y: 0, living: 1};
    }
}

var rightPressed = false;
var leftPressed = false;
var launchPressed = false;

function loop() {
    // Display different things when not playing depending on when in the game it is
    // Press P to Start before the game has been started
    if (environment.play === false && environment.timesPaused >= 1) {
        context.fillStyle = 'white';
        context.font = "60px Arial";
        context.fillText("| |", 218, 180)
    }
    // Pause symbol while the game is in play
    else if (environment.play === false && environment.timesPaused === 0) {
        context.fillStyle = 'white';
        context.font = "25px Arial";
        context.fillText("Press P to Start", 150, 160)
    }

    if (environment.play === true) {
        // Loop the game to create an animation
        requestAnimationFrame(loop);
        // Display score, lives, difficulty, and canvas
        document.getElementById("breakoutScore").innerHTML = environment.score;
        document.getElementById("breakoutLives").innerHTML = environment.lives;
        context.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw the ball
        context.fillStyle = "white";
        context.fillRect(ball.x, ball.y, ball.w, ball.h);

        // Launch tooltip
        environment.timer++;
        if (environment.timer >= 400) {
            if (launchPressed === true) {
                context.fillStyle = 'black';
            }
            else {
                context.fillStyle = 'white';
            }
            context.font = "15px Arial";
            context.fillText("Press space to launch the ball", 140, 18)
            if (launchPressed === true) {
                environment.timer = 0;
            }
        }
        // Update the ball's position by adding speed to it
        if (launchPressed === true) {
            ball.x += ball.dx;
            ball.y += ball.dy;
        }
        // Define the center of the ball and paddle
        ball.center = ball.x + (ball.w / 2);
        paddle.center = paddle.x + (paddle.w / 2);
        // Ball collision with walls
        // Top or bottom
        if (ball.y + ball.dy < (ball.w / 2)) {
            ball.dy = -ball.dy;
        } 
        // Paddle
        else if (ball.y + ball.dy > canvas.height - ball.w) {
            if (ball.x > paddle.x - ball.w && ball.x < paddle.x + paddle.w + ball.w) {
                // Change the ball speed depending on where on the paddle it hits
                if (ball.center < paddle.center) {
                    ball.dy = (paddle.center / ball.center) * environment.speedUp;
                    if (ball.dy > 6) {
                        ball.dy = 5.5
                    }
                }
                else {
                    ball.dy = (ball.center / paddle.center) * environment.speedUp;
                    if (ball.dy > 6) {
                        ball.dy = 5.5
                    }
                }
                ball.dy = -ball.dy;
            }
            else {
                launchPressed = false;
                if (environment.lives >= 0) {
                    ball.x = paddle.center;
                    ball.y = canvas.height - 18;
                    environment.lives -= 1;
                    if (launchPressed === true) {
                        ball.dy = sliders.ballY;
                        ball.dx = ball.dx * -1;
                    }
                }
                else {
                    alert("You are out of lives! \nScore: " + environment.score);
                    document.location.reload();
                    environment.lives = 3;
                }
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
        if (rightPressed === true) {
            paddle.x += paddle.dx;
            if (launchPressed === false) {
                ball.x = paddle.center;
            }
            if (paddle.x + paddle.w > canvas.width){
                paddle.x = canvas.width - paddle.w;
            }
        }
        else if (leftPressed === true) {
            paddle.x -= paddle.dx;
            if (launchPressed === false) {
                ball.x = paddle.center;
            }
            if (paddle.x < 0){
                paddle.x = 0;
            }
        }


        // Call the function to draw the bricks every frame
        drawBricks();

        // Call the function to detect brick and ball collision
        collisionDetection();
    }
}


ballXRange.addEventListener("change", function() { 
    ball.dx = ballXRange.value / 1;  

})
ballYRange.addEventListener("change", function() { 
    ball.dy = ballYRange.value / 1;
})
ballRandomRange.addEventListener("change", function() { 
    environment.speedUp = ballRandomRange.value / 1;  

})
paddleXRange.addEventListener("change", function() { 
    paddle.dx = paddleXRange.value / 1;  

})

// Reset button for settings sliders
function resetSettings() {
    control: document.getElementById("ballXRange").value = "3";
    control: document.getElementById("ballYRange").value = "-3";
    control: document.getElementById("ballRandomRange").value = "3";
    control: document.getElementById("paddleXRange").value = "4.5";
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
                if (brickY < brickSetup.h * 2) {
                    context.fillStyle = "red"
                }
                else if (brickY < brickSetup.h * 3) {
                    context.fillStyle = "orange"
                }
                else if (brickY < brickSetup.h * 4) {
                    context.fillStyle = "yellow"
                }
                else if (brickY < brickSetup.h * 5) {
                    context.fillStyle = "green"
                }
                else if (brickY < brickSetup.h * 6) {
                    context.fillStyle = "blue"
                }
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
            var brickY = (r * (brickSetup.h + brickSetup.padding)) + brickSetup.top;
            if (b.living === 1) {
                if (ball.x > b.x && ball.x < b.x + brickSetup.w && ball.y > b.y && ball.y < b.y + brickSetup.h) {
                    ball.dy = -ball.dy;
                    b.living = 0;
                    // Add to the score when a brick is broken
                    if (brickY < brickSetup.h * 2) {
                        environment.score += 5;
                        environment.speedUp += 0.09
                    }
                    else if (brickY < brickSetup.h * 3) {
                        environment.score += 4;
                        environment.speedUp += 0.06;
                    }
                    else if (brickY < brickSetup.h * 4) {
                        environment.score += 3;
                        environment.speedUp += 0.03;
                    }
                    else if (brickY < brickSetup.h * 5) {
                        environment.score += 2;
                        environment.speedUp += 0.024;
                    }
                    else if (brickY < brickSetup.h * 6) {
                        environment.score += 1;
                        environment.speedUp += 0.015;
                    }
                    if (environment.score >= 120) {
                        alert("You win! \nLives remaining: " + environment.lives);
                        document.location.reload();
                    }
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


    // Handle the user pausing and unpausing the game
    else if (e.which === 80 && environment.play === true) {
        // Pause the game
        environment.play = false;
        environment.timesPaused++;
    }
    else if (e.which === 80 && environment.play === false) {
        environment.play = true;
        requestAnimationFrame(loop);
    }

    // Handle the user launching the ball with space
    else if (e.key === " ") {
        launchPressed = true;
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

if (environment.play === true) {
    requestAnimationFrame(loop);
}