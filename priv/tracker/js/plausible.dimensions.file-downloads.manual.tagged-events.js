!function(){"use strict";var o=window.location,l=window.document,p=l.currentScript,c=p.getAttribute("data-api")||new URL(p.src).origin+"/api/event";function u(t){console.warn("Ignoring Event: "+t)}function t(t,e){if(/^localhost$|^127(\.[0-9]+){0,2}\.[0-9]+$|^\[::1?\]$/.test(o.hostname)||"file:"===o.protocol)return u("localhost");if(!(window._phantom||window.__nightmare||window.navigator.webdriver||window.Cypress)){try{if("true"===window.localStorage.plausible_ignore)return u("localStorage flag")}catch(t){}var a={};a.n=t,a.u=e&&e.u?e.u:o.href,a.d=p.getAttribute("data-domain"),a.r=l.referrer||null,a.w=window.innerWidth,e&&e.meta&&(a.m=JSON.stringify(e.meta)),e&&e.props&&(a.p=e.props);var r=p.getAttributeNames().filter(function(t){return"event-"===t.substring(0,6)}),n=a.p||{};r.forEach(function(t){var e=t.replace("event-",""),a=p.getAttribute(t);n[e]=n[e]||a}),a.p=n;var i=new XMLHttpRequest;i.open("POST",c,!0),i.setRequestHeader("Content-Type","text/plain"),i.send(JSON.stringify(a)),i.onreadystatechange=function(){4===i.readyState&&e&&e.callback&&e.callback()}}}var e=["pdf","xlsx","docx","txt","rtf","csv","exe","key","pps","ppt","pptx","7z","pkg","rar","gz","zip","avi","mov","mp4","mpeg","wmv","midi","mp3","wav","wma"],a=p.getAttribute("file-types"),r=p.getAttribute("add-file-types"),s=a&&a.split(",")||r&&r.split(",").concat(e)||e;function n(t){for(var e=t.target,a="auxclick"===t.type&&2===t.which,r="click"===t.type;e&&(void 0===e.tagName||"a"!==e.tagName.toLowerCase()||!e.href);)e=e.parentNode;var n,i=e&&e.href&&e.href.split("?")[0];i&&(n=i.split(".").pop(),s.some(function(t){return t===n}))&&((a||r)&&plausible("File Download",{props:{url:i}}),e.target&&!e.target.match(/^_(self|parent|top)$/i)||t.ctrlKey||t.metaKey||t.shiftKey||!r||(setTimeout(function(){o.href=e.href},150),t.preventDefault()))}function i(t){for(var e=t.target,a="auxclick"===t.type&&2===t.which,r="click"===t.type;e&&(void 0===e.tagName||"a"!==e.tagName.toLowerCase()||!e.href);)e=e.parentNode;e&&e.href&&e.getAttribute("data-event-name")&&((a||r)&&f(e),e.target&&!e.target.match(/^_(self|parent|top)$/i)||t.ctrlKey||t.metaKey||t.shiftKey||!r||(setTimeout(function(){o.href=e.href},150),t.preventDefault()))}function f(t){var e=t.getAttribute("data-event-name"),a=function(t){for(var e={},a=0;a<t.length;a++){var r,n=t[a].name;"data-event-"===n.substring(0,11)&&"data-event-name"!==n&&(r=n.replace("data-event-",""),e[r]=t[a].value)}return e}(t.attributes);t.href&&(a.url=t.href),plausible(e,{props:a})}l.addEventListener("click",n),l.addEventListener("auxclick",n),l.addEventListener("submit",function(t){t.target.getAttribute("data-event-name")&&(t.preventDefault(),f(t.target),setTimeout(function(){t.target.submit()},150))}),l.addEventListener("click",i),l.addEventListener("auxclick",i);var d=window.plausible&&window.plausible.q||[];window.plausible=t;for(var v=0;v<d.length;v++)t.apply(this,d[v])}();