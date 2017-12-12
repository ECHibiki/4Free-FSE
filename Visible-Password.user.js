// ==UserScript==
// @name         Visible Password
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  try to take over the world!
// @author       You
// @match http://boards.4chan.org/*
// @match https://boards.4chan.org/*
// @include https://boards.4chan.org/*
// @include http://boards.4chan.org/*
// @updateURL    https://github.com/ECHibiki/4chan-UserScripts/raw/master/Visible-Password.user.js
// @downloadURL  https://github.com/ECHibiki/4chan-UserScripts/raw/master/Visible-Password.user.js
// ==/UserScript==

(function() {
    'use strict';
    document.getElementById("postPassword").setAttribute("type", "");
    document.getElementById("postPassword").value = "_oZfG5xpuTkOsw0qEbWVtImzL9YrQ6dNg";
    // Your code here...
    document.getElementById("delPassword").setAttribute("type", "");
    document.getElementById("delPassword").value = "_oZfG5xpuTkOsw0qEbWVtImzL9YrQ6dNg";
})();