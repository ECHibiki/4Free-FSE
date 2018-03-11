class PasswordViewer extends FeatureInterface{
	post_id: string = "postPassword";
	del_id: string = "delPassword";
	
	node_post: any;
	label_post: any = document.createElement('LABEL');
	node_post_parent:any;
	
	node_del: any;
	label_del: any = document.createElement('LABEL');
	node_del_parent:any;
	constructor(){
		super();
		this.init();
		this.activate();
	}
	
	init():void{
		this.node_post = document.getElementById(this.post_id);
		this.node_del = document.getElementById(this.del_id);
		this.node_post_parent = this.node_post.parentNode;
		this.node_del_parent = this.node_del.parentNode;
		this.label_post.textContent = 'Post: ';
		this.label_del.textContent = 'Delete: '
	}
	
	//activate displays passwords
	activate():void{
		console.log("4F-FSE: PasswordViewer Active");
		this.node_post_parent.insertBefore(this.label_post, this.node_post);
		this.node_del_parent.insertBefore(this.label_del, this.node_del);
		
		this.node_post.removeAttribute('type');
		this.node_del.removeAttribute('type');
		(<HTMLElement>document.getElementsByClassName('deleteform')[0]).style.display = 'inline';		
		this.node_del.style.display = 'inline';		
		this.label_del.style.display = 'inline';	
		this.label_del.style.paddingLeft = '10px';	
	}
	
	decideAction(node:any):void{}
	retrieveStates():void{};
	storeStates():void{};
	
}