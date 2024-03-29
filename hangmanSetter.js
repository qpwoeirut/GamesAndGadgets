// frequencies from https://en.wikipedia.org/wiki/Letter_frequency#Relative_frequencies_of_letters_in_other_languages
const letterFrequencies = [0.074, 0.095, 0.15, 0.153, 0.772, 0.978, 1.492, 1.929, 1.974, 2.015, 2.228, 2.36, 2.406, 2.758, 2.782, 4.025, 4.253, 5.987, 6.094, 6.327, 6.749, 6.966, 7.507, 8.167, 9.056, 12.702];
const letterOrder = "zqxjkvbpygfwmucldrhsnioate";
const letters = "abcdefghijklmnopqrstuvwxyz";
let threshold = [];

for (let i=0; i<26; i++) {
    threshold.push(letterFrequencies[i] * letterFrequencies[i]);
    if (i > 0) threshold[i] += threshold[i-1];
}

function startGameAsSetter(game) {
    const wordLength = parseInt(document.getElementById("wordLength").value);
    if (isNaN(wordLength) || wordLength < 4 || wordLength > 20) {
        alert("word length input must be a number between 4 and 20");
        return;
    }

    closeId('wordLengthPopup');

    game.word = '_'.repeat(wordLength);
    showGameStatus();

    setTimeout(sendGuess, 500);
}

function numToChar(num) {
    for (let i=0; i<26; i++) {
        if (threshold[i] >= num) {
            return letterOrder[i];
        }
    }
    return "!";
}

function sendGuess() {
    let regexStr = "";
    let regexChar = "[";
    for (const letter of letters) {
        if (game.incorrect.has(letter) === false) {
            regexChar += letter;
        }
    }
    regexChar += "]";
    for (const char of game.word) {
        if (char === '_') {
            regexStr += regexChar;
        }
        else {
            regexStr += char
        }
    }
    const regex = new RegExp(regexStr);
    console.debug(regex);
    const matches = words.filter(word => word.length === game.word.length && regex.test(word));
    console.debug(matches);

    let letterCounts = new Array(26).fill(matches.length === 0 ? 1 : 0); // do 1 just in case the word isn't in dict
    for (const match of matches) {
        const matchSet = new Set(match);
        for (let i=0; i<26; i++) {
            if (matchSet.has(letters[i])) {
                letterCounts[i]++;
            }
        }
    }

    let sumChance = [];
    for (let i=0; i<26; i++) {
        sumChance.push(letterCounts[i] * letterCounts[i]);
        if (i > 0) {
            sumChance[i] += sumChance[i-1];
        }
    }
    console.log(game.guesses);
    let remove = 0;
    console.log(sumChance);
    for (let i=0; i<26; i++) {
        if (game.guesses.has(letters[i])) {
            remove = sumChance[i] - ((i>0) ? sumChance[i-1] : 0);
        }
        sumChance[i] -= remove;
    }
    console.log(sumChance);

    let guess = 0;
    const random = Math.floor(Math.random() * sumChance[sumChance.length - 1]);
    for (guess=0; guess<26; guess++) {
        if (random < sumChance[guess]) {
            break;
        }
    }
    console.debug(letters[guess]);

    game.currentGuess = letters[guess];

    game.guesses.add(game.currentGuess);
    document.getElementById("letter-" + game.currentGuess).classList.add("pressed");

    const message = document.getElementById("message");
    message.textContent = "I guess '" + game.currentGuess + "'. Am I right?";

    const responseButtons = document.getElementById("responseButtons");
    responseButtons.classList.remove("hidden");
}

function handleGuessResponse(response) {
    if (game.state === OFF) return;

    const message = document.getElementById("message");
    message.textContent = "";

    const responseButtons = document.getElementById("responseButtons");
    responseButtons.classList.add("hidden");

    if (response === true) {
        message.textContent = "Click on the positions that " + game.currentGuess + " is in";
        const doneButton = document.getElementById("doneButton");
        doneButton.classList.remove("hidden");

        const charSpans = document.querySelectorAll("div#wordContainer > span")
        for (const charSpan of charSpans) {
            if (charSpan.textContent === "_") {
                charSpan.classList.add("transformable");
                charSpan.onclick = function(e) {
                    const spanElem = e.currentTarget;
                    if (spanElem.textContent === "_") {
                        spanElem.textContent = game.currentGuess;
                    }
                    else {
                        spanElem.textContent = "_";
                    }
                }
            }
        }
    }
    else {
        game.incorrect.add(game.currentGuess);
        if (renderHangmanCanvas(game.incorrect.size) === true) {
            game.state = OFF;
            document.getElementById("responseButtons").classList.add("hidden");
            openId("winPopup");
        }
        finishGuessResponse(false);
    }
}

function finishGuessResponse(reset) {
    if (game.state === OFF) return;
    game.word = document.getElementById("wordContainer").textContent;

    showGameStatus();

    if (reset) {
        const message = document.getElementById("message");
        message.textContent = "";

        const doneButton = document.getElementById("doneButton");
        doneButton.classList.add("hidden");

        if (game.word.search("_") === -1) {
            game.state = OFF;
            document.getElementById("responseButtons").classList.add("hidden");
            setTimeout(function() {
                alert("Looks like I guessed the word! Thanks for playing with me.");
            }, 100);
            
            return;
        }
    }

    sendGuess();
}

function findFirstSharedChar(word) {
    for (const char of word) {
        if (game.incorrect.has(char)) {
            return char;
        }
    }

    return "";
}

function wordPatternMatches(word) {
    for (let i=0; i<word.length; ++i) {
        if (game.word[i] === "_") {
            if (game.guesses.has(word[i])) {
                return false;
            }
            continue;
        }
        if (game.word[i] !== word[i]) {
            return false;
        }
    }
    return true;
}

function reactToWord() {
    const word = document.getElementById("winningWord").value;
    const resp = document.getElementById("winningWordResponse");
    const firstSharedChar = findFirstSharedChar(word);
    if (word === "") {
        resp.textContent = "Wait! What was your word?";
    }
    else if (!islower(word)) {
        resp.textContent = "Would you mind telling me with only lowercase letters?"
    }
    else if (word.length !== game.word.length) {
        resp.textContent = "Hey... That word's not the length you said it was!";
    }
    else if (firstSharedChar !== "") {
        resp.textContent = "You said " + firstSharedChar + " wasn't in the word!";
    }
    else if (wordPatternMatches(word) === false) {
        resp.textContent = "That doesn't match what you told me!";
    }
    else if (wordSet.has(word) === false) {
        resp.textContent = "What? I don't even know that word!";
    }
    else {
        resp.textContent = "Okay, fine. You won. Good job.";
    }
}

function exitWinPopup() {
    console.log(document.getElementById("winningWord").value);
    if (document.getElementById("winningWord").value === "") {
        const resp = document.getElementById("winningWordResponse");
        resp.textContent = "Wait! What was your word?";
    }
    else {
        closeId("winPopup");
    }
}