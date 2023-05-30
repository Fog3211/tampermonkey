"use strict";
// ==UserScript==
// @name         去除简书、知乎、掘金外链安全限制
// @namespace    https://raw.githubusercontent.com/Fog3211/tampermonkey/gh-pages/convert-link-to-safty.js
// @version      0.2.0
// @description  去除简书、知乎、掘金外链安全限制，将a标签改为直接跳转
// @author       Fog3211
// @match      https://*.jianshu.com/*
// @match      https://*.zhihu.com/*
// @match      https://*.juejin.cn/*
// @match      https://*.sspai.com/*
// @match      https://*.csdn.net/*
// @grant        none
// @license      MIT
// ==/UserScript==
(function () {
    'use strict';
    var loading = false;
    var ConfigList = [
        // https://www.jianshu.com/p/c5e07343515d
        { key: 'jianshu', linkSelector: ['//link.jianshu.com', '//links.jianshu.com'], splitFlag: 'to=' },
        { key: 'zhihu', linkSelector: ['//link.zhihu.com'], splitFlag: 'target=' },
        { key: 'juejin', linkSelector: ['//link.juejin.cn'], splitFlag: 'target=' },
        { key: 'sspai', linkSelector: ['https://sspai.com'], splitFlag: 'target=' },
        { key: 'csdn', linkSelector: ['https://blog.csdn.net'], splitFlag: 'target=', searchKey: 'target' }
    ];
    var getSearchParams = function (url, key) {
        if (!url)
            return null;
        return new URL(url).searchParams.get(key);
    };
    var rewriteHref = function () {
        if (loading) {
            return;
        }
        loading = true;
        var record = ConfigList.find(function (u) { return window.location.hostname.includes(u.key); });
        if (record) {
            var aLists = Array.from(document.querySelectorAll(record.linkSelector.map(function (u) { return "a[href*='".concat(u, "']"); }).join(',')));
            aLists.forEach(function (elm) {
                /**
                 * 有可能会出现这种情况，所以要取最后一部分
                 * https://link.juejin.cn/?target=https%3A%2F%2Flink.juejin.cn%2F%3Ftarget%3Dhttps%253A%252F%252Fwww.npmjs.com%252Fpackage%252Fevents
                 */
                var matchs = decodeURIComponent(elm.href).split(record.splitFlag);
                if (matchs.length === 2) {
                    elm.setAttribute('href', matchs.pop());
                }
                else if (matchs.length > 2) {
                    elm.setAttribute('href', decodeURIComponent(matchs.pop()));
                }
            });
        }
        loading = false;
    };
    var redirectUrl = function () {
        var record = ConfigList.find(function (u) { return window.location.hostname.includes(u.key); });
        if (record === null || record === void 0 ? void 0 : record.searchKey) {
            var targetUrl = getSearchParams(window.location.href, record.searchKey);
            if (targetUrl) {
                window.location.href = targetUrl;
            }
        }
    };
    redirectUrl();
    rewriteHref();
    setInterval(function () {
        rewriteHref();
    }, 3000);
})();