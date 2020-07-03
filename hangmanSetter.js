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