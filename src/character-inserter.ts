class CharacterInserter extends FeatureInterface{
	
	use_kita:boolean;
	use_yen:boolean;
	
		kita_character:string = "ｷﾀ━━━(ﾟ∀ﾟ)━━━!!";
kita_hash_color:string = "#444444"
		yen_character:string = "¥";
yen_hash_color:string = "#9370DB";
	constructor(use_kita:boolean, use_yen:boolean){
		super();
		this.use_yen = use_yen;
		this.use_kita = use_kita;
		
		this.retrieveStates();
		this.init();
		this.activate();
	}
	
	init():void{
		this.addStyle();
		this.hotkeyListeners();
	}
	activate():void{			
		console.log("4F-FSE: CharacterInserter Active - " + (this.use_kita ? "Character Coloring+" : "") + (this.use_yen ?" Line Coloring" : ""));
	}
	decideAction(node:any):void{
		if(node.tagName == "BLOCKQUOTE")
			this.colorCharacters(node);
	}
	retrieveStates():void{
		if (localStorage.getItem("Yen_Character") === undefined || localStorage.getItem("Yen_Character") === null) this.yen_character = "¥";
		else this.yen_character = localStorage.getItem("Yen_Character");
				if (localStorage.getItem("Yen_Color") === undefined || localStorage.getItem("Yen_Color")  === null) this.yen_hash_color = "#9370DB";
		else this.yen_hash_color = localStorage.getItem("Yen_Color");
				if (localStorage.getItem("Kita_Character") === undefined || localStorage.getItem("Kita_Character") === null) this.kita_character = "ｷﾀ━━━(ﾟ∀ﾟ)━━━!!";
		else this.kita_character = localStorage.getItem("Kita_Character");
				if (localStorage.getItem("Kita_Color") === undefined || localStorage.getItem("Kita_Color") === null)this.kita_hash_color = "#444444";
		else this.kita_hash_color = localStorage.getItem("Kita_Color");
	}
	storeStates(...items:any[]):void{}

	
	//color styling
	addStyle():void{
		var style = document.createElement("STYLE");
		style.innerHTML = ".the_m_word{color:" + this.yen_hash_color + "} \n.the_k_word{color:" + this.kita_hash_color + "}";
		document.head.appendChild(style);
	}

	//hotkeys for kita and yen
	 hotkeyListeners():void{
		var listener_obj = {};
		
		window.addEventListener("keydown", (e)=>{
			listener_obj[e.keyCode] = true;

			var node = document.activeElement;
			if ((listener_obj[17] || listener_obj[91]) && listener_obj[75]){
				e.preventDefault();
				this.insertAtPos(node, this.kita_character);
			}
			if ((listener_obj[17] || listener_obj[91]) && listener_obj[220]){
				e.preventDefault();
				this.insertAtPos(node, this.yen_character);
			}
		}, {passive:false, capture:false, once:false});

		window.addEventListener("keyup", (e) => {
			listener_obj[e.keyCode] = false;
		}, {passive:false, capture:false, once:false});
	}

	insertAtPos(node, buzzwords):void{
		var sel_start = node.selectionStart;
		var sel_end = node.selectionEnd;

		var node_text = node.value;
		node.value = node_text.substr(0, sel_start) + buzzwords + node_text.substr(sel_end);

		node.selectionStart = sel_start + buzzwords.length;
		node.selectionEnd = sel_end + buzzwords.length;
	}
	
//insertion logic
	colorCharacters(root){
		if(root.nodeType !== Node.ELEMENT_NODE){
			return;
		}	
			if(root.textContent.indexOf(this.yen_character) <= -1 && root.textContent.indexOf(this.kita_character) <= -1){
				return;
			}
			
		var wbr = root.getElementsByTagName('WBR');
        var wbr_len = wbr.length;
        var wbr_indices = Array();
        function previousIndex(len){
            if(len > 0) return wbr_indices[len-1];
            else return 0;
        }
        for(var wbr_item = 0;wbr_item < wbr_len; wbr_item++){
            wbr_indices.push(wbr[wbr_item].previousSibling.length + previousIndex(wbr_item));
        }
        while(wbr.length){
            root.removeChild(wbr[wbr.length-1]);
        }
        root.normalize();
		
		var txtItterator = document.createNodeIterator(root, NodeFilter.SHOW_TEXT);
		var text_node;
		while((text_node = txtItterator.nextNode())){
			//disregard text inside of A tag links and already colored text
			if(text_node.parentNode.tagName == "A" || /the_[a-z]_word/g.test(text_node.parentNode.className)) continue;
			this.setColor(text_node, txtItterator);
		}
		
        //restart and add back the wbr
        var txtItterator = document.createNodeIterator(root, NodeFilter.SHOW_TEXT);
        var text_node;
        while ((text_node = txtItterator.nextNode())) {
            //disregard text inside of A tag links and already colored text
            if (text_node.parentNode.tagName == "A")
                continue;
            wbr_indices = this.addWBR(text_node, txtItterator, wbr_indices);
        }

	}
	
	//reinsert <wbr>
	 addWBR(text_node, txtItterator, wbr_indices){
        wbr_indices[0] = wbr_indices[0] - text_node.length;
        if(wbr_indices[0] <= 0){
            var split_node = text_node.splitText(text_node.length + wbr_indices[0]);
            var wbr = document.createElement("WBR");
            split_node.parentNode.insertBefore(wbr, text_node.nextSibling);
            wbr_indices.shift();
        }
        return wbr_indices;
    }

	//give color to text inside of nodes.
	// first scan for yen symbols and then check the front of the text for not nested kita.
	setColor(text_node, txtItterator):void{
		var start_text_node = text_node;
		var result;
		var yen_node:boolean = this.use_kita ? this.searchYen(text_node) : false;
		if(yen_node != false){
			//jump to internal node
			text_node = txtItterator.nextNode();
			//scan for nested kita
			do{
				result = this.use_kita ? this.searchKita(text_node) : false;
				if(result != false){
					//jump foreward to point after kita inserted
					text_node = txtItterator.nextNode();
					text_node = txtItterator.nextNode();
				}
			} while(result != false);
		}
		//scan for outside kita from start
		do{
			result = this.use_kita ? this.searchKita(start_text_node) : false;
			start_text_node = result.nextSibling;
		}while(result != false && start_text_node !== undefined);

	}

	//find the location of a yen, split the text from above that position, create a span element and place split into this span.
	//Then take the initial text node and insert into it from after the text node.
	searchYen (text_node):any{
		var yenIndex = text_node.textContent.indexOf(this.yen_character);
		if(yenIndex > -1){
			var splitNode = text_node.splitText(yenIndex);

			var span = document.createElement('span');
			span.className = "the_m_word";

			span.appendChild(splitNode);
			text_node.parentNode.insertBefore(span, text_node.nextSibling);

			return span;
		}
		return false;
	}

	//find the location of a kita, isolate it by splitting from the point where the kita ends and the point where it begins.
	//Now that there are 3 text nodes, take the middle one from the start position index split, add the text which goes to the point of the rightmost split,
	//then refer back to the parent and place it after the leftmost string.
	searchKita (text_node):any{
		var kIndex = text_node.textContent.indexOf(this.kita_character);
		if(kIndex > -1){
			var far_split_note =  text_node.splitText(kIndex + this.kita_character.length);
			var splitNode = text_node.splitText(kIndex);

			var span = document.createElement('span');
			span.className = "the_k_word";

			span.appendChild(splitNode);
			text_node.parentNode.insertBefore(span, text_node.nextSibling);
			return span;
		}
		return false;
	}	
}
