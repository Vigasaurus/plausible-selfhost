!function(){"use strict";var s=window.location,c=window.document,p=c.currentScript,d=p.getAttribute("data-api")||new URL(p.src).origin+"/api/event";function f(t){console.warn("Ignoring Event: "+t)}function t(t,e){if(/^localhost$|^127(\.[0-9]+){0,2}\.[0-9]+$|^\[::1?\]$/.test(s.hostname)||"file:"===s.protocol)return f("localhost");if(!(window._phantom||window.__nightmare||window.navigator.webdriver||window.Cypress)){try{if("true"===window.localStorage.plausible_ignore)return f("localStorage flag")}catch(t){}var a=p&&p.getAttribute("data-include"),n=p&&p.getAttribute("data-exclude");if("pageview"===t){var i=!a||a&&a.split(",").some(l),r=n&&n.split(",").some(l);if(!i||r)return f("exclusion rule")}var o={};o.n=t,o.u=s.href,o.d=p.getAttribute("data-domain"),o.r=c.referrer||null,o.w=window.innerWidth,e&&e.meta&&(o.m=JSON.stringify(e.meta)),e&&e.props&&(o.p=e.props);var u=new XMLHttpRequest;u.open("POST",d,!0),u.setRequestHeader("Content-Type","text/plain"),u.send(JSON.stringify(o)),u.onreadystatechange=function(){4===u.readyState&&e&&e.callback&&e.callback()}}function l(t){return s.pathname.match(new RegExp("^"+t.trim().replace(/\*\*/g,".*").replace(/([^\.])\*/g,"$1[^\\s/]*")+"/?$"))}}function e(t){for(var e=t.target,a="auxclick"===t.type&&2===t.which,n="click"===t.type;e&&(void 0===e.tagName||"a"!==e.tagName.toLowerCase()||!e.href);)e=e.parentNode;e&&e.href&&e.getAttribute("data-event-name")&&((a||n)&&i(e),e.target&&!e.target.match(/^_(self|parent|top)$/i)||t.ctrlKey||t.metaKey||t.shiftKey||!n||(setTimeout(function(){s.href=e.href},150),t.preventDefault()))}function i(t){var e=t.getAttribute("data-event-name"),a=function(t){for(var e={},a=0;a<t.length;a++){var n,i=t[a].name;"data-event-"===i.substring(0,11)&&"data-event-name"!==i&&(n=i.replace("data-event-",""),e[n]=t[a].value)}return e}(t.attributes);t.href&&(a.url=t.href),plausible(e,{props:a})}c.addEventListener("submit",function(t){t.target.getAttribute("data-event-name")&&(t.preventDefault(),i(t.target),setTimeout(function(){t.target.submit()},150))}),c.addEventListener("click",e),c.addEventListener("auxclick",e);var a=window.plausible&&window.plausible.q||[];window.plausible=t;for(var n,r=0;r<a.length;r++)t.apply(this,a[r]);function o(){n!==s.pathname&&(n=s.pathname,t("pageview"))}var u,l=window.history;l.pushState&&(u=l.pushState,l.pushState=function(){u.apply(this,arguments),o()},window.addEventListener("popstate",o)),"prerender"===c.visibilityState?c.addEventListener("visibilitychange",function(){n||"visible"!==c.visibilityState||o()}):o()}();