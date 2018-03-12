//unassociated functions
class Generics{
	static storageAvailable(storage_type:string):number  {
		try {
			var storage = window[storage_type];
			storage.setItem('x', 'x');
			storage.removeItem('x');
			return 1;
		}
		catch(e) {
				return e 
		}
	}

	//What Browser
	static detectBrowser():number {
		if((navigator.userAgent.indexOf('Opera') || navigator.userAgent.indexOf('OPR')) != -1 )
		{
			console.log('Opera');
			return 0;
		}
		else if(navigator.userAgent.indexOf('Chrome') != -1 )
		{
			console.log('Chrome');
			return 1;
		}
		else if(navigator.userAgent.indexOf('Safari') != -1)
		{
			console.log('Safari');
			return 2;
		}
		else if(navigator.userAgent.indexOf('Firefox') != -1 )
		{
			console.log('FireFox');
			return 3;
		}
		else if(navigator.userAgent.indexOf('MSIE') != -1 )
		{
			console.log('IE');
			return 4;
		}
		else
		{
			console.log('Other');
			return -1;
		}
	}

		
	//gets json keys by regex test
	static getJSONPropertiesByKeyName(JSON_obj:object, regex_string:string):string[]{
		var regex:any = new RegExp("^" + regex_string + "$");
		var rtnArray:string[] = Array();
		for (let key in JSON_obj)
			if (regex.test(key))
				rtnArray.push(key);
		return rtnArray;
	}
	
	//send alert to 4chanx
	static alert4ChanX(message:string, type:string, time:number):void{
		var detail:object = {type: type, content: message, lifetime: time};
		var event:any = new CustomEvent('CreateNotification', {bubbles: true, detail: detail});
		document.dispatchEvent(event);
	}
	
	static getJSON = function(url, callback, extra) {
		var xhr:any = new XMLHttpRequest();
		xhr.open('GET', url, true);
		xhr.responseType = 'json';
		xhr.onload = function() {
			var status = xhr.status;
			if (status == 200) {
				callback(null, xhr.response, extra);
			} else {
				callback(status);
			}
		};
		xhr.send();
	};

	
}

