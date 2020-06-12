const OFF = 0;
const ON = 1;

let DEFAULT_CELL_SIZE = 10;
const CANVAS_HEIGHT = 500;
const CANVAS_WIDTH = 1200;
let lifeGrid = [];

function newGame(game) {
    logMessage("invoked newGame with game");

    game.cellSize = game.cellSize || DEFAULT_CELL_SIZE;
    game.rows = CANVAS_HEIGHT;
    game.cols = CANVAS_WIDTH;
    game.visibleRows = Math.ceil(CANVAS_HEIGHT / game.cellSize);
    game.visibleCols = Math.ceil(CANVAS_WIDTH / game.cellSize);
    game.grid = createGrid(false);
    game.state = OFF;

    const canvas = document.getElementById("lifeCanvas");
    canvas.height = CANVAS_HEIGHT;
    canvas.width = CANVAS_WIDTH;
    canvas.onclick = handleClick;
    canvas.style.backgroundSize = game.cellSize + "px";
}

function startGame() {
    logMessage("invoked startGame");

    game.state = ON;
    game.speed = 5;
    game.runner = setInterval(function() {
        updateGrid();
        renderGrid();
    }, 1000/game.speed);
}

function stopGame() {
    logMessage("invoked stopGame");

    game.state = OFF;
    clearInterval(game.runner);
}

function setSize(size) {
    game.cellSize = size;
    game.visibleRows = Math.ceil(CANVAS_HEIGHT / game.cellSize);
    game.visibleCols = Math.ceil(CANVAS_WIDTH / game.cellSize);
    renderGrid();
}

function renderGrid() {
    logMessage("invoking renderGrid");

    const canvas = document.getElementById("lifeCanvas");
    const context = canvas.getContext("2d");
    context.fillStyle = "black";
    context.clearRect(0, 0, canvas.width, canvas.height);
    for (let i=0; i<game.rows; i++) {
        for (let j=0; j<game.cols; j++) {
            if (game.grid[i][j]) {
                // swap from row-col to x-y
                context.fillRect(game.cellSize * j, game.cellSize * i, game.cellSize, game.cellSize);
            }
        }
    }
    context.stroke();
}

function updateGrid() {
    if (game.state === OFF) {
        return;
    }
    console.debug("invoked updateGrid");
    let nextGrid = createGrid(false);
    for (let i=0; i<game.grid.length; i++) {
        for (let j=0; j<game.grid[i].length; j++) {
            const liveNeighbors = gridNeighborCount(i, j, true);
            if (liveNeighbors === 2) {
                nextGrid[i][j] = game.grid[i][j];
            }
            else if (liveNeighbors === 3) {
                nextGrid[i][j] = true;
            }
        }
    }
    game.grid = nextGrid;
}
