alert("Step 1");

document.addEventListener("DOMContentLoaded", () => {

alert("Step 2");

const DEV_USERS = ["seller1","GBEST20"];

const currentUser = localStorage.getItem("username") || "";

alert("Current username = [" + currentUser + "]");

if (!DEV_USERS.includes(currentUser)) {
    alert("Step 4: Not developer");
    return;
}

alert("Step 5: Passed developer check");

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
max-height:45vh;
white-space:pre-wrap;
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
`;

document.body.appendChild(panel);

const logs=document.getElementById("godomcoDevLogs");

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

        add("❌ NETWORK ERROR", [err.message]);

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

document.getElementById("devHide").onclick=()=>{

panel.style.display="none";

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
window.addEventListener("unhandledrejection", function(event){

    add("❌ PROMISE ERROR", [

        event.reason

    ]);

    console.error("Unhandled Promise:", event.reason);

});
console.log("Developer Console Ready");

});
