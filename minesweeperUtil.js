function randint(a, b) {
    const range = Math.abs(a - b);
    return Math.floor(Math.random() * range) + Math.min(a, b);
}


function fromId(idString) {
    return [parseInt(idString.split('-')[0]), parseInt(idString.split('-')[1])];
}

function toId(row, col) {
    return row + '-' + col;
}


function statusValHere(row, col, value) {
    if (!inBounds(row, col)) return 0;
    return game.status[row][col] === value ? 1 : 0;
}


function inBounds(row, col) {
    return 0 <= row && row < game.rows && 0 <= col && col < game.cols;
}


function statusNeighborCount(row, col, value) {
    let count = 0;
    for (let i = 0; i < 8; i++) {
        count += statusValHere(row + chRow[i], col + chCol[i], value);
    }
    return count;
}


function allStatusNeighbors(row, col, val) {
    let neighbors = new Set();
    for (let i = 0; i < 8; i++) {
        if (inBounds(row + chRow[i], col + chCol[i]) && game.status[row + chRow[i]][col + chCol[i]] === val) {
            neighbors.add(toId(row + chRow[i], col + chCol[i]));
        }
    }
    return neighbors;
}
