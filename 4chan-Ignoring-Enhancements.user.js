// ==UserScript==
// @name         4chan-Ignoring-Enhancements
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  4chan Pain Kill Extension
// @author       ECHibiki-/qa/
// @match http://boards.4chan.org/*
// @match https://boards.4chan.org/*
// @include https://boards.4chan.org/*
// @include http://boards.4chan.org/*
// @run-at document-body
// @updateURL    https://github.com/ECHibiki/4chan-UserScripts/raw/master/4chan-Ignoring-Enhancements.user.js
// @downloadURL  https://github.com/ECHibiki/4chan-UserScripts/raw/master/4chan-Ignoring-Enhancements.user.js
// ==/UserScript==

var localStoreThreads;
var bowser;
var finished = false;
var windowDisplayed = false;
var defaultExpireTime = 172800000;
var expireTime;

var windowDisplayed = false;
var numberOfFilters = 0;
var initialFilters = [];
var kill = [];
var finished = false;
var observer;
var secondObserverSet;

//is storage possible
function storageAvailable(type) {
    try {
        var storage = window[type],
            x = '__storage_test__';
        storage.setItem(x, x);
        storage.removeItem(x);
        return true;
    }
    catch(e) {
        return e instanceof DOMException && (
            // everything except Firefox
            e.code === 22 ||
            // Firefox
            e.code === 1014 ||
            // test name field too, because code might not be present
            // everything except Firefox
            e.name === 'QuotaExceededError' ||
            // Firefox
            e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
            // acknowledge QuotaExceededError only if there's something already stored
            storage.length !== 0;
    }
}

//What Browser
function detectBrowser() { 
    if((navigator.userAgent.indexOf("Opera") || navigator.userAgent.indexOf('OPR')) != -1 ) 
    {
        console.log("Opera");
        return 0;
    }
    else if(navigator.userAgent.indexOf("Chrome") != -1 )
    {
        console.log("Chrome");
        return 1;
    }
    else if(navigator.userAgent.indexOf("Safari") != -1)
    {
        console.log("Safari");
        return 2;
    }
    else if(navigator.userAgent.indexOf("Firefox") != -1 ) 
    {
        console.log("FireFox");
        return 3;
    }
    else if((navigator.userAgent.indexOf("MSIE") != -1 ) || (!!document.documentMode == true )) //IF IE > 10
    {
        console.log("IE");
        return 4;
    }  
    else 
    {
        console.log("Other");
        return -1;
    }
}

//hide image onclick listener
function hideImage(event){
    var hideIndex = this.src.indexOf(".HIDDEN");
    if((event.ctrlKey && event.shiftKey) && hideIndex == -1){
        event.preventDefault();
        event.stopPropagation();
        if (storageAvailable('localStorage')) {
            if(this.id.charAt(0) == "p") this.id =  "f" + this.id.substr(1);
            localStorage.setItem(this.id, Date.now());
        }
        else {
            console.log("No Storage");
        }
        this.src = this.src + ".HIDDEN" +  "?" + Date.now();
        return false;
    }
    else if(event.ctrlKey && event.shiftKey){
        event.preventDefault();
        event.stopPropagation();
        if (storageAvailable('localStorage')) {
            if(this.id.charAt(0) == "p") this.id =  "f" + this.id.substr(1);
            localStorage.removeItem(this.id);
        }
        else {
            console.log("No Storage");
        }
        this.src = this.src.substring(0, hideIndex);
        return false;
    }
    return true;
}

//functions to find properties by regex
function getPropertyByRegex(obj,propName) {
    var re = new RegExp("^" + propName + "(\\[\\d*\\])?$"),
        key;
    var rtnArray = [];
    for (key in obj)
        if (re.test(key))
            rtnArray.push(key);
    return rtnArray;
}

//retrieve from memory the hidden iamges
var j = 0;
function retrieveStates(){
    var i = 0,
        oJson = {},
        sKey;
    while( i < window.localStorage.length) {
        i++;
        sKey = window.localStorage.key(i);
        oJson[sKey] = window.localStorage.getItem(sKey);
    }
    localStoreThreads = getPropertyByRegex(oJson,"f[0-9]*IMG");
    localStoreThreads.forEach(function callback(elem){
        if(Date.now() - oJson[elem] > expireTime)
            localStorage.removeItem(elem);
        var node = document.getElementById(""+elem);
        if(node !== null && node.src.indexOf(".HIDDEN") == -1){
            node.src = node.src + ".HIDDEN" +  "?" + Date.now(); 
            j++;
        }
        else if((node = document.getElementById("p"+elem.substring(1))) !== null && node.src.indexOf(".HIDDEN") == -1){
            node.src = node.src + ".HIDDEN" +  "?" + Date.now();           
            j++;
        }
        else if((node = document.getElementById("thread-"+elem.substring(1))) !== null && node.src.indexOf(".HIDDEN") == -1){
            node.src = node.src + ".HIDDEN" +  "?" + Date.now(); 
            j++;
        }
        else if((node = document.getElementById("thumb-"+elem.substring(1))) !== null && node.src.indexOf(".HIDDEN") == -1){
            node.src = node.src + ".HIDDEN" +  "?" + Date.now(); 
            j++;
        }
    });
    console.log(j);
}



function hideWindow(){
    var style = document.createElement('style');
    style.innerHTML = ".inputs{background-color:rgb(200,200,200);margin:5px 7px;width:100px;}";
    document.body.appendChild(style);

    var backgroundDiv = document.createElement("div");
    backgroundDiv.setAttribute("style", "border:solid 1px black;position:fixed;width:100%;height:100%;background-color:rgba(200,200,200,0.3);top:0;left:0;display:none; z-index:9");
    backgroundDiv.setAttribute("id", "hiBackground");
    document.body.appendChild(backgroundDiv);
    backgroundDiv.addEventListener("click", hideToggle);

    var windowDiv = document.createElement("div");
    windowDiv.setAttribute("style", "border:solid 1px black;position:fixed;width:400px;background-color:rgb(200,200,200);left:40%;top:20%;margin-bottom:0;  display:none; z-index:10");
    windowDiv.setAttribute("id", "hiWindow");

    var closeDiv = document.createElement("div");
    closeDiv.setAttribute("style", "border:solid 1px black;position:absolute;width:25px;height:25px;background-color:rgba(255,100,90,0.9); right:3px;top:3px; z-index:10");
    closeDiv.addEventListener("click", hideToggle);
    windowDiv.appendChild(closeDiv);

    var titleP = document.createElement("p");
    titleP.setAttribute("style", "margin-left:5px;margin-top:5px");
    var titleText = document.createTextNode("Filter Settings");
    titleP.appendChild(titleText);
    windowDiv.appendChild(titleP);

    var containerDiv = document.createElement("div");
    containerDiv.setAttribute("style","background-color:white;margin:0 0;padding:5px;");
    windowDiv.appendChild(containerDiv);

    var expirationLabel = document.createElement("label");
    var expirationText = document.createTextNode("Expiration Time(hours): ");
    expirationLabel.appendChild(expirationText);
    containerDiv.appendChild(expirationLabel);
    var expirationInput = document.createElement("input");
    expirationInput.setAttribute("id", "expirationTime");
    containerDiv.appendChild(expirationInput);
    containerDiv.appendChild(expirationInput);
    containerDiv.appendChild(document.createElement("br"));
    var setButton = document.createElement("input");
    setButton.setAttribute("type", "button");
    setButton.setAttribute("id", "setTime");
    setButton.setAttribute("value", "Set Time");
    setButton.addEventListener("click", function(){
        // console.log("A");
        if (storageAvailable('localStorage')) {
            var time = document.getElementById("expirationTime");
            var msTime = time.value * 3600000;
            if (msTime == 0) msTime = defaultExpireTime; 
            expireTime = msTime;
            //console.log("B" + expireTime);
            localStorage.setItem("ExpirationTime", msTime);
            hideToggle();
        }
    });
    expirationInput.setAttribute("value", localStorage.getItem("ExpirationTime") / 3600000);
    containerDiv.appendChild(setButton);

    document.body.appendChild(windowDiv);

}

function hideToggle(){
    if(windowDisplayed){
        document.getElementById("hiWindow").style.display = "none";
        document.getElementById("hiBackground").style.display = "none";
        windowDisplayed = false;
    }
    else{
        document.getElementById("hiWindow").style.display = "inline-block";
        document.getElementById("hiBackground").style.display = "inline-block";
        windowDisplayed = true;
    }     
}

function hideButton(){
    var button = document.createElement("input");
    button.setAttribute("Value", "Hide Image Settings");
    button.setAttribute("type", "button");
    button.setAttribute("style", "position:absolute;top:45px");
    button.addEventListener("click", hideWindow);
    if(document.body === null){
        setTimeout(hideButton, 30);
    }
    else{
        document.body.appendChild(button);
        button.addEventListener("click", hideToggle);
    }
    expireTime =  localStorage.getItem("ExpirationTime");
    //console.log("Z" + expireTime);
}


//0000000000000000000000000000000000000000000000000000000000000000000000000000000////0000000000000000000000000000000000000000000000000000000000000000000000000000000//
//0000000000000000000000000000000000000000000000000000000000000000000000000000000////0000000000000000000000000000000000000000000000000000000000000000000000000000000//
//0000000000000000000000000000000000000000000000000000000000000000000000000000000////0000000000000000000000000000000000000000000000000000000000000000000000000000000//
//0000000000000000000000000000000000000000000000000000000000000000000000000000000////0000000000000000000000000000000000000000000000000000000000000000000000000000000//
//0000000000000000000000000000000000000000000000000000000000000000000000000000000////0000000000000000000000000000000000000000000000000000000000000000000000000000000//
//0000000000000000000000000000000000000000000000000000000000000000000000000000000////0000000000000000000000000000000000000000000000000000000000000000000000000000000//
//0000000000000000000000000000000000000000000000000000000000000000000000000000000////0000000000000000000000000000000000000000000000000000000000000000000000000000000//
//0000000000000000000000000000000000000000000000000000000000000000000000000000000////0000000000000000000000000000000000000000000000000000000000000000000000000000000//

function formatSettings(input){
    var rtn =  input.split('"-"');
    var i = 0;
    rtn.forEach(function(filter){
        rtn[i] = filter.replace("\"", "");
        i++;
    });
    return rtn;
}

function loadSettings(){
    var i = 0,
        oJson = {},
        sKey;
    while( i < window.localStorage.length) {
        i++;
        sKey = window.localStorage.key(i);
        oJson[sKey] = window.localStorage.getItem(sKey);
    }
    numberOfFilters = oJson["q"];
    console.log(numberOfFilters);
    filters = getPropertyByRegex(oJson,"filter[0-9]*");
    filters.forEach(function(filter){
        initialFilters.push(formatSettings(oJson[filter]));
    });
}

function saveSettings(){
    kill = [];
    if(storageAvailable('localStorage')){
        window.localStorage.setItem("q", numberOfFilters);
        for (var i = 0 ; i < numberOfFilters; i++){
            var pattern = document.getElementById("Pattern"+i).value;
            var replacement = document.getElementById("Replacement"+i).value;
            var setting = "g";
            if(pattern === "" || replacement === "") continue; 
            if (pattern.charAt(0) == "/" && pattern.charAt(pattern.length - 1) == "/"){
                pattern = pattern + setting;
            }
            else if(pattern.charAt(0) !== "/" && pattern.substr(pattern.length - 2).match(/\/[a-zA-Z$]/) == null){
                pattern = "/" + pattern + "/" + setting;
            }
            document.getElementById("Pattern"+i).value = pattern;
            var saveString = '"' + document.getElementById("Active"+i).checked + '"-"' + pattern + '"-"' + replacement + '"';
            window.localStorage.setItem("filter" + i, saveString);
        }
    }
    alert("Replacements Saved");
}

function filterWindow(){
    var style = document.createElement('style');
    style.innerHTML = ".inputs{background-color:rgb(200,200,200);margin:5px 7px;width:100px;}";
    document.body.appendChild(style);

    var backgroundDiv = document.createElement("div");
    backgroundDiv.setAttribute("style", "border:solid 1px black;position:fixed;width:100%;height:100%;background-color:rgba(200,200,200,0.3);top:0;left:0;display:none; z-index:9");
    backgroundDiv.setAttribute("id", "FilterBackground");
    document.body.appendChild(backgroundDiv);
    backgroundDiv.addEventListener("click",  filterToggle);

    var windowDiv = document.createElement("div");
    windowDiv.setAttribute("style", "border:solid 1px black;position:fixed;width:400px;background-color:rgb(200,200,200);left:40%;top:20%;margin-bottom:0;  display:none; z-index:10");
    windowDiv.setAttribute("id", "FilterWindow");

    var closeDiv = document.createElement("div");
    closeDiv.setAttribute("style", "border:solid 1px black;position:absolute;width:25px;height:25px;background-color:rgba(255,100,90,0.9); right:3px;top:3px; z-index:10");
    closeDiv.addEventListener("click",  filterToggle);
    windowDiv.appendChild(closeDiv);

    var titleP = document.createElement("p");
    titleP.setAttribute("style", "margin-left:5px;margin-top:5px");
    var titleText = document.createTextNode("Filter Settings");
    titleP.appendChild(titleText);
    windowDiv.appendChild(titleP);

    var containerDiv = document.createElement("div");
    containerDiv.setAttribute("style","background-color:white;margin:0 0;padding:5px;");
    windowDiv.appendChild(containerDiv);

    var filterTable = document.createElement("table");
    filterTable.setAttribute("style", "text-align:center;");
    filterTable.setAttribute("id", "FilterTable");
    containerDiv.appendChild(filterTable);

    var tableRow = document.createElement("tr");
    filterTable.appendChild(tableRow);
    var tableHeadActive =  document.createElement("th");
    var headTextActive = document.createTextNode("Active");
    tableHeadActive.appendChild(headTextActive);
    filterTable.appendChild(tableHeadActive);
    var tableHeadPattern =  document.createElement("th");
    var headTextPattern = document.createTextNode("Pattern");
    tableHeadPattern.appendChild(headTextPattern);
    filterTable.appendChild(tableHeadPattern);
    var tableHeadReplacement =  document.createElement("th");
    var headTextReplacement = document.createTextNode("Replacement");
    tableHeadReplacement.appendChild(headTextReplacement);
    filterTable.appendChild(tableHeadReplacement);

    //loop to create rows
        //console.log(numberOfFilters);
    if (numberOfFilters === 0 || isNaN(numberOfFilters)) numberOfFilters = 6;
    //console.log(numberOfFilters);
    for (var i = 0; i <  numberOfFilters ; i++){
        var tableRowContents = document.createElement("tr");
        tableRowContents.setAttribute("id", "FilterRow" + i);

        var tableDataActive =  document.createElement("td");
        var tableCheckBoxActive = document.createElement("input");
        tableCheckBoxActive.setAttribute("type", "checkbox");
        tableCheckBoxActive.setAttribute("id", "Active" + i);
        tableDataActive.appendChild(tableCheckBoxActive);
        tableRowContents.appendChild(tableDataActive);

        var tableDataPattern =  document.createElement("td");
        var tableInputPattern = document.createElement("input");
        tableInputPattern.setAttribute("class", "inputs");
        tableInputPattern.setAttribute("id", "Pattern" + i);
        tableDataPattern.appendChild(tableInputPattern);
        tableRowContents.appendChild(tableDataPattern);

        var tableDataReplacement =  document.createElement("td");
        var tableInputReplacement =  document.createElement("input");
        tableInputReplacement.setAttribute("class", "inputs");
        tableInputReplacement.setAttribute("id", "Replacement" + i);
        tableDataReplacement.appendChild(tableInputReplacement);
        tableRowContents.appendChild(tableDataReplacement);

        filterTable.appendChild(tableRowContents);
    }

    var tableLastContents = document.createElement("tr");

    var tableAddCollumn =  document.createElement("td");
    var tableAddRowButton = document.createElement("input");
    var tableSubtractRowButton = document.createElement("input");
    tableSubtractRowButton.setAttribute("type", "button");
    tableSubtractRowButton.setAttribute("value", "-");
    tableSubtractRowButton.setAttribute("style", "padding: 7px 0; margin:5px 0;");
    tableAddCollumn.appendChild(tableSubtractRowButton);
    tableSubtractRowButton.addEventListener("click", removeRow);
    tableAddRowButton.setAttribute("type", "button");
    tableAddRowButton.setAttribute("value", "+");
    tableAddRowButton.setAttribute("style", "padding: 7px 0; margin:5px 0;");
    tableAddCollumn.appendChild(tableAddRowButton);
    tableAddRowButton.addEventListener("click", addRow);

    tableLastContents.appendChild(tableAddCollumn);

    var tableSetCollumn =  document.createElement("td");
    var tableConfirmButton = document.createElement("input");
    tableConfirmButton.setAttribute("type", "button");
    tableConfirmButton.setAttribute("id", "tableConfirmButton");
    tableConfirmButton.setAttribute("value", "Set Replacements");
    tableConfirmButton.setAttribute("style", "padding: 7px 0; margin:5px 0;");
    tableConfirmButton.addEventListener("click", saveSettings);
    tableConfirmButton.addEventListener("click", modifyDOM);
    tableConfirmButton.addEventListener("click", filterToggle);
    tableSetCollumn.appendChild(tableConfirmButton);
    tableLastContents.appendChild(tableSetCollumn);


    var tableCloseCollumn = document.createElement("td");
    var tableCloseButton = document.createElement("input");
    tableCloseButton.setAttribute("type", "button");
    tableCloseButton.setAttribute("value", "Close Menu");
    tableCloseButton.setAttribute("style", "padding: 7px 0; margin:5px 0;");
    tableCloseButton.addEventListener("click",  filterToggle);
    tableCloseCollumn.appendChild(tableCloseButton);
    tableLastContents.appendChild(tableCloseCollumn);

    filterTable.appendChild(tableLastContents);

    document.body.appendChild(windowDiv);

}

function filterToggle(){
    if(windowDisplayed){
        document.getElementById("FilterWindow").style.display = "none";
        document.getElementById("FilterBackground").style.display = "none";
        windowDisplayed = false;
    }
    else{
        document.getElementById("FilterWindow").style.display = "inline-block";
        document.getElementById("FilterBackground").style.display = "inline-block";
        windowDisplayed = true;
    }
}

function filterButton(){
    var button = document.createElement("input");
    button.setAttribute("Value", "Word Filter Settings");
    button.setAttribute("type", "button");
    button.setAttribute("style", "position:absolute;top:75px");
    button.addEventListener("click", filterWindow);
    document.body.appendChild(button);
    button.addEventListener("click", filterToggle);
}

function addRow(){
    var table = document.getElementById("FilterTable");
    table.deleteRow(parseInt(numberOfFilters) + 1);
    numberOfFilters++;
    
    var tableRowContents = document.createElement("tr");
    tableRowContents.setAttribute("id", "FilterRow" +  (numberOfFilters - 1));

    var tableDataActive =  document.createElement("td");
    var tableCheckBoxActive = document.createElement("input");
    tableCheckBoxActive.setAttribute("type", "checkbox");
    tableCheckBoxActive.setAttribute("id", "Active" + (numberOfFilters - 1));
    tableDataActive.appendChild(tableCheckBoxActive);
    tableRowContents.appendChild(tableDataActive);

    var tableDataPattern =  document.createElement("td");
    var tableInputPattern = document.createElement("input");
    tableInputPattern.setAttribute("class", "inputs");
    tableInputPattern.setAttribute("id", "Pattern" + (numberOfFilters - 1));
    tableDataPattern.appendChild(tableInputPattern);
    tableRowContents.appendChild(tableDataPattern);

    var tableDataReplacement =  document.createElement("td");
    var tableInputReplacement =  document.createElement("input");
    tableInputReplacement.setAttribute("class", "inputs");
    tableInputReplacement.setAttribute("id", "Replacement" + (numberOfFilters - 1));
    tableDataReplacement.appendChild(tableInputReplacement);
    tableRowContents.appendChild(tableDataReplacement);

    table.appendChild(tableRowContents);

    var tableLastContents = document.createElement("tr");

    var tableAddCollumn =  document.createElement("td");
    var tableAddRowButton = document.createElement("input");
    var tableSubtractRowButton = document.createElement("input");
    tableSubtractRowButton.setAttribute("type", "button");
    tableSubtractRowButton.setAttribute("value", "-");
    tableSubtractRowButton.setAttribute("style", "padding: 7px 0; margin:5px 0;");
    tableAddCollumn.appendChild(tableSubtractRowButton);
    tableSubtractRowButton.addEventListener("click", removeRow);
    tableAddRowButton.setAttribute("type", "button");
    tableAddRowButton.setAttribute("value", "+");
    tableAddRowButton.setAttribute("style", "padding: 7px 0; margin:5px 0;");
    tableAddCollumn.appendChild(tableAddRowButton);
    tableAddRowButton.addEventListener("click", addRow);
    
    tableLastContents.appendChild(tableAddCollumn);

    var tableSetCollumn =  document.createElement("td");
    var tableConfirmButton = document.createElement("input");
    tableConfirmButton.setAttribute("type", "button");
    tableConfirmButton.setAttribute("id", "tableConfirmButton");
    tableConfirmButton.setAttribute("value", "Set Replacements");
    tableConfirmButton.setAttribute("style", "padding: 7px 0; margin:5px 0;");
    tableConfirmButton.addEventListener("click", saveSettings);
    tableConfirmButton.addEventListener("click", modifyDOM);
    tableConfirmButton.addEventListener("click", filterToggle);
    tableSetCollumn.appendChild(tableConfirmButton);
    tableLastContents.appendChild(tableSetCollumn);

    var tableCloseCollumn = document.createElement("td");
    var tableCloseButton = document.createElement("input");
    tableCloseButton.setAttribute("type", "button");
    tableCloseButton.setAttribute("value", "Close Menu");
    tableCloseButton.setAttribute("style", "padding: 7px 0; margin:5px 0;");
    tableCloseButton.addEventListener("click", filterToggle);
    tableCloseCollumn.appendChild(tableCloseButton);
    tableLastContents.appendChild(tableCloseCollumn);

    table.appendChild(tableLastContents);  
}

function removeRow(){
    var table = document.getElementById("FilterTable");
    if(numberOfFilters != 0){
        table.deleteRow(numberOfFilters);
        numberOfFilters--;
    }
}

function setTable(){
    var i = 0;
    initialFilters.forEach(function(filter){
        if(filter[2] === null || filter[1] === null || filter[0] === null || i == numberOfFilters) return;
        if(filter[0] == "true"){
            document.getElementById("Active"+i).checked = true;
        }
        else if(filter[0] == "false"){
            document.getElementById("Active"+i).checked = false;
        }
        document.getElementById("Pattern"+i).value = filter[1];
        document.getElementById("Replacement"+i).value = filter[2];
        i++;
    });
}


//1111111111111111111111111111111111111111111111111111111111111111111111////11111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111//
//1111111111111111111111111111111111111111111111111111111111111111111111////11111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111//
//1111111111111111111111111111111111111111111111111111111111111111111111////11111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111//
//1111111111111111111111111111111111111111111111111111111111111111111111////11111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111//
//1111111111111111111111111111111111111111111111111111111111111111111111////11111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111//
//1111111111111111111111111111111111111111111111111111111111111111111111////11111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111//
//1111111111111111111111111111111111111111111111111111111111111111111111////11111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111//
//1111111111111111111111111111111111111111111111111111111111111111111111////11111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111//
//1111111111111111111111111111111111111111111111111111111111111111111111////11111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111//
//1111111111111111111111111111111111111111111111111111111111111111111111////11111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111//


function modifyDOM(){
    if(finished) {
        var start = document.getElementById("delform");
        if (start === null) start = document.body;
        else start = start.firstChild;
        if(!secondObserverSet){
            //console.log(start);
            observer.disconnect();
            observeDynamicMutation(start);
            secondObserverSet = true;
        }
    }
    else {
        var start = document;
    }
    if(start === null) return;
    var itterator = document.createTreeWalker(start, NodeFilter.SHOW_ELEMENTS, NodeFilter.SHOW_ELEMENTS);
    var node = "";

    //console.log("modify DOM");
    while((node = itterator.nextNode())){
        var cname = node.className;
        var tag = node.tagName;
        if(tag  === "IMG" || tag  === "img"){
            if(node.getAttribute("data-md5") !== null || node.className.indexOf("thumb") != -1){
                finished = true;
                node.id = node.parentNode.parentNode.id + "IMG";
                node.addEventListener("click", hideImage, {passive:false, capture:false, once:false});
            }
        }
        else if(cname == "postMessage"){
            while((localNode = itterator.nextNode())){
                var className = localNode.className;
                if(className == undefined || className == "quotelink"){
                    for(var i = 0 ; i < numberOfFilters; i++){
                        //console.log(localNode.className);
                        if(kill[i] == true) continue;
                        filter = document.getElementById("Pattern"+i);
                        replacement = document.getElementById("Replacement"+i);
                        active = document.getElementById("Active"+i);
                        if(active.checked){
                            finished = true;
                            var lastChar = filter.value.length - 1;
                            var filterText = filter.value;
                            if(filterText === "") break;
                            var setting = filterText.substr(lastChar);
                            filterText = filterText.substr(1, lastChar-2);
                            filterText = "(^| )" + filterText + "( |$)";
                            try{
                                var regex = new RegExp(filterText, setting);
                                localNode.textContent = localNode.textContent.replace(regex, " " + replacement.value + " ");
                            }
                            catch(e){
                                alert(i + "'s regex was invalid");
                                kill[i] = true;
                            }
                            // console.log("Inner: " + (Date.now() - later));
                        }
                    }
                }
                else break;
            }

        }
    }
}

//detect page changes
function observeDynamicMutation(node){
    if(node === undefined)
        node = document;
    observer = new MutationObserver(function callBack(mutations){
        var later = Date.now();
        retrieveStates();
        modifyDOM();
        //console.log("PKX: " + (Date.now() - later));
    });
    var config = {subtree: true, childList:true};
    observer.observe(node, config);
}

if (window.top != window.self)  //-- Don't run on frames or iframes
    return;

//initial onload setup
function hideSetup(){
    modifyDOM();
    retrieveStates();
    hideButton();
}

function filterSetup(){
    loadSettings();
    filterButton();
    filterWindow();
    setTable();
}

function pkxSetup(){
    hideSetup();
    filterSetup();
    observeDynamicMutation();
}

browser = detectBrowser();
pkxSetup();
console.log("Script loaded: 4chanPKX");

