class Password{
	post_id: string = "postPassword";
	del_id: string = "delPassword";
	
	node_post: any;
	node_del: any;
	previous_node_post: any;
	previous_node_del: any;
	constructor(){
		this.node_post = document.getElementById(this.post_id);
		this.previous_node_post = document.createElement("LABEL");
		this.previous_node_post.textContent = "Post Password: ";
		
		this.node_del = document.getElementById(this.del_id);
		this.previous_node_del = document.createElement("LABEL");
		this.previous_node_del.textContent = "Devare Password: "
	}
	
	display():void{
		this.node_post.removeAttribute("type");	
		this.node_post.insertBefore(this.previous_node_post);
		this.node_del.removeAttribute("type");
		this.node_post.insertBefore(this.previous_node_del);
	}
	
}