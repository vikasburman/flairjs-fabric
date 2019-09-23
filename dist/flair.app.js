/**
 * @preserve
 * Flair.js Fabric
 * Foundation for True Object Oriented JavaScript Apps
 * 
 * Assembly: flair.app
 *     File: ./flair.app.js
 *  Version: 0.60.4
 *  Mon, 23 Sep 2019 23:36:07 GMT
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
    let settings = JSON.parse('{"host":"flair.app.ServerHost | flair.app.ClientHost","app":"flair.app.App","boot":{"env":{"isVue":false,"isExpress":false,"isServerless":false,"isFirebase":false},"links":[],"scripts":[],"meta":[],"preambles":[],"ports":{},"bootwares":[],"coreAssemblies":["./flair.app.js","isServer: ./flair.server.js","isClient: ./flair.client.js","isVue: ./flair.client.vue.js","isExpress: ./flair.server.express.js","isFirebase: ./flair.server.firebase.js"],"assemblies":[]},"di":{"container":{}}}');
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
                const loadScripts = async () => { // scripts loading is supported only on client ui environment
                    if (env.isClient && !env.isWorker) {
                        // add scripts one by one, they will end loading at different times
                        // but since these are added, DOMReady will eventually ensure everything is loaded
                        // before moving ahead
                        let headTag = window.document.getElementsByTagName("head")[0];
                        for(let item of settings.boot.scripts) {
                            let script = document.createElement("script");
                            for(let key in item) { // item should have same attributes that are required for script tag
                                if (key === 'src') {
                                    script[key] = which(item[key]);
                                } else {
                                    script[key] = item[key];
                                }
                            }
                            headTag.appendChild(script);
                        }
                    }
                };
                const loadLinks = async () => { // links loading is supported only on client ui environment
                    if (env.isClient && !env.isWorker) {
                        // add links one by one, they will end loading at different times
                        // but since these are added, DOMReady will eventually ensure everything is loaded
                        // before moving ahead
                        let headTag = window.document.getElementsByTagName("head")[0];
                        for(let item of settings.boot.links) {
                            let link = document.createElement("link");
                            for(let key in item) { // item should have same attributes that are required for link tag
                                if (key === 'href') {
                                    link[key] = which(item[key]);
                                } else {
                                    link[key] = item[key];
                                }                        
                            }
                            headTag.appendChild(link);
                        }
                    }
                };   
                const loadMeta = async () => {
                    if (env.isClient && !env.isWorker) {
                        // add meta one by one,
                        let headTag = window.document.getElementsByTagName("head")[0];
                        for(let item of settings.boot.meta) {
                            let meta = document.createElement("meta");
                            for(let key in item) { // item should have same attributes that are required for meta tag
                                meta[key] = item[key];
                            }
                            headTag.appendChild(meta);
                        }
                    }
                };              
                const loadPreambles = async () => {
                    // load preambles
                    let preambleLoader = null;
                    for(let item of settings.boot.preambles) {
                        // get simple script file
                        item = which(item); // server/client specific version (although this will not be the case, generally)
                        if (item) { // in case no item is set for either server/client
                            // suffix preamble.js
                            if (!item.endsWith('/')) { item += '/'; }
                            item += 'preamble{.min}.js'; // as bundled preambles can be minified too
        
                            // this loads it as a function which is called here
                            preambleLoader = await include(item);
                            await preambleLoader(flair);
                        }
                    }
                };
                const loadAssemblies = async () => {
                    const loadAssembly = async (item) => {
                        // item can be:
                        //      "path/fileName.js"
                        //      "path/fileName.js | path/fileName.js" <-- server/client
                        //      "envProp: path/fileName.js"
                        //      "envProp: path/fileName.js | envProp: path/fileName.js" <-- server/client
                        item = which(item); // server/client specific version (although this will not be the case, generally)
                        if (item.indexOf(':') !== -1) {
                            let items = item.split(':'),
                                envProp = items[0].trim();
                            item = items[1].trim();
                            if (env[envProp] || env.x()[envProp]) { // if envProp is defined either at root env or at extended env, and true
                                await AppDomain.context.loadAssembly(item);
                            }
                        } else { // no condition
                            await AppDomain.context.loadAssembly(item);
                        }
                    };
        
                    // load core assemblies first
                    for(let item of settings.boot.coreAssemblies) { 
                        await loadAssembly(item);
                    }
        
                    // load other defined assemblies
                    for(let item of settings.boot.assemblies) { 
                        await loadAssembly(item);
                    }
                };
                const loadPortHandlers = async () => {
                    // load custom port-handlers
                    let portHandler = null,
                        portHandlerType = '';
                    for(let item in settings.boot.ports) {
                        // get port handler (qualified type-nane of a type that complies to IPortHandler (having .factory function))
                        portHandlerType = which(settings.boot.ports[item]); // server/client specific version (although this will not be the case, generally)
                        if (portHandlerType) { // in case no item is set for either server/client
                            portHandler = new (await include(portHandlerType))(); 
                            Port.connect(item, portHandler.factory);
                        }
                    }
                };
                const loadBootwares = async () => {
                    // load bootwares
                    let Item = null,
                        Bw = null,
                        bw = null;
                    for(let item of settings.boot.bootwares) {
                        // get bootware
                        item = which(item); // server/client specific version
                        if (item) { // in case no item is set for either server/client
                            Item = await include(item);
                            if (Item && typeof Item !== 'boolean') {
                                Bw = as(Item, Bootware);
                                if (Bw) { // if boot
                                    bw = new Bw(); 
                                    allBootwares.push(bw); // push in array, so boot and ready would be called for them
                                    if (bw.info.isMountSpecific) { // if bootware is mount specific bootware - means can run once for each mount
                                        mountSpecificBootwares.push(bw);
                                    }
                                } // else ignore, this was something else, like a module which was just loaded, for no reason (either by mistake or to take advantage of this load cycle)
                            } // else ignore, as it could just be a file loaded which does not return anything, for no reason (either by mistake or to take advantage of this load cycle)
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
    AppDomain.registerAdo('{"name":"flair.app","file":"./flair.app{.min}.js","package":"flairjs-fabric","desc":"Foundation for True Object Oriented JavaScript Apps","title":"Flair.js Fabric","version":"0.60.4","lupdate":"Mon, 23 Sep 2019 23:36:07 GMT","builder":{"name":"flairBuild","version":"1","format":"fasm","formatVersion":"1","contains":["init","func","type","vars","reso","asst","rout","sreg"]},"copyright":"(c) 2017-2019 Vikas Burman","license":"MIT","types":["flair.app.Bootware","flair.app.HandlerContext","flair.app.Payload","flair.app.Handler","flair.app.App","flair.app.HandlerResult","flair.app.Host","flair.app.BootEngine","flair.app.IPortHandler","flair.app.attr.Cache","flair.boot.DIContainer"],"resources":[],"assets":[],"routes":[]}');
    
    // return settings and config
    return Object.freeze({
        name: 'flair.app',
        settings: settings,
        config: config
    });
});