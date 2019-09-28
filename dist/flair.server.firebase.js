/**
 * @preserve
 * Flair.js Fabric
 * Foundation for True Object Oriented JavaScript Apps
 * 
 * Assembly: flair.server.firebase
 *     File: ./flair.server.firebase.js
 *  Version: 0.60.36
 *  Sat, 28 Sep 2019 15:50:59 GMT
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
        root['flair.server.firebase'] = factory;
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
    AppDomain.loadPathOf('flair.server.firebase', __currentPath);
    
    // settings of this assembly
    let settings = JSON.parse('{"firebase":{"firebaseApps":"","serviceAccount":""}}');
    let settingsReader = Port('settingsReader');
    if (typeof settingsReader === 'function') {
        let externalSettings = settingsReader('flair.server.firebase');
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
    AppDomain.context.current().currentAssemblyBeingLoaded('./flair.server.firebase{.min}.js');
    
    // assembly closure: types (start)
        
    await (async () => { // type: ./src/flair.server.firebase/flair.app/FirebaseApp.js
        /**
         * @name FirebaseApp
         * @description Firebase specific App extensions
         */
        $$('ns', 'flair.app');
		Mixin('FirebaseApp', function() {
            const fbAdmin = require('firebase-admin');
        
            $$('private');
            this.apps = {};
        
            $$('private');
            this.fbConfig = null;
        
            let _projectId = null;
            this.projectId = {
                get: () => {
                    if (!_projectId) {
                        // get the project id from environment as:
                        //  FIREBASE_PROJECT_ID environment variable OR GCLOUD_PROJECT or FIREBASE_CONFIG.projectId or GCP_PROJECT
                        _projectId = process.env.FIREBASE_PROJECT_ID || ''; // set via flairjs env variable set approach 
                        if (!_projectId) {
                            fbAdmin.initializeApp(); // initializing blank populates the environment variables GCLOUD_PROJECT and FIREBASE_CONFIG
                            _projectId = (process.env.GCLOUD_PROJECT || JSON.parse(process.env.FIREBASE_CONFIG).projectId || process.env.GCP_PROJECT);
                        }
                    }
                    return _projectId;
                }
            };
        
            this.firebase = (appName) => {
                if (!this.apps[appName]) { // load required app now (this may throw, if error or config is missing)
                    // get the correct firebase app config for this project
                    // structure of settings.firebase.firebaseApps JSON file should be:
                    // {
                    //     "<projectId>": {
                    //          "<appName>": { ...firebase config for this app... },
                    //          ...
                    //      },
                    //      ...
                    // } 
                    if (!this.fbConfig) { this.fbConfig = require(AppDomain.resolvePath(settings.firebase.firebaseApps)); }
                    let fbAppConfig = this.fbConfig[this.projectId][appName];
        
                    // get the correct serviceAccount config for this project
                    // structure of settings.firebase.serviceAccount JSON file should be:
                    // {
                    //     "<projectId>": {
                    //          ...serviceAccount config for this project...
                    //      },
                    //      ...
                    // } 
        
                    // add credential
                    let saConfig = require(AppDomain.resolvePath(settings.firebase.serviceAccount));
                    fbAppConfig['credential'] = fbAdmin.credential.cert(saConfig[this.projectId]);
        
                    // initialize and store
                    this.apps[appName] = fbAdmin.initializeApp(fbAppConfig, appName);
                }
        
                // return
                return this.apps[appName];
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
    AppDomain.registerAdo('{"name":"flair.server.firebase","file":"./flair.server.firebase{.min}.js","package":"flairjs-fabric","desc":"Foundation for True Object Oriented JavaScript Apps","title":"Flair.js Fabric","version":"0.60.36","lupdate":"Sat, 28 Sep 2019 15:50:59 GMT","builder":{"name":"flairBuild","version":"1","format":"fasm","formatVersion":"1","contains":["init","func","type","vars","reso","asst","rout","sreg"]},"copyright":"(c) 2017-2019 Vikas Burman","license":"MIT","types":["flair.app.FirebaseApp"],"resources":[],"assets":["main.js","start.js"],"routes":[]}');
    
    // return settings and config
    return Object.freeze({
        name: 'flair.server.firebase',
        settings: settings,
        config: config
    });
});