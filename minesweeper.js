const NOT_STARTED = 0;
const RUNNING = 1;
const DONE = 2;

const SECRET = 0;
const SHOWN = 1;
const FLAG = 2;

const MINE = 10;
const UNINITIALIZED = 11;


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
    let container = document.getElementById("gameContainer");
    for (let i = 0; i < game.rows; i++) {
        let currentRow = document.createElement("div");
        currentRow.classList = "game-row";
        for (let j = 0; j < game.cols; j++) {
            let cell = document.createElement("div");
            cell.id = toId(i, j);
            cell.classList = "game-cell secret";
            cell.textContent = " "; // make sure divs are visible, not 0x0
            cell.onclick = handleCellClick;
            currentRow.appendChild(cell);
        }
        container.appendChild(currentRow);
    }
}


function handleCellClick(event) {
    if (game.state === DONE) {
        return;
    }
    console.debug("invoking handleCellClick with event");
    const target = event.currentTarget;
    const row = parseInt(target.id.split('-')[0]);
    const col = parseInt(target.id.split('-')[1]);

    if (game.state === NOT_STARTED) {
        initializeGrid(row, col);
        game.state = RUNNING;
    }

    if (game.grid[row][col] === MINE) {
        endGame(row, col);
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
    if (game.rows * game.cols <= game.mineCount) {
        console.warn("In a " + game.rows + " by " + game.cols + " grid, having " + game.mineCount + " mines is impossible");
        
        const prevCount = game.mineCount;
        game.mineCount = Math.floor(game.rows * game.cols / 2);
        console.warn("Defaulting to " + game.mineCount + " mines");
        alert("In a " + game.rows + " by " + game.cols + " grid, having " + prevCount + " mines is impossible.\nDefaulting to " + game.mineCount + " mines");
    }
    
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
    if (!inBounds(row, col) || game.status[row][col] === SHOWN) return;
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
            if (game.grid[i][j] === MINE) {
                document.getElementById(toId(i, j)).classList.add("mine");
            }
        }
    }
    document.getElementById(toId(mineRow, mineCol)).classList.add("clicked");
    console.log("You lost!");
}