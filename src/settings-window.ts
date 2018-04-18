class SettingsWindow  extends FeatureInterface{
	background_div:any = document.createElement('DIV');
	settings_div:any = document.createElement('DIV');
	close_div:any = document.createElement('DIV');
	contents_div = document.createElement('DIV');
	ul_selection_start:any = document.createElement('UL');
	
	close_link:any = document.createElement('A');
	title_para:any = document.createElement('P');
	title_text:any = document.createTextNode('4F-FSE Settings');
	end_para:any = document.createElement('P');
	end_text:any = document.createTextNode('Refresh to view changes');
	
	settings_style:any = document.createElement('STYLE');
		
		//to change order change, this AND...*
	list_items:any[] = 
	[
		{Text : " | View 『Image Hiding』 Settings", ListenerFunc : 				(a_id) => {
			this.clearContainer();
			(<Element>this.contents_div).innerHTML = 
				`
				<div id="disposable_container">
								 <label>Non-MD5 Expiration Time(hours): </label>
								 <input id="Expiration_Time">
								 <hr>
								 <label>MD5 Filters:</label>
								 <br>
								 <textarea style="width:98%;height:217px" placeholder="Enter MD5 like on 4chanX... 
								/abc123/
								/def890/" id="MD5_List_FSE"></textarea>
								<hr>
				</div>
				`;
				(<HTMLInputElement>document.getElementById("Expiration_Time")).value = "" + (this.setting_items.image_hiding_settings.Expiration_Time / Constants.MILLISECONDS_TO_THE_HOUR);
				(<HTMLInputElement>document.getElementById("MD5_List_FSE")).value = this.setting_items.image_hiding_settings.MD5_List_FSE; 
				var set_button = document.createElement('INPUT');
				document.getElementById("disposable_container").appendChild(set_button);	
				set_button.setAttribute('VALUE', "Set Image Settings");
				set_button.addEventListener("click", (evt) => {
					this.storeStates();
					this.clearContainer();
					this.rebuildContainer();
				});
				set_button.setAttribute('TYPE', 'button');			
			}

																						},
		{Text : " | View 『Word Replacement』 Settings", ListenerFunc : 			(a_id) => {
			this.clearContainer();
			
			var disposable_container:any = document.createElement("DIV");
			disposable_container.setAttribute("ID", "disposable_container");
			this.contents_div.appendChild(disposable_container);
			this.filterWindow(disposable_container);
			this.filterSetTable();				
		}
																						},
		{Text : " | View 『Danbooru Image Adder』 Settings", ListenerFunc :		(a_id) => {		
			this.clearContainer();
			
			var disposable_container:Element = document.createElement("DIV");
			disposable_container.setAttribute("id", "disposable_container");
			this.contents_div.appendChild(disposable_container);	
			disposable_container.innerHTML = `
			<table style="text-align:center;margin-left:5px">
				<tr>
					<td>
						<label>Very Large: </label>
					</td>
					<td>
						<input id="v_large_DIA" name="preivew-size" style="display:inline" type="radio">
					</td>
				</tr>
				<tr>
					<td>
						<label>Large: </label>
					</td>
					<td>
						<input id="large_DIA" name="preivew-size" style="display:inline" type="radio">
					</td>
				</tr>
				<tr>
					<td>
						<label>Medium: </label>
					</td>
					<td>
						<input id="medium_DIA" name="preivew-size" style="display:inline" type="radio">
					</td>
				</tr>
				<tr>
					<td>
						<label>Small: </label>
					</td>
					<td>
						<input id="small_DIA" name="preivew-size" style="display:inline" type="radio">
					</td>
				</tr>
				<tr>
					<td>
						<label>Width: </label>
					</td>
					<td>
						<input id="width_DIA" name="preivew-size" style="width:20%"  type="text">
					</td>
				</tr>
				<tr>
					<td>
						<label>Height: </label>
					</td>
					<td>
						<input id="height_DIA" name="preivew-size" style="width:20%"  type="text">
					</td>
				</tr>
			</table>	
		
			<hr>
			
			<label>Quick Reply Min Width: </label>
			<input id="qr_width_DIA" name="preivew-size" style="width:20%" type="text">
		
			<hr>
		
			<input id="SetImageAdderProperties" value="Set Preview Size" type="button">
			`;
		this.setImageAdderFields();
		this.setImageAdderEventListeners();
		}
																						},
		{Text : " | View 『Thread Rebuilder』 Settings", ListenerFunc : 			(a_id) => {
			this.clearContainer();
			
			var disposable_container = document.createElement("DIV");
			disposable_container.setAttribute("id", "disposable_container");
			this.contents_div.appendChild(disposable_container);	
			disposable_container.innerHTML = 
			`
				<label>Use 4chan Archives: </label>
				<input name="ArchiveSettings" id="OnsiteArchive" type="radio">
				<br>
				<label>Use Offsite Archives: </label>
				<input name="ArchiveSettings" id="OffsiteArchive" type="radio">
				<br>
				<input id="setArchive" value="Set Archive" type="button">
			`;
			
			(document.getElementById("setArchive")).addEventListener("click", () => {
				this.storeStates();
				this.clearContainer();
				this.rebuildContainer();
			});
			if(this.setting_items.thread_rebuild_settings.Archive_Type === "0") (<HTMLInputElement>document.getElementById("OffsiteArchive")).checked = true;
			else if(this.setting_items.thread_rebuild_settings.Archive_Type === "1") (<HTMLInputElement>document.getElementById("OnsiteArchive")).checked = true;
	}
																						},
		{Text : " | View 『¥ Text』 Settings [Customizable]", ListenerFunc : 	(a_id) => {
			this.clearContainer();
			
			var disposable_container = document.createElement("DIV");
			disposable_container.setAttribute("id", "disposable_container");
			this.contents_div.appendChild(disposable_container);			
			disposable_container.innerHTML = 
			`
				<label>¥Quote Character: </label>
				<input name="quoteCharacter" id="quoteCharacter" type="text" value="¥">
				<br>
				<label>RGB Hex Color: </label>
				<input name="HexColorYen" id="HexColorYen_text" type="text">
				<input name="HexColorYen" id="SelectColorYen" type="color">
				<br>
				<input id="setQuote" value="Set Quote Settings" type="button">
			`;			
			document.getElementById("SelectColorYen").addEventListener("input", (evt) => {
				(<HTMLInputElement>document.getElementById("HexColorYen_text")).value = 
					((<HTMLInputElement>document.getElementById("SelectColorYen")).value);
			});			
			document.getElementById("setQuote").addEventListener("click", (e) => { 
					this.storeStates();
					this.clearContainer();
					this.rebuildContainer();
});	
			if(this.setting_items.character_inserter_settings.Yen_Character !== undefined)
				(<HTMLInputElement>document.getElementById("quoteCharacter")).value = this.setting_items.character_inserter_settings.Yen_Character;
			if(this.setting_items.character_inserter_settings.Yen_Color !== undefined)
				(<HTMLInputElement>document.getElementById("HexColorYen_text")).value = this.setting_items.character_inserter_settings.Yen_Color;	

(<HTMLInputElement>document.getElementById("SelectColorYen")).value = this.setting_items.character_inserter_settings.Yen_Color;	
		}
																						},
		{Text : " | View 『Kita』 Settings [Customizable]", ListenerFunc :		(a_id) => {
			this.clearContainer();
			
			var disposable_container = document.createElement("DIV");
			disposable_container.setAttribute("id", "disposable_container");
			this.contents_div.appendChild(disposable_container);	
			disposable_container.innerHTML = 
			`								
				<script src="http://jscolor.js"></script>
				<label>Kita Characters: </label>
				<input name="selectiveCharacter" id="selectiveCharacters" type="text" value="ｷﾀ━━━(ﾟ∀ﾟ)━━━!!">
				<br>
				<label>RGB Hex Color: </label>
				<input name="HexColorKita" id="HexColorKita_text" type="text">
				<input name="HexColorKita" id="SelectColorKita" type="color">
				<br>
				<input id="setCharacter" value="Set Character Settings" type="button">
			`;
			document.getElementById("SelectColorKita").addEventListener("input", (evt) => {
				(<HTMLInputElement>document.getElementById("HexColorKita_text")).value = 
					((<HTMLInputElement>document.getElementById("SelectColorKita")).value);
				});
			document.getElementById("setCharacter").addEventListener("click", (e) =>{
					this.storeStates();
					this.clearContainer();
					this.rebuildContainer();

});	
			if(this.setting_items.character_inserter_settings.Kita_Character !== undefined)
				(<HTMLInputElement>document.getElementById("selectiveCharacters")).value = this.setting_items.character_inserter_settings.Kita_Character;
			if(this.setting_items.character_inserter_settings.Kita_Color !== undefined)
				(<HTMLInputElement>document.getElementById("HexColorKita_text")).value = this.setting_items.character_inserter_settings.Kita_Color;	
			(<HTMLInputElement>document.getElementById("SelectColorKita")).value = this.setting_items.character_inserter_settings.Kita_Color;	
		}																						
																						},
		{Text : " | Set 『Visible Password』", ListenerFunc : 				(input_id) => {
			this.storeStates();
		}																					},
	]
	
	setting_items:any = {};
	
	constructor(){
		super();
		this.retrieveStates();
		this.init();
		this.activate();
	}
	
	setImageAdderFields(){
		(<HTMLInputElement>document.getElementById("width_DIA")).value = this.setting_items.image_adder_settings.Width;
		(<HTMLInputElement>document.getElementById("height_DIA")).value = this.setting_items.image_adder_settings.Height;
		(<HTMLInputElement>document.getElementById("qr_width_DIA")).value = this.setting_items.image_adder_settings.QR_Width;

		if		((<HTMLInputElement>document.getElementById("width_DIA")).value == "489") (<HTMLInputElement>document.getElementById("v_large_DIA")).checked = true;	
		else if((<HTMLInputElement>document.getElementById("width_DIA")).value == "400") (<HTMLInputElement>document.getElementById("large_DIA")).checked = true;
		else if((<HTMLInputElement>document.getElementById("width_DIA")).value == "300") (<HTMLInputElement>document.getElementById("medium_DIA")).checked = true;
		else if((<HTMLInputElement>document.getElementById("width_DIA")).value == "200") (<HTMLInputElement>document.getElementById("small_DIA")).checked = true;
	}
	
	setImageAdderEventListeners():void{
		(<HTMLInputElement>document.getElementById("v_large_DIA")).addEventListener("click", function(){
			(<HTMLInputElement>document.getElementById("width_DIA")).value = "489";
			(<HTMLInputElement>document.getElementById("height_DIA")).value = "489";
		});

		(<HTMLInputElement>document.getElementById("large_DIA")).addEventListener("click", function(){
			(<HTMLInputElement>document.getElementById("width_DIA")).value = "400";
			(<HTMLInputElement>document.getElementById("height_DIA")).value = "400";
		});
			
		(<HTMLInputElement>document.getElementById("medium_DIA")).addEventListener("click", function(){
			(<HTMLInputElement>document.getElementById("width_DIA")).value = "300";
			(<HTMLInputElement>document.getElementById("height_DIA")).value = "300";
		});

		
		(<HTMLInputElement>document.getElementById("small_DIA")).addEventListener("click", function(){
			(<HTMLInputElement>document.getElementById("width_DIA")).value = "200";
			(<HTMLInputElement>document.getElementById("height_DIA")).value = "200";
		});
		
		
		(<HTMLInputElement>document.getElementById("SetImageAdderProperties")).addEventListener("click", (evt) => {
			this.storeStates();
			this.clearContainer();
			this.rebuildContainer();
		});



	}

		//*...THIS
	retrieveStates():void{
		//values used to fill out data fields
		this.setting_items.image_hiding_settings  = {Expiration_Time: localStorage.getItem("Expiration_Time"), MD5_List_FSE: localStorage.getItem("MD5_List_FSE"), Active: localStorage.getItem("ImageHidingActive")};
		this.retrieveWordReplaceStates();
		this.retrieveImageAdderStates();
		this.retrieveRebuildStates();
		this.retrieveCharacterInsertingStates();
		this.setting_items.password_settings=(localStorage.getItem("PasswordActive"));
	}
	
	retrieveActiveToggles():void{
		if(localStorage.getItem("4F-FSE") === null){
			(<HTMLInputElement>document.getElementById("check-settings0")).checked = true;
			(<HTMLInputElement>document.getElementById("check-settings1")).checked = false;
			(<HTMLInputElement>document.getElementById("check-settings2")).checked = false;
			(<HTMLInputElement>document.getElementById("check-settings3")).checked = false;
			(<HTMLInputElement>document.getElementById("check-settings4")).checked = true;
			(<HTMLInputElement>document.getElementById("check-settings5")).checked = true;
			(<HTMLInputElement>document.getElementById("check-settings6")).checked = true;
			localStorage.setItem("4F-FSE", "Success");
			this.displayWindow();
			return;
		} 
		(<HTMLInputElement>document.getElementById("check-settings0")).checked = localStorage.getItem("ImageHidingActive") === 'true';
		(<HTMLInputElement>document.getElementById("check-settings1")).checked = localStorage.getItem("TextReplaceActive") === 'true';
		(<HTMLInputElement>document.getElementById("check-settings2")).checked = localStorage.getItem("ImageAdderActive") === 'true';
		(<HTMLInputElement>document.getElementById("check-settings3")).checked = localStorage.getItem("ThreadRebuilderActive") === 'true';
		(<HTMLInputElement>document.getElementById("check-settings4")).checked = localStorage.getItem("YenActive") === 'true';
		(<HTMLInputElement>document.getElementById("check-settings5")).checked = localStorage.getItem("KitaActive") === 'true';
		(<HTMLInputElement>document.getElementById("check-settings6")).checked = localStorage.getItem("PasswordActive") === 'true';
	}
	
	retrieveWordReplaceStates():void{
		//acquire text filter representation
		var storage_index:number = 0;
		var JSON_storage:any = {};
		var storage_key:string;
		var text_filters:any[] = [];
		var local_store_len = window.localStorage.length;
		while(storage_index < local_store_len) {
			storage_key = window.localStorage.key(storage_index);
			JSON_storage[storage_key] = window.localStorage.getItem(storage_key);
			storage_index++;
		}
		var filters:string[] = Generics.getJSONPropertiesByKeyName(JSON_storage,"[0-9]+FLT");
		filters.sort();
		filters.forEach((filter) => {
			text_filters.push(TextReplacer.formatFilterSettings(JSON_storage[filter]));
		});
		
		this.setting_items.word_replace_settings = {Number_of_Filters: localStorage.getItem("filter_quantity"), Text_Filter_List: text_filters, Active:localStorage.getItem("TextReplaceActive")};
	}
	
	retrieveImageAdderStates():void{
		this.setting_items.image_adder_settings =  {Width: localStorage.getItem("width_DIA"),
													Height: localStorage.getItem("height_DIA"), 
													QR_Width: localStorage.getItem("qr_width_DIA"),
													Active:localStorage.getItem("ImageAdderActive")};
		
		if(this.setting_items.image_adder_settings.Height === null) this.setting_items.image_adder_settings.Height = 400;
		if(this.setting_items.image_adder_settings.Width === null) this.setting_items.image_adder_settings.Width = 400;
		if(this.setting_items.image_adder_settings.QR_Width === null) this.setting_items.image_adder_settings.QR_Width = 480;
		
		(<HTMLInputElement>document.getElementById("fourchanx-css")).textContent += ".qr-preview { height:" +  this.setting_items.image_adder_settings.Height + "px; width: " + this.setting_items.image_adder_settings.Width +  "px; left:8%;background-size: cover;}";
		(<HTMLInputElement>document.getElementById("fourchanx-css")).textContent += "#dump-list { min-height: " + (this.setting_items.image_adder_settings.Width - 20) +  "px; width: " + (this.setting_items.image_adder_settings.QR_Width) + "px;}";
		
	}
	
	retrieveRebuildStates():void{
		if(localStorage.getItem("ArchiveType_FSE") !== "1" && localStorage.getItem("ArchiveType_FSE") !== "0") localStorage.setItem("ArchiveType_FSE", "1");
		this.setting_items.thread_rebuild_settings = {Archive_Type: localStorage.getItem("ArchiveType_FSE"), Active:localStorage.getItem("ThreadRebuilderActive")};
	}
	
	retrieveCharacterInsertingStates():void{
        if (localStorage.getItem("Yen_Character") === undefined || localStorage.getItem("Yen_Character") === null) localStorage.setItem("Yen_Character", "¥");
        if (localStorage.getItem("Yen_Color") === undefined || localStorage.getItem("Yen_Color")  === null) localStorage.setItem("Yen_Color", "#9370DB");
        if (localStorage.getItem("Kita_Character") === undefined || localStorage.getItem("Kita_Character") === null) localStorage.setItem("Kita_Character", "ｷﾀ━━━(ﾟ∀ﾟ)━━━!!");
        if (localStorage.getItem("Kita_Color") === undefined || localStorage.getItem("Kita_Color") === null)localStorage.setItem("Kita_Color", "#444444");
		
		this.setting_items.character_inserter_settings = {Yen_Active: localStorage.getItem("YenActive"), Yen_Character: localStorage.getItem("Yen_Character"), Yen_Color: localStorage.getItem("Yen_Color"),
													Kita_Active: localStorage.getItem("KitaActive"), Kita_Character:localStorage.getItem("Kita_Character"), Kita_Color: localStorage.getItem("Kita_Color")};
													
	}
	
	storeStates():void{
		//image settings
		this.storeImageFilterStates();	
		//Text replace settings
		this.storeTextFilterStates();	
		//Image Adder settings
		this.storeImageAdderStates();
		//Thread rebuild settings
		this.storeRebuildStates();
		//character inserter
		this.storeCharacterInserterStates();
		//Password replace settings
		this.storePasswordStates()
	
		this.retrieveStates();
	}
	
	storeActiveToggles():void{
		localStorage.setItem("ImageHidingActive", ((<HTMLInputElement>document.getElementById("check-settings0")).checked.toString()));
		localStorage.setItem("TextReplaceActive", ((<HTMLInputElement>document.getElementById("check-settings1")).checked.toString()));
		localStorage.setItem("ImageAdderActive", ((<HTMLInputElement>document.getElementById("check-settings2")).checked.toString()));
		localStorage.setItem("ThreadRebuilderActive", ((<HTMLInputElement>document.getElementById("check-settings3")).checked.toString()));
		localStorage.setItem("YenActive", ((<HTMLInputElement>document.getElementById("check-settings4")).checked.toString()));
		localStorage.setItem("KitaActive", ((<HTMLInputElement>document.getElementById("check-settings5")).checked.toString()));
		localStorage.setItem("PasswordActive", ((<HTMLInputElement>document.getElementById("check-settings6")).checked.toString()));
	}
	
	storeImageFilterStates():void{
		if(document.getElementById("Expiration_Time") !== null){
			var time:any = document.getElementById("Expiration_Time");
			var millisecond_time:number = parseInt((<HTMLInputElement>time).value) * Constants.MILLISECONDS_TO_THE_HOUR;
			if (millisecond_time == 0 || millisecond_time === null || millisecond_time === undefined) millisecond_time = Constants.DEFAULT_HIDE_EXPIRATION_TIME;
			localStorage.setItem("Expiration_Time", millisecond_time.toString());
			var md5_filters = (<HTMLInputElement>document.getElementById("MD5_List_FSE")).value;
			localStorage.setItem("MD5_List_FSE", md5_filters);
			Generics.alert4ChanX("Image Settings Saved", "success", 3);
		}
		
	}
	
	storeTextFilterStates():void{
		if(document.getElementById("FilterRow0") !== null){		
			var f_row_moving:any = document.getElementById("FilterRow0");
			var Number_of_Filters:number = 0;
			var Number_of_Filters_actual:number = 0;
			while(f_row_moving.nextSibling !== null){
				if((<HTMLInputElement>document.getElementById("Pattern" + Number_of_Filters)).value !== "") Number_of_Filters_actual++;
				Number_of_Filters++;
				f_row_moving = f_row_moving.nextSibling;
			}			
			window.localStorage.setItem("filter_quantity", Number_of_Filters_actual.toString());
			
			for (var pattern_input:number = 0 ; pattern_input < Number_of_Filters; pattern_input++){
				var pattern_to_store:string = (<HTMLInputElement>document.getElementById("Pattern"+pattern_input)).value;
				var replacement_to_store:string = (<HTMLInputElement>document.getElementById("Replacement"+pattern_input)).value;
				var setting:string = 'g';
				try{
					if(pattern_to_store === "") {
						localStorage.removeItem(pattern_input + "FLT");
						continue;
					}
					else if(new RegExp("^\/.*\/\\D+$").test(pattern_to_store)){}
					else if (new RegExp("^\/.*\/$").test(pattern_to_store)){
						pattern_to_store = pattern_to_store + setting;
					}
					else if(!new RegExp("^/.*\/\\D$").test(pattern_to_store)){
						pattern_to_store = "/" + pattern_to_store + "/" + setting;
					} 
					 //test for breakages, try to cause error
					 var error_test:any = new RegExp(
								pattern_to_store.substring(0, pattern_to_store.lastIndexOf("/") + 1),
								pattern_to_store.substring(pattern_to_store.lastIndexOf("/") + 1)
								);
				 }
				 catch(e){
					Generics.alert4ChanX("Unrecoverable Regex error on pattern " + pattern_input + " for " + pattern_to_store, "error", undefined);
					continue;
				 }
				pattern_to_store = encodeURIComponent(pattern_to_store);
				var save_string:string = (<HTMLInputElement>document.getElementById("Active"+pattern_input)).checked + '=' + pattern_to_store + '=' + replacement_to_store;
				window.localStorage.setItem(pattern_input + "FLT", save_string);
			}
			Generics.alert4ChanX("Wordfilters Updated!", "success", 3);
		}
	}
	
	storeImageAdderStates():void{
if(document.getElementById("SetImageAdderProperties") !== null){
		var width:string = (<HTMLInputElement>document.getElementById("width_DIA")).value;	
		localStorage.setItem("width_DIA", width);
		
		var height:string = (<HTMLInputElement>document.getElementById("height_DIA")).value;	
		localStorage.setItem("height_DIA", height);
		
		var qr_width:string = (<HTMLInputElement>document.getElementById("qr_width_DIA")).value;	
		localStorage.setItem("qr_width_DIA", qr_width);
		
}
	}
	
	storeRebuildStates():void{
		if(document.getElementById("setArchive") !== null){
			localStorage.setItem("ArchiveType_FSE", (<HTMLInputElement>document.getElementById("OffsiteArchive")).checked === true ? "0" : "1");
		}
	}
	
	storeCharacterInserterStates():void{
		if(document.getElementById("setCharacter") !== null){
			localStorage.setItem("Kita_Character", (<HTMLInputElement>document.getElementById("selectiveCharacters")).value);
			localStorage.setItem("Kita_Color", (<HTMLInputElement>document.getElementById("HexColorKita_text")).value);
		}
		else if(document.getElementById("setQuote") !== null){
			localStorage.setItem("Yen_Character", (<HTMLInputElement>document.getElementById("quoteCharacter")).value);
			localStorage.setItem("Yen_Color", (<HTMLInputElement>document.getElementById("HexColorYen_text")).value);
		}	
	}
	
	storePasswordStates():void{
			//password view settings
		if(document.getElementById("check-settings6") !== null)
		localStorage.setItem("PasswordActive", `${(<HTMLInputElement>document.getElementById("check-settings6")).checked}`);		
	}
	
	clearContainer():void{
		var disposable = document.getElementById("disposable_container");
		if(disposable !== null) this.contents_div.removeChild(disposable);
		else this.contents_div.removeChild(this.ul_selection_start);
	}
	
	rebuildContainer(){
		this.contents_div.appendChild(this.ul_selection_start);
	}
	
	init(){
		this.settings_style.innerHTML = `.inputs{
											background-color:rgb(200,200,200);margin:5px 7px;width:100px;
										}
										.SettingsBackground{
											position:fixed;width:100%;height:100%;background-color:rgba(200,200,200,0.3);top:0;left:0; z-index:9
										}
										.settingsItem{
											font-size:18px;list-style:katakana-iroha outside;padding:2px;color:#2e2345;
										}
										.settingsItem input{
											transform: scale(1.2);
										}
										.settingsMain{
											border:solid 1px black;position:fixed;background-color:rgb(200,200,200);left:40%;top:20%;margin-bottom:0; z-index:10
										}
										.closeIcon{
											border:solid 1px black;position:absolute;width:25px;height:25px;background-color:rgba(255,100,90,0.9); right:3px;top:3px; z-index:10
										}
										.titleStyle{
											font-size: 20px;padding: 12px 0px 9px 22px
										}
										.tooltip-4F{
											z-index:9;padding:5px;border:1px solid black;background-color:white;word-wrap:break-word;display:none;position:absolute;
										}
										.help_icon{
											height:22.5px;margin:-4px 10px
										}
										.footerStyle{
											padding-left: 12px;
										}
										.contentStyle{
											background-color:white;margin:0 0;padding:5px 25px;
										}`;

		this.background_div.setAttribute('class', 'SettingsBackground');
		this.background_div.setAttribute('id', 'SettingsBackground');
		this.background_div.setAttribute('style','display:none');
		
		this.settings_div.setAttribute('class', 'settingsMain');
		this.settings_div.setAttribute('id', 'settingsWindow');
		this.settings_div.setAttribute('style', 'display:none;width:500px');
		
		this.close_link.setAttribute('href','javascript:void(0)');

		this.close_div.setAttribute('class', 'closeIcon');
		this.close_div.addEventListener('click', evt => this.hideWindow());
		
		this.title_para.setAttribute('class', 'titleStyle');

		this.contents_div.setAttribute('class','contentStyle');

		this.end_para.setAttribute('class', 'footerStyle');
				
		this.ul_selection_start.setAttribute("ID", "selection_list");
		this.generateList(this.contents_div);
	}
	
	generateList(head_node:any):void{			
		this.list_items.forEach((list_item, index) => {
			var li = document.createElement('LI');
			li.setAttribute('class', 'settingsItem');
			if(list_item.Text.indexOf('View') > -1){
				var input:any = document.createElement('INPUT');
				var input_id:string = 'check-settings' + index;
				input.setAttribute('TYPE','checkbox');
				input.setAttribute('ID', 'check-settings' + index);
				li.appendChild(input);		
				input.addEventListener('click', (evt) => this.storeActiveToggles());
					
				var a:any =  document.createElement('A');
                a.setAttribute('href','javascript:void(0)');
				a.textContent = list_item.Text;
				var a_id = 'tab-settings' + index;
				a.setAttribute('ID', 'tab-settings' + index);
				var setup_func =(_a_id) => {
					a.addEventListener('click', (evt) => list_item.ListenerFunc(_a_id ));
					li.appendChild(a);
					this.ul_selection_start.appendChild(li);
				}
				setup_func(a_id);
			}
			else{
				var input:any = document.createElement('INPUT');
				var input_id:string = 'check-settings' + index;
				input.setAttribute('TYPE','checkbox');
				input.setAttribute('ID', 'check-settings' + index);
				input.addEventListener('click', (evt) => this.storeActiveToggles());

				var label:any =  document.createElement('LABEL');
				label.appendChild(input);	
				var label_text = document.createTextNode(list_item.Text);	
				label.appendChild(label_text);
				li.appendChild(label);
				this.ul_selection_start.appendChild(li);
				
				(<HTMLInputElement>input).checked = this.setting_items.password_settings == 'true';
				var setup_func = (input_id) => {
					label.addEventListener('click',(evt) => list_item.ListenerFunc(input_id));
				};
				setup_func(input_id);
			}
		});
	}
	
	activate():void{
		document.body.appendChild(this.settings_style);
		this.background_div.addEventListener('click', evt => this.hideWindow());
		document.body.appendChild(this.background_div);
		this.settings_div.appendChild(this.close_link);
		this.close_link.appendChild(this.close_div);
		this.title_para.appendChild(this.title_text);
		this.settings_div.appendChild(this.title_para);
		this.settings_div.appendChild(this.contents_div);		
		this.contents_div.appendChild(this.ul_selection_start);
		this.end_para.appendChild(this.end_text);
		this.settings_div.appendChild(this.end_para);
		document.body.appendChild(this.settings_div);
		this.retrieveActiveToggles();
	}
	decideAction(node:any):void{}
	
	getSettingsArr():Object{
		return this.setting_items;
	}
	
	displayWindow():void{
		this.background_div.style.display = 'block';
		this.settings_div.style.display = 'block';
		this.rebuildContainer();
	}
	
	hideWindow():void{
		this.background_div.style.display = 'none';
		this.settings_div.style.display = 'none';
		this.clearContainer();
	}
		
	filterWindow(disposable_container:any):void{
		var filter_table:any = document.createElement("table");
		filter_table.setAttribute("style", "text-align:center;");
		filter_table.setAttribute("id", "filter_table");
		disposable_container.appendChild(filter_table);

		var top_row = document.createElement("TR");
		filter_table.appendChild(top_row);
		
		var table_head_active:any =  document.createElement("th");
		top_row.appendChild(table_head_active);
		var head_text_active:any = document.createTextNode("Active");
		table_head_active.appendChild(head_text_active);
		var table_head_pattern:any =  document.createElement("th");
		top_row.appendChild(table_head_pattern);
		var headTextPattern:any = document.createTextNode("Pattern");
		table_head_pattern.appendChild(headTextPattern);
		var table_head_replacement:any =  document.createElement("th");
		top_row.appendChild(table_head_replacement);
		var head_text_replacement:any = document.createTextNode("Replacement");
		table_head_replacement.appendChild(head_text_replacement);

		//Create the pattern table
		//loop to create rows
		var Number_of_Filters:number = parseInt(this.setting_items.word_replace_settings.Number_of_Filters);
		console.log(Number_of_Filters);
		if (Number_of_Filters === 0 || isNaN(Number_of_Filters)) Number_of_Filters = 6;
		for (var i = 0; i <  Number_of_Filters ; i++){
			var table_row_contents:any = document.createElement("tr");
			table_row_contents.setAttribute("id", "FilterRow" + i);

			var table_data_active:any =  document.createElement("td");
			var table_checkbox_active:any = document.createElement("input");
			table_checkbox_active.setAttribute("type", "checkbox");
			table_checkbox_active.setAttribute("id", "Active" + i);
			table_data_active.appendChild(table_checkbox_active);
			table_row_contents.appendChild(table_data_active);

			var table_data_pattern:any =  document.createElement("td");
			var table_input_pattern:any = document.createElement("input");
			table_input_pattern.setAttribute("class", "inputs");
			table_input_pattern.setAttribute("id", "Pattern" + i);
			table_data_pattern.appendChild(table_input_pattern);
			table_row_contents.appendChild(table_data_pattern);

			var table_data_replacement:any =  document.createElement("td");
			var table_input_replacement:any =  document.createElement("input");
			table_input_replacement.setAttribute("class", "inputs");
			table_input_replacement.setAttribute("id", "Replacement" + i);
			table_data_replacement.appendChild(table_input_replacement);
			table_row_contents.appendChild(table_data_replacement);

			filter_table.appendChild(table_row_contents);
		}

		var table_last_contents:any = document.createElement("tr");

		var table_add_collumn:any =  document.createElement("td");
		var table_add_row_button:any = document.createElement("input");
		var table_subtract_row_button:any = document.createElement("input");
		table_subtract_row_button.setAttribute("type", "button");
		table_subtract_row_button.setAttribute("value", "-");
		table_subtract_row_button.setAttribute("style", "padding: 7px 0; margin:5px 0;");
		table_add_collumn.appendChild(table_subtract_row_button);
		table_subtract_row_button.addEventListener("click", (evt) => this.filterRemoveRow());
		table_add_row_button.setAttribute("type", "button");
		table_add_row_button.setAttribute("value", "+");
		table_add_row_button.setAttribute("style", "padding: 7px 0; margin:5px 0;");
		table_add_collumn.appendChild(table_add_row_button);
		table_add_row_button.addEventListener("click", (evt) => this.filterAddRow());

		table_last_contents.appendChild(table_add_collumn);

		var table_set_collumn:any =  document.createElement("td");
		var table_confirm_button:any = document.createElement("input");
		table_confirm_button.setAttribute("type", "button");
		table_confirm_button.setAttribute("id", "table_confirm_button");
		table_confirm_button.setAttribute("value", "Set Replacements");
		table_confirm_button.setAttribute("style", "padding: 7px 0; margin:5px 0;");
		
		//event listeners
		table_confirm_button.addEventListener("click", (evt) => {
			this.storeStates();
			this.clearContainer();
			this.rebuildContainer();
		});
		
		table_set_collumn.appendChild(table_confirm_button);
		table_last_contents.appendChild(table_set_collumn);

		var table_close_collumn:any = document.createElement("td");
		var table_close_button:any = document.createElement("input");
		table_close_button.setAttribute("type", "button");
		table_close_button.setAttribute("value", "Close Without Saving");
		table_close_button.setAttribute("style", "padding: 7px 0; margin:5px 0;");
		table_close_button.addEventListener("click", (evt) => {
			this.clearContainer();
			this.rebuildContainer();
		});
		table_close_collumn.appendChild(table_close_button);
		table_last_contents.appendChild(table_close_collumn);

		filter_table.appendChild(table_last_contents);
	}
	
	filterAddRow():void{
		var filter_table:any = document.getElementById("filter_table");
		var Number_of_Filters = 0;
		var filter_children = document.getElementById("filter_table").firstChild;
		while(filter_children.nextSibling){
			filter_children = filter_children.nextSibling;
			Number_of_Filters++
		} 
		
		
		var table_row_contents:any = document.createElement("tr");
		table_row_contents.setAttribute("id", "FilterRow" +  (Number_of_Filters - 1));
		filter_table.removeChild(filter_children);
		
		var table_data_active:any =  document.createElement("td");
		var table_checkbox_active:any = document.createElement("input");
		table_checkbox_active.setAttribute("type", "checkbox");
		table_checkbox_active.setAttribute("id", "Active" + (Number_of_Filters- 1));
		table_data_active.appendChild(table_checkbox_active);
		table_row_contents.appendChild(table_data_active);

		var table_data_pattern:any =  document.createElement("td");
		var table_input_pattern:any = document.createElement("input");
		table_input_pattern.setAttribute("class", "inputs");
		table_input_pattern.setAttribute("id", "Pattern" + (Number_of_Filters- 1));
		table_data_pattern.appendChild(table_input_pattern);
		table_row_contents.appendChild(table_data_pattern);

		var table_data_replacement:any =  document.createElement("td");
		var table_input_replacement:any =  document.createElement("input");
		table_input_replacement.setAttribute("class", "inputs");
		table_input_replacement.setAttribute("id", "Replacement" + (Number_of_Filters- 1));
		table_data_replacement.appendChild(table_input_replacement);
		table_row_contents.appendChild(table_data_replacement);

		filter_table.appendChild(table_row_contents);

		var table_last_contents:any = document.createElement("tr");

		var table_add_collumn:any =  document.createElement("td");
		var table_add_row_button:any = document.createElement("input");
		var table_subtract_row_button:any = document.createElement("input");
		table_subtract_row_button.setAttribute("type", "button");
		table_subtract_row_button.setAttribute("value", "-");
		table_subtract_row_button.setAttribute("style", "padding: 7px 0; margin:5px 0;");
		table_add_collumn.appendChild(table_subtract_row_button);
		table_subtract_row_button.addEventListener("click", (evt) => this.filterRemoveRow());
		table_add_row_button.setAttribute("type", "button");
		table_add_row_button.setAttribute("value", "+");
		table_add_row_button.setAttribute("style", "padding: 7px 0; margin:5px 0;");
		table_add_collumn.appendChild(table_add_row_button);
		table_add_row_button.addEventListener("click", (evt) => this.filterAddRow());

		table_last_contents.appendChild(table_add_collumn);

		var table_set_collumn:any =  document.createElement("td");
		var table_confirm_button:any = document.createElement("input");
		table_confirm_button.setAttribute("type", "button");
		table_confirm_button.setAttribute("id", "table_confirm_button");
		table_confirm_button.setAttribute("value", "Set Replacements");
		table_confirm_button.setAttribute("style", "padding: 7px 0; margin:5px 0;");
		//event listeners
		table_confirm_button.addEventListener("click", (evt) => {
			this.storeStates();
			this.clearContainer();
			this.rebuildContainer();
		});
		
		table_set_collumn.appendChild(table_confirm_button);
		table_last_contents.appendChild(table_set_collumn);

		var table_close_collumn:any = document.createElement("td");
		var table_close_button:any = document.createElement("input");
		table_close_button.setAttribute("type", "button");
		table_close_button.setAttribute("value", "Close Without Saving");
		table_close_button.setAttribute("style", "padding: 7px 0; margin:5px 0;");
		table_close_button.addEventListener("click", (evt) => {
			this.clearContainer();
			this.rebuildContainer();
		});
		table_close_collumn.appendChild(table_close_button);
		table_last_contents.appendChild(table_close_collumn);

		filter_table.appendChild(table_last_contents);
	}

	filterRemoveRow():void{
		var filter_table:any = document.getElementById("filter_table");
		var Number_of_Filters = 0;
		var filter_children = document.getElementById("filter_table").firstChild;
		while(filter_children.nextSibling){
			filter_children = filter_children.nextSibling;
			Number_of_Filters++
		} 
		if(Number_of_Filters != 2){
			filter_table.deleteRow(--Number_of_Filters);
		}
	}

	filterSetTable():void{
		var filter_length = this.setting_items.word_replace_settings.Number_of_Filters; 
		for (var filter_count:number = 0 ; filter_count < filter_length ; filter_count++){
			if(
				this.setting_items.word_replace_settings.Text_Filter_List[filter_count].Active === null || 
				this.setting_items.word_replace_settings.Text_Filter_List[filter_count].Regex === null ||
				this.setting_items.word_replace_settings.Text_Filter_List[filter_count].Replacement === null) return;
				
			if(this.setting_items.word_replace_settings.Text_Filter_List[filter_count].Active === "true"){
				(<HTMLInputElement>document.getElementById("Active"+filter_count)).checked = true;
			}
			else{
				(<HTMLInputElement>document.getElementById("Active"+filter_count)).checked = false;
			}
			(<HTMLInputElement>document.getElementById("Pattern"+filter_count)).value = 
											this.setting_items.word_replace_settings.Text_Filter_List[filter_count].Regex;
			(<HTMLInputElement>document.getElementById("Replacement"+filter_count)).value = 
											this.setting_items.word_replace_settings.Text_Filter_List[filter_count].Replacement;
		}
	}
						
}