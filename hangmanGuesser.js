function startGameAsGuesser(game, ctr=50) {
    if (words.length === 0) {
        logMessage("waiting for " + ctr + "ms, wordlist hasn't loaded", 1);
        setTimeout(function() {
            startGameAsGuesser(game, ctr+10);
        }, ctr);
        return;
    }
    game.state = ON;
    game.word = choose(words);
    game.remaining = new Set(game.word);
    showGameStatus();
}