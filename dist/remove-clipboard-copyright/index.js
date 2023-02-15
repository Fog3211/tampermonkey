"use strict";
// ==UserScript==
// @name         屏蔽复制版权信息
// @namespace    https://github.com/Fog3211/tampermonkey/blob/main/dist/remove-clipboard-copyright/index.js
// @version      0.0.2
// @description  在力扣、知乎网站屏蔽复制版权信息
// @author       Fog3211
// @match        https://*.leetcode-cn.com/*
// @match        https://*.zhihu.com/*
// @grant        none
// @license      MIT
// ==/UserScript==
(function () {
    "use strict";
    var handleCopy = function (e) {
        e.preventDefault(); //阻止默认事件
        e.stopImmediatePropagation(); // 在执行完当前事件处理程序之后，停止当前节点以及所有后续节点的事件处理程序的运行
        var selected = window.getSelection();
        if (selected) {
            var clipboard = e.clipboardData;
            if (clipboard) {
                clipboard.setData("Text", selected.toString());
            }
        }
    };
    document.addEventListener('copy', handleCopy);
})();
