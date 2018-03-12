class Main extends FeatureInterface{
	features:any = {};/*;any bypasses dot notation issues on objects*/
	settings:any = {};
	
	constructor(){
		super();
		if(!Generics.storageAvailable('localStorage')) {alert("4F-FSE: local storage error"); return;}
		else this.activate();	
		this.retrieveStates();
		this.init();
		this.decideAction();
		this.observeEvents();
	}
	

	retrieveStates(){
		var top_bar = new TopBar();	
		top_bar.build();
		this.settings = top_bar.getSettingsArr();
	}
	
	init():void{	
		if(true){
			this.features.image_hider = new ImageHider();
		}
		if(true){
			this.features.image_replacer = new TextReplacer();
		}
		if(this.settings.password_settings == 'true'){
			this.features.text_replacer = new PasswordViewer();
		}
	}
	
	activate(){ console.log("4F-FSE Starting");	}
	storeStates(){}
	
	observeEvents():void{
		document.addEventListener('PostsInserted', evt => this.decideAction());
	}
	decideAction():void{
		var start:any = document.getElementById('delform');
		var itterator:any = document.createNodeIterator(start, NodeFilter.SHOW_ELEMENT);
		var node:any;

		for(let feature_key in this.features)
			this.features[feature_key].retrieveStates();
		
		while((node = itterator.nextNode())){
			for(let feature_key in this.features)
				this.features[feature_key].decideAction(node);
		}
	}
}

document.addEventListener('4chanXInitFinished', function(){new Main();});

