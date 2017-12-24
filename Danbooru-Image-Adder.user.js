// ==UserScript==
// @name         Danbooru-Image-Adder
// @namespace    http://tampermonkey.net/
// @version      0.8.6
// @description  Add images to posts
// @author       ECHibiki /qa/
// @match *://boards.4chan.org/*
// @grant         GM_xmlhttpRequest
// @updateURL    https://github.com/ECHibiki/4chan-UserScripts/raw/master/Danbooru-Image-Adder.user.js
// @downloadURL  https://github.com/ECHibiki/4chan-UserScripts/raw/master/Danbooru-Image-Adder.user.js
// ==/UserScript==

/*
I(CREATING THE POSTS)
     1) DO JSON SEARCH FOR TAGS:
            search[name]=TAG1,TAG2 &&&&&& search[order]=count
     2) PICK THE SMALLEST ONES AS BASE
     3) GENERATE A RANDOM NUMBER BETWEEN 0 AND FINAL_PAGE-1
     4) ITTERATE THROUGH POSTS WITH TAGS UNTIL:
            A) IT TIMESOUT
            B) IT GOES FROM START TO END AND NOT FOUND
     5) DO A 4CHANX CreateNotification***

II(AUTO COMPLETE)
    1) ON FIELD CHANGE READ THE CURSOR LEFT AND DO A  search[name_matches]=n* & search[order]=count
    2) PHONE STYLED AUTO COMPLETE
    3) CLICK ON THE GIVEN ITEM TO ADD
    4) GETS PLACED IN THE GIVEN FIELD

III(CHECKBOXES)
   1) CHECKS FOR RATINGS
   2) DROPDOWN FOR ORDER

   3)***   (TODO)
*/

function alert4ChanX(message, type){
    var detail = {type: type, content: message, lifetime: 10};
    if (typeof cloneInto === 'function') {
        detail = cloneInto(detail, document.defaultView);
    }
    var event = new CustomEvent('CreateNotification', {bubbles: true, detail: detail});
    document.dispatchEvent(event);
}

var numberOfPosts;
var pageNo;
var JSONPage;
var JSONTag;
var pagesLoaded = 0;
var smallestTag;

var top_page_max =  10000000;
var top_page = top_page_max;
var attemptMax = 20;
var attemptCounter = attemptMax ;

var imgURL = "";
var sendURL = "";
var oldVal = "";

var timeout = false;
var time_max = 10;
var time = time_max;
var intervalFunction;
var timeout_functions = [];

var taggingFunction;

var interfaceSet = false;

//set listener to build interface in 4chanX
window.onload = function(){
    var len = document.links.length;
    for(var i = 0 ; i < len ; i++){
        document.links[i].addEventListener("click", enhance4ChanX);
    }

    //ENHANCE DUMP TABS (COVER, 482PX - 482PX)
    //DUMP LIST MAX-HEIGHT TO 490

    document.getElementById("fourchanx-css").textContent += ".qr-preview { height: 482px; width: 482px; background-size: cover;}";
    document.getElementById("fourchanx-css").textContent += "#dump-list { min-height: 400px; width: 509px;}";

};

//Alter 4chanX
var enhance4ChanX = function(){
    var qrWindow = document.getElementById("qr");
    //check if elements already made upon opening a qr window
    if(document.getElementById("qrImages") !== null){
        qrWindow.removeChild(document.getElementById("qrImages"));
        clearInterval(taggingFunction);
        //4chanx autodeletes images
        clearImage();
    }
    var dButton = document.getElementById("dump-button");
    if(dButton !== null){dButton.click();}
    else{return;}

    var dList = document.getElementById("dump-list");
    var filenamecontainer = document.getElementById("qr-filename-container");

    //used for setting and unsetting high resolution thumbs for dump list.
    var BGImg = "";
    var oldBGImg = "";
    var observer = new MutationObserver(function(mutate){
        BGImg = dList.firstChild.style.backgroundImage;
        if(BGImg !== oldBGImg && imgURL !== ""){
            dList.firstChild.style.backgroundImage = "url(" + imgURL + ")";
            oldBGImg = dList.firstChild.style.backgroundImage;
        }
        else if (imgURL == ""){
        }
    });
    observer.observe(dList , {attributes: true,subtree:true, childList: true, characterData: true });
    //make the image clear button clear images;
    document.getElementById("qr-filerm").addEventListener("click", clearImage);

    //image setting html elements.
    var qrTable = document.createElement("TABLE");
    qrTable.setAttribute("id", "qrImages");
    qrTable.setAttribute("style", "text-align:center");
    qrWindow.appendChild(qrTable);
    qrWindow.appendChild(document.createElement("BR"));

    var instructionRow = document.createElement("TR");
    var topRowNodes = [document.createElement("BR"),
                       document.createTextNode("Insert Tags to search from danbooru bellow."),
                       document.createElement("BR"),
                       document.createTextNode("Do Not Use \"order:\" tags"),
                       document.createElement("BR"),
                       document.createTextNode("Do Not Use \"rating:\" tags"),
                       document.createElement("BR"),
                       document.createTextNode("For more speed uncheck all boxes!"),
                      ];
    topRowNodes.forEach(
        function(node){
            instructionRow.appendChild(node);
        });
    qrTable.appendChild(instructionRow);

    var optionsRow = document.createElement("TR");
    optionsRow.setAttribute("ID", "or");
    optionsRow.setAttribute("style", "margin:5px;");
    qrTable.appendChild(optionsRow);
    var checkSafe = document.createElement("INPUT");
    checkSafe.setAttribute("id", "safe");
    checkSafe.setAttribute("type", "checkbox");
    var safeText  = document.createTextNode("Safe");
    var checkQuest= document.createElement("INPUT");
    checkQuest.setAttribute("id", "questionable");
    checkQuest.setAttribute("type", "checkbox");
    var questText= document.createTextNode("Questionable");
    var checkExplicit = document.createElement("INPUT");
    checkExplicit.setAttribute("id", "explicit");
    checkExplicit.setAttribute("type", "checkbox");
    var explText = document.createTextNode("Explicit");

    optionsRow.appendChild(safeText);
    optionsRow.appendChild(checkSafe);
    optionsRow.appendChild(questText);
    optionsRow.appendChild(checkQuest);
    optionsRow.appendChild(explText);
    optionsRow.appendChild(checkExplicit);

    var tagRow = document.createElement("TR");
    var secondRowNodes = [
        document.createTextNode("Tags: "),
        document.createElement("INPUT"),
        document.createElement("INPUT"),
        document.createElement("A"),
        document.createElement("INPUT"),
    ];
    secondRowNodes.forEach(
        function(node){
            tagRow.appendChild(node);
        });
    qrTable.appendChild(tagRow);

    var autoCompleteRow = document.createElement("TR");
    autoCompleteRow.setAttribute("ID", "acr");
    autoCompleteRow.setAttribute("style", "margin:5px;");
    qrTable.appendChild(autoCompleteRow);

    secondRowNodes[1].setAttribute("ID", "tags");
    secondRowNodes[1].setAttribute("style", "width:44.9%");
    secondRowNodes[3].setAttribute("ID", "timer");
    secondRowNodes[3].setAttribute("style", "width:20%;margin:0 5px");
    secondRowNodes[4].setAttribute("ID", "urlContainer");
    secondRowNodes[4].setAttribute("style", "width:20%;margin:0 5px");
    secondRowNodes[4].setAttribute("disabled", "");
    var tags = "";
    var tagNode = document.getElementById("tags");
    var rightMost;
    var leftMost;

    secondRowNodes[2].setAttribute("ID", "imageButton");
    secondRowNodes[2].setAttribute("type", "button");
    secondRowNodes[2].setAttribute("value", "Set Image");


    //event listener logic
    secondRowNodes[2].addEventListener("click", function(){
        for(var i = 0 ; i < timeout_functions.length; i++){
            clearInterval(timeout_functions[i]);
        }
        timeout = false;
        document.getElementById("tags").setAttribute("disabled", 1);
        document.getElementById("imageButton").setAttribute("disabled", 1);
        time = time_max;
        timeout_functions.push(setInterval(counterFunction, 1000));
        setImage();
    });
    //ping ever 0.5s for changes
    taggingFunction = setInterval(
        function(){setTagInterface(tagNode, autoCompleteRow, secondRowNodes);},
        500);

};

function clearImage(){
    var dList = document.getElementById("dump-list");
    dList.firstChild.style.backgroundImage = "url()";//trigger mutation event
    imgURL = ""; //get mutation to set to dead
}

var setTagInterface =  function(tagNode, autoCompleteRow, secondRowNodes){
    tags = tagNode.value;
    if(oldVal !== tags){
        var cursorPos = tagNode.selectionStart - 1;
        var currentTag =  (function(){
            var currentChar = tags.charAt(cursorPos);
            var i = 0;
            rightMost = cursorPos;
            while(currentChar != " " && currentChar != "" && currentChar !== undefined){
                i++;
                currentChar = tags.charAt(cursorPos + i);
                if(currentChar != " " && currentChar != "") rightMost = cursorPos + i;
            }
            rightMost += 1;
            currentChar = tags.charAt(cursorPos);
            i = 0;
            leftMost = cursorPos;
            while(currentChar != " " && currentChar != ""  && currentChar !== undefined){
                i++;
                currentChar = tags.charAt(cursorPos - i);
                if(currentChar != " " && currentChar != "") leftMost = cursorPos - i;
            }
            return tags.substring(leftMost, rightMost);
        })();
        var xhr = new GM_xmlhttpRequest(({
            method: "GET",
            url: "https://danbooru.donmai.us/tags.json?search[name_matches]=" + currentTag + "*&search[order]=count",
            responseType : "json",
            onload: function(data){
                data = data.response;
                var tagArray = tags.split(" ");
                while (autoCompleteRow.hasChildNodes()) {
                    autoCompleteRow.removeChild(autoCompleteRow.lastChild);
                }
                for (var i = 0 ; i < 5 ; i++){
                    var a  = document.createElement("A");
                    a.setAttribute("style", "padding:5px;padding-top:0px;font-size:15px;font-weight:bold;border:1px solid black;");
                    var tagText = data["" + i];
                    if(tagText == "" || tagText === undefined) break;
                    tagText = tagText["name"];

                    var aTxt  = document.createTextNode(data[i]["name"]);

                    autoCompleteRow.appendChild(a);
                    a.appendChild(aTxt);
                    a.addEventListener("click", function(evt){
                        tagArray[tagArray.indexOf(currentTag)] = this.textContent;
                        secondRowNodes[1].value = tagArray.join(" ");
                    });
                }
            }}));
    }
    oldVal =  tagNode.value;
};

var setImage = function(){
    //Set image tags.
    var tags = document.getElementById("tags").value;

    //TODO 4cx notification of warning(no error)
    if(tags.indexOf(":") > -1) {
        alert4ChanX("Character ':' not used for file characteristic searches", "warning");
    }
    tags = tags.split(" ");

    var xhr_image_load = new GM_xmlhttpRequest(({
        method: "GET",
        //returns a list of all tags and their properties
        url: "https://danbooru.donmai.us/tags.json?search[name]=" + tags.join() + "&search[order]=count",
        responseType : "json",
        onload: function(data)
        {
            verifyTags(data);

            //set the end
            var endURL = ratingURL(tags, JSONTag);

            var URL = setPostAndPage(endURL, tags);
            sendURL = URL;
            //final check, sends final request after function or calls this function again
            getJSON(URL, checkPageFromDanbooru, tags);
        }}));
};

function verifyTags(data){
    data = data.response;
    if(tags.length == 1 && tags[0] == "") JSONTag = [{"name":""}];
    else JSONTag = data;

    if(data.length == 0){
        //TODO 4cx notification of error)
        alert4ChanX("All tags incorrect", "error");
        return;
    }
    //tag size. Smallest tag is placed at bottom of JSON
    smallestTag = parseInt(data[data.length-1]["post_count"]);
}

var setPostAndPage = function(endURL, tags){
    numberOfPosts = Math.floor(Math.random() * 100) % (smallestTag % 20);
    if(top_page != top_page_max) smallestTag = top_page * 20;
    //1000 is max page search limit
    if(smallestTag == 0) smallestTag = 100;
    pageNo = ((Math.floor(Math.random() * 10000)) % Math.ceil(smallestTag / 20)) % 1000;

    var URL = "https://danbooru.donmai.us/posts.json?page=" + pageNo + endURL;

    loopOne = false;
    loopPage = pageNo;
    loopPost = numberOfPosts;
    sameTrigger = 0;
    return URL;
};

var ratingURL = function(tags, data){
    var URL = "";
    if(document.getElementById("safe").checked){
        if(document.getElementById("questionable").checked){
            if(document.getElementById("explicit").checked){
                if(data.length > 1)  URL =  "&utf8=%E2%9C%93&tags=" + data[data.length-2]["name"] + "+" + data[data.length-1]["name"];
                else  URL =  "&utf8=%E2%9C%93&tags=" + data[data.length-1]["name"];
            }
            else{
                URL =  "&utf8=%E2%9C%93&tags=" + "-rating%3Aexplicit" + "+" + data[data.length-1]["name"];
            }
        }
        else if(document.getElementById("explicit").checked){
            URL =  "&utf8=%E2%9C%93&tags=" + "-rating%3Aquestionable" + "+" + data[data.length-1]["name"];
        }
        else{
            URL =  "&utf8=%E2%9C%93&tags=" + "rating%3Asafe" + "+" + data[data.length-1]["name"];
        }
    }
    else if(document.getElementById("questionable").checked){
        if(document.getElementById("explicit").checked){
            URL =  "&utf8=%E2%9C%93&tags=" + "-rating%3Asafe" + "+" + data[data.length-1]["name"];
        }
        else{
            URL =  "&utf8=%E2%9C%93&tags=" + "rating%3Aquestionable" + "+" + data[data.length-1]["name"];
        }
    }
    else if(document.getElementById("explicit").checked){
        URL =  "&utf8=%E2%9C%93&tags=" + "rating%3Aexplicit" + "+" + data[data.length-1]["name"];
    }
    else{
        if(data.length > 1)  URL =  "&utf8=%E2%9C%93&tags=" + data[data.length-2]["name"] + "+" + data[data.length-1]["name"];
        else  URL = "&utf8=%E2%9C%93&tags=" + data[data.length-1]["name"];
    }
    return URL;
};

//check if valid url location
var checkPageFromDanbooru = function(err, data, tags){
    if (err != null) {
        console.log('Something went wrong: ' + err);
        alert4ChanX("Danbooru Server Did Not Perform request -- Error: "  + err, "error");
        top_page = top_page_max;
        attemptCounter = attemptMax;
        document.getElementById("timer").textContent = "";
        document.getElementById("tags").removeAttribute("disabled");
        document.getElementById("imageButton").removeAttribute("disabled");
        pageNo = 1;
        numberOfPosts = 0;
    }
    else {
        if(smallestTag == 0 && attemptCounter <= 0){
            alert4ChanX("No Results", "error");
            top_page = top_page_max;
            attemptCounter = attemptMax;
            document.getElementById("timer").textContent = "";
            document.getElementById("tags").removeAttribute("disabled");
            document.getElementById("imageButton").removeAttribute("disabled");
            return;
        }
        //redo
        else if(data.length < numberOfPosts+1 && attemptCounter > 0) {
            if(top_page > pageNo){
                top_page = pageNo + numberOfPosts / 20;
            }
            attemptCounter--;
            document.getElementById("timer").textContent = attemptCounter + "|" + time;
            setImage();
        }
        //process page
        else if (attemptCounter > 0){
            //ALL PARAMETERS WILL BE RESET INSIDE JSON
            document.getElementById("timer").textContent =  attemptCounter + "|" + time;
            getJSON(sendURL, setImageFromDanbooru, tags);
        }
        else{
            alert4ChanX("Not found", "error");
            top_page = top_page_max;
            attemptCounter = attemptMax;
            document.getElementById("timer").textContent = "";
            document.getElementById("tags").removeAttribute("disabled");
            document.getElementById("imageButton").removeAttribute("disabled");	
            return;
        }
    }
};

var setImageFromDanbooru = function(err, data, tags){
    if (err != null) {
        console.log('Something went wrong: ' + err);
        alert4ChanX("Danbooru Server Did Not Perform request -- Error: "  + err, "error");
        top_page = top_page_max;
        attemptCounter = attemptMax;
        document.getElementById("timer").textContent = "";
        document.getElementById("tags").removeAttribute("disabled");
        document.getElementById("imageButton").removeAttribute("disabled");

    }
    else {
        JSONPage = data;
        if(timeout){
            alert4ChanX("timeout after " + time +" seconds", "error");
            clearInterval(counterFunction);
            document.getElementById("timer").textContent = "";
            document.getElementById("tags").removeAttribute("disabled");
            document.getElementById("imageButton").removeAttribute("disabled");
            top_page = top_page_max;
            attemptCounter = attemptMax;

            return;
        }
        else if(JSONPage["" + numberOfPosts] == undefined){
            top_page = pageNo;
            attemptCounter--;
            setImage();
            return;
        }

        var endURL = JSONPage["" + numberOfPosts].file_url;
        var URL = "https://danbooru.donmai.us" + endURL;

        urlContainterFunction(URL);

        var fail = false;

        if(endURL === undefined ||
           endURL.indexOf(".mp4") > -1 || endURL.indexOf(".webm") > -1 || endURL.indexOf(".swf") > -1 || endURL.indexOf(".zip") > -1){
            top_page = pageNo;
            attemptCounter--;
            setImage();
            return;
        }
        else{
            tags.forEach(function(tag){
                if(tag.indexOf("order:") > -1);
                else if(tag.indexOf("rating:") > -1){
                    if(tag.charAt(7) !== JSONPage["" + numberOfPosts]["rating"]){
                        fail = true;
                        return;
                    }
                }
                else if(JSONPage["" + numberOfPosts]["tag_string"].indexOf(tag) == -1){
                    fail = true;
                    return;
                }
            });
        }
        if(fail){
            top_page = pageNo;
            attemptCounter--;
            setImage();
            return;
        }
        else{
            if(JSONPage["" + numberOfPosts].file_size >= 4000000){
                var endURL = JSONPage["" + numberOfPosts].large_file_url;
                var URL = "https://danbooru.donmai.us" + endURL;
            }
            document.getElementById("timer").textContent = "...";
            imgURL = URL;
            var xhr = new GM_xmlhttpRequest(({
                method: "GET",
                url: URL,
                responseType : "arraybuffer",
                onload: function(response)
                {
                    top_page = top_page_max;
                    attemptCounter = attemptMax;
                    document.getElementById("tags").removeAttribute("disabled");
                    document.getElementById("imageButton").removeAttribute("disabled");
                    loopOne = false;
                    clearInterval(intervalFunction);
                    time = time_max;
                    var counter = document.getElementById("timer");
                    while(counter.hasChildNodes())
                        document.getElementById("timer").removeChild(document.getElementById("timer").lastChild);


                    var blob;
                    if(endURL.indexOf(".jpg") > -1)
                        blob = new Blob([response.response], {type:"image/jpeg"});
                    else if(endURL.indexOf(".png") > -1)
                        blob = new Blob([response.response], {type:"image/png"});
                    else if(endURL.indexOf(".gif") > -1)
                        blob = new Blob([response.response], {type:"image/gif"});


                    var name = endURL.replace(/(data|cached)/g, "");
                    name = name.replace(/\//g, "");

                    //SEND RESULTING RESPONSE TO 4CHANX FILES === QRSetFile
                    var detail = {file:blob, name:name};
                    if (typeof cloneInto === 'function') {
                        detail  = cloneInto(detail , document.defaultView);
                    }
                    document.getElementById("dump-list").firstChild.click();
                    document.dispatchEvent(new CustomEvent('QRSetFile', {bubbles:true, detail}));

                    numberOfPosts++;
                    if(numberOfPosts == 20){
                        numberOfPosts = 0;
                        pageNo++;
                    }
                }
            }));
            //break condition
            return;
        }
    }
};

var urlContainterFunction = function(url){
    var urlBox = document.getElementById("urlContainer");
    urlBox.value = url;
};

var counterFunction  = function(){
    if(!timeout){
        time--;
        if(time < 0){
            timeout = true;
            time = time_max;
        }
    }
};

var getJSON = function(url, callback, extra) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'json';
    xhr.onload = function() {
        var status = xhr.status;
        if (status == 200) {
            callback(null, xhr.response, extra);
        } else {
            callback(status);
        }
    };
    xhr.send();
};
