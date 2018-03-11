abstract class FeatureInterface{
	abstract init():void;
	abstract retrieveStates():void;
	abstract storeStates(...items:any[]):void;
	abstract activate():void;
	abstract decideAction(node:any):void;
}