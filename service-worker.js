(function(e){var t={};function s(n){if(t[n])return t[n].exports;var a=t[n]={i:n,l:!1,exports:{}};return e[n].call(a.exports,a,a.exports,s),a.l=!0,a.exports}s.m=e,s.c=t,s.d=function(e,t,n){s.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},s.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},s.t=function(e,t){if(1&t&&(e=s(e)),8&t)return e;if(4&t&&"object"===typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(s.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var a in e)s.d(n,a,function(t){return e[t]}.bind(null,a));return n},s.n=function(e){var t=e&&e.__esModule?function(){return e["default"]}:function(){return e};return s.d(t,"a",t),t},s.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},s.p="/baby-log/",s(s.s="4314")})({"0719":function(e,t,s){"use strict";try{self["workbox:core:6.0.2"]&&_()}catch(n){}},4314:function(e,t,s){"use strict";s.r(t);s("0719");const n=(e,...t)=>{let s=e;return t.length>0&&(s+=" :: "+JSON.stringify(t)),s},a=n;class r extends Error{constructor(e,t){const s=a(e,t);super(s),this.name=e,this.details=t}}const i={googleAnalytics:"googleAnalytics",precache:"precache-v2",prefix:"workbox",runtime:"runtime",suffix:"undefined"!==typeof registration?registration.scope:""},c=e=>[i.prefix,e,i.suffix].filter(e=>e&&e.length>0).join("-"),o=e=>{for(const t of Object.keys(i))e(t)},h={updateDetails:e=>{o(t=>{"string"===typeof e[t]&&(i[t]=e[t])})},getGoogleAnalyticsName:e=>e||c(i.googleAnalytics),getPrecacheName:e=>e||c(i.precache),getPrefix:()=>i.prefix,getRuntimeName:e=>e||c(i.runtime),getSuffix:()=>i.suffix};function l(e,t){const s=t();return e.waitUntil(s),s}s("c700");const u="__WB_REVISION__";function d(e){if(!e)throw new r("add-to-cache-list-unexpected-type",{entry:e});if("string"===typeof e){const t=new URL(e,location.href);return{cacheKey:t.href,url:t.href}}const{revision:t,url:s}=e;if(!s)throw new r("add-to-cache-list-unexpected-type",{entry:e});if(!t){const e=new URL(s,location.href);return{cacheKey:e.href,url:e.href}}const n=new URL(s,location.href),a=new URL(s,location.href);return n.searchParams.set(u,t),{cacheKey:n.href,url:a.href}}class f{constructor(){this.updatedURLs=[],this.notUpdatedURLs=[],this.handlerWillStart=async({request:e,state:t})=>{t&&(t.originalRequest=e)},this.cachedResponseWillBeUsed=async({event:e,state:t,cachedResponse:s})=>{if("install"===e.type){const e=t.originalRequest.url;s?this.notUpdatedURLs.push(e):this.updatedURLs.push(e)}return s}}}class p{constructor({precacheController:e}){this.cacheKeyWillBeUsed=async({request:e,params:t})=>{const s=t&&t.cacheKey||this._precacheController.getCacheKeyForURL(e.url);return s?new Request(s):e},this._precacheController=e}}let g;function w(){if(void 0===g){const t=new Response("");if("body"in t)try{new Response(t.body),g=!0}catch(e){g=!1}g=!1}return g}async function m(e,t){let s=null;if(e.url){const t=new URL(e.url);s=t.origin}if(s!==self.location.origin)throw new r("cross-origin-copy-response",{origin:s});const n=e.clone(),a={headers:new Headers(n.headers),status:n.status,statusText:n.statusText},i=t?t(a):a,c=w()?n.body:await n.blob();return new Response(c,i)}const y=e=>{const t=new URL(String(e),location.href);return t.href.replace(new RegExp("^"+location.origin),"")};function _(e,t){const s=new URL(e);for(const n of t)s.searchParams.delete(n);return s.href}async function b(e,t,s,n){const a=_(t.url,s);if(t.url===a)return e.match(t,n);const r={...n,ignoreSearch:!0},i=await e.keys(t,r);for(const c of i){const t=_(c.url,s);if(a===t)return e.match(c,n)}}class R{constructor(){this.promise=new Promise((e,t)=>{this.resolve=e,this.reject=t})}}const v=new Set;async function x(){for(const e of v)await e()}function C(e){return new Promise(t=>setTimeout(t,e))}s("6aa8");function U(e){return"string"===typeof e?new Request(e):e}class q{constructor(e,t){this._cacheKeys={},Object.assign(this,t),this.event=t.event,this._strategy=e,this._handlerDeferred=new R,this._extendLifetimePromises=[],this._plugins=[...e.plugins],this._pluginStateMap=new Map;for(const s of this._plugins)this._pluginStateMap.set(s,{});this.event.waitUntil(this._handlerDeferred.promise)}fetch(e){return this.waitUntil((async()=>{const{event:t}=this;let s=U(e);if("navigate"===s.mode&&t instanceof FetchEvent&&t.preloadResponse){const e=await t.preloadResponse;if(e)return e}const n=this.hasCallback("fetchDidFail")?s.clone():null;try{for(const e of this.iterateCallbacks("requestWillFetch"))s=await e({request:s.clone(),event:t})}catch(i){throw new r("plugin-error-request-will-fetch",{thrownError:i})}const a=s.clone();try{let e;e=await fetch(s,"navigate"===s.mode?void 0:this._strategy.fetchOptions);for(const s of this.iterateCallbacks("fetchDidSucceed"))e=await s({event:t,request:a,response:e});return e}catch(c){throw n&&await this.runCallbacks("fetchDidFail",{error:c,event:t,originalRequest:n.clone(),request:a.clone()}),c}})())}async fetchAndCachePut(e){const t=await this.fetch(e),s=t.clone();return this.waitUntil(this.cachePut(e,s)),t}cacheMatch(e){return this.waitUntil((async()=>{const t=U(e);let s;const{cacheName:n,matchOptions:a}=this._strategy,r=await this.getCacheKey(t,"read"),i={...a,cacheName:n};s=await caches.match(r,i);for(const e of this.iterateCallbacks("cachedResponseWillBeUsed"))s=await e({cacheName:n,matchOptions:a,cachedResponse:s,request:r,event:this.event})||void 0;return s})())}async cachePut(e,t){const s=U(e);await C(0);const n=await this.getCacheKey(s,"write");if(!t)throw new r("cache-put-with-no-response",{url:y(n.url)});const a=await this._ensureResponseSafeToCache(t);if(!a)return void 0;const{cacheName:i,matchOptions:c}=this._strategy,o=await self.caches.open(i),h=this.hasCallback("cacheDidUpdate"),l=h?await b(o,n.clone(),["__WB_REVISION__"],c):null;try{await o.put(n,h?a.clone():a)}catch(u){throw"QuotaExceededError"===u.name&&await x(),u}for(const r of this.iterateCallbacks("cacheDidUpdate"))await r({cacheName:i,oldResponse:l,newResponse:a.clone(),request:n,event:this.event})}async getCacheKey(e,t){if(!this._cacheKeys[t]){let s=e;for(const e of this.iterateCallbacks("cacheKeyWillBeUsed"))s=U(await e({mode:t,request:s,event:this.event,params:this.params}));this._cacheKeys[t]=s}return this._cacheKeys[t]}hasCallback(e){for(const t of this._strategy.plugins)if(e in t)return!0;return!1}async runCallbacks(e,t){for(const s of this.iterateCallbacks(e))await s(t)}*iterateCallbacks(e){for(const t of this._strategy.plugins)if("function"===typeof t[e]){const s=this._pluginStateMap.get(t),n=n=>{const a={...n,state:s};return t[e](a)};yield n}}waitUntil(e){return this._extendLifetimePromises.push(e),e}async doneWaiting(){let e;while(e=this._extendLifetimePromises.shift())await e}destroy(){this._handlerDeferred.resolve()}async _ensureResponseSafeToCache(e){let t=e,s=!1;for(const n of this.iterateCallbacks("cacheWillUpdate"))if(t=await n({request:this.request,response:t,event:this.event})||void 0,s=!0,!t)break;return s||t&&200!==t.status&&(t=void 0),t}}class N{constructor(e={}){this.cacheName=h.getRuntimeName(e.cacheName),this.plugins=e.plugins||[],this.fetchOptions=e.fetchOptions,this.matchOptions=e.matchOptions}handle(e){const[t]=this.handleAll(e);return t}handleAll(e){e instanceof FetchEvent&&(e={event:e,request:e.request});const t=e.event,s="string"===typeof e.request?new Request(e.request):e.request,n="params"in e?e.params:void 0,a=new q(this,{event:t,request:s,params:n}),r=this._getResponse(a,s,t),i=this._awaitComplete(r,a,s,t);return[r,i]}async _getResponse(e,t,s){await e.runCallbacks("handlerWillStart",{event:s,request:t});let n=void 0;try{if(n=await this._handle(t,e),!n||"error"===n.type)throw new r("no-response",{url:t.url})}catch(a){for(const r of e.iterateCallbacks("handlerDidError"))if(n=await r({error:a,event:s,request:t}),n)break;if(!n)throw a}for(const r of e.iterateCallbacks("handlerWillRespond"))n=await r({event:s,request:t,response:n});return n}async _awaitComplete(e,t,s,n){let a,r;try{a=await e}catch(r){}try{await t.runCallbacks("handlerDidRespond",{event:n,request:s,response:a}),await t.doneWaiting()}catch(i){r=i}if(await t.runCallbacks("handlerDidComplete",{event:n,request:s,response:a,error:r}),t.destroy(),r)throw r}}const T={async cacheWillUpdate({response:e}){return e.redirected?await m(e):e}};class k extends N{constructor(e={}){e.cacheName=h.getPrecacheName(e.cacheName),super(e),this._fallbackToNetwork=!1!==e.fallbackToNetwork,this.plugins.push(T)}async _handle(e,t){const s=await t.cacheMatch(e);return s||(t.event&&"install"===t.event.type?await this._handleInstall(e,t):await this._handleFetch(e,t))}async _handleFetch(e,t){let s;if(!this._fallbackToNetwork)throw new r("missing-precache-entry",{cacheName:this.cacheName,url:e.url});return s=await t.fetch(e),s}async _handleInstall(e,t){const s=await t.fetchAndCachePut(e);let n=Boolean(s);if(s&&s.status>=400&&!this._usesCustomCacheableResponseLogic()&&(n=!1),!n)throw new r("bad-precaching-response",{url:e.url,status:s.status});return s}_usesCustomCacheableResponseLogic(){return this.plugins.some(e=>e.cacheWillUpdate&&e!==T)}}class L{constructor({cacheName:e,plugins:t=[],fallbackToNetwork:s=!0}={}){this._urlsToCacheKeys=new Map,this._urlsToCacheModes=new Map,this._cacheKeysToIntegrities=new Map,this._strategy=new k({cacheName:h.getPrecacheName(e),plugins:[...t,new p({precacheController:this})],fallbackToNetwork:s}),this.install=this.install.bind(this),this.activate=this.activate.bind(this)}get strategy(){return this._strategy}precache(e){this.addToCacheList(e),this._installAndActiveListenersAdded||(self.addEventListener("install",this.install),self.addEventListener("activate",this.activate),this._installAndActiveListenersAdded=!0)}addToCacheList(e){const t=[];for(const s of e){"string"===typeof s?t.push(s):s&&void 0===s.revision&&t.push(s.url);const{cacheKey:e,url:n}=d(s),a="string"!==typeof s&&s.revision?"reload":"default";if(this._urlsToCacheKeys.has(n)&&this._urlsToCacheKeys.get(n)!==e)throw new r("add-to-cache-list-conflicting-entries",{firstEntry:this._urlsToCacheKeys.get(n),secondEntry:e});if("string"!==typeof s&&s.integrity){if(this._cacheKeysToIntegrities.has(e)&&this._cacheKeysToIntegrities.get(e)!==s.integrity)throw new r("add-to-cache-list-conflicting-integrities",{url:n});this._cacheKeysToIntegrities.set(e,s.integrity)}if(this._urlsToCacheKeys.set(n,e),this._urlsToCacheModes.set(n,a),t.length>0){const e=`Workbox is precaching URLs without revision info: ${t.join(", ")}\nThis is generally NOT safe. Learn more at https://bit.ly/wb-precache`;console.warn(e)}}}install(e){return l(e,async()=>{const t=new f;this.strategy.plugins.push(t);for(const[a,r]of this._urlsToCacheKeys){const t=this._cacheKeysToIntegrities.get(r),s=this._urlsToCacheModes.get(a),n=new Request(a,{integrity:t,cache:s,credentials:"same-origin"});await Promise.all(this.strategy.handleAll({params:{cacheKey:r},request:n,event:e}))}const{updatedURLs:s,notUpdatedURLs:n}=t;return{updatedURLs:s,notUpdatedURLs:n}})}activate(e){return l(e,async()=>{const e=await self.caches.open(this.strategy.cacheName),t=await e.keys(),s=new Set(this._urlsToCacheKeys.values()),n=[];for(const a of t)s.has(a.url)||(await e.delete(a),n.push(a.url));return{deletedURLs:n}})}getURLsToCacheKeys(){return this._urlsToCacheKeys}getCachedURLs(){return[...this._urlsToCacheKeys.keys()]}getCacheKeyForURL(e){const t=new URL(e,location.href);return this._urlsToCacheKeys.get(t.href)}async matchPrecache(e){const t=e instanceof Request?e.url:e,s=this.getCacheKeyForURL(t);if(s){const e=await self.caches.open(this.strategy.cacheName);return e.match(s)}}createHandlerBoundToURL(e){const t=this.getCacheKeyForURL(e);if(!t)throw new r("non-precached-url",{url:e});return s=>(s.request=new Request(e),s.params={cacheKey:t,...s.params},this.strategy.handle(s))}}let E;const K=()=>(E||(E=new L),E);s("e6d2");const A="GET",M=e=>e&&"object"===typeof e?e:{handle:e};class S{constructor(e,t,s=A){this.handler=M(t),this.match=e,this.method=s}}class O extends S{constructor(e,t,s){const n=({url:t})=>{const s=e.exec(t.href);if(s&&(t.origin===location.origin||0===s.index))return s.slice(1)};super(n,t,s)}}class P{constructor(){this._routes=new Map,this._defaultHandlerMap=new Map}get routes(){return this._routes}addFetchListener(){self.addEventListener("fetch",e=>{const{request:t}=e,s=this.handleRequest({request:t,event:e});s&&e.respondWith(s)})}addCacheListener(){self.addEventListener("message",e=>{if(e.data&&"CACHE_URLS"===e.data.type){const{payload:t}=e.data;0;const s=Promise.all(t.urlsToCache.map(t=>{"string"===typeof t&&(t=[t]);const s=new Request(...t);return this.handleRequest({request:s,event:e})}));e.waitUntil(s),e.ports&&e.ports[0]&&s.then(()=>e.ports[0].postMessage(!0))}})}handleRequest({request:e,event:t}){const s=new URL(e.url,location.href);if(!s.protocol.startsWith("http"))return void 0;const n=s.origin===location.origin,{params:a,route:r}=this.findMatchingRoute({event:t,request:e,sameOrigin:n,url:s});let i=r&&r.handler;const c=e.method;if(!i&&this._defaultHandlerMap.has(c)&&(i=this._defaultHandlerMap.get(c)),!i)return void 0;let o;try{o=i.handle({url:s,request:e,event:t,params:a})}catch(h){o=Promise.reject(h)}return o instanceof Promise&&this._catchHandler&&(o=o.catch(n=>this._catchHandler.handle({url:s,request:e,event:t}))),o}findMatchingRoute({url:e,sameOrigin:t,request:s,event:n}){const a=this._routes.get(s.method)||[];for(const r of a){let a;const i=r.match({url:e,sameOrigin:t,request:s,event:n});if(i)return a=i,(Array.isArray(i)&&0===i.length||i.constructor===Object&&0===Object.keys(i).length||"boolean"===typeof i)&&(a=void 0),{route:r,params:a}}return{}}setDefaultHandler(e,t=A){this._defaultHandlerMap.set(t,M(e))}setCatchHandler(e){this._catchHandler=M(e)}registerRoute(e){this._routes.has(e.method)||this._routes.set(e.method,[]),this._routes.get(e.method).push(e)}unregisterRoute(e){if(!this._routes.has(e.method))throw new r("unregister-route-but-not-found-with-method",{method:e.method});const t=this._routes.get(e.method).indexOf(e);if(!(t>-1))throw new r("unregister-route-route-not-registered");this._routes.get(e.method).splice(t,1)}}let D;const W=()=>(D||(D=new P,D.addFetchListener(),D.addCacheListener()),D);function I(e,t,s){let n;if("string"===typeof e){const a=new URL(e,location.href);0;const r=({url:e})=>e.href===a.href;n=new S(r,t,s)}else if(e instanceof RegExp)n=new O(e,t,s);else if("function"===typeof e)n=new S(e,t,s);else{if(!(e instanceof S))throw new r("unsupported-route-type",{moduleName:"workbox-routing",funcName:"registerRoute",paramName:"capture"});n=e}const a=W();return a.registerRoute(n),n}function j(e,t=[]){for(const s of[...e.searchParams.keys()])t.some(e=>e.test(s))&&e.searchParams.delete(s);return e}function*F(e,{ignoreURLParametersMatching:t=[/^utm_/,/^fbclid$/],directoryIndex:s="index.html",cleanURLs:n=!0,urlManipulation:a}={}){const r=new URL(e,location.href);r.hash="",yield r.href;const i=j(r,t);if(yield i.href,s&&i.pathname.endsWith("/")){const e=new URL(i.href);e.pathname+=s,yield e.href}if(n){const e=new URL(i.href);e.pathname+=".html",yield e.href}if(a){const e=a({url:r});for(const t of e)yield t.href}}class H extends S{constructor(e,t){const s=({request:s})=>{const n=e.getURLsToCacheKeys();for(const e of F(s.url,t)){const t=n.get(e);if(t)return{cacheKey:t}}};super(s,e.strategy)}}function B(e){const t=K(),s=new H(t,e);I(s)}function G(e){const t=K();t.precache(e)}function Q(e,t){G(e),B(t)}const V={cacheWillUpdate:async({response:e})=>200===e.status||0===e.status?e:null};class $ extends N{constructor(e){super(e),this.plugins.some(e=>"cacheWillUpdate"in e)||this.plugins.unshift(V)}async _handle(e,t){const s=t.fetchAndCachePut(e).catch(()=>{});let n,a=await t.cacheMatch(e);if(a)0;else{0;try{a=await s}catch(i){n=i}}if(!a)throw new r("no-response",{url:e.url,error:n});return a}}class J extends N{async _handle(e,t){let s,n=await t.cacheMatch(e);if(n)0;else{0;try{n=await t.fetchAndCachePut(e)}catch(a){s=a}0}if(!n)throw new r("no-response",{url:e.url,error:s});return n}}s("8cb0");class z{constructor(e={}){this._statuses=e.statuses,this._headers=e.headers}isResponseCacheable(e){let t=!0;return this._statuses&&(t=this._statuses.includes(e.status)),this._headers&&t&&(t=Object.keys(this._headers).some(t=>e.headers.get(t)===this._headers[t])),t}}class X{constructor(e){this.cacheWillUpdate=async({response:e})=>this._cacheableResponse.isResponseCacheable(e)?e:null,this._cacheableResponse=new z(e)}}function Y(e){e.then(()=>{})}function Z(e){v.add(e)}class ee{constructor(e,t,{onupgradeneeded:s,onversionchange:n}={}){this._db=null,this._name=e,this._version=t,this._onupgradeneeded=s,this._onversionchange=n||(()=>this.close())}get db(){return this._db}async open(){if(!this._db)return this._db=await new Promise((e,t)=>{let s=!1;setTimeout(()=>{s=!0,t(new Error("The open request was blocked and timed out"))},this.OPEN_TIMEOUT);const n=indexedDB.open(this._name,this._version);n.onerror=()=>t(n.error),n.onupgradeneeded=e=>{s?(n.transaction.abort(),n.result.close()):"function"===typeof this._onupgradeneeded&&this._onupgradeneeded(e)},n.onsuccess=()=>{const t=n.result;s?t.close():(t.onversionchange=this._onversionchange.bind(this),e(t))}}),this}async getKey(e,t){return(await this.getAllKeys(e,t,1))[0]}async getAll(e,t,s){return await this.getAllMatching(e,{query:t,count:s})}async getAllKeys(e,t,s){const n=await this.getAllMatching(e,{query:t,count:s,includeKeys:!0});return n.map(e=>e.key)}async getAllMatching(e,{index:t,query:s=null,direction:n="next",count:a,includeKeys:r=!1}={}){return await this.transaction([e],"readonly",(i,c)=>{const o=i.objectStore(e),h=t?o.index(t):o,l=[],u=h.openCursor(s,n);u.onsuccess=()=>{const e=u.result;e?(l.push(r?e:e.value),a&&l.length>=a?c(l):e.continue()):c(l)}})}async transaction(e,t,s){return await this.open(),await new Promise((n,a)=>{const r=this._db.transaction(e,t);r.onabort=()=>a(r.error),r.oncomplete=()=>n(),s(r,e=>n(e))})}async _call(e,t,s,...n){const a=(s,a)=>{const r=s.objectStore(t),i=r[e].apply(r,n);i.onsuccess=()=>a(i.result)};return await this.transaction([t],s,a)}close(){this._db&&(this._db.close(),this._db=null)}}ee.prototype.OPEN_TIMEOUT=2e3;const te={readonly:["get","count","getKey","getAll","getAllKeys"],readwrite:["add","put","clear","delete"]};for(const[ue,de]of Object.entries(te))for(const e of de)e in IDBObjectStore.prototype&&(ee.prototype[e]=async function(t,...s){return await this._call(e,t,ue,...s)});const se=async e=>{await new Promise((t,s)=>{const n=indexedDB.deleteDatabase(e);n.onerror=()=>{s(n.error)},n.onblocked=()=>{s(new Error("Delete blocked"))},n.onsuccess=()=>{t()}})};s("d8a5");const ne="workbox-expiration",ae="cache-entries",re=e=>{const t=new URL(e,location.href);return t.hash="",t.href};class ie{constructor(e){this._cacheName=e,this._db=new ee(ne,1,{onupgradeneeded:e=>this._handleUpgrade(e)})}_handleUpgrade(e){const t=e.target.result,s=t.createObjectStore(ae,{keyPath:"id"});s.createIndex("cacheName","cacheName",{unique:!1}),s.createIndex("timestamp","timestamp",{unique:!1}),se(this._cacheName)}async setTimestamp(e,t){e=re(e);const s={url:e,timestamp:t,cacheName:this._cacheName,id:this._getId(e)};await this._db.put(ae,s)}async getTimestamp(e){const t=await this._db.get(ae,this._getId(e));return t.timestamp}async expireEntries(e,t){const s=await this._db.transaction(ae,"readwrite",(s,n)=>{const a=s.objectStore(ae),r=a.index("timestamp").openCursor(null,"prev"),i=[];let c=0;r.onsuccess=()=>{const s=r.result;if(s){const n=s.value;n.cacheName===this._cacheName&&(e&&n.timestamp<e||t&&c>=t?i.push(s.value):c++),s.continue()}else n(i)}}),n=[];for(const a of s)await this._db.delete(ae,a.id),n.push(a.url);return n}_getId(e){return this._cacheName+"|"+re(e)}}class ce{constructor(e,t={}){this._isRunning=!1,this._rerunRequested=!1,this._maxEntries=t.maxEntries,this._maxAgeSeconds=t.maxAgeSeconds,this._matchOptions=t.matchOptions,this._cacheName=e,this._timestampModel=new ie(e)}async expireEntries(){if(this._isRunning)return void(this._rerunRequested=!0);this._isRunning=!0;const e=this._maxAgeSeconds?Date.now()-1e3*this._maxAgeSeconds:0,t=await this._timestampModel.expireEntries(e,this._maxEntries),s=await self.caches.open(this._cacheName);for(const n of t)await s.delete(n,this._matchOptions);this._isRunning=!1,this._rerunRequested&&(this._rerunRequested=!1,Y(this.expireEntries()))}async updateTimestamp(e){await this._timestampModel.setTimestamp(e,Date.now())}async isURLExpired(e){if(this._maxAgeSeconds){const t=await this._timestampModel.getTimestamp(e),s=Date.now()-1e3*this._maxAgeSeconds;return t<s}return!1}async delete(){this._rerunRequested=!1,await this._timestampModel.expireEntries(1/0)}}class oe{constructor(e={}){this.cachedResponseWillBeUsed=async({event:e,request:t,cacheName:s,cachedResponse:n})=>{if(!n)return null;const a=this._isResponseDateFresh(n),r=this._getCacheExpiration(s);Y(r.expireEntries());const i=r.updateTimestamp(t.url);if(e)try{e.waitUntil(i)}catch(c){0}return a?n:null},this.cacheDidUpdate=async({cacheName:e,request:t})=>{const s=this._getCacheExpiration(e);await s.updateTimestamp(t.url),await s.expireEntries()},this._config=e,this._maxAgeSeconds=e.maxAgeSeconds,this._cacheExpirations=new Map,e.purgeOnQuotaError&&Z(()=>this.deleteCacheAndMetadata())}_getCacheExpiration(e){if(e===h.getRuntimeName())throw new r("expire-custom-caches-only");let t=this._cacheExpirations.get(e);return t||(t=new ce(e,this._config),this._cacheExpirations.set(e,t)),t}_isResponseDateFresh(e){if(!this._maxAgeSeconds)return!0;const t=this._getDateHeaderTimestamp(e);if(null===t)return!0;const s=Date.now();return t>=s-1e3*this._maxAgeSeconds}_getDateHeaderTimestamp(e){if(!e.headers.has("date"))return null;const t=e.headers.get("date"),s=new Date(t),n=s.getTime();return isNaN(n)?null:n}async deleteCacheAndMetadata(){for(const[e,t]of this._cacheExpirations)await self.caches.delete(e),await t.delete();this._cacheExpirations=new Map}}s("87f7");function he(e={}){const t=(e.cachePrefix||"google-fonts")+"-stylesheets",s=(e.cachePrefix||"google-fonts")+"-webfonts",n=e.maxAgeSeconds||31536e3,a=e.maxEntries||30;I(({url:e})=>"https://fonts.googleapis.com"===e.origin,new $({cacheName:t})),I(({url:e})=>"https://fonts.gstatic.com"===e.origin,new J({cacheName:s,plugins:[new X({statuses:[0,200]}),new oe({maxAgeSeconds:n,maxEntries:a})]}))}function le(e={}){const t=({request:e})=>"style"===e.destination||"script"===e.destination||"worker"===e.destination,s=e.cacheName||"static-resources",n=e.matchCallback||t;I(n,new $({cacheName:s,plugins:[new X({statuses:[0,200]})]}))}addEventListener("message",(function(e){e.data&&"SKIP_WAITING"===e.data.type&&self.skipWaiting()})),Q([{'revision':null,'url':'/baby-log/css/app.2a2400f3.css'},{'revision':null,'url':'/baby-log/css/chunk-vendors.f33e2235.css'},{'revision':'8fc25aece79f86a0c45282bfd81b9c7a','url':'/baby-log/growth_tables/boy_height.json'},{'revision':'b49d29d8c1e53d7882a26ac48061a00e','url':'/baby-log/growth_tables/boy_weight.json'},{'revision':'a8c0f121b1908aa85b2f451213aec44a','url':'/baby-log/growth_tables/girl_height.json'},{'revision':'5b4faed46598a2ad716dcd81e902cd4c','url':'/baby-log/growth_tables/girl_weight.json'},{'revision':'d3ddfec78b7d38b2f6b47a86e71bf28f','url':'/baby-log/img/icons/apple-icon-180.png'},{'revision':'6a30b91e233d7bcab3e9fccf76b7df93','url':'/baby-log/img/icons/favicon-196.png'},{'revision':'1d8221128286e43c2107f31eff1d196d','url':'/baby-log/img/icons/favicon.svg'},{'revision':'1d8221128286e43c2107f31eff1d196d','url':'/baby-log/img/icons/logo.svg'},{'revision':'b99e8d8329c7fe8d65dc563edf46e051','url':'/baby-log/img/icons/manifest-icon-192.png'},{'revision':'0de276ffc84f5e9eca37c18935a86e95','url':'/baby-log/img/icons/manifest-icon-512.png'},{'revision':'df38e060b2b424d800ee3da127e896fc','url':'/baby-log/img/icons/mstile-icon-128.png'},{'revision':'aa58ecd4cb5a5dbb27d8abc5cc24d87b','url':'/baby-log/img/icons/mstile-icon-270.png'},{'revision':'c706355cbf8711497675b22d9fba8ed7','url':'/baby-log/img/icons/mstile-icon-558-270.png'},{'revision':'6f071932d7f74bc5d4de1b8bd741c51a','url':'/baby-log/img/icons/mstile-icon-558.png'},{'revision':'1d8221128286e43c2107f31eff1d196d','url':'/baby-log/img/logo.1d822112.svg'},{'revision':'3d1931d51bee681de5e36ca715e8b261','url':'/baby-log/index.html'},{'revision':null,'url':'/baby-log/js/app.cdd32253.js'},{'revision':null,'url':'/baby-log/js/chunk-vendors.53e9ec93.js'},{'revision':'70aa7e3fe0855d9347af67d6b792d71e','url':'/baby-log/manifest.json'},{'revision':'b6216d61c03e6ce0c9aea6ca7808f7ca','url':'/baby-log/robots.txt'}]),he(),le()},"6aa8":function(e,t,s){"use strict";try{self["workbox:strategies:6.0.2"]&&_()}catch(n){}},"87f7":function(e,t,s){"use strict";try{self["workbox:recipes:6.0.2"]&&_()}catch(n){}},"8cb0":function(e,t,s){"use strict";try{self["workbox:cacheable-response:6.0.2"]&&_()}catch(n){}},c700:function(e,t,s){"use strict";try{self["workbox:precaching:6.0.2"]&&_()}catch(n){}},d8a5:function(e,t,s){"use strict";try{self["workbox:expiration:6.0.2"]&&_()}catch(n){}},e6d2:function(e,t,s){"use strict";try{self["workbox:routing:6.0.2"]&&_()}catch(n){}}});
//# sourceMappingURL=service-worker.js.map