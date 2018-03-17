class TextReplacer extends FeatureInterface{
	
	number_of_filters:number;
	text_filters:any[] = [];//object
	filtered_threads:string[] = [];
	
	constructor(){
		super();
		this.retrieveStates();
		this.init();
		this.activate();
	}
	
	init():void{
		this.filtered_threads = []
		
	};
	
	activate():void{console.log("4F-FSE: TextReplacer Active");}
	
	decideAction(node:any):void{
		if(node.tagName == "BLOCKQUOTE"){
			if(node.className == "postMessage"){
				var blockquote_id:any = node.id;
				var already_filtered:boolean = false;
				this.filtered_threads.forEach((thread_id) => {
					if(thread_id == blockquote_id) {
						already_filtered = true;
						return;
					}
				});
			}
			else return;
			if(!already_filtered && this.text_filters.length !== 0){
				var itterator:any = document.createNodeIterator(node, NodeFilter.SHOW_TEXT);
				var localNode:any;
				while((localNode = itterator.nextNode())){
					for(var filter:number = 0 ; filter < this.number_of_filters; filter++){
						if (this.text_filters[filter].Active === "true") {
							var last_slash_index:number = this.text_filters[filter].Regex.lastIndexOf("/");
							var filter_text:string = this.text_filters[filter].Regex.substring(1, last_slash_index);
							var flag:string = this.text_filters[filter].Regex.substring(last_slash_index + 1);
							var regex:any = new RegExp(filter_text, flag);
							var node_text:string = localNode.textContent;
							if(regex.test(node_text)){
								localNode.textContent = node_text.replace(regex, this.text_filters[filter].Replacement);
								this.filtered_threads.push(blockquote_id);
							}
						}		
					}
				}
			}
		}
	}
	
	retrieveStates():void{
		var storage_index:number = 0;
		var JSON_storage:any = {};
		var storage_key:string;
		while(storage_index < window.localStorage.length) {
			storage_key = window.localStorage.key(storage_index);
			JSON_storage[storage_key] = window.localStorage.getItem(storage_key);
			storage_index++;
		}
		this.number_of_filters = JSON_storage["filter_quantity"];
		var filters:string[] = Generics.getJSONPropertiesByKeyName(JSON_storage,"[0-9]+FLT");
		filters.sort();
		filters.forEach((filter) => {
			this.text_filters.push(TextReplacer.formatFilterSettings(JSON_storage[filter]));
		});
	}

		
	//Splits the saved settings into components
	static formatFilterSettings(input:string):object{
		var processed_input:string[] =  (input.split('=')).map(x => decodeURIComponent(x));
		return {Active: processed_input[0], Regex: processed_input[1], Replacement: processed_input[2]};
	}
	
	storeStates():void{	}
}