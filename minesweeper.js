class Minesweeper {
    constructor(rows, cols, mineFrequency) {
        console.log("Created minesweeper game with " + rows + " rows and " + cols + 
                    " cols with mine frequency " + mineFrequency);
        this.rows = rows;
        this.cols = cols;
        this.mineFrequency = mineFrequency;
        this.initialized = false;

        this.game = document.getElementById("game");
        this.height = this.game.height;
        this.width = this.game.width;

        this.cellSize = Math.min(this.height / this.rows, this.width / this.cols);
        console.debug("Cell size is " + this.cellSize);

        console.debug("Drawing grid");
        var ctx = this.game.getContext("2d");
        ctx.beginPath();
        // this.grid = [];
        for (let i=0; i<rows; i++) {
            // this.grid.push([]);
            for (let j=0; j<cols; j++) {
                // this.grid[i].push(0);
                ctx.rect(i * this.cellSize, j * this.cellSize, this.cellSize, this.cellSize);
            }
        }
        ctx.stroke();
        console.debug("Finished drawing grid");

        console.debug("Setting onclick handler for canvas");
        this.game.addEventListener("onclick", function(event) {
            console.log("click!");
            handleClick(convertClickToGrid(event));
        });
        console.debug("Canvas onclick handler set");

        console.log("Done!");
    }

    convertClickToGrid(event) {
        const gamePos = this.game.getBoundingClientRect();
        return [event.clientX - gamePos.left, event.clientY - gamePos.top];
    }

    handleClick(pos) {
        console.debug("Click at grid x=" + pos[0] + " and y=" + pos[1]);
        if (this.initialized === false) {
            this.initialized = true;
            this.initialize(pos);
            return;
        }


    }

    initialize(pos) {
        console.debug("Initalizing game");
        console.debug("Game initialized");
    }
}