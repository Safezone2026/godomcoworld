
  const API_URL = 'https://godomcoworld-backend.onrender.com';

async function initWallet() {

  let username = localStorage.getItem("username");

  if (!username) {
    username = prompt("Enter username");
    localStorage.setItem("username", username);
  }

  // Don't overwrite existing wallet
  let walletId = localStorage.getItem("walletId");

  if (walletId) {
    console.log("Using existing wallet:", walletId);
    return;
  }

  const res = await fetch(`${API_URL}/wallet/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username })
  });

  const wallet = await res.json();

  localStorage.setItem("walletId", wallet.walletId);

  console.log("Wallet created:", wallet.walletId);
}

initWallet();
