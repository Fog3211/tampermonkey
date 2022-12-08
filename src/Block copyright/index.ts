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
  const siteDir = [
    { url: 'leetcode-cn.com', selector: '#app' }
  ]
  const targetSelector = siteDir.find(u => window.location.hostname.includes(u.url))
  if (targetSelector) {
    // @ts-ignore
    window.getEventListeners(
      document.querySelector(targetSelector.selector)
    ).copy.array.forEach((elm: HTMLElement) => elm.remove());
  }
})();
