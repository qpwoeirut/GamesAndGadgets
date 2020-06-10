function randint(a, b) {
    const range = Math.abs(a - b);
    return Math.floor(Math.random() * range) + Math.min(a, b);
}


function gridValHere(row, col, value) {
    if (!inBounds(row, col)) return 0;
    return game.grid[row][col] === value ? 1 : 0;
}


function statusValHere(row, col, value) {
    if (!inBounds(row, col)) return 0;
    return game.status[row][col] === value ? 1 : 0;
}


function inBounds(row, col) {
    return 0 <= row && row < game.rows && 0 <= col && col < game.cols;
}


function gridNeighborCount(row, col, value) {
    let count = 0;
    for (let i = 0; i < 8; i++) {
        count += gridValHere(row + chRow[i], col + chCol[i], value);
    }
    return count;
}


function statusNeighborCount(row, col, value) {
    let count = 0;
    for (let i = 0; i < 8; i++) {
        count += statusValHere(row + chRow[i], col + chCol[i], value);
    }
    return count;
}