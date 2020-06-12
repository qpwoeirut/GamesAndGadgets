const OFF = 0;
const ON = 1;

let DEFAULT_CELL_SIZE = 10;
const CANVAS_HEIGHT = 500;
const CANVAS_WIDTH = 1200;
let lifeGrid = [];

function startGame(game) {
    logMessage("invoked startGame with game");

    game.cellSize = game.cellSize || DEFAULT_CELL_SIZE;
    game.rows = CANVAS_HEIGHT;
    game.cols = CANVAS_WIDTH;
    game.visibleRows = Math.ceil(CANVAS_HEIGHT / game.cellSize);
    game.visibleCols = Math.ceil(CANVAS_WIDTH / game.cellSize);
    game.grid = createGrid(false);
    game.state = OFF;
    game.runner = setInterval(function() {
        if (game.state === OFF) return;
        updateGrid();
        renderGrid();
    }, 100);

    renderGrid();
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
    canvas.height = CANVAS_HEIGHT;
    canvas.width = CANVAS_WIDTH;
    canvas.onclick = handleClick;
    canvas.style.backgroundSize = game.cellSize + "px";

    const context = canvas.getContext("2d");
    context.fillStyle = "black";
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
