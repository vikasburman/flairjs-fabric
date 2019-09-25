/**
 * @preserve
 * Flair.js Fabric
 * Foundation for True Object Oriented JavaScript Apps
 * 
 * Assembly: flair.server.express
 *     File: ./flair.server.express.js
 *  Version: 0.60.21
 *  Wed, 25 Sep 2019 01:50:34 GMT
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
        root['flair.server.express'] = factory;
    }
})(this, async function(flair, __asmFile) {
    'use strict';

    // assembly closure: init (start)
    /* eslint-disable no-unused-vars */
    
    // flair types, variables and functions
    const { Class, Struct, Enum, Interface, Mixin, Aspects, AppDomain, $$, attr, InjectedArg, bring, Container, include, Port, on, post, telemetry,
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
    AppDomain.loadPathOf('flair.server.express', __currentPath);
    
    // settings of this assembly
    let settings = JSON.parse('{"express":{"server-http":{"enable":false,"port":80,"timeout":-1},"server-https":{"enable":false,"port":443,"timeout":-1,"privateKey":"","publicCert":""}},"routing":{"mounts":{"main":"/"},"all":{"before":{"settings":[],"middlewares":[],"interceptors":[],"resHeaders":[]},"after":{"settings":[],"middlewares":[],"interceptors":[],"resHeaders":[]}}}}');
    let settingsReader = Port('settingsReader');
    if (typeof settingsReader === 'function') {
        let externalSettings = settingsReader('flair.server.express');
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
    AppDomain.context.current().currentAssemblyBeingLoaded('./flair.server.express{.min}.js');
    
    // assembly closure: types (start)
        
    await (async () => { // type: ./src/flair.server.express/flair.app/ServerHost.js
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
    await (async () => { // type: ./src/flair.server.express/flair.boot/Middlewares.js
        const { Bootware } = await ns('flair.app');
        
        /**
         * @name Middlewares
         * @description Express Middleware Configurator
         */
        $$('sealed');
        $$('ns', 'flair.boot');
		Class('Middlewares', Bootware, function() {
            $$('override');
            this.construct = (base) => {
                base('Express Middlewares', true); // mount specific
            };
        
            $$('override');
            this.boot = async (base, mount) => {
                base();
                
                // middleware information is defined at: https://expressjs.com/en/guide/using-middleware.html#middleware.application
                // each item is: { name: '', func: '', 'args': []  }
                // name: module name of the middleware, which can be required
                // func: if middleware has a function that needs to be called for configuration, empty if required object itself is a function
                // args: an array of args that need to be passed to this function or middleware function
                //       Note: In case a particular argument setting is a function - define the function code as an arrow function string with a 'return prefix' and it will be loaded as function
                //       E.g., setHeaders in https://expressjs.com/en/4x/api.html#express.static is a function
                //       define it as: "return (res, path, stat) => { res.set('x-timestamp', Date.now()) }"
                //       this string will be passed to new Function(...) and returned values will be used as value of option
                //       all object type arguments will be scanned for string values that start with 'return ' and will be tried to convert into a function
                let middlewares = this.getMountSpecificSettings('middlewares', settings.routing, mount.name, 'name');
                if (middlewares && middlewares.length > 0) {
                    let mod = null,
                        func = null;
                    for(let middleware of middlewares) {
                        if (middleware.name) {
                            try {
                                // get module
                                // it could be 'express' itself for inbuilt middlewares
                                mod = require(middleware.name);
        
                                // get func
                                if (middleware.func) {
                                    func = mod[middleware.func];
                                } else {
                                    func = mod;
                                }
        
                                // process args
                                let args = [],
                                    argValue = null;
                                middleware.args = middleware.args || [];
                                for (let arg of middleware.args) {
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
                                    args.push(argValue);
                                }
        
                                // add middleware
                                mount.app.use(func(...args));
                            } catch (err) {
                                throw Exception.OperationFailed(`Middleware ${middleware.module} load failed.`, err, this.boot);
                            }
                        }
                    }
                }
            };
        });
        
    })();    
    await (async () => { // type: ./src/flair.server.express/flair.boot/ResHeaders.js
        const { Bootware } = await ns('flair.app');
        
        /**
         * @name ResHeaders
         * @description Express Response Header Settings (Common to all routes)
         */
        $$('sealed');
        $$('ns', 'flair.boot');
		Class('ResHeaders', Bootware, function() {
            $$('override');
            this.construct = (base) => {
                base('Server Response Headers', true); // mount specific
            };
        
            $$('override');
            this.boot = async (base, mount) => {
                base();
                
                let resHeaders = this.getMountSpecificSettings('resHeaders', settings.routing, mount.name, 'name');
                if (resHeaders && resHeaders.length > 0) {
                    mount.app.use((req, res, next) => {
                        // each item is: { name: '', value:  }
                        // name: standard header name
                        // value: header value
                        for(let header of resHeaders) {
                            res.set(header.name, header.value);
                        }
                        next();
                    });         
                }
            };
        });
        
    })();    
    await (async () => { // type: ./src/flair.server.express/flair.boot/ServerRouter.js
        const { Bootware, Payload } = await ns('flair.app');
        const { RestInterceptor, RestHandler, RestHandlerResult, RestHandlerContext, AttachmentPayload, BinaryPayload, JSONPayload } = await ns('flair.api');
        
        /**
         * @name ServerRouter
         * @description Server Router Configuration Setup
         */
        $$('sealed');
        $$('ns', 'flair.boot');
		Class('ServerRouter', Bootware, function() {
            let routes = null;
            
            $$('override');
            this.construct = (base) => {
                base('Server Router', true); // mount specific 
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
        
                const onDone = (result, ctx) => {
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
                                res.status(result.status).jsonp(result.value()).end();    
                            }
                        }
                        if (result.isError || !isCompleted) { // error or normal payload or plain but extended payload cases 
                            if (ctx.isAjaxReq) {
                                res.status(result.status).json(result.value()).end(); 
                            } else {
                                res.status(result.status).send(result.value()).end();
                            }
                        }
                    }
                };
                const runInterceptors = async (req, res) => {
                    // run mount specific interceptors
                    // each interceptor is derived from RestInterceptor and
                    // run method of it takes req, can update it, also takes res method and can generate response, in case request is being stopped
                    // each item is: "InterceptorTypeQualifiedName"
                    let mountInterceptors = this.getMountSpecificSettings('interceptors', settings.routing, mount.name);
                    for (let ic of mountInterceptors) {
                        let ICType = as(await include(ic), RestInterceptor);
                        if (!ICType) { throw Exception.InvalidDefinition(`Invalid interceptor type. (${ic})`); }
                        await new ICType().run(req, res); // it can throw error that will be passed in response and response cycle will stop here
                    }
                };
                const runHandler = async (route, routeHandler, verb, ctx) => {
                    let RouteHandler = as(await include(routeHandler), RestHandler);
                    if (RouteHandler) {
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
                const getHandler = (route, verb) => {
                    return (req, res, next) => { 
                        let ctx = new RestHandlerContext(req, res);
        
                        const onError = (err) => {
                            let result = new RestHandlerResult(err);
                            if (result.status === 100) { // continue
                                next(); // continue to next
                            } else {
                                onDone(result, ctx);
                            }
                        };
                        const handleRoute = async () => {
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
                            if (!routeHandler) { throw Exception.NotDefined(route); }
                            return await runHandler(route, routeHandler, verb, ctx); // it can throw any error including 100 (to continue to next handler)
                        };
        
                        // run interceptors
                        runInterceptors(req, res).then(() => {
                            handleRoute().then((result) => {
                                onDone(result, ctx);
                            }).catch(onError);
                        }).catch(onError);
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
                    // note: 404 handler does not run interceptors
                    let result = new RestHandlerResult(err);
                    onDone(result, req, res);
                });
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
    AppDomain.registerAdo('{"name":"flair.server.express","file":"./flair.server.express{.min}.js","package":"flairjs-fabric","desc":"Foundation for True Object Oriented JavaScript Apps","title":"Flair.js Fabric","version":"0.60.21","lupdate":"Wed, 25 Sep 2019 01:50:34 GMT","builder":{"name":"flairBuild","version":"1","format":"fasm","formatVersion":"1","contains":["init","func","type","vars","reso","asst","rout","sreg"]},"copyright":"(c) 2017-2019 Vikas Burman","license":"MIT","types":["flair.app.ServerHost","flair.boot.Middlewares","flair.boot.ResHeaders","flair.boot.ServerRouter"],"resources":[],"assets":[],"routes":[]}');
    
    // return settings and config
    return Object.freeze({
        name: 'flair.server.express',
        settings: settings,
        config: config
    });
});