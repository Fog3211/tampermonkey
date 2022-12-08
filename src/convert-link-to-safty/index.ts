// ==UserScript==
// @name         去除简书、知乎外链安全限制
// @namespace    http://tampermonkey.net/
// @version      0.1.2
// @description  去除简书、知乎外链安全限制
// @author       Fog3211
// @match      https://*.jianshu.com/*
// @match      https://*.zhihu.com/*
// @grant        none
// ==/UserScript==

(function () {
  'use strict';

  let loading = false

  const rewriteHref = () => {
    if (loading) { return }
    loading = true
    const ConfigList = [
      { key: 'jianshu', linkSelector: '//link.jianshu.com', splitFlag: 'to=' },
      { key: 'zhihu', linkSelector: '//link.zhihu.com', splitFlag: 'target=' }
    ]
    const record = ConfigList.find(u => window.location.hostname.includes(u.key))

    if (record) {
      const aLists = Array.from(
        document.querySelectorAll(`a[href*='${record.linkSelector}']`)
      ) as HTMLLinkElement[]

      aLists.forEach(elm => {
        const realUrl = decodeURIComponent(elm.href).split(record.splitFlag)[1]
        elm.setAttribute('href', realUrl)
      })
    }
    loading = false
  }

  rewriteHref();
  setInterval(() => {
    rewriteHref();
  }, 3000);
})();
