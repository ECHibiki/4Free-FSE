declare var GM_xmlhttpRequest:any;
declare var cloneInto:any;

class DanbooruImageAdder extends FeatureInterface{

	help_icon_container:Element;
	
	failed_to_find_required_tags_state:boolean;
	tool_tip_visible:boolean;
	
	timeout_functions:any[] = [];
	
	img_URL:string = "";
	send_URL:string
	
	post_number:number = 0;
	page_number:number = 0;
	json_page_numbers_used:number[] = [];
	primed_for_fail:boolean;
	tag_incorrect_state:boolean;
	
	json_tag:string;
	previous_images:number[][] = [];
	json_numbers_used:number[] = [];
	previous_page:number = 9001;
	
	json_page:any;
	top_page:number;
	top_page_max:number;
	smallest_tag_size:number;
	
	subdomain_regex:RegExp = new RegExp("http(|s)://");
	
	number_of_attempts:number;
	maximum_attempts:number = 20;
	
	time_max:number = 10;
	time:number = 10;
	timeout:boolean;
	
	old_tags_before_change:string;
	
	constructor(){
		super();
		this.init();
	}
	init():void{
		this.time = this.time_max;
		this.number_of_attempts = this.maximum_attempts;
		
		document.addEventListener("QRDialogCreation", (evt) => {
			this.enhance4ChanX_HTML()
			this.enhanced4ChanXListeners();
		});			
	}

	enhance4ChanX_HTML():void{
		var qr_window:Element = document.getElementById("qr");

/*Should I auto open things for the user?*/		
		// var imagedump_opener:any = document.getElementById("dump-button");
		// if(imagedump_opener !== null){imagedump_opener.click();}
		// else{return;}

		//image setting html elements.
		var qr_image_adder_table:Element = document.createElement("TABLE");
		qr_image_adder_table.setAttribute("id", "qrImages");
		qr_image_adder_table.setAttribute("style", "text-align:center");
		qr_window.appendChild(qr_image_adder_table);

		var options_row:Element = document.createElement("TR");
		options_row.setAttribute("ID", "or");
		options_row.setAttribute("style", "margin:5px;");
		qr_image_adder_table.appendChild(options_row);
		var checkbox_safe:Element = document.createElement("INPUT");
		checkbox_safe.setAttribute("id", "safe");
		checkbox_safe.setAttribute("type", "checkbox");
		(<HTMLInputElement>checkbox_safe).checked = true;
		var checkbox_safe_text:Text  = document.createTextNode("Safe");
		var checkbox_questionable:Element = document.createElement("INPUT");
		checkbox_questionable.setAttribute("id", "questionable");
		checkbox_questionable.setAttribute("type", "checkbox");
		var checkbox_questionable_text:Text = document.createTextNode("Questionable");
		var checkbox_explicit:Element = document.createElement("INPUT");
		checkbox_explicit.setAttribute("id", "explicit");
		checkbox_explicit.setAttribute("type", "checkbox");
		var checkbox_explicit_text:Text = document.createTextNode("Explicit");

		options_row.appendChild(checkbox_safe_text);
		options_row.appendChild(checkbox_safe);
		options_row.appendChild(checkbox_questionable_text);
		options_row.appendChild(checkbox_questionable);
		options_row.appendChild(checkbox_explicit_text);
		options_row.appendChild(checkbox_explicit);

		var image_tagging_row:Element = document.createElement("TR");
		
		this.help_icon_container = document.createElement("A");
		(<HTMLLinkElement>this.help_icon_container).href = "javascript:void(0)";
		(<HTMLInputElement>this.help_icon_container).title = "Click to View Help!";
		var help_icon:any = document.createElement("IMG");
		help_icon.setAttribute("class", "help_icon");
		(<HTMLImageElement>help_icon).src = Constants.HELP_ICON_SOURCE;

		this.help_icon_container.appendChild(help_icon);
		image_tagging_row.appendChild(this.help_icon_container);

		var tooltip_div:Element = document.createElement("DIV");
		(<HTMLInputElement>tooltip_div).innerHTML = "Insert Tags to search from danbooru in the text box to the side.<br/>The URL for the image will be bellow. Some browsers such as chrome allow you to select this text<br/>Do Not Use \"order:\" tags<br/>Do Not Use \"rating:\" tags<br/>For more speed uncheck all boxes!<hr/>Submit bugs to <a href='https://github.com/ECHibiki/4chan-UserScripts'>my Github</a>";
		(tooltip_div).setAttribute("class", "tooltip-4F");
		(tooltip_div).setAttribute("id", "tooltipIA");

		qr_window.appendChild(tooltip_div);

		var second_row_nodes:any[] = [
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

		var auto_complete_row:Element = document.createElement("TR");
		auto_complete_row.setAttribute("ID", "auto-complete-row");
		auto_complete_row.setAttribute("style", "margin:5px;");
		qr_image_adder_table.appendChild(auto_complete_row);

		<HTMLElement>second_row_nodes[1].setAttribute("ID", "tag_input");
				var option_text_size = 18;
		<HTMLElement>second_row_nodes[1].setAttribute("style", "width:44.9%;"+"font-size:" + option_text_size + "px");
		<HTMLElement>second_row_nodes[3].setAttribute("ID", "timer");
		<HTMLElement>second_row_nodes[3].setAttribute("style", "width:20%;margin:0 5px");
		<HTMLElement>second_row_nodes[4].setAttribute("ID", "urlContainer");
		<HTMLElement>second_row_nodes[4].setAttribute("style", "width:75%;margin:5px -25px");
		<HTMLElement>second_row_nodes[4].setAttribute("disabled", "");


		second_row_nodes[2].setAttribute("ID", "imageButton");
		second_row_nodes[2].setAttribute("type", "button");
		second_row_nodes[2].setAttribute("value", "Set Image");

		//textarea expansion;
		(<HTMLInputElement>qr_window.getElementsByTagName("TEXTAREA")[0]).style.width = "110%";
		qr_window.appendChild(document.createElement("hr"));
	}
	
	enhanced4ChanXListeners():void{
		this.highQualityImages();
		
		document.getElementById("qr-filerm").addEventListener("click", (evt) => this.clearImage());
		var qr_reference = document.getElementById("qr")
		var tooltip_div  = document.getElementById("tooltipIA");
		this.help_icon_container.addEventListener("click", (evt) => {
			if(this.tool_tip_visible)
				tooltip_div.setAttribute("style", "z-index:9;padding:5px;border:1px solid black;background-color:white;word-wrap:break-word;display:none;position:absolute;");
			else
				tooltip_div.setAttribute("style", "z-index:9;padding:5px;border:1px solid black;background-color:white;word-wrap:break-word;display:block;position:absolute;"
					+ "left:" +  ((<MouseEvent>evt).clientX - (<DOMRect>qr_reference.getBoundingClientRect()).x) +
					"px;top:" +  ((<MouseEvent>evt).clientY - (<DOMRect>qr_reference.getBoundingClientRect()).y ) + "px;");
			this.tool_tip_visible = !this.tool_tip_visible;
		});
		var tag_input = document.getElementById("tag_input");
		tag_input.addEventListener("input", (evt) =>{
			this.setTagInterface(tag_input, document.getElementById("auto-complete-row"));
		});
		
		 document.getElementById("imageButton").addEventListener("click", (evt) => this.activate());
	}	
	
	highQualityImages():void{
		var imagedump_file_list:Element = document.getElementById("dump-list");
		//used for setting and unsetting high resolution thumbs for dump list.
		var dumplist_image:string = "";
		var previous_dumplist_image:string = "";
		var observer:MutationObserver = new MutationObserver((mutate) => {
			dumplist_image = (<HTMLInputElement>imagedump_file_list.firstChild).style.backgroundImage;
			if(dumplist_image !== previous_dumplist_image && this.img_URL !== ""){
				(<HTMLInputElement>imagedump_file_list.firstChild).style.backgroundImage = "url(" + this.img_URL + ")";
				previous_dumplist_image = (<HTMLInputElement>imagedump_file_list.firstChild).style.backgroundImage;
			}
			else if (this.img_URL == ""){}
		});
				
		observer.observe(imagedump_file_list , {attributes: true,subtree:true, childList: true, characterData: true });
	}
		
	activate():void{
		//on setimage click clear flags, timers and start another search
		this.json_page_numbers_used = Array();
		this.previous_page = 9001;
		//reset a failed_to_find_required_tags boolean
		this.primed_for_fail = false;
		for(var i = 0 ; i < this.timeout_functions.length; i++){
			clearInterval(this.timeout_functions[i]);
		}
		this.tag_incorrect_state = false;
		this.timeout = false;
		//freeze interface to prevent mid opperation changes
		document.getElementById("tag_input").setAttribute("disabled", "1");
		document.getElementById("imageButton").setAttribute("disabled", "1");
		this.time = this.time_max;
		this.timeout_functions.push(setInterval(() => this.counterFunction(), 1000));
		//start the search
		this.setImage(this);	
	}
	
	//remove the high quallity image from the dump list
	 clearImage():void{
		var imagedump_file_list = document.getElementById("dump-list");
		(<HTMLInputElement>imagedump_file_list.firstChild).style.backgroundImage = "url()";//trigger mutation event
		this.img_URL = ""; //get mutation to set to dead
	}

	setTagInterface(tag_input_node:Element, auto_complete_row:Element):void{
		var tags = (<HTMLInputElement>tag_input_node).value;
		
		if(this.old_tags_before_change !== tags){
			this.previous_images = [];

			var tag_carat_position = (<HTMLInputElement>tag_input_node).selectionStart - 1;
			var closest_tag =  (function(){
				var current_chararcter = tags.charAt(tag_carat_position);
				var i = 0;
				var right_most = tag_carat_position;
				while(current_chararcter != " " && current_chararcter != "" && current_chararcter !== undefined){
					i++;
					current_chararcter = tags.charAt(tag_carat_position + i);
					if(current_chararcter != " " && current_chararcter != "") right_most = tag_carat_position + i;
				}
				right_most += 1;
				current_chararcter = tags.charAt(tag_carat_position);
				i = 0;
				var leftMost:number = tag_carat_position;
				while(current_chararcter != " " && current_chararcter != ""  && current_chararcter !== undefined){
					i++;
					current_chararcter = tags.charAt(tag_carat_position - i);
					if(current_chararcter != " " && current_chararcter != "") leftMost = tag_carat_position - i;
				}
				return tags.substring(leftMost, right_most);
			})();
				
			var xhr:any = new GM_xmlhttpRequest(({
				method: "GET",
				url: "https://danbooru.donmai.us/tags.json?search[name_matches]=" + closest_tag + "*&search[order]=count",
				responseType : "json",
				onload: (data) => {
					data = data.response;
					var tagArray = tags.split(" ");
					while (auto_complete_row.hasChildNodes()) {
						auto_complete_row.removeChild(auto_complete_row.lastChild);
					}
					var qr_width = document.getElementById("qr").offsetWidth;

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

						if(tag_table.offsetWidth > qr_width - 10){
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
							(<HTMLInputElement>document.getElementById("tag_input")).value = tagArray.join(" ");
						});
					}
				}}));
		}
		this.old_tags_before_change =  (<HTMLInputElement>tag_input_node).value;
	}
	
//a series of calls on other functions that leads to the image being searched for
	setImage(this_):void{
		//Set image tags.
		var tags:string = (<HTMLInputElement>document.getElementById("tag_input")).value.trim();

		if(tags.indexOf(":") > -1) {
			Generics.alert4ChanX("Character ':' not used for functional purpose", "warning");
		}
		var tags_arr:string[] = tags.split(" ");

		var xhr_image_load = new GM_xmlhttpRequest(({
			method: "GET",
			//returns a list of all tags and their properties
			url: "https://danbooru.donmai.us/tags.json?search[name]=" + tags_arr.join() + "&search[order]=count",
			responseType : "json",
			onload: function(data)
			{
				this_.json_tag = this_.verifyTags(data, tags_arr);
				if(this_.failed_to_find_required_tags_state) return;

				//set the end
				var end_URL = this_.ratingURL(this_.json_tag);
				
				var URL = this_.setPostAndPage(end_URL);
				this_.send_URL = URL;
				//final check, sends final request after function or calls this function again
				Generics.getJSON(URL, (err, data, tags, _this_) => this_.checkPageFromDanbooru(err, data, tags, _this_), tags_arr, this_);
			}
		}));
	}

		//make 4chanX alerts on issues, and account for error cases.
	verifyTags(data:any, tags:string[]):string{
		data = data.response;
		this.json_tag = data;
		this.failed_to_find_required_tags_state = false;
		//if data has a null or undefined case, return an error
		if(data.length == 0){
			Generics.alert4ChanX("All tags incorrect", "error",10);
			this.failed_to_find_required_tags_state = true;
			document.getElementById("timer").textContent = "";
			document.getElementById("tag_input").removeAttribute("disabled");
			document.getElementById("imageButton").removeAttribute("disabled");
			return this.json_tag;
		}
		else if(data.length != tags.length && !this.tag_incorrect_state){
			this.tag_incorrect_state = true;
			if((<HTMLInputElement>document.getElementById("tag_input")).value.trim() == "") Generics.alert4ChanX("No Tags", "info", 2);
			else Generics.alert4ChanX("One Tag Incorrect", "warning");
		}
		//tag size. Smallest tag is placed at bottom of JSON
		this.smallest_tag_size = parseInt(data[data.length-1]["post_count"]);
		return this.json_tag;
	}

//evaluate the rating restrictions to account for danbooru's tagging limitations
	ratingURL(tags):string{
		var URL = "";
		//evaluate the 3! possible permutations
		if((<HTMLInputElement>document.getElementById("safe")).checked){
			if((<HTMLInputElement>document.getElementById("questionable")).checked){
				if((<HTMLInputElement>document.getElementById("explicit")).checked){
					if(tags.length > 1)  URL =  "&utf8=%E2%9C%93&tags=" + tags[tags.length-2]["name"] + "+" + tags[tags.length-1]["name"];
					else  URL =  "&utf8=%E2%9C%93&tags=" + tags[tags.length-1]["name"];
				}
				else{
					URL =  "&utf8=%E2%9C%93&tags=" + "-rating%3Aexplicit" + "+" + tags[tags.length-1]["name"];
				}
			}
			else if((<HTMLInputElement>document.getElementById("explicit")).checked){
				URL = "&utf8=%E2%9C%93&tags=" + "-rating%3Aquestionable" + "+" + tags[tags.length-1]["name"];
			}
			else{
				URL = "&utf8=%E2%9C%93&tags=" + "rating%3Asafe" + "+" + tags[tags.length-1]["name"];
			}
		}
		else if((<HTMLInputElement>document.getElementById("questionable")).checked){
			if((<HTMLInputElement>document.getElementById("explicit")).checked){
				URL =  "&utf8=%E2%9C%93&tags=" + "-rating%3Asafe" + "+" + tags[tags.length-1]["name"];
			}
			else{
				URL =  "&utf8=%E2%9C%93&tags=" + "rating%3Aquestionable" + "+" + tags[tags.length-1]["name"];
			}
		}
		else if((<HTMLInputElement>document.getElementById("explicit")).checked){
			URL =  "&utf8=%E2%9C%93&tags=" + "rating%3Aexplicit" + "+" + tags[tags.length-1]["name"];
		}
		else{
			if(tags.length > 1)  URL =  "&utf8=%E2%9C%93&tags=" + tags[tags.length-2]["name"] + "+" + tags[tags.length-1]["name"];
			else  URL = "&utf8=%E2%9C%93&tags=" + tags[tags.length-1]["name"];
		}
		return URL;
	}

//set where to search
	setPostAndPage(end_URL):string{		
		this.post_number = 0;
	   //page
		if(this.top_page != this.top_page_max) this.smallest_tag_size = this.top_page * 20;
		if(this.smallest_tag_size == 0) this.smallest_tag_size = 100;
		var escape_cond:boolean = true;
		this.page_number = ((Math.floor(Math.random() * 10000)) % Math.ceil(this.smallest_tag_size / 20)) % 1000;    //1000 is max page search limit
		if(this.page_number == 0 && this.previous_page == 0){
			this.primed_for_fail = true;
		}
		this.json_numbers_used.push(this.page_number);
		this.previous_page = this.page_number;
		var URL = "https://danbooru.donmai.us/posts.json?page=" + this.page_number + end_URL;
		return URL;
	}

	//check if valid url location
	checkPageFromDanbooru(err, data, tags, this_arr):void{
		if (err != null) {
			console.log('Something went wrong: ' + err);
			Generics.alert4ChanX("Danbooru Server Did Not Perform request -- Error: "  + err, "error");
			document.getElementById("timer").textContent = "";
			document.getElementById("tag_input").removeAttribute("disabled");
			document.getElementById("imageButton").removeAttribute("disabled");
		}
		else {
			do{
				var duplicate:boolean = false;
				//check for repeating images found
				this_arr.previous_images.forEach((item) => {
					if(item[0] == this_arr.page_number && item[1] == this_arr.post_number){
						duplicate = true;
						this_arr.post_number++;
					}
				});
			}while(duplicate);
			if(this_arr.primed_for_fail){
				Generics.alert4ChanX("No Results: All found for tags \"" + (<HTMLInputElement>document.getElementById("tag_input")).value + "\"", "error");
				this_arr.reset_search_timer_fields();
				return;
			}
			//Out of items on current json page so go to next page
			else if((data.length < this_arr.post_number+1) && this_arr.number_of_attempts > 0) {
				if(this_arr.top_page > this_arr.page_number){
					this_arr.top_page = this_arr.page_number + this_arr.post_number / 20;
				}
				this_arr.number_of_attempts--;
						//posts
				this_arr.post_number = 0;
				document.getElementById("timer").textContent = this_arr.number_of_attempts + "|" + this_arr.time;
				this_arr.setImage(this_arr);
			}
			else if (this_arr.number_of_attempts > 0){
				//ALL PARAMETERS WILL BE RESET INSIDE JSON
				document.getElementById("timer").textContent =  this_arr.number_of_attempts + "|" + this_arr.time;
				Generics.getJSON(this_arr.send_URL, (err, data, tags, _this_arr) => this_arr.setImageFromDanbooru(err, data, tags, _this_arr), 
															tags, this_arr);
			}
			else{
				Generics.alert4ChanX("Not found", "error");
				this_arr.reset_search_timer_fields();
				return;
			}
		}
	}

	reset_search_timer_fields():void{
		this.top_page = this.top_page_max;
		this.number_of_attempts = this.maximum_attempts;
		document.getElementById("timer").textContent = "";
		document.getElementById("tag_input").removeAttribute("disabled");
		document.getElementById("imageButton").removeAttribute("disabled");
	}

//finally draw from the JSON page to generate and place the post into the 4chanX dumplist
	setImageFromDanbooru(err:any, data:any, tags:string[], this_arr):void{
		if (err != null) {
			console.log('Something went wrong: ' + err);
			Generics.alert4ChanX("Danbooru Server Did Not Perform request -- Error: "  + err, "error");
			document.getElementById("timer").textContent = "";
			document.getElementById("tag_input").removeAttribute("disabled");
			document.getElementById("imageButton").removeAttribute("disabled");
		}
		else {
			this_arr.json_page = data;
			var image_found:boolean = false;
			for (this_arr.post_number = this_arr.post_number; this_arr.post_number < 20 ; this_arr.post_number++){
				if(this_arr.timeout){
					//Case1: Took too long to scan the page.
					//Result: Kills search
					Generics.alert4ChanX("timeout after " + this_arr.time +" seconds", "error");
					for(var i = 0 ; i < this_arr.timeout_functions.length; i++){
						clearInterval(this_arr.timeout_functions[i]);
					}
					this_arr.reset_search_timer_fields();
					return;
				}
				else if(this_arr.json_page["" + this_arr.post_number] == undefined){
					//Case2: reaches an undefined page.
					//Result: Switches to a new page
					this_arr.top_page = this_arr.page_number;
					//this_arr.number_of_attempts--;
					this_arr.setImage(this_arr);
					return;
				}

				//set the page to search
				var end_URL:string = this_arr.json_page["" + this_arr.post_number].file_url;
				var URL:string = "https://danbooru.donmai.us" + end_URL;
				if(this_arr.subdomain_regex.test(end_URL))
					URL = end_URL;

				//place url in visible box
				this_arr.urlContainterFunction(URL);

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

				var failed_to_find_required_tags:boolean = false;
				if(end_URL === undefined ||
				   end_URL.indexOf(".mp4") > -1 || end_URL.indexOf(".webm") > -1 || end_URL.indexOf(".swf") > -1 || end_URL.indexOf(".zip") > -1){
					continue;
				}
				else{
					tags.forEach((tag) => {
						//if tag contains an order then whatever
						if(tag.indexOf("order:") > -1){}
						//if it contains a raiting, check the rating character at the seventh index
						else if(tag.indexOf("rating:") > -1){
							if(tag.charAt(7) !== this_arr.json_page["" + this_arr.post_number]["rating"]){
								failed_to_find_required_tags = true;
							}
						}
						//otherwise check if the tagstring contains the tags
						else if(this_arr.json_page["" + this_arr.post_number]["tag_string"].indexOf(tag) == -1){
							failed_to_find_required_tags = true;
						}
					});
				}
				if(failed_to_find_required_tags){
					continue;
				}
				else{
					if(this_arr.json_page["" + this_arr.post_number].file_size >= 4000000){
						var end_URL:string = this_arr.json_page["" + this_arr.post_number].large_file_url;
						var URL = "https://danbooru.donmai.us" + end_URL;
						if(this_arr.subdomain_regex.test(end_URL))
							URL = end_URL;

					}
					(<HTMLInputElement>document.getElementById("timer")).textContent = "...";
					this_arr.img_URL = URL;
					var xhr = new GM_xmlhttpRequest(({
						method: "GET",
						url: URL,
						responseType : "arraybuffer",
						onload: (response) =>
						{
							//is it a non existent image?
							if(response.response.byteLength <= 387){
								Generics.alert4ChanX("Image Does Not Exist on Danbooru(404 error)\nDanbooru seems to be updating image servers???", "error");
							}
							var blob:Blob;
							if(end_URL.indexOf(".jpg") > -1)
								blob = new Blob([response.response], {type:"image/jpeg"});
							else if(end_URL.indexOf(".png") > -1)
								blob = new Blob([response.response], {type:"image/png"});
							else if(end_URL.indexOf(".gif") > -1)
								blob = new Blob([response.response], {type:"image/gif"});

							var counter = document.getElementById("timer");
							while(counter.hasChildNodes()) counter.removeChild(counter.lastChild);

							this_arr.reset_search_timer_fields();
							this_arr.time = this_arr.time_max;

							var name = end_URL.replace(/(data|cached)/g, "");
							name = name.replace(/\//g, "");

							//SEND RESULTING RESPONSE TO 4CHANX FILES === QRSetFile
							var detail = {file:blob, name:name};
							if (typeof cloneInto === 'function') {
								detail  = cloneInto(detail , document.defaultView);
							}
							document.dispatchEvent(new CustomEvent('QRSetFile', {bubbles:true, detail}));
						}
					}));
													//end function;
					image_found = true;
									//SET PAGE&POST AS FOUND
					this_arr.previous_images.push([this_arr.page_number, this_arr.post_number]);
					this_arr.post_number = 9001;
				}
			}
			if(!image_found){
				// this_arr.top_page = this_arr.page_number;
				// //this_arr.number_of_attempts--;
				this_arr.setImage(this_arr);
			}
		}
	}

	urlContainterFunction(url:string):void{
		var url_box:HTMLInputElement = <HTMLInputElement>document.getElementById("urlContainer");
		url_box.value = url;
	}


	counterFunction():void{
		if(!this.timeout){
			this.time--;
			if(this.time < 0){
				this.timeout = true;
				this.time = this.time_max;
			}
		}
	}


	decideAction(node:any):void{}
	retrieveStates():void{}
	storeStates(...items:any[]):void{}

	
}
