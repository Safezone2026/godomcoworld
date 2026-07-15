window.GodomcoDev.modules.storage = (() => {

function init(logs, add){

    document.getElementById("devStorage").onclick = () => {

        logs.innerHTML = "";

        add("LOCAL STORAGE", []);

        Object.keys(localStorage).forEach(key => {

            add(key, [localStorage.getItem(key)]);

        });

    };

}

return {

    init

};

})();
