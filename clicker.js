const PACK_POS_MULT = 100000;


function startGame(game) {
    game.rate = 1;
    game.difficulty = 0;
    game.targetSize = 40;
    game.targets = new Set();
    game.lastGenTime = 0;
    game.generator = setInterval(function() {
        const curTime = Date.now();
        if (game.lastGenTime + Math.round(1000 / game.rate) <= curTime) {
            game.lastGenTime = curTime;
            generateTarget();
        }
        renderTargets();
    }, 10);
}


function packCoords(x, y) {
    return (x * PACK_POS_MULT + y);
}
function unpackCoords(target) {
    return [Math.floor(target / PACK_POS_MULT), target % PACK_POS_MULT];
}


function generateTarget() {
    logMessage("invoked generateTarget");
    const canvas = document.getElementById("clickerCanvas");
    for (let i=0; i<100; i++) { // try 100 times
        const newTargetX = randint(1, canvas.width - game.targetSize);
        const newTargetY = randint(1, canvas.height - game.targetSize);

        const target = packCoords(newTargetX, newTargetY);
        if (game.targets.has(target)) {
            continue;
        }
        game.targets.add(target);
        logMessage("added target with x=" + newTargetX + ", y=" + newTargetY);
        return true;
    }

    console.error("Unable to add target!");
    return false;
}


function renderTargets() {
    const canvas = document.getElementById("clickerCanvas");
    const context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.beginPath();
    for (const target of game.targets) {
        const [targetX, targetY] = unpackCoords(target);
        context.rect(targetX, targetY, game.targetSize, game.targetSize);
    }
    context.stroke();
}


function handleClickerClick(event) {
    const clickX = event.offsetX;
    const clickY = event.offsetY;
    for (const target of game.targets) {
        const [targetX, targetY] = unpackCoords(target);
        if (targetX <= clickX && clickX <= targetX + game.targetSize && targetY <= clickY && clickY <= targetY + game.targetSize) {
            game.targets.delete(target);
            if (game.targets.size === 0) {
                game.lastGenTime = Date.now();
                generateTarget();
            }
            return true;
        }
    }

    return false;
}


// probably should be merged w/ minesweeper's randint later
function randint(a, b) {
    const range = Math.abs(a - b);
    return Math.floor(Math.random() * range) + Math.min(a, b);
}
