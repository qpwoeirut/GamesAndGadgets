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
