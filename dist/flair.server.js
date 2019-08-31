/**
 * @preserve
 * Flair.js Fabric
 * Foundation for True Object Oriented JavaScript Apps
 * 
 * Assembly: flair.server
 *     File: ./flair.server.js
 *  Version: 0.55.78
 *  Sat, 31 Aug 2019 02:23:18 GMT
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

    // assembly closure init (start)
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
    
    // inbuilt modifiers and attributes compile-time-safe support
    const { $$static, $$abstract, $$virtual, $$override, $$sealed, $$private, $$privateSet, $$protected, $$protectedSet, $$readonly, $$async,
            $$overload, $$enumerate, $$dispose, $$post, $$on, $$timer, $$type, $$args, $$inject, $$resource, $$asset, $$singleton, $$serialize,
            $$deprecate, $$session, $$state, $$conditional, $$noserialize, $$ns } = $$;
    
    // access to DOC
    const DOC = ((env.isServer || env.isWorker) ? null : window.document);
    
    // current for this assembly
    const __currentContextName = AppDomain.context.current().name;
    const __currentFile = __asmFile;
    const __currentPath = __currentFile.substr(0, __currentFile.lastIndexOf('/') + 1);
    AppDomain.loadPathOf('flair.server', __currentPath);
    
    // settings of this assembly
    let settings = JSON.parse('{"envVars":{"vars":[],"options":{"overwrite":true}}}');
    let settingsReader = flair.Port('settingsReader');
    if (typeof settingsReader === 'function') {
        let externalSettings = settingsReader('flair.server');
        if (externalSettings) { settings = deepMerge([settings, externalSettings], false); }
    }
    settings = Object.freeze(settings);
    
    // config of this assembly
    let config = JSON.parse('{}');
    config = Object.freeze(config);
    
    /* eslint-enable no-unused-vars */
    // assembly closure init (end)
    
    // assembly global functions (start)
    // (not defined)
    // assembly global functions (end)
    
    // set assembly being loaded
    AppDomain.context.current().currentAssemblyBeingLoaded('./flair.server{.min}.js');
    
    // assembly types (start)
        
    await (async () => { // type: ./src/flair.server/flair.api/@1-RestHandler.js
        const Handler = await include('flair.app.Handler');
        
        /**
         * @name RestHandler
         * @description Restful API Handler
         */
        $$('ns', 'flair.api');
        Class('RestHandler', Handler, function() {
            $$('private');
            this.run = async (fn, req, res) => {
                let result = null;
                if (fn !== noop) {
                    try {
                        result = await fn(req, res);
                    } catch (err) {
                        res.status(err.status || 500).json({status: err.status, message: err.message})
                    }
                } else {
                    res.status(501).json({status: '501', message: 'Not Implemented'});
                }
                return result;
            };
        
            this.get = async (req, res) => { return await this.run(this.onGet, req, res); };
            this.post = async (req, res) => { return await this.run(this.onPost, req, res); };
            this.put = async (req, res) => { return await this.run(this.onPut, req, res); };
            this.patch = async (req, res) => { return await this.run(this.onPatch, req, res); };
            this.delete = async (req, res) => { return await this.run(this.onDelete, req, res); };
        
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
        });
        
    })();    
    await (async () => { // type: ./src/flair.server/flair.api/RESTEndPoint.js
        const { RestHandler } = ns('flair.api');
        
        /**
         * @name RESTEndPoint
         * @description RESTful Service Endpoint
         */
        $$('ns', 'flair.api');
        Class('RESTEndPoint', RestHandler, function() {
            // nothing specific as of now    
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
        const Bootware = await include('flair.app.Bootware');
        
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
    // assembly types (end)
    
    // assembly embedded resources (start)
    // (not defined)
    // assembly embedded resources (end)        
    
    // clear assembly being loaded
    AppDomain.context.current().currentAssemblyBeingLoaded('');
    
    // register assembly definition object
    AppDomain.registerAdo('{"name":"flair.server","file":"./flair.server{.min}.js","package":"flairjs-fabric","desc":"Foundation for True Object Oriented JavaScript Apps","title":"Flair.js Fabric","version":"0.55.78","lupdate":"Sat, 31 Aug 2019 02:23:18 GMT","builder":{"name":"flairBuild","version":"1","format":"fasm","formatVersion":"1","contains":["init","func","type","vars","reso","asst","rout","sreg"]},"copyright":"(c) 2017-2019 Vikas Burman","license":"MIT","types":["flair.api.RestHandler","flair.api.RESTEndPoint","flair.api.RestInterceptor","flair.boot.NodeEnv"],"resources":[],"assets":[],"routes":[]}');
    
    // assembly load complete
    if (typeof onLoadComplete === 'function') { 
        onLoadComplete();   // eslint-disable-line no-undef
    }
    
    // return settings and config
    return Object.freeze({
        name: 'flair.server',
        settings: settings,
        config: config
    });
});