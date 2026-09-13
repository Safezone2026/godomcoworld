
  const API_URL = 'https://godomcoworld-backend.onrender.com';

if (typeof getWalletNetwork !== "function") {
  window.getWalletNetwork = function () {
    return localStorage.getItem("walletNetwork") || "mainnet";
  };
}

async function initWallet() {

  let username = localStorage.getItem("username");

  if (!username) {
    username = prompt("Enter username");
    localStorage.setItem("username", username);
  }

  // Check cached wallet for the currently selected network
const network = getWalletNetwork();
const walletKey = "walletId_" + network;

let walletId = localStorage.getItem(walletKey);

// Backward compatibility with the old generic walletId
if (!walletId) {
    const legacyWalletId = localStorage.getItem("walletId");

    if (legacyWalletId) {
        walletId = legacyWalletId;
        localStorage.setItem(walletKey, walletId);
        localStorage.removeItem("walletId");
    }
}

if (walletId) {

    const check = await fetch(
      `${API_URL}/wallet/${walletId}?network=${network}`
    );

    if (check.ok) {

        console.log("Using existing wallet:", walletId, "Network:", network);

        return;

    }

    console.warn("Cached wallet not found. Creating a new wallet...");

    localStorage.removeItem(walletKey);

}

// Create new wallet

const res = await fetch(`${API_URL}/wallet/create`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    username,
    network
  })
});

const wallet = await res.json();

localStorage.setItem(walletKey, wallet.walletId);

console.log("Wallet created:", wallet.walletId, "Network:", network);
}

initWallet();
