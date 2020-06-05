function initialize(rows, cols, mineFreq) {
    var container = document.getElementById("gameContainer");
    for (let i=0; i<rows; i++) {
        var row = document.createElement("div");
        row.classList = "game-row";
        for (let j=0; j<cols; j++) {
            var cell = document.createElement("div");
            cell.classList = "game-cell";
            cell.textContent = " ";  // make sure divs are visible, not 0x0
            row.appendChild(cell);
        }
        container.appendChild(row);
    }
}