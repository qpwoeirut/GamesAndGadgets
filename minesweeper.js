const NOT_STARTED = 0;
const RUNNING = 1;
const DONE = 2;

const SECRET = 0;
const SHOWN = 1;
const FLAG = 2;

const MINE = 10;
const UNINITIALIZED = 11;

var BYPASS_SIZE_CHECK = false;
var MIN_SIZE = 5;
var MAX_SIZE = 30;


function startGame(game) {
    game.rows = parseInt(document.getElementById("rowCount").value);
    game.cols = parseInt(document.getElementById("colCount").value);
    game.mineCount = parseInt(document.getElementById("mineCount").value);

    if (game.rows < MIN_SIZE && BYPASS_SIZE_CHECK !== true) {
        console.warn("Grid must have at least " + MIN_SIZE + " rows");
        alert("Grid must have at least " + MIN_SIZE + " rows. To disable grid size checks, type BYPASS_SIZE_CHECK = true; into the console.");
        game.rows = MIN_SIZE;
    }
    if (game.cols < MIN_SIZE && BYPASS_SIZE_CHECK !== true) {
        console.warn("Grid must have at least " + MIN_SIZE + " columns");
        alert("Grid must have at least " + MIN_SIZE + " columns. To disable grid size checks, type BYPASS_SIZE_CHECK = true; into the console.");
        game.cols = MIN_SIZE;
    }
    if (game.rows > MAX_SIZE && BYPASS_SIZE_CHECK !== true) {
        console.warn("Grid cannot have over " + MAX_SIZE + " rows");
        alert("Grid cannot have over " + MAX_SIZE + " rows. To disable grid size checks, type BYPASS_SIZE_CHECK = true; into the console.");
        game.rows = MAX_SIZE;
    }
    if (game.cols > MAX_SIZE && BYPASS_SIZE_CHECK !== true) {
        console.warn("Grid cannot have over " + MAX_SIZE + " columns");
        alert("Grid cannot have over " + MAX_SIZE + " columns. To disable grid size checks, type BYPASS_SIZE_CHECK = true; into the console.");
        game.cols = MAX_SIZE;
    }
    if (game.rows * game.cols <= game.mineCount) {
        console.warn("In a " + game.rows + " by " + game.cols + " grid, having " + game.mineCount + " mines is impossible");
        
        const prevCount = game.mineCount;
        game.mineCount = Math.floor(game.rows * game.cols / 2);
        console.warn("Defaulting to " + game.mineCount + " mines");
        alert("In a " + game.rows + " by " + game.cols + " grid, having " + prevCount + " mines is impossible.\nDefaulting to " + game.mineCount + " mines");
    }
    if (game.mineCount < 0) {
        console.warn("Number of mines can't be negative");
        const prevCount = game.mineCount;
        game.mineCount = Math.max(1, Math.floor(game.rows * game.cols) / 20);
        console.warn("Defaulting to " + game.mineCount + " mines");
    }

    game.state = NOT_STARTED;
    game.grid = createGrid(UNINITIALIZED);
    game.status = createGrid(SECRET);

    renderGrid();

    console.debug("finished startGame with rows=" + game.rows + ", cols=" + game.cols + ", mineCount=" + game.mineCount);
}


function createGrid(fillValue) {
    console.debug("invoking createGrid with fillValue=" + fillValue);
    let grid = [];
    for (let i = 0; i < game.rows; i++) {
        grid.push([]);
        for (let j = 0; j < game.cols; j++) {
            grid[i].push(fillValue);
        }
    }
    return grid;
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
            cell.ondblclick = handleCellDoubleClick;
            cell.oncontextmenu = addFlag;
            currentRow.appendChild(cell);
        }
        container.appendChild(currentRow);
    }
}


function addFlag(event) {
    console.debug("invoking addFlag with event");
    event.preventDefault();  // prevent menu from appearing
    if (game.state === RUNNING) {
        const target = event.currentTarget;
        const row = fromId(target.id)[0];
        const col = fromId(target.id)[1];
        if (game.status[row][col] === SECRET) {
            game.status[row][col] = FLAG;
            target.classList.add("flag");
        }
        else if (game.status[row][col] === FLAG) {
            game.status[row][col] = SECRET;
            target.classList.remove("flag");
        }
        
    }
    
    return false;
}


function handleCellDoubleClick(event) {
    console.debug("invoking handleCellDoubleClick with event");
    const target = event.currentTarget;
    const row = fromId(target.id)[0];
    const col = fromId(target.id)[1];
}


function handleCellClick(event) {
    if (game.state === DONE) {
        return;
    }
    console.debug("invoking handleCellClick with event");
    const target = event.currentTarget;
    if (target.classList.contains("flag")) {
        return;
    }
    const row = fromId(target.id)[0];
    const col = fromId(target.id)[1];

    if (game.state === NOT_STARTED) {
        initializeGrid(row, col);
        document.getElementById("minesweeperContainer").classList.add("active-game");
        game.state = RUNNING;
    }

    if (game.grid[row][col] === MINE) {
        endGame(row, col);
        document.getElementById("minesweeperContainer").classList.remove("active-game");
        game.state = DONE;
    }
    else if (game.status[row][col] === SECRET) {
        revealCell(row, col);
    }
}


function randint(a, b) {
    const range = Math.abs(a - b);
    return Math.floor(Math.random() * range) + Math.min(a, b);
}


function mineHere(row, col) {
    if (!inBounds(row, col)) return 0;
    return game.grid[row][col] === MINE ? 1 : 0;
}


function inBounds(row, col) {
    return 0 <= row && row < game.rows && 0 <= col && col < game.cols;
}


const chRow = [1, 1, 1, 0, -1, -1, -1, 0];
const chCol = [1, 0, -1, 1, 1, 0, -1, -1];

function neighborCount(row, col) {
    let count = 0;

    for (let i = 0; i < 8; i++) {
        count += mineHere(row + chRow[i], col + chCol[i]);
    }
    return count;
}


function initializeGrid(safeRow, safeCol) {
    console.debug("invoking initializeGrid with safeRow=" + safeRow + ', safeCol=' + safeCol + ", game.mineCount=" + game.mineCount);
    
    let minesSet = 0;
    while (minesSet < game.mineCount) {
        let randRow = randint(0, game.rows);
        let randCol = randint(0, game.cols);
        if (game.grid[randRow][randCol] !== MINE && (randRow !== safeRow || randCol !== safeCol)) {
            game.grid[randRow][randCol] = MINE;
            console.debug("set mine at randRow=" + randRow + ", randCol=" + randCol);
            minesSet++;
        }
    }
    console.debug(game.grid);

    for (let i = 0; i < game.rows; i++) {
        for (let j = 0; j < game.cols; j++) {
            if (game.grid[i][j] !== MINE) {
                game.grid[i][j] = neighborCount(i, j);
            }
        }
    }
}


function revealCell(row, col) {
    if (!inBounds(row, col) || game.status[row][col] !== SECRET) return;
    console.debug("called revealCell with row=" + row + ", col=" + col);
    game.status[row][col] = SHOWN;
    
    let curCell = document.getElementById(row + '-' + col)
    curCell.classList.remove("secret");
    curCell.classList.add("value" + game.grid[row][col]);
    

    if (game.grid[row][col] === 0) {
        for (let i=0; i<8; i++) {
            revealCell(row + chRow[i], col + chCol[i]);
        }
    }
    else {
        curCell.textContent = game.grid[row][col];
    }
}


function endGame(mineRow, mineCol) {
    for (let i=0; i<game.rows; i++) {
        for (let j=0; j<game.cols; j++) {
            if (game.grid[i][j] === MINE && game.status[i][j] !== FLAG) {
                document.getElementById(toId(i, j)).classList.add("mine");
            }
        }
    }
    document.getElementById(toId(mineRow, mineCol)).classList.add("clicked");
    console.log("You lost!");
}