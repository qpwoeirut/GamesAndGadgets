const OFF = 0;
const ON = 1;

let DEFAULT_CELL_SIZE = 10;
const CANVAS_HEIGHT = 500;
const CANVAS_WIDTH = 500;
const MAX_WIDTH = 1800;
const MAX_HEIGHT = 1000;

let BYPASS_CELL_SIZE_CHECK = false;
let BYPASS_GRID_WIDTH_CHECK = false;
const MAX_CELL_SIZE = 40;

const PACK_MULTIPLIER = 100000;

function newGame(game) {
    logMessage("invoked newGame with game");

    game.cellSize = game.cellSize || DEFAULT_CELL_SIZE;
    game.buffer = 64;
    game.rows = MAX_HEIGHT + game.buffer + game.buffer;
    game.cols = MAX_WIDTH + game.buffer + game.buffer;
    game.grid = createGrid(false);
    game.active = new Set();
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
        updateActive(row, col);
        for (let i=0; i<8; i++) {
            updateActive(row + chRow[i], col + chCol[i]);
        }
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

    updateGenerationSpeed();
    updateCellSize();

    const runButton = document.getElementById("runButton");
    runButton.textContent = "Stop";
    game.state = ON;
}

function stopGame() {
    logMessage("invoked stopGame");

    const runButton = document.getElementById("runButton");
    runButton.textContent = "Start"
    game.state = OFF;
    clearInterval(game.runner);
}

function updateGenerationSpeed() {
    const genSpeedInput = parseInt(document.getElementById("genSpeedInput").value);
    if (isNaN(genSpeedInput) || genSpeedInput < 1) {
        alert("Speed Input is invalid");
        return;
    }
    if (genSpeedInput > 200) {
        alert("Speed Input must be at most 200. (Values over 200 probably won't change anything anyway).");
        return;
    }

    game.speed = genSpeedInput;

    clearInterval(game.runner);
    game.runner = setInterval(function() {
        updateGrid();
        renderGrid();
    }, 1000/game.speed);

    document.getElementById("genSpeedDisplay").textContent = game.speed;
}

function updateCellSize() {
    const cellSizeInput = parseInt(document.getElementById("cellSizeInput").value);
    if (isNaN(cellSizeInput) || cellSizeInput < 1) {
        alert("Cell Size Input is invalid");
        return;
    }
    if (cellSizeInput > MAX_CELL_SIZE && BYPASS_CELL_SIZE_CHECK !== true) {
        alert("Cell Size Input must be at most " + MAX_CELL_SIZE + ".\n" + 
              "To disable cell size checks, type BYPASS_CELL_SIZE_CHECKS = true; into the console");
        return;
    }
    game.cellSize = cellSizeInput;
    const canvas = document.getElementById("lifeCanvas");
    canvas.style.backgroundSize = game.cellSize + "px";
    renderGrid();
    
    const follower = document.getElementById("follower");
    if (follower) {
        createFollower(parseInt(follower.getAttribute("data-type")));
    }

    document.getElementById("cellSizeDisplay").textContent = game.cellSize;
}

// https://stackoverflow.com/questions/3437786/get-the-size-of-the-screen-current-web-page-and-browser-window
function updateCanvasSize() {
    logMessage("invoked updateCanvasSize");
    const windowWidth  = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;

    let newWidth = parseInt(document.getElementById("canvasWidthInput").value);
    const newHeight = parseInt(document.getElementById("canvasHeightInput").value);
    console.log(windowWidth, newWidth);
    if (newWidth + 100 > windowWidth && BYPASS_GRID_WIDTH_CHECK !== true) {
        alert("If the width of the grid is larger than the width of the window, there might be visual glitches.\n" +
              "To disable grid width checks, type BYPASS_GRID_WIDTH_CHECK = true; into the console");
        newWidth = windowWidth - 100;
        document.getElementById("canvasWidthInput").value = newWidth;
    }
    document.getElementById("canvasWidthDisplay").textContent = newWidth;
    document.getElementById("canvasHeightDisplay").textContent = newHeight;
    const canvas = document.getElementById("lifeCanvas");
    canvas.width = newWidth;
    canvas.height = newHeight;
}

function clearGrid() {
    stopGame();
    game.grid = createGrid(false);
    game.active = new Set();
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
    let toUpdate = [];
    for (const cell of game.active) {
        const [curRow, curCol] = unpackCell(cell);
        const liveNeighbors = gridNeighborCount(curRow, curCol, true);
        if (liveNeighbors < 2) {
            if (game.grid[curRow][curCol] === true) {
                toUpdate.push(cell);
            }
        }
        else if (liveNeighbors === 2) {
            // cell stays the same
        }
        else if (liveNeighbors === 3) {
            if (game.grid[curRow][curCol] === false) {
                toUpdate.push(cell);
            }
        }
        else if (liveNeighbors > 3) {
            if (game.grid[curRow][curCol] === true) {
                toUpdate.push(cell);
            }
        }
    }

    for (const update of toUpdate) {
        const [curRow, curCol] = unpackCell(update);
        game.grid[curRow][curCol] = !game.grid[curRow][curCol];
        updateActive(curRow, curCol);
        for (let i=0; i<8; i++) {
            updateActive(curRow + chRow[i], curCol + chCol[i]);
        }
    }
}

function updateActive(row, col) {
    if (!inBounds(row, col)) {
        return;
    }
    if (game.grid[row][col] || gridNeighborCount(row, col, true) > 0) {
        game.active.add(packCell(row, col));
    }
    else {
        game.active.delete(packCell(row, col));
    }
}

function packCell(row, col) {
    return (row * PACK_MULTIPLIER) + col;
}

function unpackCell(cell) {
    return [Math.floor(cell / PACK_MULTIPLIER), cell % PACK_MULTIPLIER];
}