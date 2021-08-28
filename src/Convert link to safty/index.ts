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
  const ConfigList = [
    { targetReg: /https:\/\/\w+.jianshu.com/, linkReg: /https:\/\/link.jianshu.com\/\?t=/ },
    { targetReg: /https:\/\/\w+.zhihu.com/, linkReg: /https:\/\/link.zhihu.com\/\?target=/ }
  ]
  const record = ConfigList.find(u => u.targetReg.test(window.location.href))
  if (record) {
    const aLists = document.querySelectorAll('a')
    if (aLists) {
      aLists.forEach(elm => {
        if (record.linkReg.test(elm.href)) {
          const targetUrl = elm.href.replace((record.linkReg), '')
          elm.setAttribute('href', decodeURIComponent(targetUrl))
        }
      })
    }
  }
})();
