class TextReplacer extends FeatureInterface{
	
	constructor(){
		super();
		this.activate();
	}
	
	init():void{};
	
	activate():void{console.log("4F-FSE: TextReplacer Active");}
	
	decideAction(node:any):void{}
	
	retrieveStates():void{}
	storeStates():void{}
}