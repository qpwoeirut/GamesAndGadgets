var canvas = document.getElementById('Snake');
var context = canvas.getContext('2d');

var grid = 16;
var count = 0;

var snake = {
    x: 160,
    y: 160,
    speedX: grid,
    speedY: 0,
    cells: [],
    maxCells: 3,
    score: 0,
    play: true
};
var apple = {
    x: 320,
    y: 320
};

// Used to place a new apple
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

// Play the game
function loop() {
    if (snake.play === true) {
        requestAnimationFrame(loop);
    
        // Lowers the frame rate
        if (++count < 10) {
            return;
        }

        count = 0;

        document.getElementById("snakeScore").innerHTML = snake.score;

        context.clearRect(0,0,canvas.width,canvas.height);

        // Move the snake
        snake.x += snake.speedX;
        snake.y += snake.speedY;


        snake.cells.unshift({x: snake.x, y: snake.y});

        if (snake.cells.length > snake.maxCells) {
            snake.cells.pop();
        }

        // Draw apple as red and snake as white
        context.fillStyle = 'red';
        context.fillRect(apple.x, apple.y, grid-1, grid-1);

        context.fillStyle = 'white';
        snake.cells.forEach(function(cell, index) {
            
            context.fillRect(cell.x, cell.y, grid-1, grid-1);  

            // Eat the apple
            if (cell.x === apple.x && cell.y === apple.y) {
                snake.score++;
                snake.maxCells++;
                apple.x = getRandomInt(0, 25) * grid;
                apple.y = getRandomInt(0, 25) * grid;
            }

            for (var i = index + 1; i < snake.cells.length; i++) {
            
            // Hit tail or walls
            if ((cell.x === snake.cells[i].x && cell.y === snake.cells[i].y) || (snake.x < 0 || snake.x >= canvas.width) || (snake.y < 0 || snake.y >= canvas.height)) {
                // Reset the snake
                snake.x = 160;
                snake.y = 160;
                snake.cells = [];
                snake.maxCells = 3;
                snake.speedX = grid;
                snake.speedY = 0;
                snake.score = 0;
                // Reset the apple
                apple.x = getRandomInt(0, 25) * grid;
                apple.y = getRandomInt(0, 25) * grid;
            }
            }
        });
    } 
    else {
        console.debug("DEBUG: else - game not play")
    }  
}


// Snake movement controls (arrow keys)
document.addEventListener('keydown', function(e) {

    if (e.which === 37 && snake.speedX === 0) {
        snake.speedX = -grid;
        snake.speedY = 0;
    }
    else if (e.which === 38 && snake.speedY === 0) {
        snake.speedY = -grid;
        snake.speedX = 0;
    }
    else if (e.which === 39 && snake.speedX === 0) {
        snake.speedX = grid;
        snake.speedY = 0;
    }
    else if (e.which === 40 && snake.speedY === 0) {
        snake.speedY = grid;
        snake.speedX = 0;
    }

    if (e.which === 80 && snake.play === true) {
        snake.play = false;
        console.debug("DEBUG: paused / snake.play:" + snake.play);
    }
    else if (e.which === 80 && snake.play === false) {
        snake.play = true;
        console.debug("DEBUG: unpaused / snake.play:" + snake.play);
    }
});

if (snake.play === true) {
    requestAnimationFrame(loop);
}
