class Password{
	post_id: string = "postPassword";
	del_id: string = "delPassword";
	post_pass: string;
	del_pass: string;
	
	node_post: any;
	label_post: any;
	node_post_parent:any;
	
	node_del: any;
	node_del_parent:any;
	label_del: any;
	constructor(){
		this.node_post = document.getElementById(this.post_id);
		this.label_post = document.createElement("P");
		this.label_post.textContent = "Post: ";
		this.node_post_parent = this.node_post.parentNode;
		this.post_pass = this.node_post.value;
		
		this.node_del = document.getElementById(this.del_id);
		this.label_del = document.createElement("P");
		this.label_del.textContent = "| Delete: "
		this.node_del_parent = this.node_del.parentNode;
		this.del_pass = this.node_del.value;
	}
	
	display():void{
		this.node_post.removeAttribute("type");
		this.node_del.removeAttribute("type");

		this.node_post_parent.insertBefore(this.label_post, this.node_post);
		this.node_del_parent.insertBefore(this.label_del, this.node_del);
		
		this.node_del.style.display = "block";		
		this.label_del.style.display = "block";	
		(<HTMLElement>document.getElementsByClassName("deleteform")[0]).style.display = "block";		
	}
	
}