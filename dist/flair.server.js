/**
 * @preserve
 * Flair.js Fabric
 * Foundation for True Object Oriented JavaScript Apps
 * 
 * Assembly: flair.server
 *     File: ./flair.server.js
 *  Version: 0.59.85
 *  Mon, 23 Sep 2019 01:27:45 GMT
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
        root['flair.server'] = factory;
    }
})(this, async function(flair, __asmFile) {
    'use strict';

    // assembly closure: init (start)
    /* eslint-disable no-unused-vars */
    
    // flair types, variables and functions
    const { Class, Struct, Enum, Interface, Mixin, Aspects, AppDomain, $$, attr, bring, Container, include, Port, on, post, telemetry,
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
    AppDomain.loadPathOf('flair.server', __currentPath);
    
    // settings of this assembly
    let settings = JSON.parse('{"envVars":{"vars":[],"options":{"overwrite":true}}}');
    let settingsReader = Port('settingsReader');
    if (typeof settingsReader === 'function') {
        let externalSettings = settingsReader('flair.server');
        if (externalSettings) { settings = deepMerge([settings, externalSettings], false); }
    }
    settings = Object.freeze(settings);
    
    // config of this assembly
    let config = JSON.parse('{}');
    config = Object.freeze(config);
    
    /* eslint-enable no-unused-vars */
    // assembly closure: init (end)
    
    // assembly closure: global functions (start)
    // (not defined)
    // assembly closure: global functions (end)
    
    // set assembly being loaded
    AppDomain.context.current().currentAssemblyBeingLoaded('./flair.server{.min}.js');
    
    // assembly closure: types (start)
        
    await (async () => { // type: ./src/flair.server/flair.api/@1-AttachmentPayload.js
        const { Payload } = await ns('flair.app');
        const path = require('path');
        
        /**
         * @name AttachmentPayload
         * @description Downloadable file payload
         */
        $$('ns', 'flair.api');
		Class('AttachmentPayload', Payload, function() {
            $$('override');
            this.construct = (base, file, status, mimeType, displayName, options, cb, resHeaders) => {
                if (!this.file) { throw Exception.InvalidArgument('file'); }
                base(file, status, mimeType, resHeaders);
                
                this.file = file || ''; 
                this.displayName = displayName || path.basename(this.file);
                this.options = options || null;
                this.cb = cb || null;
        
                this.resHeaders.push({ name: 'Content-disposition', value: `attachment;filename=${this.displayName || 'unknown.unknown'}` });
            };
        
            $$('readonly');
            this.file = '';
        
            $$('readonly');
            this.displayName = '';
        
            $$('readonly');
            this.options = null;
        
            $$('readonly');
            this.cb = null;
        });
        
    })();    
    await (async () => { // type: ./src/flair.server/flair.api/@1-BinaryPayload.js
        const { Payload } = await ns('flair.app');
        
        /**
         * @name BinaryPayload
         * @description Binary data
         */
        $$('ns', 'flair.api');
		Class('BinaryPayload', Payload, function() {
            $$('override');
            this.construct = (base, data, status, mimeType, filename, cb, resHeaders) => {
                if (!data)  { throw Exception.InvalidArgument('data'); }
        
                this.buffer = Buffer.from(data, this.encoding);
                
                base(this.buffer, status, mimeType, resHeaders);
        
                this.cb = cb || null;
        
                this.resHeaders.push({ name: 'Content-disposition', value: `attachment;filename=${filename || 'unknown.unknown'}` });
                this.resHeaders.push({ name: 'Content-Length', value: this.buffer.length });
            };
        
            $$('readonly');
            this.buffer = null;
        
            $$('readonly');
            this.encoding = 'binary';
        
            $$('readonly');
            this.cb = null;
        });
        
    })();    
    await (async () => { // type: ./src/flair.server/flair.api/@1-JSONPayload.js
        const { Payload } = await ns('flair.app');
        
        /**
         * @name JSONPayload
         * @description JSON/JSONP data
         */
        $$('ns', 'flair.api');
		Class('JSONPayload', Payload, function() {
            $$('override');
            this.construct = (base, data, status, isJsonP, resHeaders) => {
                if (!data)  { throw Exception.InvalidArgument('data'); }
                base(data, status, 'application/json', resHeaders);
        
                this.isJsonP = isJsonP || false;
            };
        
            $$('readonly');
            this.isJsonP = false;
        });
        
    })();    
    await (async () => { // type: ./src/flair.server/flair.api/@2-RestHandlerResult.js
        const { HandlerResult } = await ns('flair.app');
        
        /**
         * @name RESTHandlerResult
         * @description RESTful service Handler Result 
         */
        $$('ns', 'flair.api');
		Class('RestHandlerResult', HandlerResult, function() {
            $$('override');
            this.construct = (base, error, payload, resHeaders) => {
                base(error, payload, resHeaders);
            };
        });
        
    })();    
    await (async () => { // type: ./src/flair.server/flair.api/@3-RestHandlerContext.js
        const { HandlerContext } = await ns('flair.app');
        
        /**
         * @name RestHandlerContext
         * @description Restful API Handler Context
         */
        $$('ns', 'flair.api');
		Class('RestHandlerContext', HandlerContext, function() {
            $$('override');
            this.construct = (base, req, res) => { 
                base();
        
                this.req = req;
                this.res = res;
            };
        
            // ideally these should not be used directly
            $$('readonly');
            this.req = null;
        
            // ideally these should not be used directly
            $$('readonly');
            this.res = null;
        
            // response specific items
            this.isHeadersSent = { get: () => { return this.res.headersSent; } }
            this.getResHeader = (name) => { return this.res.get(name); };
            this.setHeader = (name, value, isAppend) => { 
                if (isAppend) {
                    this.res.append(name, value);
                } else {
                    this.res.set(name, value); 
                }
            };
            this.setCookie = (name, value, options) => { this.res.cookie(name, value, options); };
            this.clearCookie = (name, options) => { this.res.clearCookie(name, options); };
        
            // request specific items
            this.isAjaxReq = { get: () => { return this.req.xhr; } }
            this.isStale = { get: () => { return this.req.stale; } }
            this.isFresh = { get: () => { return this.req.fresh; } }
            this.isSecure = { get: () => { return this.req.secure; } }
            this.originalUrl = { get: () => { return this.req.originalUrl; } }
            this.baseUrl = { get: () => { return this.req.baseUrl; } }
            this.route = { get: () => { return this.req.route; } }
            this.ip = { get: () => { return this.req.ip; } }
            this.ips = { get: () => { return this.req.ips; } }
            this.hostName = { get: () => { return this.req.hostname; } }
            this.subDomains = { get: () => { return this.req.subdomains; } }
            this.protocol = { get: () => { return this.req.protocol; } }
            this.path = { get: () => { return this.req.path; } }
            this.method = { get: () => { return this.req.method; } }
            this.body = { get: () => { return this.req.method; } }
            this.params = { get: () => { return this.req.params; } }
            this.query = { get: () => { return this.req.query; } }
            this.isContentType = (mimeType) => { 
                // https://expressjs.com/en/api.html#req.is
                if (typeof this.req.is(mimeType) === 'string') {
                    return true; 
                } else {
                    return false;
                }
            };
            this.getHeader = (name) => { return this.req.get(name); };
            this.getCookie = (name, isSigned) => { 
                if (isSigned) {
                    if (this.req.signedCookies) { return this.req.signedCookies[name] || null; }
                } else {
                    if (this.req.cookies) { return this.req.cookies[name] || null; }
                }
                return null;
            };
            this.acceptsContentType = (...types) => { return this.req.accepts(types); }
            this.acceptsCharset = (...types) => { return this.req.acceptsCharsets(types); }
            this.acceptsEncoding = (...types) => { return this.req.acceptsEncodings(types); }
            this.acceptsLanguage = (...types) => { return this.req.acceptsLanguages(types); }
        });
        
    })();    
    await (async () => { // type: ./src/flair.server/flair.api/@4-RestHandler.js
        const { Handler } = await ns('flair.app');
        const { RestHandlerResult } = await ns('flair.api');
        
        /**
         * @name RestHandler
         * @description Restful API Handler
         */
        $$('ns', 'flair.api');
		Class('RestHandler', Handler, function() {
            $$('override');
            this.run = async (base, verb, ctx) => {
                base(verb, ctx);
        
                let result = null,
                    error = null,
                    fn = null;
        
                // get handler function
                switch(verb) {
                    case 'get': fn = this.onGet; break;
                    case 'post': fn = this.onPost; break;
                    case 'put': fn = this.onPut; break;
                    case 'patch': fn = this.onPatch; break;
                    case 'delete': fn = this.onDelete; break;
                    case 'head': fn = this.onHead; break;
                    case 'options': fn = this.onOptions; break;
                    case 'trace': fn = this.onTrace; break;
                }
        
                // run the handler
                if (fn && fn !== noop) {
                    try {
                        result = await fn(ctx); // (result can be: AttachmentPayload, BinaryPayload, Payload OR any normal data like a number, object, string, boolean, array, etc. just anything )
                    } catch (err) {
                        error = err;
                    }
                } else {
                    error = Exception.NotImplemented(`Verb ${verb} is not implemented.`);
                }
        
                // get well formed result
                let isError = error ? true : false,
                    isWellFormedResult = !isError && is(result, RestHandlerResult);
                if (!isWellFormedResult) { result = new RestHandlerResult(error, result); }
        
                // return 
                return result;
            };
        
            $$('protected');
            $$('virtual');
            $$('async');
            this.onGet = noop;
        
            $$('protected');
            $$('virtual');
            $$('async');
            this.onPost = noop;
        
            $$('protected');
            $$('virtual');
            $$('async');
            this.onPut = noop;
        
            $$('protected');
            $$('virtual');
            $$('async');
            this.onPatch = noop;
        
            $$('protected');
            $$('virtual');
            $$('async');
            this.onDelete = noop;
        
            $$('protected');
            $$('virtual');
            $$('async');
            this.onHead = noop;
            
            $$('protected');
            $$('virtual');
            $$('async');
            this.onOptions = noop;
            
            $$('protected');
            $$('virtual');
            $$('async');
            this.onTrace = noop;    
        });
        
    })();    
    await (async () => { // type: ./src/flair.server/flair.api/RestInterceptor.js
        /**
         * @name RestInterceptor
         * @description Api Interceptor
         */
        $$('ns', 'flair.api');
		Class('RestInterceptor', function() {
            $$('virtual');
            $$('async');
            this.run = noop;
        });
        
    })();    
    await (async () => { // type: ./src/flair.server/flair.boot/NodeEnv.js
        const { Bootware } = await ns('flair.app');
        
        /**
         * @name NodeEnv
         * @description Node Environment Settings
         */
        $$('sealed');
        $$('ns', 'flair.boot');
		Class('NodeEnv', Bootware, function() {
            $$('override');
            this.construct = (base) => {
                base('Node Server Environment');
            };
        
            $$('override');
            this.boot = async (base) => {
                base();
        
                if (settings.envVars.vars.length > 0) {
                    const nodeEnv = await include('node-env-file | x');
        
                    if (nodeEnv) {
                        for(let envVar of settings.envVars.vars) {
                            nodeEnv(AppDomain.resolvePath(envVar), settings.envVars.options);
                        }
                    }
                }
            };
        });
        
    })();
    // assembly closure: types (end)
    
    // assembly closure: embedded resources (start)
    // (not defined)
    // assembly closure: embedded resources (end)        
    
    // clear assembly being loaded
    AppDomain.context.current().currentAssemblyBeingLoaded('', (typeof onLoadComplete === 'function' ? onLoadComplete : null)); // eslint-disable-line no-undef
    
    // register assembly definition object
    AppDomain.registerAdo('{"name":"flair.server","file":"./flair.server{.min}.js","package":"flairjs-fabric","desc":"Foundation for True Object Oriented JavaScript Apps","title":"Flair.js Fabric","version":"0.59.85","lupdate":"Mon, 23 Sep 2019 01:27:45 GMT","builder":{"name":"flairBuild","version":"1","format":"fasm","formatVersion":"1","contains":["init","func","type","vars","reso","asst","rout","sreg"]},"copyright":"(c) 2017-2019 Vikas Burman","license":"MIT","types":["flair.api.AttachmentPayload","flair.api.BinaryPayload","flair.api.JSONPayload","flair.api.RestHandlerResult","flair.api.RestHandlerContext","flair.api.RestHandler","flair.api.RestInterceptor","flair.boot.NodeEnv"],"resources":[],"assets":["main.js","start.js"],"routes":[]}');
    
    // return settings and config
    return Object.freeze({
        name: 'flair.server',
        settings: settings,
        config: config
    });
});