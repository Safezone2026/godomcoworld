window.API = "https://godomcoworld-backend.onrender.com";

async function payWithWallet(amount, currency) {
  const walletId = localStorage.getItem("walletId");

  if (!walletId) {
    alert("Wallet not found");
    return false;
  }

  // ✅ LOG BEFORE sending
  console.log("📤 Sending payment:", {
    walletId,
    amount,
    currency
  });

  try {
    const res = await fetch(API + "/wallet/pay", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        walletId,
        amount: Number(amount),
        currency: currency
      })
    });

    const data = await res.json();

    // ✅ LOG RESPONSE
    console.log("📥 Server response:", data);

    if (!data.success) {
      alert(data.message);
      return false;
    }

    alert("✅ Payment successful");
    return true;

  } catch (err) {
    console.error(err);
    alert("Payment failed");
    return false;
  }
}
async function checkPaymentAccess(method){

  try{
    const res = await fetch("https://godomcoworld-backend.onrender.com/admin/payment-settings");
    const settings = await res.json();

    if(method === "Pi" && settings.enablePi === false){

      if(settings.enableFiat){
        alert("🪙 Pi payments are temporarily unavailable.\n👉 Please switch to Fiat payment.");
      } else {
        alert("🚫 All payment methods are currently unavailable.\nPlease try again later.");
      }

      return false;
    }

    if(method === "Fiat" && settings.enableFiat === false){

      if(settings.enablePi){
        alert("💵 Fiat payments are temporarily unavailable.\n👉 Please switch to Pi payment.");
      } else {
        alert("🚫 All payment methods are currently unavailable.\nPlease try again later.");
      }

      return false;
    }

    return true;

  }catch(err){
    console.error(err);
    alert("⚠️ Unable to verify payment settings");
    return false;
  }
}