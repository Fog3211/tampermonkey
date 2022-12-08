"use strict";
// ==UserScript==
// @name         屏蔽复制版权信息
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  在力扣网站，屏蔽复制版权信息
// @author       Fog3211
// @match        *://*.leetcode-cn.com/*
// @grant        none
// ==/UserScript==
(function () {
    "use strict";
    // Your code here...
    var siteDir = [
        { url: 'leetcode-cn.com', selector: '#app' }
    ];
    var targetSelector = siteDir.find(function (u) { return window.location.hostname.includes(u.url); });
    if (targetSelector) {
        // @ts-ignore
        window.getEventListeners(document.querySelector(targetSelector.selector)).copy.array.forEach(function (elm) { return elm.remove(); });
    }
})();
