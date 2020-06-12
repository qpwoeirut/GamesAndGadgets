let CELL_SIZE = 20;

function startGame() {
    logMessage("invoked startGame");

    renderGrid();
}

function renderGrid() {
    logMessage("invoking renderGrid");

    const canvas = document.getElementById("lifeCanvas");
    canvas.onclick = handleClick;
    canvas.style.backgroundSize = CELL_SIZE + "px";
}


function handleClick(event) {
    const gridX = Math.floor(event.offsetX / CELL_SIZE);
    const gridY = Math.floor(event.offsetY / CELL_SIZE);

    const canvas = event.currentTarget;


}