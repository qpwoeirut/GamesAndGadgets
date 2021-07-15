var canvas = document.getElementById('Bird');
var context = canvas.getContext('2d');

var birdImg = new Image();  
var bird = {
    x: 25,
    y: 200,
    w: 35, 
    h: 25,
    speed: 0,
    angle: 90
};
var floorPipe = new Image();
var roofPipe = new Image();
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
<<<<<<< HEAD
    y: 0
=======
    y: Math.floor(Math.random() * pipeInfo.h) - pipeInfo.h
>>>>>>> parent of 9d45ffb... changed how pipes are displayed
};

// Source images
birdImg.src = "bird.png";  
floorPipe.src = "floorPipe.png";
roofPipe.src = "roofPipe.png";


// Move the bird up when space is pressed
<<<<<<< HEAD
function moveUp(){  
    bird.speed = -2.6; 
} 

function loop() {
    // Clear the canvas for redrawing
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the bird
    // context.fillStyle = "purple"; ---> hitbox for debug
    // context.fillRect(bird.x, bird.y, bird.w, bird.h);
    context.drawImage(birdImg, bird.x - 87, bird.y - 73);

    // Place pipe pairs
    for (var i = 0; i < pipe.length; i++) {
        // Set the position of the gap in the pipes
        pipeInfo.constant = pipeInfo.h + pipeInfo.gap;
        // Draw the pipes
        // context.fillStyle = "purple";
        // context.fillRect(pipe[i].x, pipe[i].y, pipeInfo.w, pipeInfo.h);
        context.drawImage(roofPipe, pipe[i].x, pipe[i].y - 100);
        // context.fillStyle = "purple";
        // context.fillRect(pipe[i].x, pipe[i].y + pipeInfo.constant, pipeInfo.w, pipeInfo.h);
        context.drawImage(floorPipe, pipe[i].x, pipe[i].y + pipeInfo.constant);

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
=======
function moveUp() {  
    bird.speed = -4.8; 
} 

function loop() {
    if (environment.play === true) {
        // Clear the canvas for redrawing
        context.clearRect(0, 0, canvas.width, canvas.height);

        // Draw the bird
        context.drawImage(birdImg, bird.x, bird.y);

        // Place pipe pairs
        for (var i = 0; i < pipe.length; i++) {
            // Set the position of the gap in the pipes
            pipeInfo.constant = pipeInfo.h + pipeInfo.gap;
            // Draw the pipes
            context.drawImage(roofPipe, pipe[i].x, pipe[i].y - 100);
            context.drawImage(floorPipe, pipe[i].x, pipe[i].y + pipeInfo.constant);

            pipe[i].x -= 2;

            if (pipe[i].x === -pipeInfo.w) {
                pipe[i] = {
                    x: canvas.width,
                    y: Math.floor(Math.random() * pipeInfo.h) - pipeInfo.h
                };
            }

            // If the bird hits a pipe
            if (bird.x + bird.w >= pipe[i].x && bird.x <= pipe[i].x + pipeInfo.w && (bird.y <= pipe[i].y + pipeInfo.h || bird.y + bird.h >= pipe[i].y + pipeInfo.constant) || bird.y + bird.h >= groundInfo.y) {
                environment.play = false;
            }

            // If the bird passes the pipes
            if (pipe[i].x === 5){  
                environment.score++;
            }
        }

        // Draw the ground
        context.drawImage(ground, groundInfo.x, groundInfo.y);

        // Account for gravity on the bird and adjust the bird
        bird.y += bird.speed;
        bird.speed += 0.33;
>>>>>>> parent of 9d45ffb... changed how pipes are displayed

        // If the bird passes the pipes
        if (pipe[i].x === 5){  
            environment.score++;   
        }
    }

<<<<<<< HEAD
    // Account for gravity on the bird and adjust the bird
    bird.y += bird.speed;
    bird.speed += 0.1; // --------> 0.1 is about the right gravity for classic flappy bird. Range around 0.05-0.2

    requestAnimationFrame(loop);
}

=======
function reset() {
    bird.y = 200;
    bird.speed = 0;
    environment.score = 0;
    pipe[0].x = canvas.width;
    pipe[0].y = Math.floor(Math.random() * pipeInfo.h) - pipeInfo.h;
    requestAnimationFrame(loop);
}

>>>>>>> parent of 9d45ffb... changed how pipes are displayed
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