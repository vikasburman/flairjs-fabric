/**
 * @preserve
 * Flair.js Fabric
 * Foundation for True Object Oriented JavaScript Apps
 * 
 * Assembly: flair.app
 *     File: ./flair.app.js
 *  Version: 0.60.8
 *  Tue, 24 Sep 2019 05:55:30 GMT
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
    AppDomain.loadPathOf('flair.app', __currentPath);
    
    // settings of this assembly
    let settings = JSON.parse('{"host":"flair.app.ServerHost | flair.app.ClientHost","app":"flair.app.App","boot":{"env":{"isVue":false,"isExpress":false,"isServerless":false,"isFirebase":false},"links":[],"scripts":[],"meta":[],"preambles":[],"ports":[],"bootwares":[],"assemblies":[]},"di":{"container":{}},"api":{"connections":{}}}');
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
    const onLoadComplete = (asm) => {
        // register custom attributes
        const registerCustomAttribute = (customAttrName, qualifiedTypeName) => {
            let customAttrType = asm.getType(qualifiedTypeName);
            if (customAttrType) { Container.register(customAttrName, customAttrType); }
        };
        
        registerCustomAttribute('cache', 'flair.app.attr.Cache');
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
            /**  
             * @name construct
             * @arguments
             *  name: string - name of the bootware
             *  version: string - version number of the bootware
            */
            $$('virtual');
            this.construct = (name, version, isMountSpecific) => {
                let args = Args('name: string, version: string',
                                'name: string, version: string, isMountSpecific: boolean',
                                'name: string, isMountSpecific: boolean',
                                'name: string')(name, version, isMountSpecific); args.throwOnError(this.construct);
        
                // set info
                this.info = Object.freeze({
                    name: args.values.name || '',
                    version: args.values.version || '',
                    isMountSpecific: args.values.isMountSpecific || false
                });
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
            this.info = null;
        
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
                let asm = getAssembly(this);
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
        
            this.value = () => {
                return Object.freeze({
                    isError: this.isError,
                    status: this.status,
                    message: this.message,
                    data: (this.isExtendedPayload ? this.data.data : this.data)
                });
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
    await (async () => { // type: ./src/flair.app/flair.app/BootEngine.js
        const { Bootware, IPortHandler } = await ns('flair.app');
        
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
                        isAdded = false,
                        head = window.document.getElementsByTagName('head')[0];
        
                    for(let item of list) {
                        el = document.createElement(elName);
                        isAdded = false;
                        for(let key in item) { 
                            if (item.hasOwnProperty(key)) {
                                value = item[key];
                                if (['src', 'href'].indexOf(key) !== -1) { value = which(value); }
                                isAdded = true;
                                el.setAttribute(key, value); 
                            }
                        }
                        if (isAdded) { head.appendChild(el); }
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
                const loadAssemblies = async () => {
                    // combined assemblies (inbuilt and configured)
                    // which() will pick as:
                    // envProp::mainThreadOnServer{.min}.xyz ~ envProp::workerThreadOnServer{.min}.xyz | envProp::mainThreadOnClient{.min}.xyz ~ envProp::workerThreadOnClient{.min}.xyz
                    // here definition is just the file and path name of the assembly to be loaded
                    let list = [
                        "./flair.app{.min}.js",
                        "./flair.server{.min}.js | ./flair.client{.min}.js",
                        "isExpress::./flair.server.express{.min}.js | isVue::./flair.client.vue{.min}.js",
                        "isFirebase::./flair.server.firebase{.min}.js | x"
                    ];
                    list.push(...settings.boot.assemblies);
        
                    for(let item of list) {
                        item = which(item);
                        if (item) { await AppDomain.context.loadAssembly(item); }
                    }
                };
                const loadPortHandlers = async () => {
                    let list = null,
                        phType = null,
                        ph = null;
        
                    // combined port handlers (inbuilt and configured)
                    // which() will pick as:
                    // envProp::mainThreadOnServer{.min}.xyz ~ envProp::workerThreadOnServer{.min}.xyz | envProp::mainThreadOnClient{.min}.xyz ~ envProp::workerThreadOnClient{.min}.xyz
                    // here definition is just the qualified type name which implements IPortHandler
                    // note: ports of same type will be overwritten if defined multiple times, this is beneficial too, as
                    // all inbuilt settings can be overwritten if need be 
        
                    list = [
                    ];
                    list.push(...settings.boot.ports);
        
                    for(let item of list) {
                        item = which(item);
                        if (item) {
                            phType = await include(phType);
                            ph = as(new phType(), IPortHandler);
                            if (ph) { Port.connect(ph.port, ph.factory); }
                        }
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
                        "flair.boot.NodeEnv ~ x | x",
                        "isExpress::flair.boot.Middlewares ~ x | x",
                        "flair.boot.ResHeaders ~ x | x",
                        "flair.boot.DIContainer",
                        "x | isVue::flair.boot.VueSetup ~ x",
                        "flair.boot.ServerRouter ~ x | flair.boot.ClientRouter | x"
                    ];
                    list.push(...settings.boot.bootwares);
        
                    for(let item of list) {
                        item = which(item);
                        if (item) {
                            bwType = as(await include(item), Bootware);
                            if (bwType) {
                                bw = new bwType(); 
                                allBootwares.push(bw); // push in array, so boot and ready would be called for them
                                if (bw.info.isMountSpecific) { // if bootware is mount specific bootware - means can run once for each mount
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
                            if (!bw.info.isMountSpecific) {
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
                await loadAssemblies();
                await loadPortHandlers();
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
    await (async () => { // type: ./src/flair.app/flair.app/IPortHandler.js
        /**
         * @name IPortHandler
         * @description IPortHandler interface
         */
        $$('ns', 'flair.app');
		Interface('IPortHandler', function() {
            this.port = nip;
            this.factory = nim;
        });
        
    })();    
    await (async () => { // type: ./src/flair.app/flair.app.attr/Cache.js
        const { Attribute } = await ns();
        
        /**
         * @name Cache
         * @description Caching custom attribute
         * $$('cache', { 'duration': 10000 }) OR $$('cache', 10000)
         */
        $$('ns', 'flair.app.attr');
		Class('Cache', Attribute, function() {
            $$('override');
            this.construct = (base, cacheConfig) => {
                base(cacheConfig);
        
                // config
                this.cacheConfig = (typeof cacheConfig === 'number' ? { duration: cacheConfig } : cacheConfig)
                this.enabled = (this.cacheConfig && this.cacheConfig.duration);
                this.cacheHandler = Port('cacheHandler');
        
                // constraints
                this.constraints = '(class || struct) && (func && async) && !(timer || on || @fetch || @cache)';
            };
        
            $$('readonly');
            this.cacheConfig = null;
        
            $$('private');
            this.cacheHandler = null;
        
            $$('private');
            this.enabled = false;
        
            $$('override');
            this.decorateFunction = (base, typeName, memberName, member) => { // eslint-disable-line no-unused-vars
                let _this = this,
                    cacheId = `${typeName}___${memberName}`;
        
                let callMember = async (...args) => {
                    let resultData = await member(...args);
                    if (_this.enabled) { // save for later
                        await _this.cacheHandler.set(cacheId, _this.cacheConfig, resultData);
                    }
                    return resultData;
                };
        
                // decorated function
                return async function(...args) {
                    if (_this.enabled) {
                        try {
                            return await _this.cacheHandler.get(cacheId, _this.cacheConfig);
                        } catch (err) { // eslint-disable-line no-unused-vars
                            // ignore and move forward by calling callMember below
                        }
                    }
                    return await callMember(...args);
                };
            };
        });
        
    })();    
    await (async () => { // type: ./src/flair.app/flair.boot/DIContainer.js
        const { Bootware } = await ns('flair.app');
        
        /**
         * @name DIContainer
         * @description Initialize DI Container
         */
        $$('sealed');
        $$('ns', 'flair.boot');
		Class('DIContainer', Bootware, function() {
            $$('override');
            this.construct = (base) => {
                base('DI Container');
            };
        
            $$('override');
            this.boot = async (base) => {
                base();
                
                let containerItems = settings.di.container;
                for(let alias in containerItems) {
                    if (containerItems.hasOwnProperty(alias)) {
                        Container.register(alias, containerItems[alias]);
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
    AppDomain.registerAdo('{"name":"flair.app","file":"./flair.app{.min}.js","package":"flairjs-fabric","desc":"Foundation for True Object Oriented JavaScript Apps","title":"Flair.js Fabric","version":"0.60.8","lupdate":"Tue, 24 Sep 2019 05:55:30 GMT","builder":{"name":"flairBuild","version":"1","format":"fasm","formatVersion":"1","contains":["init","func","type","vars","reso","asst","rout","sreg"]},"copyright":"(c) 2017-2019 Vikas Burman","license":"MIT","types":["flair.app.Bootware","flair.app.HandlerContext","flair.app.Payload","flair.app.Handler","flair.app.App","flair.app.HandlerResult","flair.app.Host","flair.app.BootEngine","flair.app.IPortHandler","flair.app.attr.Cache","flair.boot.DIContainer"],"resources":[],"assets":[],"routes":[]}');
    
    // return settings and config
    return Object.freeze({
        name: 'flair.app',
        settings: settings,
        config: config
    });
});