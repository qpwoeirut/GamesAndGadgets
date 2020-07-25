const OFF = 0;
const ON = 1;

const GUESSER = 0;
const SETTER = 1;

function startGame(game) {
    logMessage("invoked startGame with game, game.mode=" + game.mode);

    game.state = ON;
    game.guesses = new Set();
    game.incorrect = new Set();

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
    
    renderHangmanCanvas(game.incorrect.size);

    game.mode = game.mode || GUESSER;
    genLetterButtons();
    if (game.mode === GUESSER) {
        startGameAsGuesser(game);
    }
    else if (game.mode === SETTER) {
        document.getElementById("wordLength").value = "";
        openId("wordLengthPopup");
    }
    else {
        console.error("Unrecognized mode " + game.mode);
        return;
    }
}

let words = [];
let wordSet = new Set();

let shortWordlist = [];
let longWordlist = [];
function loadWords() {
    const shortReq = new XMLHttpRequest();
    shortReq.onreadystatechange = function() {
        if (shortReq.readyState === 4) {
            shortWordlist = shortReq.responseText.split("\n").filter(word => word.length >= 4);
            words = shortWordlist;
            wordSet = new Set(words);
        }
    }
    // wordlist based on https://www.ef.edu/english-resources/english-vocabulary/top-3000-words/
    shortReq.open("GET", "hangmanWords.txt", true);
    shortReq.send(null);

    const longReq = new XMLHttpRequest();
    longReq.onreadystatechange = function() {
        if (longReq.readyState === 4) {
            longWordlist = longReq.responseText.split("\n").filter(word => word.length >= 4);
        }
    }
    // wordlist based on https://raw.githubusercontent.com/first20hours/google-10000-english/master/google-10000-english-no-swears.txt
    longReq.open("GET", "hangmanMoreWords.txt", true);
    longReq.send(null);
}

function changeMode(mode) {
    logMessage("invoked changeMode with mode=" + mode);

    document.getElementById("message").textContent = "";
    document.getElementById("responseButtons").classList.add("hidden");
    document.getElementById("doneButton").classList.add("hidden");
    
    const guesserButton = document.getElementById("playAsGuesserButton");
    const setterButton = document.getElementById("playAsSetterButton");
    const setterContainer = document.getElementById("setterContainer");
    if (mode === GUESSER) {
        game.mode = GUESSER;
        guesserButton.classList.add("pressed");
        setterButton.classList.remove("pressed");
        setterContainer.classList.add("hidden");
    }
    else if (mode === SETTER) {
        game.mode = SETTER;
        guesserButton.classList.remove("pressed");
        setterButton.classList.add("pressed");
        setterContainer.classList.remove("hidden");
    }
    else {
        console.error("Unrecognized mode " + mode);
        return;
    }
    startGame(game);
}

function showGameStatus() {
    logMessage("invoked showGameStatus");
    const wordElem = document.getElementById("wordContainer");
    while (wordElem.firstChild) {
        wordElem.removeChild(wordElem.lastChild);
    }
    for (let i=0; i<game.word.length; i++) {
        const charSpan = document.createElement("span");
        if (game.guesses.has(game.word[i])) {
            charSpan.textContent = game.word[i];
        }
        else {
            charSpan.textContent = "_";
        }
        charSpan.setAttribute("data-idx", i);
        wordElem.appendChild(charSpan);
    }
}

function islower(string) {
    return string.search(/[^a-z]/) === -1;
}

function checkWord() {
    const wordElem = document.getElementById("wordlistCheck");
    wordElem.value = wordElem.value.trim();
    const word = wordElem.value;
    const resultElem = document.getElementById("checkResult");
    resultElem.textContent = "Hmmm..."

    let response = "Hey... I recognize that word!";
    if (word.length < 4) {
        response = "Sorry, I only know words with at least 4 characters!";
    }
    else if (islower(word) === false) {
        response = "Sorry, I only recognize lowercase letters, with no spaces or dashes!";
    }
    else if (wordSet.has(word) === false) {
        response = "Sorry, I don't know that word!";
    }

    setTimeout(function() {
        resultElem.textContent = response;
    }, 500);
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
            return true;
        }
    }
    return false;
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
        if (game.mode === GUESSER) {
            letterButton.onclick = function(e) {makeGuess(e.target.textContent)};
        }
        else {
            letterButton.disabled = true;
        }
        firstHalfContainer.appendChild(letterButton);
    }
    for (const letter of secondHalf) {
        const letterButton = document.createElement("button");
        letterButton.id = "letter-" + letter;
        letterButton.textContent = letter;
        letterButton.classList = "letter";
        if (game.mode === GUESSER) {
            letterButton.onclick = function(e) {makeGuess(e.target.textContent)};
        }
        else {
            letterButton.disabled = true;
        }
        secondHalfContainer.appendChild(letterButton);
    }

    letterContainer.appendChild(firstHalfContainer);
    letterContainer.appendChild(secondHalfContainer);
}

function endGame() {
    game.state = OFF;

    for (const elem of document.getElementsByClassName("letter")) {
        elem.classList.add("pressed");
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