function closePopups(event) {
    if (event.target.closest(".popup") === null) {
        for (const popup of document.querySelectorAll(".popup:not(.no-click-away)")) {
            popup.classList.remove("active");
        }
    }
}

function openId(elemId) {
    logMessage("invoked openId with elemId=" + elemId);
    const elem = document.getElementById(elemId);
    elem.classList.add("active");
    if (elem.classList.contains("no-click-away")) {
        return;
    }
    document.getElementById(elemId).classList.add("no-click-away");
    setTimeout(function() {
        document.getElementById(elemId).classList.remove("no-click-away")
    }, 100);
}

function closeId(elemId) {
    logMessage("invoked closeId with elemId=" + elemId);
    document.getElementById(elemId).classList.remove("active");
}