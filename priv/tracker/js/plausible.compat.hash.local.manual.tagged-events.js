!function(){"use strict";var e,t,a,r=window.location,i=window.document,o=i.getElementById("plausible"),u=o.getAttribute("data-api")||(e=o.src.split("/"),t=e[0],a=e[2],t+"//"+a+"/api/event");function n(e,t){if(!(window._phantom||window.__nightmare||window.navigator.webdriver||window.Cypress)){try{if("true"===window.localStorage.plausible_ignore)return void console.warn("Ignoring Event: localStorage flag")}catch(e){}var a={};a.n=e,a.u=t&&t.u?t.u:r.href,a.d=o.getAttribute("data-domain"),a.r=i.referrer||null,a.w=window.innerWidth,t&&t.meta&&(a.m=JSON.stringify(t.meta)),t&&t.props&&(a.p=t.props),a.h=1;var n=new XMLHttpRequest;n.open("POST",u,!0),n.setRequestHeader("Content-Type","text/plain"),n.send(JSON.stringify(a)),n.onreadystatechange=function(){4===n.readyState&&t&&t.callback&&t.callback()}}}function l(e){for(var t=e.target,a="auxclick"===e.type&&2===e.which,n="click"===e.type;t&&(void 0===t.tagName||"a"!==t.tagName.toLowerCase()||!t.href);)t=t.parentNode;t&&t.href&&t.getAttribute("data-event-name")&&((a||n)&&d(t),t.target&&!t.target.match(/^_(self|parent|top)$/i)||e.ctrlKey||e.metaKey||e.shiftKey||!n||(setTimeout(function(){r.href=t.href},150),e.preventDefault()))}function d(e){var t=e.getAttribute("data-event-name"),a=function(e){for(var t={},a=0;a<e.length;a++){var n,r=e[a].name;"data-event-"===r.substring(0,11)&&"data-event-name"!==r&&(n=r.replace("data-event-",""),t[n]=e[a].value)}return t}(e.attributes);e.href&&(a.url=e.href),plausible(t,{props:a})}i.addEventListener("submit",function(e){e.target.getAttribute("data-event-name")&&(e.preventDefault(),d(e.target),setTimeout(function(){e.target.submit()},150))}),i.addEventListener("click",l),i.addEventListener("auxclick",l);var s=window.plausible&&window.plausible.q||[];window.plausible=n;for(var c=0;c<s.length;c++)n.apply(this,s[c])}();