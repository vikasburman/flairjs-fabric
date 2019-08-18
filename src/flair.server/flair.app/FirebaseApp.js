const fbAdmin = require('firebase-admin');

/**
 * @name FirebaseApp
 * @description Firebase specific App extensions
 */
$$('ns', '(auto)');
Mixin('(auto)', function() {
    $$('private');
    this.apps = {};

    $$('private');
    this.fbConfig = null;

    $$('privateSet');
    this.projectId = null;

    this.firebase = (appName) => {
        if (!this.apps[appName]) { // load required app now (this may throw, if error or config is missing)
            // get the project id from environment
            fbAdmin.initializeApp(); // initializing blank populates the environment variables GCLOUD_PROJECT and FIREBASE_CONFIG
            this.projectId = (process.env.GCLOUD_PROJECT || JSON.parse(process.env.FIREBASE_CONFIG).projectId || process.env.GCP_PROJECT);

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
