
  const API_URL = 'https://godomcoworld-backend.onrender.com';

async function initWallet() {

  let username = localStorage.getItem("username");

  if (!username) {
    username = prompt("Enter username");
    localStorage.setItem("username", username);
  }

  // Check cached wallet
let walletId = localStorage.getItem("walletId");

if (walletId) {

    const network = localStorage.getItem("walletNetwork") || "testnet";

const check = await fetch(
  `${API_URL}/wallet/${walletId}?network=${network}`
);

    if (check.ok) {

        console.log("Using existing wallet:", walletId);

        return;

    }

    console.warn("Cached wallet not found. Creating a new wallet...");

    localStorage.removeItem("walletId");

}

// Create new wallet
const res = await fetch(`${API_URL}/wallet/create`, {

    method: "POST",

    headers: {

        "Content-Type": "application/json"

    },

    const network = localStorage.getItem("walletNetwork") || "testnet";

body: JSON.stringify({
  username,
  network
})

});

const wallet = await res.json();

localStorage.setItem("walletId", wallet.walletId);

console.log("Wallet created:", wallet.walletId);
}

initWallet();
