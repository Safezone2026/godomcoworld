const API_URL = 'https://godomcoworld-backend.onrender.com';
async function initWallet() {
  let username = localStorage.getItem("username");

  if (!username) {
    username = prompt("Enter username");
    localStorage.setItem("username", username);
  }

  const res = await fetch(`${API_URL}/wallet/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username })
  });

  const wallet = await res.json();

  localStorage.setItem("walletId", wallet.walletId);

  console.log("✅ Wallet ready:", wallet);
}

// run immediately
initWallet();
