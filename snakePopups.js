function openHowToPlay() {
    closeSettings();
    var x = document.getElementById("howToPlayMessage");
    if (x.style.display === "none") {
        x.style.display = "block";
    } 
    var y = document.getElementById("howToPlayClose");
    if (y.style.display === "none") {
        y.style.display = "block";
    } 
}

function closeHowToPlay() {
    var a = document.getElementById("howToPlayMessage");
    if (a.style.display === "block") {
        a.style.display = "none";
    } 
    var b = document.getElementById("howToPlayClose");
    if (b.style.display === "block") {
        b.style.display = "none";
    } 
}


function openSettings() {
    closeHowToPlay();
    var m = document.getElementById("settingsMessage");
    if (m.style.display === "none") {
        m.style.display = "block";
    } 
    var n = document.getElementById("settingsClose");
    if (n.style.display === "none") {
        n.style.display = "block";
    } 
}
function closeSettings() {
    var r = document.getElementById("settingsMessage");
    if (r.style.display === "block") {
        r.style.display = "none";
    } 
    var s = document.getElementById("settingsClose");
    if (s.style.display === "block") {
        s.style.display = "none";
    } 
}