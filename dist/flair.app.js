/**
 * @preserve
 * Flair.js Fabric
 * Foundation for True Object Oriented JavaScript Apps
 * 
 * Assembly: flair.app
 *     File: ./flair.app.js
 *  Version: 0.60.36
 *  Sat, 28 Sep 2019 15:50:56 GMT
 * 
 * (c) 2017-2019 Vikas Burman
 * MIT
 */
(function(root, factory) {
    'use strict';

    if (typeof define === 'function' && define.amd) { // AMD support
        define(() => { return factory; });
    } else if (typeof exports === 'object') { // CommonJS and Node.js module support
        if (typeof module !== 'undefined' && module.exports) {
            exports = module.exports = factory; // Node.js specific module.exports
        }
        module.exports = exports = factory; // CommonJS        
    } else { // expose as global on root
        root['flair.app'] = factory;
    }
})(this, async function(flair, __asmFile) {
    'use strict';

    // assembly closure: init (start)
    /* eslint-disable no-unused-vars */
    
    // flair types, variables and functions
    const { Class, Struct, Enum, Interface, Mixin, Aspects, AppDomain, $$, InjectedArg, bring, Container, include, Port, on, post, telemetry,
            Reflector, Serializer, Tasks, as, is, isDefined, isComplies, isDerivedFrom, isAbstract, isSealed, isStatic, isSingleton, isDeprecated,
            isImplements, isInstanceOf, isMixed, getAssembly, getAttr, getContext, getResource, getRoute, getType, ns, getTypeOf,
            getTypeName, typeOf, dispose, using, Args, Exception, noop, nip, nim, nie, event } = flair;
    const { TaskInfo } = flair.Tasks;
    const { env } = flair.options;
    const { guid, stuff, replaceAll, splitAndTrim, findIndexByProp, findItemByProp, which, isArrowFunc, isASyncFunc, sieve,
            deepMerge, getLoadedScript, b64EncodeUnicode, b64DecodeUnicode, lens, globalSetting } = flair.utils;
    
    // access to DOC
    const DOC = ((env.isServer || env.isWorker) ? null : window.document);
    
    // current for this assembly
    const __currentContextName = AppDomain.context.current().name;
    const __currentFile = __asmFile;
    const __currentPath = __currentFile.substr(0, __currentFile.lastIndexOf('/') + 1);
    AppDomain.loadPathOf('flair.app', __currentPath);
    
    // settings of this assembly
    let settings = JSON.parse('{"host":"flair.app.ServerHost | flair.app.ClientHost","app":"flair.app.App","boot":{"env":{"isVue":true,"isServerless":false,"isFirebase":false},"links":[],"scripts":[],"meta":[],"preambles":[],"assemblies":[],"ports":[],"attributes":[],"aspects":[],"bootwares":[],"di":{"container":{}},"cache":{"TTL":0,"slidingTTL":true}},"api":{"connections":{}}}');
    let settingsReader = Port('settingsReader');
    if (typeof settingsReader === 'function') {
        let externalSettings = settingsReader('flair.app');
        if (externalSettings) { settings = deepMerge([settings, externalSettings], false); }
    }
    settings = Object.freeze(settings);
    
    // config of this assembly
    let config = JSON.parse('{}');
    config = Object.freeze(config);
    
    /* eslint-enable no-unused-vars */
    // assembly closure: init (end)
    
    // assembly closure: global functions (start)
    // assembly globals
    const onLoadComplete = (asm) => { // eslint-disable-line no-unused-vars
        // ports definition - start
    
        //  sessionStorage {
        //      key: (key)
        //      getItem: (key)
        //      setItem: (key, value)
        //      removeItem: (key)
        //      clear: ()
        //  }
        //  key: unique key of the session-item
        //  value: data to put in session
        Port.define('sessionStorage', ['key', 'getItem', 'setItem', 'removeItem', 'clear']);    
    
        //  stateStorage {
        //      key: (key)
        //      getItem: (key)
        //      setItem: (key, value)
        //      removeItem: (key)
        //      clear: ()
        //  }
        //  key: unique key of the state-item
        //  value: data to put in state
        Port.define('stateStorage', ['key', 'getItem', 'setItem', 'removeItem', 'clear']);    
    
        //  cacheStorage {
        //      key: (key)
        //      getItem: (key)
        //      setItem: (key, value)
        //      removeItem: (key)
        //      clear: ()
        //  }
        //  key: unique key of the state-item
        //  value: data to put in state
        Port.define('cacheStorage', ['key', 'getItem', 'setItem', 'removeItem', 'clear']);     
    
        //  fetchHandler {
        //      fetch: async (url, dataType, opts)
        //  }
        //  url: url to send fetch request
        //  dataType: response data type: 'text', 'json', 'buffer', 'form', 'blob' <-- based on this, it pre-process response data before return
        //  opts: fetch call configuration options 
        //      client (fetch): https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch#Syntax
        //      server (node-fetch): https://www.npmjs.com/package/node-fetch#options
        Port.define('fetchHandler', ['fetch']);
    
        // ports definition - end
    }; 
    // assembly closure: global functions (end)
    
    // set assembly being loaded
    AppDomain.context.current().currentAssemblyBeingLoaded('./flair.app{.min}.js');
    
    // assembly closure: types (start)
        
    await (async () => { // type: ./src/flair.app/flair.app/@1-Bootware.js
        /**
         * @name Bootware
         * @description Bootware base class
         */
        $$('abstract');
        $$('ns', 'flair.app');
		Class('Bootware', function() {
            $$('virtual');
            this.construct = (isMountSpecific) => {
                this.isMountSpecific = isMountSpecific || false;
            };
        
            /**  
             * @name boot
             * @arguments
             *  mount: object - mount object
            */
            $$('virtual');
            $$('async');
            this.boot = noop;
        
            $$('readonly');
            this.isMountSpecific = false;
        
            /**  
             * @name ready
            */
            $$('virtual');
            $$('async');
            this.ready = noop;
        
            $$('virtual');
            this.dispose = noop;
        
            $$('protected');
            this.getMountSpecificSettings = (sectionName, routing, mountName, checkDuplicateOnProp) => {
                let section = [];
        
                // get all.before
                if (routing.all && routing.all.before && routing.all.before[sectionName]) {
                    section.push(...routing.all.before[sectionName]);
                }
        
                // get from mount
                if (routing[mountName] && routing[mountName][sectionName]) {
                    if (section.length === 0) { 
                        section.push(...routing[mountName][sectionName]);
                    } else {
                        if (checkDuplicateOnProp) {
                            for(let specificItem of routing[mountName][sectionName]) {
                                let alreadyAddedItem = findItemByProp(section, checkDuplicateOnProp, specificItem[checkDuplicateOnProp]);
                                if (alreadyAddedItem !== null) { // found with same propertyValue for givenProp
                                    for(let p in specificItem) { // iterate all defined properties only, rest can be same as found earlier
                                        alreadyAddedItem[p] = specificItem[p]; // overwrite all values with what is found here, as this more specific
                                    }
                                } else {
                                    section.push(specificItem); // add
                                }
                            }
                        } else {
                            for(let specificItem of routing[mountName][sectionName]) {
                                if (typeof specificItem === 'string') {
                                    if (section.indexOf(specificItem) !== -1) { // found
                                        // ignore, as it is already added
                                    } else { 
                                        section.push(specificItem); // add
                                    }                  
                                } else { // object
                                    section.push(specificItem); // add, as no way to check for duplicate
                                }
                            }
                        }
                    }
                }
        
                // get from all.after
                if (routing.all && routing.all.after && routing.all.after[sectionName]) {
                    if (section.length === 0) {
                        section.push(...routing.all.after[sectionName]);
                    } else {
                        if (checkDuplicateOnProp) {
                            for(let afterItem of routing.all.after[sectionName]) {
                                let alreadyAddedItem = findItemByProp(section, checkDuplicateOnProp, afterItem[checkDuplicateOnProp]);
                                if (alreadyAddedItem !== null) { // found with same propertyValue for givenProp
                                    // skip as more specific version is already added
                                } else {
                                    section.push(afterItem); // add
                                }
                            }
                        } else {
                            for(let afterItem of routing.all.after[sectionName]) {
                                if (typeof afterItem === 'string') {
                                    if (section.indexOf(afterItem) !== -1) { // found
                                        // ignore, as it is already added
                                    } else { 
                                        section.push(afterItem); // add
                                    }                  
                                } else { // object
                                    section.push(afterItem); // add, as no way to check for duplicate
                                }
                            }
                        } 
                    }
                }
                
                // return
                return section;
            };
        });
        
    })();    
    await (async () => { // type: ./src/flair.app/flair.app/@1-HandlerContext.js
        /**
         * @name HandlerContext
         * @description HandlerContext data
         */
        $$('ns', 'flair.app');
		Class('HandlerContext', function() {
            $$('virtual');
            this.construct = () => { };
        
            $$('private');
            this.items = {};
        
            this.getData = (key, defaultValue) => { return this.items[key] || defaultValue; };
            this.setData = (key, value) => { this.items[key] = value; };
        });
        
    })();    
    await (async () => { // type: ./src/flair.app/flair.app/@1-Payload.js
        /**
         * @name Payload
         * @description Extended payload
         */
        $$('ns', 'flair.app');
		Class('Payload', function() {
            $$('virtual');
            this.construct = (data, status, mimeType, resHeaders) => {
                this.data = data || null;
                this.status = status || null;
                if (Array.isArray(resHeaders)) { this.resHeaders.push(...resHeaders); }
                
                if (mimeType) { this.resHeaders.push({ name: 'Content-Type', value: mimeType || 'text/plain' }); }
            };
        
            $$('readonly');
            this.data = null;
        
            $$('readonly');
            this.status = null;
        
            $$('readonly');
            this.resHeaders = [];
        });
        
    })();    
    await (async () => { // type: ./src/flair.app/flair.app/@1-Handler.js
        const { IDisposable } = await ns();
        
        /**
         * @name Handler
         * @description Handler base class
         */
        $$('ns', 'flair.app');
		Class('Handler', [IDisposable], function() {
            $$('virtual');
            this.construct = (route) => {
                // convert this route (coming from routes.json) to registered route (Route)
                this.route = AppDomain.context.current().getRoute(route.name); // now this object has all route properties like getAssembly() etc.
            };
        
            $$('protected')
            this.route = null;
        
            $$('virtual');
            $$('async');
            this.run = noop;
        
            $$('virtual');
            this.dispose = noop;
        });
        
    })();    
    await (async () => { // type: ./src/flair.app/flair.app/@2-App.js
        const { IDisposable } = await ns();
        const { Bootware } = await ns('flair.app');
        
        /**
         * @name App
         * @description App base class
         */
        $$('ns', 'flair.app');
		Class('App', Bootware, [IDisposable], function() {
            $$('override');
            this.construct = (base) => {
                // set info
                let asm = getAssembly(this.$Type);
                base(asm.title, asm.version);
            };
            
            $$('override');
            $$('sealed');
            this.boot = async (base) => {
                base();
                AppDomain.host().error.add(this.handleError); // host's errors are handled here
            };
        
            this.start = async () => {
                // initialize view state
                if (!env.isServer && !env.isWorker) {
                    const { ViewState } = await ns('flair.ui');
                    new ViewState(); // this initializes the global view state store's persistance via this singleton object
                }
        
                // do more
                await this.onStart();
            };
        
            $$('virtual');
            $$('async');
            this.onStart = noop;
        
            $$('override');
            $$('sealed');
            this.ready = async () => {
                // do more
                await this.onReady();
            };
        
            $$('virtual');
            $$('async');
            this.onReady = noop;
        
            this.stop = async () => {
                // clear view state
                if (!env.isServer && !env.isWorker) {
                    const { ViewState } = await ns('flair.ui');
                    new ViewState().clear();
                }
        
                // do more
                await this.onStop();
            };
        
            $$('virtual');
            $$('async');
            this.onStop = noop;
        
            $$('private');
            this.handleError = (e) => {
                // do more
                this.onError(e.args.error);
            };
        
            $$('virtual');
            this.onError = (err) => {
                throw Exception.OperationFailed(err, this.onError);
            };
        
            $$('virtual');
            this.getRoutingContext = noop;
        
            $$('override');
            this.dispose = (base) => {
                base();
                AppDomain.host().error.remove(this.handleError); // remove error handler
            };
        });
        
    })();    
    await (async () => { // type: ./src/flair.app/flair.app/@2-HandlerResult.js
        const { Payload } = await ns('flair.app');
        
        /**
         * @name HandlerResult
         * @description Handler's structured result
         */
        $$('ns', 'flair.app');
		Class('HandlerResult', function() {
            $$('virtual');
            this.construct = (error, payload, resHeaders) => {
                let status = 200,
                    message = 'OK',
                    esx = 'Exception';
        
                // check if extended Payload
                if (payload && is(payload, Payload)) {
                    status = payload.status || status;
                    this.isExtendedPayload = true;
                }
        
                // get status and status message
                if (error && error.name) {
                    message = error.name || (env.isServer ? 'InternalServerError' : 'InternalClientError');
                    switch(error.name) {
                        case 'Continue' + esx: 
                            status = 100; break;
                        case 'NoContent' + esx: 
                            status = 204; break;
                        case 'Redirect' + esx: 
                            status = 302; break;
                        case 'NotModified' + esx:
                            status = 304; break;
                        case 'InvalidArgument' + esx:
                        case 'InvalidOperation' + esx:
                            status = 406; break; // not acceptable
                        case 'Unauthorized' + esx: 
                            status = 401; break;
                        case 'NotFound' + esx: 
                            status = 404; break;
                        case 'NotAllowed' + esx: 
                        case 'NotAvailable' + esx: 
                        case 'NotSupported' + esx: 
                            status = 405; break;
                        case 'OperationConflict' + esx: 
                        case 'Duplicate' + esx: 
                            status = 409; break;
                        case 'NotImplemented' + esx: 
                        case 'NotDefined' + esx: 
                            status = 501; break;
                        default:
                            status = 500; break;
                    }
                }
                this.status = status;
                this.message = message;
        
                this.isError = error ? true : false;
                if (error && env.isDebug) {
                    this.message += `\n${error.message || ''}`; 
                    this.message += `\n${error.stack || ''}`;
                }
                this.data = payload || null;
                if (Array.isArray(resHeaders)) { this.resHeaders.push(...resHeaders); }
            };
        
            $$('private');
            this.isExtendedPayload = false;
        
            $$('readonly');
            this.status = 500;
        
            $$('readonly');
            this.message = '';
        
            $$('readonly');
            this.isError = false;
        
            $$('readonly');
            this.data = null;
        
            $$('readonly');
            this.resHeaders = [];
        
            this.value = (isMinimal) => {
                if (isMinimal && !this.isError) {
                    return Object.freeze({
                        data: (this.isExtendedPayload ? this.data.data : this.data)
                    });
                } else { // either not minimal or there is an error
                    return Object.freeze({
                        isError: this.isError,
                        status: this.status,
                        message: this.message,
                        data: (this.isExtendedPayload ? this.data.data : this.data)
                    });
                }
            };
        });
        
    })();    
    await (async () => { // type: ./src/flair.app/flair.app/@2-Host.js
        const { IDisposable } = await ns();
        const { Bootware } = await ns('flair.app');
        
        /**
         * @name App
         * @description App base class
         */
        $$('ns', 'flair.app');
		Class('Host', Bootware, [IDisposable], function() {
            $$('virtual');
            $$('async');
            this.start = noop;
        
            $$('virtual');
            $$('async');
            this.stop = noop;
        
            this.error = event((err) => {
                return { error: err };
            });
            
            this.raiseError = (err) => {
                this.error(err);
            };
        });
        
    })();    
    await (async () => { // type: ./src/flair.app/flair.app/@3-Middleware.js
        /**
         * @name Middleware
         * @description Server/Client middleware, where code executes on route where it is attached
         */
        $$('ns', 'flair.app');
		Class('Middleware', function() {
            $$('virtual');
            $$('async');
            this.run = noop;
        });
        
    })();    
    await (async () => { // type: ./src/flair.app/flair.app.caching/state/@5-StateStorage.js
        
        const { IPortHandler } = await ns();
        
        /**
         * @name StatePort
         * @description Default server/client persisted state caching definition
         */
        $$('ns', 'flair.app.caching');
		Class('StateStorage', [IPortHandler], function() {
            this.construct = () => {
                // this inbuilt state-cache works over node-localstorage (on server) and window.localStorage (on client)
                // any external state-cache can be applied by providing a custom state-cache handler
                this.handler = (env.isServer ? require('node-localstorage') : window.localStorage);
            };
        
            $$('private');
            this.handler = null;
        
            $$('private');
            this.itemNamePrefix = '__state_';
        
            $$('readonly');
            this.name = 'stateStorage';
        
            this.key = async (key) => { return this.handler.key(this.itemNamePrefix + key); }
            this.getItem = async (key) => { return this.handler.getItem(this.itemNamePrefix + key); }
            this.setItem = async (key, value) => { return this.handler.setItem(this.itemNamePrefix + key, value); }
            this.removeItem = async (key) => { return this.handler.removeItem(this.itemNamePrefix + key); }
            this.clear = async () => { 
                if (env.isServer) {
                    this.handler.clear(); 
                } else {
                    let stateKeys = Object.keys(window.localStorage);
                    for(let key of stateKeys) {
                        if (key.startsWith(this.itemNamePrefix)) {
                            this.handler.removeItem(key);
                        }
                    }
                }
            }
        });
        
    })();    
    await (async () => { // type: ./src/flair.app/flair.app.ajax/fetch/@5-FetchHandler.js
        const { IPortHandler } = await ns();
        
        /**
         * @name FetchPort
         * @description Default server/client fetch implementation
         */
        $$('ns', 'flair.app.ajax');
		Class('FetchHandler', [IPortHandler], function() {
            this.construct = () => {
                if (env.isServer) {
                    this.handler = require('node-fetch'); // node specific fetch clone
                } else {
                    this.handler = fetch; // inbuilt javascript function
                }
            };
        
            $$('private');
            this.handler = null;
        
            $$('readonly');
            this.name = 'fetchHandler';
        
            this.fetch = async (url, dataType, opts) => {
                if (typeof url !== 'string') { throw Exception.InvalidArgument('url'); }
                if (typeof dataType !== 'string' || ['text', 'json', 'buffer', 'form', 'blob'].indexOf(dataType) === -1) { throw Exception.InvalidArgument('dataType'); }
                if (!opts) { throw Exception.InvalidArgument('opts'); }
        
                let response = await this.handler(url, opts);
                if (!response.ok) { throw Exception.OperationFailed(url, response.status); }
        
                let resMethod = '';
                switch(dataType) {
                    case 'text': resMethod = 'text'; break;
                    case 'json': resMethod = 'json'; break;
                    case 'buffer': resMethod = 'arrayBuffer'; break;
                    case 'form': resMethod = 'formData'; break;
                    case 'blob': resMethod = 'blob'; break;
                }
                return await response[resMethod]();
            };
        });
        
    })();    
    await (async () => { // type: ./src/flair.app/flair.app.caching/session/@5-SessionStorage.js
        
        const { IPortHandler } = await ns();
        
        /**
         * @name SessionPort
         * @description Default server/client session caching definition
         */
        $$('ns', 'flair.app.caching');
		Class('SessionStorage', [IPortHandler], function() {
            this.construct = () => {
                // this inbuilt session-cache works over global.sessionStorage (on server) and window.sessionStorage (on client)
                // any external session-cache can be applied by providing a custom session-cache handler
                // in both server/client cases values are available in current node process (server) OR current browser page (client)
                this.handler = (env.isServer ? global.sessionStorage : window.sessionStorage);
            };
        
            $$('private');
            this.handler = null;
        
            $$('private');
            this.itemNamePrefix = '__session_';    
        
            $$('readonly');
            this.name = 'sessionStorage';
        
            this.key = async (key) => { return this.handler.key(this.itemNamePrefix + key); }
            this.getItem = async (key) => { return this.handler.getItem(this.itemNamePrefix + key); }
            this.setItem = async (key, value) => { return this.handler.setItem(this.itemNamePrefix + key, value); }
            this.removeItem = async (key) => { return this.handler.removeItem(this.itemNamePrefix + key); }
            this.clear = async () => { 
                let sessionKeys = Object.keys(this.handler);
                for(let key of sessionKeys) {
                    if (key.startsWith(this.itemNamePrefix)) {
                        this.handler.removeItem(key);
                    }
                }
            };
        });
        
    })();    
    await (async () => { // type: ./src/flair.app/flair.app.caching/cache/@5-CacheStorage.js
        
        const { IPortHandler } = await ns();
        
        /**
         * @name CacheStorage
         * @description Default server/client caching definition
         */
        $$('ns', 'flair.app.caching');
		Class('CacheStorage', [IPortHandler], function() {
            this.construct = () => {
                const CacheStorage = function () {
                    // this inbuilt cache-storage works over node-cache (on server) and window.localStorage + custom (on client)
                    // any external cache-storage can be applied by providing a custom cache-storage handler
                    // in both server/client cases values are available across node process (if supported) (server) OR across browser tabs/windows (client)
        
                    let handler = null;
        
                    const CacheItem = function(value, ttl, sliding) {
                        let _created = Date.now();
            
                        this.value = () => { return value || null; };
                        this.ttl = () => { return ttl; };
                        this.created = () => { return _created; };
                        this.isSliding = () => { return sliding; };
                        this.isExpired = () => { return Date.now() > (_created + ttl); };
                        this.toJSONString = () => { return JSON.stringify({ v: value, t: ttl, s: sliding, c: _created }); };
                    };
                    CacheItem.fromJSONString = (json) => {
                        if (!json) { return null; }
                        let _json = JSON.parse(json);
                        return new CacheItem(_json.value(), _json.created(), _json.ttl(), _json.isSliding());
                    }; 
        
                    if (env.isServer) {
                        // define handler and options
                        const NodeCache = require('node-cache');
                        let options = {
                            stdTTL: settings.boot.cache.TTL, // seconds
                            errorOnMissing: false,
                            checkperiod: 0, // no automatic deletion
                            useClones: true,
                            deleteOnExpire: false
                        };
                        handler = new NodeCache(options);
        
                        // define calls
                        this.key = async (key) => {
                            return (await this.getItem(key) ? true : false);
                        };
                        this.getItem = async (key) => {
                            if (!key) { return null; }
                            let item = CacheItem.fromJSONString(handler.get(key));
                            if (!item) { return null; }
                            if (item.isExpired()) { await this.removeItem(key); return null; }
                            if (item.isSliding()) { await this.setItem(key, item.value(), item.ttl(), item.isSliding()); }
                            return item.value();
                        };
                        this.setItem = async (key, value, ttl = settings.boot.cache.TTL, sliding = settings.boot.cache.slidingTTL) => {
                            if (!key) { return false; }
                            let item = new CacheItem(value, ttl, sliding);
                            return handler.set(key, item.toJSONString());
                        };
                        this.removeItem = async (key) => {
                            if (!key) { return false; }
                            return (handler.del(key) > 0 ? true : false);
                        };
                        this.keys = async () => {
                            return handler.keys();
                        };
                    } else { // client
                        // define handler
                        handler = window.localStorage;
        
                        // define calls
                        this.key = async (key) => {
                            return (await this.getItem(key) ? true : false);
                        };
                        this.getItem = async (key) => {
                            if(!key) { return null; }
                            let item = CacheItem.fromJSONString(handler.getItem(key));
                            if (!item) { return null; }
                            if (item.isExpired()) { await this.removeItem(key); return null; }
                            if (item.isSliding()) { await this.setItem(key, item.value(), item.ttl(), item.isSliding()); }
                            return item.value();
                        };
                        this.setItem = async (key, value, ttl = settings.boot.cache.TTL, sliding = settings.boot.cache.slidingTTL) => {
                            if(!key) { return false; }
                            let item = new CacheItem(value, ttl, sliding);
                            return handler.setItem(key, item.toJSONString());
                        };
                        this.removeItem = async (key) => {
                            if (!key) { return false; }
                            if (!handler[key]) { return false; }
                            handler.removeItem(key);
                            return true;
                        };
                        this.keys = async () => {
                            return Object.keys(handler);
                        };                
                    }
                };
                this.handler = new CacheStorage();
            };
        
            $$('private');
            this.handler = null;
        
            $$('private');
            this.itemNamePrefix = '__cache_';      
        
            $$('readonly');
            this.name = 'cacheStorage';
        
            this.key = async (key) => { return await this.handler.key(this.itemNamePrefix + key); }
            this.getItem = async (key) => { return await this.handler.getItem(this.itemNamePrefix + key); }
            this.setItem = async (key, value) => { return await this.handler.setItem(this.itemNamePrefix + key, value); }
            this.removeItem = async (key) => { return await this.handler.removeItem(this.itemNamePrefix + key); }
            this.clear = async () => { 
                let cacheKeys = await this.handler.keys();
                for(let key of cacheKeys) {
                    if (key.startsWith(this.itemNamePrefix)) {
                        await this.handler.removeItem(key);
                    }
                }
            };
        });
        
    })();    
    await (async () => { // type: ./src/flair.app/flair.app.ajax/fetch/@6-FetchAttr.js
        const { IAttribute } = await ns();
        
        /**
         * @name FetchAttr
         * @description Fetch custom attribute
         * $$('fetch', 'connName', 'optsName', 'dataType', 'path');
         * connName: name of settings structure inside settings.api.connections.<connectionName>
         * optsName: name inside chosen connection inside settings.api.connections.<connectionName>.options.<optsName>
         * dataType: response data type: 'text', 'json', 'buffer', 'form', 'blob'
         * path: partial path of the resource where fetch call will go as per connection settings
         */
        $$('sealed');
        $$('ns', 'flair.app.ajax');
		Class('FetchAttr', [IAttribute], function() {
            this.construct = () => {
                this.port = Port('fetchHandler');
            };
        
            $$('private');
            this.port = null;
        
            $$('readonly');
            this.name = 'fetch';
        
            $$('readonly');
            this.constraints = '(class || struct) && (func && async) && !($inject || $on || @fetch)';
        
            this.decorateFunction = (typeName, memberName, member, connName, optsName, dataType, path) => {
                let _this = this,
                    connection = settings.api.connections[connName] || { options: {} },
                    opts = connection.options[optsName] || {},
                    url = connection.url || '';
        
                let replaceIt = (url, key, value) => {
                    if (url.indexOf(key) !== -1) {
                        // try to replace optional version first
                        let _key = `/:${key}?`;
                        if (url.indexOf(_key) !== -1) { 
                            if (value) {
                                url = replaceAll(url, _key, `/${encodeURIComponent(value.toString())}`); 
                            } else {
                                url = replaceAll(url, _key, ''); // replace with empty, so even '/' is removed - collapsing the whole section
                            }
                        }
        
                        // try to replace mandatory version next
                        _key = `/:${key}`;
                        if (url.indexOf(_key) !== -1) { 
                            if (value) {
                                url = replaceAll(url, _key, `/${encodeURIComponent(value.toString())}`); 
                            } else {
                                throw Exception.InvalidDefinition(key);
                            }
                        }
                    }
                    return url;
                };       
                let composeApiUrl = (apiArgs) => {
                    if (url) {
                        if (!url.endsWith('/')) { url += '/'; }
                        if (path) {
                            if (path.startsWith('/')) { path = path.substr(1); }
                            url += path;
                        }
                        if (apiArgs) { 
                            // fill values in URL from apiArgs values
                            // this goes like this
                            // any variable can be defined as /:varName 
                            // optional variable can be defined /:varName?
                            // it will find and replace any occurrence of /:varName with corresponding value from apiArgs
                            // if placeholder is set as /:varName and value is not found - it will throw error instead if it is /:varName? and value not found, this will remove that section from url
                            // NO OTHER FORM OF RESOLVE IS SUPPORTED - BECAUSE THIS IS NOT A URL MATCH SCENARIO - BUT STUFF DATA SCENARIO
                            //
                            // some special variables can also be defined
                            // :version <-- resolve to current version setting in environment
                            // :locale  <-- resolve to current locale setting in environment
                            //
                            // globally api specific environment values can be defined via
                            // env.props('api', 'key', 'value');
                            // any such values defined like these can be used in any path same as any other key like: /:key
                            // in this case, if same name variable is passed in apiArgs, that will gets precedence
        
                            // replace all values in apiArgs, leaving special keys: query, abortable and options
                            for(let key in apiArgs) {
                                if (apiArgs.hasOwnProperty(key) && ['query', 'abortable', 'options'].indexOf(key) === -1) {
                                    url = replaceIt(url, key, apiArgs[key]);
                                }
                            }
        
                            // process all remaining keys from 'api' namespace in env props
                            // :version and :locale are also api keys, so will get resolved from this cycle
                            let apiNS = env.props('api');
                            for(let key in apiNS) {
                                url = replaceIt(url, key, apiNS[key]);
                            }
                        }
        
                        if (apiArgs.query) { // add query string
                            let qs = '?',
                                value = null;
                            for(let p in apiArgs.query) {
                                if (apiArgs.query.hasOwnProperty(p)) {
                                    value = encodeURIComponent(apiArgs.query[p].toString());
                                    qs += `${p}=${value}&`;
                                }
                            }
                            if (qs !== '?') {
                                if (qs.endsWith('&')) { qs = qs.substr(0, qs.length - 1); }
                                url += qs; // add these as well
                            }               
                        }
        
                    }
                    return url;
                };
        
                // decorated function
                return async function(...args) {
                    let api = (apiArgs) => { // eslint-disable-line no-unused-vars
                        // returns a promise with an abort() if abortable is set 
                        // apiArgs can be:
                        // {
                        //      key: value, key: value, ...                 <-- used to replace placeholders on url/path
                        //      query: { key: value, key: value, ...}       <-- if present added as query-string to url at the end
                        //      abortable: true/false                       <-- make call abortable, in this case adds an abort() method in returned promise object
                        //      options: { key: value, key: value, ... }    <-- fetch-options picked for this call are overwritten with these (deep-merged)
                        // }
        
                        let apiAborter = (apiArgs.abortable ? new AbortController() : null),
                            apiReject = null;
                        let apiPromise = new Promise((resolve, reject) => {
                            apiReject = reject;
        
                            // compose api url
                            composeApiUrl(apiArgs);
                            if (!url) { reject(Exception.InvalidDefinition(`${typeName}::${memberName}::fetch`)); return; }
        
                            // merge options with provided options
                            let fetchOptions = deepMerge([opts, apiArgs.options || {}], true);
        
                            // set abort signal
                            if (apiAborter) { fetchOptions.signal = apiAborter.signal; }
        
                            // initiate fetch
                            _this.port.fetch(url, dataType, fetchOptions).then(resolve).catch(reject);
                        });
        
                        // add abort method to promise for initiating the abort and rejection of promise
                        if (apiAborter) {
                            apiPromise.abort = () => {
                                apiAborter.abort(); // abort the fetch call
                                apiReject(); // reject the promise
                            };
                        }
        
                        return apiPromise;
                    };
        
                    // inject configured api caller in args as first arg
                    let mergedArgs = [new InjectedArg(api)];
                    if (args) { mergedArgs.push(...args); }
        
                    // call member
                    return await member(...mergedArgs);
                };
            };
        });
        
    })();    
    await (async () => { // type: ./src/flair.app/flair.app.bw/DIContainer.js
        const { Bootware } = await ns('flair.app');
        
        /**
         * @name DIContainer
         * @description Initialize DI Container
         */
        $$('sealed');
        $$('ns', 'flair.app.bw');
		Class('DIContainer', Bootware, function() {
            $$('override');
            this.boot = async (base) => {
                base();
                
                let containerItems = settings.boot.di.container;
                for(let alias in containerItems) {
                    if (containerItems.hasOwnProperty(alias)) {
                        Container.register(alias, containerItems[alias]);
                    }
                }
            };
        });
        
    })();    
    await (async () => { // type: ./src/flair.app/flair.app.caching/cache/CacheAttr.js
        const { IAttribute } = await ns();
        
        /**
         * @name CacheAttr
         * @description Cache custom attribute
         * $$('cache')
         * $$('cache', ttl)
         * ttl: integer - time to live in seconds
         */
        $$('sealed');
        $$('ns', 'flair.app.caching');
		Class('CacheAttr', [IAttribute], function() {
            this.construct = () => {
                this.port = Port('cacheStorage');
            };
        
            $$('private');
            this.port = null;
        
            $$('readonly');
            this.name = 'cache';
        
            $$('readonly');
            this.constraints = '(class || struct) && (func && async) && !(timer || on || @cache)';
        
            this.decorateFunction = (typeName, memberName, member, ttl) => {
                let _this = this,
                    cacheId = `${typeName}___${memberName}`;
        
                let callMember = async (...args) => {
                    let resultData = await member(...args);
                    await _this.port.setItem(cacheId, resultData, ttl);
                    return resultData;
                };
        
                // decorated function
                return async function(...args) {
                    let fetchedData = await _this.port.getItem(cacheId);
                    return (fetchedData !== null) ? fetchedData : await callMember(...args);
                };
            };
        });
        
    })();    
    await (async () => { // type: ./src/flair.app/flair.app.caching/session/SessionAttr.js
        const { IAttribute } = await ns();
        
        /**
         * @name SessionAttr
         * @description Session custom attribute
         * $$('session')
         */
        $$('sealed');
        $$('ns', 'flair.app.caching');
		Class('SessionAttr', [IAttribute], function() {
            this.construct = () => {
                this.port = Port('sessionStorage');
            };
        
            $$('private');
            this.port = null;
        
            $$('readonly');
            this.name = 'session';
        
            $$('readonly');
            this.constraints = '(class && prop) && !($static || $state || $readonly || $abstract || $virtual)';
        
        
            // TODO: here onwards - think how session and etate will come out of builder
            // considering addDisposal -- is that needed - because on dispose it is removed 
            // and no point of session and state availability then
            this.decorateFunction = (typeName, memberName, member, ttl) => {
                let _this = this,
                    cacheId = `${typeName}___${memberName}`;
        
                let callMember = async (...args) => {
                    let resultData = await member(...args);
                    await _this.port.setItem(cacheId, resultData, ttl);
                    return resultData;
                };
        
                // decorated function
                return async function(...args) {
                    let fetchedData = await _this.port.getItem(cacheId);
                    return (fetchedData !== null) ? fetchedData : await callMember(...args);
                };
            };
        });
        
    })();    
    await (async () => { // type: ./src/flair.app/flair.app/BootEngine.js
        const { IPortHandler, IAttribute } = await ns();
        const { Bootware } = await ns('flair.app');
        
        /**
         * @name BootEngine
         * @description Bootstrapper functionality
         */
        $$('static');
        $$('ns', 'flair.app');
		Class('BootEngine', function() {
            this.start = async function() {
                let allBootwares = [],
                    mountSpecificBootwares = [];
                
                const loadConfiguredEnv = async () => {
                    env.x(settings.boot.env); // add it once as freezed
                };
                const addHeadElements = (list, elName) => {
                    let el = null,
                        value = null,
                        isDefined = false,
                        isEmpty = false,
                        head = window.document.getElementsByTagName('head')[0];
        
                    for(let item of list) {
                        el = document.createElement(elName);
                        isDefined = false;
                        isEmpty = false;
                        for(let key in item) { 
                            if (item.hasOwnProperty(key)) {
                                value = item[key];
                                if (['src', 'href'].indexOf(key) !== -1) { 
                                    value = which(value); 
                                    if (!value) { isEmpty = true; } // if src/href not defined, no point adding it
                                }
                                isDefined = true;
                                el.setAttribute(key, value); 
                            }
                        }
                        if (isDefined && !isEmpty) { head.appendChild(el); }
                    }
                };
                const loadScripts = async () => { // scripts loading is supported only on client ui environment
                    if (env.isClient && !env.isWorker) {
                        // combined scripts (inbuilt and configured)
                        // which() will pick as: (from src and href keys only)
                        // envProp::mainThreadOnServer{.min}.xyz ~ envProp::workerThreadOnServer{.min}.xyz | envProp::mainThreadOnClient{.min}.xyz ~ envProp::workerThreadOnClient{.min}.xyz
                        // here definition is an object having key-value pairs representing attribute and values of a script element in html header
                        // e.g., { async: true, src: "./something" }
                        // note: key-value pairs must match to a valid definition of script type element
                        // it adds script one by one, they will end loading at different times
                        // but since these are added, DOMReady will eventually ensure everything is loaded
                        // before moving ahead
                        let list = [
                        ];
                        list.push(...settings.boot.scripts);
                        addHeadElements(list, 'script');
                    }
                };
                const loadLinks = async () => { // links loading is supported only on client ui environment
                    if (env.isClient && !env.isWorker) {
                        // combined links (inbuilt and configured)
                        // which() will pick as: (from src and href keys only)
                        // envProp::mainThreadOnServer{.min}.xyz ~ envProp::workerThreadOnServer{.min}.xyz | envProp::mainThreadOnClient{.min}.xyz ~ envProp::workerThreadOnClient{.min}.xyz
                        // here definition is an object having key-value pairs representing attribute and values of a link element in html header
                        // e.g., { rel: "icon", href: "/favicon.ico" type: "image/x-icon" }
                        // note: key-value pairs must match to a valid definition of link of that type
                        // it adds links one by one, they will end loading at different times
                        // but since these are added, DOMReady will eventually ensure everything is loaded
                        // before moving ahead
                        let list = [
                        ];
                        list.push(...settings.boot.links);
                        addHeadElements(list, 'link');
                    }
                };   
                const loadMeta = async () => {
                    if (env.isClient && !env.isWorker) {
                        // combined meta (inbuilt and configured)
                        // which() will pick as: (from src and href keys only)
                        // envProp::mainThreadOnServer{.min}.xyz ~ envProp::workerThreadOnServer{.min}.xyz | envProp::mainThreadOnClient{.min}.xyz ~ envProp::workerThreadOnClient{.min}.xyz
                        // here definition is an object having key-value pairs representing attribute and values of a meta element in html header
                        // e.g., { name: "viewport", content: "width=device-width, initial-scale=1" }
                        // note: key-value pairs must match to a valid definition of meta of that type
                        let list = [
                            { name: 'BuiltWith', content: `${flair.info.name}` }
                        ];
                        list.push(...settings.boot.meta);
                        addHeadElements(list, 'meta');
                    }
                };              
                const loadPreambles = async () => {
                    let list = null,
                        preambleLoader = null;
        
                    // combined preambles (inbuilt and configured)
                    // which() will pick as:
                    // envProp::mainThreadOnServer{.min}.xyz ~ envProp::workerThreadOnServer{.min}.xyz | envProp::mainThreadOnClient{.min}.xyz ~ envProp::workerThreadOnClient{.min}.xyz
                    // here definition is just the root folder of assembly group/module, where preamble.js would exists for that set of assemblies
                    list = [
                    ];
                    list.push(...settings.boot.preambles);
                    
                    for(let item of list) {
                        item = which(item);
                        if (item) {
                            // suffix preamble.js
                            if (!item.endsWith('/')) { item += '/'; }
                            item += 'preamble{.min}.js'; // as bundled preambles can be minified too
        
                            // this loads it as a module and then call the exported function with flair instance
                            preambleLoader = await include(item);
                            await preambleLoader(flair);
                        }
                    }
                };
                const loadPortHandlers = async () => {
                    let list = null,
                        phType = null;
        
                    // combined port handlers (inbuilt and configured)
                    // which() will pick as:
                    // envProp::mainThreadOnServer{.min}.xyz ~ envProp::workerThreadOnServer{.min}.xyz | envProp::mainThreadOnClient{.min}.xyz ~ envProp::workerThreadOnClient{.min}.xyz
                    // here definition is just the qualified type name which implements IPortHandler
                    // note: ports of same type will be overwritten if defined multiple times, this is beneficial too, as
                    //       all inbuilt port definitions can be overwritten if need be 
                    list = [
                        'flair.app.logging.LogPort',
                        'flair.app.ajax.FetchPort',
                        'flair.app.caching.SessionPort',
                        'flair.app.caching.StatePort',
                        'flair.app.caching.CachePort'
                    ];
                    list.push(...settings.boot.ports);
        
                    for(let item of list) {
                        item = which(item);
                        if (item) {
                            phType = as(await include(item), IPortHandler);
                            Port.connect(new phType());
                        }
                    }
                };
                const loadCustomAttributes = async () => { 
                    let list = null,
                        caType = null;
        
                    // combined custom attributes (inbuilt and configured)
                    // which() will pick as:
                    // envProp::mainThreadOnServer{.min}.xyz ~ envProp::workerThreadOnServer{.min}.xyz | envProp::mainThreadOnClient{.min}.xyz ~ envProp::workerThreadOnClient{.min}.xyz
                    // here definition is just the qualified type name which implements IAttribute
                    // note: it will throw error if a custom attribute with same name is already registered
                    list = [
                        'flair.app.ajax.FetchAttr',
                        'flair.app.caching.SessionAttr',
                        'flair.app.caching.StateAttr',
                        'flair.app.caching.CacheAttr'
                    ];
                    list.push(...settings.boot.attributes);
        
                    for(let item of list) {
                        item = which(item);
                        if (item) {
                            caType = as(await include(item), IAttribute);
                            if (caType) {
                                $$.register(new caType());
                            }
                        }
                    }
                };      
                const loadAspects = async () => { // TODO: create this method
                    // let list = null,
                    //     caType = null;
        
                    //     // TODO
                    // // combined custom attributes (inbuilt and configured)
                    // // which() will pick as:
                    // // envProp::mainThreadOnServer{.min}.xyz ~ envProp::workerThreadOnServer{.min}.xyz | envProp::mainThreadOnClient{.min}.xyz ~ envProp::workerThreadOnClient{.min}.xyz
                    // // here definition is { name: "", type: "" } name and the qualified type name which is derived from Attribute
                    // // note: it will ignore if a custom attribute with same name is already registered
                    // list = [
                    //     { name: 'fetch', type: 'flair.app.ajax.FetchAttr' },
                    //     { name: 'cache', type: 'flair.app.caching.CacheAttr' }
                    // ];
                    // list.push(...settings.boot.attributes);
        
                    // for(let item of list) {
                    //     item.type = which(item.type);
                    //     if (item.name && item.type && !Container.isRegistered(item.name)) {
                    //         caType = as(await include(item.type), Attribute);
                    //         if (caType) { Container.register(item.name, caType); }
                    //     }
                    // }
                };            
                const loadAssemblies = async () => {
                    // combined assemblies (inbuilt and configured)
                    // which() will pick as:
                    // envProp::mainThreadOnServer{.min}.xyz ~ envProp::workerThreadOnServer{.min}.xyz | envProp::mainThreadOnClient{.min}.xyz ~ envProp::workerThreadOnClient{.min}.xyz
                    // here definition is just the file and path name of the assembly to be loaded
                    let list = [
                        "./flair.app{.min}.js",
                        "./flair.server{.min}.js | ./flair.client{.min}.js",
                        "x | isVue::./flair.client.vue{.min}.js",
                        "isFirebase::./flair.server.firebase{.min}.js | x"
                    ];
                    list.push(...settings.boot.assemblies);
        
                    for(let item of list) {
                        item = which(item);
                        if (item) { await AppDomain.context.loadAssembly(item); }
                    }
                };
                const loadBootwares = async () => {
                    let list = null,
                        bwType = null,
                        bw = null;
                        
        
                    // combined bootwares (inbuilt and configured)
                    // which() will pick as:
                    // envProp::mainThreadOnServer{.min}.xyz ~ envProp::workerThreadOnServer{.min}.xyz | envProp::mainThreadOnClient{.min}.xyz ~ envProp::workerThreadOnClient{.min}.xyz
                    // here definition is just the qualified type name which is derived from Bootware type
                    list = [
                        "flair.app.bw.SessionStorage | x",
                        "flair.app.bw.NodeEnv ~ x | x",
                        "flair.app.bw.Middlewares ~ x | x",
                        "flair.app.bw.DIContainer",
                        "x | isVue::flair.app.bw.VueSetup ~ x",
                        "flair.app.bw.ServerRouter ~ x | flair.app.bw.ClientRouter | x"
                    ];
                    list.push(...settings.boot.bootwares);
        
                    for(let item of list) {
                        item = which(item);
                        if (item) {
                            bwType = as(await include(item), Bootware);
                            if (bwType) {
                                bw = new bwType(); 
                                allBootwares.push(bw); // push in array, so boot and ready would be called for them
                                if (bw.isMountSpecific) { // if bootware is mount specific bootware - means can run once for each mount
                                    mountSpecificBootwares.push(bw);
                                }
                            }
                        }
                    }
                };
                const runBootwares = async (method) => {
                    if (!env.isWorker) { // main env
                        let mounts = AppDomain.host().mounts,
                            mountNames = Object.keys(mounts),
                            mountName = '',
                            mount = null;
                    
                        // run all bootwares for main
                        mountName = 'main';
                        mount = mounts[mountName];
                        for(let bw of allBootwares) {
                            await bw[method](mount);
                        }
        
                        // run all bootwares which are mount specific for all other mounts (except main)
                        for(let mountName of mountNames) {
                            if (mountName === 'main') { continue; }
                            mount = mounts[mountName];
                            for(let bw of mountSpecificBootwares) {
                                await bw[method](mount);
                            }
                        }
                    } else { // worker env
                        // in this case as per load[] setting, no nountspecific bootwares should be present
                        if (mountSpecificBootwares.length !== 0) { 
                            console.warn('Mount specific bootwares are not supported for worker environment. Revisit worker:flair.app->load setting.'); // eslint-disable-line no-console
                        }
        
                        // run all for once (ignoring the mountspecific ones)
                        for(let bw of allBootwares) {
                            if (!bw.isMountSpecific) {
                                await bw[method]();
                            }
                        }
                    }
                };
                const boot = async () => {
                    const Host = await include(settings.host);
                    const App = await include(settings.app);
                
                    // set host
                    if (!env.isWorker) {
                        let hostObj = new Host();
                        await hostObj.boot();
                        AppDomain.host(hostObj); 
                    }
                    
                    // boot
                    await runBootwares('boot');   
                    
                    // set app
                    let appObj = new App();
                    await appObj.boot();
                    AppDomain.app(appObj); 
                };        
                const start = async () => {
                    if (!env.isWorker) {
                        await AppDomain.host().start();
                    }
                    await AppDomain.app().start();
                };
                const DOMReady = () => {
                    return new Promise((resolve, reject) => { // eslint-disable-line no-unused-vars
                        if( document.readyState !== 'loading' ) {
                            resolve();
                        } else {
                            window.document.addEventListener("DOMContentLoaded", () => {
                                resolve();
                            });
                        }
                    });
                };
                const DeviceReady = () => {
                    return new Promise((resolve, reject) => { // eslint-disable-line no-unused-vars
                        window.document.addEventListener('deviceready', () => {
                            // NOTE: even if the device was already ready, registering for this event will immediately fire it
                            resolve();
                        }, false);
                    });
                };
                const ready = async () => {
                    if (env.isClient && !env.isWorker) {
                        await DOMReady();
                        if (env.isCordova) { await DeviceReady(); }
                    }
        
                    if (!env.isWorker) {
                        await AppDomain.host().ready();
                    }
                    await runBootwares('ready');
                    await AppDomain.app().ready();
                };
                  
                await loadConfiguredEnv();
                await loadMeta();
                await loadLinks();
                await loadScripts();
                await loadPreambles();
                await loadPortHandlers();
                await loadCustomAttributes();
                await loadAspects();
                await loadAssemblies();
                await loadBootwares();
                await boot();
                await start();
                await ready();
                console.log('ready!'); // eslint-disable-line no-console
                
                // return success
                return true;
            };
        });
        
    })();    
    await (async () => { // type: ./src/flair.app/flair.app.caching/state/StateAttr.js
        const { IAttribute } = await ns();
        const { State } = await ns('flair.app.caching');
        
        /**
         * @name StateAttr
         * @description State custom attribute
         * $$('state')
         */
        $$('sealed');
        $$('ns', 'flair.app.caching');
		Class('StateAttr', [IAttribute], function() {
            $$('readonly');
            this.name = 'state';
        
            $$('readonly');
            this.constraints = '(class && prop) && !($static || $session || $readonly || $abstract || $virtual)';
        
        
            // TODO: here onwards - think how session and etate will come out of builder
            // considering addDisposal -- is that needed - because on dispose it is removed 
            // and no point of session and state availability then
            this.decorateFunction = (typeName, memberName, member, ttl) => {
                let cacheId = `${typeName}___${memberName}`;
        
                let callMember = async (...args) => {
                    let resultData = await member(...args);
                    await State.setItem(cacheId, resultData, ttl);
                    return resultData;
                };
        
                // decorated function
                return async function(...args) {
                    let fetchedData = await State.getItem(cacheId);
                    return (fetchedData !== null) ? fetchedData : await callMember(...args);
                };
            };
        });
        
    })();    
    await (async () => { // type: ./src/flair.app/flair.app.logging/LogPort.js
        
        const { IPortHandler } = await ns();
        
        /**
         * @name LogPort
         * @description Default server/client logging definition
         */
        $$('ns', 'flair.app.logging');
		Class('LogPort', [IPortHandler], function() {
            // TODO
        });
        
    })();
    // assembly closure: types (end)
    
    // assembly closure: embedded resources (start)
    // (not defined)
    // assembly closure: embedded resources (end)        
    
    // clear assembly being loaded
    AppDomain.context.current().currentAssemblyBeingLoaded('', (typeof onLoadComplete === 'function' ? onLoadComplete : null)); // eslint-disable-line no-undef
    
    // register assembly definition object
    AppDomain.registerAdo('{"name":"flair.app","file":"./flair.app{.min}.js","package":"flairjs-fabric","desc":"Foundation for True Object Oriented JavaScript Apps","title":"Flair.js Fabric","version":"0.60.36","lupdate":"Sat, 28 Sep 2019 15:50:56 GMT","builder":{"name":"flairBuild","version":"1","format":"fasm","formatVersion":"1","contains":["init","func","type","vars","reso","asst","rout","sreg"]},"copyright":"(c) 2017-2019 Vikas Burman","license":"MIT","types":["flair.app.Bootware","flair.app.HandlerContext","flair.app.Payload","flair.app.Handler","flair.app.App","flair.app.HandlerResult","flair.app.Host","flair.app.Middleware","flair.app.caching.StateStorage","flair.app.ajax.FetchHandler","flair.app.caching.SessionStorage","flair.app.caching.CacheStorage","flair.app.ajax.FetchAttr","flair.app.bw.DIContainer","flair.app.caching.CacheAttr","flair.app.caching.SessionAttr","flair.app.BootEngine","flair.app.caching.StateAttr","flair.app.logging.LogPort"],"resources":[],"assets":[],"routes":[]}');
    
    // return settings and config
    return Object.freeze({
        name: 'flair.app',
        settings: settings,
        config: config
    });
});