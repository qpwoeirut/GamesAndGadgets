var canvas = document.getElementById('Bird');
var context = canvas.getContext('2d');

var bird = {
    x: 25,
    y: 200,
    w: 25, 
    h: 25,
    speed: 0
};
var pipeInfo = {
    gap: 100,
    constant: 0,
    h: 300,
    w: 50
};

var environment = {
    score: 0,
};

var pipe = [];

pipe[0] = {
    x: canvas.width,
    y: 0
};

function moveUp(){  
    bird.speed = -2.6; 
} 

function loop() {
    // Clear the canvas for redrawing
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the bird
    context.fillStyle = "yellow";
    context.fillRect(bird.x, bird.y, bird.w, bird.h);

    // Place pipe pairs
    for (var i = 0; i < pipe.length; i++) {
        // Set the position of the gap in the pipes
        pipeInfo.constant = pipeInfo.h + pipeInfo.gap;
        // Draw the pipes
        context.fillStyle = "green";
        context.fillRect(pipe[i].x, pipe[i].y, pipeInfo.w, pipeInfo.h);

        context.fillStyle = "green";
        context.fillRect(pipe[i].x, pipe[i].y + pipeInfo.constant, pipeInfo.w, pipeInfo.h);

        pipe[i].x--;

        // If this is set to a very large number, it will tank chrome... too bad!
        if (pipe[i].x === 200) { // --------> 200 is classic flappy bird. Range around 0-300
            pipe.push({  
                x: canvas.width,
                y: Math.floor(Math.random() * pipeInfo.h) - pipeInfo.h
            });
        }

        // If the birth hits a pipe
        if (bird.x + bird.w >= pipe[i].x && bird.x <= pipe[i].x + pipeInfo.w && (bird.y <= pipe[i].y + pipeInfo.h || bird.y + bird.h >= pipe[i].y + pipeInfo.constant) || bird.y + bird.h >= canvas.height) {
            location.reload();
        }

        // If the bird passes the pipes
        if (pipe[i].x === 5){  
            environment.score++;   
        }
    }

    // Account for gravity on the bird and adjust the bird
    bird.y += bird.speed;
    bird.speed += 0.1; // --------> 0.1 is about the right gravity for classic flappy bird. Range around 0.05-0.2

    requestAnimationFrame(loop);
}

// Add action listeners
document.addEventListener("keydown", keyDownHandler, false);

// Handle the user pressing down a key
function keyDownHandler(e) {
    // space pressed
    if (e.key === " ") {
        moveUp();
    }
}

requestAnimationFrame(loop);