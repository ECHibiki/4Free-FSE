	// ==UserScript==
	// @name         Thread Rebuilder
	// @namespace    http://tampermonkey.net/
	// @version      0.3.2
	// @description  try to take over the world!
	// @author       You
	// @match https://boards.4chan.org/*/thread/*
	// @match http://boards.4chan.org/*/thread/*
	// @grant         GM_xmlhttpRequest
	// @updateURL    https://github.com/ECHibiki/4chan-UserScripts/raw/master/Thread-Rebuilder.user.js
	// @downloadURL  https://github.com/ECHibiki/4chan-UserScripts/raw/master/Thread-Rebuilder.user.js
	// ==/UserScript==

	var board = "qa";
	var threadData = [['Comment'], ['Image URLs'], ['Image Names'] ,['Post No.']];
	var semaphore = 1;
	var semaphore_posts = 1;
	var timeListen;

	//1) CREATE INTERFACE
//set listener to build interface in 4chanX
window.onload = function(){
    var len = document.links.length;
    for(var i = 0 ; i < len ; i++){
		var class_name = document.links[i].parentNode.className ;
		if(class_name == "postNum desktop" || class_name == "qr-link-container"
		   || class_name == "brackets-wrap qr-link-container-bottom")
			document.links[i].addEventListener("click", enhance4ChanX);
    }

    //ENHANCE DUMP TABS (COVER, 482PX - 482PX)
    //DUMP LIST MAX-HEIGHT TO 490

    document.getElementById("fourchanx-css").textContent += ".qr-preview { height: 482px; width: 482px; background-size: cover;}";
    document.getElementById("fourchanx-css").textContent += "#dump-list { min-height: 400px; width: 509px;}";

};
	
	var enhance4ChanX = function(){

		var qrWindow = document.getElementById("qr");

		if(document.getElementById("qrRebuilder") !== null) qrWindow.removeChild(document.getElementById("qrRebuilder"));
		//document.getElementById("dump-button").click();

		////console.log(document.getElementById("qr").getElementsByTagName("TEXTAREA")[0]);
		var dList = document.getElementById("dump-list");
		var filenamecontainer = document.getElementById("qr-filename-container");
		var BGImg = "";
		var oldBGImg = "";

		/*
		var observer = new MutationObserver(function(mutate){
			BGImg = dList.firstChild.style.backgroundImage;
			if(BGImg !== oldBGImg && imgURL !== ""){
				//console.log("CHANGED");
				dList.firstChild.style.backgroundImage = "url(" + imgURL + ")";
				//console.log("CHANGED");
				oldBGImg = dList.firstChild.style.backgroundImage;
				//console.log("CHANGED");
				//console.log(imgURL);
			}
			else if (imgURL == ""){

			}
		});
		observer.observe(dList , {attributes: true,subtree:true, childList: true, characterData: true });*/

		if(document.getElementById("qr-filerm") !== null)
			document.getElementById("qr-filerm").addEventListener("click", function(){imgURL = "";});
		else return;

		var qrTable = document.createElement("TABLE");
		qrTable.setAttribute("id", "qrRebuilder");
		qrTable.setAttribute("style", "text-align:center");
		qrWindow.appendChild(qrTable);

		var instructionRow = document.createElement("TR");
		var topRowNodes = [document.createElement("BR"),
						   document.createTextNode("Insert the thread number of the post to rebuild"),
						   document.createElement("BR"),
						   document.createTextNode("Must be in the 4chan archives"),
						   document.createElement("BR"),
						  ];
		topRowNodes.forEach(
			function(node){
				instructionRow.appendChild(node);
			});
		qrTable.appendChild(instructionRow);

		var threadRow = document.createElement("TR");
		var secondRowNodes = [
			document.createTextNode("Thread: "),
			document.createElement("INPUT"),
			document.createElement("INPUT"),
		];
		secondRowNodes.forEach(
			function(node){
				threadRow.appendChild(node);
			});
		qrTable.appendChild(threadRow);

		secondRowNodes[1].setAttribute("ID", "threadInput");
		secondRowNodes[1].setAttribute("style", "width:44.9%");

		secondRowNodes[2].setAttribute("ID", "threadButton");
		secondRowNodes[2].setAttribute("type", "button");
		secondRowNodes[2].setAttribute("value", "Set Rebuild Queue");
		secondRowNodes[2].addEventListener("click", function(){
			////console.log("exce");
			getThread(secondRowNodes[1].value);
			//wait until done
			postID = setInterval(postRoutine, 1000);
			if(timeListen === undefined) timeListen = setInterval(timeListenerFunction, 1000);
		});

	};

	var len = 0;
	var i = 0;

	var postID = "";
	var postRoutine = function(){
		if(semaphore == 0){
			semaphore++;
			len = threadData[0].length;
			////console.log(len);
			fillID = setInterval(fillRoutine, 10);
			stopRoutine();
		}
	};
	var stopRoutine = function(){
		////console.log("Post Ends");
		clearInterval(postID);
	};

	var fillID  = "";
	var fillRoutine = function(){
		////console.log(semaphore_posts + " " + i);
		if(i >= len) {semaphore_posts  = 0 ; stopFillRoutine();}
		else if(semaphore_posts == 1){
			semaphore_posts--;
			createPost(threadData[0][i], threadData[1][i], threadData[2][i]);
			i++;
		}
	};

	var stopFillRoutine = function(){
		////console.log("Fill Ends");
		clearInterval(fillID);
	};

	var setPropperLinking = function(text){
		//console.log(text);
		var search_regex = RegExp(">>\\d+", "g");
		var result;
		var index_old = -1;
		var link_arr = Array();
		while((result = search_regex.exec(text)) != null){
			var end_index = search_regex.lastIndex;
			var post_no = result.toString().replace(/>/g, "");
			link_arr.push([post_no, end_index]);
		}
	//hunt down the text of what it linked to		
		var responding_text = Array();	
		URL  = "https://a.4cdn.org/" + board + "/thread/" + document.getElementById("threadInput").value + ".json";
			////console.log(URL);
			var xhr = new GM_xmlhttpRequest(({
				method: "GET",
				url: URL,
				responseType : "json",
				onload: function(data){
					data = data.response["posts"];
					////console.log(data);
					if(data == undefined){
						alert("Invalid Thread ID: " + threadNo + ".\n4chan Archive ");
						//draw from desu instead
					}
					else{
						link_arr.forEach(function(link_item){
							for(var data_entry = 0 ; data_entry < data.length ; data_entry++){
							//console.log(parseInt(link_item[0]));
							//console.log(parseInt(data[data_entry]["no"]));
								if(parseInt(link_item[0]) == parseInt(data[data_entry]["no"])){
									responding_text.push([ [post_no, end_index], data[data_entry]["com"].replace(/(&gt;&gt;|#p)\d+/g, ""), data[data_entry]["md5"]]);
									//console.log(responding_text);
									break;
								}
							}
							//console.log("---")
						});
						
						var current_url = window.location.href;
						var hash_index = current_url.lastIndexOf("#") != -1 ? current_url.lastIndexOf("#"):  window.location.href.length;
						var current_thread = window.location.href.substring(current_url.lastIndexOf("/")+1, hash_index);
						//open current thread to hunt down links
						URL  = "https://a.4cdn.org/" + board + "/thread/" + current_thread + ".json";
						////console.log(URL);
						var xhr = new GM_xmlhttpRequest(({
							method: "GET",
							url: URL,
							responseType : "json",
							onload: function(data){
								data = data.response["posts"];
								////console.log(data);
								if(data == undefined){
									alert("Invalid Thread ID: " + threadNo + ".\n4chan Archive ");
									//draw from desu instead
								}
								else{
									responding_text.forEach(function(response_item){
										for(var data_entry = 0 ; data_entry < data.length ; data_entry++){
											//console.log (response_item);
											//console.log(data[data_entry]);
											//console.log ("----");
											if((response_item[1] == data[data_entry]["com"].replace(/(&gt;&gt;|#p)\d+/g, "") || response_item[1] == null) 
												&& (response_item[2] == data[data_entry]["md5"] || response_item[2] == null)){
												var start_index = response_item[0][0].legth - response_item[0][1];
												text = text.substring(0, start_index) + ">>" + data[data_entry]["no"] + text.substring(response_item[0][1]);
														//console.log(text);
														break;
											}
										}
									});
													document.getElementById("qr").getElementsByTagName("TEXTAREA")[0].value = text;
												document.getElementById("add-post").click();
												semaphore_posts++;
								}
							}
						}));
					}
				}
			}));
	};
	
	//2) GET ARCHIVED THREAD
	var getThread = function(threadNo){
		threadData = [[], [], [], []];

		URL  = "https://a.4cdn.org/" + board + "/thread/" + threadNo + ".json";
		////console.log(URL);
		var xhr = new GM_xmlhttpRequest(({
			method: "GET",
			url: URL,
			responseType : "json",
			onload: function(data){
				data = data.response;
				////console.log(data);
				if(data == undefined){
					alert("Invalid Thread ID: " + threadNo + ".\n4chan Archive ");
					//draw from desu instead
				}
				else{
					var len = data["posts"].length;
					for(var i = 1 ; i < len ; i++){
						var comment = data["posts"][i]["com"];
						if(comment !== undefined)
							threadData[0].push(comment);
						else
							threadData[0].push(-1);

						var filename = "" + data["posts"][i]["tim"] + data["posts"][i]["ext"];
						if(filename !== undefined && filename.indexOf("undefined") == -1)
						   threadData[1].push("https://i.4cdn.org/" + board + "/" + filename);
						else  threadData[1].push(-1);

						threadData[2].push(data["posts"][i]["filename"]);

						threadData[3].push(data["posts"][i]["no"]);
					}
				}
				////console.log(threadData);
				semaphore--;
			}
		}));

	};
	//3) RIP POSTS AND IMAGES
	var createPost = function(text, imageURL, imageName){
		////console.log("url: " + imageURL);
		if(imageURL != -1){
			var xhr = new GM_xmlhttpRequest(({
				method: "GET",
				url: imageURL,
				responseType : "arraybuffer",
				onload: function(response)
				{
					var blob;
					var ext = ".jpg";
					if(imageURL.indexOf(".jpg") > -1){
						blob = new Blob([response.response], {type:"image/jpeg"});
						ext = ".jpg";
					}
					else if(imageURL.indexOf(".png") > -1){
						blob = new Blob([response.response], {type:"image/png"});
						ext = ".png";
					}
					else if(imageURL.indexOf(".gif") > -1){
						blob = new Blob([response.response], {type:"image/gif"});
						ext = ".gif";
					}
					else if(imageURL.indexOf(".webm") > -1){
						blob = new Blob([response.response], {type:"video/webm"});
						ext = ".webm";
					}

					var name = imageName + ext;

					////console.log("----------------");
					////console.log("Blob: "); ////console.log(blob);
					////console.log("MIME: " + blob.type);
					////console.log("Name: " + name);

					//SEND RESULTING RESPONSE TO 4CHANX FILES === QRSetFile
					var detail = {file:blob, name:name};
					if (typeof cloneInto === 'function') {
						detail  = cloneInto(detail , document.defaultView);
					}
					////console.log("Detail: ");////console.log(detail);
					document.dispatchEvent(new CustomEvent('QRSetFile', {bubbles:true, detail}));

					if(text !== "" && text !== undefined && text !== -1) {
			text = createPostComment(text);
			setPropperLinking(text);
					}
					else{
												document.getElementById("add-post").click();
												semaphore_posts++;
					}
				}
			}));
		}
		else{
			text = createPostComment(text);
			setPropperLinking(text);
		}
	};

	//4) CREATE POST QUEUE
	var createPostComment = function(text){
		////console.log("text-Before: " + text);

		text = text.replace(/<a href="\/[a-zA-Z]+\/" class="quotelink">/g, "");
		text = text.replace(/<span class="deadlink">/g, "");
		
		var quote_regex = /<a href="#p[0-9]+" class="quotelink">&gt;&gt;[0-9]+/g;
		var find = text.match(quote_regex);
		if(find){
			find.forEach(function(match){
				////console.log("---==");
				var index_start = text.indexOf(match);
				var match_len = match.length;
				var index_len = index_start + match_len;
				var first_quote = match.indexOf('"');
				var second_quote = match.indexOf('"', first_quote + 1);
				var post_no = match.substring(first_quote + 3, second_quote);

				match = ">>" + post_no;

				text = text.substr(0, index_start) + match +  text.substr(index_len);
			});
		}

		text = text.replace(/<span class="quote">/g, "");
		text = text.replace(/<br>/g, "\n");
		text = text.replace(/&#039;/g, "'");
		text = text.replace(/&gt;/g, ">");
		text = text.replace(/<\/a>/g, "");
		text = text.replace(/<wbr>/g, "");
		text = text.replace(/<\/span>/g, "");

		////console.log("text-After: " + text);
		//if(text.match(/^>>[0-9]+$/g))   document.getElementById("qr").getElementsByTagName("TEXTAREA")[0].value = text +  "\n" + Math.floor(Math.random() * 1000).toString(62)/*.replace(/[^a-z]+/g, '')*/;
		//else
		return text;
	};

	var checked = false;
	var timeListenerFunction = function(){
		var time = document.getElementById("qr-filename-container").nextSibling.value.replace(/[a-zA-Z]+/g, "");
		if(time  <= 5){
			checked = false;
			//console.log(time + "A");
		}
		else if(time > 5){
			checked = true;
			//console.log(time + "B");
		}
	};

	
document.addEventListener('QRPostSuccessful', function(e) {
			document.getElementById("dump-list").childNodes[1].click();
			setPropperLinking(document.getElementById("qr").getElementsByTagName("TEXTAREA")[0].value);
}, false);
