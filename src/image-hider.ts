
class ImageHider extends FeatureInterface{
	blank_png:string = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAACXBIWXMAALiMAAC4jAHM9rsvAAAAG3RFWHRTb2Z0d2FyZQBDZWxzeXMgU3R1ZGlvIFRvb2zBp+F8AAAAo0lEQVR42u3RAQ0AAAjDMO5f9LFBSCdhTdvRnQIEiIAAERAgAgJEQIC4AERAgAgIEAEBIiBABERAgAgIEAEBIiBABERAgAgIEAEBIiBABERAgAgIEAEBIiBABERAgAgIEAEBIiBABERAgAgIEAEBIiBABERAgAgIEAEBIiBABERAgAgIEAEBIiBABERAgAgIEAEBIiBABAQIECACAkRAgAjI9xbzUCtI4axs4wAAAABJRU5ErkJggg==`;

	hide_expiration_time:number;
	threads_to_hide:string[];
	md5_filters_arr:string[];
	listener_obj = {};
	
	constructor(){
		super();
		this.retrieveStates();
		this.init();
		this.activate();
	}
	
	//retrieve from memory the hidden images
	//Images are stored in memory as f<ID_NUMBER>IMG and recalled using the storage_key
	//Function makes a check to see if the hiding time limit for the thread has expired or not.
	//Note: Must have the DOM itterate through before retrieval
	retrieveStates():void{
		var storage_position:number = 0;
        var JSON_storage:any = {};/*;any bypasses dot notation issues on objects*/
		var storage_key:string;
		var local_store_size = window.localStorage.length;
		while(storage_position < local_store_size) {
			storage_key = window.localStorage.key(storage_position);
			JSON_storage[storage_key] = window.localStorage.getItem(storage_key);
			storage_position++;
		}
		this.threads_to_hide = Generics.getJSONPropertiesByKeyName(JSON_storage,'[0-9]+IMG');
		//aquire each time to check for changes
		this.hide_expiration_time =  parseInt(JSON_storage.Expiration_Time);
		if(this.hide_expiration_time === null) this.hide_expiration_time = Constants.DEFAULT_HIDE_EXPIRATION_TIME;
		var md5_filters = JSON_storage.MD5_List_FSE;	
		if(md5_filters !== undefined && md5_filters !== null){
			this.md5_filters_arr = md5_filters.split('\n');
			//remove trailing and starting slash
			this.md5_filters_arr.forEach((md5, index) => {
				md5 = md5.trim();
				this.md5_filters_arr[index] = md5.substring(1, md5.length - 1);
			});
		}
	}
	
	storeStates(...item_pairs:string[]):void{
		window.localStorage.setItem(item_pairs[0], item_pairs[1]);	
	}
	
	init():void{	
		this.hotkeyListeners();
	}
	
	//hide image onclick listener.
	//Method 404's a given image. This 404'ing allows image dissabling to be toggled on and off.
	//Post number associated with the image is stored in local storage.
	hideOnClick(event:any):boolean{
		var is_hidden =  event.target.src.substring(21, 29) == ",iVBORw0";
		var hide_group_id:string;
		if((this.listener_obj[17] && this.listener_obj[16]) && !is_hidden){
			event.preventDefault();
			event.stopPropagation();
			hide_group_id = event.target.getAttribute('hide-grouping');
			this.storeStates(hide_group_id, `${Date.now()}`);		
			[].slice.call(document.querySelectorAll('img[hide-grouping="' + hide_group_id + '"]')).forEach((image_node) => {
				image_node.setAttribute('hidden-src', image_node.src);
				image_node.src = this.blank_png;
			});
		}
		else if(this.listener_obj[17] && this.listener_obj[16]){
			event.preventDefault();
			event.stopPropagation();
			hide_group_id = event.target.getAttribute('hide-grouping');
			window.localStorage.removeItem(hide_group_id);
			event.target.src = event.target.getAttribute('hidden-src');
			[].slice.call(document.querySelectorAll('img[hide-grouping="' + hide_group_id + '"]')).forEach((image_node) => {
				image_node.src = image_node.getAttribute('hidden-src');
			});
		}
		this.retrieveStates();
		return true;
	}
	
		//hotkeys for ctrl[17] and shift[16]
	 hotkeyListeners():void{		
		window.addEventListener("keydown", (e)=>{
			this.listener_obj[e.keyCode] = true;
		}, {passive:false, capture:false, once:false});
		window.addEventListener("keyup", (e) => {
			this.listener_obj[e.keyCode] = false;
		}, {passive:false, capture:false, once:false});
	}
	
	decideAction(node:any):void{
		//tagname is always upper in HTML, in xml it's displayed as written.
		if(node.tagName  === 'IMG' || node.tagName  === 'VIDEO'){
			if(node.id === "ihover"){
				this.hideHoverImageNode(node);
				return;
			}
			if(node.getAttribute('data-md5') !== null){
				this.hideImageNode(node);
			}
		}
	}
		//Activate
	activate():void{
		console.log("4F-FSE: ImageHider Active");	
	}
	
	hideImageNode(image_node:any){
		var sister_node:any = image_node.parentNode.parentNode.parentNode.getElementsByClassName('catalog-thumb')[0]; // the catalog sister to index
		var sister_node_non_exist = false;
		if(sister_node === undefined){
			sister_node_non_exist = true;
		} 
		var image_node_already_run = false;
		if(/\d+IMG/.test(image_node.getAttribute('hide-grouping'))){
			image_node_already_run = true;
			if(!sister_node_non_exist){
				if(/\d+IMG/.test(sister_node.getAttribute('hide-grouping'))){
					return;
				}
			}
		}
			
		if(!image_node_already_run) image_node.setAttribute('hide-grouping', image_node.parentNode.parentNode.id.substring(1) + 'IMG');
		if(!sister_node_non_exist)sister_node.setAttribute('hide-grouping', image_node.parentNode.parentNode.id.substring(1) + 'IMG');

		if(!image_node_already_run) image_node.addEventListener('click', (evt) => this.hideOnClick(evt));
		if(!sister_node_non_exist) sister_node.addEventListener('click',(evt) => this.hideOnClick(evt));

		var threadstore_len = this.threads_to_hide.length;
		var node_group_id = image_node.getAttribute('hide-grouping');

		for(let thread = 0 ; thread < threadstore_len; thread++){
			if(node_group_id == this.threads_to_hide[thread]){
				if(!image_node_already_run){
					image_node.setAttribute('hidden-src', image_node.src);
					image_node.src = this.blank_png;
				}
				if(!sister_node_non_exist){
					sister_node.setAttribute('hidden-src', sister_node.src);
					sister_node.src = this.blank_png;
				}
				return;
			}
		}
		//index node holds the MD5
		var node_md5:string = image_node.getAttribute('data-md5');
		if(this.md5_filters_arr !== undefined){
			var md5_filters_arr_len = this.md5_filters_arr.length;
			for(var md5:number = 0 ; md5 < md5_filters_arr_len; md5++){
				if(node_md5 == this.md5_filters_arr[md5]){
					this.threads_to_hide.push();
					if(!image_node_already_run){
						image_node.setAttribute('hidden-src', image_node.src);
						image_node.src = this.blank_png;
					}
					if(!sister_node_non_exist){
						sister_node.setAttribute('hidden-src', sister_node.src);
						sister_node.src = this.blank_png;
					}
					return;
				}
			}
		}
	}
	
	hideHoverImageNode(image_node:any):void{	
		var unprocessed_id:string = image_node.getAttribute('data-full-i-d');			
		var proccessed_id:string = unprocessed_id.substring(unprocessed_id.indexOf('.') + 1);
		var image_node_id:string = proccessed_id + 'IMG';		
		if(image_node === undefined) return;
		
		for(var thread = 0, threadstore_len:number = this.threads_to_hide.length ; thread < threadstore_len; thread++){
			if(image_node_id == this.threads_to_hide[thread]){		
				image_node.removeAttribute('src');
				return;
			}
		}
		//thread node holds the MD5
		var node_md5:string;
		// if(is_embeded_post) node_md5 = image_node.getAttribute('data-md5');
		/*else */node_md5 = document.getElementById('f' + proccessed_id).getElementsByTagName('IMG')[0].getAttribute('data-md5');
		if(this.md5_filters_arr !== undefined){
			for(var md5:number = 0 , md5_filters_arr_len:number = this.md5_filters_arr.length; md5 < md5_filters_arr_len; md5++){
				if(node_md5 == this.md5_filters_arr[md5]){
					image_node.removeAttribute('src');
					return;
				}
			}
		}
	}
}