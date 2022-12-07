// ==UserScript==
// @name         去除简书、知乎外链安全限制
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  去除简书、知乎外链安全限制
// @author       Fog3211
// @include      https://*.jianshu.com/*
// @include      https://*.zhihu.com/*
// @grant        none
// ==/UserScript==
(function () {
    'use strict';
    var ConfigList = [
        { key: 'jianshu', linkReg: /https:\/\/link.jianshu.com\/\?t=/, splitFlag: '?target=' },
        { key: 'zhihu', linkReg: /https:\/\/link.zhihu.com\/\?target=/, splitFlag: '?to=' }
    ];
    var record = ConfigList.find(function (u) { return window.location.hostname.includes(u.key); });
    if (record) {
        // @ts-ignore
        var aLists = document.querySelectorAll("a[href*='//link.zhihu.com']");
        aLists.forEach(function (elm) {
            if (record.linkReg.test(elm.href)) {
                elm.setAttribute('href', decodeURIComponent(elm.href.split(record.splitFlag)[1]));
            }
        });
    }
})();
