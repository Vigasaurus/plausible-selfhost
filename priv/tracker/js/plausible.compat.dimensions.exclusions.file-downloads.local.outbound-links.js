!function(){"use strict";var t,e,a,u=window.location,d=window.document,f=d.getElementById("plausible"),g=f.getAttribute("data-api")||(t=f.src.split("/"),e=t[0],a=t[2],e+"//"+a+"/api/event");function v(t){console.warn("Ignoring Event: "+t)}function i(t,e){try{if("true"===window.localStorage.plausible_ignore)return v("localStorage flag")}catch(t){}var a=f&&f.getAttribute("data-include"),i=f&&f.getAttribute("data-exclude");if("pageview"===t){var r=!a||a&&a.split(",").some(o),n=i&&i.split(",").some(o);if(!r||n)return v("exclusion rule")}function o(t){var e=u.pathname;return console.log(e),e.match(new RegExp("^"+t.trim().replace(/\*\*/g,".*").replace(/([^\.])\*/g,"$1[^\\s/]*")+"/?$"))}var p={};p.n=t,p.u=u.href,p.d=f.getAttribute("data-domain"),p.r=d.referrer||null,p.w=window.innerWidth,e&&e.meta&&(p.m=JSON.stringify(e.meta)),e&&e.props&&(p.p=e.props);var l=f.getAttributeNames().filter(function(t){return"event-"===t.substring(0,6)}),s=p.p||{};l.forEach(function(t){var e=t.replace("event-",""),a=f.getAttribute(t);s[e]=s[e]||a}),p.p=s;var c=new XMLHttpRequest;c.open("POST",g,!0),c.setRequestHeader("Content-Type","text/plain"),c.send(JSON.stringify(p)),c.onreadystatechange=function(){4===c.readyState&&e&&e.callback&&e.callback()}}function r(t){for(var e=t.target,a="auxclick"===t.type&&2===t.which,i="click"===t.type;e&&(void 0===e.tagName||"a"!==e.tagName.toLowerCase()||!e.href);)e=e.parentNode;e&&e.href&&e.host&&e.host!==u.host&&((a||i)&&plausible("Outbound Link: Click",{props:{url:e.href}}),e.target&&!e.target.match(/^_(self|parent|top)$/i)||t.ctrlKey||t.metaKey||t.shiftKey||!i||(setTimeout(function(){u.href=e.href},150),t.preventDefault()))}d.addEventListener("click",r),d.addEventListener("auxclick",r);var n=["pdf","xlsx","docx","txt","rtf","csv","exe","key","pps","ppt","pptx","7z","pkg","rar","gz","zip","avi","mov","mp4","mpeg","wmv","midi","mp3","wav","wma"],o=f.getAttribute("file-types"),p=f.getAttribute("add-file-types"),l=o&&o.split(",")||p&&p.split(",").concat(n)||n;function s(t){for(var e=t.target,a="auxclick"===t.type&&2===t.which,i="click"===t.type;e&&(void 0===e.tagName||"a"!==e.tagName.toLowerCase()||!e.href);)e=e.parentNode;var r,n=e&&e.href&&e.href.split("?")[0];n&&(r=n.split(".").pop(),l.some(function(t){return t===r}))&&((a||i)&&plausible("File Download",{props:{url:n}}),e.target&&!e.target.match(/^_(self|parent|top)$/i)||t.ctrlKey||t.metaKey||t.shiftKey||!i||(setTimeout(function(){u.href=e.href},150),t.preventDefault()))}d.addEventListener("click",s),d.addEventListener("auxclick",s);var c=window.plausible&&window.plausible.q||[];window.plausible=i;for(var h,m=0;m<c.length;m++)i.apply(this,c[m]);function w(){h!==u.pathname&&(h=u.pathname,i("pageview"))}var y,b=window.history;b.pushState&&(y=b.pushState,b.pushState=function(){y.apply(this,arguments),w()},window.addEventListener("popstate",w)),"prerender"===d.visibilityState?d.addEventListener("visibilitychange",function(){h||"visible"!==d.visibilityState||w()}):w()}();