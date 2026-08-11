// ============================================================
// GODOMCOWORLD SHARED RECEIPT PDF
// Network-aware production receipt system
// ============================================================

const RECEIPT_API =
  "https://godomcoworld-backend.onrender.com";

function getReceiptNetwork() {

  if (typeof getWalletNetwork === "function") {
    try {
      return getWalletNetwork();
    } catch (err) {
      console.warn("Network helper failed:", err);
    }
  }

  return (
    localStorage.getItem("walletNetwork") ||
    localStorage.getItem("network") ||
    localStorage.getItem("selectedNetwork") ||
    "mainnet"
  );
}


async function loadUserReceipts(username, network) {

  if (!username) {
    throw new Error("Username is required to load receipts.");
  }

  const selectedNetwork =
    network || getReceiptNetwork();

  const url =
    RECEIPT_API +
    "/receipts/" +
    encodeURIComponent(username) +
    "?network=" +
    encodeURIComponent(selectedNetwork);

  console.log("🧾 Loading receipts:", {
    username,
    network: selectedNetwork
  });

  const res = await fetch(url);

  const data = await res.json();

  if (!res.ok || !data.success) {
    throw new Error(
      data.message || "Unable to load receipts."
    );
  }

  return Array.isArray(data.receipts)
    ? data.receipts
    : [];
}


async function downloadReceipt(options = {}) {

  try {

    const {
      receiptId = null,
      transactionId = null,
      orderId = null,
      username = null
    } = options;

    if (!username) {
      throw new Error("Username is missing.");
    }

    if (!receiptId && !transactionId && !orderId) {
      throw new Error(
        "Receipt, transaction, or order ID is required."
      );
    }

    const network = getReceiptNetwork();

    // Load jsPDF only when needed.
    if (!window.jspdf) {

      await new Promise((resolve, reject) => {

        const script =
          document.createElement("script");

        script.src =
          "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";

        script.onload = resolve;

        script.onerror = () =>
          reject(
            new Error("PDF library could not be loaded.")
          );

        document.head.appendChild(script);

      });

    }

    const receipts =
      await loadUserReceipts(username, network);

    const receipt =
      receipts.find(r => {

        if (
          receiptId &&
          String(r.receipt_id || "") === String(receiptId)
        ) {
          return true;
        }

        if (
          transactionId &&
          String(r.transaction_id || "") === String(transactionId)
        ) {
          return true;
        }

        if (
          orderId &&
          String(r.order_id || "") === String(orderId)
        ) {
          return true;
        }

        return false;
      });

    if (!receipt) {
      throw new Error(
        "No receipt found for the requested transaction."
      );
    }

    const { jsPDF } = window.jspdf;

    const doc = new jsPDF();

    let y = 20;

    doc.setFontSize(18);
    doc.text("GODOMCOWORLD", 20, y);

    y += 9;

    doc.setFontSize(13);
    doc.text("Transaction Receipt", 20, y);

    y += 10;

    doc.setFontSize(10);

    const lines = [

      ["Receipt ID", receipt.receipt_id],

      ["Transaction ID", receipt.transaction_id],

      ["Order ID", receipt.order_id],

      ["Username", receipt.username],

      ["Receipt Type", receipt.receipt_type],

      ["Amount", receipt.amount],

      ["Currency", receipt.currency],

      ["Payment Method", receipt.payment_method],

      ["Network", receipt.network || network],

      ["Status", receipt.status],

      ["Description", receipt.description],

      ["Reference", receipt.reference],

      ["Created", receipt.created_at]

    ];

    for (const [label, value] of lines) {

      const text =
        `${label}: ${value ?? "-"}`;

      const wrapped =
        doc.splitTextToSize(text, 170);

      doc.text(wrapped, 20, y);

      y += 7 * wrapped.length;

      if (y > 275) {

        doc.addPage();

        y = 20;

      }

    }

    y += 10;

    doc.setFontSize(9);

    doc.text(
      "Generated from Godomcoworld receipt records.",
      20,
      y
    );

    const identifier =
      receipt.receipt_id ||
      receipt.transaction_id ||
      receipt.order_id ||
      "transaction";

    const safeIdentifier =
      String(identifier)
        .replace(/[^a-zA-Z0-9_-]/g, "_");

    doc.save(
      `Godomcoworld-Receipt-${safeIdentifier}.pdf`
    );

  } catch (err) {

    console.error(
      "RECEIPT PDF ERROR:",
      err
    );

    alert(
      "Receipt download failed:\n\n" +
      err.message
    );

  }

}


// ------------------------------------------------------------
// Backward-compatible order receipt helper
// ------------------------------------------------------------

async function downloadOrderReceipt(
  orderId,
  username
) {

  return downloadReceipt({
    orderId,
    username
  });

}
