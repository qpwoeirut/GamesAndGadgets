function handleClickAway(event) {
    if (event.target.closest(".popup") === null && event.target.classList.contains("clickable") === false) {
        for (const popup of document.getElementsByClassName("popup")) {
            popup.classList.remove("active");
        }
    }
}


function openHowToPlay() {
    document.getElementById("howToPlayContainer").classList.add("active");

}

function closeHowToPlay() {
    document.getElementById("howToPlayContainer").classList.remove("active");
}


function prefillDifficulty(level) {
    logMessage("invoked prefillDifficulty with level=" + level);

    const rowInputElem = document.getElementById("rowCount");
    const colInputElem = document.getElementById("colCount");
    const mineInputElem = document.getElementById("mineCount")
    if (level === "EASY") {
        rowInputElem.value = "9";
        colInputElem.value = "9";
        mineInputElem.value = "10";
    }
    else if (level === "INTERMEDIATE") {
        rowInputElem.value = "16";
        colInputElem.value = "16";
        mineInputElem.value = "40";
    }
    else if (level === "EXPERT") {
        rowInputElem.value = "16";
        colInputElem.value = "30";
        mineInputElem.value = "99";
    }
    else {
        console.error("prefillDifficulty called with invalid level " + level)
    }
}


function openSettings() {
    document.getElementById("settingsContainer").classList.add("active");
    const solverPauseElem = document.getElementById("solverPause")
    solverPauseElem.value = game.solver.pauseMSec;
    solverPauseElem.min = 0;
    solverPauseElem.max = 5000;

    const rowInputElem = document.getElementById("rowCount");
    rowInputElem.value = game.nextRows;
    rowInputElem.min = 0;
    if (BYPASS_SIZE_CHECK === false) {
        rowInputElem.max = MAX_SIZE;
    }

    const colInputElem = document.getElementById("colCount");
    colInputElem.value = game.nextCols;
    colInputElem.min = 0;
    if (BYPASS_SIZE_CHECK === false) {
        colInputElem.max = MAX_SIZE;
    }

    const mineInputElem = document.getElementById("mineCount")
    mineInputElem.value = game.nextMineCount;
    mineInputElem.min = 0;
    if (BYPASS_SIZE_CHECK === false && BYPASS_MINE_CHECK === false) {
        mineInputElem.max = MAX_SIZE * MAX_SIZE * MAX_MINE_PERCENTAGE / 100;
    }
}


function closeSettings(saveData) {
    logMessage("invoking closeSettings with saveData=" + saveData)
    if (saveData === false) {
        document.getElementById("solverPause").value = game.solver.pauseMSec;
        document.getElementById("rowCount").value = game.rows;
        document.getElementById("colCount").value = game.cols;
        document.getElementById("mineCount").value = game.mineCount;
        document.getElementById("settingsContainer").classList.remove("active");
        return;
    }

    const solverPauseInput = document.getElementById("solverPause").value;
    if (isNaN(solverPauseInput) || solverPauseInput < 0) {
        console.warn("Input for solver pause time is invalid");
        alert("Input for solver pause time is invalid");
        return;
    }

    const rowInput = document.getElementById("rowCount").value;
    const colInput = document.getElementById("colCount").value;
    const mineInput = document.getElementById("mineCount").value;
    if (isNaN(rowInput)) {
        console.warn("Input for number of rows is invalid");
        alert("Input for number of rows is invalid");
        return;
    }
    if (isNaN(colInput)) {
        console.warn("Input for number of columns is invalid");
        alert("Input for number of columns is invalid");
        return;
    }
    if (isNaN(mineInput)) {
        console.warn("Input for number of mines is invalid");
        alert("Input for number of mines is invalid");
        return;
    }

    if (rowInput < MIN_SIZE && BYPASS_SIZE_CHECK !== true) {
        console.warn("Grid must have at least " + MIN_SIZE + " rows");
        console.warn(BYPASS_SIZE_CHECK_STRING);
        alert("Grid must have at least " + MIN_SIZE + " rows.\n" + BYPASS_SIZE_CHECK_STRING);
        return;
    }
    if (colInput < MIN_SIZE && BYPASS_SIZE_CHECK !== true) {
        console.warn("Grid must have at least " + MIN_SIZE + " columns");
        console.warn(BYPASS_SIZE_CHECK_STRING);
        alert("Grid must have at least " + MIN_SIZE + " columns.\n" + BYPASS_SIZE_CHECK_STRING);
        return;
    }
    if (rowInput > MAX_SIZE && BYPASS_SIZE_CHECK !== true) {
        console.warn("Grid cannot have over " + MAX_SIZE + " rows");
        console.warn(BYPASS_SIZE_CHECK_STRING);
        alert("Grid cannot have over " + MAX_SIZE + " rows.\n" + BYPASS_SIZE_CHECK_STRING);
        return;
    }
    if (colInput > MAX_SIZE && BYPASS_SIZE_CHECK !== true) {
        console.warn("Grid cannot have over " + MAX_SIZE + " columns");
        console.warn(BYPASS_SIZE_CHECK_STRING);
        alert("Grid cannot have over " + MAX_SIZE + " columns.\n" + BYPASS_SIZE_CHECK_STRING);
        return;
    }
    if ((rowInput * colInput * MAX_MINE_PERCENTAGE / 100) < mineInput && BYPASS_MINE_CHECK !== true) {
        console.warn("In a " + rowInput + " by " + colInput + " grid, " + mineInput + " mines is over " + MAX_MINE_PERCENTAGE + "% of the cells.");
        console.warn(BYPASS_MINE_CHECK_STRING);
        alert("In a " + rowInput + " by " + colInput + " grid, " + mineInput + " mines is over " + MAX_MINE_PERCENTAGE + "% of the cells\n" + BYPASS_MINE_CHECK_STRING);
        return;
    }
    if (game.mineCount < 0) {
        console.warn("Number of mines can't be negative");
        alert("Number of mines can't be negative");
        return;
    }

    USE_MIDDLE_CLICK = document.getElementById("useMiddleClick").checked;
    USE_DOUBLE_CLICK = document.getElementById("useDoubleClick").checked;

    game.solver.pauseMSec = solverPauseInput;

    game.nextRows = rowInput;
    game.nextCols = colInput;
    game.nextMineCount = mineInput;
    document.getElementById("settingsContainer").classList.remove("active");
    logMessage("finished closeSettings with game.nextRows=" + game.nextRows + ", game.nextCols=" + game.nextCols + ", game.nextMineCount=" + game.nextMineCount);
}