/**
 * @name FirebaseApp
 * @description Firebase specific App extensions
 */
$$('ns', '(auto)');
Mixin('(auto)', function() {
    $$('private');
    this.apps = {};

    this.firebase = (appName) => {
        if (!this.apps[appName]) { // load required app now (this may throw, if error or config is missing)
            let fb_admin = require('firebase-admin');
            let fb_config = require(AppDomain.resolvePath('./firebaseConfig.json'))[appName];
            
            // add credential
            // it assumes that serviceAccountKey.json file path is set in GOOGLE_APPLICATION_CREDENTIALS env variable
            // as explained in https://firebase.google.com/docs/admin/setup/?authuser=0#initialize_the_sdk
            fb_config['credential'] = fb_admin.credential.applicationDefault();

            // initialize and store
            this.apps[appName] = fb_admin.initializeApp(fb_config, appName);
        }

        // return
        return this.apps[appName];
    };
});
