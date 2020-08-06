var canvas = document.getElementById('Bird');
var context = canvas.getContext('2d');

var bird = {
    reference = new Image(),
    x = 75,
    y = 200
};
var pipeInfo = {
    north = new Image(),
    south = new Image(),
    gap = 85,
    constant
};
var environment = {
    score = 0,
    gravity = 1.5
};

// Image references for more detailed parts of the game
bird.reference.src = "birdsrc.png";
pipeInfo.north.src = "pipeNorth.png";
pipeInfo.south.src = "pipeSouth.png";

document.addEventListener("keydown", moveUp);

// Move the bird up when the up key is pressed
function moveUp() {
    bird.y -= 25;
    fly.play();
}

var pipe = [];

pipe[0] = {
    x =  canvas.clientWidth,
    y = 0
};

function loop() {
    // Place pipe pairs
    for(var i = 0; i < pipe.length; i++) {
        // Set the position of the gap in the pipes
        pipeInfo.constant = pipeInfo.north.height + pipeInfo.gap;
        // Set the pipes
        context.drawImage(pipeInfo.north, pipe[i].x, pipe[i].y);
        context.drawImage(pipeInfo.south, pipe[i].x, pipe[i].y + pipeInfo.constant);

        pipe[i].x--;

        if (pipe[i].x === 125) {
            pipe.push({  
                x = canvas.width,  
                y = Math.floor(Math.random() * pipeInfo.north.height) - pipeInfo.north.height
            });
        }

        if (bird.x + bird.width >= pipe[i].x && bird.x <= pipe[i].x + pipeInfo.north.width && (bird.y <= pipe[i].y + pipeInfo.north.height || bird.y + bird.height >= pipe[i].y + pipe.constant) || bird.y + bird.height >= canvas.height) {
            location.reload();
        }

        if (pipe[i].x === 5){  
            environment.score++;   
        }
    }

    context.drawImage(birdsrc, bird.x, bird.y);

    bird.y += environment.gravity;

    context.fillStyle = "white";
    context.font = "20px Arial"
    context.fillText("Score: " + environment.score, 10, canvas.height - 20);

    requestAnimationFrame(loop);
}

requestAnimationFrame(loop);