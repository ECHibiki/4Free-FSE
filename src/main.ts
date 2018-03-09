class Main{
	constructor(){
		this.init();
	}
	init():void{
		var password = new Password();
		password.display();
	}
}

document.addEventListener("4chanXInitFinished", function(){new Main();});
