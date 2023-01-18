// ==UserScript==
// @name         去除简书、知乎、掘金外链安全限制
// @namespace    https://github.com/Fog3211/tampermonkey/blob/main/dist/convert-link-to-safty/index.js
// @version      0.1.7
// @description  去除简书、知乎、掘金外链安全限制，将a标签改为直接跳转
// @author       Fog3211
// @match      https://*.jianshu.com/*
// @match      https://*.zhihu.com/*
// @match      https://*.juejin.cn/*
// @grant        none
// @license      MIT
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
        /**
         * 有可能会出现这种情况，所以要取最后一部分
         * https://link.juejin.cn/?target=https%3A%2F%2Flink.juejin.cn%2F%3Ftarget%3Dhttps%253A%252F%252Fwww.npmjs.com%252Fpackage%252Fevents
         */
        const matchs = decodeURIComponent(elm.href).split(record.splitFlag)
        if (matchs.length === 2) {
          elm.setAttribute('href', matchs.pop() as string)
        } else if (matchs.length > 2) {
          elm.setAttribute('href', decodeURIComponent(matchs.pop() as string))
        }
      })
    }
    loading = false
  }

  rewriteHref();
  setInterval(() => {
    rewriteHref();
  }, 3000);
})();
