/**
 * @preserve
 * Flair.js Fabric
 * Foundation for True Object Oriented JavaScript Apps
 * 
 * Assembly: flair.app
 *     File: ./flair.app.js
 *  Version: 0.9.27
 *  Tue, 06 Aug 2019 22:49:16 GMT
 * 
 * (c) 2017-2019 Vikas Burman
 * MIT
 */
(function(root, factory) {
    'use strict';

    if (typeof define === 'function' && define.amd) { // AMD support
        define(factory);
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

    // assembly closure init (start)
    /* eslint-disable no-unused-vars */
    
    // flair types, variables and functions
    const { Class, Struct, Enum, Interface, Mixin, Aspects, AppDomain, $$, attr, bring, Container, include, Port, on, post, telemetry,
            Reflector, Serializer, Tasks, as, is, isDefined, isComplies, isDerivedFrom, isAbstract, isSealed, isStatic, isSingleton, isDeprecated,
            isImplements, isInstanceOf, isMixed, getAssembly, getAttr, getContext, getResource, getRoute, getType, ns, getTypeOf,
            getTypeName, typeOf, dispose, using, Args, Exception, noop, nip, nim, nie, event } = flair;
    const { TaskInfo } = flair.Tasks;
    const { env } = flair.options;
    const { guid, forEachAsync, replaceAll, splitAndTrim, findIndexByProp, findItemByProp, which, isArrowFunc, isASyncFunc, sieve,
            deepMerge, getLoadedScript, b64EncodeUnicode, b64DecodeUnicode } = flair.utils;
    
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
    AppDomain.loadPathOf('flair.app', __currentPath);
    
    // settings of this assembly
    let settings = JSON.parse('{"host":"flair.app.ServerHost | flair.app.ClientHost","app":"flair.app.App","boot":{"files":[],"preambles":[],"bootwares":[]},"di":{"container":{}}}');
    let settingsReader = flair.Port('settingsReader');
    if (typeof settingsReader === 'function') {
        let externalSettings = settingsReader('flair.app');
        if (externalSettings) { settings = deepMerge([settings, externalSettings], false); }
    }
    settings = Object.freeze(settings);
    
    // config of this assembly
    let config = JSON.parse('{}');
    config = Object.freeze(config);
    
    /* eslint-enable no-unused-vars */
    // assembly closure init (end)
    
    // assembly global functions (start)
    // global handler
    let onLoadComplete = () => {
    }; 
    // assembly global functions (end)
    
    // set assembly being loaded
    AppDomain.context.current().currentAssemblyBeingLoaded('./flair.app{.min}.js');
    
    // assembly types (start)
        
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
        });
        
    })();    
    await (async () => { // type: ./src/flair.app/flair.app/@1-Handler.js
        
        const { IDisposable } = ns();
        
        /**
         * @name Handler
         * @description Handler base class
         */
        $$('ns', 'flair.app');
        Class('Handler', [IDisposable], function() {
            $$('virtual');
            this.construct = () => {
            };
        
            $$('virtual');
            this.dispose = () => {
            };
        });
        
    })();    
    await (async () => { // type: ./src/flair.app/flair.app/@2-App.js
        const { IDisposable } = ns();
        const { Bootware } = ns('flair.app');
        
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
                    const { ViewState } = ns('flair.ui');
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
                    const { ViewState } = ns('flair.ui');
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
        
            $$('override');
            this.dispose = (base) => {
                base();
                AppDomain.host().error.remove(this.handleError); // remove error handler
            };
        });
        
    })();    
    await (async () => { // type: ./src/flair.app/flair.app/@2-Host.js
        const { IDisposable } = ns();
        const { Bootware } = ns('flair.app');
        
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
        const { Bootware } = ns('flair.app');
        
        /**
         * @name BootEngine
         * @description Bootstrapper functionality
         */
        $$('static');
        $$('ns', 'flair.app');
        Class('BootEngine', function() {
            this.start = async function () {
                let allBootwares = [],
                    mountSpecificBootwares = [];
                const loadFiles = async () => {
                    // load scripts
                    for(let item of settings.boot.files) {
                        // get simple script file
                        item = which(item); // server/client specific version
                        if (item) { // in case no item is set for either server/client
                            await include(item); // script file will be loaded as is
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
                            item += 'preamble.js';
        
                            // this loads it as a function which is called here
                            preambleLoader = await include(item);
                            await preambleLoader(flair);
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
                  
                await loadFiles();
                await loadPreambles();
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
    await (async () => { // type: ./src/flair.app/flair.boot/DIContainer.js
        const { Bootware } = ns('flair.app');
        
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
    // assembly types (end)
    
    // assembly embedded resources (start)
    // (not defined)
    // assembly embedded resources (end)        
    
    // clear assembly being loaded
    AppDomain.context.current().currentAssemblyBeingLoaded('');
    
    // register assembly definition object
    AppDomain.registerAdo('{"name":"flair.app","file":"./flair.app{.min}.js","package":"flairjs-fabric","desc":"Foundation for True Object Oriented JavaScript Apps","title":"Flair.js Fabric","version":"0.9.27","lupdate":"Tue, 06 Aug 2019 22:49:16 GMT","builder":{"name":"flairBuild","version":"1","format":"fasm","formatVersion":"1","contains":["init","func","type","vars","reso","asst","rout","sreg"]},"copyright":"(c) 2017-2019 Vikas Burman","license":"MIT","types":["flair.app.Bootware","flair.app.Handler","flair.app.App","flair.app.Host","flair.app.BootEngine","flair.boot.DIContainer"],"resources":[],"assets":[],"routes":[]}');
    
    // assembly load complete
    if (typeof onLoadComplete === 'function') { 
        onLoadComplete();   // eslint-disable-line no-undef
    }
    
    // return settings and config
    return Object.freeze({
        name: 'flair.app',
        settings: settings,
        config: config
    });
});