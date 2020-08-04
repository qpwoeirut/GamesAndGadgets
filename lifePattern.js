let mousePosX = 0;
let mousePosY = 0;


// this is really inefficient but all the strings are short 
function capitalizeWithSpaces(s) {
    logMessage("invoked capitalizeWithSpaces with s=" + s);
    let result = "";
    let capNext = true;
    for (let i=0; i<s.length; i++) {
        if (s[i] === '-') {
            capNext = true;
            result += ' ';
        }
        else if (capNext === true) {
            capNext = false;
            result += s[i].toUpperCase();
        }
        else {
            result += s[i];
        }
    }

    return result;
}


function generatePatternButtons() {
    generatePatternTypeButtons("stillPatternContainer", stillPatterns);
    generatePatternTypeButtons("oscillatingPatternContainer", oscillatingPatterns);
    generatePatternTypeButtons("spaceshipPatternContainer", spaceshipPatterns);
    generatePatternTypeButtons("miscPatternContainer", miscPatterns);
}


function generatePatternTypeButtons(containerId, patternList) {
    const container = document.getElementById(containerId);
    for (const pat of patternList) {
        const button = document.createElement("button");
        button.classList = "clickable";
        button.textContent = capitalizeWithSpaces(patternStrings.get(pat));
        button.onclick = function(e) {createFollower(pat)};
        container.appendChild(button);
    }
}


function trackMouse(event) {
    mousePosX = event.pageX;
    mousePosY = event.pageY;
    setFollowerPos();
}


function setFollowerPos() {
    const follower = document.getElementById("follower");
    if (follower) {
        follower.style.left = (mousePosX + 4) + "px";  // make sure click events go to canvas, not follower
        follower.style.top = (mousePosY + 4) + "px";
    }
}

function createFollower(followerType) {
    logMessage("invoked createFollower with followerType=" + followerType);

    resetPattern();
    const follower = document.createElement("div");
    follower.id = "follower";
    follower.classList = patternStrings.get(followerType);
    follower.setAttribute("data-type", followerType);
    follower.style.backgroundSize = (game.cellSize * 64) + "px";
    const pattern = patternArrays.get(followerType);
    follower.style.width = (game.cellSize * pattern[0].length) + "px";
    follower.style.height = (game.cellSize * pattern.length) + "px";
    const backgroundSvg = createFollowerSVG(patternArrays.get(followerType));
    const svgAsBase64 = btoa(backgroundSvg);
    follower.style.backgroundImage = "url('data:image/svg+xml;base64," + svgAsBase64 + "')"
    document.getElementById("pageContainer").appendChild(follower);

    document.getElementById("currentPattern").textContent = capitalizeWithSpaces(patternStrings.get(followerType));

    setFollowerPos();
}

function resetPattern() {
    logMessage("invoked resetPattern");
    const oldFollower = document.getElementById("follower");
    if (oldFollower) {
        oldFollower.parentElement.removeChild(oldFollower);
    }
    document.getElementById("currentPattern").textContent = "Cell";
}


const svgNS = "http://www.w3.org/2000/svg";
function createFollowerSVG(patternArray) {
    const svg = document.createElement("svg");
    svg.setAttribute("xmlns", svgNS);
    svg.setAttribute("width", 64);
    svg.setAttribute("height", 64);
    for (let y=0; y<patternArray.length; y++) {
        for (let x=0; x<patternArray[y].length; x++) {
            if (patternArray[y][x]) {
                const rect = document.createElementNS(svgNS, "rect");
                rect.setAttributeNS(null, "x", x);
                rect.setAttributeNS(null, "y", y);
                rect.setAttributeNS(null, "height", 1);
                rect.setAttributeNS(null, "width", 1);
                rect.setAttributeNS(null, "fill", "black");
                svg.appendChild(rect);
            }
        }
    }
    return svg.outerHTML;
}


function writeFollowerPattern(row, col) {
    const follower = document.getElementById("follower");
    if (!follower) {
        return false;
    }
    
    const followerType = parseInt(follower.getAttribute("data-type"));
    console.log("invoked writeFollowerPattern with row=" + row + ", col=" + col + ", and followerType string is " + patternStrings.get(followerType));

    setPattern(row, col, patternArrays.get(followerType));

    return true;
}

function setPattern(row, col, pattern) {
    for (let r=0; r<pattern.length; r++) {
        for (let c=0; c<pattern[r].length; c++) {
            game.grid[row + r][col + c] = pattern[r][c] === 1;
            updateActive(row + r, col + c);
            for (let i=0; i<8; i++) {
                updateActive(row + r + chRow[i], col + c + chCol[i]);
            }
        }
    }
}