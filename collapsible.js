// If this doesn't seem to be working, make sure it's called AFTER the <body> tag
function addCollapsibleListeners() {
    const controls = document.getElementsByClassName("collapsible-control");
    for (const control of controls) {
        control.addEventListener("click", function (e) {
            this.classList.toggle("collapsible-open");
            this.nextElementSibling.classList.toggle("collapsible-show");
        });
    }
}