function closePopups(event) {
    if (event.target.closest(".popup") === null && event.target.classList.contains("clickable") === false) {
        for (const popup of document.getElementsByClassName("popup")) {
            popup.classList.remove("active");
        }
    }
}

function openId(elemId) {
    document.getElementById(elemId).classList.add("active");

}

function closeId(elemId) {
    document.getElementById(elemId).classList.remove("active");
}


