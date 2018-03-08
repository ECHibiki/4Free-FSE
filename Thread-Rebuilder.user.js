	// ==UserScript==
	// @name         Thread Rebuilder
	// @namespace    http://tampermonkey.net/
	// @version      2.3
	// @description  try to take over the world!
	// @author       ECHibiki /qa/
	// @match https://boards.4chan.org/*/thread/*
	// @match http://boards.4chan.org/*/thread/*
	// @grant         GM_xmlhttpRequest
	// @updateURL    https://github.com/ECHibiki/4chan-UserScripts/raw/master/Thread-Rebuilder.user.js
	// @downloadURL  https://github.com/ECHibiki/4chan-UserScripts/raw/master/Thread-Rebuilder.user.js
	// @run-at document-start
	// ==/UserScript==

	var board = "qa";
	var thread_data = [['Comment'], ['Image URLs'], ['Image Names'] ,['Post No.']];
	var semaphore = 1;
	var semaphore_posts = 1;
	var timeListen;

	var use_offsite_archive = false;
	var window_displayed = false;
	var in_sequence = false;
	var loaded = false;

	//1) CREATE INTERFACE
	//set listener to build interface in 4chanX
	//set listeners to build interface in 4chanX
document.addEventListener("4chanXInitFinished", function(e){
	document.addEventListener("QRDialogCreation", enhance4ChanX);

	rebuildWindow();
	rebuildButton();

	use_offsite_archive =  localStorage.getItem("ArchiveType") == 0 ? true : false;
	if(use_offsite_archive) document.getElementById("OffsiteArchive").checked = true;
	else document.getElementById("OnsiteArchive").checked = true;

	loaded = true;
}, false);

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
		//From https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API
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

//settings for time expiration on image hiding
function rebuildWindow(){
    var style = document.createElement('style');
    style.innerHTML = ".inputs{background-color:rgb(200,200,200);margin:5px 7px;width:100px;}";
    document.body.appendChild(style);

    var background_div = document.createElement("div");
    background_div.setAttribute("style", "border:solid 1px black;position:fixed;width:100%;height:100%;background-color:rgba(200,200,200,0.3);top:0;left:0;display:none; z-index:9");
    background_div.setAttribute("id", "rebuildBackground");
    document.body.appendChild(background_div);
    background_div.addEventListener("click", rebuildToggle);

    var window_div = document.createElement("div");
    window_div.setAttribute("style", "border:solid 1px black;position:fixed;width:400px;background-color:rgb(200,200,200);left:40%;top:20%;margin-bottom:0;  display:none; z-index:10");
    window_div.setAttribute("id", "rebuildWindow");

    var close_div = document.createElement("div");
    close_div.setAttribute("style", "border:solid 1px black;position:absolute;width:25px;height:25px;background-color:rgba(255,100,90,0.9); right:3px;top:3px; z-index:10");
    close_div.addEventListener("click", rebuildToggle);
    window_div.appendChild(close_div);

    var title_para = document.createElement("p");
    title_para.setAttribute("style", "margin-left:5px;margin-top:5px");
    var title_text = document.createTextNode("Rebuild Settings");
    title_para.appendChild(title_text);
    window_div.appendChild(title_para);

    var container_div = document.createElement("div");
    container_div.setAttribute("style","background-color:white;margin:0 0;padding:5px;");
    window_div.appendChild(container_div);

    var rebuild_label_local = document.createElement("label");
    var rebuild_text_local = document.createTextNode("Use 4chan Archives: ");
    rebuild_label_local.appendChild(rebuild_text_local);
    container_div.appendChild(rebuild_label_local);
    var rebuild_input_local = document.createElement("input");
	rebuild_input_local.setAttribute("type", "radio");
	rebuild_input_local.setAttribute("name", "ArchiveSettings");
    rebuild_input_local.setAttribute("id", "OnsiteArchive");
    container_div.appendChild(rebuild_input_local);
    container_div.appendChild(rebuild_input_local);
    container_div.appendChild(document.createElement("br"));

	var rebuild_label_offsite = document.createElement("label");
    var rebuild_text_offsite = document.createTextNode("Use Offsite Archives: ");
    rebuild_label_offsite.appendChild(rebuild_text_offsite);
    container_div.appendChild(rebuild_label_offsite);
    var rebuild_input_offsite = document.createElement("input");
	rebuild_input_offsite.setAttribute("type", "radio");
	rebuild_input_offsite.setAttribute("name", "ArchiveSettings");
    rebuild_input_offsite.setAttribute("id", "OffsiteArchive");
    container_div.appendChild(rebuild_input_offsite);
    container_div.appendChild(rebuild_input_offsite);
    container_div.appendChild(document.createElement("br"));

    var set_button = document.createElement("input");
    set_button.setAttribute("type", "button");
    set_button.setAttribute("id", "setTime");
    set_button.setAttribute("value", "Set Archive");
    set_button.addEventListener("click", function(){
        if (storageAvailable('localStorage')) {
			var radio_options = document.getElementsByName("ArchiveSettings");
			for (var radio_input = 0 ; radio_input < radio_options.length; radio_input++)
				if(radio_options[radio_input].checked){
					localStorage.setItem("ArchiveType", radio_input);
					if(radio_input == 0) use_offsite_archive = true;
				}
            rebuildToggle();
        }
    });
    container_div.appendChild(set_button);

    document.body.appendChild(window_div);

}

function rebuildToggle(){
    if(window_displayed){
        document.getElementById("rebuildWindow").style.display = "none";
        document.getElementById("rebuildBackground").style.display = "none";
        window_displayed = false;
    }
    else{
        document.getElementById("rebuildWindow").style.display = "inline-block";
        document.getElementById("rebuildBackground").style.display = "inline-block";
        window_displayed = true;
    }
}

function rebuildButton(){
    var rebuild_button = document.createElement("input");
    rebuild_button.setAttribute("Value", "Thread Rebuilder Settings");
    rebuild_button.setAttribute("type", "button");
    rebuild_button.setAttribute("style", "position:absolute;top:105px");
    rebuild_button.addEventListener("click", rebuildWindow);
    if(document.body === null){
        setTimeout(rebuildButton, 30);
    }
    else{
        document.body.appendChild(rebuild_button);
        rebuild_button.addEventListener("click", rebuildToggle);
    }
}

var enhance4ChanX = function(){
	var qr_window = document.getElementById("qr");

	if(document.getElementById("qrRebuilder") !== null) qr_window.removeChild(document.getElementById("qrRebuilder"));

	var thread_rebuilder_table = document.createElement("TABLE");
	thread_rebuilder_table.setAttribute("id", "qrRebuilder");
	thread_rebuilder_table.setAttribute("style", "text-align:center");
	qr_window.appendChild(thread_rebuilder_table);

	var instruction_row = document.createElement("TR");
	var top_row_nodes = [document.createElement("BR"),
					   document.createTextNode("Insert the thread number of the post to rebuild"),
					   document.createElement("BR"),
					   document.createTextNode("Must be in either the 4chan archives or archived.moe"),
					   document.createElement("BR"),
					  ];
	top_row_nodes.forEach(
		function(node){
			instruction_row.appendChild(node);
		});
	thread_rebuilder_table.appendChild(instruction_row);

	var thread_row = document.createElement("TR");
	var second_row_nodes = [
		document.createTextNode("Thread: "),
		document.createElement("INPUT"),
		document.createElement("INPUT"),
	];
	second_row_nodes.forEach(
		function(node){
			thread_row.appendChild(node);
		});
	thread_rebuilder_table.appendChild(thread_row);

	second_row_nodes[1].setAttribute("ID", "threadInput");
	second_row_nodes[1].setAttribute("style", "width:44.9%");

	second_row_nodes[2].setAttribute("ID", "threadButton");
	second_row_nodes[2].setAttribute("type", "button");
	second_row_nodes[2].setAttribute("value", "Set Rebuild Queue");

	second_row_nodes[2].addEventListener("click", function(){
		in_sequence = true;
		killAll();
		getThread(second_row_nodes[1].value);
		postID = setInterval(postRoutine, 1000);
		if(timeListen === undefined) timeListen = setInterval(timeListenerFunction, 1000);
	});
};

var thread_data_length = 0;
var posts_created = 0;
var postID = "";
var postRoutine = function(){
	if(semaphore == 0){
		semaphore++;
		thread_data_length = thread_data[0].length;
		fillID = setInterval(fillRoutine, 10);
		stopRoutine();
	}
};

var stopRoutine = function(){
	clearInterval(postID);
};

var fillID  = "";
var fillRoutine = function(){
	if(posts_created >= thread_data_length) {semaphore_posts  = 0 ; stopFillRoutine();}
	else if(semaphore_posts == 1){
		semaphore_posts--;
		createPost(thread_data[0][posts_created], thread_data[1][posts_created], thread_data[2][posts_created]);
		posts_created++;
	}
};

var stopFillRoutine = function(){
	clearInterval(fillID);
};

var setPropperLinking = function(text){
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
//Get the links inside of the origonal message to show text contents
	var responding_text = Array();
	if(use_offsite_archive)
		URL  = "https://www.archived.moe/_/api/chan/thread/?board=" + board + "&num=" + document.getElementById("threadInput").value;
	else
		URL  = "https://a.4cdn.org/" + board + "/thread/" + document.getElementById("threadInput").value + ".json";
		var xhr = new GM_xmlhttpRequest(({
			method: "GET",
			url: URL,
			responseType : "json",
			onload: function(data){
				if(use_offsite_archive)
					data = data.response["" + document.getElementById("threadInput").value]["posts"];
				else
					data = data.response["posts"];
				if(data == undefined){
					alert("Invalid Thread ID: " + document.getElementById("threadInput").value + ". ");
				}
				else{
					link_arr.forEach(function(link_item){
						for(var data_entry = 0 ; data_entry < data.length ; data_entry++){
							if(parseInt(link_item[0]) == parseInt(data[data_entry]["no"])){
								if(use_offsite_archive)
									responding_text.push([ [post_no, end_index], data[data_entry]["comment_processed"].replace(/(&gt;&gt;|https:\/\/www\.archived\.moe\/.*\/thread\/.*\/#)\d+/g, ""), link_item["media"]["safe_media_hash"] ]);
								else
									responding_text.push([ [post_no, end_index], data[data_entry]["com"].replace(/(&gt;&gt;|#p)\d+/g, ""), data[data_entry]["md5"] ]);
								break;
							}
						}
					});

					var current_url = window.location.href;
					var hash_index = current_url.lastIndexOf("#") != -1 ? current_url.lastIndexOf("#"):  window.location.href.length;
					var current_thread = window.location.href.substring(current_url.lastIndexOf("/")+1, hash_index);
					var current_url =  "https://a.4cdn.org/" + board + "/thread/" + current_thread + ".json";
					//open current thread to hunt down the text found in links
					var xhr = new GM_xmlhttpRequest(({
						method: "GET",
						url: current_url,
						responseType : "json",
						onload: function(data){
							data = data.response["posts"];
							if(data == undefined){
								alert("Invalid Thread ID: " + document.getElementById("threadInput").value + ". ");
							}
							else{
								responding_text.forEach(function(response_item){
									for(var data_entry = 0 ; data_entry < data.length ; data_entry++){
										if((response_item[1] == data[data_entry]["com"].replace(/(&gt;&gt;|#p)\d+/g, "") || response_item[1] == null)
											&& (response_item[2] == data[data_entry]["md5"] || response_item[2] == null)){
											var start_index = response_item[0][0].legth - response_item[0][1];
											text = text.substring(0, start_index) + ">>" + data[data_entry]["no"] + text.substring(response_item[0][1]);
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
	thread_data = [[], [], [], []];

	if(use_offsite_archive)
		URL  = "https://www.archived.moe/_/api/chan/thread/?board=" + board + "&num=" + document.getElementById("threadInput").value;
	else
		URL  = "https://a.4cdn.org/" + board + "/thread/" + document.getElementById("threadInput").value + ".json";
	var xhr = new GM_xmlhttpRequest(({
		method: "GET",
		url: URL,
		responseType : "json",
		onload: function(data){
			var starting_post = -1;
			if(use_offsite_archive){
				starting_post = 0;
				data = data.response["" + document.getElementById("threadInput").value];
			}
			else{
				starting_post = 1;
				data = data.response;
			}
			if(data == undefined){
				alert("Invalid Thread ID: " + threadNo + ".\n4chan Archive ");
			}
			else{
				if(use_offsite_archive) data["posts"] = Object.values(data["posts"]);
				var len = data["posts"].length;

				for(var post_number = starting_post ; post_number < len ; post_number++){
					var comment = undefined;
					if(use_offsite_archive)
						comment = data["posts"][post_number]["comment"];
					else
						comment = data["posts"][post_number]["com"];
					if(comment !== undefined && comment !== null)
						thread_data[0].push(comment);
					else
						thread_data[0].push(-1);

					var filename = undefined;
					if(use_offsite_archive)
						if(data["posts"][post_number]["media"] !== null)
							filename = "" + data["posts"][post_number]["media"]["media_filename"];
					else
						filename = "" + data["posts"][post_number]["tim"] + data["posts"][post_number]["ext"];

					if(filename !== undefined && filename !== null && filename.indexOf("undefined") == -1)
						if(use_offsite_archive)
							if(data["posts"][post_number]["media"] !== null)
								thread_data[1].push(data["posts"][post_number]["media"]["remote_media_link"]);
							else  thread_data[1].push(-1);
						else
							thread_data[1].push("https://i.4cdn.org/" + board + "/" + filename);
					else  thread_data[1].push(-1);

					if(use_offsite_archive)
						if(data["posts"][post_number]["media"] !== null)
							thread_data[2].push(data["posts"][post_number]["media"]["media_id"]);
					else
						thread_data[2].push(data["posts"][post_number]["filename"]);

					if(use_offsite_archive)
						thread_data[3].push(data["posts"][post_number]["num"]);
					else
						thread_data[3].push(data["posts"][post_number]["no"]);
				}
			}
			semaphore--;
		}
	}));
};
//3) RIP POSTS AND IMAGES
var createPost = function(text, imageURL, imageName){
	if(imageURL != -1){
		var response_type = "arraybuffer";
		if(use_offsite_archive) response_type = "text"
		var xhr = new GM_xmlhttpRequest(({
			method: "GET",
			url: imageURL,
			responseType : response_type,
			onload: function(response)
			{
				if(use_offsite_archive){
					var parser = new DOMParser();
					var content_attribute = parser.parseFromString(response.response, "text/html").getElementsByTagName("META")[0].getAttribute("content");
					var redirect_url = content_attribute.substring(content_attribute.indexOf("http"));
					var xhr = new GM_xmlhttpRequest(({method:"GET", url: redirect_url, responseType:"arraybuffer",
						onload:function(response){
							inputImage(response, text,  imageURL, imageName);
						}
					}));
				}
				else{
					inputImage(response, text, imageURL, imageName);
				}
			}
		}));
	}
	else{
		text = createPostComment(text);
		setPropperLinking(text);
	}
};

function inputImage(response, text, imageURL, imageName){
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

				//SEND RESULTING RESPONSE TO 4CHANX FILES === QRSetFile
				var detail = {file:blob, name:name};
				if (typeof cloneInto === 'function') {
					detail  = cloneInto(detail , document.defaultView);
				}

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

//4) CREATE POST QUEUE
var createPostComment = function(text){
	text = text.replace(/<a href="\/[a-zA-Z]+\/" class="quotelink">/g, "");
	text = text.replace(/<span class="deadlink">/g, "");

	var quote_regex = /<a href="#p[0-9]+" class="quotelink">&gt;&gt;[0-9]+/g;
	var find = text.match(quote_regex);
	if(find){
		find.forEach(function(match){
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

	return text;
};

var checked = false;
var timeListenerFunction = function(){
	var time = document.getElementById("qr-filename-container").nextSibling.value.replace(/[a-zA-Z]+/g, "");
	if(time  <= 5){
		checked = false;
	}
	else if(time > 5){
		checked = true;
	}
};

document.addEventListener('QRPostSuccessful', function(e) {
	if(in_sequence){
		document.getElementById("dump-list").childNodes[1].click();
		setPropperLinking(document.getElementById("qr").getElementsByTagName("TEXTAREA")[0].value);
	}
}, false);


function killAll(){
	thread_data_length = 0;
	posts_created = 0;
	stopRoutine();
	postID = "";
	semaphore = 1;
	semaphore_posts = 1;
	stopFillRoutine();
	fillID  = "";
	thread_data = [['Comment'], ['Image URLs'], ['Image Names'] ,['Post No.']];
	//CLEAR DUMP LIST
	var qr_dumplist = document.getElementById("dump-list").childNodes;
	var qr_dumplist_len = qr_dumplist.length;
	var current_preview = 0;
	while(qr_dumplist_len - current_preview > 1){
		qr_dumplist[0].firstChild.click();
		current_preview++;
	}
}

