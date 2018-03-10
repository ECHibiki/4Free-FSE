class TopBar{
	shortcuts_container:any  = document.getElementById("shortcuts");
	shortcuts_menu:any = document.getElementById("shortcut-menu");
	fse_icon_container: any = document.createElement("SPAN");
	fse_icon_node: any = document.createElement("A");
	
	fse_style_node: any = document.createElement("STYLE");
	fa_fse_style: string = ".fa_jpy::before{content:'\f157'}";
	
	settings_window: any;
	constructor(){	
		this.fse_style_node.innerHTML = this.fa_fse_style;	
		this.fse_icon_container.setAttribute("class", "shortcut brackets-wrap");
		this.fse_icon_node.setAttribute("class","fa fa-jpy");
		this.fse_icon_node.setAttribute("href","javascript:void(0);");
		this.fse_icon_node.setAttribute("title", "4F-FSE Settings");
		this.fse_icon_node.textContent = "4F-FSE Settings";
		this.settings_window = new SettingsWindow();
		
	}
	build():void{
		document.head.appendChild(this.fse_style_node)
		this.fse_icon_container.appendChild(this.fse_icon_node);
		this.shortcuts_container.insertBefore(this.fse_icon_container, this.shortcuts_menu);
		//https://stackoverflow.com/questions/44606399/typescript-how-to-access-the-class-instance-from-event-handler-method
		this.fse_icon_node.addEventListener("click", evt => this.open4FSettings(this.settings_window));
	}
	open4FSettings(settings_window):void{
		settings_window.displayWindow();
	}
	
	getSettingsArr():Object[]{
		return this.settings_window.getSettingsArr();
	}
}