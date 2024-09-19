// ==UserScript==
// @name         去除网站外链跳转安全限制
// @namespace    https://raw.githubusercontent.com/Fog3211/tampermonkey/gh-pages/external-link-resolver.js
// @version      1.0.2
// @description  去除简书、知乎、掘金、CSDN、思否、少数派等网站的外链安全限制，将a标签改为直接跳转
// @license      MIT
// @match        https://juejin.cn/*
// @match        https://link.juejin.cn/*
// @match        https://segmentfault.com/*
// @match        https://link.segmentfault.com/*
// @match        https://csdn.net/*
// @match        https://link.csdn.net/*
// @match        https://*.jianshu.com/*
// @match        https://*.zhihu.com/*
// @match        https://link.zhihu.com/*
// @match        https://sspai.com/*
// @grant        GM_xmlhttpRequest
// ==/UserScript==

interface SiteConfig {
  directMatch: string[];
  extractTarget?: (url: URL) => Promise<string | null>
  targetParam?: string;
}

interface SiteConfigs {
  [key: string]: SiteConfig;
}

(function () {
  "use strict";

  // Generic extractTarget function
  const genericExtractTarget = (url: URL, paramName: string): string | null => {
    const params = new URLSearchParams(url.search);
    return params.get(paramName);
  };

  const siteConfigs: SiteConfigs = {
    "juejin": {
      directMatch: ["https://link.juejin.cn"],
      extractTarget: async (url: URL): Promise<string | null> => {
        const target = genericExtractTarget(url, "target");
        if (target) {
          if (target.startsWith("https://link.juejin.cn")) {
            return siteConfigs["juejin"].extractTarget!(new URL(target));
          }
          return decodeURIComponent(target);
        }
        return null;
      }
    },
    "segmentfault": {
      directMatch: ["https://link.segmentfault.com"],
      extractTarget: async (url: URL): Promise<string> => {
        return new Promise((resolve) => {
          GM_xmlhttpRequest({
            method: "GET",
            url: url.href,
            headers: {
              "Referer": "https://segmentfault.com",
            },
            onload: function (response: TampermonkeyTypes.GMXMLHttpRequestResponse) {
              const parser = new DOMParser();
              const doc = parser.parseFromString(response.responseText, "text/html");
              const dataUrl = doc.body.getAttribute("data-url");
              resolve(dataUrl || url.href);
            },
            onerror: function () {
              resolve(url.href);
            }
          });
        });
      }
    },
    "csdn": {
      directMatch: ["https://link.csdn.net"],
      targetParam: "target"
    },
    "jianshu": {
      directMatch: ["https://link.jianshu.com", "https://links.jianshu.com"],
      targetParam: "to"
    },
    "zhihu": {
      directMatch: ["https://link.zhihu.com"],
      targetParam: "target"
    },
    "sspai": {
      directMatch: ["https://sspai.com"],
      targetParam: "target"
    }
  };

  async function processRule(config: SiteConfig): Promise<void> {
    if (config.directMatch.includes(window.location.origin)) {
      let targetUrl = await getTargetUrl(config, new URL(window.location.href));
      while (targetUrl && new URL(targetUrl).origin === "https://link.juejin.cn") {
        // Keep resolving until we get the final non-Juejin link
        targetUrl = await getTargetUrl(siteConfigs["juejin"], new URL(targetUrl));
      }
      if (targetUrl) {
        window.location.href = targetUrl;
      }
      return;
    }

    await replaceLinks(config);
  }

  async function getTargetUrl(config: SiteConfig, url: URL): Promise<string | null> {
    if (config.targetParam) {
      return genericExtractTarget(url, config.targetParam);
    } else if (config.extractTarget) {
      return config.extractTarget(url);
    }
    return null;
  }

  async function replaceLinks(config: SiteConfig): Promise<void> {
    const linkSelector = config.directMatch.map(site => `a[href^="${site}"]`).join(", ");
    const links = document.querySelectorAll<HTMLAnchorElement>(linkSelector);

    for (const link of links) {
      const href = link.getAttribute("href");
      if (href) {
        const targetUrl = await getTargetUrl(config, new URL(href));
        if (targetUrl) {
          link.href = decodeURIComponent(targetUrl);
          link.target = "_blank";
          link.rel = "noopener noreferrer";
        }
      }
    }
  }

  function observeDOMChanges(config: SiteConfig): void {
    const observer = new MutationObserver(() => replaceLinks(config));
    observer.observe(document.body, { childList: true, subtree: true });
  }

  async function init(): Promise<void> {
    const currentSite = Object.keys(siteConfigs).find(site =>
      siteConfigs[site].directMatch.includes(window.location.origin)
    );

    if (currentSite) {
      const config = siteConfigs[currentSite];
      await processRule(config);
      observeDOMChanges(config);
    }
  }

  init();
})();