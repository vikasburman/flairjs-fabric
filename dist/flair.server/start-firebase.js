/**
 * start-firebase
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
        root['flair_server_start'] = factory;
    }
})(this, function(entryPoint, callback) {
    'use strict';
    
    const flair = require('flairjs');
    const admin = require('firebase-admin');
    const functions = require('firebase-functions');
    const firebaseConfig = require('./firebaseConfig.json');
    const functionsConfig = require('./functionsConfig.json');
    const serviceAccount = require('./private/serviceAccountKey.json');
    
    // define credentials, if serviceAccount is configured
    if (typeof serviceAccount.project_id !== 'undefined') {
        firebaseConfig.credential = admin.credential.cert(serviceAccount);
    }
    
    // initialize firebase app
    admin.initializeApp(firebaseConfig);
    
    // define functions
    let defined = {};
    const initializeFlairAppMode = async () => {
        if (!flair.env.isAppMode()) {
            let app = await flair(entryPoint);
            console.log('*'); 
        }
        if (typeof callback === 'function') { callback(flair, app); }
    };
    
    const executeHandler = async (handlerType, handlerMethod, args) => {
        try {
            let TheClass = await flair.include(handlerType),
                theObject = new TheClass();
            return theObject[handlerMethod].apply(theObject, args);
        } catch (err) {
            return new functions.https.HttpsError('failed', err.message);
        }
    };

    const httpFunction = (f) => { // http 
        const handler = async (req, res) => {
            await initializeFlairAppMode();
            return await flair.AppDomain.host().app(req, res); // express app takes it from here
        };

        if (f.config && f.config.region && f.config.runtimeOpts) {
            exports[f.name] = functions.region(f.config.region).runWith(f.config.runtimeOpts).https.onRequest(handler);
        } else if (f.config && f.config.region) {
            exports[f.name] = functions.region(f.config.region).https.onRequest(handler);
        } else if (f.config && f.config.runtimeOpts) {
            exports[f.name] = functions.runWith(f.config.runtimeOpts).https.onRequest(handler);
        } else {
            exports[f.name] = functions.https.onRequest(handler);
        }
        defined[f.name] = true;
    };
    const directFunction = (f) => { // callable
        const handler = async (...args) => {
            await initializeFlairAppMode();
            return await executeHandler(f.handler, 'onCall', args);
        };

        exports[f.name] = functions.https.onCall(handler);
        defined[f.name] = true;
    };
    const cronFunction = (f) => { // scheduled 
        const handler = async (...args) => {
            await initializeFlairAppMode();
            return await executeHandler(f.handler, 'onRun', args);
        };

        if (f.config && f.config.timeZone) {
            exports[f.name] = functions.pubsub.schedule(f.config.when).timeZone(f.config.timeZone).onRun(handler);
        } else {
            exports[f.name] = functions.pubsub.schedule(f.config.when).onRun(handler);
        }
        defined[f.name] = true;
    };
    const triggerFunction = (f) => { // trigger
        const handler = async (...args) => {
            await initializeFlairAppMode();
            return await executeHandler(f.handler, f.trigger, args);
        };

        defined[f.name] = true;
        switch(f.source) {
            case 'firestore': // f.trigger --> onCreate, onUpdate, onDelete, onWrite
                exports[f.name] = functions.firestore.document(f.config.document)[f.trigger](handler); 
                break;
            case 'database': // f.trigger --> onCreate, onUpdate, onDelete, onWrite
                if (f.config.instance && f.config.ref) {
                    exports[f.name] = functions.database.instance(f.config.instance).ref(f.config.ref)[f.trigger](handler);
                } else {
                    exports[f.name] = functions.database.ref(f.config.ref)[f.trigger](handler);
                }
                break;
            case 'storage': // f.trigger --> onFinalize, onDelete, onArchive, onMetadataUpdate
                if (f.config.bucket) {
                    exports[f.name] = functions.storage.bucket(f.config.bucket).object()[f.trigger](handler);
                } else {
                    exports[f.name] = functions.storage.object()[f.trigger](handler);
                }
                break;
            case 'pubsub': // f.trigger --> onPublish
                exports[f.name] = functions.pubsub.topic(f.config.topic)[f.trigger](handler);
                break;
            case 'auth': // f.trigger --> onCreate, onDelete
                exports[f.name] = functions.auth.user()[f.trigger](handler);
                break;
            case 'ga': // f.trigger --> onLog
                exports[f.name] = functions.analytics.event(f.config.event)[f.trigger](handler);
                break;
            case 'crash': // f.trigger --> onNew, onRegressed, onVelocityAlert
                exports[f.name] = functions.crashlytics.issue()[f.trigger](handler);
                break;
            default: // could not be defined
                delete defined[f.name];
                break;
        }
    };
    
    for(let f of functionsConfig.functions) {
        if (f.enabled && f.type && f.name && !defined[f.name]) {
            switch(f.type) {
                case 'http': httpFunction(f); break;
                case 'direct': directFunction(f); break;
                case 'cron': cronFunction(f); break;
                case 'trigger': triggerFunction(f); break;
            }
        }
    }
});
