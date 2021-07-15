function startGame(game) {
    game.rows = 4;
    game.cols = 4;
    game.grid = createGrid(0);
    game.tiles = [];

    addTile(2);
    addTile(2);

    fillBoard(4, 4);
}

function update(rDir, cDir) {
    let newGrid = createGrid(0);
    const rDec = rDir === 0 ? 1 : rDir;
    const cDec = cDir === 0 ? 1 : cDir;

    const rStart = max(0, game.rows * rDec - 1);
    const rEnd = max(-1, game.rows * rDec * -1);
    const cStart = max(0, game.rows * cDec - 1);
    const cEnd = max(-1, game.rows * cDec * -1);
    console.log(rStart, rEnd, cStart, cEnd);
    for (let r=rStart; r!==rEnd; r-=rDec) {
        for (let c=cStart; c!==cEnd; c-=cDec) {
            if (game.grid[r][c] === 0) {
                continue;
            }
            let cr = r;
            let cc = c;

            while (inbounds(cr, cc) && newGrid[cr][cc] === 0) {
                if (!inbounds(cr + rDec, cc + cDec)) {
                    break;
                }
                cr += rDec;
                cc += cDec;
            }

            if (newGrid[cr][cc] === game.grid[r][c]) {
                newGrid[cr][cc] *= 2;
            }
            moveTile(cr, cc, r, c);
        }
    }

    console.log(game.grid);
    game.grid = newGrid;
    console.log(game.grid);
}

function addTile(num) {

}

function moveTile(destRow, destCol, startRow, startCol) {

}


function fillBoard(rows, cols) {
    const board = document.getElementById("board");
    while (board.hasChildNodes()) {
        board.removeChild(board.lastChild);
    }
    for (let r=0; r<rows; r++) {
        const row = document.createElement("div");
        row.classList.add("board-row");
        for (let c=0; c<cols; c++) {
            const cell = document.createElement("div");
            cell.id = "cell-" + r + "-" + c;
            cell.classList.add("board-cell");
            row.appendChild(cell);
        }
        board.appendChild(row);
    }
}
