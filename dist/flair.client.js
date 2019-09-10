/**
 * @preserve
 * Flair.js Fabric
 * Foundation for True Object Oriented JavaScript Apps
 * 
 * Assembly: flair.client
 *     File: ./flair.client.js
 *  Version: 0.59.32
 *  Tue, 10 Sep 2019 00:51:24 GMT
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
    let settings = JSON.parse('{"view":{"mainEl":"main","viewEl":"view","transition":"","handler":"flair.ui.vue.VueView","layout":{"client":"","server":"","static":""},"routes":{"home":"","notfound":""}},"i18n":{"lang":{"default":"en","locales":[{"code":"en","name":"English","native":"English"}]}},"routing":{"mounts":{"main":"/"},"all":{"before":{"settings":[{"name":"hashbang","value":false},{"name":"sensitive","value":false}],"interceptors":[]},"after":{"settings":[],"interceptors":[]}}}}');
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
        
    await (async () => { // type: ./src/flair.client/flair.ui/@1-ViewComponentMembers.js
        const { ViewComponent } = await ns('flair.ui');
        
        /**
         * @name ViewComponentMembers
         * @description View Component Members
         */
        $$('ns', 'flair.ui');
		Mixin('ViewComponentMembers', function() {
            let abortControllers = {},
                _thisId = guid(),
                clientFileLoader = Port('clientFile'),
                _inViewName = ''; 
        
            $$('protected');
            this.name = '';
        
            $$('readonly');
            this.id = '';
        
            $$('readonly');
            this.inViewName = ''
        
            $$('protected');
            this.host = null; // for view, this is view itself; for component this is hosting component
        
            $$('protected');
            this.html = null;
        
            $$('protected');
            this.style = null;
        
            $$('protected');
            this.data = null;
        
            $$('protected');
            this.baseName = '';
        
            $$('protected');
            this.basePath = '';
        
            $$('protected');
            this.localePath = '';   
            
            $$('protected');
            this.components = {};     
        
            $$('protected');
            this.i18n = null;
            
            $$('private');
            this.init = async (inViewName, $mainType) => {
                _inViewName = inViewName || '';
                this.inViewName = _inViewName;
                this.id = _thisId;
        
                // give implementation a chance to define some of it before defaults here
                await this.beforeInit($mainType);
        
                // give it a unique name, if not already given
                this.name = this.name || $mainType.getName(true); // $mainType is actually this.$Type of view/component which is finally being instantiated
        
                // set baseName
                if (!this.baseName) {
                    let typeQualifiedName = $mainType.getName(),
                        baseName = typeQualifiedName.substr(typeQualifiedName.lastIndexOf('.') + 1);
                    this.baseName = baseName;
                }
        
                // set paths
                if (!this.basePath) {
                    this.basePath = $mainType.getAssembly().assetsPath();
                }
                if (!this.localePath) {
                    this.localePath = $mainType.getAssembly().localesPath(); // note: this is without any specific locale
                }
        
                // give implementation a chance to define some of it after defaults here
                await this.afterInit($mainType);
        
                // initialize html/style/json content
                this.initContent();
        
                // initialize layout and merge view with layout
                await this.assembleView();        
            };
        
            $$('private');
            this.initContent = async () => {
                const autoWireHtmlCssAndJson = async () => {
                    // auto wire html and styles, if configured as 'true' - for making 
                    // it ready to pick from assets folder
                    if (typeof this.style === 'boolean' && this.style === true) {
                        this.style = which(`./${this.baseName}/index{.min}.css`, true);
                    } else { // its an embedded resource - res:<resTypeName> OR direct string or null
                        this.style = this.getResIfDefined(this.style);
                    }
                    if (typeof this.html === 'boolean' && this.html === true) {
                        this.html = which(`./${this.baseName}/index{.min}.html`, true);
                    } else { // its an embedded resource - res:<resTypeName> OR direct string or null
                        this.html = this.getResIfDefined(this.html);
                    }
                    if (typeof this.data === 'boolean' && this.data === true) {
                        this.data = which(`./${this.baseName}/index{.min}.json`, true);
                    } else { // its an embedded resource - res:<resTypeName> OR direct string or null
                        this.data = this.getResIfDefined(this.data);
                    }
                };
                const loadHtml = async () => {
                    // load html content in property
                    // if html file is defined as text
                    if (typeof this.html === 'string' && this.html.endsWith('.html')) { 
                        // pick file from base path
                        // file is generally defined as ./fileName.html and this will replace it as: ./<basePath>/fileName.html
                        this.html = this.html.replace('./', this.basePath);
        
                        // load file content
                        this.html = await clientFileLoader(this.html);
        
                        // extract content from loaded html
                        let content = this.extractContent(this.html);
                        if (content.data) { this.data = content.data; } // if data was defined inside html give it a precedence and overwrite, even if defined earlier
                        if (content.style) { this.style = content.style; } // if style was defined inside html give it a precedence and overwrite, even if defined earlier
                        this.html = content.html || ''; // set just the html as defined
                    }
        
                    // put entire html into a unique id div
                    // even empty html will become an empty div here with ID - so it ensures that all components have a root div and SCOPED styles for same ID are applied rightly as well here under
                    this.html = `<div id="${_thisId}">${this.html}</div>`;
                };        
                const loadStyle = async () => {
                    // load style content in property
                    // if style file name is defined as text
                    if (typeof this.style === 'string' && this.style.endsWith('.css')) { 
                        // pick file from base path
                        // file is generally defined as ./fileName.css and this will replace it as: ./<basePath>/fileName.css
                        this.style = this.style.replace('./', this.basePath);
                        
                        // load file content
                        this.style = await clientFileLoader(this.style);
                    }
        
                    // load styles in dom - as scoped style
                    if (this.style) {
                        let styleId = `${_inViewName}_${_thisId}`;
                        let style = replaceAll(this.style, '#SCOPE_ID', `#${styleId}`); // replace all #SCOPE_ID with #<this_view_or_component_unique_id>
                        this.addStyle(style, styleId);
                    }            
                };
                const loadJson = async () => {
                    // load static data in property
                    // if json file is defined as text
                    if (typeof this.data === 'string') { 
                        if (this.data.endsWith('.json')) {
                            // pick file from base path
                            // file is generally defined as ./fileName.json and this will replace it as: ./<basePath>/fileName.json
                            this.data = this.data.replace('./', this.basePath);
        
                            // load file content
                            this.data = await clientFileLoader(this.data); // <-- this gives parsed JSON object
                        } else { // JSON string 
                            this.data = JSON.parse(this.data);
                        } // else either not defined OR defined as object itself
                    }
                };        
                const loadI18NResources = async () => {
                    // load i18n resources
                    // each i18n resource file is defined as:
                    // { "ns": "json-file-name", "ns2": "", ... }
                    // OR 
                    // 'ns, ns1' - if json-file-name is same as ns suffixed with .json
                    // which means: 'ns' will become './ns.json' and 'ns1' will become './ns1,json'
                    // when loaded, each ns will convert into JSON object from defined file
                    if(this.i18n) {
                        let i18ResFile = '';
                        if (typeof this.i18n === 'string') {
                            let nsItems = this.i18n.split(',');
                            this.i18n = {}; // set it as empty object
                            for(let nsItem of nsItems) {
                                this.i18n[nsItem.trim()] = false; // so in next loop, it gets replaced with default auto-wired value
                            }
                        }
                        let localizedPath = this.localePath + this.locale() + '/';
                        for(let i18nNs in this.i18n) {
                            if (this.i18n.hasOwnProperty(i18nNs)) {
                                i18ResFile = this.i18n[i18nNs] || `./${i18nNs}.json`;
                                i18ResFile = i18ResFile.replace('./', localizedPath);
                                this.i18n[i18nNs] = await clientFileLoader(i18ResFile); // this will load defined json file as json object here
                            }
                        }
                    }
                };
        
                await autoWireHtmlCssAndJson();
                await loadHtml();
                await loadStyle();
                await loadJson();
                await loadI18NResources();
            };
        
            $$('private');
            this.load = async (ctx, el) => {
                // give implementation a chance to do something before
                await this.beforeLoad(ctx, el);
        
                await this.onLoad(ctx, el); // actual load process
        
                // give implementation a chance to do something after
                await this.afterLoad(ctx, el);
            };
        
            $$('protected');
            $$('virtual');
            this.onLoad = async (ctx, el) => {
                // in case of Vue or any other library is used, 
                // this method will be redone in derived class
                el.innerHTML = this.html;
        
                // extract all components and load their view as well
                let components = this.getComponents(el),
                    cEl = null,
                    cType = null,
                    cObj = null;
                for (let comp of components) {
                    if (!this.components[comp.name]) { // ignore duplicates
                        cEl = el.getElementById(comp.id);
                        if (cEl) { 
                            cType = as(await include(comp.type), ViewComponent);
                            if (cType) { 
                                cObj = new cType();
                                if (cObj) { 
                                    this.components[comp.name] = cObj.view(_inViewName, ctx, cEl, comp.params);
                                }
                            }
                        }
                    }
                }
        
                // update html
                this.html = el.innerHTML; // since components might have updated the html
            }; 
        
            $$('protected');
            this.getComponents = (el) => {
                let components = [];
                if (el) {
                    let elements = this.extractComponents(el);
                    components = elements.components;
                } else {
                    let content = this.extractContent(this.html);
                    components = content.elements.components;
                }
                return components;
            };
        
            $$('private');
            this.addStyle = (style, _id) => {
                if (style) {
                    let styleEl = window.document.createElement('style');
                    styleEl.id = _id || `${_inViewName}_${_thisId}`;
                    styleEl.type = 'text/css';
                    styleEl.appendChild(window.document.createTextNode(style));
                    window.document.head.appendChild(styleEl);
                }
            };  
            
            $$('private');
            this.getResIfDefined = (defString) => {
                if (typeof defString === 'string' && defString.startsWith('res:')) { // its an embedded resource - res:<resTypeName>
                    let resTypeName = defString.substr(4); // remove res:
                    let res = AppDomain.context.current().getResource(resTypeName) || null;
                    return (res ? res.data : defString);
                } else {
                    return defString;
                }
            };
        
            $$('private');
            this.extractContent = (html) => {
                let doc = null,
                    content = {
                        html: null,
                        style: null,
                        data: null,
                        elements: {
                            components: [], 
                            view: null
                        },
                        updatedHtml: () => { return doc.body.innerHTML; }
                    };
        
                // an html definition can be of multiple forms
                // 1. standard html
                //  <!doctype html>
                //  <html>
                //      <head>...</head>
                //      <body>...</body>
                //  </html>
                //
                // 2. view fragments in assets or embedded resource
                //  <html>...</html>
                //  OR
                //  direct any tag
                //
                // 3. static views
                //  <style>...</style>
                //  <data>...</data>
                //  <html>...</html>
                //  
                // 4. layout structure
                //  <style>...</style>
                //  <html>...</html>
                //
                // 5. markdown / text
                //  ...text...
        
                let docParser = new window.DOMParser();
                doc = docParser.parseFromString(html, 'text/html');
        
                // delete all script tags, so nothing left inside body
                let scripts = doc.getElementsByTagName('script');
                if (scripts) {
                    for(let s of scripts) { s.parentNode.remove(s); }
                }
        
                // pick first style and then delete all style tags, so nothing left inside
                let styles = doc.getElementsByTagName('style');
                if (styles) {
                    if (styles.length > 0) {
                        content.style = styles[0].innerHTML;
                        for(let s of styles) { s.parentNode.remove(s); }
                    }
                }
        
                // pick first data and then delete all data tags, so nothing left inside
                let data = doc.getElementsByTagName('data');
                if (data) {
                    if (data.length > 0) {
                        content.data = data[0].innerHTML;
                        for(let d of data) { d.parentNode.remove(d); }
                    }
                }
        
                // find all component holders
                content.elements = this.extractComponents(doc.body);
        
                // pick clean html from body
                content.html = doc.body.innerHTML;
        
                return content;
            };  
            
            $$('private');
            this.extractComponents = (el) => {
                // components can be defined in html anywhere as:
                //  <comp type="<quaklified-type-name-of-component>" "params"="...">
                // a special component that will hold view - (in case of layout only) - will have a type same as viewEl setting
                let elements = {
                    components: [],
                    view: null
                };
        
                let comps = el.getElementsByTagName('comp');
                if (comps) {
                    let typeValue = '',
                        viewContainerTypeValue = settings.view.viewEl || 'view';
                    for(let cm of comps) { 
                        typeValue = cm.getAttribute('type');
                        if (typeValue !== '') {
                            if (typeValue === viewContainerTypeValue) {
                                if (!elements.view) { elements.view = cm; } // pick first one only
                            } else { // add to components
                                let _id = cm.getAttribute('id'),
                                    _type = cm.getAttribute('type') || '',
                                    _params = cm.getAttribute('params') || '',
                                    _name = cm.getAttribute('name');
                                if (!_id) { // give it a new id
                                    _id = guid();
                                    cm.setAttribute('id', _id); 
                                }
                                if (!_name) {
                                    _name = replaceAll(_type, '.', '_');
                                    cm.setAttribute('name', _name); 
                                }
                                elements.components.push({
                                    id: _id, 
                                    name: _name, 
                                    type: _type,
                                    params: _params
                                });
                            }
                        }
                    }
                }
        
                return elements;
            };
        
            $$('protected');
            this.locale = (value) => { return AppDomain.host().locale(value, true); };
        
            $$('protected');
            this.version = (value) => { return AppDomain.host().version(value, true); };
        
            $$('protected');
            this.path = (path, params) => { return AppDomain.host().pathToUrl(path, params); };
            
            $$('protected');
            this.route = (routeName, params) => { return AppDomain.host().routeToUrl(routeName, params); };
        
            $$('protected');
            this.i18nValue = (key) => {
                let value = key || '',
                    notFoundRepresentative = (env.isDebug ? ':' : '');
        
                // key can also be defined as: 
                //  @i18nNs.keyName | default value
                //  the value
                if (key && key.startsWith('@')) {
                    key = key.substr(1); // remove @
                    let keyItems = key.split('|');
                    key = keyItems[0].trim();
                    value = keyItems[1].trim() || '';
                    if (this.i18n) {
                        value = lens(this.i18n, key) || (notFoundRepresentative + value + notFoundRepresentative);
                        // Note: notFoundRepresentative is added, to visually display in debug mode that key was defined, but key not found in json
                    }
                }
                return value || '(i18n: 404)'; // finally if no default was defined
            };    
        
            $$('protected');
            this.cancelLoadData = async () => {
                let abortController = null;
                for(let handleId in abortControllers) {
                    if (abortControllers.hasOwnProperty(handleId)) {
                        try {
                            abortController = abortControllers[handleId];
                            if (abortController) { abortController.abort(); }
                        } catch (err) { // eslint-disable-line no-unused-vars
                            // ignore
                        }
                    }
                }
                abortControllers = {}; // reset
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
            this.beforeLoad = noop;
        
            $$('protected');
            $$('virtual');
            $$('async');
            this.afterLoad = noop;
            
            $$('protected');
            $$('virtual');
            $$('async');
            this.loadData = noop;     
        });
    })();    
    await (async () => { // type: ./src/flair.client/flair.ui/@2-ViewTransition.js
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
    await (async () => { // type: ./src/flair.client/flair.ui/@3-ViewTypes.js
        /**
         * @name ViewTypes
         * @description ViewTypes enum
         */
        $$('ns', 'flair.ui');
		Enum('ViewTypes', function() {
            this.Client = 0;
            this.Server = 1;
            this.Static = 2;
        });
        
    })();    
    await (async () => { // type: ./src/flair.client/flair.ui/@4-ViewHandler.js
        const { Handler, ViewTypes } = await ns('flair.app');
        
        /**
         * @name ViewHandler
         * @description GUI View Handler
         */
        $$('ns', 'flair.ui');
		Class('ViewHandler', Handler, function() {
            $$('override');
            this.construct = (base, route) => {
                base(route);
        
                // view type
                this.type = route.type || ViewTypes.Client;
        
                // static/server context
                if (!this.type === ViewTypes.Client) {
                    this.path = route.handler;
                    this.connection = route.connection || '';
                }
            };
        
            $$('readonly');
            this.type = -1;
        
            $$('protected');
            this.path = '';
        
            $$('protected');
            this.connection = '';
        
            $$('protected');
            $$('virtual');
            $$('async');
            this.loadView = noop;
        
            this.view = async (ctx) => { await this.loadView(ctx); }
        });
        
    })();    
    await (async () => { // type: ./src/flair.client/flair.ui/@5-View.js
        const { ViewTypes, ViewHandler, ViewTransition, ViewComponentMembers } = await ns('flair.ui');
        
        /**
         * @name View
         * @description GUI View
         */
        $$('ns', 'flair.ui');
		Class('View', ViewHandler, [ViewComponentMembers], function() {
            let mainEl = '',
                viewEl = '';
        
            $$('override');
            this.construct = (base, route) => {
                base(route);
        
                // host
                this.host = this;
        
                // settings
                mainEl = settings.view.mainEl || 'main';
                viewEl = settings.view.viewEl || 'view';
                this.viewTransition = settings.view.transition || '';
            };
        
            $$('privateSet');
            this.viewTransition = '';
        
            $$('protected');
            this.layout = '';
        
            $$('protectedSet');
            this.title = '';
        
            // each meta in array can be defined as:
            // { "<nameOfAttribute>": "<contentOfAttribute>", "<nameOfAttribute>": "<contentOfAttribute>", ... }
            $$('protectedSet');
            this.meta = null;
        
            $$('protected');
            $$('override');
            $$('sealed');
            this.loadView = async (base, ctx) => {
                this.$static.outView = this.$static.currentView;
                this.$static.inView = this;
        
                // call base
                base(ctx);
        
                // initialize in context of this type
                await this.init(this.$static.inView.name, this.$Type);
        
                // add view el to parent
                let el = null,
                    parentEl = DOC.getElementById(mainEl);
                if (!this.$static.outView || this.$static.outView.name !== this.$static.inView.name) { // if same view is already loaded, don't add again
                    el = DOC.createElement('div');
                    el.id = this.name;
                    el.setAttribute('hidden', '');
                    parentEl.appendChild(el);
                } else {
                    el = DOC.getElementById(this.name);
                }
                
                // view
                await this.load(ctx, el);
        
                // swap views (old one is replaced with this new one)
                await this.swap();
        
                // now initiate async server data load process, this may take long
                // therefore any must needed data should be loaded either in beforeLoad 
                // or afterLoad functions, anything that can wait still when UI is visible
                // should be loaded here
                // corresponding cancel operations must also be written in cancelLoadData
                // NOTE: this does not wait for completion of this async method
                this.loadData(ctx);  
        
                // remove all styles related to outview 
                if (this.$static.outView && this.$static.outView.name !== this.$static.inView.name) { // if not the same view and there was an outview
                    let styles = document.head.getElementsByTagName('style');
                    if (styles && styles.length > 0) {
                        let styleId = '';
                        for(let s of styles) {
                            styleId = s.getAttribute('id') || '';
                            if (styleId.startsWith(this.$static.outView.name)) { // member of this view
                                s.parentNode.remove(s); // remove this style
                            }
                        }
                    }
                }
            
                // reset
                this.$static.outView = null;
                this.$static.inView = null;        
            };
        
            $$('protected');
            this.assembleView = async () => {
                let clientFileLoader = Port('clientFile');
                const autoWireAndLoadLayout = async () => {
                    // layout will always be an html (direct) OR an html file as asset or embedded resource
                    // with embedded styles in itself having SCOPED styles
                    if (typeof this.layout === 'boolean' && this.layout === true) { // pick default layout from settings
                        switch(this.type) {
                            case ViewTypes.Client: settings.view.layout.client || ''; break;
                            case ViewTypes.Server: settings.view.layout.server || ''; break;
                            case ViewTypes.Static: settings.view.layout.static || ''; break;
                        }
                    }
                    if (typeof this.layout === 'string') {
                        if (this.layout.startsWith('res:')) { //  its an embedded resource - res:<resTypeName>
                            this.layout = this.getResIfDefined(this.layout);
                        } else if (this.layout.endsWith('.html')) { // its html file
                            // pick file from base path
                            // file is generally defined as ./fileName.html and this will replace it as: ./<basePath>/fileName.html
                            this.layout = this.layout.replace('./', this.basePath);
                            
                            // load file content
                            this.layout = await clientFileLoader(this.layout);
                        } else { // direct string
                            // already loaded
                        }
                    }
                    if (!this.layout) { // nothing defined
                        this.layout = `<div type="${viewEl}"></div>`; // bare minimum layout, so at least view is loaded 
                    }
                };
                const mergeLayoutWithView = async () => {
                    // a layout html is defined as (sample):
                    // <style>
                    //  #SCOPE_ID .div {
                    //      ...  
                    //  }
                    // </style>
                    // <html>
                    //  <div type="ns.Header" "params"=""></div>
                    //  <div class="container">
                    //      <div type="<viewEl>"></div>
                    //  </div>
                    //  <div type="ns.Footer"></div>
                    // </html>
        
                    // extract content from htmls
                    let content = this.extractContent(this.layout);
        
                    // load layout style if defined
                    if (content.style) {
                        let layoutStyleId = `${this.$static.inView.name}_${this.id}_LAYOUT`;
                        let style = replaceAll(content.style, '#SCOPE_ID', `#${layoutStyleId}`); // replace all #SCOPE_ID with #<this_view_unique_id>_LAYOUT
                        this.addStyle(style, layoutStyleId);
                    }
        
                    // embed view's html inside layout html
                    if (content.html) {
                        if (content.elements.view) { // if view element is available
                            content.elements.view.innerHTML = this.html;
                        }
                        this.html = content.updatedHtml(); // merged html
                    }
                };
                
                await autoWireAndLoadLayout();
                await mergeLayoutWithView();
            };
        
            $$('private');
            this.swap = async () => {
                let thisViewEl = DOC.getElementById(this.name);
        
                // outgoing view
                if (this.$static.outView) {
                    let currentViewEl = DOC.getElementById(this.$static.outView.name);
        
                    // if incoming view is not same as outgoing view
                    if (this.$static.outView.name !== this.$static.inView.name) {
                        // remove outgoing view meta
                        if (this.$static.outView.meta) {
                            for(let meta of this.$static.outView.meta) {
                                DOC.head.removeChild(DOC.querySelector('meta[name="' + meta + '"]'));
                            }
                        }
        
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
                if (!this.$static.outView || this.$static.outView.name !== this.$static.inView.name) {
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
                    if (!this.$static.outView && thisViewEl) {
                        thisViewEl.hidden = false;
                    }
                }
        
                // update title
                this.title = this.i18nValue(this.title);
                DOC.title = this.title;
        
                // set new current
                this.$static.currentView = this;
            };
        
            $$('protected');
            $$('virtual');
            this.beforeInit = async ($mainType) => { // eslint-disable-line no-unused-vars
                // load view transition
                if (this.viewTransition) {
                    let ViewTransitionType = as(await include(this.viewTransition), ViewTransition);
                    if (ViewTransitionType) {
                        this.viewTransition = new ViewTransitionType();
                    } else {
                        this.viewTransition = '';
                    }
                }
                
                // static file localization
                if (this.type === ViewTypes.Static) {
                    // static file can be localized as well, hence its name can be:
                    // ./path/file.xml : Will be resolved with ./path/file.xml
                    // OR 
                    // ./path/file{.en}.xml <-- yes: {.en} is a placeholder for chosen locale: Will be resolved with ./path/file.<locale>.xml
                    if (this.path.indexOf('{.en}') !== -1) {
                        this.path = this.path.replace('{.en}', '.' + this.locale()); // whatever locale is currently selected
                    }
                }
        
                // static file / server view name, base and paths
                if (this.type === ViewTypes.Static || this.type === ViewTypes.Server) {
                    // in this case it will be considered from route's qualified name
                    // which essentially tells which assembly this static file / server view is part of and hence 
                    // assets and locales are to be here available locally itself
        
                    // baseName
                    if (!this.baseName) {
                        let typeQualifiedName = this.route.name,
                            baseName = typeQualifiedName.substr(typeQualifiedName.lastIndexOf('.') + 1);
                        this.baseName = baseName;
                    }
        
                    // basePath
                    if (!this.basePath) {
                        this.basePath = this.route.getAssembly().assetsPath();
                    }            
        
                    // locale path
                    if (!this.localePath) {
                        this.localePath = this.route.getAssembly().localesPath(); // note: this is without any specific locale
                    }
                }
            };
        
            $$('protected');
            $$('virtual');
            this.afterInit = async ($mainType) => { // eslint-disable-line no-unused-vars
                const loadStaticFile = async () => {
                    let clientFileLoader =  Port('clientFile'),
                        fileContent = '';
                    try {
                        fileContent = await clientFileLoader(this.path); // it can be any file: html, md, txt -- all will be loaded as html and content will be extracted
                    } catch (err) {
                        fileContent = err.toString();
                    }
                    return fileContent;
                };
                const loadServerView = async () => {
                    let serverContent = '';
                     try {
                        // TODO: read server view
                        // make a fetch call after building the url to fetch - server will be configured to handle this route 
                        // via ViewHandler which will return the text of html
                         // TODO:
                    } catch (err) {
                        serverContent = err.toString();
                    }
                    return serverContent;
                };
        
                // static/server file/view load support
                // fetch, parse and load content here
                let rawContent = '';
                if (this.type === ViewTypes.Static) { 
                    rawContent = await loadStaticFile(); 
                } else if (this.type === ViewTypes.Server) { 
                    rawContent = await loadServerView(); 
                }
                let content = this.extractContent(rawContent);
                if (content.style) { this.style = content.style; }
                if (content.data) { this.data = content.data; }
                if (content.html) { this.html = content.html; }
            };
        
            $$('static');
            this.currentView = null
        
            $$('static');
            this.inView = null    
        
            $$('static');
            this.outView = null    
        });
        
    })();    
    await (async () => { // type: ./src/flair.client/flair.ui/@6-ViewComponent.js
        const { ViewComponentMembers } = await ns('flair.ui');
        
        /**
         * @name ViewComponent
         * @description View Component
         */
        $$('ns', 'flair.ui');
		Class('ViewComponent', [ViewComponentMembers], function() {
            let _inViewName = '';
        
            this.view = async (inViewName, ctx, el, params) => { 
                _inViewName = inViewName || '';
        
                // params which are embedded in params="" attribute in html. 
                // Note: This gives a chance to setup each component differently at design time
                // params can be defined as:
                // one string - will be loaded as array
                // comma delimited string - will be loaded as array
                // json structure - that starts and ends with [ ] or { }
                // an object itself
                if (typeof params === 'string') {
                    params = params.trim();
                    if ((params.startsWith('[') && this.params.endsWith(']')) || (params.startsWith('{') && this.params.endsWith('}'))) { // json
                        this.params = JSON.params(params);
                    } else { // string or string array
                        this.params = params.split(',');
                    }
                } else if (typeof params === 'object') {
                    this.params = params; // as is
                }
        
                // load view of the component
                await this.loadView(ctx, el); 
        
                // return view component object
                // that may get created in process 
                // this is useful when a system like Vue is being used
                // otherwise return this component itself
                return this.viewComponentObject || this;
            }
        
            $$('protected');
            this.params = null;
        
            $$('protected');
            this.viewComponentObject = null;
        
            $$('protected');
            this.loadView = async (ctx, el) => {
                 // initialize in context of this type
                await this.init(_inViewName, this.$Type);
        
                // view
                await this.load(ctx, el);
        
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
            this.assembleView = noop;    
        
            $$('protected');
            $$('virtual');
            $$('async');
            this.beforeInit = noop;
        
            $$('protected');
            $$('virtual');
            $$('async');
            this.afterInit = noop;   
        });
    })();    
    await (async () => { // type: ./src/flair.client/flair.ui/@7-Page.js
        /**
         * @name Page
         * @description Page routing (inspired from (https://www.npmjs.com/package/page))
         */
        $$('sealed');
        $$('ns', 'flair.ui');
		Class('Page', function() {
            let handlers = [],
                defaultHandler;
        
            this.construct = (options, params) => {
                // any path can be built using 
        
                // settings
                this.params = params || '';
                this.hasbang = options.hasbang || false;
                this.base = options.base || '';
                this.sensitive = options.sensitive || false;
        
                // ensure base has start '/' and no end '/'
                if (this.base.endsWith('/')) { this.base = this.base.substr(0, this.base.length - 1); }
                if (!this.base.startsWith('/')) { this.base = '/' + this.base; }
            };
        
            $$('readonly');
            this.hasbang = false;
        
            $$('readonly');
            this.params = '';
        
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
                    locale: '',
                    version: '',
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
        
                        // set known mount params, if required
                        if (this.params) {
                            let p = '';
                            p = ':version'; if (this.params.indexOf(p) !== -1 && parts.params['version']) { parts.version = parts.params['version']; }
                            p = ':locale'; if (this.params.indexOf(p) !== -1 && parts.params['locale']) { parts.locale = parts.params['locale']; }
                        }
        
                        // done
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
        
                // add mount params next to base
                if (this.params) {
                    let mountParams = this.params;
                    if (mountParams.startsWith('/')) { mountParams = mountParams.substr(1); }
                    url += mountParams;
        
                    // add known mount params value to params
                    // Note: All unknown mount params - means other than locale and version, whatever is
                    // added in mount params - must be passed in params from outside
                    // Note: For known mount params, this will always overwrite from what is set in env, so new URL can be built
                    params = params || {};
                    let p = '';
                    p = ':version'; if (mountParams.indexOf(p) !== -1) { params['version'] = AppDomain.host().version(); }
                    p = ':locale'; if (mountParams.indexOf(p) !== -1) { params['locale'] = AppDomain.host().locale(); }
                }
        
                // add path after base (and mountParams, if applicable)
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
        
            this.add = (route, handler) => {
                let routePath = route.path;
        
                // modify route path to add mount params, other than base
                if (this.params) { // mount specific params are defined
                    let newRoutePath = this.params;
                    if (!newRoutePath.startsWith('/')) { newRoutePath = '/' + newRoutePath; } // add first /
                    if (!newRoutePath.endsWith('/')) { newRoutePath = newRoutePath + '/'; } // add last /
                    newRoutePath += routePath; // add route path
                    routePath = newRoutePath.replace('//', '/'); // replace // with / (just in case)
                }
        
                let keys = []; // contains { name: name, index: indexPosition }
                handlers.push({
                    route: route,
                    path: routePath,
                    keys: keys,
                    regex: this.pathToRegExp(routePath, keys),
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
                    $locale: '',
                    $version: '',
                    $path: '',
                    $stop: false,  // if no further processing to be done
                    $redirect: {
                        route: '',
                        params: {}
                    } // route to redirect to
                };
        
                // get path parts
                let parts = this.breakUrl(url),
                    params = parts.params;
                
                // enrich ctx
                ctx.$locale = parts.locale;
                ctx.$version = parts.version;
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
                        if (parts.locale) { 
                            AppDomain.host().locale(parts.locale); // this will set only if changed
                        }
        
                        // set version
                        if (parts.version) { 
                            AppDomain.host().version(parts.version); // this will set only if changed
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
    await (async () => { // type: ./src/flair.client/flair.boot/ClientRouter.js
        const { Bootware } = await ns('flair.app');
        const { ViewTypes, ViewHandler, ViewInterceptor } = await ns('flair.ui');
        
        /**
         * @name ClientRouter
         * @description Client Router Configuration Setup
         */
        $$('sealed');
        $$('ns', 'flair.boot');
		Class('ClientRouter', Bootware, function() {
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
        
                const runInterceptors = async (ctx) => {
                    // run mount specific interceptors
                    // each interceptor is derived from ViewInterceptor and
                    // async run method of it takes ctx, can update it
                    // each item is: "InterceptorTypeQualifiedName"
                    let mountInterceptors = this.getMountSpecificSettings('interceptors', settings.routing, mount.name);
                    for(let ic of mountInterceptors) {
                        let ICType = as(await include(ic), ViewInterceptor);
                        if (!ICType) { throw Exception.InvalidDefinition(`Invalid interceptor type. (${ic})`); }
                        
                        await new ICType().run(ctx);
                        if (ctx.$stop) { break; } // break, if someone forced to stop 
                    }
                };
                const runHandler = async (route, routeHandler, ctx) => {
                    if (route.type && route.type !== ViewTypes.Client) {
                        routeHandler = settings.view.handler || ''; // use default handler
                    }
        
                    // get route handler
                    let RouteHandler = as(await include(routeHandler), ViewHandler);
                    if (RouteHandler) {
                        let rh = new RouteHandler(route);
                        await rh.view(ctx);
                    } else {
                        throw Exception.InvalidDefinition(`Invalid route handler. (${routeHandler})`);
                    }
                };
                const chooseRouteHandler = (route) => {
                    if (typeof route.handler === 'string') { return route.handler; }
                    return route.handler[AppDomain.app().getRoutingContext(route.name)] || '**undefined**';
                };
                const getHandler = (route) => {
                    return async (ctx) => {
                        // ctx.params has all the route parameters.
                        // e.g., for route "/users/:userId/books/:bookId" ctx.params will 
                        // have "ctx.params: { "userId": "34", "bookId": "8989" }"
                        // it supports everything in here: https://www.npmjs.com/package/path-to-regexp
        
                        // run interceptors
                        await runInterceptors(ctx);
        
                        // handle route
                        if (!ctx.$stop) {
                            // route.handler can be defined as:
                            // string: 
                            //      qualified type name of the handler (e.g., abc.xyz)
                            //          one limitation is that the name of the type cannot ends with '.xml' (or configured fileExt)
                            //      OR
                            //      static view name - ends with '.xml' (or configured fileExt) (e.g., ./about.xml or ./path/contact.xml)
                            //          this XML file must be present in on specified path under configured 'static' root folder
                            // object: { "routingContext": "handler", ...}
                            //      routingContext can be any value that represents a routing context for whatever situation 
                            //      this is read from App.getRoutingContext(routeName) - where some context string can be provided - 
                            //      basis it will pick required handler from here some examples of handlers can be:
                            //          mobile | tablet | tv  etc.  - if some routing is to be based on device type
                            //          free | freemium | full  - if some routing is to be based on license model
                            //          guest | auth - if different view is to be loaded for when its guest user or an authorized user
                            //          anything else
                            //  this gives a handy way of diverting some specific routes while rest can be as is - statically defined
                            let routeHandler = chooseRouteHandler(route);
                            await runHandler(route, routeHandler, ctx);
                        }
                    };
                };
                const addHandler = (app, route) => {
                    app.add(route, getHandler(route));
                };
        
                // add routes related to current mount
                let app = mount.app;
                for (let route of routes) {
                    // route.mount can be one string or an array of strings - in that case, same route will be mounted to multiple mounts
                    if ((typeof route.mount === 'string' && route.mount === mount.name) || (route.mount.indexOf(mount.name) !== -1)) { // add route-handler
                        if (route.name !== settings.view.routes.notfound) { // add all except the 404 route
                            addHandler(app, route);
                        } 
                    }
                }
        
                // catch 404 for this mount
                app.add404(async (ctx) => {
                    // 404 handler does not run interceptors
                    // and instead of running the route (for which this ctx was setup)
                    // it will pick the handler of notfound route and show that view with this ctx
                    let route404 = settings.view.routes.notfound;
                    if (route404) { route404 = AppDomain.context.current().getRoute(route404); }
                    if (!route404) { // break it here
                        alert(`404: ${ctx.$url} not found.`); // eslint-disable-line no-alert
                        setTimeout(() => { window.history.back(); }, 0);
                        return;
                    }
        
                    // use route404 handler
                    await runHandler(route404.handler, ctx);
                });
            };
        });
    })();    
    await (async () => { // type: ./src/flair.client/flair.app/ClientHost.js
        const { Host } = await ns('flair.app');
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
            this.routeToUrl = (route, params) => {
                if (!route) { return null; }
        
                // get route object
                let routeObj = AppDomain.context.current().getRoute(route); // route = qualifiedRouteName
                if (!routeObj) {
                    return replaceAll(route, '.', '_'); // convert route qualified name in a non-existent url, so it will automatically go to notfound view
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
                        await this.redirect(settings.view.routes.home, {}, true); // force refresh but don't let history entry added for first page
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
    AppDomain.registerAdo('{"name":"flair.client","file":"./flair.client{.min}.js","package":"flairjs-fabric","desc":"Foundation for True Object Oriented JavaScript Apps","title":"Flair.js Fabric","version":"0.59.32","lupdate":"Tue, 10 Sep 2019 00:51:24 GMT","builder":{"name":"flairBuild","version":"1","format":"fasm","formatVersion":"1","contains":["init","func","type","vars","reso","asst","rout","sreg"]},"copyright":"(c) 2017-2019 Vikas Burman","license":"MIT","types":["flair.ui.ViewComponentMembers","flair.ui.ViewTransition","flair.ui.ViewTypes","flair.ui.ViewHandler","flair.ui.View","flair.ui.ViewComponent","flair.ui.Page","flair.boot.ClientRouter","flair.app.ClientHost","flair.ui.ViewInterceptor","flair.ui.ViewState"],"resources":[],"assets":[],"routes":[]}');
    
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