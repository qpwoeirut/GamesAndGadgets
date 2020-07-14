function startGameAsGuesser(game, ctr=50) {
    if (words.length === 0) {
        logMessage("waiting for " + ctr + "ms, wordlist hasn't loaded", 1);
        setTimeout(function() {
            startGameAsGuesser(game, ctr+10);
        }, ctr);
        return;
    }
    
    game.word = choose(words);
    game.remaining = new Set(game.word);
    showGameStatus();
}

function makeGuess(guess) {
    if (game.state === OFF) return;
    document.getElementById("letter-" + guess).classList.add("pressed");
    game.guesses.add(guess);
    if (game.remaining.delete(guess) === false) {
        game.incorrect.add(guess);
        if (renderHangmanCanvas(game.incorrect.size)) {
            loseGame();
        }
    }
    showGameStatus();

    if (game.remaining.size === 0) {
        winGame();
    }
}