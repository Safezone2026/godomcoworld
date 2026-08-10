// ================= WALLET NETWORK HELPER =================
// marketplace/wallet.html controls the selected network.
// Other wallet-related pages read the same localStorage value.

function getWalletNetwork() {
  return localStorage.getItem("walletNetwork") || "mainnet";
}
