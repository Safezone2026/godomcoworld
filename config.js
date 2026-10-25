// Godomcoworld Environment Configuration

const IS_LOCAL =
    location.hostname === "127.0.0.1" ||
    location.hostname === "localhost";

const API = IS_LOCAL
    ? "https://godomcoworld-backend-testnet.onrender.com"
    : "https://godomcoworld-backend-testnet.onrender.com";

console.log("API =", API);
