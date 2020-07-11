// frequencies from https://en.wikipedia.org/wiki/Letter_frequency#Relative_frequencies_of_letters_in_other_languages
const letterFrequencies = [0.074, 0.095, 0.15, 0.153, 0.772, 0.978, 1.492, 1.929, 1.974, 2.015, 2.228, 2.36, 2.406, 2.758, 2.782, 4.025, 4.253, 5.987, 6.094, 6.327, 6.749, 6.966, 7.507, 8.167, 9.056, 12.702];
const letterOrder = "zqxjkvbpygfwmucldrhsnioate";
let threshold = [];

for (let i=0; i<26; i++) {
    threshold.push(letterFrequencies[i]);
    if (i > 0) threshold[i] += threshold[i-1];
}

function startGameAsSetter(game) {
    const wordLength = parseInt(document.getElementById("wordLength").value);
    if (isNaN(wordLength) || wordLength < 4 || wordLength > 20) {
        alert("word length input must be a number between 4 and 20");
        return;
    }

    closeId('wordLengthPopup');

    genLetterButtons();
    for (const letterButton of document.querySelectorAll("button.letter")) {
        letterButton.disabled = true;
    }

    game.word = '_'.repeat(wordLength);
    showGameStatus();

    setTimeout(sendGuess, 1000);
}

function numToChar(num) {
    for (let i=0; i<26; i++) {
        if (threshold[i] >= num) {
            return letterOrder[i];
        }
    }
}

function sendGuess() {
    const guessNum = Math.random() * 100;
    game.currentGuess = numToChar(guessNum);

    const message = document.getElementById("message");
    message.textContent = "I guess '" + game.currentGuess + "'\nAm I right?";

    const responseButtons = document.getElementById("responseButtons");
    responseButtons.classList.remove("hidden");
}

function handleGuessResponse(response) {
    const message = document.getElementById("message");
    message.textContent = "";

    const responseButtons = document.getElementById("responseButtons");
    responseButtons.classList.add("hidden");

    
}