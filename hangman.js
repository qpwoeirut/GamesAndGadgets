const OFF = 0;
const ON = 1;

const GUESSER = 0;
const SETTER = 1;

let words = [];
let wordSet = new Set();
function loadWords() {
    let request = new XMLHttpRequest();
    request.onreadystatechange = function() {
        if (request.readyState === 4) {
            words = request.responseText.split("\n").filter(word => word.length >= 4);
            wordSet = new Set(words);
        }
    }
    // wordlist based on https://www.ef.edu/english-resources/english-vocabulary/top-3000-words/
    request.open("GET", "hangmanWords.txt", true);
    request.send(null);
}

function changeMode(mode) {
    logMessage("invoked changeMode with mode=" + mode);
    const guesserButton = document.getElementById("playAsGuesserButton");
    const setterButton = document.getElementById("playAsSetterButton");
    const guesserContainer = document.getElementById("guesserContainer");
    const setterContainer = document.getElementById("setterContainer");
    
    if (mode === GUESSER) {
        guesserButton.classList.add("pressed");
        setterButton.classList.remove("pressed");
        guesserContainer.classList.remove("hidden");
        setterContainer.classList.add("hidden");
    }
    else if (mode === SETTER) {
        guesserButton.classList.remove("pressed");
        setterButton.classList.add("pressed");
        guesserContainer.classList.add("hidden");
        setterContainer.classList.remove("hidden");
    }
    else {
        console.error("Unrecognized mode " + mode);
    }
}