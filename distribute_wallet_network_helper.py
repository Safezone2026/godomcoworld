from pathlib import Path

ROOT = Path.home() / "godomcoworld"

if not ROOT.exists():
    raise SystemExit(f"❌ Repo not found: {ROOT}")

# Create shared network helper
helper = ROOT / "js" / "network.js"
helper.parent.mkdir(parents=True, exist_ok=True)

helper.write_text("""// ================= WALLET NETWORK HELPER =================
// marketplace/wallet.html controls the selected network.
// Other wallet-related pages read the same localStorage value.

function getWalletNetwork() {
  return localStorage.getItem("walletNetwork") || "mainnet";
}
""", encoding="utf-8")

changed = []

# Find HTML pages that use walletNetwork or wallet-init.js
for page in ROOT.rglob("*.html"):
    if ".git" in page.parts:
        continue

    text = page.read_text(encoding="utf-8", errors="ignore")

    if "walletNetwork" not in text and "wallet-init.js" not in text:
        continue

    # Root HTML → js/network.js
    # One-level-deep HTML → ../js/network.js
    rel_helper = (
        Path("js/network.js")
        if page.parent == ROOT
        else Path("../js/network.js")
    )

    tag = f'<script src="{rel_helper.as_posix()}"></script>'

    if tag not in text:
        pos = text.find("<script")

        if pos >= 0:
            text = text[:pos] + tag + "\n" + text[pos:]
        elif "</head>" in text:
            text = text.replace(
                "</head>",
                tag + "\n</head>",
                1
            )
        else:
            text = tag + "\n" + text

    # Replace READS only.
    # The wallet selector's setItem() remains untouched.
    text = text.replace(
        'localStorage.getItem("walletNetwork") || "mainnet"',
        "getWalletNetwork()"
    )

    text = text.replace(
        'localStorage.getItem("walletNetwork") || "testnet"',
        "getWalletNetwork()"
    )

    page.write_text(text, encoding="utf-8")
    changed.append(page.relative_to(ROOT))

# Make wallet-init.js use the same helper
wallet_init = ROOT / "js" / "wallet-init.js"

if wallet_init.exists():
    text = wallet_init.read_text(encoding="utf-8")

    text = text.replace(
        'localStorage.getItem("walletNetwork") || "testnet"',
        "getWalletNetwork()"
    )

    text = text.replace(
        'localStorage.getItem("walletNetwork") || "mainnet"',
        "getWalletNetwork()"
    )

    # Safety fallback for any page that somehow doesn't load network.js
    if "typeof getWalletNetwork" not in text:
        text = text.replace(
            "const API_URL = 'https://godomcoworld-backend.onrender.com';",
            """const API_URL = 'https://godomcoworld-backend.onrender.com';

if (typeof getWalletNetwork !== "function") {
  window.getWalletNetwork = function () {
    return localStorage.getItem("walletNetwork") || "mainnet";
  };
}""",
            1
        )

    wallet_init.write_text(text, encoding="utf-8")
    print("✅ Updated js/wallet-init.js")

print(f"✅ Created {helper.relative_to(ROOT)}")
print(f"✅ Updated {len(changed)} HTML pages")

for page in changed:
    print(" •", page)

print("\\n✅ Network architecture:")
print("Wallet selector → localStorage.walletNetwork → getWalletNetwork()")
print("Default → mainnet")
