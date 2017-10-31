// ==UserScript==
// @name       Google Search Tabs Order Fix
// @namespace  google.com
// @include    https://www.google.com/search?*
// @include    https://www.google.com/webhp?*
// @include    https://www.google.ru/search?*
// @include    https://www.google.ru/webhp?*
// @version    1.0
// @grant      none
// ==/UserScript==

(function (){

    // Not included items will be removed (i.e Shopping, Flights)
    var mainOrder = [
        "All", "Images", "Videos", "News", "Maps", "Books",
        "Все", "Картинки", "Видео", "Новости", "Карты", "Книги"
    ];

    function observerEnable(){
            observer.observe(document.querySelector("#main"), { childList: true, subtree: true });
    }
    function observerDisable(){
        observer.disconnect();
    }
    var observer = new MutationObserver(function(mutations){
        observerDisable();
        fixTabs();
        observerEnable();
    });
    observerEnable();
    
    function fixTabs(){
        var parent = document.querySelector("#hdtb-msb");
        
        if (parent == null)
            return;
        
        var settings = document.querySelector("#ab_options");
        var tools = document.querySelector("#hdtb-tls");
        var shadowLinks = [{is_link:false, name:document.querySelector(".hdtb-msel").textContent}];
        
        var firstDiv = document.createElement('div');
        
        var links = parent.querySelectorAll(".q.qs");
        for (var i = 0; i < links.length; i++)
            shadowLinks.push({is_link:true, href:links[i].href, name:links[i].textContent});
        
        parent.innerHTML = "";

        for (var i = 0; i < mainOrder.length; i++){
            for (var t = 0; t < shadowLinks.length; t++){
                if (mainOrder[i] == shadowLinks[t].name){
                    var div = document.createElement('div');
                    if(shadowLinks[t].is_link){
                        div.className = "hdtb-mitem hdtb-imb";
                        div.innerHTML = '<a class="q qs" href="'+shadowLinks[t].href+'">'+shadowLinks[t].name+'</a>';
                    }else{
                        div.className = "hdtb-mitem hdtb-msel hdtb-imb";
                        div.innerHTML = shadowLinks[t].name;
                    }
                    firstDiv.appendChild(div);
                }
            }
        }
        
        if (settings !== null)
            firstDiv.appendChild(settings);
        if (tools !== null)
            firstDiv.appendChild(tools);
        
        parent.appendChild(firstDiv);
    }

    fixTabs();

})();
