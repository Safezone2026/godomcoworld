// ================================
// Godomcoworld Global UI Manager
// ================================

(function () {

const LOGO = "images/logo.png";

function updateLogos() {

    document.querySelectorAll("img").forEach(img => {

        const src = (img.getAttribute("src") || "").toLowerCase();
        const alt = (img.getAttribute("alt") || "").toLowerCase();

        if (
            src.includes("logo") ||
            alt.includes("logo") ||
            img.classList.contains("app-logo")
        ) {
            img.src = LOGO;
        }

    });

}

function updateTitle() {

    if (!document.title.includes("Godomcoworld")) {
        document.title = "Godomcoworld";
    }

}

function updateFavicon() {

    let icon = document.querySelector("link[rel*='icon']");

    if (!icon) {

        icon = document.createElement("link");
        icon.rel = "icon";
        document.head.appendChild(icon);

    }

    icon.href = LOGO;

}

document.addEventListener("DOMContentLoaded", () => {

    updateTitle();
    updateFavicon();
    updateLogos();

});

window.GodomcoUI = {

    refresh() {
        updateTitle();
        updateFavicon();
        updateLogos();
    }

};

})();
