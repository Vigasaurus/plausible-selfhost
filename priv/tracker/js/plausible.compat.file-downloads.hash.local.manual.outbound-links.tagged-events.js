!function(){"use strict";var e,t,a,o=window.location,i=window.document,n=i.getElementById("plausible"),l=n.getAttribute("data-api")||(e=n.src.split("/"),t=e[0],a=e[2],t+"//"+a+"/api/event");function r(e,t){if(!(window._phantom||window.__nightmare||window.navigator.webdriver||window.Cypress)){try{if("true"===window.localStorage.plausible_ignore)return void console.warn("Ignoring Event: localStorage flag")}catch(e){}var a={};a.n=e,a.u=t&&t.u?t.u:o.href,a.d=n.getAttribute("data-domain"),a.r=i.referrer||null,a.w=window.innerWidth,t&&t.meta&&(a.m=JSON.stringify(t.meta)),t&&t.props&&(a.p=t.props),a.h=1;var r=new XMLHttpRequest;r.open("POST",l,!0),r.setRequestHeader("Content-Type","text/plain"),r.send(JSON.stringify(a)),r.onreadystatechange=function(){4===r.readyState&&t&&t.callback&&t.callback()}}}function p(e){for(var t=e.target,a="auxclick"===e.type&&2===e.which,r="click"===e.type;t&&(void 0===t.tagName||"a"!==t.tagName.toLowerCase()||!t.href);)t=t.parentNode;t&&t.href&&t.host&&t.host!==o.host&&((a||r)&&plausible("Outbound Link: Click",{props:{url:t.href}}),t.target&&!t.target.match(/^_(self|parent|top)$/i)||e.ctrlKey||e.metaKey||e.shiftKey||!r||(setTimeout(function(){o.href=t.href},150),e.preventDefault()))}i.addEventListener("click",p),i.addEventListener("auxclick",p);var c=["pdf","xlsx","docx","txt","rtf","csv","exe","key","pps","ppt","pptx","7z","pkg","rar","gz","zip","avi","mov","mp4","mpeg","wmv","midi","mp3","wav","wma"],s=n.getAttribute("file-types"),u=n.getAttribute("add-file-types"),d=s&&s.split(",")||u&&u.split(",").concat(c)||c;function f(e){for(var t=e.target,a="auxclick"===e.type&&2===e.which,r="click"===e.type;t&&(void 0===t.tagName||"a"!==t.tagName.toLowerCase()||!t.href);)t=t.parentNode;var i,n=t&&t.href&&t.href.split("?")[0];n&&(i=n.split(".").pop(),d.some(function(e){return e===i}))&&((a||r)&&plausible("File Download",{props:{url:n}}),t.target&&!t.target.match(/^_(self|parent|top)$/i)||e.ctrlKey||e.metaKey||e.shiftKey||!r||(setTimeout(function(){o.href=t.href},150),e.preventDefault()))}function v(e){for(var t=e.target,a="auxclick"===e.type&&2===e.which,r="click"===e.type;t&&(void 0===t.tagName||"a"!==t.tagName.toLowerCase()||!t.href);)t=t.parentNode;t&&t.href&&t.getAttribute("data-event-name")&&((a||r)&&g(t),t.target&&!t.target.match(/^_(self|parent|top)$/i)||e.ctrlKey||e.metaKey||e.shiftKey||!r||(setTimeout(function(){o.href=t.href},150),e.preventDefault()))}function g(e){var t=e.getAttribute("data-event-name"),a=function(e){for(var t={},a=0;a<e.length;a++){var r,i=e[a].name;"data-event-"===i.substring(0,11)&&"data-event-name"!==i&&(r=i.replace("data-event-",""),t[r]=e[a].value)}return t}(e.attributes);e.href&&(a.url=e.href),plausible(t,{props:a})}i.addEventListener("click",f),i.addEventListener("auxclick",f),i.addEventListener("submit",function(e){e.target.getAttribute("data-event-name")&&(e.preventDefault(),g(e.target),setTimeout(function(){e.target.submit()},150))}),i.addEventListener("click",v),i.addEventListener("auxclick",v);var h=window.plausible&&window.plausible.q||[];window.plausible=r;for(var m=0;m<h.length;m++)r.apply(this,h[m])}();