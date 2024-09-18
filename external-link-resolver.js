"use strict";
// ==UserScript==
// @name         Universal External Link Direct Redirect
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Process external links on various websites to enable direct redirection to target sites
// @match        https://juejin.cn/*
// @match        https://link.juejin.cn/*
// @match        https://segmentfault.com/*
// @match        https://link.segmentfault.com/*
// @grant        GM_xmlhttpRequest
// ==/UserScript==
(function () {
    "use strict";
    const siteConfigs = {
        "juejin": {
            directMatch: "link.juejin.cn",
            linkSelector: "a[href^=\"https://link.juejin.cn\"]",
            extractTarget: async (url) => {
                const params = new URLSearchParams(url.search);
                const target = params.get("target");
                if (target) {
                    if (target.startsWith("https://link.juejin.cn")) {
                        return siteConfigs["juejin"].extractTarget(new URL(target));
                    }
                    return decodeURIComponent(target);
                }
                return null;
            }
        },
        "segmentfault": {
            directMatch: "link.segmentfault.com",
            linkSelector: "a[href^=\"https://link.segmentfault.com\"]",
            extractTarget: async (url) => {
                // TODO: Optimize SegmentFault link processing logic, consider more efficient methods
                return new Promise((resolve) => {
                    GM_xmlhttpRequest({
                        method: "GET",
                        url: url.href,
                        headers: {
                            "Referer": "https://segmentfault.com",
                        },
                        onload: function (response) {
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
            directMatch: "link.csdn.net",
            linkSelector: "a[href^=\"https://link.csdn.net/\"]",
            extractTarget: (url) => {
                const params = new URLSearchParams(url.search);
                return params.get("target");
            }
        }
    };
    async function processRule(config) {
        if (window.location.hostname === config.directMatch) {
            let targetUrl = await config.extractTarget(new URL(window.location.href));
            while (targetUrl && targetUrl.startsWith("https://link.juejin.cn")) {
                // Keep resolving until we get the final non-Juejin link
                targetUrl = await siteConfigs["juejin"].extractTarget(new URL(targetUrl));
            }
            if (targetUrl) {
                window.location.href = targetUrl;
            }
            return;
        }
        await replaceLinks(config);
    }
    async function replaceLinks(config) {
        const links = document.querySelectorAll(config.linkSelector);
        for (const link of links) {
            const href = link.getAttribute("href");
            if (href) {
                const targetUrl = await config.extractTarget(new URL(href));
                if (targetUrl) {
                    link.href = decodeURIComponent(targetUrl);
                    link.target = "_blank";
                    link.rel = "noopener noreferrer";
                }
            }
        }
    }
    function observeDOMChanges(config) {
        const observer = new MutationObserver(() => replaceLinks(config));
        observer.observe(document.body, { childList: true, subtree: true });
    }
    async function init() {
        const currentSite = Object.keys(siteConfigs).find(site => window.location.hostname.includes(site) ||
            window.location.hostname.includes(siteConfigs[site].directMatch));
        if (currentSite) {
            const config = siteConfigs[currentSite];
            await processRule(config);
            observeDOMChanges(config);
        }
    }
    init();
})();
