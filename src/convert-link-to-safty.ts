// ==UserScript==
// @name         去除简书、知乎、掘金外链安全限制
// @namespace    https://raw.githubusercontent.com/Fog3211/tampermonkey/gh-pages/convert-link-to-safty.js
// @version      0.2.1
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

  let loading = false

  const ConfigList = [
    // https://www.jianshu.com/p/c5e07343515d
    { key: 'jianshu', linkSelector: ['//link.jianshu.com', '//links.jianshu.com'], splitFlag: 'to=' },
    { key: 'zhihu', linkSelector: ['//link.zhihu.com'], splitFlag: 'target=' },
    { key: 'juejin', linkSelector: ['//link.juejin.cn'], splitFlag: 'target=' },
    { key: 'sspai', linkSelector: ['https://sspai.com'], splitFlag: 'target=' },
    { key: 'csdn', linkSelector: ['https://blog.csdn.net'], splitFlag: 'target=', searchKey: 'target' }
  ]

  const getSearchParams = (url: string, key: string) => {
    if (!url) return null
    const searchParams = new URLSearchParams(url)
    return searchParams.get(key)
  }

  const rewriteHref = () => {
    if (loading) { return }
    loading = true
    const record = ConfigList.find(u => window.location.hostname.includes(u.key))

    if (record) {

      const aLists = Array.from(
        document.querySelectorAll(
          record.linkSelector!.map(u => `a[href*='${u}']`).join(',')
        )
      ) as HTMLLinkElement[]

      aLists.forEach(elm => {
        /**
         * 有可能会出现这种情况，所以要取最后一部分
         * https://link.juejin.cn/?target=https%3A%2F%2Flink.juejin.cn%2F%3Ftarget%3Dhttps%253A%252F%252Fwww.npmjs.com%252Fpackage%252Fevents
         */
        const matchs = decodeURIComponent(elm.href).split(record.splitFlag!)
        if (matchs.length === 2) {
          elm.setAttribute('href', matchs.pop() as string)
        } else if (matchs.length > 2) {
          elm.setAttribute('href', decodeURIComponent(matchs.pop() as string))
        }
      })
    }
    loading = false
  }

  const redirectUrl = () => {
    const record = ConfigList.find(u => window.location.hostname.includes(u.key))
    if (record?.searchKey) {
      const targetUrl = getSearchParams(window.location.href.split('?')[1], record.searchKey)
      if (targetUrl) {
        window.location.href = targetUrl
      }
    }
  }

  redirectUrl()

  rewriteHref();
  setInterval(() => {
    rewriteHref();
  }, 3000);
})();
