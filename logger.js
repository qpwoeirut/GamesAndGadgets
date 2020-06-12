let VERBOSITY = 5;
let LOGGER_KEYWORDS = new Map([["invoking", 8], ["invoked", 8]]);
const DEBUG_LEVEL = 10;
const LOG_LEVEL = 5;

// 10 - Debug
// 5 - Log
// Warn and error should use console.warn and console.error
function logMessage(msg, level=DEBUG_LEVEL) {
    for (const pair of LOGGER_KEYWORDS) {
        if (msg.search(pair[0]) !== -1) {
            level = Math.min(level, pair[1]);
        }
    }
    if (VERBOSITY >= level) {
        console.log(msg);
    }
}

console.log("Welcome to the Console for this website!");
console.log("Every message that this program prints has a level assigned to it.");
console.log("To change which levels you see, set the VERBOSITY variable to a value from 0 to 10, inclusive.");
console.log("The higher you set it, the more messages are printed.")
console.log("Good luck and have fun!");
console.log("\n\n\n\n");