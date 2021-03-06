const { Host } = await ns('flair.app');
const { Page } = await ns('flair.ui');

/**
 * @name ClientHost
 * @description Client host implementation
 */
$$('sealed');
Class('', Host, function() {
    let mountedApps = {},
        hashChangeHandler = null;

    $$('override');
    this.construct = (base) => {
        base('Client');
        this.currentLocale = this.defaultLocale; // set default
    };

    this.app = {
        get: () => { return this.mounts['main'].app; },  // main page app
        set: noop
    };    
    this.mounts = { // all mounted page apps
        get: () => { return mountedApps; },
        set: noop
    };

    // localization support (start)
    $$('state');
    $$('private');
    this.currentLocale = '';

    this.defaultLocale = {
        get: () => { return settings.i18n.lang.default; },
        set: noop
    };
    this.supportedLocales = {
        get: () => { return settings.i18n.lang.locales.slice(); },
        set: noop
    };
    this.locale = (newLocale, isRefresh) => {
        // update value and refresh for changes (if required)
        if (newLocale && this.currentLocale !== newLocale && findIndexByProp(this.supportedLocales, 'code', newLocale) !== -1) { 
            let oldLocale = this.currentLocale;
            this.currentLocale = newLocale;

            // set in env props also, for api endpoint url resolver to pick it, if need be
            env.props('api', 'locale'. newLocale);

            if (isRefresh) {
                let newUrl = window.location.hash.replace(oldLocale, newLocale);
                this.go(newUrl);
            }
        }

        // return
        return this.currentLocale;
    };
    // localization support (end)

    // other segmentation support (start)
    $$('state');
    $$('private');
    this.currentVersion = '';

    this.version = (newVersion, isRefresh) => {
        // update value and refresh for changes (if required)
        if (newVersion && this.currentVersion !== newVersion) { 
            let oldVersion = this.currentVersion;
            this.currentVersion = newVersion;

            // set in env props also, for api endpoint url resolver to pick it, if need be
            env.props('api', 'version'. newVersion);

            if (isRefresh) {
                let newUrl = window.location.hash.replace(oldVersion, newVersion);
                this.go(newUrl);
            }
        }

        // return
        return this.currentVersion;
    };
    // other segmentation support (end)

    // path support (start)
    this.routeToUrl = (route, params, query) => {
        if (!route) { return null; }

        // get route object
        let routeObj = AppDomain.context.current().getRoute(route); // route = qualifiedRouteName
        if (!routeObj) {
            return replaceAll(route, '.', '_'); // convert route qualified name in a non-existent url, so it will automatically go to notfound view
        }

        // get app
        let app = this.mounts[routeObj.mount].app;

        // return
        return app.buildUrl(routeObj.path, params, query);
    };
    this.pathToUrl = (path, params, query) => {
        let app = this.urlToApp(path); // it will still work even if this is not url
        return app.buildUrl(path, params, query);
    };
    $$('private');
    this.urlToApp = (url) => {
        // remove any # or #! and start with /
        if (url.substr(0, 3) === '#!/') { url = url.substr(3); }
        if (url.substr(0, 2) === '#!') { url = url.substr(2); }
        if (!url.startsWith('/')) { url = '/' + url }

        // look for all mounted apps and find the best (longest) matched base path
        let lastFoundMount = null;
        for(let mount in this.mounts) {
            if (this.mounts.hasOwnProperty(mount)) {
                if (url.startsWith(mount.base)) { 
                    if (mount.base.length > lastFoundMount.base.length) {
                        lastFoundMount = mount;
                    }
                }
            }
        }

        // return
        return (lastFoundMount ? lastFoundMount.app : this.app);
    };
    // path support (end)

    // view (start)
    this.redirect = async (route, params, query, isRefresh) => {
        await this.navigate(route, params, query, true);
        if (isRefresh) { await this.refresh(); }
    };
    this.navigate = async (route, params, query, isReplace) => {
        params = params || {};

        // get url from route
        // routeName: qualifiedRouteName
        // url: hash part of url 
        let url = this.routeToUrl(route, params, query);

        // navigate/replace
        if (url) {
            await this.go(url, isReplace);
        } else {
            this.raiseError(Exception.NotFound(route, this.navigate));
        }
    };  
    this.go = async (url, isReplace) => {
        if (isReplace) {
            if (url !== '#/') { // let root remain as is. e.g., abc.com will be abc.com itself and not abc.com/#/
                // this will not trigger hashchange event, neither will add a history entry
                history.replaceState(null, null, window.document.location.pathname + url);
            }
        } else {
            // this will trigger hashchange event, and will add a history entry
            if (url.substr(0, 1) === '#') { url = url.substr(1); } // remove #, because it will automatically be added when setting hash below
            window.location.hash = url;
        }
    };
    this.refresh = async () => {
        setTimeout(() => {
            hashChangeHandler(); // force refresh
        }, 0)
    };
    // view (end)

    $$('override');
    this.boot = async (base) => { // mount all page app and pseudo sub-apps
        base();

        let appSettings = {},
            mount = null,
            mountParams = '';
        const getSettings = (mountName) => {
            // each item is: { name: '', value:  }
            let pageSettings = this.getMountSpecificSettings('settings', settings.routing, mountName, 'name');
            if (pageSettings && pageSettings.length > 0) {
                for(let pageSetting of pageSettings) {
                    appSettings[pageSetting.name] = pageSetting.value;
                }
            }   

            // special settings
            appSettings.base = settings.routing.mounts[mountName];

            return appSettings;         
        };

        // create main app instance of page
        appSettings = getSettings('main');
        let mainAppMountParams = (settings.routing['main'] ? settings.routing['main']['params'] : '') || '';
        let mainApp = new Page(appSettings, mainAppMountParams);

        // create one instance of page app for each mounted path
        for(let mountName of Object.keys(settings.routing.mounts)) {
            if (mountName === 'main') {
                mount = mainApp;
                mountParams = mainAppMountParams;
            } else {
                appSettings = getSettings(mountName);
                mountParams = (settings.routing[mountName] ? settings.routing[mountName]['params'] : '') || '';
                mount = new Page(appSettings, mountParams);
            }

            // attach
            mountedApps[mountName] = Object.freeze({
                name: mountName,
                root: mount.base,
                params: mountParams,
                app: mount
            });
        }

        // store
        mountedApps = Object.freeze(mountedApps);       
    };

    $$('override');
    this.start = async (base) => { // configure hashchange handler
        base();

        hashChangeHandler = async () => {
            // get page app mount to handle the url
            let app = this.urlToApp(window.location.hash);

            // run app to initiate routing
            await app.run(window.location.hash);
        };
    };

    $$('override');
    this.ready = async (base) => { // start listening hashchange event
        base();

        // attach event handler
        window.addEventListener('hashchange', hashChangeHandler);

        // redirect to home or open given url
        // url can be given as: 
        // host
        // host/
        // host/#/path
        if (!window.location.hash) { // no hash is given
            if (settings.view.routes.home) {
                await this.redirect(settings.view.routes.home, {}, {}, true); // force refresh but don't let history entry added for first page
            } else {
                console.log(`No home route is configured.`); // eslint-disable-line no-console
            }
        } else {
            await hashChangeHandler(); // manually call it the first time
        }
        
        // ready
        console.log(`${AppDomain.app().info.name}, v${AppDomain.app().info.version}`); // eslint-disable-line no-console
    };

    $$('override');
    this.stop = async (base) => { // stop listening hashchange event
        base();

        // detach event handler
        window.removeEventListener('hashchange', hashChangeHandler);
    };

    $$('override');
    this.dispose = (base) => {
        base();

        mountedApps = null;
    };
});
