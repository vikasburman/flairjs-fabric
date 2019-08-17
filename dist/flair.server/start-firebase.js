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
})(this, function(rootDir, entryPoint, callback) {
    'use strict';
    
    const flair = require('flairjs');
    const functions = require('firebase-functions');
    const functionsConfig = require(rootDir + '/functionsConfig.json');

    // define functions
    let _functions = {},
        defined = {};
    const initializeFlairAppMode = async () => {
        if (!flair.env.isAppMode()) {
            let app = await flair(entryPoint);
            console.log('*'); 
            if (typeof callback === 'function') { callback(flair, app); }
        }
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
    const moveToGroup = (f) => {
        // move to group, if configured
        if (_functions[f.name]) {
            if (f.groups) {
                for(let gName of f.groups) {
                    _functions[gName] = _functions[gName] || {};
                    _functions[gName][f.name] = _functions[f.name];
                }
                delete _functions[f.name];
            } else if (f.group) {
                _functions[f.group] = _functions[f.group] || {};
                _functions[f.group][f.name] = _functions[f.name];
                delete _functions[f.name];
            }
        }
    };
    const httpFunction = (f) => { // http 
        const handler = async (req, res) => {
            await initializeFlairAppMode();
            return await flair.AppDomain.host().app(req, res); // express app takes it from here
        };

        if (f.config && f.config.region && f.config.runtimeOpts) {
            _functions[f.name] = functions.region(f.config.region).runWith(f.config.runtimeOpts).https.onRequest(handler);
        } else if (f.config && f.config.region) {
            _functions[f.name] = functions.region(f.config.region).https.onRequest(handler);
        } else if (f.config && f.config.runtimeOpts) {
            _functions[f.name] = functions.runWith(f.config.runtimeOpts).https.onRequest(handler);
        } else {
            _functions[f.name] = functions.https.onRequest(handler);
        }

        moveToGroup(f);
        defined[f.name] = true;
    };
    const directFunction = (f) => { // callable
        const handler = async (...args) => {
            await initializeFlairAppMode();
            return await executeHandler(f.handler, 'onCall', args);
        };

        _functions[f.name] = functions.https.onCall(handler);

        moveToGroup(f);        
        defined[f.name] = true;
    };
    const cronFunction = (f) => { // scheduled 
        const handler = async (...args) => {
            await initializeFlairAppMode();
            return await executeHandler(f.handler, 'onRun', args);
        };

        if (f.config && f.config.timeZone) {
            _functions[f.name] = functions.pubsub.schedule(f.config.when).timeZone(f.config.timeZone).onRun(handler);
        } else {
            _functions[f.name] = functions.pubsub.schedule(f.config.when).onRun(handler);
        }

        moveToGroup(f);        
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
                _functions[f.name] = functions.firestore.document(f.config.document)[f.trigger](handler); 
                break;
            case 'database': // f.trigger --> onCreate, onUpdate, onDelete, onWrite
                if (f.config.instance && f.config.ref) {
                    _functions[f.name] = functions.database.instance(f.config.instance).ref(f.config.ref)[f.trigger](handler);
                } else {
                    _functions[f.name] = functions.database.ref(f.config.ref)[f.trigger](handler);
                }
                break;
            case 'storage': // f.trigger --> onFinalize, onDelete, onArchive, onMetadataUpdate
                if (f.config.bucket) {
                    _functions[f.name] = functions.storage.bucket(f.config.bucket).object()[f.trigger](handler);
                } else {
                    _functions[f.name] = functions.storage.object()[f.trigger](handler);
                }
                break;
            case 'pubsub': // f.trigger --> onPublish
                _functions[f.name] = functions.pubsub.topic(f.config.topic)[f.trigger](handler);
                break;
            case 'auth': // f.trigger --> onCreate, onDelete
                _functions[f.name] = functions.auth.user()[f.trigger](handler);
                break;
            case 'ga': // f.trigger --> onLog
                _functions[f.name] = functions.analytics.event(f.config.event)[f.trigger](handler);
                break;
            case 'crash': // f.trigger --> onNew, onRegressed, onVelocityAlert
                _functions[f.name] = functions.crashlytics.issue()[f.trigger](handler);
                break;
            default: // could not be defined
                delete defined[f.name];
                break;
        }
        moveToGroup(f);
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

    // return
    return _functions;
});
