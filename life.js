const OFF = 0;
const ON = 1;

let DEFAULT_CELL_SIZE = 10;
const CANVAS_HEIGHT = 500;
const CANVAS_WIDTH = 1200;

function newGame(game) {
    logMessage("invoked newGame with game");

    game.cellSize = game.cellSize || DEFAULT_CELL_SIZE;
    game.buffer = 64;
    game.rows = CANVAS_HEIGHT + game.buffer + game.buffer;
    game.cols = CANVAS_WIDTH + game.buffer + game.buffer;
    game.grid = createGrid(false);
    game.state = OFF;

    const canvas = document.getElementById("lifeCanvas");
    canvas.height = CANVAS_HEIGHT;
    canvas.width = CANVAS_WIDTH;
    canvas.style.backgroundSize = game.cellSize + "px";
}

function handleClick(event) {
    if (event.target.id !== "lifeCanvas") {
        return;
    }
    logMessage("invoked handleClick with event");
    const row = Math.floor(event.offsetY / game.cellSize) + game.buffer;
    const col = Math.floor(event.offsetX / game.cellSize) + game.buffer;
    logMessage("handled click at row=" + row + ", col=" + col);
    if (!inBounds(row, col)) {
        return;
    }

    if (writeFollowerPattern(row, col) === false) {
        game.grid[row][col] = !game.grid[row][col];
    }
    
    renderGrid();
}

function handleRunClick() {
    if (game.state === OFF) {
        startGame();
    }
    else {
        stopGame();
    }
}

function startGame() {
    logMessage("invoked startGame");

    if (updateSettings() === true) {
        const runButton = document.getElementById("runButton");
        runButton.textContent = "Stop";
        game.state = ON;
    }
}

function stopGame() {
    logMessage("invoked stopGame");

    const runButton = document.getElementById("runButton");
    runButton.textContent = "Start"
    game.state = OFF;
    clearInterval(game.runner);
}

function updateSettings() {
    const speedInput = parseInt(document.getElementById("speedInput").value);
    if (isNaN(speedInput) || speedInput < 1) {
        alert("Speed Input is invalid");
        return false;
    }
    if (speedInput > 200) {
        alert("Speed Input must be at most 200. (Values over 200 probably won't change anything anyway).");
        return false;
    }

    const cellSizeInput = parseInt(document.getElementById("cellSizeInput").value);
    if (isNaN(cellSizeInput) || cellSizeInput < 1) {
        alert("Cell Size Input is invalid");
        return false;
    }
    if (cellSizeInput > 100) {
        alert("Cell Size Input must be at most 100.");
        return false;
    }
    game.speed = speedInput;
    setCellSize(cellSizeInput);
    
    clearInterval(game.runner);
    game.runner = setInterval(function() {
        updateGrid();
        renderGrid();
    }, 1000/game.speed);
    createFollower(parseInt(document.getElementById("follower").getAttribute("data-type")));
    return true;
}

function clearGrid() {
    stopGame();
    game.grid = createGrid(false);
    renderGrid();
}

function setCellSize(size) {
    game.cellSize = size;
    const canvas = document.getElementById("lifeCanvas");
    canvas.style.backgroundSize = game.cellSize + "px";
    renderGrid();
}

function renderGrid() {
    logMessage("invoking renderGrid");

    const canvas = document.getElementById("lifeCanvas");
    const context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "black";
    for (let i=game.buffer; i+game.buffer<game.rows; i++) {
        for (let j=game.buffer; j+game.buffer<game.cols; j++) {
            if (game.grid[i][j]) {
                // swap from row-col to x-y
                context.fillRect(game.cellSize * (j - game.buffer), game.cellSize * (i - game.buffer), game.cellSize, game.cellSize);
            }
        }
    }
    context.stroke();
}

function updateGrid() {
    if (game.state === OFF) {
        return;
    }
    logMessage("invoked updateGrid");
    let nextGrid = createGrid(false);
    for (let i=0; i<game.rows; i++) {
        for (let j=0; j<game.cols; j++) {
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
