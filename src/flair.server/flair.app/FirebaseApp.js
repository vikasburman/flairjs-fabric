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

    this.firebase = (appName) => {
        if (!this.apps[appName]) { // load required app now (this may throw, if error or config is missing)
            if (!this.fbConfig) { this.fbConfig = require(AppDomain.resolvePath('./firebaseConfig.json')); }
            let fbAppConfig = this.fbConfig[appName];
            
            // add credential
            // it assumes that serviceAccountKey.json file path is set in GOOGLE_APPLICATION_CREDENTIALS env variable
            // as explained in https://firebase.google.com/docs/admin/setup/?authuser=0#initialize_the_sdk
            fbAppConfig['credential'] = fbAdmin.credential.applicationDefault();

            // initialize and store
            this.apps[appName] = fbAdmin.initializeApp(fbAppConfig, appName);
        }

        // return
        return this.apps[appName];
    };
});
