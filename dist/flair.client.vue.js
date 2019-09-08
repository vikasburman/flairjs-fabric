/**
 * @preserve
 * Flair.js Fabric
 * Foundation for True Object Oriented JavaScript Apps
 * 
 * Assembly: flair.client.vue
 *     File: ./flair.client.vue.js
 *  Version: 0.59.21
 *  Sun, 08 Sep 2019 20:50:36 GMT
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
        root['flair.client.vue'] = factory;
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
    AppDomain.loadPathOf('flair.client.vue', __currentPath);
    
    // settings of this assembly
    let settings = JSON.parse('{"vue":{"extensions":[]},"layout":{"default":"","html2Layout":"flair.ui.VueLayout","viewAreaEl":"view"},"static":{"layout":"","i18n":""},"showdown":{}}');
    let settingsReader = flair.Port('settingsReader');
    if (typeof settingsReader === 'function') {
        let externalSettings = settingsReader('flair.client.vue');
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
    AppDomain.context.current().currentAssemblyBeingLoaded('./flair.client.vue{.min}.js');
    
    // assembly types (start)
        
    await (async () => { // type: ./src/flair.client.vue/flair.ui/@1-VueComponentMembers.js
        /**
         * @name VueComponentMembers
         * @description Vue Component Members
         */
        $$('ns', 'flair.ui');
		Mixin('VueComponentMembers' ,function() {
            var _this = this,
                _thisId = guid();
        
            $$('private');
            this.define = async (ctx) => {
                const Vue = await include('vue/vue{.min}.js');  
                const { ViewHandler, ViewState, VueFilter, VueMixin, VueDirective, VueComponent } = await ns('flair.ui');
        
                let viewState = new ViewState(),
                    component = {},
                    clientFileLoader = Port('clientFile'); 
        
                const setBase = async () => {
                    // set base, if not set already
                    // (generally in context of a derived class such as StaticView)
        
                    if (!this.baseName) {
                        let typeQualifiedName = this.$Type.getName(),
                            baseName = typeQualifiedName.substr(typeQualifiedName.lastIndexOf('.') + 1);
                        this.baseName = baseName;
                    }
        
                    if (!this.basePath) {
                        this.basePath = this.$Type.getAssembly().assetsPath();
                    }
        
                    if (!this.localePath) {
                        this.localePath = this.$Type.getAssembly().localesPath(); // note: this is without any specific locale
                    }
                };
                const autoWireHtmlCssAndData = async () => {
                    const getResIfDefined = (defString) => {
                        if (typeof defString === 'string' && defString.startsWith('res:')) { // its an embedded resource - res:<resTypeName>
                            let resTypeName = defString.substr(4); // remove res:
                            let res = AppDomain.context.current().getResource(resTypeName) || null;
                            return (res ? res.data : defString);
                        } else {
                            return defString;
                        }
                    };
        
                    // auto wire html and styles, if configured as 'true' - for making 
                    // it ready to pick from assets below
                    if (typeof this.style === 'boolean' && this.style === true) {
                        this.style = which(`./${this.baseName}/index{.min}.css`, true);
                    } else { // its an embedded resource - res:<resTypeName>
                        this.style = getResIfDefined(this.style);
                    }
                    if (typeof this.html === 'boolean' && this.html === true) {
                        this.html = which(`./${this.baseName}/index{.min}.html`, true);
                    } else { // its an embedded resource - res:<resTypeName>
                        this.html = getResIfDefined(this.html);
                    }
                    if (typeof this.data === 'boolean' && this.data === true) {
                        this.data = which(`./${this.baseName}/index{.min}.json`, true);
                    } else {
                        this.data = getResIfDefined(this.data);
                    }
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
                        this.style = replaceAll(this.style, '#SCOPE_ID', `#${_thisId}`); // replace all #SCOPE_ID with #<this_component_unique_id>
                        ViewHandler.addStyle(_thisId, this.style); // static method, that add this style in context of view-being-loaded
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
                    }
        
                    // put entire html into a unique id div
                    // even empty html will become an empty div here with ID - so it ensures that all components have a root div
                    this.html = `<div id="${_thisId}">${this.html}</div>`;
                };
                const loadData = async () => {
                    // load static data in property
                    // if json file is defined as text
                    if (typeof this.data === 'string' && this.data.endsWith('.json')) { 
                        // pick file from base path
                        // file is generally defined as ./fileName.json and this will replace it as: ./<basePath>/fileName.json
                        this.data = this.data.replace('./', this.basePath);
        
                        // load file content
                        this.data = await clientFileLoader(this.data); // <-- this gives parsed JSON object
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
                        for(let i18nNs in this.i18n) {
                            if (this.i18n.hasOwnProperty(i18nNs)) {
                                i18ResFile = this.i18n[i18nNs] || `./${i18nNs}.json`;
                                i18ResFile = i18ResFile.replace('./', this.localePath + this.locale() + '/');
                                this.i18n[i18nNs] = await clientFileLoader(i18ResFile); // this will load defined json file as json object here
                            }
                        }
                    }
                };
                const builtInComputed = async () => {
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
                };    
                const builtInMethods = async () => {
                    component.methods = component.methods || {};
        
                    // built-in method: path 
                    // this helps in building client side path nuances
                    // e.g., {{ path('abc/xyz') }} will give: '/#/en/abc/xyz'
                    // e.g., {{ path('abc/:xyz', { xyz: 1}) }} will give: '/#/en/abc/1'
                    component.methods['path'] = (path, params) => { return _this.path(path, params); };
        
                    // built-in method: route
                    // this helps in using path from route settings itself
                    // e.g., {{ route('home') }} will give: '/#/en/'
                    component.methods['route'] = (routeName, params) => { return _this.route(routeName, params); };
        
                    // built-in method: stuff
                    // this helps in using stuffing values in a string
                    // e.g., {{ stuff('something %1, %2 and %3', A, B, C) }} will give: 'something A, B and C'
                    component.methods['stuff'] = (str, ...args) => { return stuff(str, args); };
        
                    // i18n specific built-in methods
                    if (this.i18n) {
                        // built-in method: locale 
                        // e.g., {{ locale() }} will give: 'en'
                        component.methods['locale'] = (value) => { return _this.locale(value); };
        
                        // built-in method: i18n 
                        // e.g., {{ i18n('@strings.OK | Ok!') }} will give: '<whatever>' if this was the translation added in strings.json::OK key - ELSE it will give 'Ok!'
                        component.methods['i18n'] = (key) => { return _this.i18nValue(key); };
                    } 
                    
                    // built-in method: version 
                    // e.g., {{ version() }} will give: 'whatever'
                    component.methods['version'] = (value) => { return _this.version(value); };
        
                    // built-in method: ctx 
                    // this helps in getting context information
                    // e.g., {{ ctx('<propName>', 'defaultValue') }} will give: 'value of propName OR defaultValue'
                    component.methods['ctx'] = (prop, defaultValue) => { return (ctx ? (ctx[prop] || defaultValue) : defaultValue); };
                }; 
                const factory_render = async () => {
                    // render
                    // https://vuejs.org/v2/api/#render
                    // https://vuejs.org/v2/guide/render-function.html#Functional-Components
                    if (this.render && typeof this.render === 'function') {
                        component.render = this.render;
                    }
                };
                const factory_functional = async () => {
                    // functional
                    // https://vuejs.org/v2/api/#functional
                    // https://vuejs.org/v2/guide/render-function.html#Functional-Components
                    if (typeof this.functional === 'boolean') { 
                        component.functional = this.functional;
                    }
                };
                const factory_computed = async () => {
                    // computed 
                    // https://vuejs.org/v2/guide/computed.html#Computed-Properties
                    // https://vuejs.org/v2/guide/computed.html#Computed-Setter
                    // https://vuejs.org/v2/api/#computed
                    if (this.computed) {
                        for(let p in this.computed) {
                            if (this.computed.hasOwnProperty(p)) {
                                if (component.computed[p]) { throw Exception.InvalidDefinition(`Computed member already defined. (${p})`); }
                                component.computed = component.computed || {};
                                component.computed[p] = this.computed[p];
                            }
                        }
                    }
                };
                const factory_methods = async () => {
                    // methods
                    // https://vuejs.org/v2/api/#methods
                    if (this.methods) {
                        for(let m in this.methods) {
                            if (this.methods.hasOwnProperty(m)) {
                                if (component.methods[m]) { throw Exception.InvalidDefinition(`Method already defined. (${m})`); }
                                component.methods = component.methods || {};
                                component.methods[m] = this.methods[m];
                            }
                        }
                    } 
                };
                const factory_watch = async () => {
                    // watch
                    // https://vuejs.org/v2/guide/computed.html#Computed-vs-Watched-Property
                    // https://vuejs.org/v2/guide/computed.html#Watchers
                    // https://vuejs.org/v2/api/#watch
                    if (this.watch) {
                        for(let p in this.watch) {
                            if (this.watch.hasOwnProperty(p)) {
                                if (component.watch[p]) { throw Exception.InvalidDefinition(`Watch member already defined. (${p})`); }
                                component.watch = component.watch || {};
                                component.watch[p] = this.watch[p];
                            }
                        }
                    }
                };
                const factory_lifecycle = async () => {
                    // lifecycle
                    // https://vuejs.org/v2/guide/instance.html#Instance-Lifecycle-Hooks
                    // https://vuejs.org/v2/api/#Options-Lifecycle-Hooks
                    if (this.lifecycle) {
                        for(let m in this.lifecycle) {
                            if (this.lifecycle.hasOwnProperty(m)) {
                                if (component[m]) { throw Exception.InvalidDefinition(`Lifecycle hook already defined. (${m})`); }
                                component[m] = this.lifecycle[m];
                            }
                        }
                    }
                };
                const factory_local_components = async () => {
                    // local components
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
                                    component.components[item.name] = await componentObj.factory(ctx); // register with context
                                } catch (err) {
                                    throw Exception.OperationFailed(`Component registration failed. (${item.type})`, err);
                                }
                            } else {
                                throw Exception.InvalidArgument(item.type);
                            }
                        }   
                    }
                };
                const factory_local_mixins = async () => {
                    // local mixins
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
                };
                const factory_local_directives = async () => {
                    // local directives
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
                };
                const factory_local_filters = async () => {
                    // local filters
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
                };
                const factory_provide_inject = async () => {
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
                };
        
                // define        
                await setBase(); 
                await autoWireHtmlCssAndData();
                await loadStyle();
                await loadHtml();
                await loadData();
                await loadI18NResources();
                await builtInComputed();
                await builtInMethods();
                await factory_render();
                await factory_functional();
                await factory_computed();
                await factory_methods();
                await factory_watch();
                await factory_lifecycle();
                await factory_local_components();
                await factory_local_mixins();
                await factory_local_directives();
                await factory_local_filters();
                await factory_provide_inject();
        
                // done
                return component;
            };    
            
            $$('readonly');
            this.id = _thisId;
        
            $$('protected');
            this.baseName = '';
        
            $$('protected');
            this.basePath = '';
        
            $$('protected');
            this.localePath = '';    
        
            $$('protected');
            this.locale = (value) => { return AppDomain.host().locale(value, true); };
        
            $$('protected');
            this.version = (value) => { return AppDomain.host().version(value, true); };
        
            $$('protected');
            this.path = (path, params) => { return AppDomain.host().pathToUrl(path, params); };
            
            $$('protected');
            this.route = (routeName, params) => { return AppDomain.host().routeToUrl(routeName, params); };
        
            $$('protected');
            this.i18n = null;
        
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
            this.style = null;
        
            $$('protected');
            this.html = null; 
        
            $$('protected');
            this.data = null;
        
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
    await (async () => { // type: ./src/flair.client.vue/flair.ui/@2-VueView.js
        const { ViewHandler } = await ns('flair.ui');
        const { VueComponentMembers } = await ns('flair.ui');
        
        /**
         * @name VueView
         * @description Vue View
         */
        $$('ns', 'flair.ui');
		Class('VueView' ,ViewHandler, [VueComponentMembers], function() {
            $$('private');
            this.factory = async (ctx) => {
                let component = null,
                    clientFileLoader = Port('clientFile');
        
                const autoWireAndLoadLayout = async () => {
                    let isHtml = false,
                        htmlContent = '';
                    if (typeof this.layout === 'boolean' && this.layout === true) { // pick default layout from settings, if required
                        this.layout = settings.layout.default || null; // the qualified type name
                    } else if (typeof this.layout === 'string') {
                        if (this.layout.startsWith('res:')) { // its an embedded resource (html) - res:<resTypeName>
                            let resTypeName = this.layout.substr(4); // remove res:
                            let res = AppDomain.context.current().getResource(resTypeName) || null;
                            isHtml = res && res.data;
                            if (isHtml) {
                                htmlContent = res.data;
                                this.layout = settings.layout.html2Layout; // default type, which will load given html
                            }
                        } else if (this.layout.endsWith('.html')) { // its an asset file
                            isHtml = true;
                            let htmlFile = which(this.layout.replace('./', this.basePath), true);
                            htmlContent = await clientFileLoader(htmlFile);
                            this.layout = settings.layout.html2Layout; // default type, which will load given html
                        } else { // its qualified type name
                            // let it be as is
                        }
                    }
                    // load layout first, if only layout type name is given (e.g., in case it was picked from settings as above)
                    if (typeof this.layout === 'string') {
                        let layoutType = await include(this.layout);
                        if (layoutType) {
                            if (isHtml) {
                                this.layout = new layoutType(htmlContent);
                            } else {
                                this.layout = new layoutType(); // note: this means only those layouts which do not require constructor arguments are suitable for this auto-wiring
                            }
                        } else {
                            throw Exception.NotFound(`Layout not found. (${this.layout})`);
                        }
                    }
        
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
                };
                const factory_component = async () => {
                    // shared between view and component both
                    // coming from VueComponentMembers mixin
                    component = await this.define(ctx);
                };
                const setTitle = async () => {
                    // set title 
                    this.title = this.i18nValue(this.title);
                };
                const factory_el = async () => {
                    // el
                    // https://vuejs.org/v2/api/#el
                    component.el = '#' + this.name;
                };
                const factory_propsData = async () => {
                    // propsData
                    // https://vuejs.org/v2/api/#propsData
                    if (this.propsData) {
                        component.propsData = this.propsData;
                    }
                };
                const factory_data = async () => {
                    // data
                    // https://vuejs.org/v2/api/#data
                    if (this.data) {
                        if (typeof this.data === 'function') {
                            component.data = this.data();
                        } else {
                            component.data = this.data;
                        }
                    }
                };
        
                await autoWireAndLoadLayout();
                await factory_component();
                await setTitle();
                await factory_el();
                await factory_propsData();
                await factory_data();
        
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
                let component = await this.factory(ctx);
        
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
            this.layout = null;
        });
        
    })();    
    await (async () => { // type: ./src/flair.client.vue/flair.ui/StaticView.js
        const { VueView } = await ns('flair.ui');
        
        /**
         * @name StaticView
         * @description Static View
         */
        $$('ns', 'flair.ui');
		Class('StaticView' ,VueView, function() {
            $$('override');
            this.construct = (base, staticFile) => {
                base(staticFile);
        
                // if identified as static by base class
                if (this.isStatic) { 
                    // set layout
                    this.layout = settings.layout.static || null;
        
                    // set paths
                    this.basePath = this.staticRoot;
                    this.localePath = this.basePath + 'locales/';
        
                    // static file can be localized as well, hence its name can be:
                    // ./path/file.xml : Will be resolved with ./path/file.xml
                    // OR 
                    // ./path/file{.en}.xml <-- yes: {.en} is a placeholder for chosen locale: Will be resolved with ./path/file.<locale>.xml
                    if (this.staticFile.indexOf('{.en}') !== -1) {
                        this.staticFile = this.staticFile.replace('{.en}', '.' + this.locale()); // whatever locale is currently selected
                    }
                }
            };
        
            $$('protected');
            $$('override');
            this.loadStaticFile = async (base, ctx) => {
                base(ctx);
        
                // read static file and load all required elements here
                // static file is supposed to be an XML file having following format
                // <page title="" layout="" i18n="">
                //  <data><![CDATA[ ... ]]></data>
                //  <html type="md"><![CDATA[ ... ]]></html>
                //  <style><![CDATA[ ... ]]></style>
                // </page>
                //  
                // Root note must be called: static
                //  root node can have optional attributes:
                //      title - this is loaded on this.title
                //      layout - this is loaded on this.layout
                //      i18n - this is loaded on this.i18n
                // data node is optional and can have a JSON structure wrapped in a CDATA section
                //  this will be loaded as static data in this.data
                // html node is mandatory and can have following wrapped in a CDATA section
                //  the html to be loaded
                //  OR
                //  the markdown to be loaded after converting to html
                //      when markdown is given, type attribute with 'md' must be added
                // style node is optional and can have style definitions wrapped in a CDATA section
                let clientFileLoader = Port('clientFile'),
                    staticFileContent = '',
                    xmlDoc = null,
                    tag_page = null,
                    tag_html = null,
                    tag_html_attr_type = null,
                    html_content = '',
                    tag_style = null,
                    tag_data = null,
                    dp = new DOMParser();
        
                // load file
                staticFileContent = await clientFileLoader(this.staticFile);
                xmlDoc = dp.parseFromString(staticFileContent, 'text/xml');
        
                // read structure
                tag_page = xmlDoc.getElementsByTagName('page')[0];
                tag_html = tag_page.getElementsByTagName('html')[0];
                tag_style = tag_page.getElementsByTagName('style')[0];
                tag_data = tag_page.getElementsByTagName('data')[0];
        
                // settings
                this.title = tag_page.getAttribute('title') || '';
                this.layout = tag_page.getAttribute('layout') || settings.static.layout || null;
                this.i18n = tag_page.getAttribute('i18n') || settings.static.i18n || null;
                
                // style
                this.style = tag_style ? tag_style.firstChild.data.trim() : null;
                
                // data
                this.data = tag_data ? JSON.parse(tag_data.firstChild.data.trim()) : null;
        
                // html
                tag_html_attr_type = (tag_html ? tag_html.getAttribute('type') || '' : '');
                html_content = (tag_html ? tag_html.firstChild.data.trim() : '');
                if (tag_html_attr_type === 'md') {
                    const showdown = await include('showdown/showdown{.min}.js');
                    let converter = new showdown.Converter(settings.showdown);
                    this.html = converter.makeHtml(html_content);
                } else {
                    this.html = html_content;
                }
            };
        });
        
    })();    
    await (async () => { // type: ./src/flair.client.vue/flair.ui/VueComponent.js
        const { VueComponentMembers } = await ns('flair.ui');
        
        /**
         * @name VueComponent
         * @description Vue Component
         */
        $$('ns', 'flair.ui');
		Class('VueComponent' ,[VueComponentMembers], function() {
            let _this = this;
        
            this.factory = async (ctx) => {
                // shared between view and component both
                // coming from VueComponentMembers mixin
                let component = await this.define(ctx);
        
                const factory_template = async () => {
                    // template
                    // https://vuejs.org/v2/api/#template
                    // built from html and css settings
                    if (this.html) {
                        component.template = this.html.trim();
                    }
                };
                const factory_props = async () => {
                    // props
                    // https://vuejs.org/v2/guide/components-props.html
                    // https://vuejs.org/v2/api/#props
                    // these names can then be defined as attribute on component's html node
                    if (this.props && Array.isArray(this.props)) {
                        component.props = this.props;
                    }
                };
                const factory_data = async () => {
                    // data
                    // https://vuejs.org/v2/api/#data
                    if (this.data) { 
                        if (typeof this.data === 'function') {
                            component.data = function() { return _this.data(); }
                        } else {
                            component.data = function() { return _this.data; }
                        }
                    }
                };
                const factory_name = async () => {
                    // name
                    // https://vuejs.org/v2/api/#name
                    if (this.name) {
                        component.name = this.name;
                    }
                };
                const factory_model = async () => {
                    // model
                    // https://vuejs.org/v2/api/#model
                    if (this.model) {
                        component.model = this.model;
                    }
                };
                const factory_inheritAttrs = async () => {
                    // inheritAttrs
                    // https://vuejs.org/v2/api/#inheritAttrs
                    if (typeof this.inheritAttrs === 'boolean') { 
                        component.inheritAttrs = this.inheritAttrs;
                    }
                };
        
                await factory_template();
                await factory_props();
                await factory_data();
                await factory_name();
                await factory_model();
                await factory_inheritAttrs();
        
                // done
                return component;
            };
        
            $$('protectedSet');
            this.name = '';
        
            $$('protected');
            this.props = null;
        
            $$('protected');
            this.model = null;    
        
            $$('protected');
            this.inheritAttrs = null;
        });
        
    })();    
    await (async () => { // type: ./src/flair.client.vue/flair.ui/VueDirective.js
        /**
         * @name VueDirective
         * @description Vue Directive
         */
        $$('ns', 'flair.ui');
		Class('VueDirective' ,function() {
            $$('virtual');
            $$('async');
            this.factory = noop;
        });
        
    })();    
    await (async () => { // type: ./src/flair.client.vue/flair.ui/VueFilter.js
        /**
         * @name VueFilter
         * @description Vue Filter
         */
        $$('ns', 'flair.ui');
		Class('VueFilter' ,function() {
            $$('virtual');
            $$('async');
            this.factory = noop;
        });
        
    })();    
    await (async () => { // type: ./src/flair.client.vue/flair.ui/VueLayout.js
        const { ViewHandler } = await ns('flair.ui');
        
        /**
         * @name VueLayout
         * @description Vue Layout
         *              It's purpose is mostly to define layout - so components can be places differently
         *              the html of the layout should not have anything else - no data binding etc.
         */
        $$('ns', 'flair.ui');
		Class('VueLayout' ,function() {
            let _thisId = guid();
        
            $$('virtual');
            this.construct = (html) => {
                if (!html) {
                    this.viewArea = settings.layout.viewAreaEl || 'view';
                } else { // process html to load 
                    // html that can be loaded here can be of following format
                    // [[header:CommonHeader:myapp.shared.views.CommonHeader]]
                    // <div class="container">
                    //  [[view]]
                    // </div>
                    // [[footer:CommonFooter:myapp.shared.views.CommonFooter]]
                    // which means, all areas can have in-place configuration as:
                    //  areaName:componentName:componentTypeName
                    //  view area will only have the areaName - and that's how it is identified that it is view area
                    // and set accordingly. If there are more than one such areas where only area-name is given, first one will
                    // be taken as view area and rest will be ignored and not processed at all
                    // if there is any error in layout html definition, it will just load view without layout
                    let startPos = 0,
                        isViewAreaDefined = false,
                        htmlLength = html.length;
                    while(true) { // eslint-disable-line no-constant-condition
                        if (startPos >= htmlLength) { break; }
                    
                        // get next start
                        let startIdx = html.indexOf('[[', startPos); 
                        if (startIdx === -1) { break; }
        
                        // get end of this start
                        let endIdx = html.indexOf(']]', startIdx); 
                        if (endIdx === -1 && (startIdx + 1) < htmlLength) { 
                            html = '[[view]]';
                            this.viewArea = 'view';
                            break; 
                        }
                        startPos = endIdx + 1;
        
                        // get definition
                        let areaDef = html.substr(startIdx + 2, ((endIdx - startIdx) - 2)); // remove [[ and ]]
                        let items = areaDef.split(':');
                        if (items.length === 1) {
                            if (!isViewAreaDefined) {
                                isViewAreaDefined = true;
                                this.viewArea = items[0].trim();
                            } else {
                                // ignore this definition
                            }
                        } else {
                            if (items.length === 3) { // areaName:componentName:componentType
                                this.areas.push({ area: items[0].trim(), component: items[1].trim(), type: items[2].trim() });
                                html = html.substr(0, startIdx + 2) + items[0].trim() + html.substr(endIdx);
                            }
                        }
                    }
                    this.html = html;
                }
            };
        
            this.merge = async (viewHtml) => {
                let layoutHtml = '',
                    clientFileLoader = Port('clientFile');  
        
                const setBase = async () => {
                    if (!this.baseName) {
                        let typeQualifiedName = this.$Type.getName(),
                            baseName = typeQualifiedName.substr(typeQualifiedName.lastIndexOf('.') + 1);
                        this.baseName = baseName;
                    }
        
                    if (!this.basePath) {
                        this.basePath = this.$Type.getAssembly().assetsPath();
                    }
                };        
                const autoWireHtmlAndCss = async () => {
                    const getResIfDefined = (defString) => {
                        if (typeof defString === 'string' && defString.startsWith('res:')) { // its an embedded resource - res:<resTypeName>
                            let resTypeName = defString.substr(4); // remove res:
                            let res = AppDomain.context.current().getResource(resTypeName) || null;
                            return (res ? res.data : defString);
                        } else {
                            return defString;
                        }
                    };
        
                    // auto wire html and styles, if configured as 'true' - for making 
                    // it ready to pick from assets below
                    if (typeof this.style === 'boolean' && this.style === true) {
                        this.style = which(`./${this.baseName}/index{.min}.css`, true);
                    } else { // its an embedded resource - res:<resTypeName>
                        this.style = getResIfDefined(this.style);
                    }
                    if (typeof this.html === 'boolean' && this.html === true) {
                        this.html = which(`./${this.baseName}/index{.min}.html`, true);
                    } else { // its an embedded resource - res:<resTypeName>
                        this.html = getResIfDefined(this.html);
                    }
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
                        this.style = replaceAll(this.style, '#SCOPE_ID', `#${_thisId}`); // replace all #SCOPE_ID with #<this_component_unique_id>
                        ViewHandler.addStyle(_thisId, this.style); // static method, that add this style in context of view-being-loaded
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
                    }
        
                    // put entire html into a unique id div
                    // even empty html will become an empty div here with ID - so it ensures that all components have a root div
                    this.html = `<div id="${_thisId}">${this.html}</div>`;
                };      
                const injectComponents = async () => {
                    // inject components
                    layoutHtml = this.html;
                    if (layoutHtml && this.areas && Array.isArray(this.areas)) {
                        for(let area of this.areas) {
                            layoutHtml = replaceAll(layoutHtml, `[[${area.area}]]`, `<component is="${area.component}"></component>`);
                        }
                    }       
                };
                const injectView = async () => {
                    // inject view
                    if (layoutHtml) {
                        layoutHtml = layoutHtml.replace(`[[${this.viewArea}]]`, viewHtml);
                    }
                };
        
                await setBase();
                await autoWireHtmlAndCss();
                await loadStyle();
                await loadHtml();
                await injectComponents();
                await injectView();
        
                // done
                return layoutHtml;
            };
        
            $$('readonly');
            this.id = _thisId;
        
            $$('protected');
            this.baseName = '';
        
            $$('protected');
            this.basePath = '';
        
            $$('protected');
            this.html = null;
        
            $$('protected');
            this.style = null;
        
            // this is the "div-id" (in defined html) where actual view's html will come
            $$('protected');
            $$('readonly');
            this.viewArea = '';
        
            // each area here can be as:
            // { "area: "", component": "", "type": "" } 
            // "area" is the placeholder-text where the component needs to be placed
            // "area" placeholder can be defined as: [[area_name]]
            // "component" is the name of the component
            // "type" is the qualified component type name
            $$('protectedSet');
            this.areas = [];    
        });
        
    })();    
    await (async () => { // type: ./src/flair.client.vue/flair.ui/VueMixin.js
        /**
         * @name VueMixin
         * @description Vue Mixin
         */
        $$('ns', 'flair.ui');
		Class('VueMixin' ,function() {
            $$('virtual');
            $$('async');
            this.factory = noop;
        });
        
    })();    
    await (async () => { // type: ./src/flair.client.vue/flair.ui/VuePlugin.js
        /**
         * @name VuePlugin
         * @description Vue Plugin
         */
        $$('ns', 'flair.ui');
		Class('VuePlugin' ,function() {
            $$('virtual');
            $$('async');
            this.factory = noop;
        });
        
    })();    
    await (async () => { // type: ./src/flair.client.vue/flair.boot/@@1-VueSetup.js
        const { Bootware } = await ns('flair.app');
        
        /**
         * @name VueSetup
         * @description Vue initializer
         */
        $$('ns', 'flair.boot');
		Class('VueSetup' ,Bootware, function() {
            $$('override');
            this.construct = (base) => {
                base('Vue Setup');
            };
        
            $$('override');
            this.boot = async (base) => {
                base();
        
                const Vue = await include('vue/vue{.min}.js');
                const { VueComponent, VueDirective, VueFilter, VueMixin, VuePlugin } = await ns('flair.ui');
        
                // setup Vue configuration, if any
                // TODO: (if any)
        
                // load Vue extensions
                // each plugin in array is defined as:
                // { "name": "name", "type": "ns.typeName", "options": {} }
                let extensions = settings.vue.extensions,
                    ExtType = null,
                    ext = null;
                for (let item of extensions) {
                    if (!item.name) { throw Exception.OperationFailed(`Extension name cannot be empty. (${item.type})`); }
                    if (!item.type) { throw Exception.OperationFailed(`Extension type cannot be empty. (${item.name})`); }
                    
                    ExtType = await include(item.type);
                    if (as(ExtType, VueComponent)) { // global components
                        try {
                            ext = new ExtType();
                            if (Vue.options.components[item.name]) { throw Exception.Duplicate(`Component already registered. (${item.name})`); } // check for duplicate
                            Vue.component(item.name, await ext.factory()); // register globally (without any context)
                        } catch (err) {
                            throw Exception.OperationFailed(`Component registration failed. (${item.type})`, err);
                        }
                    } else if (as(ExtType, VueDirective)) { // directives
                        try {
                            ext = new ExtType();
                            Vue.directive(item.name, await ext.factory()); // register globally
                        } catch (err) {
                            throw Exception.OperationFailed(`Directive registration failed. (${item.type})`, err);
                        }
                    } else if (as(ExtType, VueFilter)) { // filters
                        try {
                            ext = new ExtType();
                            // TODO: prevent duplicate filter registration, as done for components
                            Vue.filter(item.name, await ext.factory());
                        } catch (err) {
                            throw Exception.OperationFailed(`Filter registration failed. (${item.type})`, err);
                        }                
                    } else if (as(ExtType, VueMixin)) { // mixins
                        try {
                            ext = new ExtType();
                            Vue.mixin(await ext.factory());
                        } catch (err) {
                            throw Exception.OperationFailed(`Mixin registration failed. (${item.type})`, err);
                        }
                    } else if (as(ExtType, VuePlugin)) { // plugins
                        try {
                            ext = new ExtType(item.name);
                            Vue.use(await ext.factory(), item.options || {});
                        } catch (err) {
                            throw Exception.OperationFailed(`Plugin registration failed. (${item.type})`, err);
                        }
                    } else { // unknown
                        throw Exception.InvalidArgument(item.type);
                    }
                }
            };   
        });
        
    })();
    // assembly types (end)
    
    // assembly embedded resources (start)
    // (not defined)
    // assembly embedded resources (end)        
    
    // clear assembly being loaded
    AppDomain.context.current().currentAssemblyBeingLoaded();
    
    // register assembly definition object
    AppDomain.registerAdo('{"name":"flair.client.vue","file":"./flair.client.vue{.min}.js","package":"flairjs-fabric","desc":"Foundation for True Object Oriented JavaScript Apps","title":"Flair.js Fabric","version":"0.59.21","lupdate":"Sun, 08 Sep 2019 20:50:36 GMT","builder":{"name":"flairBuild","version":"1","format":"fasm","formatVersion":"1","contains":["init","func","type","vars","reso","asst","rout","sreg"]},"copyright":"(c) 2017-2019 Vikas Burman","license":"MIT","types":["flair.ui.VueComponentMembers","flair.ui.VueView","flair.ui.StaticView","flair.ui.VueComponent","flair.ui.VueDirective","flair.ui.VueFilter","flair.ui.VueLayout","flair.ui.VueMixin","flair.ui.VuePlugin","flair.boot.VueSetup"],"resources":[],"assets":[],"routes":[]}');
    
    // assembly load complete
    if (typeof onLoadComplete === 'function') { 
        onLoadComplete();   // eslint-disable-line no-undef
    }
    
    // return settings and config
    return Object.freeze({
        name: 'flair.client.vue',
        settings: settings,
        config: config
    });
});