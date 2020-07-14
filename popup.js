function closePopups(event) {
    if (event.target.closest(".popup") === null && event.target.classList.contains("clickable") === false) {
        for (const popup of document.querySelectorAll(".popup:not(.no-click-away)")) {
            popup.classList.remove("active");
        }
    }
}

function openId(elemId) {
    logMessage("invoked openId with elemId=" + elemId);
    document.getElementById(elemId).classList.add("active");

}

function closeId(elemId) {
    logMessage("invoked closeId with elemId=" + elemId);
    document.getElementById(elemId).classList.remove("active");
}

