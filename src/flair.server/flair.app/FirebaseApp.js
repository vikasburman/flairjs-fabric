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
            if (!this.fbConfig) { this.fbConfig = require(AppDomain.resolvePath(settings.firebase.firebaseApps)); }
            let fbAppConfig = this.fbConfig[appName];
            
            // add credential
            fbAppConfig['credential'] = fbAdmin.credential.cert(require(AppDomain.resolvePath(settings.firebase.serviceAccount)));

            // initialize and store
            this.apps[appName] = fbAdmin.initializeApp(fbAppConfig, appName);
        }

        // return
        return this.apps[appName];
    };
});
