/**
 * @preserve
 * Flair.js Fabric
 * Foundation for True Object Oriented JavaScript Apps
 * 
 * Assembly: flair.server
 *     File: ./flair.server.js
 *  Version: 0.60.37
 *  Sat, 28 Sep 2019 18:53:26 GMT
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
    AppDomain.loadPathOf('flair.server', __currentPath);
    
    // settings of this assembly
    let settings = JSON.parse('{"envVars":{"vars":[],"options":{"overwrite":true}},"express":{"server-http":{"enable":false,"port":80,"timeout":-1},"server-https":{"enable":false,"port":443,"timeout":-1,"privateKey":"","publicCert":""}},"routing":{"mounts":{"main":"/"},"all":{"before":{"settings":[],"middlewares":[]},"after":{"settings":[],"middlewares":[]}}}}');
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
        
    await (async () => { // type: ./src/flair.server/flair.app/@1-ServerMiddleware.js
        const { Middleware } = await ns('flair.app');
        
        /**
         * @name Server Middleware
         * @description Server middleware, where code executes on route where it is attached
         */
        $$('ns', 'flair.app');
		Class('ServerMiddleware', Middleware, function() {
            $$('override');
            this.run = async (req, res, next, ...mwArgs) => {
                await this.onRun(req, res, ...mwArgs);
                next();
            };
            
            $$('virtual');
            $$('async');
            this.onRun = nim;
        });
        
    })();    
    await (async () => { // type: ./src/flair.server/flair.api/@1-AttachmentPayload.js
        const { Payload } = await ns('flair.app');
        const path = await include('path');
        
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
        
            // ideally this should not be used directly
            $$('readonly');
            this.req = null;
        
            // ideally this should not be used directly
            $$('readonly');
            this.res = null;
        
            this.redirect = (route, status, params, query) => {
                this.setData('redirect-route', route);
                this.setData('redirect-status', status || 302); // Found
                this.setData('redirect-params', params || null);
                this.setData('redirect-query', query || null);
                throw Exception.Redirect(route);
            };
        
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
            this.url = { get: () => { return this.req.url; } }
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
            this.body = { get: () => { return this.req.body; } }
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
            this.construct = (base, route) => {
                base(route);
            };
        
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
                if (fn) {
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
    await (async () => { // type: ./src/flair.server/flair.app/ServerHost.js
        const { Host } = await ns('flair.app');
        
        /**
         * @name ServerHost
         * @description Server host implementation
         */
        $$('sealed');
        $$('ns', 'flair.app');
		Class('ServerHost', Host, function() {
            let mountedApps = {},
                httpServer = null,
                httpsServer = null,
                httpSettings = settings.express['server-http'],
                httpsSettings = settings.express['server-https'];         
            
            $$('override');
            this.construct = (base) => {
                base('Server');
            };
        
            this.app = {
                get: () => { return this.mounts['main'].app; },  // main express app
                set: noop
            };
            this.mounts = { // all mounted express apps
                get: () => { return mountedApps; },
                set: noop
            };
        
            // path support (start)
            this.routeToUrl = (route, params, query) => {
                if (!route) { return null; }
        
                // get route object
                let routeObj = AppDomain.context.current().getRoute(route); // route = qualifiedRouteName
                if (!routeObj) {
                    return replaceAll(route, '.', '_'); // convert route qualified name in a non-existent url, so it will automatically go to notfound view
                }
        
                let url = routeObj.path;
                if (!url.startsWith('/')) { url = '/' +  url; }
        
                // replace params
                // path can be like: test/:id
                // where it is expected that params.id property will 
                // have what to replace in this
                // If param var not found in path, it will be added as query string
                // but ideally query string should be passed separately as object 
                let isQueryAdded = false;
                if (params) {
                    let idx = -1,
                        qs = '?',
                        value = null;
                    for(let p in params) {
                        if (params.hasOwnProperty(p)) {
                            idx = url.indexOf(`:${p}`);
                            value = encodeURIComponent(params[p].toString());
                            if (idx !== -1) { 
                                url = replaceAll(url, `:${p}`, value); 
                            } else {
                                qs += `${p}=${value}&`;
                            }
                        }
                    }
                    if (qs !== '?') { 
                        isQueryAdded = true;
                        if (qs.endsWith('&')) { qs = qs.substr(0, qs.length - 1); } // remove last &
                        url += qs; 
                    }            
                }
        
                // query
                if (query) {
                    let qs = isQueryAdded ? '&' : '?',
                        value = null;
                    for(let p in query) {
                        if (query.hasOwnProperty(p)) {
                            value = encodeURIComponent(query[p].toString());
                            qs += `${p}=${value}&`;
                        }
                    }
                    if (qs !== '?' || qs !== '&') {
                        url += qs; // add these as well
                    }               
                }
        
                // done
                return url;
            };
            // path support (end)    
        
            $$('override');
            this.boot = async (base) => { // mount all express app and sub-apps
                base();
        
                const express = await include('express | x');
        
                const applySettings = (mountName, mount) => {
                    // app settings
                    // each item is: { name: '', value:  }
                    // name: as in above link (as-is)
                    // value: as defined in above link
                    let appSettings = this.getMountSpecificSettings('settings', settings.routing, mountName, 'name');
                    if (appSettings && appSettings.length > 0) {
                        for(let appSetting of appSettings) {
                            mount.set(appSetting.name, appSetting.value);
                        }
                    }            
                };
        
                // create main app instance of express
                let mainApp = express(),
                    mainAppMountParams = (settings.routing['main'] ? settings.routing['main']['params'] : '') || '';
                applySettings('main', mainApp);
        
                // create one instance of express app for each mounted path
                let mountPath = '',
                    mount = null,
                    mountParams = '';
                for(let mountName of Object.keys(settings.routing.mounts)) {
                    if (mountName === 'main') {
                        mountPath = '/';
                        mount = mainApp;
                        mountParams = mainAppMountParams;
                    } else {
                        mountPath = settings.routing.mounts[mountName];
                        mountParams = (settings.routing[mountName] ? settings.routing[mountName]['params'] : '') || '';
                        mount = express(); // create a sub-app
                    }
        
                    // attach
                    mountedApps[mountName] = Object.freeze({
                        name: mountName,
                        root: mountPath,
                        params: mountParams,
                        app: mount
                    });
        
                    // apply settings and attach to main app
                    if (mountName !== 'main') {
                        applySettings(mountName, mount);
                        mainApp.use(mountPath, mount); // mount sub-app on given root path                
                    }
                }
        
                // store
                mountedApps = Object.freeze(mountedApps);        
            };
        
            $$('override');
            this.start = async (base) => { // configure express http and https server
                base();
        
                // proceed only if not serverless environment
                if (env.x().isServerless) { return; }
        
                const fs = await include('fs | x');
                const http = await include('http | x');
                const https = await include('https | x');
                const httpShutdown = await include('http-shutdown | x');    
        
                // configure http server
                if (httpSettings.enable) { 
                    httpServer = http.createServer(this.app);
                    httpServer = httpShutdown(httpServer); // wrap
                    httpServer.on('error', (err) => {
                        this.error(err);
                    }); // pass-through event
                    if (httpSettings.timeout !== -1) { httpServer.timeout = httpSettings.timeout; } // timeout must be in milliseconds
                }
        
                // configure httpS server
                if (httpsSettings.enable) { 
                    // SSL Certificate
                    // NOTE: For creating test certificate:
                    //  > Goto http://www.cert-depot.com/
                    //  > Create another test certificate
                    //  > Download KEY+PEM files
                    //  > Rename *.private.pem as key.pem
                    //  > Rename *.public.pem as cert.pem
                    //  > Update these files at private folder
                    const privateKey  = fs.readFileSync(AppDomain.resolvePath(httpsSettings.privateKey), 'utf8');
                    const publicCert = fs.readFileSync(AppDomain.resolvePath(httpsSettings.publicCert), 'utf8');
                    const credentials = { key: privateKey, cert: publicCert };
        
                    httpsServer = https.createServer(credentials, this.app);
                    httpsServer = httpShutdown(httpsServer); // wrap
                    httpsServer.on('error', (err) => {
                        this.error(err);
                    }); // pass-through event
                    if (httpsSettings.timeout !== -1) { httpsServer.timeout = httpsSettings.timeout; } // timeout must be in milliseconds
                }
            };
        
            $$('override');
            this.ready = (base) => { // start listening express http and https servers
                return new Promise((resolve, reject) => { // eslint-disable-line no-unused-vars
                    base();
        
                    // proceed only if not serverless environment
                    if (env.x().isServerless) { resolve(); return; }
        
                    // start server
                    let httpPort = httpSettings.port || 80,
                        httpsPort = process.env.PORT || httpsSettings.port || 443;
                    if (httpServer && httpsServer) {
                        httpServer.listen(httpPort, () => {
                            httpsServer.listen(httpsPort, () => {
                                console.log(`${AppDomain.app().info.name}, v${AppDomain.app().info.version} (http: ${httpPort}, https: ${httpsPort})`); // eslint-disable-line no-console
                                resolve();
                            });
                        });
                    } else if (httpServer) {
                        httpServer.listen(httpPort, () => {
                            console.log(`${AppDomain.app().info.name}, v${AppDomain.app().info.version} (http: ${httpPort})`); // eslint-disable-line no-console
                            resolve();
                        });
                    } else if (httpsServer) {
                        httpsServer.listen(httpsPort, () => {
                            console.log(`${AppDomain.app().info.name}, v${AppDomain.app().info.version} (https: ${httpsPort})`); // eslint-disable-line no-console
                            resolve();
                        });
                    } else {
                        console.log(`${AppDomain.app().info.name}, v${AppDomain.app().info.version}`); // eslint-disable-line no-console
                        resolve();
                    }
                });
            };
        
            $$('override');
            this.stop = async (base) => { // graceful shutdown express http and https servers
                base();
        
                // proceed only if not serverless environment
                if (env.x().isServerless) { return; }
        
                // stop http server gracefully
                if (httpServer) {
                    console.log('http server is shutting down...'); // eslint-disable-line no-console
                    httpServer.shutdown(() => {
                        httpServer = null;
                        console.log('http server is cleanly shutdown!'); // eslint-disable-line no-console
                    });
                }
        
                // stop https server gracefully
                if (httpsServer) {
                    console.log('https server is shutting down...'); // eslint-disable-line no-console
                    httpsServer.shutdown(() => {
                        httpsServer = null;
                        console.log('https server is cleanly shutdown!'); // eslint-disable-line no-console
                    });
                }
            }; 
        
            $$('override');
            this.dispose = (base) => {
                base();
        
                mountedApps = null;
            };
        });
        
    })();    
    await (async () => { // type: ./src/flair.server/flair.app.bw/Middlewares.js
        const { Bootware, ServerMiddleware } = await ns('flair.app');
        
        /**
         * @name Middlewares
         * @description Express Middleware Configurator
         */
        $$('sealed');
        $$('ns', 'flair.app.bw');
		Class('Middlewares', Bootware, function() {
            $$('override');
            this.construct = (base) => {
                base(true); // mount specific
            };
        
            $$('override');
            this.boot = async (base, mount) => {
                base();
        
                const processMwArgs = (args = []) => {
                    let mwArgs = [],
                        argValue = null;
                    for (let arg of args) {
                        if (typeof arg === 'string' && arg.startsWith('return ')) { // note a space after return
                            argValue = new Function(arg)();
                        } else if (typeof arg === 'object') {
                            for(let prop in arg) {
                                if (arg.hasOwnProperty(prop)) {
                                    argValue = arg[prop];
                                    if (typeof argValue === 'string' && argValue.startsWith('return ')) { // note a space after return
                                        argValue = new Function(arg)();
                                        arg[prop] = argValue;
                                    }
                                }
                            }
                            argValue = arg;
                        } else {
                            argValue = arg;
                        }
                        mwArgs.push(argValue);
                    }
                    return mwArgs;
                };
        
                // middleware information is defined at: https://expressjs.com/en/guide/using-middleware.html#middleware.application
                // each item is: { name: '', func: '', 'args': []  } OR { name: '', 'args': []  }
                // name: module name of the middleware, which will be included. This can also be a type inherited from Middleware
                // type: qualified type name that is derived from ServerMiddleware type
                // func: if middleware has a function that needs to be called for configuration, empty if required object itself is a function
                //       this is ignored when it is a type derived from ServerMiddleware
                // args: an array of args that need to be passed to this function or middleware function or onRun function of the custom Middleware
                //       Note: In case a particular argument setting is a function - define the function code as an arrow function string with a 'return prefix' and it will be loaded as function
                //       E.g., setHeaders in https://expressjs.com/en/4x/api.html#express.static is a function
                //       define it as: "return (res, path, stat) => { res.set('x-timestamp', Date.now()) }"
                //       this string will be passed to new Function(...) and returned values will be used as value of option
                //       all object type arguments will be scanned for string values that start with 'return ' and will be tried to convert into a function
                let middlewares = this.getMountSpecificSettings('middlewares', settings.routing, mount.name, 'name');
                if (middlewares && middlewares.length > 0) {
                    let mod = null,
                        func = null,
                        MWType = null,
                        mwObj = null;
                    for(let middleware of middlewares) {
                        try {
                            let mwArgs = processMwArgs(middleware.args);
        
                            // get module
                            // it could be 'express' itself for inbuilt middlewares
                            // it could be a type name as well which is inherited from 
                            MWType = null; mwObj = null;
                            mod = await include(middleware.name);
                            if (is(mod, 'flairtype') && as(mod, ServerMiddleware)) { // custom Middleware
                                MWType = mod;
                                mwObj = new MWType();
                                func = function (mw, ...args) {
                                    return function (req, res, next) {
                                        mw.run(req, res, next, ...args);
                                    };
                                };
                            } else {
                                // get func
                                if (middleware.func) {
                                    func = mod[middleware.func];
                                } else {
                                    func = mod;
                                }
                            }
        
                            // add middleware
                            // this means, this middleware will be used on all methods on this mount path
                            if (mwObj) {
                                mount.app.use(func(mwObj, ...mwArgs));
                            } else {
                                mount.app.use(func(...mwArgs));
                            }
                        } catch (err) {
                            throw Exception.OperationFailed(`Middleware ${middleware.name} load failed.`, err, this.boot);
                        }
                    }
                }
            };
        });
        
    })();    
    await (async () => { // type: ./src/flair.server/flair.app.bw/NodeEnv.js
        const { Bootware } = await ns('flair.app');
        
        /**
         * @name NodeEnv
         * @description Node Environment Settings
         */
        $$('sealed');
        $$('ns', 'flair.app.bw');
		Class('NodeEnv', Bootware, function() {
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
    await (async () => { // type: ./src/flair.server/flair.app.bw/ServerRouter.js
        const { Bootware, ServerMiddleware, Payload } = await ns('flair.app');
        const { RestHandler, RestHandlerResult, RestHandlerContext, AttachmentPayload, BinaryPayload, JSONPayload } = await ns('flair.api');
        
        /**
         * @name ServerRouter
         * @description Server Router Configuration Setup
         */
        $$('sealed');
        $$('ns', 'flair.app.bw');
		Class('ServerRouter', Bootware, function() {
            let routes = null;
            
            $$('override');
            this.construct = (base) => {
                base(true); // mount specific 
            };
        
            $$('override');
            this.boot = async (base, mount) => {
                base();
                
                // get all registered routes, and sort by index, if was not already done in previous call
                if (!routes) {
                    routes = AppDomain.context.current().allRoutes(true);
                    routes.sort((a, b) => {
                        if (a.index < b.index) {
                            return -1;
                        }
                        if (a.index > b.index) {
                            return 1;
                        }
                        return 0;
                    });
                }
        
                const onDone = (result, ctx, next) => {
                    let req = ctx.req, res = ctx.res; // eslint-disable-line no-unused-vars
        
                    // complete the call
                    if (result.status === 302) { // redirect - Found
                        let redirectRoute = ctx.getData('redirect-route'),
                            redirectStatus = ctx.getData('redirect-status'),
                            redirectParams = ctx.getData('redirect-params'),
                            redirectQuery = ctx.getData('redirect-query');
                        
                        // build path
                        let redirectPath = AppDomain.host().routeToUrl(redirectRoute, redirectParams, redirectQuery);
        
                        // perform redirect
                        res.redirect(redirectStatus, redirectPath);
                    } else { // send data
                        let isCompleted = false;
                        if (!result.isError && is(result.data, Payload)) { // extended but otherwise normal payload case when not error
                            // add any res headers
                            for(let rh of result.data.resHeaders) { 
                                res.set(rh.name, rh.value);
                            }
        
                            if (is(result.data, AttachmentPayload)) { // https://expressjs.com/en/api.html#res.download
                                isCompleted = true;
                                res.download(result.data.file, result.data.displayName, result.data.options, result.data.cb).end();
                            } else if (is(result.data, BinaryPayload)) { // https://expressjs.com/en/api.html#res.end AND // https://nodejs.org/api/http.html#http_response_end_data_encoding_callback
                                isCompleted = true;
                                res.end(result.data.buffer, result.data.encoding, result.data.cb);
                            } else if (is(result.data, JSONPayload)) { // https://expressjs.com/en/api.html#res.jsonp
                                isCompleted = true;
                                res.status(result.status).jsonp(result.value(true)).end(); // since there is no error, send minimal packet
                            }
                        }
                        if (result.isError || !isCompleted) { // error or normal payload or plain but extended payload cases 
                            if (ctx.isAjaxReq) {
                                res.status(result.status).json(result.value(!result.isError)).end(); // get minimal data, when there is no error
                            } else {
                                res.status(result.status).send(result.value(!result.isError)).end(); // get minimal data, when there is no error
                            }
                        }
                    }
                    
                    // call next, if defined
                    // TODO: check for scenario, if res is already ended and somehow a next() has come
                    if (typeof next === 'function') {
                        next();
                    }
                };
                const onError = (err, ctx, next) => {
                    let result = new RestHandlerResult(err);
                    if (result.status === 100) { // continue
                        next(); // continue to next
                    } else {
                        onDone(result, ctx);
                    }
                };      
                const processMwArgs = (args = []) => {
                    let mwArgs = [],
                        argValue = null;
                    for (let arg of args) {
                        if (typeof arg === 'string' && arg.startsWith('return ')) { // note a space after return
                            argValue = new Function(arg)();
                        } else if (typeof arg === 'object') {
                            for(let prop in arg) {
                                if (arg.hasOwnProperty(prop)) {
                                    argValue = arg[prop];
                                    if (typeof argValue === 'string' && argValue.startsWith('return ')) { // note a space after return
                                        argValue = new Function(arg)();
                                        arg[prop] = argValue;
                                    }
                                }
                            }
                            argValue = arg;
                        } else {
                            argValue = arg;
                        }
                        mwArgs.push(argValue);
                    }
                    return mwArgs;
                };        
                const runMW = async (mw, ctx) => {
                    try {
                        // process args
                        let mwArgs = processMwArgs(mw.args);
        
                        // get module
                        // it could be 'express' itself for inbuilt middlewares
                        // it could be a type name as well which is inherited from 
                        let MWType = null,
                            mwObj = null,
                            mod = null,
                            func = null;
        
                        // run module
                        mod = await include(mw.name);
                        if (is(mod, 'flairtype') && as(mod, ServerMiddleware)) { // custom Middleware
                            MWType = mod;
                            mwObj = new MWType();
                            // it can throw error that will be passed in response and response cycle will stop here
                            // or it can pass err in given next handler where it will be thrown
                            // the idea is to stop on error
                            mwObj.run(ctx.req, ctx.res, (err) => { throw err; }, ...mwArgs);
                        } else {
                            if (mw.func) {
                                func = mod[mw.func];
                            } else {
                                func = mod;
                            }
                            func = func(...mwArgs); // to get wrapped func that takes req, res and next params
                            func(ctx.req, ctx.res, (err) => { throw err; });
                        }
                    } catch (err) {
                        throw Exception.OperationFailed(`Middleware ${mw.name} failed.`, err);                                
                    }
                };          
                const runHandler = async (route, routeHandler, verb, ctx) => {
                    let RouteHandler = as(await include(routeHandler), RestHandler);
                    if (RouteHandler) {
                        // run route-specific middlewares, if defined
                        if (route.mw && route.mw.length > 0) {
                            for(let mw of route.mw) {
                                await runMW(mw, ctx);
                            }
                        }
        
                        let rh = new RouteHandler(route);
                        return await rh.run(verb, ctx);
                    } else {
                        throw Exception.InvalidDefinition(`Invalid route handler. (${routeHandler})`);
                    }
                };
                const chooseRouteHandler = (route) => {
                    if (typeof route.handler === 'string') { return route.handler; }
                    return route.handler[AppDomain.app().getRoutingContext(route.name)] || route.handler.default || ''; // will pick current context handler OR default handler OR error situation
                };
                const handleRoute = async (route, verb, ctx) => {
                    // route.handler can be defined as:
                    // string: qualified type name of the handler
                    // object: { "routingContext": "handler", ...}
                    //      routingContext can be any value that represents a routing context for whatever situation 
                    //      this is read from App.getRoutingContext(routeName) - where some context string can be provided - 
                    //      basis it will pick required handler from here some examples of handlers can be:
                    //          free | freemium | full  - if some routing is to be based on license model
                    //          anything else
                    //      'default' must be defined to handle a catch-anything-else scenario 
                    //  this gives a handy way of diverting some specific routes while rest can be as is - statically defined
                    let routeHandler = chooseRouteHandler(route);
                    if (!routeHandler) { throw Exception.NotDefined(route.handler); }
                    return await runHandler(route, routeHandler, verb, ctx); // it can throw any error including 100 (to continue to next handler)
                };        
                const getHandler = (route, verb) => {
                    return function(req, res, next) { 
                        let ctx = new RestHandlerContext(req, res);
        
                        handleRoute(route, verb, ctx).then((result) => {
                            onDone(result, ctx, next);
                        }).catch((err) => {
                            onError(err, ctx, next);
                        });
                    };
                };
                const addHandler = (verb, route) => {
                    let routePath = route.path;
        
                    // modify route path to add mount params in the beginning of the path
                    if (mount.params) { // mount specific params are defined
                        let newRoutePath = mount.params;
                        if (!newRoutePath.startsWith('/')) { newRoutePath = '/' + newRoutePath; } // add first /
                        if (!newRoutePath.endsWith('/')) { newRoutePath = newRoutePath + '/'; } // add last /
                        newRoutePath += routePath; // add route path
                        routePath = newRoutePath.replace('//', '/'); // replace // with / (just in case)
                    }
            
                    mount.app[verb](routePath, getHandler(route, verb));
                };
        
                // add routes related to current mount
                for (let route of routes) {
                    // route.mount can be one string or an array of strings - in that case, same route will be mounted to multiple mounts
                    if ((typeof route.mount === 'string' && route.mount === mount.name) || (route.mount.indexOf(mount.name) !== -1)) { // add route-handler
                        let routeVerbs = [];
                        if (route.verbs && route.verbs.length !== 0) { routeVerbs.push(...route.verbs); }
                        if (routeVerbs.length === 0) { routeVerbs.push('get'); } // by default get verb is used
                        routeVerbs.forEach(verb => { // verb could be get/set/delete/put/, etc.
                            addHandler(verb, route);
                        });
                    }
                }
        
                // catch 404 for this mount and forward to error handler
                mount.app.use((req, res, next) => {
                    var err = Exception.NotFound(req.originalUrl);
                    next(err);
                });
        
                // error handler
                mount.app.use((err, req, res) => {
                    let result = new RestHandlerResult(err);
                    onDone(result, req, res);
                });
            };
        });
    })();    
    await (async () => { // type: ./src/flair.server/flair.app.bw/SessionStorage.js
        const { Bootware } = await ns('flair.app');
        
        /**
         * @name SessionStorage
         * @description Ensure availability of browser sessionStorage clone in node process
         *              the way, on browser sessionStorage is different for each tab
         *              here 'sessionStorage' property on global will be different for each node instance in a cluster
         */
        $$('sealed');
        $$('ns', 'flair.app.bw');
		Class('SessionStorage', Bootware, function() {
            $$('override');
            this.boot = async (base) => {
                base();
                
                if (!global.sessionStorage) { 
                    const NodeSessionStorage = function() {
                        let keys = {};
                        this.key = (key) => { 
                            return (keys[key] ? true : false); 
                        };
                        this.getItem = (key) => { 
                            return keys[key] || null;
                        };
                        this.setItem = (key, value) => {
                            keys[key] = value || null;
                        };
                        this.removeItem = (key) => { 
                            delete keys[key];
                        };
                        this.clear = () => { 
                            keys = {};
                        };                        
                    };
                    global.sessionStorage = new NodeSessionStorage();
                }
            };
        });
        
    })();    
    await (async () => { // type: ./src/flair.server/flair.server.mw/ResHeaders.js
        const { ServerMiddleware } = await ns('flair.app');
        
        /**
         * @name ResHeaders
         * @description Set response headers
         */
        $$('sealed');
        $$('ns', 'flair.server.mw');
		Class('ResHeaders', ServerMiddleware, function() {
            $$('override');
            this.onRun = async (base, req, res, ...args) => {
                base();
                
                // args can be defined as [ {}, {}, {} ]
                // each item is: { name: '', value:  }
                // name: standard header name
                // value: header value
                if (args && args.length > 0) {
                    for(let header of args) {
                        res.set(header.name, header.value);
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
    AppDomain.registerAdo('{"name":"flair.server","file":"./flair.server{.min}.js","package":"flairjs-fabric","desc":"Foundation for True Object Oriented JavaScript Apps","title":"Flair.js Fabric","version":"0.60.37","lupdate":"Sat, 28 Sep 2019 18:53:26 GMT","builder":{"name":"flairBuild","version":"1","format":"fasm","formatVersion":"1","contains":["init","func","type","vars","reso","asst","rout","sreg"]},"copyright":"(c) 2017-2019 Vikas Burman","license":"MIT","types":["flair.app.ServerMiddleware","flair.api.AttachmentPayload","flair.api.JSONPayload","flair.api.BinaryPayload","flair.api.RestHandlerResult","flair.api.RestHandlerContext","flair.api.RestHandler","flair.app.ServerHost","flair.app.bw.Middlewares","flair.app.bw.NodeEnv","flair.app.bw.ServerRouter","flair.app.bw.SessionStorage","flair.server.mw.ResHeaders"],"resources":[],"assets":["main.js","start.js"],"routes":[]}');
    
    // return settings and config
    return Object.freeze({
        name: 'flair.server',
        settings: settings,
        config: config
    });
});