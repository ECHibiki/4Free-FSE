class Main{
	constructor(){
		this.init();
	}
	init():void{
		var top_bar = new TopBar();	
		top_bar.build();
		var settings:any[] = top_bar.getSettingsArr();
		if(settings[6].VALUE == "true"){
			var password = new Password();
			password.display();
		}
	}
}

document.addEventListener("4chanXInitFinished", function(){new Main();});
