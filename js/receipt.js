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



// Report receipt-download diagnostics to Render on Testnet only.
// Never include usernames, order IDs, or receipt contents.
function reportReceiptDiagnostic(stage, err = null) {
  try {
    if (String(getReceiptNetwork()).trim().toLowerCase() !== "testnet") {
      return;
    }

    const payload = {
      stage,
      errorName: err && err.name ? String(err.name).slice(0, 60) : "",
      errorMessage: err && err.message ? String(err.message).slice(0, 250) : ""
    };

    fetch(RECEIPT_API + "/debug/receipt-download", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      keepalive: true
    }).catch(() => {
      console.warn("Receipt diagnostic report could not reach the backend.");
    });
  } catch (reportError) {
    console.warn("Receipt diagnostic reporting failed.");
  }
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

  reportReceiptDiagnostic("start");

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

      reportReceiptDiagnostic("pdf_library_loading");

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

    reportReceiptDiagnostic("pdf_library_loaded");

    reportReceiptDiagnostic("receipt_fetch_started");
    const receipts =
      await loadUserReceipts(username, network);
    reportReceiptDiagnostic("receipt_fetch_succeeded");

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

    reportReceiptDiagnostic("receipt_found");
    reportReceiptDiagnostic("pdf_generation_started");

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

    const filename =
      `Godomcoworld-Receipt-${safeIdentifier}.pdf`;

    const pdfBlob = doc.output("blob");
    reportReceiptDiagnostic("pdf_blob_created");
    const pdfUrl = URL.createObjectURL(pdfBlob);
    const downloadLink = document.createElement("a");

    downloadLink.href = pdfUrl;
    downloadLink.download = filename;
    downloadLink.style.display = "none";

    document.body.appendChild(downloadLink);
    downloadLink.click();
    reportReceiptDiagnostic("download_click_dispatched");
    downloadLink.remove();

    // Testnet fallback: expose a visible link for Pi Browser.
    if (String(network).trim().toLowerCase() === "testnet") {
      let fallback = document.getElementById("receiptPdfFallback");

      if (!fallback) {
        fallback = document.createElement("div");
        fallback.id = "receiptPdfFallback";
        fallback.style.cssText =
          "margin:12px 0;padding:12px;border:1px solid #888;border-radius:8px;";
        const target =
          document.getElementById("receiptBtn")?.parentElement ||
          document.body;
        target.appendChild(fallback);
      }

      fallback.replaceChildren();

      const message = document.createElement("p");
      message.textContent =
        "If the receipt did not download, open the PDF below and use your browser's save or share option.";
      fallback.appendChild(message);

      const openLink = document.createElement("a");
      openLink.href = pdfUrl;
      openLink.removeAttribute("download");
      openLink.textContent = "Open Receipt PDF";
      openLink.style.cssText =
        "display:inline-block;padding:10px 14px;background:#1457a6;color:#fff;border-radius:6px;text-decoration:none;";
      openLink.addEventListener("click", function (event) {
        event.preventDefault();
        window.location.href = pdfUrl;
      });
      fallback.appendChild(openLink);

    }

    // Keep the object URL alive long enough for the user to open the fallback.
    const revokeDelay = String(network).trim().toLowerCase() === "testnet"
      ? 10 * 60 * 1000
      : 60000;
    setTimeout(() => URL.revokeObjectURL(pdfUrl), revokeDelay);

  } catch (err) {

    reportReceiptDiagnostic("error", err);

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
