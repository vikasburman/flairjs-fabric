/**
 * @preserve
 * Flair.js Fabric
 * Foundation for True Object Oriented JavaScript Apps
 * 
 * Assembly: flair.client
 *     File: ./flair.client.js
 *  Version: 0.55.22
 *  Fri, 09 Aug 2019 18:09:15 GMT
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
    const { guid, forEachAsync, stuff, replaceAll, splitAndTrim, findIndexByProp, findItemByProp, which, isArrowFunc, isASyncFunc, sieve,
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
    let settings = JSON.parse('{"view":{"el":"main","title":"","transition":""},"routes":{"home":"","notfound":""},"ui":{"vue":{"extensions":[]}},"i18n":{"lang":{"default":"en","locales":[{"code":"en","name":"English","native":"English"}]}},"routing":{"mounts":{"main":"/"},"main-settings":[{"name":"hashbang","value":false},{"name":"lang","value":false},{"name":"sensitive","value":false}],"main-interceptors":[]}}');
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
    // global handler
    let onLoadComplete = () => {
    }; 
    // assembly global functions (end)
    
    // set assembly being loaded
    AppDomain.context.current().currentAssemblyBeingLoaded('./flair.client{.min}.js');
    
    // assembly types (start)
        
    await (async () => { // type: ./src/flair.client/flair.ui/@1-ViewHandler.js
        const Handler = await include('flair.app.Handler');
        
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
                const { ViewTransition } = ns('flair.ui');
        
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
    await (async () => { // type: ./src/flair.client/flair.ui/@2-Page.js
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
    await (async () => { // type: ./src/flair.client/flair.ui.vue/@10-VueComponentMembers.js
        const { ViewHandler } = ns('flair.ui');
        
        /**
         * @name VueComponentMembers
         * @description Vue Component Members
         */
        $$('ns', 'flair.ui.vue');
        Mixin('VueComponentMembers', function() {
            var _this = this,
                _thisId = guid();
        
            $$('private');
            this.define = async () => {
                const Vue = await include('vue/vue{.min}.js');   
                const { ViewState } = ns('flair.ui');
                const { VueFilter, VueMixin, VueDirective, VueComponent } = ns('flair.ui.vue');
        
                let viewState = new ViewState(),
                    component = {};
        
                // get port
                let clientFileLoader = Port('clientFile');  
        
                // load style content in property
                if (this.style && this.style.endsWith('.css')) { // if style file is defined via $$('asset', '<fileName>'); OR directly name is written
                    // pick file from assets folder
                    this.style = this.$Type.getAssembly().getAssetFilePath(this.style);
                    // load file content
                    this.style = await clientFileLoader(this.style);
                }
                // load styles in dom - as scoped style
                if (this.style) {
                    this.style = replaceAll(this.style, '#SCOPE_ID', `#${_thisId}`); // replace all #SCOPE_ID with #<this_component_unique_id>
                    ViewHandler.addStyle(_thisId, this.style); // static method, that add this style in context of view-being-loaded
                }
        
                // load html content in property
                if (this.html && this.html.endsWith('.html')) { // if html file is defined via $$('asset', '<fileName>');  OR directly name is written
                    // pick file from assets folder
                    this.html = this.$Type.getAssembly().getAssetFilePath(this.html);
                    // load file content
                    this.html = await clientFileLoader(this.html);
                }
                // put entire html into a unique id div
                // even empty html will become an empty div here with ID - so it ensures that all components have a div
                this.html = `<div id="${_thisId}">${this.html}</div>`;
        
                // local i18n resources
                // each i18n resource file is defined as:
                // "ns": "json-file-name"
                // when loaded, each ns will convert into JSON object from defined file
                if(this.i18n) {
                    let i18ResFile = '';
                    for(let i18nNs in this.i18n) {
                        if (this.i18n.hasOwnProperty(i18nNs)) {
                            i18ResFile = this.$Type.getAssembly().getLocaleFilePath(this.locale(), this.i18n[i18nNs]);
                            this.i18n[i18nNs] = await clientFileLoader(i18ResFile); // this will load defined json file as json object here
                        }
                    }
                }
        
                // render
                // https://vuejs.org/v2/api/#render
                // https://vuejs.org/v2/guide/render-function.html#Functional-Components
                if (this.render && typeof this.render === 'function') {
                    component.render = this.render;
                }
        
                // functional
                // https://vuejs.org/v2/api/#functional
                // https://vuejs.org/v2/guide/render-function.html#Functional-Components
                if (typeof this.functional === 'boolean') { 
                    component.functional = this.functional;
                }
        
                // computed 
                // https://vuejs.org/v2/guide/computed.html#Computed-Properties
                // https://vuejs.org/v2/guide/computed.html#Computed-Setter
                // https://vuejs.org/v2/api/#computed
                if (this.computed) {
                    for(let p in this.computed) {
                        if (this.computed.hasOwnProperty(p)) {
                            component.computed = component.computed || {};
                            component.computed[p] = this.computed[p];
                        }
                    }
                }
                
                // state 
                // global state properties are added as computed properties
                // with get/set working over global ViewState store
                // each state property is defined as in the array
                // { "path": "path", "name": "name", "value": value }
                if(this.state && Array.isArray(this.state)) {
                    for(let p of this.state) {
                        if (component.computed[p.name]) { throw Exception.InvalidDefinition(`Computed (state) property already defined. (${p.name})`); }
                        component.computed = component.computed || {};
                        component.computed[p.name] = {
                            get: function() { return (viewState.get(p.path, p.name) || p.value); },
                            set: function(val) { viewState.set(p.path, p.name, val); }
                        };
                    }          
                }
        
                // methods
                // https://vuejs.org/v2/api/#methods
                if (this.methods) {
                    for(let m in this.methods) {
                        if (this.methods.hasOwnProperty(m)) {
                            component.methods = component.methods || {};
                            component.methods[m] = this.methods[m];
                        }
                    }
                }        
        
                // supporting built-in method: path 
                // this helps in building client side path nuances
                // e.g., {{ path('abc/xyz') }} will give: '/#/en/abc/xyz'
                // e.g., {{ path('abc/:xyz', { xyz: 1}) }} will give: '/#/en/abc/1'
                component.methods = component.methods || {};
                component.methods['path'] = (path, params) => { return _this.path(path, params); };
        
                // supporting built-in method: route
                // this helps in using path from route settings itself
                // e.g., {{ route('home') }} will give: '/#/en/'
                component.methods = component.methods || {};
                component.methods['route'] = (routeName, params) => { return _this.route(routeName, params); };
        
                // supporting util: stuff
                // this helps in using stuffing values in a string
                // e.g., {{ stuff('something %1, %2 and %3', A, B, C) }} will give: 'something A, B and C'
                component.methods = component.methods || {};
                component.methods['stuff'] = (str, ...args) => { return stuff(str, args); };
        
                // i18n specific built-in methods
                if (this.i18n) {
                    // supporting built-in method: locale 
                    // e.g., {{ locale() }} will give: 'en'
                    component.methods['locale'] = (value) => { return _this.locale(value); };
        
                    // supporting built-in method: i18n 
                    // e.g., {{ i18n('shared', 'OK', 'Ok!') }} will give: 'Ok' if this was the translation added in shared.json::OK key
                    component.methods['i18n'] = (ns, key, defaultValue) => {  
                        if (env.isDebug && defaultValue) { defaultValue = ':' + defaultValue + ':'; } // so it becomes visible that this is default value and string is not found
                        if (_this.i18n && _this.i18n[ns] && _this.i18n[ns][key]) {
                            return _this.i18n[ns][key] || defaultValue || '(i18n: 404)';
                        }
                        return defaultValue || '(i18n: 404)';
                    };
                }
        
                // watch
                // https://vuejs.org/v2/guide/computed.html#Computed-vs-Watched-Property
                // https://vuejs.org/v2/guide/computed.html#Watchers
                // https://vuejs.org/v2/api/#watch
                if (this.watch) {
                    for(let p in this.watch) {
                        if (this.watch.hasOwnProperty(p)) {
                            component.watch = component.watch || {};
                            component.watch[p] = this.watch[p];
                        }
                    }
                }
                
                // lifecycle
                // https://vuejs.org/v2/guide/instance.html#Instance-Lifecycle-Hooks
                // https://vuejs.org/v2/api/#Options-Lifecycle-Hooks
                if (this.lifecycle) {
                    for(let m in this.lifecycle) {
                        if (this.lifecycle.hasOwnProperty(m)) {
                            component[m] = this.lifecycle[m];
                        }
                    }
                }
        
                // components
                // each component in array is defined as:
                // { "name": "name", "type": "ns.typeName" }        
                // https://vuejs.org/v2/guide/components-registration.html#Local-Registration
                // https://vuejs.org/v2/api/#components
                if (this.components && Array.isArray(this.components)) {
                    let ComponentType = null,
                        componentObj = null;
                    for(let item of this.components) {
                        if (!item.name) { throw Exception.OperationFailed(`Component name cannot be empty. (${item.type})`); }
                        if (!item.type) { throw Exception.OperationFailed(`Component type cannot be empty. (${item.name})`); }
        
                        // check for duplicate (global)
                        if (Vue.options.components[item.name]) { throw Exception.Duplicate(`Component already registered. (${item.name})`); }
                        
                        ComponentType = as(await include(item.type), VueComponent);
                        if (ComponentType) {
                            try {
                                componentObj = new ComponentType();
        
                                // check for duplicate (local)
                                if (component.components && component.components[item.name]) { throw Exception.Duplicate(`Component already registered. (${item.name})`); }
        
                                // register locally
                                component.components = component.components || {};
                                component.components[item.name] = await componentObj.factory();
                            } catch (err) {
                                throw Exception.OperationFailed(`Component registration failed. (${item.type})`, err);
                            }
                        } else {
                            throw Exception.InvalidArgument(item.type);
                        }
                    }   
                }
        
                // mixins
                // each mixin in array is defined as:
                // { "name": "name", "type": "ns.typeName" }
                // https://vuejs.org/v2/guide/mixins.html
                // https://vuejs.org/v2/api/#mixins
                if (this.mixins && Array.isArray(this.mixins)) {
                    let MixinType = null,
                        mixin = null;
                    for(let item of this.mixins) {
                        if (!item.name) { throw Exception.OperationFailed(`Mixin name cannot be empty. (${item.type})`); }
                        if (!item.type) { throw Exception.OperationFailed(`Mixin type cannot be empty. (${item.name})`); }
        
                        MixinType = as(await include(item.type), VueMixin);
                        if (MixinType) {
                            try {
                                mixin = new MixinType();
        
                                // check for duplicate 
                                if (component.mixins && component.mixins[item.name]) { throw Exception.Duplicate(`Mixin already registered. (${item.name})`); }
        
                                // register locally
                                component.mixins = component.mixins || {};
                                component.mixins[item.name] = await mixin.factory();
                            } catch (err) {
                                throw Exception.OperationFailed(`Mixin registration failed. (${item.type})`, err);
                            }
                        } else {
                            throw Exception.InvalidArgument(item.type);
                        }
                    }
                }
        
                // directives
                // each directive in array is defined as:
                // { "name": "name", "type": "ns.typeName" }
                // https://vuejs.org/v2/guide/custom-directive.html
                // https://vuejs.org/v2/api/#directives
                if (this.directives && Array.isArray(this.directives)) {
                    let DirectiveType = null,
                    directive = null;
                    for(let item of this.directives) {
                        if (!item.name) { throw Exception.OperationFailed(`Directive name cannot be empty. (${item.type})`); }
                        if (!item.type) { throw Exception.OperationFailed(`Directive type cannot be empty. (${item.name})`); }
        
                        DirectiveType = as(await include(item.type), VueDirective);
                        if (DirectiveType) {
                            try {
                                directive = new DirectiveType();
        
                                // check for duplicate 
                                if (component.directives && component.directives[item.name]) { throw Exception.Duplicate(`Directive already registered. (${item.name})`); }
        
                                // register locally
                                component.directives = component.directives || {};
                                component.directives[item.name] = await directive.factory();
                            } catch (err) {
                                throw Exception.OperationFailed(`Directive registration failed. (${item.type})`, err);
                            }
                        } else {
                            throw Exception.InvalidArgument(item.type);
                        }
                    }
                }        
        
                // filters
                // each filter in array is defined as:
                // { "name": "name", "type": "ns.typeName" }
                // https://vuejs.org/v2/guide/filters.html
                // https://vuejs.org/v2/api/#filters
                if (this.filters && Array.isArray(this.filters)) {
                    let FilterType = null,
                        filter = null;
                    for(let item of this.filters) {
                        if (!item.name) { throw Exception.OperationFailed(`Filter name cannot be empty. (${item.type})`); }
                        if (!item.type) { throw Exception.OperationFailed(`Filter type cannot be empty. (${item.name})`); }
                        
                        FilterType = as(await include(item.type), VueFilter);
                        if (FilterType) {
                            try {
                                filter = new FilterType();
                                
                                // check for duplicate 
                                if (component.filters && component.filters[item.name]) { throw Exception.Duplicate(`Filter already registered. (${item.name})`); }
        
                                // register locally
                                component.filters = component.filters || {};
                                component.filters[item.name] = await filter.factory();
                            } catch (err) {
                                throw Exception.OperationFailed(`Filter registration failed. (${item.type})`, err);
                            }
                        } else {
                            throw Exception.InvalidArgument(item.type);
                        }
                    }             
                }
        
                // DI: provide and inject
                // https://vuejs.org/v2/guide/components-edge-cases.html#Dependency-Injection
                // https://vuejs.org/v2/api/#provide-inject
                // provided methods must be defined in this.methods
                // a shortcut is taken, so that method don't need to be define twice
                // therefore instead of defining provide as a function, define provide as an array
                // of method names, same as in inject elsewhere
                if (this.provide && Array.isArray(this.provide)) {
                    component.provide = this.provide;
                }
                if (this.inject && Array.isArray(this.inject)) {
                    component.inject = this.inject;
                }
        
                // done
                return component;
            };    
            
            $$('readonly');
            this.id = _thisId;
        
            $$('protected');
            this.locale = (value) => { return AppDomain.host().locale(value); };
        
            $$('protected');
            this.path = (path, params) => { return AppDomain.host().pathToUrl(path, params); };
            
            $$('protected');
            this.route = (routeName, params) => { return AppDomain.host().routeToUrl(routeName, params); };
        
            $$('protected');
            this.i18n = null;
        
            $$('protected');
            this.style = '';
        
            $$('protected');
            this.html = ''; 
        
            $$('protected');
            this.template = null;
        
            $$('protected');
            this.render = null;
        
            $$('protected');
            this.functional = false;    
        
            $$('protected');
            this.computed = null;
        
            $$('protected');
            this.state = null;
        
            $$('protected');
            this.methods = null;
        
            $$('protected');
            this.watch = null;    
        
            $$('protected');
            this.lifecycle = null;    
        
            $$('protected');
            this.components = null;
        
            $$('protected');
            this.mixins = null;    
        
            $$('protected');
            this.directives = null;     
        
            $$('protected');
            this.filters = null;      
            
            $$('protected');
            this.provide = null;
        
            $$('protected');
            this.inject = null;
        });
        
    })();    
    await (async () => { // type: ./src/flair.client/flair.app/ClientHost.js
        const Host = await include('flair.app.Host');
        const { ViewHandler, Page } = ns('flair.ui');
        
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
                    let pageSettings = settings.routing[`${mountName}-settings`];
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
    await (async () => { // type: ./src/flair.client/flair.boot.vue/VueSetup.js
        const Bootware = await include('flair.app.Bootware');
        
        /**
         * @name VueSetup
         * @description Vue initializer
         */
        $$('ns', 'flair.boot.vue');
        Class('VueSetup', Bootware, function() {
            $$('override');
            this.construct = (base) => {
                base('Vue Setup');
            };
        
            $$('override');
            this.boot = async (base) => {
                base();
        
                const Vue = await include('vue/vue{.min}.js');
                const { VueComponent, VueDirective, VueFilter, VueMixin, VuePlugin } = ns('flair.ui.vue');
                
                // setup Vue configuration, if any
                // TODO: (if any)
        
                // load Vue extensions
                // each plugin in array is defined as:
                // { "name": "name", "type": "ns.typeName", "options": {} }
                let extensions = settings.ui.vue.extensions,
                    ExtType = null,
                    ext = null;
                for (let item of extensions) {
                    if (!item.name) { throw Exception.OperationFailed(`Extension name cannot be empty. (${item.type})`); }
                    if (!item.type) { throw Exception.OperationFailed(`Extension type cannot be empty. (${item.name})`); }
                    
                    ExtType = await include(item.type);
                    if (as(ExtType, VueComponent)) {
                        try {
                            ext = new ExtType();
                            if (Vue.options.components[item.name]) { throw Exception.Duplicate(`Component already registered. (${item.name})`); } // check for duplicate
                            Vue.component(item.name, await ext.factory()); // register globally
                        } catch (err) {
                            throw Exception.OperationFailed(`Component registration failed. (${item.type})`, err);
                        }
                    } else if (as(ExtType, VueDirective)) {
                        try {
                            ext = new ExtType();
                            Vue.directive(item.name, await ext.factory()); // register globally
                        } catch (err) {
                            throw Exception.OperationFailed(`Directive registration failed. (${item.type})`, err);
                        }
                    } else if (as(ExtType, VueFilter)) {
                        try {
                            ext = new ExtType();
                            // TODO: prevent duplicate filter registration, as done for components
                            Vue.filter(item.name, await ext.factory());
                        } catch (err) {
                            throw Exception.OperationFailed(`Filter registration failed. (${item.type})`, err);
                        }                
                    } else if (as(ExtType, VueMixin)) {
                        try {
                            ext = new ExtType();
                            Vue.mixin(await ext.factory());
                        } catch (err) {
                            throw Exception.OperationFailed(`Mixin registration failed. (${item.type})`, err);
                        }
                    } else if (as(ExtType, VuePlugin)) {
                        try {
                            ext = new ExtType(item.name);
                            Vue.use(await ext.factory(), item.options || {});
                        } catch (err) {
                            throw Exception.OperationFailed(`Plugin registration failed. (${item.type})`, err);
                        }
                    } else {
                        throw Exception.InvalidArgument(item.type);
                    }
                }
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
    await (async () => { // type: ./src/flair.client/flair.ui/ViewTransition.js
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
    await (async () => { // type: ./src/flair.client/flair.boot/ClientRouter.js
        const Bootware = await include('flair.app.Bootware');
        
        /**
         * @name ClientRouter
         * @description Client Router Configuration Setup
         */
        $$('sealed');
        $$('ns', 'flair.boot');
        Class('ClientRouter', Bootware, function () {
            const { ViewHandler, ViewInterceptor } = ns('flair.ui');
        
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
        
                const runInterceptor = async (interceptor, ctx) => {
                    let ICType = as(await include(interceptor), ViewInterceptor);
                    if (ICType) {
                        let ic = new ICType();
                        await ic.run(ctx);
                    } else {
                        throw Exception.InvalidDefinition(`Invalid interceptor type. (${interceptor})`);
                    }                    
        
                };
                const runHandler = async (routeHandler, ctx) => {
                    let RouteHandler = as(await include(routeHandler), ViewHandler);
                    if (RouteHandler) {
                        let rh = new RouteHandler();
                        await rh.view(ctx);
                    } else {
                        throw Exception.InvalidDefinition(`Invalid route handler. (${routeHandler})`);
                    }
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
                        let mountInterceptors = settings.routing[`${mount.name}-interceptors`] || [];
                        for(let interceptor of mountInterceptors) {
                            await runInterceptor(interceptor, ctx);
                            if (ctx.$stop) { break; }
                        }
        
                        // handle route
                        if (!ctx.$stop) {
                            await runHandler(route.handler, ctx);
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
    await (async () => { // type: ./src/flair.client/flair.ui.vue/VueComponent.js
        const { VueComponentMembers } = ns('flair.ui.vue');
        
        /**
         * @name VueComponent
         * @description Vue Component
         */
        $$('ns', 'flair.ui.vue');
        Class('VueComponent', [VueComponentMembers], function() {
            this.factory = async () => {
                // shared between view and component both
                // coming from VueComponentMembers mixin
                let component = await this.define();
        
                // template
                // https://vuejs.org/v2/api/#template
                // built from html and css settings
                if (this.html) {
                    component.template = this.html.trim();
                }
        
                // props
                // https://vuejs.org/v2/guide/components-props.html
                // https://vuejs.org/v2/api/#props
                // these names can then be defined as attribute on component's html node
                if (this.props && Array.isArray(this.props)) {
                    component.props = this.props;
                }
        
                // data
                // https://vuejs.org/v2/api/#data
                if (this.data) { 
                    let _this = this;
                    if (typeof this.data === 'function') {
                        component.data = function() { return _this.data(); }
                    } else {
                        component.data = function() { return _this.data; }
                    }
                }
        
                // name
                // https://vuejs.org/v2/api/#name
                if (this.name) {
                    component.name = this.name;
                }
        
                // model
                // https://vuejs.org/v2/api/#model
                if (this.model) {
                    component.model = this.model;
                }
        
                // inheritAttrs
                // https://vuejs.org/v2/api/#inheritAttrs
                if (typeof this.inheritAttrs === 'boolean') { 
                    component.inheritAttrs = this.inheritAttrs;
                }
        
                // done
                return component;
            };
        
            $$('protectedSet');
            this.name = '';
        
            $$('protected');
            this.props = null;
        
            $$('protected');
            this.data = null;
        
            $$('protected');
            this.model = null;    
        
            $$('protected');
            this.inheritAttrs = null;
        });
        
    })();    
    await (async () => { // type: ./src/flair.client/flair.ui.vue/VueDirective.js
        /**
         * @name VueDirective
         * @description Vue Directive
         */
        $$('ns', 'flair.ui.vue');
        Class('VueDirective', function() {
            $$('virtual');
            $$('async');
            this.factory = noop;
        });
        
    })();    
    await (async () => { // type: ./src/flair.client/flair.ui.vue/VueFilter.js
        /**
         * @name VueFilter
         * @description Vue Filter
         */
        $$('ns', 'flair.ui.vue');
        Class('VueFilter', function() {
            $$('virtual');
            $$('async');
            this.factory = noop;
        });
        
    })();    
    await (async () => { // type: ./src/flair.client/flair.ui.vue/VueLayout.js
        const { ViewHandler } = ns('flair.ui');
        
        /**
         * @name VueLayout
         * @description Vue Layout
         *              It's purpose is mostly to define layout - so components can be places differently
         *              the html of the layout should not have anything else - no data binding etc.
         */
        $$('ns', 'flair.ui.vue');
        Class('VueLayout', function() {
            let _thisId = guid();
        
            $$('readonly');
            this.id = _thisId;
        
            $$('protected');
            this.html = '';
        
            $$('protected');
            this.style = '';
        
            // this is the "div-id" (in defined html) where actual view's html will come
            $$('protected');
            this.viewArea = 'view';
        
            // each area here can be as:
            // { "area: "", component": "", "type": "" } 
            // "area" is the placeholder-text where the component needs to be placed
            // "area" placeholder can be defined as: [[area_name]]
            // "component" is the name of the component
            // "type" is the qualified component type name
            $$('protectedSet');
            this.areas = [];
        
            this.merge = async (viewHtml) => {
                // get port
                let clientFileLoader = Port('clientFile');  
        
                // load style content in property
                if (this.style && this.style.endsWith('.css')) { // if style file is defined via $$('asset', '<fileName>'); OR directly name is written
                    // pick file from assets folder
                    this.style = this.$Type.getAssembly().getAssetFilePath(this.style);
                    // load file content
                    this.style = await clientFileLoader(this.style);
                }
                // load styles in dom - as scoped style
                if (this.style) {
                    this.style = replaceAll(this.style, '#SCOPE_ID', `#${_thisId}`); // replace all #SCOPE_ID with #<this_component_unique_id>
                    ViewHandler.addStyle(_thisId, this.style); // static method, that add this style in context of view-being-loaded
                }
        
                // load html content in property
                if (this.html && this.html.endsWith('.html')) { // if html file is defined via $$('asset', '<fileName>');  OR directly name is written
                    // pick file from assets folder
                    this.html = this.$Type.getAssembly().getAssetFilePath(this.html);
                    // load file content
                    this.html = await clientFileLoader(this.html);
                }
                // put entire html into a unique id div
                // even empty html will become an empty div here with ID - so it ensures that all layouts have a div
                this.html = `<div id="${_thisId}">${this.html}</div>`;            
        
                // inject components
                let layoutHtml = this.html;
                if (this.areas && Array.isArray(this.areas)) {
                    for(let area of this.areas) {
                        layoutHtml = replaceAll(layoutHtml, `[[${area.area}]]`, `<component is="${area.component}"></component>`);
                    }
                }       
        
                // inject view 
                layoutHtml = layoutHtml.replace(`[[${this.viewArea}]]`, viewHtml);
        
                // done
                return layoutHtml;
            };
        });
        
    })();    
    await (async () => { // type: ./src/flair.client/flair.ui.vue/VueMixin.js
        /**
         * @name VueMixin
         * @description Vue Mixin
         */
        $$('ns', 'flair.ui.vue');
        Class('VueMixin', function() {
            $$('virtual');
            $$('async');
            this.factory = noop;
        });
        
    })();    
    await (async () => { // type: ./src/flair.client/flair.ui.vue/VuePlugin.js
        /**
         * @name VuePlugin
         * @description Vue Plugin
         */
        $$('ns', 'flair.ui.vue');
        Class('VuePlugin', function() {
            $$('virtual');
            $$('async');
            this.factory = noop;
        });
        
    })();    
    await (async () => { // type: ./src/flair.client/flair.ui.vue/VueView.js
        const { ViewHandler } = ns('flair.ui');
        const { VueComponentMembers } = ns('flair.ui.vue');
        
        /**
         * @name VueView
         * @description Vue View
         */
        $$('ns', 'flair.ui.vue');
        Class('VueView', ViewHandler, [VueComponentMembers], function() {
            $$('private');
            this.factory = async () => {
                // merge layout's components
                // each area here can be as:
                // { "area: "", component": "", "type": "" } 
                // "area" is the div-id (in defined html) where the component needs to be placed
                // "component" is the name of the component
                // "type" is the qualified component type name      
                if (this.layout && this.layout.areas && Array.isArray(this.layout.areas)) {
                    this.components = this.components || [];
                    for(let area of this.layout.areas) {
                        // each component array item is: { "name": "name", "type": "ns.typeName" }
                        this.components.push({ name: area.component, type: area.type });
                    }
                }
        
                // shared between view and component both
                // coming from VueComponentMembers mixin
                let component = await this.define();
        
                // el
                // https://vuejs.org/v2/api/#el
                component.el = '#' + this.name;
        
                // propsData
                // https://vuejs.org/v2/api/#propsData
                if (this.propsData) {
                    component.propsData = this.propsData;
                }
        
                // data
                // https://vuejs.org/v2/api/#data
                if (this.data) {
                    if (typeof this.data === 'function') {
                        component.data = this.data();
                    } else {
                        component.data = this.data;
                    }
                }
        
                // done
                return component;
            };    
            
            $$('protected');
            $$('override');
            $$('sealed');
            this.onView = async (base, ctx, el) => {
                base();
        
                const Vue = await include('vue/vue{.min}.js');
        
                // get component
                let component = await this.factory();
        
                // set view Html
                let viewHtml = this.html || '';
                if (this.layout) {
                    el.innerHTML = await this.layout.merge(viewHtml);
                } else {
                    el.innerHTML = viewHtml;
                }            
        
                // setup Vue view instance
                new Vue(component);
            };
        
            $$('protected');
            this.el = null;
        
            $$('protected');
            this.propsData = null;
        
            $$('protected');
            this.data = null;
        
            $$('protected');
            this.layout = null;
        });
        
    })();
    // assembly types (end)
    
    // assembly embedded resources (start)
    // (not defined)
    // assembly embedded resources (end)        
    
    // clear assembly being loaded
    AppDomain.context.current().currentAssemblyBeingLoaded('');
    
    // register assembly definition object
    AppDomain.registerAdo('{"name":"flair.client","file":"./flair.client{.min}.js","package":"flairjs-fabric","desc":"Foundation for True Object Oriented JavaScript Apps","title":"Flair.js Fabric","version":"0.55.22","lupdate":"Fri, 09 Aug 2019 18:09:15 GMT","builder":{"name":"flairBuild","version":"1","format":"fasm","formatVersion":"1","contains":["init","func","type","vars","reso","asst","rout","sreg"]},"copyright":"(c) 2017-2019 Vikas Burman","license":"MIT","types":["flair.ui.ViewHandler","flair.ui.Page","flair.ui.vue.VueComponentMembers","flair.app.ClientHost","flair.boot.vue.VueSetup","flair.ui.ViewInterceptor","flair.ui.ViewState","flair.ui.ViewTransition","flair.boot.ClientRouter","flair.ui.vue.VueComponent","flair.ui.vue.VueDirective","flair.ui.vue.VueFilter","flair.ui.vue.VueLayout","flair.ui.vue.VueMixin","flair.ui.vue.VuePlugin","flair.ui.vue.VueView"],"resources":[],"assets":[],"routes":[]}');
    
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