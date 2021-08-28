// ==UserScript==
// @name         去除简书、知乎外链安全限制
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  去除简书、知乎外链安全限制
// @author       Fog3211
// @include      *://www.jianshu.com/*
// @include      *://www.zhihu.com/*
// @include      *://zhuanlan.zhihu.com/*
// @grant        none
// ==/UserScript==
(function () {
    'use strict';
    var ConfigList = [
        { targetReg: /https:\/\/\w+.jianshu.com/, linkReg: /https:\/\/link.jianshu.com\/\?t=/ },
        { targetReg: /https:\/\/\w+.zhihu.com/, linkReg: /https:\/\/link.zhihu.com\/\?target=/ }
    ];
    var record = ConfigList.find(function (u) { return u.targetReg.test(window.location.href); });
    if (record) {
        var aLists = document.querySelectorAll('a');
        if (aLists) {
            aLists.forEach(function (elm) {
                if (record.linkReg.test(elm.href)) {
                    var targetUrl = elm.href.replace((record.linkReg), '');
                    elm.setAttribute('href', decodeURIComponent(targetUrl));
                }
            });
        }
    }
})();
