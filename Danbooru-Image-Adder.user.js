// ==UserScript==
// @name         Danbooru-Image-Adder
// @namespace    http://tampermonkey.net/
// @version      1.12.1
// @description  Add images to posts
// @author       ECHibiki /qa/
// @match *://boards.4chan.org/*
// @grant         GM_xmlhttpRequest
// @updateURL    https://github.com/ECHibiki/4chan-UserScripts/raw/master/Danbooru-Image-Adder.user.js
// @downloadURL  https://github.com/ECHibiki/4chan-UserScripts/raw/master/Danbooru-Image-Adder.user.js
// @run-at document-end
// ==/UserScript==


function alert4ChanX(message, type){
    var detail = {type: type, content: message, lifetime: 10};
    if (typeof cloneInto === 'function') {
        detail = cloneInto(detail, document.defaultView);
    }
    var event = new CustomEvent('CreateNotification', {bubbles: true, detail: detail});
    document.dispatchEvent(event);
}

var number_of_posts = 0;
var page_number;
var json_page;
var json_tag;
var smallest_tag_size;

var top_page_max =  10000000;
var top_page = top_page_max;
var maximum_attempts = 20;
var number_of_attempts = maximum_attempts ;

var img_URL = "";
var send_URL = "";
var old_tags_before_change = "";

var timeout = false;
var failed_to_find_required_tags_state = false;
var tag_incorrect_state = false;
var time_max = 10;
var time = time_max;
var intervalFunction;
var timeout_functions = [];
var json_page_numbers_used = Array();
var previous_images = [];
var taggingFunction;


//set listeners to build interface in 4chanX
var loaded = false;
document.addEventListener("4chanXInitFinished", function(e){
	setTimeout(function(){
		var len = document.links.length;
		console.log("L:"+len);
		for(var i = 0 ; i < len ; i++){
			var class_name = document.links[i].parentNode.className ;
			if(class_name == "postNum desktop" || class_name == "qr-link-container"
			   || class_name == "brackets-wrap qr-link-container-bottom")
				document.links[i].addEventListener("click", enhance4ChanX);
		}
        loaded = true;
		//ENHANCE DUMP TABS (COVER, 482PX - 482PX)
		//DUMP LIST MAX-HEIGHT TO 490

            document.getElementById("fourchanx-css").textContent += ".qr-preview { height: 400px; width: 400px; left:8%;background-size: cover;}";
            document.getElementById("fourchanx-css").textContent += "#dump-list { min-height: 380px; width: 480px;}";
	}, 1000);
}, false);

	setTimeout(function(){
        if(!loaded){
            var len = document.links.length;
            console.log("L:"+len);
            for(var i = 0 ; i < len ; i++){
                var class_name = document.links[i].parentNode.className ;
                if(class_name == "postNum desktop" || class_name == "qr-link-container"
                   || class_name == "brackets-wrap qr-link-container-bottom")
                    document.links[i].addEventListener("click", enhance4ChanX);
            }
            loaded = true;
            //ENHANCE DUMP TABS (COVER, 482PX - 482PX)
            //DUMP LIST MAX-HEIGHT TO 490

            document.getElementById("fourchanx-css").textContent += ".qr-preview { height: 400px; width: 400px; left:8%;background-size: cover;}";
            document.getElementById("fourchanx-css").textContent += "#dump-list { min-height: 380px; width: 480px;}";
        }
	}, 3000);


//Alter 4chanX interface
var enhance4ChanX = function(){
    var qr_window = document.getElementById("qr");
    //check if elements already made upon opening a qr window
    if(document.getElementById("qrImages") !== null){
        qr_window.removeChild(document.getElementById("qrImages"));
        clearInterval(taggingFunction);
        //4chanx autodeletes images
        clearImage();
    }
    var imagedump_opener = document.getElementById("dump-button");
    if(imagedump_opener !== null){imagedump_opener.click();}
    else{return;}

    var imagedump_file_list = document.getElementById("dump-list");
    var filename_container = document.getElementById("qr-filename-container");

    //used for setting and unsetting high resolution thumbs for dump list.
    var dumplist_image = "";
    var previous_dumplist_image = "";
    var observer = new MutationObserver(function(mutate){
        dumplist_image = imagedump_file_list.firstChild.style.backgroundImage;
        if(dumplist_image !== previous_dumplist_image && img_URL !== ""){
            imagedump_file_list.firstChild.style.backgroundImage = "url(" + img_URL + ")";
            previous_dumplist_image = imagedump_file_list.firstChild.style.backgroundImage;
        }
        else if (img_URL == ""){
        }
    });
    observer.observe(imagedump_file_list , {attributes: true,subtree:true, chilimagedump_file_list: true, characterData: true });
    //make the image clear button clear images;
    document.getElementById("qr-filerm").addEventListener("click", clearImage);

    //image setting html elements.
    var qr_image_adder_table = document.createElement("TABLE");
    qr_image_adder_table.setAttribute("id", "qrImages");
    qr_image_adder_table.setAttribute("style", "text-align:center");
    qr_window.appendChild(qr_image_adder_table);
    //qr_window.appendChild(document.createElement("BR"));

    var instructions_row = document.createElement("TR");
    var top_row_nodes = [document.createElement("BR"),
                       document.createTextNode("Insert Tags to search from danbooru bellow."),
                       document.createElement("BR"),
                       document.createTextNode("Do Not Use \"order:\" tags"),
                       document.createElement("BR"),
                       document.createTextNode("Do Not Use \"rating:\" tags"),
                       document.createElement("BR"),
                       document.createTextNode("For more speed uncheck all boxes!"),
                      ];
    top_row_nodes.forEach(
        function(top_row_node){
            instructions_row.appendChild(top_row_node);
        });
    qr_image_adder_table.appendChild(instructions_row);

    var options_row = document.createElement("TR");
    options_row.setAttribute("ID", "or");
    options_row.setAttribute("style", "margin:5px;");
    qr_image_adder_table.appendChild(options_row);
    var checkbox_safe = document.createElement("INPUT");
    checkbox_safe.setAttribute("id", "safe");
    checkbox_safe.setAttribute("type", "checkbox");
    var checkbox_safe_text  = document.createTextNode("Safe");
    var checkbox_questionable= document.createElement("INPUT");
    checkbox_questionable.setAttribute("id", "questionable");
    checkbox_questionable.setAttribute("type", "checkbox");
    var checkbox_questionable_text= document.createTextNode("Questionable");
    var checkbox_explicit = document.createElement("INPUT");
    checkbox_explicit.setAttribute("id", "explicit");
    checkbox_explicit.setAttribute("type", "checkbox");
    var checkbox_explicit_text = document.createTextNode("Explicit");

    options_row.appendChild(checkbox_safe_text);
    options_row.appendChild(checkbox_safe);
    options_row.appendChild(checkbox_questionable_text);
    options_row.appendChild(checkbox_questionable);
    options_row.appendChild(checkbox_explicit_text);
    options_row.appendChild(checkbox_explicit);

    var image_tagging_row = document.createElement("TR");
    var second_row_nodes = [
        document.createTextNode("Tags: "),
        document.createElement("INPUT"),
        document.createElement("INPUT"),
        document.createElement("A"),
        document.createElement("INPUT"),
    ];
    second_row_nodes.forEach(
        function(node){
            image_tagging_row.appendChild(node);
        });
    qr_image_adder_table.appendChild(image_tagging_row);

    var auto_complete_row = document.createElement("TR");
    auto_complete_row.setAttribute("ID", "acr");
    auto_complete_row.setAttribute("style", "margin:5px;");
    qr_image_adder_table.appendChild(auto_complete_row);

    second_row_nodes[1].setAttribute("ID", "tags");
    second_row_nodes[1].setAttribute("style", "width:44.9%");
    second_row_nodes[3].setAttribute("ID", "timer");
    second_row_nodes[3].setAttribute("style", "width:20%;margin:0 5px");
    second_row_nodes[4].setAttribute("ID", "urlContainer");
    second_row_nodes[4].setAttribute("style", "max-width:15.5%;min-width:15.5%;margin:0 5px");
    //second_row_nodes[4].setAttribute("disabled", "");

    var tag_input_node = second_row_nodes[1];

    second_row_nodes[2].setAttribute("ID", "imageButton");
    second_row_nodes[2].setAttribute("type", "button");
    second_row_nodes[2].setAttribute("value", "Set Image");

    //event listener logic
    second_row_nodes[2].addEventListener("click", buttonClickFunction);

	//textarea expansion;
	qr_window.getElementsByTagName("TEXTAREA")[0].style.width = "110%";
    //ping every 0.5s for changes
    taggingFunction = setInterval(
        function(){setTagInterface(tag_input_node, auto_complete_row, second_row_nodes);},
        500);

};

//on setimage click clear flags, timers and start another search
function buttonClickFunction(){
	json_page_numbers_used = Array();
	//reset a failed_to_find_required_tags boolean
	primed_for_fail = false;
	for(var i = 0 ; i < timeout_functions.length; i++){
		clearInterval(timeout_functions[i]);
	}
	tag_incorrect_state = false;
	timeout = false;
	//freeze interface to prevent mid opperation changes
	document.getElementById("tags").setAttribute("disabled", 1);
	document.getElementById("imageButton").setAttribute("disabled", 1);
	time = time_max;
	timeout_functions.push(setInterval(counterFunction, 1000));
	//start the search
	setImage();
};

//remove the high quallity image from the dump list
function clearImage(){
    var imagedump_file_list = document.getElementById("dump-list");
    imagedump_file_list.firstChild.style.backgroundImage = "url()";//trigger mutation event
    img_URL = ""; //get mutation to set to dead
}

var setTagInterface =  function(tag_input_node, auto_complete_row, second_row_nodes){
    tags = tag_input_node.value;
    if(old_tags_before_change !== tags){
		previous_images = [];

        var tag_carat_position = tag_input_node.selectionStart - 1;
        var closest_tag =  (function(){
            var current_chararcter = tags.charAt(tag_carat_position);
            var i = 0;
            right_most = tag_carat_position;
            while(current_chararcter != " " && current_chararcter != "" && current_chararcter !== undefined){
                i++;
                current_chararcter = tags.charAt(tag_carat_position + i);
                if(current_chararcter != " " && current_chararcter != "") right_most = tag_carat_position + i;
            }
            right_most += 1;
            current_chararcter = tags.charAt(tag_carat_position);
            i = 0;
            leftMost = tag_carat_position;
            while(current_chararcter != " " && current_chararcter != ""  && current_chararcter !== undefined){
                i++;
                current_chararcter = tags.charAt(tag_carat_position - i);
                if(current_chararcter != " " && current_chararcter != "") leftMost = tag_carat_position - i;
            }
            return tags.substring(leftMost, right_most);
        })();
        var xhr = new GM_xmlhttpRequest(({
            method: "GET",
            url: "https://danbooru.donmai.us/tags.json?search[name_matches]=" + closest_tag + "*&search[order]=count",
            responseType : "json",
            onload: function(data){
                data = data.response;
                var tagArray = tags.split(" ");
                while (auto_complete_row.hasChildNodes()) {
                    auto_complete_row.removeChild(auto_complete_row.lastChild);
                }
                var qr_width = document.getElementById("qr").offsetWidth;
				//console.log(qr_width);
				var tag_table = document.createElement("TABLE");
				tag_table.setAttribute("style", "border:1px solid black;margin-top:5px");
				var tag_row = document.createElement("TR");
                for (var i = 0 ; i < 5 ; i++){
                    var a  = document.createElement("A");
                    var tagText = data["" + i];
                    if(tagText == "" || tagText === undefined) break;
                    tagText = tagText["name"];

                    var a_txt  = document.createTextNode(data[i]["name"]);
					var tag_data = document.createElement("TD");
					tag_data.setAttribute("style", "padding:5px;font-size:15px;font-weight:bold;border:1px solid black;");
					a.appendChild(a_txt);
					tag_data.appendChild(a);
					tag_row.appendChild(tag_data);
					tag_table.appendChild(tag_row);
					auto_complete_row.appendChild(tag_table);

                    if(auto_complete_row.offsetWidth > qr_width - 10){
						tag_row.removeChild(tag_data);
						tag_table = document.createElement("TABLE");
						tag_row = document.createElement("TR");

						tag_row.appendChild(tag_data);
						tag_table.appendChild(tag_row);
						tag_table.setAttribute("style", "border:1px solid black;");
						auto_complete_row.appendChild(tag_table);

					}
                    a.addEventListener("click", function(evt){
                        tagArray[tagArray.indexOf(closest_tag)] = this.textContent;
                        second_row_nodes[1].value = tagArray.join(" ");
                    });
                }
            }}));
    }
    old_tags_before_change =  tag_input_node.value;
};

//a series of calls on other functions that leads to the image being searched for
var setImage = function(){
    //Set image tags.
    var tags = document.getElementById("tags").value.trim();

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
            verifyTags(data, tags);
			if(failed_to_find_required_tags_state) return;

            //set the end
            var end_URL = ratingURL(tags, json_tag);

            var URL = setPostAndPage(end_URL, tags);
            send_URL = URL;
            //final check, sends final request after function or calls this function again
            getJSON(URL, checkPageFromDanbooru, tags);
        }}));
};
//make 4chanX alerts on issues, and account for error cases.
function verifyTags(data, tags){
    data = data.response;
	//if data is blank, use a no-tag approach
    if(tags.length == 1 && tags[0] == "") json_tag = [{"name":""}];
    else json_tag = data;
	failed_to_find_required_tags_state = false;
	//if data has a null or undefined case, return an error
    if(data.length == 0){
        alert4ChanX("All tags incorrect", "error");
		failed_to_find_required_tags_state = true;
		document.getElementById("timer").textContent = "";
		document.getElementById("tags").removeAttribute("disabled");
		document.getElementById("imageButton").removeAttribute("disabled");
        return;
    }
	else if(data.length != tags.length && !tag_incorrect_state){
		tag_incorrect_state = true;
		if(document.getElementById("tags").value.trim() == "") alert4ChanX("No Tags", "info");
		else alert4ChanX("One Tag Incorrect", "warning");
	}
    //tag size. Smallest tag is placed at bottom of JSON
    smallest_tag_size = parseInt(data[data.length-1]["post_count"]);
}

//evaluate the rating restrictions to account for danbooru's tagging limitations
var ratingURL = function(tags, data){
    var URL = "";
	//evaluate the 3! possible permutations
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
            URL = "&utf8=%E2%9C%93&tags=" + "-rating%3Aquestionable" + "+" + data[data.length-1]["name"];
        }
        else{
            URL = "&utf8=%E2%9C%93&tags=" + "rating%3Asafe" + "+" + data[data.length-1]["name"];
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

//set where to search
var setPostAndPage = function(end_URL, tags){
	//posts
	if(number_of_posts > 0)
    number_of_posts = 0;
   //page
	if(top_page != top_page_max) smallest_tag_size = top_page * 20;
    if(smallest_tag_size == 0) smallest_tag_size = 100;
	do{
		escape_cond = true;
		page_number = ((Math.floor(Math.random() * 10000)) % Math.ceil(smallest_tag_size / 20)) % 1000;    //1000 is max page search limit
		json_page_numbers_used.forEach(function(page){
			if(page == 0){
				primed_for_fail = true; // no more pages to search and looped once
				escape_cond = true;
				return;
			}
			else if(page == page_number){
				escape_cond = false;
				return;
			}
		});
	} while(!escape_cond);
	json_page_numbers_used.push(page_number);

    var URL = "https://danbooru.donmai.us/posts.json?page=" + page_number + end_URL;
    return URL;
};

//check if valid url location
var primed_for_fail = false;
var checkPageFromDanbooru = function(err, data, tags){
	if (err != null) {
		console.log('Something went wrong: ' + err);
		alert4ChanX("Danbooru Server Did Not Perform request -- Error: "  + err, "error");
		reset_search_timer_fields();
		page_number = 0;
	}
	else {
		do{
			var duplicate = false;
			//check for repeating images found
			previous_images.forEach(function(item){
				if(item[0] == page_number && item[1] == number_of_posts){
					duplicate = true;
				}
				number_of_posts++;
			});
		}while(duplicate == false && previous_images < number_of_posts);

		if(primed_for_fail){
			alert4ChanX("No Results: All found for tags \"" + document.getElementById("tags").value + "\"", "error");
			reset_search_timer_fields();
			return;
		}
		//redo
		else if((data.length < number_of_posts+1) && number_of_attempts > 0) {
			if(top_page > page_number){
				top_page = page_number + number_of_posts / 20;
			}
			number_of_attempts--;
			document.getElementById("timer").textContent = number_of_attempts + "|" + time;
			setImage();
		}
		//process page
		else if (number_of_attempts > 0){
			//ALL PARAMETERS WILL BE RESET INSIDE JSON
			document.getElementById("timer").textContent =  number_of_attempts + "|" + time;
			getJSON(send_URL, setImageFromDanbooru, tags);
		}
		else{
			alert4ChanX("Not found", "error");
			reset_search_timer_fields();
			return;
		}
	}
};

function reset_search_timer_fields(){
	top_page = top_page_max;
	number_of_attempts = maximum_attempts;
	document.getElementById("timer").textContent = "";
	document.getElementById("tags").removeAttribute("disabled");
	document.getElementById("imageButton").removeAttribute("disabled");
}

//finally draw from the JSON page to generate and place the post into the 4chanX dumplist
var setImageFromDanbooru = function(err, data, tags){
    if (err != null) {
        console.log('Something went wrong: ' + err);
        alert4ChanX("Danbooru Server Did Not Perform request -- Error: "  + err, "error");
		reset_search_timer_fields();
    }
    else {
		json_page = data;
		var image_found = false;
		for (number_of_posts = number_of_posts; number_of_posts < 20 ; number_of_posts++){
			if(timeout){
				//Case1: Took too long to scan the page.
				//Result: Kills search
				alert4ChanX("timeout after " + time +" seconds", "error");
				clearInterval(counterFunction);
				reset_search_timer_fields();
				return;
			}
			else if(json_page["" + number_of_posts] == undefined){
				//Case2: reaches an undefined page.
				//Result: Switches to a new page
				top_page = page_number;
				number_of_attempts--;
				setImage();
				return;
			}

			//set the page to search
			var end_URL = json_page["" + number_of_posts].file_url;
			var URL = "https://danbooru.donmai.us" + end_URL;
			if(RegExp("(raikou|hijiribe)\d*\.").test(end_URL))
				URL = end_URL;

			//place url in visible box
			urlContainterFunction(URL);

			/*


:{id: 3038118, created_at: "2018-03-02T15:27:56.469-05:00", uploader_id: 49091, score: 6,…}
approver_id:null
bit_flags:0
children_ids:null
created_at:"2018-03-02T15:27:56.469-05:00"
down_score:0
fav_count:10
fav_string:"fav:553974 fav:467363 fav:455311 fav:490034 fav:505064 fav:482030 fav:351935 fav:66907 fav:467355 fav:519151"
file_ext:"jpg"
file_size:30492
file_url:"/data/__miyuki_kantai_collection_drawn_by_kumadano__7a12a196cc1aa9f794bca81a2a14bb81.jpg"
has_active_children:false
has_children:false
has_large:false
has_visible_children:false
id:3038118
image_height:800
image_width:450
is_banned:false
is_deleted:false
is_flagged:false
is_note_locked:false
is_pending:false
is_rating_locked:false
is_status_locked:false
large_file_url:"/data/__miyuki_kantai_collection_drawn_by_kumadano__7a12a196cc1aa9f794bca81a2a14bb81.jpg"
last_comment_bumped_at:null
last_commented_at:null
last_noted_at:null
md5:"7a12a196cc1aa9f794bca81a2a14bb81"
parent_id:null
pixiv_id:null
pool_string:""
preview_file_url:"/data/preview/7a12a196cc1aa9f794bca81a2a14bb81.jpg"
rating:"s"
score:6
source:"https://twitter.com/kumadano/status/969629578137251840"
tag_count:28
tag_count_artist:1
tag_count_character:1
tag_count_copyright:1
tag_count_general:24
tag_count_meta:1
tag_string:"1girl black_legwear blue_sailor_collar blue_skirt brown_eyes brown_hair commentary_request full_body grin kantai_collection kumadano miyuki_(kantai_collection) pleated_skirt ribbon sailor_collar school_uniform serafuku short_hair short_sleeves simple_background skirt smile socks solo standing wavy_hair white_background wrists_extended"
tag_string_artist:"kumadano"
tag_string_character:"miyuki_(kantai_collection)"
tag_string_copyright:"kantai_collection"
tag_string_general:"1girl black_legwear blue_sailor_collar blue_skirt brown_eyes brown_hair full_body grin pleated_skirt ribbon sailor_collar school_uniform serafuku short_hair short_sleeves simple_background skirt smile socks solo standing wavy_hair white_background wrists_extended"
tag_string_meta:"commentary_request"
up_score:6
updated_at:"2018-03-03T09:09:32.357-05:00"
uploader_id:49091
uploader_name:"---"

			*/

			var failed_to_find_required_tags = false;
			if(end_URL === undefined ||
			   end_URL.indexOf(".mp4") > -1 || end_URL.indexOf(".webm") > -1 || end_URL.indexOf(".swf") > -1 || end_URL.indexOf(".zip") > -1){
				continue;
			}
			else{
				tags.forEach(function(tag){
					//if tag contains an order then whatever
					if(tag.indexOf("order:") > -1);
					//if it contains a raiting, check the rating character at the seventh index
					else if(tag.indexOf("rating:") > -1){
						if(tag.charAt(7) !== json_page["" + number_of_posts]["rating"]){
							failed_to_find_required_tags = true;
						}
					}
					//otherwise check if the tagstring contains the tags
					else if(json_page["" + number_of_posts]["tag_string"].indexOf(tag) == -1){
						failed_to_find_required_tags = true;
					}
				});
			}
			if(failed_to_find_required_tags){
				continue;
			}
			else{
				if(json_page["" + number_of_posts].file_size >= 4000000){
					var end_URL = json_page["" + number_of_posts].large_file_url;
					var URL = "https://danbooru.donmai.us" + end_URL;
					if(RegExp("(raikou|hijiribe)\d*\.").test(end_URL))
						URL = end_URL;

				}
				document.getElementById("timer").textContent = "...";
				img_URL = URL;
				var xhr = new GM_xmlhttpRequest(({
					method: "GET",
					url: URL,
					responseType : "arraybuffer",
					onload: function(response)
					{
                        //is it a non existent image?
                        if(response.response.byteLength <= 387){
                            alert4ChanX("Image Does Not Exist on Danbooru(404 error)", "error");
                        }
						reset_search_timer_fields();
						clearInterval(intervalFunction);
						time = time_max;
						var counter = document.getElementById("timer");
						while(counter.hasChildNodes())
							document.getElementById("timer").removeChild(document.getElementById("timer").lastChild);

						var blob;
						if(end_URL.indexOf(".jpg") > -1)
							blob = new Blob([response.response], {type:"image/jpeg"});
						else if(end_URL.indexOf(".png") > -1)
							blob = new Blob([response.response], {type:"image/png"});
						else if(end_URL.indexOf(".gif") > -1)
							blob = new Blob([response.response], {type:"image/gif"});


						var name = end_URL.replace(/(data|cached)/g, "");
						name = name.replace(/\//g, "");

						//SEND RESULTING RESPONSE TO 4CHANX FILES === QRSetFile
						var detail = {file:blob, name:name};
						if (typeof cloneInto === 'function') {
							detail  = cloneInto(detail , document.defaultView);
						}
						document.getElementById("dump-list").firstChild.click();
						document.dispatchEvent(new CustomEvent('QRSetFile', {bubbles:true, detail}));

					}
				}));
												//end function;
				image_found = true;
								//SET PAGE&POST AS FOUND
				previous_images.push([page_number, number_of_posts]);
				number_of_posts = 9001;
			}
		}
		if(!image_found){
			top_page = page_number;
			number_of_attempts--;
			setImage();
		}
    }
};

var urlContainterFunction = function(url){
    var url_box = document.getElementById("urlContainer");
    url_box.value = url;
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
