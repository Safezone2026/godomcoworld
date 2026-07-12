// Godomcoworld Environment Configuration

const IS_LOCAL =
    location.hostname === "127.0.0.1" ||
    location.hostname === "localhost";

const API = IS_LOCAL
    ? "http://127.0.0.1:3000"
    : "https://godomcoworld-backend.onrender.com";

console.log("API =", API);
