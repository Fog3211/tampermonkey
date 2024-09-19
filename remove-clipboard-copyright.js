"use strict";
// ==UserScript==
// @name         屏蔽复制版权信息
// @namespace    https://raw.githubusercontent.com/Fog3211/tampermonkey/gh-pages/remove-clipboard-copyright.js
// @version      0.0.6
// @license      MIT
// @description  在力扣、知乎网站屏蔽复制版权信息
// @author       Fog3211
// @match        https://leetcode-cn.com/*
// @match        https://leetcode.cn/*
// @match        https://*.zhihu.com/*
// @match        https://*.jianshu.com/*
// @match        https://*.juejin.cn/*
// @grant        none
// @license      MIT
// ==/UserScript==
(function () {
    "use strict";
    const handleCopy = (e) => {
        e.preventDefault(); //阻止默认事件
        e.stopImmediatePropagation(); // 在执行完当前事件处理程序之后，停止当前节点以及所有后续节点的事件处理程序的运行
        const selected = window.getSelection();
        if (selected) {
            const clipboard = e.clipboardData;
            if (clipboard) {
                clipboard.setData("Text", selected.toString());
            }
        }
    };
    document.addEventListener('copy', handleCopy);
})();
