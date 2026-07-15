// ================================
// Godomcoworld Global UI Manager
// ================================

(function () {

const LOGO = "images/logo.png";

function ensureGlobalLogo() {

    const existing = document.querySelector(
        'img[src*="logo"], img[alt*="logo"], .app-logo'
    );

    if (existing) {
        existing.src = LOGO;
        existing.id = "godomco-global-logo";
        return;
    }

    const logo = document.createElement("img");

    logo.id = "godomco-global-logo";
    logo.src = LOGO;
    logo.alt = "Godomcoworld";

    logo.style.display = "block";
    logo.style.width = "110px";
    logo.style.height = "auto";
    logo.style.margin = "20px auto";
    logo.style.objectFit = "contain";

    const target =
        document.querySelector("header") ||
        document.querySelector("main") ||
        document.querySelector(".container") ||
        document.body;

    target.prepend(logo);

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

function initGlobalUI() {
    updateTitle();
    updateFavicon();
    ensureGlobalLogo();
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initGlobalUI);
} else {
    initGlobalUI();
}

window.GodomcoUI = {

    refresh() {
        updateTitle();
        updateFavicon();
        ensureGlobalLogo();
    }

};

})();
