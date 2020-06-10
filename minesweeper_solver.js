function solve() {
    if (!game.solver.queue || !game.solver.moveCount) {
        game.solver.moveCount = 0;
        game.solver.queue = new Queue(); // holds items with [row, col, moveAdded]
        for (let i=0; i<game.rows; i++) {
            for (let j=0; j<game.cols; j++) {
                if (game.status[i][j] === SHOWN) {
                    for (let k=0; k<8; k++) {
                        if (inBounds(i + chRow[k], j + chCol[k]) && game.status[i + chRow[k]][j + chCol[k]] === SECRET) {
                            game.solver.queue.push([i + chRow[k], j + chCol[k], 0]);
                        }
                    }
                }
            }
        }
        while (queue.hasItems()) {
            const [row, col, moveAdded] = queue.pop(); // unpack array
            if (moveAdded > 0 && moveAdded === game.solver.moveCount) {
                // we're just cycling through everything without making progress
                return;
            }

            
        }
    }

}