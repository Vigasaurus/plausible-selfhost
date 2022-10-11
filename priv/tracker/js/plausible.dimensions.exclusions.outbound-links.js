!function(){"use strict";var p=window.location,d=window.document,f=d.currentScript,w=f.getAttribute("data-api")||new URL(f.src).origin+"/api/event";function v(t){console.warn("Ignoring Event: "+t)}function t(t,e){if(/^localhost$|^127(\.[0-9]+){0,2}\.[0-9]+$|^\[::1?\]$/.test(p.hostname)||"file:"===p.protocol)return v("localhost");if(!(window._phantom||window.__nightmare||window.navigator.webdriver||window.Cypress)){try{if("true"===window.localStorage.plausible_ignore)return v("localStorage flag")}catch(t){}var i=f&&f.getAttribute("data-include"),n=f&&f.getAttribute("data-exclude");if("pageview"===t){var a=!i||i&&i.split(",").some(c),r=n&&n.split(",").some(c);if(!a||r)return v("exclusion rule")}var o={};o.n=t,o.u=p.href,o.d=f.getAttribute("data-domain"),o.r=d.referrer||null,o.w=window.innerWidth,e&&e.meta&&(o.m=JSON.stringify(e.meta)),e&&e.props&&(o.p=e.props);var l=f.getAttributeNames().filter(function(t){return"event-"===t.substring(0,6)}),s=o.p||{};l.forEach(function(t){var e=t.replace("event-",""),i=f.getAttribute(t);s[e]=s[e]||i}),o.p=s;var u=new XMLHttpRequest;u.open("POST",w,!0),u.setRequestHeader("Content-Type","text/plain"),u.send(JSON.stringify(o)),u.onreadystatechange=function(){4===u.readyState&&e&&e.callback&&e.callback()}}function c(t){return p.pathname.match(new RegExp("^"+t.trim().replace(/\*\*/g,".*").replace(/([^\.])\*/g,"$1[^\\s/]*")+"/?$"))}}var e=window.plausible&&window.plausible.q||[];window.plausible=t;for(var i,n=0;n<e.length;n++)t.apply(this,e[n]);function a(){i!==p.pathname&&(i=p.pathname,t("pageview"))}var r,o=window.history;o.pushState&&(r=o.pushState,o.pushState=function(){r.apply(this,arguments),a()},window.addEventListener("popstate",a)),"prerender"===d.visibilityState?d.addEventListener("visibilitychange",function(){i||"visible"!==d.visibilityState||a()}):a();var c=1;function l(t){if("auxclick"!==t.type||t.button===c){var e,i,n,a,r,o,l=function(t){for(;t&&(void 0===t.tagName||"a"!==t.tagName.toLowerCase()||!t.href);)t=t.parentNode;return t}(t.target);l&&l.href&&l.href.split("?")[0];if((o=l)&&o.href&&o.host&&o.host!==p.host){var s={url:l.href};return a=s,r=!(n="Outbound Link: Click"),void(!function(t,e){if(!t.defaultPrevented){var i=!e.target||e.target.match(/^_(self|parent|top)$/i),n=!(t.ctrlKey||t.metaKey||t.shiftKey)&&"click"===t.type;return i&&n}}(e=t,i=l)?plausible(n,{props:a}):(plausible(n,{props:a,callback:u}),setTimeout(u,5e3),e.preventDefault()))}}function u(){r||(r=!0,window.location=i.href)}}d.addEventListener("click",l),d.addEventListener("auxclick",l)}();