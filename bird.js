var canvas = document.getElementById('Bird');
var context = canvas.getContext('2d');

var bird = {
    x: 25,
    y: 200,
    w: 25, 
    h: 25
};
var pipeInfo = {
    gap: 85,
    constant: 0,
    h: 325,
    w: 50
};

var environment = {
    score: 0,
    gravity: 0.5
};

var pipe = [];

pipe[0] = {
    x: canvas.width,
    y: 0
};

function moveUp(){  
    bird.y-= 25; 
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

        if (pipe[i].x === 125) { // --------> set settings option range -125 through 250
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

    // Account for gravity on the bird
    bird.y += environment.gravity;

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