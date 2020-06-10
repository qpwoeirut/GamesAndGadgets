const NOT_STARTED = 0;
const RUNNING = 1;
const DONE = 2;

const SECRET = 0;
const SHOWN = 1;
const FLAG = 2;

const MINE = 10;
const UNINITIALIZED = 11;

const SCOREBOARD_SIZE = 3;

const DEFAULT_ROW = 16;
const DEFAULT_COLS = 30;
const DEFAULT_MINES = 99;

const DEFAULT_PAUSE = 50;

var BYPASS_SIZE_CHECK = false;
var BYPASS_MINE_CHECK = false;
var MIN_SIZE = 8;
var MAX_SIZE = 50;
var MAX_MINE_PERCENTAGE = 95;

const BYPASS_SIZE_CHECK_STRING = "To disable grid size checks, type BYPASS_SIZE_CHECK = true; into the console"
const BYPASS_MINE_CHECK_STRING = "To disable mine count checks, type BYPASS_MINE_CHECK = true; into the console"

var USE_DOUBLE_CLICK = true;
var USE_MIDDLE_CLICK = true;

const chRow = [1, 1, 1, 0, -1, -1, -1, 0];
const chCol = [1, 0, -1, 1, 1, 0, -1, -1];


function startGame(game) {
    console.debug("invoked startGame with game")
    game.rows = game.nextRows || DEFAULT_ROW;
    game.cols = game.nextCols || DEFAULT_COLS;
    game.mineCount = game.nextMineCount || DEFAULT_MINES;
    game.state = NOT_STARTED;
    game.grid = createGrid(UNINITIALIZED);
    game.status = createGrid(SECRET);
    game.remaining = (game.rows * game.cols) - game.mineCount;
    game.timeElapsed = 0;
    setBoard("timeBoard", game.timeElapsed, SCOREBOARD_SIZE);
    game.unflagged = game.mineCount;
    setBoard("minesBoard", game.unflagged, SCOREBOARD_SIZE);

    game.solver = makeSolver();

    if (game.timer) {
        clearInterval(game.timer);  // make sure the timers don't compound and speed up
    }
    game.timer = setInterval(function() {
        if (game.state === RUNNING) {
            setBoard("timeBoard", ++game.timeElapsed, SCOREBOARD_SIZE);
        }
    }, 1000);

    renderGrid();

    console.log("Created new game with " + game.rows + " by " + game.cols + " grid and " + game.mineCount + " mines");
}


function setBoard(boardId, value, len) {
    document.getElementById(boardId).textContent = value.toString().padStart(len, '0');
}


function fromId(idString) {
    return [parseInt(idString.split('-')[0]), parseInt(idString.split('-')[1])];
}

function toId(row, col) {
    return row + '-' + col;
}

function renderGrid() {
    console.debug("invoking renderGrid");
    let container = document.getElementById("minesweeperContainer");
    while (container.firstChild) { // clear any previous game
        container.removeChild(container.lastChild);
    }
    for (let i = 0; i < game.rows; i++) {
        let currentRow = document.createElement("div");
        currentRow.classList = "game-row";
        for (let j = 0; j < game.cols; j++) {
            let cell = document.createElement("div");
            cell.id = toId(i, j);
            cell.classList = "game-cell secret";
            cell.textContent = " "; // make sure divs are visible, not 0x0
            cell.onclick = handleCellClick;
            cell.ondblclick = handleCellAuxClick;
            cell.onauxclick = handleCellAuxClick;
            cell.oncontextmenu = handleRightClick;
            currentRow.appendChild(cell);
        }
        container.appendChild(currentRow);
    }
}


function handleRightClick(event) {
    console.debug("invoking handleRightClick with event");
    event.preventDefault();  // prevent menu from appearing
    const target = event.currentTarget;
    const row = fromId(target.id)[0];
    const col = fromId(target.id)[1];
    addFlag(row, col);
}


function addFlag(row, col) {
    console.debug("invoking addFlag with row=" + row + ", col=" + col);
    if (game.state === RUNNING) {
        const target = document.getElementById(toId(row, col));
        if (game.status[row][col] === SECRET) {
            if (game.unflagged === 0) {
                alert("You can't have more flags than mines");
                console.warn("You can't have more flags than mines");
                return;
            }
            game.status[row][col] = FLAG;
            target.classList.add("flag");
            --game.unflagged;
        }
        else if (game.status[row][col] === FLAG) {
            game.status[row][col] = SECRET;
            target.classList.remove("flag");
            ++game.unflagged;
        }
        setBoard("minesBoard", game.unflagged, SCOREBOARD_SIZE);
    }
    
    return;
}


function handleCellAuxClick(event) {
    console.log(event);
    if (game.state !== RUNNING) {
        return
    }
    if (event.which !== 1 && event.which !== 2) {
        return;
    }
    if (event.which === 1 && USE_DOUBLE_CLICK === false) {
        return;
    }
    if (event.which === 2 && USE_MIDDLE_CLICK === false) {
        return;
    }
    console.debug("invoking handleCellAuxClick with event");
    const target = event.currentTarget;
    const row = fromId(target.id)[0];
    const col = fromId(target.id)[1];

    if (game.status[row][col] !== SHOWN) {
        return;
    }

    if (statusNeighborCount(row, col, FLAG) === game.grid[row][col]) {
        for (let i=0; i<8; i++) {
            if (inBounds(row + chRow[i], col + chCol[i])) {
                executeClick(row + chRow[i], col + chCol[i]);
            }
        }
    }
}


function handleCellClick(event) {
    if (game.state === DONE) {
        return;
    }
    console.debug("invoking handleCellClick with event");
    const target = event.currentTarget;
    const row = fromId(target.id)[0];
    const col = fromId(target.id)[1];
    executeClick(row, col);
}


// return coords of all affected cells, in Id format (for Set usage)
function executeClick(row, col) {
    console.debug("invoking executeClick with row=" + row + ", col=" + col);
    if (game.state === NOT_STARTED) {
        initializeGrid(row, col);
        document.getElementById("minesweeperContainer").classList.add("active-game");
        game.state = RUNNING;
    }

    let affected = [];
    if (game.status[row][col] === FLAG) {
        return affected;
    }
    else if (game.grid[row][col] === MINE) {
        loseGame(row, col);
        affected.push(toId(row, col));
    }
    else if (game.status[row][col] === SECRET) {
        affected = revealCell(row, col);
    }

    if (game.remaining === 0 && game.state === RUNNING) {
        winGame();
    }
    return affected;
}


function initializeGrid(safeRow, safeCol) {
    console.debug("invoking initializeGrid with safeRow=" + safeRow + ', safeCol=' + safeCol + ", game.mineCount=" + game.mineCount);
    
    let minesSet = 0;
    while (minesSet < game.mineCount) {
        let randRow = randint(0, game.rows);
        let randCol = randint(0, game.cols);
        let works = true;
        if (game.grid[randRow][randCol] === MINE) {
            works = false;
        }
        if (randRow === safeRow && randCol === safeCol) {
            works = false;
        }
        for (let i=0; i<8; i++) {
            if (randRow + chRow[i] == safeRow && randCol + chCol[i] === safeCol) {
                works = false;
            }
        }
        if (works === true) {
            game.grid[randRow][randCol] = MINE;
            minesSet++;
        }
    }

    for (let i = 0; i < game.rows; i++) {
        for (let j = 0; j < game.cols; j++) {
            if (game.grid[i][j] !== MINE) {
                game.grid[i][j] = gridNeighborCount(i, j, MINE);
            }
        }
    }
}


function revealCell(row, col) {
    let ret = [];
    if (!inBounds(row, col) || game.status[row][col] !== SECRET) return ret;
    console.debug("invoked revealCell with row=" + row + ", col=" + col);
    game.status[row][col] = SHOWN;
    
    let curCell = document.getElementById(row + '-' + col)
    curCell.classList.remove("secret");
    curCell.classList.add("value" + game.grid[row][col]);
    

    if (game.grid[row][col] === 0) {
        for (let i=0; i<8; i++) {
            ret.push(...revealCell(row + chRow[i], col + chCol[i]));
        }
    }
    else {
        curCell.textContent = game.grid[row][col];
        ret.push(toId(row, col));
    }

    --game.remaining;
    return ret;
}


function winGame() {
    console.debug("invoked winGame");
    cleanupGame();
    console.log("You won!");
    setTimeout(function() {
        alert("You won!");
    }, 400);
}


function loseGame(mineRow, mineCol) {
    console.debug("invoked loseGame with mineRow=" + mineRow + ", mineCol=" + mineCol);
    cleanupGame();
    for (let i=0; i<game.rows; i++) {
        for (let j=0; j<game.cols; j++) {
            if (game.grid[i][j] === MINE && game.status[i][j] !== FLAG) {
                document.getElementById(toId(i, j)).classList.add("mine");
            }
        }
    }
    document.getElementById(toId(mineRow, mineCol)).classList.add("clicked");
    console.log("You lost!");
    setTimeout(function() {
        alert("You lost!");
    }, 400);
}


function cleanupGame() {
    console.debug("invoked cleanupGame");
    document.getElementById("minesweeperContainer").classList.remove("active-game");
    clearInterval(game.timer);
    game.state = DONE;
}


function openPopup() {
    document.getElementById("popupContainer").classList.add("active");
    const solverPauseElem = document.getElementById("solverPause")
    solverPauseElem.value = game.solver.pauseMSec;
    solverPauseElem.min = 0;
    solverPauseElem.max = 5000;

    const rowInputElem = document.getElementById("rowCount");
    rowInputElem.value = game.rows;
    rowInputElem.min = 0;
    if (BYPASS_SIZE_CHECK === false) {
        rowInputElem.max = MAX_SIZE;
    }

    const colInputElem = document.getElementById("colCount");
    colInputElem.value = game.cols;
    colInputElem.min = 0;
    if (BYPASS_SIZE_CHECK === false) {
        colInputElem.max = MAX_SIZE;
    }

    const mineInputElem = document.getElementById("mineCount")
    mineInputElem.value = game.mineCount;
    mineInputElem.min = 0;
    if (BYPASS_SIZE_CHECK === false && BYPASS_MINE_CHECK === false) {
        mineInputElem.max = MAX_SIZE * MAX_SIZE * MAX_MINE_PERCENTAGE / 100;
    }
}


function closePopup(saveData) {
    console.debug("invoking closePopup with saveData=" + saveData)
    if (saveData === false) {
        document.getElementById("solverPause").value = game.solver.pauseMSec;
        document.getElementById("rowCount").value = game.rows;
        document.getElementById("colCount").value = game.cols;
        document.getElementById("mineCount").value = game.mineCount;
        document.getElementById("popupContainer").classList.remove("active");
        return;
    }

    const solverPauseInput = document.getElementById("solverPause").value;
    if (isNaN(solverPauseInput) || solverPauseInput < 0) {
        console.warn("Input for solver pause time is invalid");
        alert("Input for solver pause time is invalid");
        return;
    }

    const rowInput = document.getElementById("rowCount").value;
    const colInput = document.getElementById("colCount").value;
    const mineInput = document.getElementById("mineCount").value;
    if (isNaN(rowInput)) {
        console.warn("Input for number of rows is invalid");
        alert("Input for number of rows is invalid");
        return;
    }
    if (isNaN(colInput)) {
        console.warn("Input for number of columns is invalid");
        alert("Input for number of columns is invalid");
        return;
    }
    if (isNaN(mineInput)) {
        console.warn("Input for number of mines is invalid");
        alert("Input for number of mines is invalid");
        return;
    }

    if (rowInput < MIN_SIZE && BYPASS_SIZE_CHECK !== true) {
        console.warn("Grid must have at least " + MIN_SIZE + " rows");
        console.warn(BYPASS_SIZE_CHECK_STRING);
        alert("Grid must have at least " + MIN_SIZE + " rows.\n" + BYPASS_SIZE_CHECK_STRING);
        return;
    }
    if (colInput < MIN_SIZE && BYPASS_SIZE_CHECK !== true) {
        console.warn("Grid must have at least " + MIN_SIZE + " columns");
        console.warn(BYPASS_SIZE_CHECK_STRING);
        alert("Grid must have at least " + MIN_SIZE + " columns.\n" + BYPASS_SIZE_CHECK_STRING);
        return;
    }
    if (rowInput > MAX_SIZE && BYPASS_SIZE_CHECK !== true) {
        console.warn("Grid cannot have over " + MAX_SIZE + " rows");
        console.warn(BYPASS_SIZE_CHECK_STRING);
        alert("Grid cannot have over " + MAX_SIZE + " rows.\n" + BYPASS_SIZE_CHECK_STRING);
        return;
    }
    if (colInput > MAX_SIZE && BYPASS_SIZE_CHECK !== true) {
        console.warn("Grid cannot have over " + MAX_SIZE + " columns");
        console.warn(BYPASS_SIZE_CHECK_STRING);
        alert("Grid cannot have over " + MAX_SIZE + " columns.\n" + BYPASS_SIZE_CHECK_STRING);
        return;
    }
    if ((rowInput * colInput * MAX_MINE_PERCENTAGE / 100) < mineInput && BYPASS_MINE_CHECK !== true) {
        console.warn("In a " + rowInput + " by " + colInput + " grid, " + mineInput + " mines is over " + MAX_MINE_PERCENTAGE + "% of the cells.");
        console.warn(BYPASS_MINE_CHECK_STRING);
        alert("In a " + rowInput + " by " + colInput + " grid, " + mineInput + " mines is over " + MAX_MINE_PERCENTAGE + "% of the cells\n" + BYPASS_MINE_CHECK_STRING);
        return;
    }
    if (game.mineCount < 0) {
        console.warn("Number of mines can't be negative");
        alert("Number of mines can't be negative");
        return;
    }

    USE_MIDDLE_CLICK = document.getElementById("useMiddleClick").checked;
    USE_DOUBLE_CLICK = document.getElementById("useDoubleClick").checked;

    game.solver.pauseMSec = solverPauseInput;
    
    game.nextRows = rowInput;
    game.nextCols = colInput;
    game.nextMineCount = mineInput;
    document.getElementById("popupContainer").classList.remove("active");
    console.debug("finished closePopup with game.nextRows=" + game.nextRows + ", game.nextCols=" + game.nextCols + ", game.nextMineCount=" + game.nextMineCount);
}
