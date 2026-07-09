alert("Developer console loaded");
(function () {

const DEV_USER = "seller1";

const currentUser = localStorage.getItem("username") || "";

if (currentUser !== DEV_USER) return;

// ---------- CSS ----------
const style = document.createElement("style");

style.innerHTML = `
#godomcoDevConsole{
position:fixed;
bottom:10px;
right:10px;
width:340px;
max-height:55vh;
background:#111;
color:#00ff66;
border:1px solid #00ff66;
border-radius:8px;
font-family:monospace;
font-size:12px;
z-index:999999;
overflow:hidden;
box-shadow:0 0 12px rgba(0,255,0,.3);
}

#godomcoDevHeader{
background:#00aa44;
color:#fff;
padding:8px;
display:flex;
justify-content:space-between;
align-items:center;
font-weight:bold;
}

#godomcoDevLogs{
padding:8px;
overflow:auto;
max-height:45vh;
white-space:pre-wrap;
}

#godomcoDevButtons button{
margin-left:4px;
cursor:pointer;
}
`;

document.head.appendChild(style);

// ---------- PANEL ----------
const panel = document.createElement("div");

panel.id = "godomcoDevConsole";

panel.innerHTML = `
<div id="godomcoDevHeader">

<span>🛠 Godomcoworld Developer Console</span>

<div id="godomcoDevButtons">

<button id="devClear">Clear</button>

<button id="devHide">Hide</button>

</div>

</div>

<div id="godomcoDevLogs"></div>
`;

document.body.appendChild(panel);
// ---------- DRAG SUPPORT ----------
let dragging = false;
let offsetX = 0;
let offsetY = 0;

const header = document.getElementById("godomcoDevHeader");

header.style.cursor = "move";

header.addEventListener("touchstart", function(e){

    dragging = true;

    const touch = e.touches[0];

    offsetX = touch.clientX - panel.offsetLeft;
    offsetY = touch.clientY - panel.offsetTop;

});

document.addEventListener("touchmove", function(e){

    if(!dragging) return;

    const touch = e.touches[0];

    panel.style.left = (touch.clientX - offsetX) + "px";
    panel.style.top = (touch.clientY - offsetY) + "px";

    panel.style.right = "auto";
    panel.style.bottom = "auto";

});

document.addEventListener("touchend", function(){

    dragging = false;

});

const logs = document.getElementById("godomcoDevLogs");

// ---------- LOGGER ----------
function addLog(type,args){

const t=new Date().toLocaleTimeString();

const line=document.createElement("div");

line.innerHTML=`<b>[${t}]</b> ${type}: ${args.map(a=>{

if(typeof a==="object"){

try{

return JSON.stringify(a,null,2);

}catch{

return "[Object]";

}

}

return a;

}).join(" ")}`;

logs.appendChild(line);

logs.scrollTop=logs.scrollHeight;

}

window.DevConsole={

log(...a){

addLog("LOG",a);

},

error(...a){

addLog("ERROR",a);

},

warn(...a){

addLog("WARN",a);

}

};

// ---------- Hook console ----------
const oldLog=console.log;
console.log=function(...a){

oldLog.apply(console,a);

DevConsole.log(...a);

};

const oldError=console.error;
console.error=function(...a){

oldError.apply(console,a);

DevConsole.error(...a);

};

// ---------- Buttons ----------
document.getElementById("devClear").onclick=()=>{

logs.innerHTML="";

};

document.getElementById("devHide").onclick=()=>{

panel.style.display="none";

};

console.log("Developer Console Loaded");

})();
