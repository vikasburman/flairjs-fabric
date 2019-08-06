/**
 * start-firebase
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
        root['flair.server.start'] = factory;
    }
})(this, function(entryPoint, callback) {
    'use strict';
    
    const flair = require('flairjs');
    const admin = require('firebase-admin');
    const functions = require('firebase-functions');
    const firebaseConfig = require('./firebaseConfig.json');
    const functionsConfig = require('./functionsConfig.json');
    const serviceAccount = require('./serviceAccountKey.json');
    
    // define credentials, if serviceAccount is configured
    if (typeof serviceAccount.project_id !== 'undefined') {
        firebaseConfig.credential = admin.credential.cert(serviceAccount);
    }
    
    // initialize firebase app
    admin.initializeApp(firebaseConfig);
    
    // define functions
    let defined = {};
    
    const httpFunction = (f) => { // http 
        const handler = (req, res) => {
            const handle = () => { // let express app handle it
                flair.AppDomain.host().app(req, res);
            };
            if (flair.env.isAppStarted()) { handle(); return; }
            flair(entryPoint).then((app) => { 
                console.log('*'); 
                if (typeof callback === 'function') { callback(flair, app); }
                handle();
            });
        };
        if (f.region && f.runtimeOpts) {
            exports[f.name] = functions.region(f.region).runWith(f.runtimeOpts).https.onRequest(handler);
        } else if (f.region) {
            exports[f.name] = functions.region(f.region).https.onRequest(handler);
        } else if (f.runtimeOpts) {
            exports[f.name] = functions.runWith(f.runtimeOpts).https.onRequest(handler);
        } else {
            exports[f.name] = functions.https.onRequest(handler);
        }
        defined[f.name] = true;
    };
    const directFunction = (f) => { // callable
        const handler = async (data, context) => {
            const handle = async () => { // let configured handler handle it
                try {
                    let TheClass = await flair.include(f.handler),
                        theObject = new TheClass();
                    return await theObject.direct(data, context); // direct type handlers must have direct method
                } catch (err) {
                    return new functions.https.HttpsError('failed', err.message);
                }
            };
            if (!flair.env.isAppStarted()) { 
                let app = await flair(entryPoint); 
                console.log('*'); 
                if (typeof callback === 'function') { callback(flair, app); }
            }
            return handle();
        };
        exports[f.name] = functions.https.onCall(handler);
        defined[f.name] = true;
    };
    const cronFunction = (f) => { // scheduled 
        const handler = async (context) => {
            const handle = async () => { // let configured handler handle it
                try {
                    let TheClass = await flair.include(f.handler),
                        theObject = new TheClass();
                    return await theObject.run(context); // cron type handlers must have run method
                } catch (err) {
                    return new functions.https.HttpsError('failed', err.message);
                }
            };
            if (!flair.env.isAppStarted()) { 
                let app = await flair(entryPoint); 
                console.log('*'); 
                if (typeof callback === 'function') { callback(flair, app); }
            }
            return handle();
        };
        if (f.timeZone) {
            exports[f.name] = functions.pubsub.schedule.timeZone(f.timeZone).onRun(handler);
        } else {
            exports[f.name] = functions.pubsub.schedule.onRun(handler);
        }
        defined[f.name] = true;
    };
    const triggerFunction = () => { // trigger
        // TODO
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
