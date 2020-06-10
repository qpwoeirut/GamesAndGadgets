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
        clearInterval(game.timer); // make sure the timers don't compound and speed up
    }
    game.timer = setInterval(function () {
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
    event.preventDefault(); // prevent menu from appearing
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
        } else if (game.status[row][col] === FLAG) {
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
        for (let i = 0; i < 8; i++) {
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
function executeClick(row, col, shouldInitialize=true) {
    let affected = new Set();
    console.debug("invoking executeClick with row=" + row + ", col=" + col);
    if (game.state === DONE) {
        return affected;
    }
    if (game.state === NOT_STARTED) {
        if (shouldInitialize !== true) {
            return affected;
        }
        initializeGrid(row, col);
        document.getElementById("minesweeperContainer").classList.add("active-game");
        game.state = RUNNING;
    }

    if (game.status[row][col] === FLAG) {
        return affected;
    } else if (game.grid[row][col] === MINE) {
        loseGame(row, col);
        affected.add(toId(row, col));
    } else if (game.status[row][col] === SECRET) {
        revealCell(row, col, affected);
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
        for (let i = 0; i < 8; i++) {
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


function revealCell(row, col, affectedCellSet) {
    if (game.state !== RUNNING || !inBounds(row, col) || game.status[row][col] !== SECRET) return;
    console.debug("invoked revealCell with row=" + row + ", col=" + col + ", affectedCellSet");
    game.status[row][col] = SHOWN;

    let curCell = document.getElementById(row + '-' + col)
    curCell.classList.remove("secret");
    curCell.classList.add("value" + game.grid[row][col]);

    if (game.grid[row][col] === 0) {
        for (let i = 0; i < 8; i++) {
            revealCell(row + chRow[i], col + chCol[i], affectedCellSet);
        }
    } else {
        curCell.textContent = game.grid[row][col];
        if (affectedCellSet) {
            affectedCellSet.add(toId(row, col));
        }
    }

    --game.remaining;
    return;
}


function winGame() {
    console.debug("invoked winGame");
    for (let i = 0; i < game.rows; i++) {
        for (let j = 0; j < game.cols; j++) {
            if (game.status[i][j] === SECRET) {
                addFlag(i, j);
            }
        }
    }
    cleanupGame();
    console.log("You won!");
    setTimeout(function () {
        alert("You won!");
    }, 400);
}


function loseGame(mineRow, mineCol) {
    console.debug("invoked loseGame with mineRow=" + mineRow + ", mineCol=" + mineCol);
    for (let i = 0; i < game.rows; i++) {
        for (let j = 0; j < game.cols; j++) {
            if (game.grid[i][j] === MINE && game.status[i][j] !== FLAG) {
                const mineElem = document.getElementById(toId(i, j));
                mineElem.classList.add("mine");
                mineElem.classList.remove("secret");
                mineElem.textContent = '*';  // mine font will show mine
            }
            if (game.status[i][j] === FLAG && game.grid[i][j] !== MINE) {
                const flagElem = document.getElementById(toId(i, j));
                flagElem.classList.add("bad-flag");
            }
        }
    }
    cleanupGame();
    document.getElementById(toId(mineRow, mineCol)).classList.add("clicked");
    console.log("You lost!");
    setTimeout(function () {
        alert("You lost!");
    }, 400);
}


function cleanupGame() {
    console.debug("invoked cleanupGame");
    document.getElementById("minesweeperContainer").classList.remove("active-game");
    clearInterval(game.timer);
    game.state = DONE;
}