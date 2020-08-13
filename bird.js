var canvas = document.getElementById('Bird');
var context = canvas.getContext('2d');

var birdImg = new Image();  
var bird = {
    x: 25,
    y: 200,
    w: 35, 
    h: 25,
    speed: 0,
    angle: 0
};
var ground = new Image();
var groundInfo = {
    x: 0,
    y: 370
}
var floorPipe = new Image();
var roofPipe = new Image();
const pipeNum = 2 // Range: 1-3 (2)
var pipeInfo = {
    gap: 100,
    constant: 0,
    h: 300,
    w: 50,
    dis: canvas.width / pipeNum,
    num: pipeNum + 1,
    speed: 2
};
var environment = {
    score: 0,
    play: false
};

var pipe = [];

initPipes();

// Source images
birdImg.src = "bird.png";  
floorPipe.src = "floorPipe.png"
roofPipe.src = "roofPipe.png";
ground.src = "ground.png";


// Move the bird up when space is pressed
function moveUp() {  
    bird.speed = -4.8; // Range 3.8-5.8 (4.8)
} 

function loop() {
    if (environment.play === true) {
        // Clear the canvas for redrawing
        context.clearRect(0, 0, canvas.width, canvas.height);

        // Draw the bird
        context.drawImage(birdImg, bird.x, bird.y);

        // Place pipe pairs
        for (var i = 0; i < pipeInfo.num; i++) {
            // Set the position of the gap in the pipes
            pipeInfo.constant = pipeInfo.h + pipeInfo.gap;
            // Draw the pipes
            context.drawImage(roofPipe, pipe[i].x, pipe[i].y - 100);
            context.drawImage(floorPipe, pipe[i].x, pipe[i].y + pipeInfo.constant);

            // Move the pipes
            pipe[i].x -= pipeInfo.speed; // range 1-3 (2)

            // Loop the pipes around the canvas
            if (pipe[i].x <= -pipeInfo.w) {
                pipe[i].x = canvas.width - pipeInfo.w + pipeInfo.dis;
                pipe[i].y = Math.floor(Math.random() * pipeInfo.h) - pipeInfo.h;
            }

            // If the bird hits a pipe
            if (bird.x + bird.w >= pipe[i].x && bird.x <= pipe[i].x + pipeInfo.w && (bird.y <= pipe[i].y + pipeInfo.h || bird.y + bird.h >= pipe[i].y + pipeInfo.constant) || bird.y + bird.h >= groundInfo.y) {
                environment.play = false;
            }

            // If the bird passes the pipes
            if (bird.x + bird.w / 2 >= pipe[i].x){  
                environment.score++;
            }
        }

        // Draw the ground
        context.drawImage(ground, groundInfo.x, groundInfo.y);

        // Account for gravity on the bird and adjust the bird
        bird.y += bird.speed;
        bird.speed += 0.33; // Range: 0.2-0.45 (0.33)

        requestAnimationFrame(loop);
    }
}

function reset() {
    bird.y = 200;
    bird.speed = 0;
    environment.score = 0;
    initPipes();
    requestAnimationFrame(loop);
}

function initPipes() {
    for (var i = 0; i < pipeInfo.num; i++) {
        pipe[i] = {
            x: canvas.width + i * pipeInfo.dis,
            y: Math.floor(Math.random() * pipeInfo.h) - pipeInfo.h
        };
    }
}

// Add action listeners
document.addEventListener("keydown", keyDownHandler, false);

// Handle the user pressing down a key
function keyDownHandler(e) {
    // space pressed
    if (e.key === " ") {
        if (environment.play === true) {
            moveUp();
        }
        else {
            environment.play = true;
            reset();
        }
    }
}