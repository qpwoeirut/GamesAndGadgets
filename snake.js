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
    maxCells: 3
};
var apple = {
    x: 320,
    y: 320
};

// Used to place a new apple
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function loop() {
    requestAnimationFrame(loop);

    // Lowers the frame rate (60/6 = 10 fps)
    if (++count < 6) {
        return;
    }

    count = 0;
    context.clearRect(0,0,canvas.width,canvas.height);


    snake.x += snake.speedX;
    snake.y += snake.speedY;


    snake.cells.unshift({x: snake.x, y: snake.y});

    if (snake.cells.length > snake.maxCells) {
        snake.cells.pop();
    }

    context.fillStyle = 'red';
    context.fillRect(apple.x, apple.y, grid-1, grid-1);

    context.fillStyle = 'white';
    snake.cells.forEach(function(cell, index) {
        
        context.fillRect(cell.x, cell.y, grid-1, grid-1);  

        if (cell.x === apple.x && cell.y === apple.y) {
            snake.maxCells++;
            apple.x = getRandomInt(0, 25) * grid;
            apple.y = getRandomInt(0, 25) * grid;
        }

        for (var i = index + 1; i < snake.cells.length; i++) {
        
        if ((cell.x === snake.cells[i].x && cell.y === snake.cells[i].y) || (snake.x < 0 || snake.x >= canvas.width) || (snake.y < 0 || snake.y >= canvas.height)) {
            snake.x = 160;
            snake.y = 160;
            snake.cells = [];
            snake.maxCells = 3;
            snake.speedX = grid;
            snake.speedY = 0;

            apple.x = getRandomInt(0, 25) * grid;
            apple.y = getRandomInt(0, 25) * grid;
        }
        }
    });
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
});

requestAnimationFrame(loop);