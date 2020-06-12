const chRow = [
    1, 1, 1, 0, -1, -1, -1, 0, // 1 away
    2, 2, 2, 2, 2, 1, 0, -1, -2, -2, -2, -2, -2, -1, 0, 1 // 2 away
];
const chCol = [
    1, 0, -1, 1, 1, 0, -1, -1, // 1 away
    -2, -1, 0, 1, 2, 2, 2, 2, 2, 1, 0, -1, -2, -2, -2, -2 // 2 away
];


function gridValHere(row, col, value) {
    if (!inBounds(row, col)) return 0;
    return game.grid[row][col] === value ? 1 : 0;
}

function gridNeighborCount(row, col, value) {
    let count = 0;
    for (let i = 0; i < 8; i++) {
        count += gridValHere(row + chRow[i], col + chCol[i], value);
    }
    return count;
}

function handleClick(event) {
    if (game.state === ON) {
        return;
    }
    logMessage("invoked handleClick with event");
    const row = Math.floor(event.offsetY / game.cellSize);
    const col = Math.floor(event.offsetX / game.cellSize);
    logMessage("handled click at row=" + row + ", col=" + col);
    if (!inBounds(row, col)) {
        logMessage("click out of bounds");
        return;
    }

    game.grid[row][col] = !game.grid[row][col];
    renderGrid();
}

function createGrid(fillValue) {
    logMessage("invoking createGrid with fillValue=" + fillValue);
    let grid = [];
    for (let i = 0; i < game.rows; i++) {
        grid.push([]);
        for (let j = 0; j < game.cols; j++) {
            grid[i].push(fillValue);
        }
    }
    return grid;
}

function inBounds(row, col) {
    return 0 <= row && row < game.rows && 0 <= col && col < game.cols;
}