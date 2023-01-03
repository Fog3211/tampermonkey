// ==UserScript==
// @name         去除简书、知乎、掘金外链安全限制
// @namespace    https://github.com/Fog3211/tampermonkey/blob/main/dist/convert-link-to-safty/index.js
// @version      0.1.3
// @description  去除简书、知乎、掘金外链安全限制
// @author       Fog3211
// @match      https://*.jianshu.com/*
// @match      https://*.zhihu.com/*
// @match      https://*.juejin.cn/*
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
      { key: 'zhihu', linkSelector: '//link.zhihu.com', splitFlag: 'target=' },
      { key: 'juejin', linkSelector: '//link.juejin.cn', splitFlag: 'target=' }
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
