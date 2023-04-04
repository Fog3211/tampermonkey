// ==UserScript==
// @name         AI-Bot跳转地址转换
// @namespace    https://raw.githubusercontent.com/Fog3211/tampermonkey/gh-pages/ai-bot-link.js
// @version      0.0.1
// @description  AI-Bot跳转地址转换
// @author       Fog3211
// @match      https://ai-bot.cn/*
// @grant        none
// @license      MIT
// ==/UserScript==

(function () {
  'use strict';

  const links = document.querySelectorAll('a.card')
  links.forEach(link => {
    const targetUrl = link.getAttribute('data-url')
    const href = link.getAttribute('href')

    if (targetUrl && href) {
      link.setAttribute('href', targetUrl)
      link.setAttribute('data-href', href)
    }
  })

})();
