window.GodomcoDev = window.GodomcoDev || {
    version: "2.0",
    logs: [],
    network: [],
    storage: {},
    wallet: {},
    performance: {},
    modules: {}
};
window.onerror = function (msg, src, line, col, err) {
    alert(
        "JS ERROR\n\n" +
        msg +
        "\nLine: " + line +
        "\nColumn: " + col
    );
    console.error(err || msg);
};
document.addEventListener("DOMContentLoaded", () => {

const DEV_USERS = ["seller1","GBEST20"];

const currentUser = localStorage.getItem("username") || "";

if (!DEV_USERS.includes(currentUser)) return;

const style=document.createElement("style");

style.textContent=`
#godomcoDevConsole{
position:fixed;
bottom:15px;
right:15px;
width:340px;
max-height:55vh;
background:#111;
color:#00ff66;
border:1px solid #00ff66;
border-radius:10px;
font-family:monospace;
font-size:12px;
z-index:999999;
overflow:hidden;
box-shadow:0 0 12px rgba(0,255,0,.4);
}

#godomcoDevHeader{
background:#008844;
padding:8px;
display:flex;
justify-content:space-between;
align-items:center;
cursor:move;
color:white;
font-weight:bold;
}

  #godomcoDevLogs{
  padding:8px;
  overflow:auto;
  height:220px;
  white-space:pre-wrap;
  border-bottom:1px solid #00ff66;
  }

#godomcoDevHeader button{
margin-left:5px;
}
`;

document.head.appendChild(style);

const panel=document.createElement("div");

panel.id="godomcoDevConsole";

panel.innerHTML=`
<div id="godomcoDevHeader">

<span>🛠 Godomcoworld Dev Console</span>

<div>

<button id="devMin">—</button>

<button id="devStorage">Storage</button>

<button id="devTest">Test</button>
<button id="devCopy">Copy</button>
<button id="devClear">Clear</button>

<button id="devHide">Hide</button>

</div>

</div>

<div id="godomcoDevLogs"></div>

<div style="
padding:8px;
border-top:1px solid #00ff66;
background:#111;
position:relative;
z-index:999999;
">
<input
id="devCommand"
type="text"
placeholder="Enter JavaScript command..."
style="
width:100%;
background:#000;
color:#00ff66;
border:1px solid #00ff66;
padding:6px;
font-family:monospace;
">

<button
id="devRun"
onclick="alert('HTML button works')"
style="
margin-top:6px;
width:100%;
">
▶ Run Command
</button>
</div>

<div id="godomcoDevNetwork" style="
display:none;
padding:8px;
overflow:auto;
max-height:45vh;
white-space:pre-wrap;
font-size:11px;
"></div>
`;

document.body.appendChild(panel);
const devMini = document.createElement("div");

devMini.id = "godomcoDevMini";

devMini.innerHTML = "🛠";

devMini.style = `
position:fixed;
bottom:18px;
right:18px;
width:56px;
height:56px;
border-radius:50%;
background:#00aa44;
color:white;
font-size:28px;
display:none;
justify-content:center;
align-items:center;
box-shadow:0 0 12px #00ff66;
z-index:999999;
cursor:pointer;
`;

document.body.appendChild(devMini);
const logs=document.getElementById("godomcoDevLogs");
  document.getElementById("devRun").style.background = "red";
  document.getElementById("devRun").style.color = "#fff";
  document.getElementById("devRun").style.height = "50px";
  document.getElementById("devRun").style.pointerEvents = "auto";
  document.getElementById("devRun").style.position = "relative";
  document.getElementById("devRun").style.zIndex = "2147483647";

function add(type,args){

const line=document.createElement("div");

line.innerHTML=
"<b>"+new Date().toLocaleTimeString()+"</b> "+type+
": "+
args.map(a=>{

if(typeof a==="object"){

try{

return JSON.stringify(a,null,2);

}catch{

return "[Object]";

}

}

return a;

}).join(" ");

logs.appendChild(line);

logs.scrollTop=logs.scrollHeight;

}

const oldLog=console.log;

console.log=function(...a){

oldLog.apply(console,a);

add("LOG",a);

};

const oldError=console.error;

console.error=function(...a){

oldError.apply(console,a);

add("ERROR",a);

};

const oldWarn=console.warn;

console.warn=function(...a){

oldWarn.apply(console,a);

add("WARN",a);

};

const oldFetch=window.fetch;

window.fetch = async (...args) => {

    const method = (args[1] && args[1].method) || "GET";

    add("➡️ REQUEST", [method, args[0]]);

    const start = Date.now();

    try {

        const res = await oldFetch(...args);
       let body = "";

try {
    body = await res.clone().text();
} catch (e) {
    body = "[Response body unavailable]";
}

add("BODY", [body]);

        add("✅ RESPONSE", [
            res.status,
            res.statusText,
            Date.now() - start + " ms"
        ]);

        return res;

    } catch (err) {

    add("❌ FETCH FAILED", [
        args[0],
        err.message
    ]);

    console.error("Fetch failed:", args[0], err);

    throw err;
}

};
// ---------- MINIMIZE ----------
let minimized = false;

document.getElementById("devMin").onclick = () => {

    minimized = !minimized;

    if(minimized){

        logs.style.display = "none";

    }else{

        logs.style.display = "";

    }

};

document.getElementById("devClear").onclick=()=>{

logs.innerHTML="";

};

document.getElementById("devHide").onclick = () => {

    panel.style.display = "none";

    devMini.style.display = "flex";

};
devMini.onclick = () => {

    panel.style.display = "block";

    devMini.style.display = "none";

};
document.getElementById("devStorage").onclick = () => {

    logs.innerHTML = "";

    add("STORAGE", ["username = " + (localStorage.getItem("username") || "")]);

    add("STORAGE", ["walletId = " + (localStorage.getItem("walletId") || "")]);

    add("STORAGE", ["country = " + (localStorage.getItem("country") || "")]);

    add("STORAGE", ["currency = " + (localStorage.getItem("currency") || "")]);

    add("STORAGE", ["seller = " + (localStorage.getItem("seller") || "")]);

    add("STORAGE", ["piUser = " + (localStorage.getItem("piUser") || "")]);

};

document.getElementById("devTest").onclick = () => {

    Promise.reject("Promise test successful");

};
// ---------- COPY LOGS ----------
document.getElementById("devCopy").onclick = async () => {

    try {

        await navigator.clipboard.writeText(logs.innerText);

        console.log("📋 Logs copied to clipboard");

    } catch (err) {

        console.error("Clipboard copy failed", err);

    }

};
let dragging=false;

let offsetX=0;

let offsetY=0;

const header=document.getElementById("godomcoDevHeader");

header.addEventListener("touchstart",e=>{

dragging=true;

offsetX=e.touches[0].clientX-panel.offsetLeft;

offsetY=e.touches[0].clientY-panel.offsetTop;

});

document.addEventListener("touchmove",e=>{

if(!dragging) return;

panel.style.left=(e.touches[0].clientX-offsetX)+"px";

panel.style.top=(e.touches[0].clientY-offsetY)+"px";

panel.style.right="auto";

panel.style.bottom="auto";

});

document.addEventListener("touchend",()=>{

dragging=false;

});
// ---------- JAVASCRIPT ERROR MONITOR ----------
window.onerror = function(message, source, line, column, error){

    add("❌ JS ERROR", [

        message,

        "File: " + source,

        "Line: " + line,

        "Column: " + column

    ]);

    if(error){

        console.error(error);

    }

    return false;

};
// ---------- UNHANDLED PROMISE MONITOR ----------
window.addEventListener("unhandledrejection", function(event) {

    event.preventDefault();

    console.error("Promise reason:", event.reason);

console.dir(event.reason);

add("❌ PROMISE ERROR", [
    event.reason?.message || String(event.reason),
    event.reason?.stack || "(no stack)"
]);

});
// ---------- COMMAND RUNNER ----------
const cmdInput = document.getElementById("devCommand");
const runBtn = document.getElementById("devRun");

runBtn.onclick = async () => {

    const cmd = cmdInput.value.trim();

    if (!cmd) return;

    add("COMMAND", [cmd]);

    try {

        switch (cmd.toLowerCase()) {

            case "help":
                add("HELP", [
                    "help",
                    "storage",
                    "user",
                    "wallet",
                    "clear",
                    "version",
                    "ping"
                ]);
                break;

            case "storage":
                Object.keys(localStorage).forEach(k=>{
                    add("LOCALSTORAGE",[k+" = "+localStorage.getItem(k)]);
                });
                break;

            case "user":
                add("USER",[
                    localStorage.getItem("username") || "(none)"
                ]);
                break;

            case "wallet":
                add("WALLET",[
                    localStorage.getItem("walletId") || "(none)"
                ]);
                break;

            case "clear":
                logs.innerHTML="";
                break;

            case "version":
                const ver=await fetch("/version");
                add("VERSION",[await ver.text()]);
                break;

            case "ping":
                const ping=await fetch("/");
                add("PING",[ping.status,ping.statusText]);
                break;

            default:
                const result = await eval(cmd);
                add("RESULT",[result]);
        }

    } catch(err){

        add("ERROR",[err.message]);

    }

    cmdInput.value="";

};
console.log("Developer Console Ready");
// ---------- API TEST ----------
const apiBtn = document.getElementById("devApi");

if (apiBtn) {

  apiBtn.onclick = async () => {

    logs.innerHTML = "";

    const username = localStorage.getItem("username") || "";
    const network = localStorage.getItem("network") || "testnet";

    const API =
      location.hostname === "127.0.0.1"
      ? "http://127.0.0.1:3000"
      : "https://godomcoworld-backend.onrender.com";

    const url = `${API}/history/${username}?network=${network}`;

    add("API", [url]);

    try {

      const res = await fetch(url);

      add("STATUS", [res.status, res.statusText]);

      const json = await res.json();

      add("ORDERS", [json.orders ? json.orders.length : 0]);

      add("TRANSACTIONS", [json.transactions ? json.transactions.length : 0]);

      add("SUCCESS", ["History endpoint reachable"]);

    } catch (err) {

      add("FAILED", [err.message]);

    }

  };

}

});
// ---------- LOAD DEV UI MODULE ----------
const uiScript = document.createElement("script");

uiScript.src = "js/dev-ui.js";

uiScript.onload = () => {
    GodomcoDev.modules.ui.init();
};

if (document.body) {
    document.body.appendChild(uiScript);
} else {
    window.addEventListener("DOMContentLoaded", () => {
        document.body.appendChild(uiScript);
    }, { once: true });
}
// ---------- LOAD GLOBAL UI ----------
const globalUIScript = document.createElement("script");

globalUIScript.src = "js/global-ui.js";

document.body.appendChild(globalUIScript);
