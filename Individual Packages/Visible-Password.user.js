// ==UserScript==
// @name         Visible Password
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  View post and delete passwords
// @author       You
// @match http://boards.4chan.org/*
// @match https://boards.4chan.org/*
// @include https://boards.4chan.org/*
// @include http://boards.4chan.org/*
// @updateURL    https://github.com/ECHibiki/4chanX-FSE/raw/master/Individual%20Packages/Visible-Password.user.js
// @downloadURL  https://github.com/ECHibiki/4chanX-FSE/raw/master/Individual%20Packages/Visible-Password.user.js
// ==/UserScript==

/*
Displays your 4chan password in an inputbox.
Top left is the post password, Bottom right is the delete password.
Edit the input boxes to change them.

Note: some 4chan boards don't allow custom post passwords. May require cookie manipulation, but this has not yet been tested
*/
(function() {

    document.getElementById("postPassword").setAttribute("type", "");
    document.getElementById("postPassword").value = document.getElementById("postPassword").value;

    document.getElementById("delPassword").setAttribute("type", "");
    document.getElementById("delPassword").value = document.getElementById("delPassword").value;
})();