function makeSolver() {
    let solver = new Object();
    solver.pauseMSec = (game.solver ? game.solver.pauseMSec : null) || DEFAULT_PAUSE;
    solver.moveCount = 1;
    solver.deque = new Deque();
    solver.processed = createGrid(false);
    return solver;
}


async function solve() {
    if (game.status === DONE) {
        return;
    }
    console.log("Auto-Solver started");
    game.solver = makeSolver();
    if (game.state === NOT_STARTED) {
        executeClick(game.rows >> 1, game.cols >> 1);
        await sleep(game.solver.pauseMSec);
    }
    for (let i = 0; i < game.rows; i++) {
        for (let j = 0; j < game.cols; j++) {
            if (game.status[i][j] === SHOWN && hasSecretNeighbors(i,j) === true) {
                game.solver.deque.pushBack([i, j, 0]);
            }
            if (game.status[i][j] === SHOWN || game.status[i][j] === FLAG) {
                game.solver.processed[i][j] = true;
            }
        }
    }
    while (game.state === RUNNING && game.solver.deque.hasItems()) {
        const [row, col, moveAdded] = game.solver.deque.popFront(); // unpack array
        if (moveAdded === game.solver.moveCount) {
            // we're just cycling through everything without making progress
            break;
        }

        const finishedCell = await makeMove(row, col);
        if (!finishedCell && hasSecretNeighbors(row, col)) {
            game.solver.deque.pushBack([row, col, game.solver.moveCount]);
        }
    }
    return;
}


function hasSecretNeighbors(row, col) {
    for (let i = 0; i < 8; i++) {
        if (inBounds(row + chRow[i], col + chCol[i]) && game.status[row + chRow[i]][col + chCol[i]] === SECRET) {
            return true;
        }
    }
    return false;
}


async function makeMove(row, col) {
    console.debug("invoked makeMove with row=" + row + ", col=" + col);
    let success = false;
    if (statusNeighborCount(row, col, FLAG) === game.grid[row][col]) {
        success = true;
        let affectedCells = new Set();
        for (let i = 0; i < 8; i++) {
            if (inBounds(row + chRow[i], col + chCol[i]) && game.status[row + chRow[i]][col + chCol[i]] === SECRET) {
                const curAffected = executeClick(row + chRow[i], col + chCol[i], false);
                for (const affected of curAffected) {
                    affectedCells.add(affected);
                }
                await sleep(game.solver.pauseMSec);
                ++game.solver.moveCount;
            }
        }
        for (const affectedCell of affectedCells) {
            const nextRow = fromId(affectedCell)[0];
            const nextCol = fromId(affectedCell)[1];
            if (inBounds(nextRow, nextCol) && game.status[nextRow][nextCol] === SHOWN &&
                game.solver.processed[nextRow][nextCol] === false && hasSecretNeighbors(nextRow, nextCol)) {
                    game.solver.deque.pushFront([nextRow, nextCol, -1]);
                    game.solver.processed[nextRow][nextCol] = true;
            }
        }
    }
    else if (statusNeighborCount(row, col, FLAG) + statusNeighborCount(row, col, SECRET) === game.grid[row][col]) {
        success = true;
        for (let i = 0; i < 8; i++) {
            if (inBounds(row + chRow[i], col + chCol[i]) && game.status[row + chRow[i]][col + chCol[i]] === SECRET) {
                addFlag(row + chRow[i], col + chCol[i]);
                ++game.solver.moveCount;
                await sleep(game.solver.pauseMSec);
            }
        }
    }
    return new Promise(f => {f(success)});
}


// https://stackoverflow.com/questions/951021/what-is-the-javascript-version-of-sleep
async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}