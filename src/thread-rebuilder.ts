declare var cloneInto: any;
declare var GM_xmlhttpRequest: any;

class ThreadRebuilder extends FeatureInterface{

	board = "qa";
	thread_data = [['Comment'], ['Image URLs'], ['Image Names'] ,['Post No.']];
	semaphore = 1;
	semaphore_posts = 1;
	timeListen;

	use_offsite_archive = false;
	window_displayed = false;
	in_sequence = false;
	tool_top_visible = false;

	constructor(){
		super();
		this.init();
	}
		
	init():void{
		var pathname = window.location.pathname.substring(1);
		this.board = pathname.substring(0, pathname.indexOf("/"));
		this.activate();
	}
	
	retrieveStates():void{
		this.use_offsite_archive =  localStorage.getItem("ArchiveType_FSE") == "0"  ? true : false;
	}
    storeStates(...items:any[]):void{}
	activate():void{
		document.addEventListener("QRDialogCreation", (e) => this.enhance4ChanX());
		document.addEventListener('QRPostSuccessful', (e) => {
			if(this.in_sequence){
				(<HTMLElement>document.getElementById("dump-list").childNodes[1]).click();
				this.setPropperLinking((<HTMLInputElement>document.getElementById("qr").getElementsByTagName("TEXTAREA")[0]).value);
			}
		}, false);
	}
	 
	decideAction(node:any):void{}

	enhance4ChanX():void{
		var qr_window = document.getElementById("qr");

		if(document.getElementById("qrRebuilder") !== null) qr_window.removeChild(document.getElementById("qrRebuilder"));

		var thread_rebuilder_table = document.createElement("TABLE");
		thread_rebuilder_table.setAttribute("id", "qrRebuilder");
		thread_rebuilder_table.setAttribute("style", "text-align:center");
		qr_window.appendChild(thread_rebuilder_table);

		var thread_row = document.createElement("TR");
		var option_text_size = 18;
		var help_icon_container = document.createElement("A");
		(<HTMLLinkElement>help_icon_container).href = "javascript:void(0)";
		help_icon_container.title = "Click to View Help!";
		var help_icon = document.createElement("IMG");
		help_icon.setAttribute("style", "height:" + option_text_size * 1.25 + "px;margin:-4px 10px");
		(<HTMLImageElement>help_icon).src = Constants.HELP_ICON_SOURCE;

		help_icon_container.appendChild(help_icon);
		thread_row.appendChild(help_icon_container);

		var tooltip_div = document.createElement("DIV");
		tooltip_div.innerHTML = "Insert the thread number of the post to rebuild<br/>Must be in either the 4chan archives or archived.moe<hr/>Submit bugs to <a href='https://github.com/ECHibiki/4chan-UserScripts'>my Github</a>";
		tooltip_div.setAttribute("style", "z-index:9;padding:5px;border:1px solid black;background-color:white;word-wrap:break-word;display:none;position:absolute;");
		help_icon_container.addEventListener("click", (evt)=>{
			if(this.tool_top_visible)
				tooltip_div.setAttribute("style", "z-index:9;padding:5px;border:1px solid black;background-color:white;word-wrap:break-word;display:none;position:absolute;");
			else
				tooltip_div.setAttribute("style", "z-index:9;padding:5px;border:1px solid black;background-color:white;word-wrap:break-word;display:block;position:absolute;"
					+ "left:" +  ((<MouseEvent>evt).clientX - (<DOMRect>qr_window.getBoundingClientRect()).x) +
					"px;top:" +  ((<MouseEvent>evt).clientY - (<DOMRect>qr_window.getBoundingClientRect()).y ) + "px;");
			this.tool_top_visible = !this.tool_top_visible;
		});
		qr_window.appendChild(tooltip_div);

		var second_row_nodes = [
			document.createTextNode("Thread: "),
			document.createElement("INPUT"),
			document.createElement("INPUT"),
		];
		second_row_nodes.forEach(
			(node) => {
				thread_row.appendChild(node);
			});
		thread_rebuilder_table.appendChild(thread_row);

		(<HTMLInputElement>second_row_nodes[1]).setAttribute("ID", "threadInput");
		(<HTMLInputElement>second_row_nodes[1]).setAttribute("style", "width:35.0%");

		(<HTMLInputElement>second_row_nodes[2]).setAttribute("ID", "threadButton");
		(<HTMLInputElement>second_row_nodes[2]).setAttribute("type", "button");
		(<HTMLInputElement>second_row_nodes[2]).setAttribute("value", "Set Rebuild Queue");

		second_row_nodes[2].addEventListener("click", () => {
			this.in_sequence = true;
			this.killAll();
			this.getThread((<HTMLInputElement>second_row_nodes[1]).value);
			this.postID = setInterval(() => this.postRoutine(), 1000);
			if(this.timeListen === undefined) this.timeListen = setInterval(() => this.timeListenerFunction(), 1000);
		});
		qr_window.appendChild(document.createElement("hr"));
	};

	thread_data_length = 0;
	posts_created = 0;
	postID:number;
	postRoutine():void{
		if(this.semaphore == 0){
			this.semaphore++;
			this.thread_data_length = this.thread_data[0].length;
			this.fillID = setInterval(() => this.fillRoutine(), 10);
			this.stopRoutine();
		}
	};

	stopRoutine():void{
		clearInterval(this.postID);
	};

	fillID:number;
	fillRoutine():void{
		if (this.posts_created >= this.thread_data_length)
			{ this.semaphore_posts = 0; this.stopFillRoutine(); }
		else if(this.semaphore_posts == 1){
			this.semaphore_posts--;
			this.createPost(this.thread_data[0][this.posts_created],
				this.thread_data[1][this.posts_created],
				this.thread_data[2][this.posts_created]);
			this.posts_created++;
		}
	};

	stopFillRoutine():void{
		clearInterval(this.fillID);
	}

	setPropperLinking (text):void{
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
		if(this.use_offsite_archive)
			var URL  = "https://www.archived.moe/_/api/chan/thread/?board=" + this.board + "&num=" + (<HTMLInputElement>document.getElementById("threadInput")).value;
		else
			var URL  = "https://a.4cdn.org/" + this.board + "/thread/" + (<HTMLInputElement>document.getElementById("threadInput")).value + ".json";
		
		var xhr = new GM_xmlhttpRequest(({
			method: "GET",
			url: URL,
			responseType : "json",
			onload: (data) => {
				if(this.use_offsite_archive)
					data = data.response["" + (<HTMLInputElement>document.getElementById("threadInput")).value]["posts"];
				else
					data = data.response["posts"];
				if(data == undefined){
					alert("Invalid Thread ID: " + (<HTMLInputElement>document.getElementById("threadInput")).value + ". ");
				}
				else{
					link_arr.forEach((link_item)=>{
						for(var data_entry = 0 ; data_entry < data.length ; data_entry++){
							if(parseInt(link_item[0]) == parseInt(data[data_entry]["no"])){
								if(this.use_offsite_archive && data[data_entry]["comment_processed"] !== undefined)
									responding_text.push([ [post_no, end_index], data[data_entry]["comment_processed"].replace(/(&gt;&gt;|https:\/\/www\.archived\.moe\/.*\/thread\/.*\/#)\d+/g, ""), link_item["media"]["safe_media_hash"] ]);
								else if(data[data_entry]["com"] !== undefined)
									responding_text.push([ [post_no, end_index], data[data_entry]["com"].replace(/(&gt;&gt;|#p)\d+/g, ""), data[data_entry]["md5"] ]);
								else responding_text.push([ [post_no, end_index], undefined, data[data_entry]["md5"] ]);
								break;
							}
						}
					});

					var current_url = window.location.href;
					var hash_index = current_url.lastIndexOf("#") != -1 ? current_url.lastIndexOf("#"):  window.location.href.length;
					var current_thread = window.location.href.substring(current_url.lastIndexOf("/")+1, hash_index);
					var current_url =  "https://a.4cdn.org/" + this.board + "/thread/" + current_thread + ".json";
					//open current thread to hunt down the text found in links
					var xhr = new GM_xmlhttpRequest(({
						method: "GET",
						url: current_url,
						responseType : "json",
						onload: (data)=>{
							data = data.response["posts"];
							if(data == undefined){
								alert("Invalid Thread ID: " + (<HTMLInputElement>document.getElementById("threadInput")).value + ". ");
							}
							else{
								responding_text.forEach((response_item)=>{
									for(var data_entry = 0 ; data_entry < data.length ; data_entry++){
										if(data[data_entry]["com"] !== undefined && (response_item[1] == data[data_entry]["com"].replace(/(&gt;&gt;|#p)\d+/g, "") || response_item[1] == null)
											&& (response_item[2] == data[data_entry]["md5"] || response_item[2] == null)){
											var start_index = response_item[0][0].legth - response_item[0][1];
											text = text.substring(0, start_index) + ">>" + data[data_entry]["no"] + text.substring(response_item[0][1]);
												break;
										}
										else if(response_item[2] !== undefined && response_item[2] == data[data_entry]["md5"]){
																						var start_index = response_item[0][0].legth - response_item[0][1];
											text = text.substring(0, start_index) + ">>" + data[data_entry]["no"] + text.substring(response_item[0][1]);
												break;
										}
									}
								});
											(<HTMLInputElement>document.getElementById("qr").getElementsByTagName("TEXTAREA")[0]).value = text;
											document.getElementById("add-post").click();
											this.semaphore_posts++;
							}
						}
					}));
				}
			}
		}));
	};


	//2) GET ARCHIVED THREAD
	getThread(threadNo):void{
		this.thread_data = [[], [], [], []];

		if(this.use_offsite_archive)
			var URL  = "https://www.archived.moe/_/api/chan/thread/?board=" + this.board + "&num=" + (<HTMLInputElement>document.getElementById("threadInput")).value;
		else
			var URL  = "https://a.4cdn.org/" + this.board + "/thread/" + (<HTMLInputElement>document.getElementById("threadInput")).value + ".json";
		var xhr = new GM_xmlhttpRequest(({
			method: "GET",
			url: URL,
			responseType : "json",
			onload: (data) =>{
				var starting_post = -1;
				if(this.use_offsite_archive){
					starting_post = 0;
					data = data.response["" + (<HTMLInputElement>document.getElementById("threadInput")).value];
				}
				else{
					starting_post = 1;
					data = data.response;
				}
				if(data == undefined){
					alert("Invalid Thread ID: " + threadNo + ".\n4chan Archive ");
				}
				else{
                    var len  = 0;
                    if (this.use_offsite_archive){
                        var data_post_copy = [];
                        var index = 0;
                        for (var key in data["posts"]){
                            data_post_copy[index] = data["posts"][key]
                            index++;
                        }
                        data["posts"] = data_post_copy;

                        len = index;
                    }
                    else{
                        len = data["posts"].length;
                    }
					for(var post_number = starting_post ; post_number < len ; post_number++){
						var comment = undefined;
						if(this.use_offsite_archive)
							comment = data["posts"][post_number]["comment"];
						else
							comment = data["posts"][post_number]["com"];
						if(comment !== undefined && comment !== null)
							this.thread_data[0].push(comment);
						else
							this.thread_data[0].push("");

						var filename = undefined;
						if(this.use_offsite_archive){
							if(data["posts"][post_number]["media"] !== null)
								filename = "" + data["posts"][post_number]["media"]["media_filename"];
						}
						else
							filename = "" + data["posts"][post_number]["tim"] + data["posts"][post_number]["ext"];

						if(filename !== undefined && filename !== null && filename.indexOf("undefined") == -1)
							if(this.use_offsite_archive)
								if(data["posts"][post_number]["media"] !== null)
									this.thread_data[1].push(data["posts"][post_number]["media"]["remote_media_link"]);
								else  this.thread_data[1].push("");
							else
								this.thread_data[1].push("https://i.4cdn.org/" + this.board + "/" + filename);
						else  this.thread_data[1].push("");
						if(this.use_offsite_archive){
							if(data["posts"][post_number]["media"] !== null)
								this.thread_data[2].push(data["posts"][post_number]["media"]["media_id"]);
						}
						else
							this.thread_data[2].push(data["posts"][post_number]["filename"]);

						if(this.use_offsite_archive)
							this.thread_data[3].push(data["posts"][post_number]["num"]);
						else
							this.thread_data[3].push(data["posts"][post_number]["no"]);
					}
				}
				this.semaphore--;
			}
		}));
	};
	//3) RIP POSTS AND IMAGES
	createPost(text, imageURL, imageName):void{
		if(imageURL != ""){
			var response_type = "arraybuffer";
			// if(this.use_offsite_archive) response_type = "text"
			var xhr = new GM_xmlhttpRequest(({
				method: "GET",
				url: imageURL,
				responseType : response_type,
				onload: (response) =>
				{
					if(this.use_offsite_archive){
						// var parser = new DOMParser();
						// var content_attribute = parser.parseFromString(response.response, "text/html").getElementsByTagName("META")[0].getAttribute("content");
						// var redirect_url = content_attribute.substring(content_attribute.indexOf("http"));
						// var xhr = new GM_xmlhttpRequest(({method:"GET", url: redirect_url, responseType:"arraybuffer",
							// onload:(response) => {
								this.inputImage(response, text,  imageURL, imageName);
							// }
						// }));
					}
					else{
						this.inputImage(response, text, imageURL, imageName);
					}
				}
			}));
		}
		else{
			text = this.createPostComment(text);
			this.setPropperLinking(text);
		}
	}

	inputImage(response, text, imageURL, imageName):void{
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
						detail  = cloneInto(detail , document.defaultView);

					document.dispatchEvent(new CustomEvent('QRSetFile', {bubbles:true, detail}));

					if(text !== "" && text !== undefined) {
						text = this.createPostComment(text);
						this.setPropperLinking(text);
					}
					else{
						document.getElementById("add-post").click();
						this.semaphore_posts++;
					}
	}

	//4) CREATE POST QUEUE
	createPostComment (text):string{
		var dummy = document.createElement("DIV");
		dummy.innerHTML = text;
		var inside_node = dummy.firstChild;
		var return_text = "";
		do{
			if((<HTMLElement>inside_node).tagName == "BR")
				return_text += "\n";
			else
				return_text += inside_node.textContent;
		}while((inside_node = inside_node.nextSibling));

		return return_text;
	};

	checked = false;
	timeListenerFunction():void{
		var time = parseInt((<HTMLInputElement>document.getElementById("qr-filename-container").nextSibling).value.replace(/[a-zA-Z]+/g, ""));
		if(time  <= 5){
			this.checked = false;
		}
		else if(time > 5){
			this.checked = true;
		}
	}

	killAll():void{
		this.thread_data_length = 0;
		this.posts_created = 0;
		this.stopRoutine();
		this.postID = undefined;
		this.semaphore = 1;
		this.semaphore_posts = 1;
		this.stopFillRoutine();
		this.fillID  = undefined;
		this.thread_data = [['Comment'], ['Image URLs'], ['Image Names'] ,['Post No.']];
		//CLEAR DUMP LIST
		var qr_dumplist = document.getElementById("dump-list").childNodes;
		var qr_dumplist_len = qr_dumplist.length;
		var current_preview = 0;
		while(qr_dumplist_len - current_preview > 1){
			(<HTMLElement>qr_dumplist[0].firstChild).click();
			current_preview++;
		}
	}



}