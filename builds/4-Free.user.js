var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
// ==UserScript==
// @name         4Free-FSE
// @author       ECHibiki - /qa/
// @description  4Free - Free Stuff Enhancments. 7 additional features on top of 4chanX
// @version      0.4
// @namespace    http://verniy.xyz/
// @match		 *://boards.4chan.org/*
// @updateURL    https://raw.githubusercontent.com/ECHibiki/4Free-FSE/master/builds/4-Free.user.js
// @downloadURL  https://raw.githubusercontent.com/ECHibiki/4Free-FSE/master/builds/4-Free.user.js
// @grant         GM_xmlhttpRequest
// @run-at document-start
// @icon  data:image/jpeg;base64,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
// ==/UserScript==
/*
Uses:
        https://github.com/ccd0/4chan-x/wiki/4chan-X-API
        https://github.com/ECHibiki/4chan-UserScripts/blob/master/MD5%20Filters%20by%20QAJPYOtGo.txt
*/
/*
    ## About 4chanX-FSE
    4chanX-Free Stuff Enhancements is a userscript that operates with 4chanX to give it additional features. These enhancements were written by me from early 2017 up to 2018 as a way to teach myself how to work with JavaScript while giving something back to the community I took part in.
    Some of these features are simple, like the password viewer, others are more complex using multiple concurent AJAX calls such as the thread rebuilder or the image adder. <br/>
    Below is a description of the features this package has to offer.

    ### Danbooru Image Adder
    #### Adds images to your posts
    Adds an image to your post taken from the danbooru's image collection.<br/>
    Supply it with tags via an autocomplete, set the rating(s/q/e) and it will give an image for you to post with.

    ### Kita-Yen
    #### Color text
    Converts the colors of special symbols from plain black into other prettier colors(yen == purple, kita == dark grey).<br/>
    #### Hotkeys for Convinience
    <strong>Press ctrl+\ for ¥</strong>
    Highlights the whole line in purple much like how greentext works<br/>
    <strong>Press ctrl+k for ｷﾀ━━━(ﾟ∀ﾟ)━━━!!</strong>
    Highlights just the word in dark gray<br/>

    ### 4chan-Ignoring-Enhancements
    #### Hides images.
    Gives the ability to hide images with ___ctrl+shift+click___. Stores in browser memory for new sessions.<br/>
    Also includes over 20,000 MD5 filters of things like frogs, goldface, guro done by from QAJPYOtGo<br/>
    https://github.com/ECHibiki/4chan-UserScripts/blob/master/MD5%20Filters%20by%20QAJPYOtGo.txt
    #### Word Filters
    Also includes the ability to do word replacements with a regex replacement system.<br>

    ### Thread Rebuilder
    #### Rebuild dead threads from scratch
    Rebuild a thread from 4chan's archive.<br/>
    Simple system that could use some additions(using 4chan's offsite archives for example)

    ### Visible Password
    #### Shows your 4chan post/delete password
    * Displays your 4chan password in an inputbox.
    * Top left is the post password, Bottom right is the delete password.
    * Edit the input boxes to change them.

    __Note:__ some 4chan boards don't allow custom post passwords. May require cookie manipulation, but this has not yet been tested...

*/ 
var Constants = /** @class */ (function () {
    function Constants() {
    }
    Constants.DEFAULT_HIDE_EXPIRATION_TIME = 172800000;
    Constants.MILLISECONDS_TO_THE_HOUR = 3600000;
    return Constants;
}());
//unassociated functions
var Generics = /** @class */ (function () {
    function Generics() {
    }
    Generics.storageAvailable = function (storage_type) {
        try {
            var storage = window[storage_type];
            storage.setItem('x', 'x');
            storage.removeItem('x');
            return 1;
        }
        catch (e) {
            return e;
        }
    };
    //What Browser
    Generics.detectBrowser = function () {
        if ((navigator.userAgent.indexOf('Opera') || navigator.userAgent.indexOf('OPR')) != -1) {
            console.log('Opera');
            return 0;
        }
        else if (navigator.userAgent.indexOf('Chrome') != -1) {
            console.log('Chrome');
            return 1;
        }
        else if (navigator.userAgent.indexOf('Safari') != -1) {
            console.log('Safari');
            return 2;
        }
        else if (navigator.userAgent.indexOf('Firefox') != -1) {
            console.log('FireFox');
            return 3;
        }
        else if (navigator.userAgent.indexOf('MSIE') != -1) {
            console.log('IE');
            return 4;
        }
        else {
            console.log('Other');
            return -1;
        }
    };
    //gets json keys by regex test
    Generics.getJSONPropertiesByKeyName = function (JSON_obj, regex_string) {
        var regex = new RegExp("^" + regex_string + "$");
        var rtnArray = Array();
        for (var key in JSON_obj)
            if (regex.test(key))
                rtnArray.push(key);
        return rtnArray;
    };
    //send alert to 4chanx
    Generics.alert4ChanX = function (message, type, time) {
        var detail = { type: type, content: message, lifetime: time };
        var event = new CustomEvent('CreateNotification', { bubbles: true, detail: detail });
        document.dispatchEvent(event);
    };
    Generics.getJSON = function (url, callback, extra) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.responseType = 'json';
        xhr.onload = function () {
            var status = xhr.status;
            if (status == 200) {
                callback(null, xhr.response, extra);
            }
            else {
                callback(status);
            }
        };
        xhr.send();
    };
    return Generics;
}());
var FeatureInterface = /** @class */ (function () {
    function FeatureInterface() {
    }
    return FeatureInterface;
}());
var TopBar = /** @class */ (function () {
    function TopBar() {
        this.shortcuts_container = document.getElementById("shortcuts");
        this.shortcuts_menu = document.getElementById("shortcut-menu");
        this.fse_icon_container = document.createElement("SPAN");
        this.fse_icon_node = document.createElement("A");
        this.fse_style_node = document.createElement("STYLE");
        this.fa_fse_style = ".fa_jpy::before{content:'\f157'}";
        this.fse_style_node.innerHTML = this.fa_fse_style;
        this.fse_icon_container.setAttribute("class", "shortcut brackets-wrap");
        this.fse_icon_node.setAttribute("class", "fa fa-jpy");
        this.fse_icon_node.setAttribute("href", "javascript:void(0);");
        this.fse_icon_node.setAttribute("title", "4F-FSE Settings");
        this.fse_icon_node.textContent = "4F-FSE Settings";
        this.settings_window = new SettingsWindow();
    }
    TopBar.prototype.build = function () {
        var _this = this;
        document.head.appendChild(this.fse_style_node);
        this.fse_icon_container.appendChild(this.fse_icon_node);
        this.shortcuts_container.insertBefore(this.fse_icon_container, this.shortcuts_menu);
        //https://stackoverflow.com/questions/44606399/typescript-how-to-access-the-class-instance-from-event-handler-method
        this.fse_icon_node.addEventListener("click", function (evt) { return _this.open4FSettings(_this.settings_window); });
    };
    TopBar.prototype.open4FSettings = function (settings_window) {
        settings_window.displayWindow();
    };
    TopBar.prototype.getSettingsArr = function () {
        return this.settings_window.getSettingsArr();
    };
    return TopBar;
}());
var ImageHider = /** @class */ (function (_super) {
    __extends(ImageHider, _super);
    function ImageHider() {
        var _this = _super.call(this) || this;
        _this.blank_png = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAACXBIWXMAALiMAAC4jAHM9rsvAAAA\n\t\t\t\t\t\t\t\t\t\t\t\tG3RFWHRTb2Z0d2FyZQBDZWxzeXMgU3R1ZGlvIFRvb2zBp+F8AAAAo0lEQVR42u3RAQ0AAAjDMO5\n\t\t\t\t\t\t\t\t\t\t\t\tf9LFBSCdhTdvRnQIEiIAAERAgAgJEQIC4AERAgAgIEAEBIiBABERAgAgIEAEBIiBABERAgAgIEAE\n\t\t\t\t\t\t\t\t\t\t\t\tBIiBABERAgAgIEAEBIiBABERAgAgIEAEBIiBABERAgAgIEAEBIiBABERAgAgIEAEBIiBABERAgAg\n\t\t\t\t\t\t\t\t\t\t\t\tIEAEBIiBABERAgAgIEAEBIiBABAQIECACAkRAgAjI9xbzUCtI4axs4wAAAABJRU5ErkJggg==";
        _this.retrieveStates();
        _this.init();
        _this.activate();
        return _this;
    }
    //retrieve from memory the hidden images
    //Images are stored in memory as f<ID_NUMBER>IMG and recalled using the storage_key
    //Function makes a check to see if the hiding time limit for the thread has expired or not.
    //Note: Must have the DOM itterate through before retrieval
    ImageHider.prototype.retrieveStates = function () {
        var _this = this;
        var storage_position = 0;
        var JSON_storage = {}; /*;any bypasses dot notation issues on objects*/
        var storage_key;
        var local_store_size = window.localStorage.length;
        while (storage_position < local_store_size) {
            storage_key = window.localStorage.key(storage_position);
            JSON_storage[storage_key] = window.localStorage.getItem(storage_key);
            storage_position++;
        }
        this.threads_to_hide = Generics.getJSONPropertiesByKeyName(JSON_storage, '[0-9]+IMG');
        //aquire each time to check for changes
        this.hide_expiration_time = parseInt(JSON_storage.Expiration_Time);
        if (this.hide_expiration_time === null)
            this.hide_expiration_time = Constants.DEFAULT_HIDE_EXPIRATION_TIME;
        var md5_filters = JSON_storage.MD5_List_FSE;
        if (md5_filters !== undefined && md5_filters !== null) {
            this.md5_filters_arr = md5_filters.split('\n');
            //remove trailing and starting slash
            this.md5_filters_arr.forEach(function (md5, index) {
                md5 = md5.trim();
                _this.md5_filters_arr[index] = md5.substring(1, md5.length - 1);
            });
        }
    };
    ImageHider.prototype.storeStates = function () {
        var item_pairs = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            item_pairs[_i] = arguments[_i];
        }
        window.localStorage.setItem(item_pairs[0], item_pairs[1]);
    };
    ImageHider.prototype.init = function () { };
    //hide image onclick listener.
    //Method 404's a given image. This 404'ing allows image dissabling to be toggled on and off.
    //Post number associated with the image is stored in local storage.
    ImageHider.prototype.hideOnClick = function (event) {
        var _this = this;
        var is_hidden = event.target.src.substring(21, 29) == ",iVBORw0";
        console.log(event.target.src.substring(21, 29) + " " + ",iVBORw0");
        var hide_group_id;
        if ((event.ctrlKey && event.shiftKey) && !is_hidden) {
            event.preventDefault();
            event.stopPropagation();
            hide_group_id = event.target.getAttribute('hide-grouping');
            this.storeStates(hide_group_id, "" + Date.now());
            [].slice.call(document.querySelectorAll('img[hide-grouping="' + hide_group_id + '"]')).forEach(function (image_node) {
                image_node.setAttribute('hidden-src', image_node.src);
                image_node.src = _this.blank_png;
            });
            return false;
        }
        else if (event.ctrlKey && event.shiftKey) {
            event.preventDefault();
            event.stopPropagation();
            hide_group_id = event.target.getAttribute('hide-grouping');
            window.localStorage.removeItem(hide_group_id);
            event.target.src = event.target.getAttribute('hidden-src');
            [].slice.call(document.querySelectorAll('img[hide-grouping="' + hide_group_id + '"]')).forEach(function (image_node) {
                image_node.src = image_node.getAttribute('hidden-src');
            });
            return false;
        }
        return true;
    };
    ImageHider.prototype.decideAction = function (node) {
        //tagname is always upper in HTML, in xml it's displayed as written.
        if (node.tagName === 'IMG') {
            if (!/\d+IMG/.test(node.getAttribute('hide-grouping')) && (node.getAttribute('data-md5') !== null)) {
                this.hideImageNode(node);
            }
        }
    };
    //Activate
    ImageHider.prototype.activate = function () {
        var _this = this;
        new MutationObserver(function (mutations) {
            _this.retrieveStates();
            _this.hideHoverImageNode(mutations);
        }).observe(document.getElementById('hoverUI'), { childList: true });
        console.log("4F-FSE: ImageHider Active");
    };
    ImageHider.prototype.hideImageNode = function (image_node) {
        var _this = this;
        var sister_node = image_node.parentNode.parentNode.parentNode.getElementsByClassName('catalog-thumb')[0]; // the catalog sister to index
        if (sister_node === undefined)
            sister_node = document.createElement('IMG');
        image_node.setAttribute('hide-grouping', image_node.parentNode.parentNode.id.substring(1) + 'IMG');
        sister_node.setAttribute('hide-grouping', image_node.parentNode.parentNode.id.substring(1) + 'IMG');
        image_node.addEventListener('click', function (evt) { return _this.hideOnClick(evt); });
        sister_node.addEventListener('click', function (evt) { return _this.hideOnClick(evt); });
        var threadstore_len = this.threads_to_hide.length;
        var node_group_id = image_node.getAttribute('hide-grouping');
        for (var thread = 0; thread < threadstore_len; thread++) {
            if (node_group_id == this.threads_to_hide[thread]) {
                image_node.setAttribute('hidden-src', image_node.src);
                image_node.src = this.blank_png;
                sister_node.setAttribute('hidden-src', sister_node.src);
                sister_node.src = this.blank_png;
                return;
            }
        }
        //index node holds the MD5
        var node_md5 = image_node.getAttribute('data-md5');
        if (this.md5_filters_arr !== undefined) {
            var md5_filters_arr_len = this.md5_filters_arr.length;
            for (var md5 = 0; md5 < md5_filters_arr_len; md5++) {
                if (node_md5 == this.md5_filters_arr[md5]) {
                    image_node.setAttribute('hidden-src', image_node.src);
                    image_node.src = this.blank_png;
                    sister_node.setAttribute('hidden-src', sister_node.src);
                    sister_node.src = this.blank_png;
                    return;
                }
            }
        }
    };
    ImageHider.prototype.hideHoverImageNode = function (mutation_record) {
        var _this = this;
        mutation_record.forEach(function (mutation) {
            mutation.addedNodes.forEach(function (image_node) {
                var is_embeded_post;
                if (image_node.tagName == 'DIV') {
                    is_embeded_post = true;
                    image_node = image_node.getElementsByClassName('postContainer')[0];
                    if (image_node === undefined)
                        return;
                }
                var unprocessed_id = image_node.getAttribute('data-full-i-d');
                if (unprocessed_id === null)
                    return;
                var proccessed_id = unprocessed_id.substring(unprocessed_id.indexOf('.') + 1);
                var image_node_id = proccessed_id + 'IMG';
                if (is_embeded_post)
                    image_node = image_node.getElementsByTagName('IMG')[0];
                if (image_node === undefined)
                    return;
                for (var thread = 0, threadstore_len = _this.threads_to_hide.length; thread < threadstore_len; thread++) {
                    if (image_node_id == _this.threads_to_hide[thread]) {
                        image_node.removeAttribute('src');
                        return;
                    }
                }
                //thread node holds the MD5
                var node_md5;
                if (is_embeded_post)
                    node_md5 = image_node.getAttribute('data-md5');
                else
                    node_md5 = document.getElementById('f' + proccessed_id).getElementsByTagName('IMG')[0].getAttribute('data-md5');
                if (_this.md5_filters_arr !== undefined) {
                    for (var md5 = 0, md5_filters_arr_len = _this.md5_filters_arr.length; md5 < md5_filters_arr_len; md5++) {
                        if (node_md5 == _this.md5_filters_arr[md5]) {
                            image_node.removeAttribute('src');
                            return;
                        }
                    }
                }
            });
        });
    };
    return ImageHider;
}(FeatureInterface));
var TextReplacer = /** @class */ (function (_super) {
    __extends(TextReplacer, _super);
    function TextReplacer() {
        var _this = _super.call(this) || this;
        _this.text_filters = []; //object
        _this.filtered_threads = [];
        _this.retrieveStates();
        _this.init();
        _this.activate();
        return _this;
    }
    TextReplacer.prototype.init = function () {
        this.filtered_threads = [];
    };
    ;
    TextReplacer.prototype.activate = function () { console.log("4F-FSE: TextReplacer Active"); };
    TextReplacer.prototype.decideAction = function (node) {
        if (node.tagName == "BLOCKQUOTE") {
            if (node.className == "postMessage") {
                var blockquote_id = node.id;
                var already_filtered = false;
                this.filtered_threads.forEach(function (thread_id) {
                    if (thread_id == blockquote_id) {
                        already_filtered = true;
                        return;
                    }
                });
            }
            else
                return;
            if (!already_filtered) {
                var itterator = document.createNodeIterator(node, NodeFilter.SHOW_TEXT);
                var localNode;
                while ((localNode = itterator.nextNode())) {
                    for (var filter = 0; filter < this.number_of_filters; filter++) {
                        if (this.text_filters[filter].Active === "true") {
                            var last_slash_index = this.text_filters[filter].Regex.lastIndexOf("/");
                            var filter_text = this.text_filters[filter].Regex.substring(1, last_slash_index);
                            var flag = this.text_filters[filter].Regex.substring(last_slash_index + 1);
                            var regex = new RegExp(filter_text, flag);
                            var node_text = localNode.textContent;
                            if (regex.test(node_text)) {
                                localNode.textContent = node_text.replace(regex, this.text_filters[filter].Replacement);
                                this.filtered_threads.push(blockquote_id);
                            }
                        }
                    }
                }
            }
        }
    };
    TextReplacer.prototype.retrieveStates = function () {
        var _this = this;
        var storage_index = 0;
        var JSON_storage = {};
        var storage_key;
        while (storage_index < window.localStorage.length) {
            storage_index++;
            storage_key = window.localStorage.key(storage_index);
            JSON_storage[storage_key] = window.localStorage.getItem(storage_key);
        }
        this.number_of_filters = JSON_storage["filter_quantity"];
        var filters = Generics.getJSONPropertiesByKeyName(JSON_storage, "[0-9]+FLT");
        filters.sort();
        filters.forEach(function (filter) {
            _this.text_filters.push(TextReplacer.formatFilterSettings(JSON_storage[filter]));
        });
    };
    //Splits the saved settings into components
    TextReplacer.formatFilterSettings = function (input) {
        var processed_input = (input.split('=')).map(function (x) { return decodeURIComponent(x); });
        return { Active: processed_input[0], Regex: processed_input[1], Replacement: processed_input[2] };
    };
    TextReplacer.prototype.storeStates = function () { };
    return TextReplacer;
}(FeatureInterface));
var DanbooruImageAdder = /** @class */ (function (_super) {
    __extends(DanbooruImageAdder, _super);
    function DanbooruImageAdder() {
        var _this = _super.call(this) || this;
        _this.help_icon_source = " data:image/jpeg;base64,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";
        return _this;
    }
    DanbooruImageAdder.prototype.init = function () { };
    DanbooruImageAdder.prototype.retrieveStates = function () { };
    DanbooruImageAdder.prototype.storeStates = function () {
        var items = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            items[_i] = arguments[_i];
        }
    };
    DanbooruImageAdder.prototype.activate = function () { };
    DanbooruImageAdder.prototype.decideAction = function (node) { };
    return DanbooruImageAdder;
}(FeatureInterface));
var PasswordViewer = /** @class */ (function (_super) {
    __extends(PasswordViewer, _super);
    function PasswordViewer() {
        var _this = _super.call(this) || this;
        _this.post_id = "postPassword";
        _this.del_id = "delPassword";
        _this.label_post = document.createElement('LABEL');
        _this.label_del = document.createElement('LABEL');
        _this.init();
        _this.activate();
        return _this;
    }
    PasswordViewer.prototype.init = function () {
        this.node_post = document.getElementById(this.post_id);
        this.node_del = document.getElementById(this.del_id);
        this.node_post_parent = this.node_post.parentNode;
        this.node_del_parent = this.node_del.parentNode;
        this.label_post.textContent = 'Post: ';
        this.label_del.textContent = 'Delete: ';
    };
    //activate displays passwords
    PasswordViewer.prototype.activate = function () {
        console.log("4F-FSE: PasswordViewer Active");
        this.node_post_parent.insertBefore(this.label_post, this.node_post);
        this.node_del_parent.insertBefore(this.label_del, this.node_del);
        this.node_post.removeAttribute('type');
        this.node_del.removeAttribute('type');
        document.getElementsByClassName('deleteform')[0].style.display = 'inline';
        this.node_del.style.display = 'inline';
        this.label_del.style.display = 'inline';
        this.label_del.style.paddingLeft = '10px';
    };
    PasswordViewer.prototype.decideAction = function (node) { };
    PasswordViewer.prototype.retrieveStates = function () { };
    ;
    PasswordViewer.prototype.storeStates = function () { };
    ;
    return PasswordViewer;
}(FeatureInterface));
var SettingsWindow = /** @class */ (function (_super) {
    __extends(SettingsWindow, _super);
    function SettingsWindow() {
        var _this = _super.call(this) || this;
        _this.background_div = document.createElement('DIV');
        _this.settings_div = document.createElement('DIV');
        _this.close_div = document.createElement('DIV');
        _this.contents_div = document.createElement('DIV');
        _this.ul_selection_start = document.createElement('UL');
        _this.close_link = document.createElement('A');
        _this.title_para = document.createElement('P');
        _this.title_text = document.createTextNode('4F-FSE Settings');
        _this.end_para = document.createElement('P');
        _this.end_text = document.createTextNode('Refresh to view changes');
        _this.settings_style = document.createElement('STYLE');
        //to change order change, this AND...*
        _this.list_items = [
            { Text: "View 『Image Hiding』 Settings", ListenerFunc: function (a_id) {
                    _this.clearContainer();
                    _this.contents_div.innerHTML =
                        "\n\t\t\t\t<div id=\"disposable_container\">\n\t\t\t\t\t\t\t\t <label>Non-MD5 Expiration Time(hours): </label>\n\t\t\t\t\t\t\t\t <input id=\"Expiration_Time\">\n\t\t\t\t\t\t\t\t <hr>\n\t\t\t\t\t\t\t\t <label>MD5 Filters:</label>\n\t\t\t\t\t\t\t\t <br>\n\t\t\t\t\t\t\t\t <textarea style=\"width:98%;height:217px\" placeholder=\"Enter MD5 like on 4chanX... \n\t\t\t\t\t\t\t\t/abc123/\n\t\t\t\t\t\t\t\t/def890/\" id=\"MD5_List_FSE\"></textarea>\n\t\t\t\t\t\t\t\t<hr>\n\t\t\t\t</div>\n\t\t\t\t";
                    document.getElementById("Expiration_Time").value = "" + (_this.setting_items.image_hiding_settings.Expiration_Time / Constants.MILLISECONDS_TO_THE_HOUR);
                    document.getElementById("MD5_List_FSE").value = _this.setting_items.image_hiding_settings.MD5_List_FSE;
                    var set_button = document.createElement('INPUT');
                    document.getElementById("disposable_container").appendChild(set_button);
                    set_button.setAttribute('VALUE', "Set Image Settings");
                    set_button.addEventListener("click", function (evt) {
                        _this.storeStates();
                        _this.clearContainer();
                        _this.rebuildContainer();
                    });
                    set_button.setAttribute('TYPE', 'button');
                }
            },
            { Text: "View 『Word Replacement』 Settings", ListenerFunc: function (a_id) {
                    _this.clearContainer();
                    var disposable_container = document.createElement("DIV");
                    disposable_container.setAttribute("ID", "disposable_container");
                    _this.contents_div.appendChild(disposable_container);
                    _this.filterWindow(disposable_container);
                    _this.filterSetTable();
                }
            },
            { Text: "View 『Danbooru Image Adder』 Settings", ListenerFunc: function (a_id) {
                    _this.clearContainer();
                    var disposable_container = document.createElement("DIV");
                    disposable_container.setAttribute("id", "disposable_container");
                    _this.contents_div.appendChild(disposable_container);
                    disposable_container.innerHTML = "\n\t\t\t<table style=\"text-align:center;margin-left:5px\">\n\t\t\t\t<tr>\n\t\t\t\t\t<td>\n\t\t\t\t\t\t<label>Very Large: </label>\n\t\t\t\t\t</td>\n\t\t\t\t\t<td>\n\t\t\t\t\t\t<input id=\"v_large\" name=\"preivew-size\" style=\"display:inline\" type=\"radio\">\n\t\t\t\t\t</td>\n\t\t\t\t</tr>\n\t\t\t\t<tr>\n\t\t\t\t\t<td>\n\t\t\t\t\t\t<label>Large: </label>\n\t\t\t\t\t</td>\n\t\t\t\t\t<td>\n\t\t\t\t\t\t<input id=\"large\" name=\"preivew-size\" style=\"display:inline\" type=\"radio\">\n\t\t\t\t\t</td>\n\t\t\t\t</tr>\n\t\t\t\t<tr>\n\t\t\t\t\t<td>\n\t\t\t\t\t\t<label>Medium: </label>\n\t\t\t\t\t</td>\n\t\t\t\t\t<td>\n\t\t\t\t\t\t<input id=\"medium\" name=\"preivew-size\" style=\"display:inline\" type=\"radio\">\n\t\t\t\t\t</td>\n\t\t\t\t</tr>\n\t\t\t\t<tr>\n\t\t\t\t\t<td>\n\t\t\t\t\t\t<label>Very Large: </label>\n\t\t\t\t\t</td>\n\t\t\t\t\t<td>\n\t\t\t\t\t\t<input id=\"small\" name=\"preivew-size\" style=\"display:inline\" type=\"radio\">\n\t\t\t\t\t</td>\n\t\t\t\t</tr>\n\t\t\t\t<tr>\n\t\t\t\t\t<td>\n\t\t\t\t\t\t<label>Width: </label>\n\t\t\t\t\t</td>\n\t\t\t\t\t<td>\n\t\t\t\t\t\t<input id=\"width_DIA\" name=\"preivew-size\" style=\"width:20%\" value=\"400\" type=\"text\">\n\t\t\t\t\t</td>\n\t\t\t\t</tr>\n\t\t\t\t<tr>\n\t\t\t\t\t<td>\n\t\t\t\t\t\t<label>Height: </label>\n\t\t\t\t\t</td>\n\t\t\t\t\t<td>\n\t\t\t\t\t\t<input id=\"height_DIA\" name=\"preivew-size\" style=\"width:20%\" value=\"400\" type=\"text\">\n\t\t\t\t\t</td>\n\t\t\t\t</tr>\n\t\t\t</table>\t\n\t\t\n\t\t\t<hr>\n\t\t\t\n\t\t\t<label>Quick Reply Min Width: </label>\n\t\t\t<input id=\"qr_width_DIA\" name=\"preivew-size\" style=\"width:20%\" value=\"480\" type=\"text\">\n\t\t\n\t\t\t<hr>\n\t\t\n\t\t\t<input id=\"setTime\" value=\"Set Preview Size\" type=\"button\">\n\t\t\t";
                    /*
                            
                v_large_input.addEventListener("click", function(){
                    document.getElementById("width_DIA").value = 489;
                    document.getElementById("height_DIA").value = 489;
                });
        
            
                large_input.addEventListener("click", function(){
                    document.getElementById("width_DIA").value = 400;
                    document.getElementById("height_DIA").value = 400;
                });
                
            
                medium_input.addEventListener("click", function(){
                    document.getElementById("width_DIA").value = 300;
                    document.getElementById("height_DIA").value = 300;
                });
        
                
                small_input.addEventListener("click", function(){
                    document.getElementById("width_DIA").value = 200;
                    document.getElementById("height_DIA").value = 200;
                });
                
        
                var width = localStorage.getItem("width_DIA");
                if(width === null) width = 400;
                width_input.setAttribute("value", width);
                    
                var height = localStorage.getItem("height_DIA");
                if(height === null) height = 400;
                height_input.setAttribute("value", height);
                
                radio_table.appendChild(height_row);
                
                container_div.appendChild(radio_table);
                container_div.appendChild(document.createElement("hr"));
                
                var qr_width = localStorage.getItem("qr_width_DIA");
                if(qr_width === null) qr_width = 480;
                qr_width_input.setAttribute("value", qr_width);
                
                set_button.addEventListener("click", function(){
                    if (storageAvailable('localStorage')) {
                        var width = parseInt(document.getElementById("width_DIA").value);
                        localStorage.setItem("width_DIA", width);
                        
                        var qr_width = parseInt(document.getElementById("qr_width_DIA").value);
                        localStorage.setItem("qr_width_DIA", qr_width);
                        
                        var height = parseInt(document.getElementById("height_DIA").value);
                        localStorage.setItem("height_DIA", height);
                
                        if(width === null) width = 400;
                        if(qr_width === null) qr_width = 480;
                        if(height === null) height = 400;
        
                        document.getElementById("fourchanx-css").textContent += ".qr-preview { height:" +  height + "px; width: " + width +  "px; left:8%;background-size: cover;}";
                        document.getElementById("fourchanx-css").textContent += "#dump-list { min-height: " + (width - 20) +  "px; width: " + (qr_width) + "px;}";
        
                        imageAdderToggle();
                    }
                });
        
                if(document.getElementById("width_DIA").value == "489") v_large_input.checked = true;
                if(document.getElementById("width_DIA").value == "400") large_input.checked = true;
                if(document.getElementById("width_DIA").value == "300") medium_input.checked = true;
                if(document.getElementById("width_DIA").value == "200") small_input.checked = true;
        
            */
                }
            },
            { Text: "View 『Thread Rebuilder』 Settings", ListenerFunc: function (a_id) {
                    _this.clearContainer();
                    var disposable_container = document.createElement("DIV");
                    disposable_container.setAttribute("id", "disposable_container");
                    _this.contents_div.appendChild(disposable_container);
                    disposable_container.innerHTML =
                        "\n\t\t\t\t<label>Use 4chan Archives: </label>\n\t\t\t\t<input name=\"ArchiveSettings\" id=\"OnsiteArchive\" type=\"text\">\n\t\t\t\t<br>\n\t\t\t\t<label>Use Offsite Archives: </label>\n\t\t\t\t<input name=\"ArchiveSettings\" id=\"OffsiteArchive\" type=\"text\">\n\t\t\t\t<br>\n\t\t\t\t<input id=\"setTime\" value=\"Set Archive\" type=\"button\">\n\t\t\t";
                }
            },
            { Text: "View 『¥ Text』 Settings [Customizable]", ListenerFunc: function (a_id) {
                    _this.clearContainer();
                    var disposable_container = document.createElement("DIV");
                    disposable_container.setAttribute("id", "disposable_container");
                    _this.contents_div.appendChild(disposable_container);
                    disposable_container.innerHTML =
                        "\n\t\t\t\t<label>\u00A5Quote Character: </label>\n\t\t\t\t<input name=\"quoteCharacter\" id=\"quoteCharacter\" type=\"text\">\n\t\t\t\t<br>\n\t\t\t\t<label>RGB Hex Color: </label>\n\t\t\t\t<input name=\"HexColorYen\" id=\"hexColorYen\" type=\"text\">\n\t\t\t\t<input name=\"HexColorYen\" id=\"SelectColorYen\" type=\"color\">\n\t\t\t\t<br>\n\t\t\t\t<input id=\"setQuote\" value=\"Set Quote Settings\" type=\"button\">\n\t\t\t";
                    document.getElementById("SelectColorYen").addEventListener("input", function (evt) {
                        document.getElementById("hexColorYen").value =
                            (document.getElementById("SelectColorYen").value);
                    });
                }
            },
            { Text: "View 『Kita』 Settings [Customizable]", ListenerFunc: function (a_id) {
                    _this.clearContainer();
                    var disposable_container = document.createElement("DIV");
                    disposable_container.setAttribute("id", "disposable_container");
                    _this.contents_div.appendChild(disposable_container);
                    disposable_container.innerHTML =
                        "\t\t\t\t\t\t\t\t\n\t\t\t\t<script src=\"http://jscolor.js\"></script>\n\t\t\t\t<label>Kita Characters: </label>\n\t\t\t\t<input name=\"selectiveCharacter\" id=\"selectiveCharacters\" type=\"text\">\n\t\t\t\t<br>\n\t\t\t\t<label>RGB Hex Color: </label>\n\t\t\t\t<input name=\"HexColorKita\" id=\"HexColorKita\" type=\"text\">\n\t\t\t\t<input name=\"HexColorKita\" id=\"SelectColorKita\" type=\"color\">\n\t\t\t\t<br>\n\t\t\t\t<input id=\"setCharacter\" value=\"Set Quote Settings\" type=\"button\">\n\t\t\t";
                    document.getElementById("SelectColorKita").addEventListener("input", function (evt) {
                        document.getElementById("HexColorKita").value =
                            (document.getElementById("SelectColorKita").value);
                    });
                }
            },
            { Text: "Set 『Visible Password』 : ", ListenerFunc: function (input_id) {
                    var input = document.getElementById(input_id);
                    var is_check = !input.checked;
                    document.getElementById(input_id).checked = is_check;
                    _this.storeStates();
                } },
        ];
        _this.setting_items = {};
        _this.retrieveStates();
        _this.init();
        _this.activate();
        return _this;
    }
    //*...THIS
    SettingsWindow.prototype.retrieveStates = function () {
        //acquire text filter representation
        var storage_index = 0;
        var JSON_storage = {};
        var storage_key;
        var text_filters = [];
        while (storage_index < window.localStorage.length) {
            storage_index++;
            storage_key = window.localStorage.key(storage_index);
            JSON_storage[storage_key] = window.localStorage.getItem(storage_key);
        }
        var filters = Generics.getJSONPropertiesByKeyName(JSON_storage, "[0-9]+FLT");
        filters.sort();
        filters.forEach(function (filter) {
            text_filters.push(TextReplacer.formatFilterSettings(JSON_storage[filter]));
        });
        //values used to fill out data fields
        this.setting_items.image_hiding_settings = { Expiration_Time: localStorage.getItem("Expiration_Time"), MD5_List_FSE: localStorage.getItem("MD5_List_FSE") };
        this.setting_items.word_replace_settings = { Number_of_filters: localStorage.getItem("filter_quantity"), Text_Filter_List: text_filters };
        this.setting_items.image_adder_settings = (localStorage.getItem("tab-settings3") == 'true');
        this.setting_items.thread_rebuild_settings = (localStorage.getItem("tab-settings4") == 'true');
        this.setting_items.yen_settings = (localStorage.getItem("tab-settings5") == 'true');
        this.setting_items.kita_settings = (localStorage.getItem("tab-settings6") == 'true');
        this.setting_items.password_settings = (localStorage.getItem("pw_active"));
    };
    SettingsWindow.prototype.storeStates = function () {
        //image settings
        this.storeImageStates();
        //Text replace settings
        this.storeFilterStates();
        //Password replace settings
        this.storePasswordStates();
        this.retrieveStates();
    };
    SettingsWindow.prototype.storeImageStates = function () {
        if (document.getElementById("Expiration_Time") !== null) {
            var time = document.getElementById("Expiration_Time");
            var millisecond_time = parseInt(time.value) * Constants.MILLISECONDS_TO_THE_HOUR;
            if (millisecond_time == 0 || millisecond_time === null || millisecond_time === undefined)
                millisecond_time = Constants.DEFAULT_HIDE_EXPIRATION_TIME;
            localStorage.setItem("Expiration_Time", millisecond_time.toString());
            var md5_filters = document.getElementById("MD5_List_FSE").value;
            localStorage.setItem("MD5_List_FSE", md5_filters);
            Generics.alert4ChanX("Image Settings Saved", "success", 3);
        }
    };
    SettingsWindow.prototype.storeFilterStates = function () {
        if (document.getElementById("FilterRow0") !== null) {
            var f_row_moving = document.getElementById("FilterRow0");
            var number_of_filters = 0;
            var number_of_filters_actual = 0;
            while (f_row_moving.nextSibling !== null) {
                if (document.getElementById("Pattern" + number_of_filters).value !== "")
                    number_of_filters_actual++;
                number_of_filters++;
                f_row_moving = f_row_moving.nextSibling;
            }
            window.localStorage.setItem("filter_quantity", number_of_filters_actual.toString());
            for (var pattern_input = 0; pattern_input < number_of_filters; pattern_input++) {
                var pattern_to_store = document.getElementById("Pattern" + pattern_input).value;
                var replacement_to_store = document.getElementById("Replacement" + pattern_input).value;
                var setting = 'g';
                try {
                    if (pattern_to_store === "") {
                        localStorage.removeItem(pattern_input + "FLT");
                        continue;
                    }
                    else if (new RegExp("^\/.*\/\\D+$").test(pattern_to_store)) { }
                    else if (new RegExp("^\/.*\/$").test(pattern_to_store)) {
                        pattern_to_store = pattern_to_store + setting;
                    }
                    else if (!new RegExp("^/.*\/\\D$").test(pattern_to_store)) {
                        pattern_to_store = "/" + pattern_to_store + "/" + setting;
                    }
                    //test for breakages, try to cause error
                    var error_test = new RegExp(pattern_to_store.substring(0, pattern_to_store.lastIndexOf("/") + 1), pattern_to_store.substring(pattern_to_store.lastIndexOf("/") + 1));
                }
                catch (e) {
                    Generics.alert4ChanX("Unrecoverable Regex error on pattern " + pattern_input + " for " + pattern_to_store, "error", undefined);
                    continue;
                }
                pattern_to_store = encodeURIComponent(pattern_to_store);
                var save_string = document.getElementById("Active" + pattern_input).checked + '=' + pattern_to_store + '=' + replacement_to_store;
                window.localStorage.setItem(pattern_input + "FLT", save_string);
            }
            Generics.alert4ChanX("Wordfilters Updated!", "success", 3);
        }
    };
    SettingsWindow.prototype.storePasswordStates = function () {
        //password view settings
        if (document.getElementById("check-settings6") !== null)
            localStorage.setItem("pw_active", "" + document.getElementById("check-settings6").checked);
    };
    SettingsWindow.prototype.clearContainer = function () {
        var disposable = document.getElementById("disposable_container");
        if (disposable !== null)
            this.contents_div.removeChild(disposable);
        else
            this.contents_div.removeChild(this.ul_selection_start);
    };
    SettingsWindow.prototype.rebuildContainer = function () {
        this.contents_div.appendChild(this.ul_selection_start);
    };
    SettingsWindow.prototype.init = function () {
        var _this = this;
        this.settings_style.innerHTML = ".inputs{\n\t\t\t\t\t\t\t\t\t\t\tbackground-color:rgb(200,200,200);margin:5px 7px;width:100px;\n\t\t\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t\t\t\t.SettingsBackground{\n\t\t\t\t\t\t\t\t\t\t\tposition:fixed;width:100%;height:100%;background-color:rgba(200,200,200,0.3);top:0;left:0; z-index:9\n\t\t\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t\t\t\t.settingsItem{\n\t\t\t\t\t\t\t\t\t\t\tfont-size:18px;list-style:katakana-iroha outside;padding:2px;color:#2e2345;\n\t\t\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t\t\t\t.settingsItem input{\n\t\t\t\t\t\t\t\t\t\t\ttransform: scale(1.2);\n\t\t\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t\t\t\t.settingsMain{\n\t\t\t\t\t\t\t\t\t\t\tborder:solid 1px black;position:fixed;background-color:rgb(200,200,200);left:40%;top:20%;margin-bottom:0; z-index:10\n\t\t\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t\t\t\t.closeIcon{\n\t\t\t\t\t\t\t\t\t\t\tborder:solid 1px black;position:absolute;width:25px;height:25px;background-color:rgba(255,100,90,0.9); right:3px;top:3px; z-index:10\n\t\t\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t\t\t\t.titleStyle{\n\t\t\t\t\t\t\t\t\t\t\tfont-size: 20px;padding: 12px 0px 9px 22px\n\t\t\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t\t\t\t.footerStyle{\n\t\t\t\t\t\t\t\t\t\t\tpadding-left: 12px;\n\t\t\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t\t\t\t.contentStyle{\n\t\t\t\t\t\t\t\t\t\t\tbackground-color:white;margin:0 0;padding:5px 25px;\n\t\t\t\t\t\t\t\t\t\t}";
        this.background_div.setAttribute('class', 'SettingsBackground');
        this.background_div.setAttribute('id', 'SettingsBackground');
        this.background_div.setAttribute('style', 'display:none');
        this.settings_div.setAttribute('class', 'settingsMain');
        this.settings_div.setAttribute('id', 'settingsWindow');
        this.settings_div.setAttribute('style', 'display:none;width:500px');
        this.close_link.setAttribute('href', 'javascript:void(0)');
        this.close_div.setAttribute('class', 'closeIcon');
        this.close_div.addEventListener('click', function (evt) { return _this.hideWindow(); });
        this.title_para.setAttribute('class', 'titleStyle');
        this.contents_div.setAttribute('class', 'contentStyle');
        this.end_para.setAttribute('class', 'footerStyle');
        this.generateList(this.contents_div);
    };
    SettingsWindow.prototype.generateList = function (head_node) {
        var _this = this;
        this.list_items.forEach(function (list_item, index) {
            var li = document.createElement('LI');
            li.setAttribute('class', 'settingsItem');
            if (list_item.Text.indexOf('View') > -1) {
                var a = document.createElement('A');
                a.setAttribute('href', 'javascript:void(0)');
                a.textContent = list_item.Text;
                var a_id = 'tab-settings' + index;
                a.setAttribute('ID', 'tab-settings' + index);
                var setup_func = function (_a_id) {
                    a.addEventListener('click', function (evt) { return list_item.ListenerFunc(_a_id); });
                    li.appendChild(a);
                    _this.ul_selection_start.appendChild(li);
                };
                setup_func(a_id);
            }
            else {
                var label = document.createElement('LABEL');
                label.textContent = list_item.Text;
                li.appendChild(label);
                var input = document.createElement('INPUT');
                var input_id = 'check-settings' + index;
                input.setAttribute('TYPE', 'checkbox');
                input.setAttribute('ID', 'check-settings' + index);
                li.appendChild(input);
                _this.ul_selection_start.appendChild(li);
                input.checked = _this.setting_items.password_settings == 'true';
                var setup_func = function (_input_id) {
                    label.addEventListener('click', function (evt) { return list_item.ListenerFunc(_input_id); });
                };
                setup_func(input_id);
            }
        });
    };
    SettingsWindow.prototype.activate = function () {
        var _this = this;
        document.body.appendChild(this.settings_style);
        this.background_div.addEventListener('click', function (evt) { return _this.hideWindow(); });
        document.body.appendChild(this.background_div);
        this.settings_div.appendChild(this.close_link);
        this.close_link.appendChild(this.close_div);
        this.title_para.appendChild(this.title_text);
        this.settings_div.appendChild(this.title_para);
        this.settings_div.appendChild(this.contents_div);
        this.end_para.appendChild(this.end_text);
        this.settings_div.appendChild(this.end_para);
        document.body.appendChild(this.settings_div);
    };
    SettingsWindow.prototype.decideAction = function (node) { };
    SettingsWindow.prototype.getSettingsArr = function () {
        return this.setting_items;
    };
    SettingsWindow.prototype.displayWindow = function () {
        this.background_div.style.display = 'block';
        this.settings_div.style.display = 'block';
        this.rebuildContainer();
    };
    SettingsWindow.prototype.hideWindow = function () {
        this.background_div.style.display = 'none';
        this.settings_div.style.display = 'none';
        this.clearContainer();
    };
    SettingsWindow.prototype.filterWindow = function (disposable_container) {
        var _this = this;
        var filter_table = document.createElement("table");
        filter_table.setAttribute("style", "text-align:center;");
        filter_table.setAttribute("id", "filter_table");
        disposable_container.appendChild(filter_table);
        var table_row = document.createElement("tr");
        filter_table.appendChild(table_row);
        var table_head_active = document.createElement("th");
        var head_text_active = document.createTextNode("Active");
        table_head_active.appendChild(head_text_active);
        filter_table.appendChild(table_head_active);
        var table_head_pattern = document.createElement("th");
        var headTextPattern = document.createTextNode("Pattern");
        table_head_pattern.appendChild(headTextPattern);
        filter_table.appendChild(table_head_pattern);
        var table_head_replacement = document.createElement("th");
        var head_text_replacement = document.createTextNode("Replacement");
        table_head_replacement.appendChild(head_text_replacement);
        filter_table.appendChild(table_head_replacement);
        //Create the pattern table
        //loop to create rows
        var number_of_filters = parseInt(this.setting_items.word_replace_settings.number_of_filters);
        if (number_of_filters === 0 || isNaN(number_of_filters))
            number_of_filters = 6;
        for (var i = 0; i < number_of_filters; i++) {
            var table_row_contents = document.createElement("tr");
            table_row_contents.setAttribute("id", "FilterRow" + i);
            var table_data_active = document.createElement("td");
            var table_checkbox_active = document.createElement("input");
            table_checkbox_active.setAttribute("type", "checkbox");
            table_checkbox_active.setAttribute("id", "Active" + i);
            table_data_active.appendChild(table_checkbox_active);
            table_row_contents.appendChild(table_data_active);
            var table_data_pattern = document.createElement("td");
            var table_input_pattern = document.createElement("input");
            table_input_pattern.setAttribute("class", "inputs");
            table_input_pattern.setAttribute("id", "Pattern" + i);
            table_data_pattern.appendChild(table_input_pattern);
            table_row_contents.appendChild(table_data_pattern);
            var table_data_replacement = document.createElement("td");
            var table_input_replacement = document.createElement("input");
            table_input_replacement.setAttribute("class", "inputs");
            table_input_replacement.setAttribute("id", "Replacement" + i);
            table_data_replacement.appendChild(table_input_replacement);
            table_row_contents.appendChild(table_data_replacement);
            filter_table.appendChild(table_row_contents);
        }
        var table_last_contents = document.createElement("tr");
        var table_add_collumn = document.createElement("td");
        var table_add_row_button = document.createElement("input");
        var table_subtract_row_button = document.createElement("input");
        table_subtract_row_button.setAttribute("type", "button");
        table_subtract_row_button.setAttribute("value", "-");
        table_subtract_row_button.setAttribute("style", "padding: 7px 0; margin:5px 0;");
        table_add_collumn.appendChild(table_subtract_row_button);
        table_subtract_row_button.addEventListener("click", function (evt) { return _this.filterRemoveRow(); });
        table_add_row_button.setAttribute("type", "button");
        table_add_row_button.setAttribute("value", "+");
        table_add_row_button.setAttribute("style", "padding: 7px 0; margin:5px 0;");
        table_add_collumn.appendChild(table_add_row_button);
        table_add_row_button.addEventListener("click", function (evt) { return _this.filterAddRow(); });
        table_last_contents.appendChild(table_add_collumn);
        var table_set_collumn = document.createElement("td");
        var table_confirm_button = document.createElement("input");
        table_confirm_button.setAttribute("type", "button");
        table_confirm_button.setAttribute("id", "table_confirm_button");
        table_confirm_button.setAttribute("value", "Set Replacements");
        table_confirm_button.setAttribute("style", "padding: 7px 0; margin:5px 0;");
        //event listeners
        table_confirm_button.addEventListener("click", function (evt) {
            _this.storeStates();
            _this.clearContainer();
            _this.rebuildContainer();
        });
        table_set_collumn.appendChild(table_confirm_button);
        table_last_contents.appendChild(table_set_collumn);
        var table_close_collumn = document.createElement("td");
        var table_close_button = document.createElement("input");
        table_close_button.setAttribute("type", "button");
        table_close_button.setAttribute("value", "Close Without Saving");
        table_close_button.setAttribute("style", "padding: 7px 0; margin:5px 0;");
        table_close_button.addEventListener("click", function (evt) {
            _this.clearContainer();
            _this.rebuildContainer();
        });
        table_close_collumn.appendChild(table_close_button);
        table_last_contents.appendChild(table_close_collumn);
        filter_table.appendChild(table_last_contents);
    };
    SettingsWindow.prototype.filterAddRow = function () {
        var _this = this;
        var number_of_filters = parseInt(this.setting_items.word_replace_settings.number_of_filters);
        var filter_table = document.getElementById("filter_table");
        filter_table.deleteRow(number_of_filters + 1);
        number_of_filters++;
        var table_row_contents = document.createElement("tr");
        table_row_contents.setAttribute("id", "FilterRow" + (number_of_filters - 1));
        var table_data_active = document.createElement("td");
        var table_checkbox_active = document.createElement("input");
        table_checkbox_active.setAttribute("type", "checkbox");
        table_checkbox_active.setAttribute("id", "Active" + (number_of_filters - 1));
        table_data_active.appendChild(table_checkbox_active);
        table_row_contents.appendChild(table_data_active);
        var table_data_pattern = document.createElement("td");
        var table_input_pattern = document.createElement("input");
        table_input_pattern.setAttribute("class", "inputs");
        table_input_pattern.setAttribute("id", "Pattern" + (number_of_filters - 1));
        table_data_pattern.appendChild(table_input_pattern);
        table_row_contents.appendChild(table_data_pattern);
        var table_data_replacement = document.createElement("td");
        var table_input_replacement = document.createElement("input");
        table_input_replacement.setAttribute("class", "inputs");
        table_input_replacement.setAttribute("id", "Replacement" + (number_of_filters - 1));
        table_data_replacement.appendChild(table_input_replacement);
        table_row_contents.appendChild(table_data_replacement);
        filter_table.appendChild(table_row_contents);
        var table_last_contents = document.createElement("tr");
        var table_add_collumn = document.createElement("td");
        var table_add_row_button = document.createElement("input");
        var table_subtract_row_button = document.createElement("input");
        table_subtract_row_button.setAttribute("type", "button");
        table_subtract_row_button.setAttribute("value", "-");
        table_subtract_row_button.setAttribute("style", "padding: 7px 0; margin:5px 0;");
        table_add_collumn.appendChild(table_subtract_row_button);
        table_subtract_row_button.addEventListener("click", function (evt) { return _this.filterRemoveRow(); });
        table_add_row_button.setAttribute("type", "button");
        table_add_row_button.setAttribute("value", "+");
        table_add_row_button.setAttribute("style", "padding: 7px 0; margin:5px 0;");
        table_add_collumn.appendChild(table_add_row_button);
        table_add_row_button.addEventListener("click", function (evt) { return _this.filterAddRow(); });
        table_last_contents.appendChild(table_add_collumn);
        var table_set_collumn = document.createElement("td");
        var table_confirm_button = document.createElement("input");
        table_confirm_button.setAttribute("type", "button");
        table_confirm_button.setAttribute("id", "table_confirm_button");
        table_confirm_button.setAttribute("value", "Set Replacements");
        table_confirm_button.setAttribute("style", "padding: 7px 0; margin:5px 0;");
        //event listeners
        table_confirm_button.addEventListener("click", function (evt) {
            _this.storeStates();
            _this.clearContainer();
            _this.rebuildContainer();
        });
        table_set_collumn.appendChild(table_confirm_button);
        table_last_contents.appendChild(table_set_collumn);
        var table_close_collumn = document.createElement("td");
        var table_close_button = document.createElement("input");
        table_close_button.setAttribute("type", "button");
        table_close_button.setAttribute("value", "Close Menu");
        table_close_button.setAttribute("style", "padding: 7px 0; margin:5px 0;");
        table_close_button.addEventListener("click", function (evt) {
            _this.clearContainer();
            _this.rebuildContainer();
        });
        table_close_collumn.appendChild(table_close_button);
        table_last_contents.appendChild(table_close_collumn);
        filter_table.appendChild(table_last_contents);
    };
    SettingsWindow.prototype.filterRemoveRow = function () {
        var number_of_filters = parseInt(this.setting_items.word_replace_settings.number_of_filters);
        var filter_table = document.getElementById("filter_table");
        if (number_of_filters != 0) {
            filter_table.deleteRow(number_of_filters);
            number_of_filters--;
        }
    };
    SettingsWindow.prototype.filterSetTable = function () {
        var filter_length = this.setting_items.word_replace_settings.Text_Filter_List.length;
        for (var filter_count = 0; filter_count < filter_length; filter_count++) {
            if (this.setting_items.word_replace_settings.Text_Filter_List[filter_count].Active === null ||
                this.setting_items.word_replace_settings.Text_Filter_List[filter_count].Regex === null ||
                this.setting_items.word_replace_settings.Text_Filter_List[filter_count].Replacement === null)
                return;
            if (this.setting_items.word_replace_settings.Text_Filter_List[filter_count].Active === "true") {
                document.getElementById("Active" + filter_count).checked = true;
            }
            else {
                document.getElementById("Active" + filter_count).checked = false;
            }
            document.getElementById("Pattern" + filter_count).value =
                this.setting_items.word_replace_settings.Text_Filter_List[filter_count].Regex;
            document.getElementById("Replacement" + filter_count).value =
                this.setting_items.word_replace_settings.Text_Filter_List[filter_count].Replacement;
        }
    };
    return SettingsWindow;
}(FeatureInterface));
var Main = /** @class */ (function (_super) {
    __extends(Main, _super);
    function Main() {
        var _this = _super.call(this) || this;
        _this.features = {}; /*;any bypasses dot notation issues on objects*/
        _this.settings = {};
        if (!Generics.storageAvailable('localStorage')) {
            alert("4F-FSE: local storage error");
            return _this;
        }
        else
            _this.activate();
        _this.retrieveStates();
        _this.init();
        _this.decideAction();
        _this.observeEvents();
        return _this;
    }
    Main.prototype.retrieveStates = function () {
        var top_bar = new TopBar();
        top_bar.build();
        this.settings = top_bar.getSettingsArr();
    };
    Main.prototype.init = function () {
        if (true) {
            this.features.image_hider = new ImageHider();
        }
        if (true) {
            this.features.image_replacer = new TextReplacer();
        }
        if (true) {
            this.features.danbooru_image_adder = new DanbooruImageAdder();
        }
        if (this.settings.password_settings == 'true') {
            this.features.text_replacer = new PasswordViewer();
        }
    };
    Main.prototype.activate = function () { console.log("4F-FSE Starting"); };
    Main.prototype.storeStates = function () { };
    Main.prototype.observeEvents = function () {
        var _this = this;
        document.addEventListener('PostsInserted', function (evt) { return _this.decideAction(); });
    };
    Main.prototype.decideAction = function () {
        var start = document.getElementById('delform');
        var itterator = document.createNodeIterator(start, NodeFilter.SHOW_ELEMENT);
        var node;
        for (var feature_key in this.features)
            this.features[feature_key].retrieveStates();
        while ((node = itterator.nextNode())) {
            for (var feature_key in this.features)
                this.features[feature_key].decideAction(node);
        }
    };
    return Main;
}(FeatureInterface));
document.addEventListener('4chanXInitFinished', function () { new Main(); });
