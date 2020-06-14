let mousePosX = 0;
let mousePosY = 0;

function handleMouseMove(event) {
    mousePosX = event.clientX;
    mousePosY = event.clientY;
    setFollowerPos();
}


function setFollowerPos() {
    const follower = document.getElementById("follower");
    if (follower) {
        follower.style.left = (mousePosX + 3) + "px";  // make sure click events go to canvas, not follower
        follower.style.top = (mousePosY + 3) + "px";
    }
}

function createFollower(followerType) {
    logMessage("invoked createFollower with followerType=" + followerType);

    deleteAnyFollowers();
    const follower = document.createElement("div");
    follower.id = "follower";
    follower.classList = patternStrings.get(followerType);
    follower.setAttribute("data-type", followerType);
    follower.style.backgroundSize = (game.cellSize * 64) + "px";
    document.getElementById("pageContainer").appendChild(follower);

    setFollowerPos();
}

function deleteAnyFollowers() {
    logMessage("invoked deleteAnyFollowers");
    const oldFollower = document.getElementById("follower");
    if (oldFollower) {
        oldFollower.parentElement.removeChild(oldFollower);
    }
}


function writeFollowerPattern(row, col) {
    const follower = document.getElementById("follower");
    if (!follower) {
        return false;
    }
    
    const followerType = parseInt(follower.getAttribute("data-type"));
    console.log("invoked writeFollowerPattern with row=" + row + ", col=" + col + ", and followerType string is " + patternStrings.get(followerType));
    if (followerType === GLIDER) {
        setPattern(row, col, gliderPattern);
    }
    else if (followerType === "") {

    }

    return true;
}

function setPattern(row, col, pattern) {
    for (let r=0; r<pattern.length; r++) {
        for (let c=0; c<pattern[r].length; c++) {
            game.grid[row + r][col + c] = pattern[r][c] === 1;
        }
    }
}