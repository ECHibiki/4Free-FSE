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
		{Text : "View 『Image Hiding』 Settings", ListenerFunc : 				(a_id) => {
			var item_container = document.getElementById(a_id).parentNode.parentNode.parentNode;
			this.clearContainer();
			(<Element>item_container).innerHTML = 
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
				(<HTMLInputElement>document.getElementById("Expiration_Time")).value = "" + (this.setting_items.image_hiding_settings.Expiration_Time / MILLISECONDS_TO_THE_HOUR);
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
		{Text : "View 『Word Replacement』 Settings", ListenerFunc : 			() => {}
																						},
		{Text : "View 『Danbooru Image Adder』 Settings", ListenerFunc :		() => {}
																						},
		{Text : "View 『Thread Rebuilder』 Settings", ListenerFunc : 			() => {}
																						},
		{Text : "View 『¥ Text』 Settings [Long Coloring]", ListenerFunc : 	() => {
			
																					}
																						},
		{Text : "View 『Kita』 Settings [Character Coloring]", ListenerFunc :	() => {}																						
																						},
		{Text : "Set 『Visible Password』 : ", ListenerFunc : 				(input_id) => {
			var input = document.getElementById(input_id);
			var is_check:boolean = !(<HTMLInputElement>input).checked;
			(<HTMLInputElement>document.getElementById(input_id)).checked = is_check;
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
	
		//*...THIS
	retrieveStates():void{
		this.setting_items.image_hiding_settings  = {Expiration_Time: localStorage.getItem("Expiration_Time"), MD5_List_FSE: localStorage.getItem("MD5_List_FSE")};
		this.setting_items.word_replace_settings = (localStorage.getItem("tab-settings2") == 'true');
		this.setting_items.image_adder_settings = (localStorage.getItem("tab-settings3") == 'true');
		this.setting_items.thread_rebuild_settings = (localStorage.getItem("tab-settings4") == 'true');
		this.setting_items.yen_settings = (localStorage.getItem("tab-settings5") == 'true');
		this.setting_items.kita_settings  = (localStorage.getItem("tab-settings6") == 'true');
		this.setting_items.password_settings=(localStorage.getItem("pw_active"));
	}
	
	storeStates():void{
		//image settings
		if(document.getElementById("Expiration_Time") !== null){
			var time:any = document.getElementById("Expiration_Time");
			var millisecond_time:number = parseInt((<HTMLInputElement>time).value) * MILLISECONDS_TO_THE_HOUR;
			if (millisecond_time == 0 || millisecond_time === null || millisecond_time === undefined) millisecond_time = DEFAULT_HIDE_EXPIRATION_TIME;
			localStorage.setItem("Expiration_Time", `${millisecond_time}`);
			var md5_filters = (<HTMLInputElement>document.getElementById("MD5_List_FSE")).value;
			localStorage.setItem("MD5_List_FSE", md5_filters);
		}
		
		//password view settings
		if(document.getElementById("check-settings6") !== null)
		localStorage.setItem("pw_active", `${(<HTMLInputElement>document.getElementById("check-settings6")).checked}`);
		
		this.retrieveStates();
	}
	
	clearContainer():void{
		var disposable = document.getElementById("disposable_container");
		if(disposable !== null) this.contents_div.removeChild(disposable);
		this.contents_div.appendChild(this.ul_selection_start);
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
											font-size:18px;list-style:katakana outside;padding:2px;color:#2e2345;
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
											margin-left:5px;margin-top:5px
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

		this.end_para.setAttribute('class', '');
				
		this.generateList(this.contents_div);
	}
	
	generateList(head_node:any):void{			
		this.list_items.forEach((list_item, index) => {
			var li = document.createElement('LI');
			li.setAttribute('class', 'settingsItem');
			if(list_item.Text.indexOf('View') > -1){
				var a:any =  document.createElement('A');
                a.setAttribute('href','javascript:void(0)');
				a.textContent = list_item.Text;
				var a_id = 'tab-settings' + index;
				a.setAttribute('ID', 'tab-settings' + index);
				var setup_func =(_a_id) => {
					a.addEventListener('click', (evt) => list_item.ListenerFunc(_a_id));
					li.appendChild(a);
					this.ul_selection_start.appendChild(li);
				}
				setup_func(a_id);
			}
			else{
				var label:any =  document.createElement('LABEL');
				label.textContent = list_item.Text;
				li.appendChild(label);
				
				var input:any = document.createElement('INPUT');
				var input_id:string = 'check-settings' + index;
				input.setAttribute('TYPE','checkbox');
				input.setAttribute('ID', 'check-settings' + index);
				li.appendChild(input);
				this.ul_selection_start.appendChild(li);
				(<HTMLInputElement>input).checked = this.setting_items.password_settings == 'true';
				var setup_func = (_input_id) => {
					label.addEventListener('click',(evt) => list_item.ListenerFunc(_input_id));
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
		this.end_para.appendChild(this.end_text);
		this.settings_div.appendChild(this.end_para);
		document.body.appendChild(this.settings_div);
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
	

}