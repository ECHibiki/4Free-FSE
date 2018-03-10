class SettingsWindow{
	background_div:any = document.createElement("DIV");
	settings_div:any = document.createElement("DIV");
	close_div:any = document.createElement("DIV");
	contents_div = document.createElement("DIV");
	
	close_link:any = document.createElement("A");
	title_para:any = document.createElement("P");
	title_text:any = document.createTextNode("4F-FSE Settings");
	end_para:any = document.createElement("P");
	end_text:any = document.createTextNode("Refresh to view changes");
	
	list_items:string[] = 
	[
		"View 『Danbooru Image Adder』 Settings",
		"View 『¥ Text』 Settings [Long Coloring]",
		"View 『Kita』 Settings [Character Coloring]",
		"View 『Image Hiding』 Settings",
		"View 『Word Replacement』 Settings",
		"View 『Threaad Rebuilder』 Settings",
		"Set 『Visible Password』 : ",	
	]
	
	setting_items:Object[] = [];
	
	settings_style:any = document.createElement("STYLE");
	
	constructor(){
		this.settings_style.innerHTML = `.inputs{background-color:rgb(200,200,200);margin:5px 7px;width:100px;}
										.SettingsBackground{position:fixed;width:100%;height:100%;background-color:rgba(200,200,200,0.3);top:0;left:0; z-index:9}
										.settingsMain{border:solid 1px black;position:fixed;background-color:rgb(200,200,200);left:40%;top:20%;margin-bottom:0; z-index:10}
										.closeIcon{border:solid 1px black;position:absolute;width:25px;height:25px;background-color:rgba(255,100,90,0.9); right:3px;top:3px; z-index:10}
										.titleStyle{margin-left:5px;margin-top:5px}
										.contentStyle{background-color:white;margin:0 0;padding:5px;}`;
		document.body.appendChild(this.settings_style);
		
		this.background_div.setAttribute("class", "SettingsBackground");
		this.background_div.setAttribute("id", "SettingsBackground");
		this.background_div.setAttribute("style","display:none");
		this.background_div.addEventListener("click", evt => this.hideWindow());
		document.body.appendChild(this.background_div);
		
		this.settings_div.setAttribute("class", "settingsMain");
		this.settings_div.setAttribute("id", "settingsWindow");
		this.settings_div.setAttribute("style", "display:none;width:400px");
		
		this.close_link.setAttribute("href","javascript:void(0)");
		this.settings_div.appendChild(this.close_link);
		
		this.close_div.setAttribute("class", "closeIcon");
		this.close_div.addEventListener("click", evt => this.hideWindow());
		this.close_link.appendChild(this.close_div);
		
		this.title_para.setAttribute("class", "titleStyle");
		this.title_para.appendChild(this.title_text);
		this.settings_div.appendChild(this.title_para);

		this.contents_div.setAttribute("class","contentStyle");
		this.settings_div.appendChild(this.contents_div);		

		this.generateList(this.list_items, this.contents_div);

		this.end_para.setAttribute("class", "");
		this.end_para.appendChild(this.end_text);
		this.settings_div.appendChild(this.end_para);
		
		document.body.appendChild(this.settings_div);
	}
	
	generateList(list_items:string[], head_node:any):void{			
		var start:any = document.createElement("UL");
		list_items.forEach((item, index) => {
			var li = document.createElement("LI");
			if(item.indexOf("View") > -1){
				var a:any =  document.createElement("A");
                a.setAttribute("href","javascript:void(0)");
				a.textContent = item;
				a.setAttribute("ID", "tab-settings" + index);
				a.addEventListener("click", function(){});
				li.appendChild(a);
				start.appendChild(li);
				var a_settings:object = JSON.parse('{"ID":"0", "VALUE":"1"}');
				this.setting_items.push(a_settings);
			}
			else{
				var label:any =  document.createElement("LABEL");
				label.textContent = item;
				li.appendChild(label);
				
				var input:any = document.createElement("INPUT");
				var input_id:string = "check-settings" + index;
				input.setAttribute("TYPE","checkbox");
				input.setAttribute("ID", "check-settings" + index);
				li.appendChild(input);
				start.appendChild(li);
				
				(<HTMLInputElement>input).checked = localStorage.getItem(input_id) == "true";
				label.addEventListener("click", function(){	
					var is_check:boolean = !(<HTMLInputElement>input).checked;
					(<HTMLInputElement>input).checked = is_check;	
					localStorage.setItem(input_id, `${is_check}`);
				});
				var check_settings:Object = JSON.parse(`{"ID":"${input_id}", "VALUE":"${(<HTMLInputElement>input).checked}"}`);
				this.setting_items.push(check_settings);
			}
		});
		head_node.appendChild(start);
	}
	
	getSettingsArr():Object[]{
		return this.setting_items;
	}
	
	displayWindow():void{
		this.background_div.style.display = "block";
		this.settings_div.style.display = "block";
	}
	hideWindow():void{
		this.background_div.style.display = "none";
		this.settings_div.style.display = "none";
	}
}