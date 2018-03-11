//unassociated functions

function storageAvailable(storage_type:string):number  {
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
function detectBrowser():number {
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
    else if((navigator.userAgent.indexOf('MSIE') != -1 ))
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