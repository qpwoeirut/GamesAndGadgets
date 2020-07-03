const OFF = 0;
const ON = 1;

let words = [];
function loadWords() {
    let request = new XMLHttpRequest();
    request.onreadystatechange = function() {
        if (request.readyState === 4) {
            words = request.responseText.split("\n").filter(word => word.length >= 4 && remove.has(word) === false);
        }
    }
    // wordlist based on https://www.ef.edu/english-resources/english-vocabulary/top-3000-words/
    request.open("GET", "https://www.qpwoeirut.com/hangmanWords.txt", true);
    request.send(null);
}
function startGame(game, ctr=50) {
    if (words.length === 0) {
        logMessage("waiting for " + ctr + "ms, wordlist hasn't loaded", 1);
        setTimeout(function() {
            startGame(game, ctr+10);
        }, ctr);
        return;
    }
    game.state = ON;
    game.word = choose(words);
    game.guesses = new Set();
    game.incorrect = new Set();
    game.remaining = new Set(game.word);

    const canvas = document.getElementById("hangmanCanvas");
    game.lineSize = canvas.width / 50;
    game.topLeftX = canvas.width / 4;
    game.topRightX = canvas.width * 3 / 4;
    game.baseSize = canvas.width / 5;
    game.bottomLeftX = game.topLeftX - game.baseSize + (game.lineSize / 2);
    game.bottomRightX = game.topLeftX + game.baseSize - (game.lineSize / 2);
    game.topY = canvas.height / 10;
    game.bottomY = canvas.height * 9 / 10;
    
    game.diagSize = canvas.width / 5;

    game.headY = game.topY + (game.lineSize * 5);
    game.headRadius = canvas.width / 12;

    game.topBodyY = game.headY + game.headRadius + game.headRadius;
    game.bottomBodyY = game.topBodyY + canvas.height * 3 / 10;
    game.middleBodyY = (game.topBodyY + game.bottomBodyY) / 2;

    game.armWidth = canvas.width / 6;
    game.legWidth = canvas.width / 8;
    game.legY = game.bottomBodyY + canvas.height / 8;

    genLetterButtons();
    
    renderHangmanCanvas(game.incorrect.size);
    showGameStatus();
}

function makeGuess(guess) {
    if (game.state === OFF) return;
    document.getElementById("letter-" + guess).classList.add("disabled");
    game.guesses.add(guess);
    if (game.remaining.delete(guess) === false) {
        game.incorrect.add(guess);
        renderHangmanCanvas(game.incorrect.size);
    }
    showGameStatus();

    if (game.remaining.size === 0) {
        winGame();
    }
}

const drawPartFunctions = [
    function(ctx) {
        ctx.arc(game.topRightX, game.headY + game.headRadius, game.headRadius, 0, 2 * Math.PI);
    },
    function(ctx) {
        ctx.moveTo(game.topRightX, game.topBodyY);
        ctx.lineTo(game.topRightX, game.bottomBodyY);
    },
    function(ctx) {
        ctx.moveTo(game.topRightX, game.middleBodyY);
        ctx.lineTo(game.topRightX - game.armWidth, game.topBodyY);
    },
    function(ctx) {
        ctx.moveTo(game.topRightX, game.middleBodyY);
        ctx.lineTo(game.topRightX + game.armWidth, game.topBodyY);
    },
    function(ctx) {
        ctx.moveTo(game.topRightX, game.bottomBodyY);
        ctx.lineTo(game.topRightX - game.legWidth, game.legY);
    },
    function(ctx) {
        ctx.moveTo(game.topRightX, game.bottomBodyY);
        ctx.lineTo(game.topRightX + game.legWidth, game.legY);
    },
];

function renderHangmanCanvas(misses) {
    const canvas = document.getElementById("hangmanCanvas");
    const context = canvas.getContext("2d");

    context.clearRect(0, 0, canvas.height, canvas.width);

    context.fillStyle = "black";
    context.lineWidth = game.lineSize;

    drawPlatform(context);

    for (let i=0; i<misses; i++) {
        context.beginPath();
        drawPartFunctions[i](context);
        context.stroke();

        if (i === 5) {
            loseGame();
            break;
        }
    }
}

function drawPlatform(context) {
    logMessage("invoked drawPlatform");

    // bottom
    context.beginPath();
    context.moveTo(game.bottomLeftX, game.bottomY);
    context.lineTo(game.bottomRightX, game.bottomY);
    context.stroke();

    // vertical left part
    context.beginPath();
    context.moveTo(game.topLeftX, game.topY);
    context.lineTo(game.topLeftX, game.bottomY);
    context.stroke();

    // top part
    context.beginPath();
    context.moveTo(game.topLeftX - (game.lineSize / 2), game.topY);
    context.lineTo(game.topRightX + (game.lineSize / 2), game.topY);
    context.stroke();

    // diagonal part
    context.beginPath();
    context.moveTo(game.topLeftX, game.topY + game.diagSize);
    context.lineTo(game.topLeftX + game.diagSize, game.topY);
    context.stroke();

    // vertical thing at the top
    context.beginPath();
    context.moveTo(game.topRightX, game.topY);
    context.lineTo(game.topRightX, game.headY);
    context.stroke();
}

function showGameStatus() {
    const wordElem = document.getElementById("wordContainer");
    while (wordElem.firstChild) {
        wordElem.removeChild(wordElem.lastChild);
    }
    for (const char of game.word) {
        const charSpan = document.createElement("span");
        if (game.guesses.has(char)) {
            charSpan.textContent = char;
        }
        else {
            charSpan.textContent = "_";
        }

        wordElem.appendChild(charSpan);
    }
}

function choose(choices) {
    const index = Math.floor(Math.random() * choices.length);
    return choices[index];
}

function genLetterButtons() {
    const firstHalf = "abcdefghijklm";
    const secondHalf = "nopqrstuvwxyz";
    const letterContainer = document.getElementById("letterContainer");

    while (letterContainer.lastChild) {
        letterContainer.removeChild(letterContainer.lastChild);
    }

    const firstHalfContainer = document.createElement("div");
    const secondHalfContainer = document.createElement("div");

    for (const letter of firstHalf) {
        const letterButton = document.createElement("button");
        letterButton.id = "letter-" + letter;
        letterButton.textContent = letter;
        letterButton.classList = "letter";
        letterButton.onclick = function(e) {makeGuess(e.target.textContent)};
        firstHalfContainer.appendChild(letterButton);
    }
    for (const letter of secondHalf) {
        const letterButton = document.createElement("button");
        letterButton.id = "letter-" + letter;
        letterButton.textContent = letter;
        letterButton.classList = "letter";
        letterButton.onclick = function(e) {makeGuess(e.target.textContent)};
        secondHalfContainer.appendChild(letterButton);
    }

    letterContainer.appendChild(firstHalfContainer);
    letterContainer.appendChild(secondHalfContainer);
}

function endGame() {
    game.state = OFF;

    for (const elem of document.getElementsByClassName("letter")) {
        elem.classList.add("disabled");
    }
}

function winGame() {
    endGame();
    setTimeout(function() {
        alert("You won!");
    }, 100);
}

function loseGame() {
    endGame();
    setTimeout(function() {
        alert("You lost! The word was " + game.word);
    }, 100);
}