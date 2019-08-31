/**
 * @preserve
 * Flair.js Fabric
 * Foundation for True Object Oriented JavaScript Apps
 * 
 * Assembly: flair.client
 *     File: ./flair.client.js
 *  Version: 0.55.96
 *  Sat, 31 Aug 2019 18:22:09 GMT
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
        root['flair.client'] = factory;
    }
})(this, async function(flair, __asmFile) {
    'use strict';

    // assembly closure init (start)
    /* eslint-disable no-unused-vars */
    
    // flair types, variables and functions
    const { Class, Struct, Enum, Interface, Mixin, Aspects, AppDomain, $$, attr, bring, Container, include, Port, on, post, telemetry,
            Reflector, Serializer, Tasks, as, is, isDefined, isComplies, isDerivedFrom, isAbstract, isSealed, isStatic, isSingleton, isDeprecated,
            isImplements, isInstanceOf, isMixed, getAssembly, getAttr, getContext, getResource, getRoute, getType, ns, getTypeOf,
            getTypeName, typeOf, dispose, using, Args, Exception, noop, nip, nim, nie, event } = flair;
    const { TaskInfo } = flair.Tasks;
    const { env } = flair.options;
    const { guid, stuff, replaceAll, splitAndTrim, findIndexByProp, findItemByProp, which, isArrowFunc, isASyncFunc, sieve,
            deepMerge, getLoadedScript, b64EncodeUnicode, b64DecodeUnicode, lens, globalSetting } = flair.utils;
    
    // inbuilt modifiers and attributes compile-time-safe support
    const { $$static, $$abstract, $$virtual, $$override, $$sealed, $$private, $$privateSet, $$protected, $$protectedSet, $$readonly, $$async,
            $$overload, $$enumerate, $$dispose, $$post, $$on, $$timer, $$type, $$args, $$inject, $$resource, $$asset, $$singleton, $$serialize,
            $$deprecate, $$session, $$state, $$conditional, $$noserialize, $$ns } = $$;
    
    // access to DOC
    const DOC = ((env.isServer || env.isWorker) ? null : window.document);
    
    // current for this assembly
    const __currentContextName = AppDomain.context.current().name;
    const __currentFile = __asmFile;
    const __currentPath = __currentFile.substr(0, __currentFile.lastIndexOf('/') + 1);
    AppDomain.loadPathOf('flair.client', __currentPath);
    
    // settings of this assembly
    let settings = JSON.parse('{"view":{"el":"main","title":"","transition":""},"routes":{"home":"","notfound":""},"i18n":{"lang":{"default":"en","locales":[{"code":"en","name":"English","native":"English"}]}},"routing":{"mounts":{"main":"/"},"all":{"before":{"settings":[{"name":"hashbang","value":false},{"name":"lang","value":false},{"name":"sensitive","value":false}],"interceptors":[]},"after":{"settings":[],"interceptors":[]}}}}');
    let settingsReader = flair.Port('settingsReader');
    if (typeof settingsReader === 'function') {
        let externalSettings = settingsReader('flair.client');
        if (externalSettings) { settings = deepMerge([settings, externalSettings], false); }
    }
    settings = Object.freeze(settings);
    
    // config of this assembly
    let config = JSON.parse('{}');
    config = Object.freeze(config);
    
    /* eslint-enable no-unused-vars */
    // assembly closure init (end)
    
    // assembly global functions (start)
    // (not defined)
    // assembly global functions (end)
    
    // set assembly being loaded
    AppDomain.context.current().currentAssemblyBeingLoaded('./flair.client{.min}.js');
    
    // assembly types (start)
        
    await (async () => { // type: ./src/flair.client/flair.ui/@1-ViewTransition.js
        /**
         * @name ViewTransition
         * @description GUI View Transition
         */
        $$('ns', 'flair.ui');
        Class('ViewTransition', function() {
            $$('virtual');
            $$('async');
            this.enter = noop;
        
            $$('virtual');
            $$('async');
            this.leave = noop;
        });
        
    })();    
    await (async () => { // type: ./src/flair.client/flair.ui/@2-ViewHandler.js
        const { Handler } = await ns('flair.app', './flair.app.js');
        const { ViewTransition } = await ns('flair.ui');
        
        /**
         * @name ViewHandler
         * @description GUI View Handler
         */
        $$('ns', 'flair.ui');
        Class('ViewHandler', Handler, function() {
            let mainEl = '',
                abortControllers = {};       
        
            $$('override');
            this.construct = (base, el, title, transition) => {
                base();
        
                // read from setting which are not specified
                el = el || settings.view.el || 'main';
                title = title || settings.view.title || '';
                transition = transition || settings.view.transition || '';
        
                mainEl = el;
                this.viewTransition = transition;
                this.title = this.title + (title ? ' - ' + title : '');
            };
        
            $$('privateSet');
            this.viewTransition = '';
        
            $$('protectedSet');
            this.name = '';
        
            $$('protectedSet');
            this.title = '';
        
            // each meta in array can be defined as:
            // { "<nameOfAttribute>": "<contentOfAttribute>", "<nameOfAttribute>": "<contentOfAttribute>", ... }
            $$('protectedSet');
            this.meta = null;
        
            $$('protected');
            $$('virtual');
            $$('async');
            this.beforeLoad = noop;
        
            $$('protected');
            $$('virtual');
            $$('async');
            this.afterLoad = noop;
        
            $$('protected');
            $$('virtual');
            $$('async');
            this.loadData = noop;    
        
            $$('protected');
            this.cancelLoadData = async () => {
                let abortController = null;
                for(let handleId in abortControllers) {
                    try {
                        abortController = abortControllers[handleId];
                        abortController.abort();
                    } catch (err) { // eslint-disable-line no-unused-vars
                        // ignore
                    }
                }
                abortControllers = {}; // reset
        
                // any custom cleanup
                await this.onCancelLoadData();
            };
        
            $$('protected');
            this.abortHandle = (handleId) => {
                handleId = handleId || guid(); // use a unique if none is given
                let abortController = new AbortController(); // create new
                abortControllers[handleId] = abortController; // this may overwrite also
                return abortController; // give back the new handle
            };
        
            $$('protected');
            this.abort = (handleId) => {
                try {
                    let abortController = abortControllers[handleId]; // this may or may not be present
                    abortController.abort();
                } catch (err) { // eslint-disable-line no-unused-vars
                    // ignore
                }
            };
        
            $$('protected');
            $$('virtual');
            $$('async');
            this.onCancelLoadData = noop;    
        
            this.view = async (ctx) => {
                // give it a unique name, if not already given
                this.name = this.name || this.$Type.getName(true); // $Type is the main view which is finally inheriting this ViewHandler
                this.$static.loadingViewName = this.name;
        
                // load view transition
                if (this.viewTransition) {
                    let ViewTransitionType = as(await include(this.viewTransition), ViewTransition);
                    if (ViewTransitionType) {
                        this.viewTransition = new ViewTransitionType();
                    } else {
                        this.viewTransition = '';
                    }
                }
        
                // add view el to parent
                let el = null,
                    parentEl = DOC.getElementById(mainEl);
                if (this.$static.currentViewName !== this.name) { // if same view is already loaded, don't add again
                    el = DOC.createElement('div');
                    el.id = this.name;
                    el.setAttribute('hidden', '');
                    parentEl.appendChild(el);
                } else {
                    el = DOC.getElementById(this.name);
                }
                
                // custom load op before view is created
                await this.beforeLoad(ctx, el);      
        
                // view
                await this.onView(ctx, el);
        
                // custom load op after view is created but not shown yet
                await this.afterLoad(ctx, el);
        
                // swap views (old one is replaced with this new one)
                await this.swap();
        
                // now initiate async server data load process, this may take long
                // therefore any must needed data should be loaded either in beforeLoad 
                // or afterLoad functions, anything that can wait still when UI is visible
                // should be loaded here
                // corresponding cancel operations must also be written in cancelLoadData
                // NOTE: this does not wait for completion of this async method
                this.loadData(ctx);        
            };
        
            $$('protected');
            $$('virtual');
            $$('async');
            this.onView = noop;
        
            $$('private');
            this.swap = async () => {
                let thisViewEl = DOC.getElementById(this.name);
        
                // outgoing view
                if (this.$static.currentViewName) {
                    let currentViewEl = DOC.getElementById(this.$static.currentViewName);
        
                    // cancel load data, if any
                    this.$static.currentViewCancelLoadData(); // note: this is called and not waited for, so cancel can keep happening in background
        
                    // if incoming view is not same as outgoing view
                    if (this.$static.currentViewName !== this.name) {
                        // remove outgoing view meta
                        if (this.$static.currentViewMeta) {
                            for(let meta of this.$static.currentViewMeta) {
                                DOC.head.removeChild(DOC.querySelector('meta[name="' + meta + '"]'));
                            }
                        }
        
                        // remove outgoing view styles 
                        this.$static.removeStyles()
        
                        // apply transitions
                        if (this.viewTransition) {
                            // leave outgoing, enter incoming
                            await this.viewTransition.leave(currentViewEl, thisViewEl);
                            await this.viewTransition.enter(thisViewEl, currentViewEl);
                        } else {
                            // default is no transition
                            if (currentViewEl) { currentViewEl.hidden = true; }
                            thisViewEl.hidden = false;
                        }
        
                        // remove outgoing view
                        let parentEl = DOC.getElementById(mainEl);  
                        if (currentViewEl) { parentEl.removeChild(currentViewEl); }
                    }
                }
        
                // if incoming view is not same as outgoing view
                if (this.$static.currentViewName !== this.name) {        
                    // add incoming view meta
                    if (this.meta) {
                        for(let meta of this.meta) {
                            var metaEl = document.createElement('meta');
                            for(let metaAttr in meta) {
                                metaEl[metaAttr] = meta[metaAttr];
                            }
                            DOC.head.appendChild(metaEl);
                        }
                    }
        
                    // in case there was no previous view
                    if (!this.$static.currentViewName && thisViewEl) {
                        thisViewEl.hidden = false;
                    }
                }
        
                // update title
                DOC.title = this.title;
        
                // set new current
                this.$static.currentViewName = this.name;
                this.$static.loadingViewName = null;
                this.$static.currentViewMeta = this.meta;
                this.$static.currentViewCancelLoadData = this.cancelLoadData;
            };
        
            $$('static');
            this.currentViewName = null;
        
            $$('static');
            this.currentViewMeta = null;
        
            $$('static');
            this.currentViewCancelLoadData = null;    
        
            $$('static');
            this.loadingViewName = null;
        
            $$('static');
            this.removeStyles = function() {
                if (this.currentViewName) {
                    let styles = document.head.getElementsByTagName("style"),
                        outgoingViewName = this.currentViewName;
                    for(let styleEl of styles) { // remove all styles which were added by any component (view itself, layout or any component) of this view
                        if (styleEl.id && styleEl.id.startsWith(`_${outgoingViewName}_style_`)) { // this must match the way styles were added, see below in: addStyle
                            document.head.removeChild(styleEl);
                        }
                    }
                }
            };
        
            $$('static');
            this.addStyle = function(scopeId, style) {
                if (this.loadingViewName) {
                    let styleEl = window.document.createElement('style');
                    styleEl.id = `_${this.loadingViewName}_style_${scopeId}`
                    styleEl.type = 'text/css';
                    styleEl.appendChild(window.document.createTextNode(style));
                    window.document.head.appendChild(styleEl);
                }
            };
        });
        
    })();    
    await (async () => { // type: ./src/flair.client/flair.ui/@3-Page.js
        /**
         * @name Page
         * @description Page routing (inspired from (https://www.npmjs.com/package/page))
         */
        $$('sealed');
        $$('ns', 'flair.ui');
        Class('Page', function() {
            let handlers = [],
                defaultHandler;
        
            this.construct = (options) => {
                // settings
                this.hasbang = options.hasbang || false;
                this.lang = options.lang || false;
                this.base = options.base || '';
                this.sensitive = options.sensitive || false;
        
                // ensure base has start '/' and no end '/'
                if (this.base.endsWith('/')) { this.base = this.base.substr(0, this.base.length - 1); }
                if (!this.base.startsWith('/')) { this.base = '/' + this.base; }
            };
        
            $$('readonly');
            this.hasbang = false;
        
            $$('readonly');
            this.lang = false;
        
            $$('readonly');
            this.base = '';
        
            $$('readonly');
            this.sensitive = false;
        
            $$('private');
            this.pathToRegExp = (path, keys) => {
                /* eslint-disable no-useless-escape */
                // remove first and last slash
                if (path.startsWith('/')) { path = path.substr(1); }
                if (path.endsWith('/')) { path = path.substr(0, path.length - 1); }
        
                // break path into pieces and process
                let items = (path ? path.split('/') : []),
                    regex = '',
                    idx = 0;
                for(let item of items) {
                    item = item.trim();
                    if (item.startsWith(':')) { // param
                        keys.push({ name: item.substr(1), index: idx });
                        regex += '\/.[^\/]*'; // match anything till next /
                    } else {
                        regex += '\/' + item; // match exact
                    }
                    idx++;
                }
        
                // end with a slash
                regex += '\/';
        
                // case sensitive
                let regEx = null;
                if (!this.sensitive) {
                    regEx = new RegExp(regex, "i"); // case in-sensitive
                } else {
                    regEx = new RegExp(regex);
                }
        
                // NOTE: regular expression supports only placeholder
                // no optional params etc. are supported
        
                // done
                return regEx;
                /* eslint-enable no-useless-escape */
            };
        
            this.breakUrl = (url) => {
                let parts = {
                    url: url,
                    path: '',
                    loc: '',
                    params: {},
                    handler: null,
                    route: null
                },
                path = url;
        
                // remove hash etc.
                if (path.substr(0, 1) === '/') { path = path.substr(1); }        
                if (path.substr(0, 3) === '#!/') { path = path.substr(3); }
                if (path.substr(0, 2) === '#!') { path = path.substr(2); }
                if (path.substr(0, 2) === '#/') { path = path.substr(2); }
                if (path.substr(0, 1) === '#') { path = path.substr(1); }
                if (path.substr(0, 1) === '/') { path = path.substr(1); }
                path = '/' + path; // add initial slash
        
                // remove base
                if (path.startsWith(this.base)) {
                    path = path.substr(this.base.length);
                }
        
                // extract and strip locale
                if (this.lang) { 
                    if (path.startsWith('/')) { path = path.substr(1); } // remove initial slash 
                    let items = path.split('/');
                    if (items.length > 0) {
                        let loc = items[0].trim();
                        if (AppDomain.host().supportedLocales.indexOf(loc) !== -1) {
                            parts.loc = loc;
                        }
                        items.shift(); // remove first
                        path = items.join('/');
                        if (!path.startsWith('/')) { path = '/' + path; } // add initial slash 
                    }    
                }
        
                // add initial slash 
                if (!path.startsWith('/')) { path = '/' + path; }
        
                // extract query strings (?varName=value)
                let qsIndex = path.indexOf('?'),
                    qs = '',
                    qvars = null;
                if (qsIndex !== -1) { 
                    qs = path.substr(qsIndex + 1);
                    path = path.substr(0, qsIndex);
                    let items = qs.split('&'),
                        qitems = null;
                    for(let item of items) {
                        qitems = item.split('=');
                        qvars = qvars || {};
                        qvars[qitems[0].trim()] = decodeURIComponent(qitems[1].trim());
                    }
                }     
        
                // add trailing slash 
                if (!path.endsWith('/')) { path += '/'; }
        
                // store
                parts.path = path;
        
                // find best matched handler and extract params
                for(let item of handlers) {
                    let m = item.regex.exec(decodeURIComponent(path));
                    if (m && m.input === m[0]) { // fully matched
                        // remove first and last slash
                        if (path.startsWith('/')) { path = path.substr(1); }
                        if (path.endsWith('/')) { path = path.substr(0, path.length - 1); }
                        let pathItems = (path ? path.split('/') : []);
                        
                        // pick key values from known index
                        for(let key of item.keys) {
                            parts.params[key.name] = pathItems[key.index];
                        }
        
                        // set handler
                        parts.handler = item.handler; 
        
                        // set route
                        parts.route = item.route; 
                        break;
                    }
                }
        
                // overwrite/merge params with qvars (if there were conflict)
                if (qvars) {
                    parts.params = Object.assign(parts.params, qvars);
                }
        
                // done
                return parts;
            };
            this.buildUrl = (path, params) => {
                // start with base
                let url = this.base;
                if (!url.endsWith('/')) { url += '/'; }
        
                // add locale next to base
                if (this.lang) {
                    url += AppDomain.host().currentLocale + '/';
                }
        
                // add path after base
                if (path.startsWith('/')) { path = path.substr(1); }
                url += path;
                if (!url.startsWith('/')) { url = '/' +  url; }
                
                // add # in the beginning
                if (this.hasbang) {
                    url = '#!' + url;
                } else {
                    url = '#' + url;
                }
        
                // end in /
                if (!url.endsWith('/')) { url += '/'; }
        
                // replace params
                // path can be like: test/:id
                // where it is expected that params.id property will 
                // have what to replace in this
                // If param var not found in path, it will be added as query string
                if (params) {
                    let idx = -1,
                        qs = '?',
                        value = null;
                    for(let p in params) {
                        if (params.hasOwnProperty(p)) {
                            idx = url.indexOf(`:${p}`);
                            value = encodeURIComponent(params[p].toString());
                            if (idx !== -1) { 
                                url = replaceAll(url, `:${p}`, value); 
                            } else {
                                qs += `${p}=${value}`;
                            }
                        }
                    }
                    if (qs !== '?') { url += qs; }            
                }
        
                // done
                return url;
            };
            this.rebuildUrl = (url) => {
                // this will consider any change in locale (and any such other things in future)
                let parts = this.breakUrl(url);
                return this.buildUrl(parts.path, parts.params);
            };
        
            this.add = (route, handler) => {
                let keys = []; // contains { name: name, index: indexPosition }
                handlers.push({
                    route: route,
                    path: route.path,
                    keys: keys,
                    regex: this.pathToRegExp(route.path, keys),
                    handler: handler
                });
            };
            this.add404 = (handler) => {
                defaultHandler = handler;
            };
            this.run = async (url) => {
                // default ctx
                let ctx = {
                    $url: url,
                    $page: '',
                    $route: '',
                    $handler: '',
                    $mount: '',
                    $path: '',
                    $stop: false,  // if no further processing to be done
                    $redirect: {
                        route: '',
                        params: {}
                    } // route to redirect to
                };
        
                // get path parts
                let parts = this.breakUrl(url),
                    loc = parts.loc,
                    params = parts.params;
                
                // enrich ctx
                if (parts.route) {
                    ctx.$route = parts.route.name;
                    ctx.$handler = parts.route.handler;
                    ctx.$mount = parts.route.mount;
                    ctx.$path = parts.route.path;
                } else {
                    ctx.$path = parts.path;
                }
        
                // add params to ctx
                if (params) { ctx = Object.assign(ctx, params); }
        
                try {
                    if (parts.handler) {
                        // set locale
                        if (this.lang) { 
                            AppDomain.host().locale(loc); // this will set only if changed
                        }
        
                        // run handler
                        await parts.handler(ctx);
        
                        // redirect if configured
                        if (ctx.$redirect.route) {
                            let route = ctx.$redirect,
                                params = ctx.$params;
                            setTimeout(() => { AppDomain.host().redirect(route, params) }, 0);
                        }                
                    } else {
                        // run default handler 
                        await defaultHandler(ctx);
                    }
                } catch (err) {
                    AppDomain.host().raiseError(err);
                }
            };
        });
        
    })();    
    await (async () => { // type: ./src/flair.client/flair.app/ClientHost.js
        const { Host, RouteSettingReader } = await ns('flair.app', './flair.app.js');
        const { ViewHandler, Page } = await ns('flair.ui');
        
        /**
         * @name ClientHost
         * @description Client host implementation
         */
        $$('sealed');
        $$('ns', 'flair.app');
        Class('ClientHost', Host, function() {
            let mountedApps = {},
                hashChangeHandler = null;
        
            $$('override');
            this.construct = (base) => {
                base('Client'); 
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
            this.currentLocale = settings.i18n.lang.default;
        
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
                if (newLocale && this.currentLocale !== newLocale) { 
                    this.currentLocale = newLocale;
        
                    if (isRefresh) {
                        let app = this(window.location.hash);
                        let updatedUrl = app.rebuildUrl(window.location.hash);
                        this.go(updatedUrl);
                    }
                }
        
                // return
                return this.currentLocale;
            };
            // localization support (end)
        
            // path support (start)
            this.routeToUrl = (route, params) => {
                if (!route) { return null; }
        
                // get route object
                let routeObj = AppDomain.context.current().getRoute(route); // route = qualifiedRouteName
                if (!routeObj) {
                    return replaceAll(route, '.', '_'); // convert route qualified name in a non-existent utl, so it will automatically go to notfound view
                }
        
                // get app
                let app = this.mounts[routeObj.mount].app;
        
                // return
                return app.buildUrl(routeObj.path, params);
            };
            this.pathToUrl = (path, params) => {
                let app = this.urlToApp(path); // it will still work even if this is not url
                return app.buildUrl(path, params);
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
            this.view = {
                get: () => { return ViewHandler.currentView; },
                set: noop
            };
            this.redirect = async (route, params, isRefresh) => {
                await this.navigate(route, params, true);
                if (isRefresh) { await this.refresh(); }
            };
            this.navigate = async (route, params, isReplace) => {
                params = params || {};
        
                // get url from route
                // routeName: qualifiedRouteName
                // url: hash part of url 
                let url = this.routeToUrl(route, params);
        
                // navigate/replace
                if (url) {
                    await this.go(url, isReplace);
                } else {
                    this.raiseError(Exception.NotFound(route, this.navigate));
                }
            };  
            this.go = async (url, isReplace) => {
                if (isReplace) {
                    // this will not trigger hanschange event, neither will add a history entry
                    history.replaceState(null, null, window.document.location.pathname + url);
                } else {
                    // this will trigger hanschange event, and will add a history entry
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
                    mount = null;
                const getSettings = (mountName) => {
                    // each item is: { name: '', value:  }
                    let pageSettings = RouteSettingReader.getMergedSection('settings', settings.routing, mountName, 'name');
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
                let mainApp = new Page(appSettings);
        
                // create one instance of page app for each mounted path
                for(let mountName of Object.keys(settings.routing.mounts)) {
                    if (mountName === 'main') {
                        mount = mainApp;
                    } else {
                        appSettings = getSettings(mountName);
                        mount = new Page(appSettings); 
                    }
        
                    // attach
                    mountedApps[mountName] = Object.freeze({
                        name: mountName,
                        root: mount.base,
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
        
                // redirect to home
                if (settings.routes.home) {
                    await this.redirect(settings.routes.home, {}, true); // force refresh but don't let history entry added for first page
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
        
    })();    
    await (async () => { // type: ./src/flair.client/flair.boot/ClientRouter.js
        const { Bootware, RouteSettingReader } = await ns('flair.app', './flair.app.js');
        const { ViewHandler, ViewInterceptor } = await ns('flair.ui');
        
        /**
         * @name ClientRouter
         * @description Client Router Configuration Setup
         */
        $$('sealed');
        $$('ns', 'flair.boot');
        Class('ClientRouter', Bootware, function () {
            let routes = null;
            
            $$('override');
            this.construct = (base) => {
                base('Client Router', true); // mount specific 
            };
        
            $$('override');
            this.boot = async (base, mount) => {
                base();
                
                // get all registered routes, and sort by index, if was not already done in previous call
                if (!routes) {
                    routes = AppDomain.context.current().allRoutes(true);
                    routes.sort((a, b) => {
                        if (a.index < b.index) {
                            return -1;
                        }
                        if (a.index > b.index) {
                            return 1;
                        }
                        return 0;
                    });
                }
        
                const runHandler = async (routeHandler, ctx) => {
                    let RouteHandler = as(await include(routeHandler), ViewHandler);
                    if (RouteHandler) {
                        let rh = new RouteHandler();
                        await rh.view(ctx);
                    } else {
                        throw Exception.InvalidDefinition(`Invalid route handler. (${routeHandler})`);
                    }
                };
                const chooseRouteHandler = (route) => {
                    if (typeof route.handler === 'string') { return route.handler; }
                    return route.handler[AppDomain.app().getRoutingContext(route.name)] || '**undefined**';
                };
                const getHandler = function(route) {
                    return async (ctx) => {
                        // ctx.params has all the route parameters.
                        // e.g., for route "/users/:userId/books/:bookId" ctx.params will 
                        // have "ctx.params: { "userId": "34", "bookId": "8989" }"
                        // it supports everything in here: https://www.npmjs.com/package/path-to-regexp
        
                        // run mount specific interceptors
                        // each interceptor is derived from ViewInterceptor and
                        // async run method of it takes ctx, can update it
                        // each item is: "InterceptorTypeQualifiedName"
                        let mountInterceptors = RouteSettingReader.getMergedSection('interceptors', settings.routing, mount.name);
                        for(let ic of mountInterceptors) {
                            let ICType = as(await include(ic), ViewInterceptor);
                            if (!ICType) { throw Exception.InvalidDefinition(`Invalid interceptor type. (${ic})`); }
                            
                            await new ICType().run(ctx);
                            if (ctx.$stop) { break; } // break, if someone forced to stop 
                        }
        
                        // handle route
                        if (!ctx.$stop) {
                            // route.handler can be defined as:
                            // string: qualified type name of the handler
                            // object: { "routingContext": "handler", ...}
                            //  routingContext can be any value that represents a routing context for whatever situation 
                            //  this is read from App.getRoutingContext(routeName) - where some context string can be provided - 
                            //  basis it will pick required handler from here some examples of handlers can be:
                            //      mobile | tablet | tv  etc.  - if some routing is to be based on device type
                            //      free | freemium | full  - if some routing is to be based on license model
                            //      anything else
                            //  this gives a handy way of diverting some specific routes while rest can be as is - statically defined
                            let routeHandler = chooseRouteHandler(route);
                            await runHandler(routeHandler, ctx);
                        }
                    };
                };
        
                // add routes related to current mount
                let app = mount.app;
                for (let route of routes) {
                    // route.mount can be one string or an array of strings - in that case, same route will be mounted to multiple mounts
                    if ((typeof route.mount === 'string' && route.mount === mount.name) || (route.mount.indexOf(mount.name) !== -1)) { // add route-handler
                        if (route.name !== settings.routes.notfound) { // add all except the 404 route
                            app.add(route, getHandler(route));
                        } 
                    }
                }
        
                // catch 404 for this mount
                app.add404(async (ctx) => {
                    // 404 handler does not run interceptors
                    // and instead of running the route (for which this ctx was setup)
                    // it will pick the handler of notfound route and show that view with this ctx
                    let route404 = settings.routes.notfound;
                    if (route404) { route404 = AppDomain.context.current().getRoute(route404); }
                    if (!route404) { // nothing else can be done
                        setTimeout(() => { window.history.back(); }, 0);
                        return;
                    }
        
                    // use route404 handler
                    await runHandler(route404.handler, ctx);
                });
            };
        });
    })();    
    await (async () => { // type: ./src/flair.client/flair.ui/ViewInterceptor.js
        /**
         * @name ViewInterceptor
         * @description GUI View Interceptor
         */
        $$('ns', 'flair.ui');
        Class('ViewInterceptor', function() {
            $$('virtual');
            $$('async');
            this.run = noop;
        });
        
    })();    
    await (async () => { // type: ./src/flair.client/flair.ui/ViewState.js
        /**
         * @name ViewState
         * @description GUI View State Global Store
         */
        $$('singleton');
        $$('ns', 'flair.ui');
        Class('ViewState', function() {
            $$('state');
            $$('private');
            this.store = {};
        
            this.get = (path, name) => {
                path = path || ''; name = name || '';
                return this.store[path + '/' + name] || null;
            };
            this.set = (path, name, value) => {
                path = path || ''; name = name || '';
                if (typeof value !== 'boolean' && !value) {
                    delete this.store[path + '/' + name]; return;
                }
                this.store[path + '/' + name] = value;
            };
        
            this.clear = () => { this.store = null; }
        });
        
    })();
    // assembly types (end)
    
    // assembly embedded resources (start)
    // (not defined)
    // assembly embedded resources (end)        
    
    // clear assembly being loaded
    AppDomain.context.current().currentAssemblyBeingLoaded();
    
    // register assembly definition object
    AppDomain.registerAdo('{"name":"flair.client","file":"./flair.client{.min}.js","package":"flairjs-fabric","desc":"Foundation for True Object Oriented JavaScript Apps","title":"Flair.js Fabric","version":"0.55.96","lupdate":"Sat, 31 Aug 2019 18:22:09 GMT","builder":{"name":"flairBuild","version":"1","format":"fasm","formatVersion":"1","contains":["init","func","type","vars","reso","asst","rout","sreg"]},"copyright":"(c) 2017-2019 Vikas Burman","license":"MIT","types":["flair.ui.ViewTransition","flair.ui.ViewHandler","flair.ui.Page","flair.app.ClientHost","flair.boot.ClientRouter","flair.ui.ViewInterceptor","flair.ui.ViewState"],"resources":[],"assets":[],"routes":[]}');
    
    // assembly load complete
    if (typeof onLoadComplete === 'function') { 
        onLoadComplete();   // eslint-disable-line no-undef
    }
    
    // return settings and config
    return Object.freeze({
        name: 'flair.client',
        settings: settings,
        config: config
    });
});