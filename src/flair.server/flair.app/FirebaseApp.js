/**
 * @name FirebaseApp
 * @description Firebase specific App extensions
 */
$$('ns', '(auto)');
Mixin('(auto)', function() {
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
