let SOLVER_ON = false;
let HINT = false;

function makeSolver() {
    let solver = new Object();
    solver.pauseMSec = (game.solver ? game.solver.pauseMSec : null) || DEFAULT_PAUSE;
    solver.moveCount = 1;
    solver.deque = new Deque();
    solver.processed = createGrid(false);
    return solver;
}

async function solve(hint=false) {
    if (game.status === DONE || SOLVER_ON === true) {
        return;
    }
    HINT = hint;
    console.log("Auto-Solver started");
    SOLVER_ON = true;
    game.solver = makeSolver();
    if (game.state === NOT_STARTED) {
        executeClick(game.rows >> 1, game.cols >> 1);
        await sleep(game.solver.pauseMSec);
    }
    for (let i = 0; i < game.rows; i++) {
        for (let j = 0; j < game.cols; j++) {
            if (game.status[i][j] === SHOWN && hasSecretNeighbors(i, j) === true) {
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
            const progress = await patternSolver();
            if (progress === false) { // nothing is working...
                break;
            }
        }

        const finishedCell = await makeMove(row, col);
        if (!finishedCell && hasSecretNeighbors(row, col)) {
            game.solver.deque.pushBack([row, col, game.solver.moveCount]);
        }
        else if (finishedCell && HINT) {
            break;
        }
    }
    SOLVER_ON = false;
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
                affectedCells = union(affectedCells, executeClick(row + chRow[i], col + chCol[i], false));
                if (HINT === true) {
                    return new Promise(f => {
                        f(success)
                    });
                }
                await sleep(game.solver.pauseMSec);
                ++game.solver.moveCount;
            }
        }
        addToDeque(affectedCells);
    } else if (statusNeighborCount(row, col, FLAG) + statusNeighborCount(row, col, SECRET) === game.grid[row][col]) {
        success = true;
        for (let i = 0; i < 8; i++) {
            if (inBounds(row + chRow[i], col + chCol[i]) && game.status[row + chRow[i]][col + chCol[i]] === SECRET) {
                addFlag(row + chRow[i], col + chCol[i]);
                if (HINT === true) {
                    return new Promise(f => {
                        f(success)
                    });
                }
                await sleep(game.solver.pauseMSec);
                ++game.solver.moveCount;
            }
        }
    }
    return new Promise(f => {
        f(success)
    });
}


function addToDeque(affectedCells) {
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


// https://stackoverflow.com/questions/951021/what-is-the-javascript-version-of-sleep
async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// based on http://www.minesweeper.info/wiki/Strategy
async function patternSolver(depth=1) {
    console.debug("invoking patternSolver with depth=" + depth);
    let success = false;
    for (let row = 0; row < game.rows; row++) {
        for (let col = 0; col < game.cols; col++) {
            if (game.status[row][col] !== SHOWN) {
                continue;
            }
            let neighbors = allStatusNeighbors(row, col, SECRET);
            const minesLeft = game.grid[row][col] - statusNeighborCount(row, col, FLAG);
            if (neighbors.size === 0) continue;
            // if depth=1, 0...7
            // if depth=2, 8...24
            for (let i = 8 * (depth - 1); i < 8 * (depth - 1) + (8 * depth); i++) {
                const otherRow = row + chRow[i];
                const otherCol = col + chCol[i];
                if (!inBounds(otherRow, otherCol) || game.status[otherRow][otherCol] !== SHOWN) {
                    continue;
                }

                let otherNeighbors = allStatusNeighbors(otherRow, otherCol, SECRET);
                const otherMinesLeft = game.grid[otherRow][otherCol] - statusNeighborCount(otherRow, otherCol, FLAG);
                // 1-1 pattern
                if (minesLeft === otherMinesLeft && isSuperset(otherNeighbors, neighbors)) {
                    let affectedCells = new Set();
                    for (const cell of difference(otherNeighbors, neighbors)) {
                        affectedCells = union(affectedCells, executeClick(fromId(cell)[0], fromId(cell)[1]));
                        ++game.solver.moveCount;
                        success = true;
                    }
                    addToDeque(affectedCells);
                }
                // 1-2 pattern
                if (otherMinesLeft - minesLeft === difference(otherNeighbors, neighbors).size) {
                    for (const cell of difference(otherNeighbors, neighbors)) {
                        addFlag(fromId(cell)[0], fromId(cell)[1]);
                        success = true;
                    }
                }
            }
        }
    }

    if (depth === 1) {
        const secondLevel = await patternSolver(2);
        success = success || secondLevel;
    }

    return new Promise(f => {
        f(success)
    });
}