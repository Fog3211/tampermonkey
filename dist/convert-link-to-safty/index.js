"use strict";
// ==UserScript==
// @name         去除简书、知乎外链安全限制
// @namespace    https://github.com/Fog3211/tampermonkey/blob/main/dist/convert-link-to-safty/index.js
// @version      0.1.2
// @description  去除简书、知乎外链安全限制
// @author       Fog3211
// @match      https://*.jianshu.com/*
// @match      https://*.zhihu.com/*
// @grant        none
// ==/UserScript==
(function () {
    'use strict';
    var loading = false;
    var rewriteHref = function () {
        if (loading) {
            return;
        }
        loading = true;
        var ConfigList = [
            { key: 'jianshu', linkSelector: '//link.jianshu.com', splitFlag: 'to=' },
            { key: 'zhihu', linkSelector: '//link.zhihu.com', splitFlag: 'target=' }
        ];
        var record = ConfigList.find(function (u) { return window.location.hostname.includes(u.key); });
        if (record) {
            var aLists = Array.from(document.querySelectorAll("a[href*='".concat(record.linkSelector, "']")));
            aLists.forEach(function (elm) {
                var realUrl = decodeURIComponent(elm.href).split(record.splitFlag)[1];
                elm.setAttribute('href', realUrl);
            });
        }
        loading = false;
    };
    rewriteHref();
    setInterval(function () {
        rewriteHref();
    }, 3000);
})();
