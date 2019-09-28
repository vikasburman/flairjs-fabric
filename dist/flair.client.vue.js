/**
 * @preserve
 * Flair.js Fabric
 * Foundation for True Object Oriented JavaScript Apps
 * 
 * Assembly: flair.client.vue
 *     File: ./flair.client.vue.js
 *  Version: 0.60.36
 *  Sat, 28 Sep 2019 15:50:58 GMT
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

    // assembly closure: init (start)
    /* eslint-disable no-unused-vars */
    
    // flair types, variables and functions
    const { Class, Struct, Enum, Interface, Mixin, Aspects, AppDomain, $$, InjectedArg, bring, Container, include, Port, on, post, telemetry,
            Reflector, Serializer, Tasks, as, is, isDefined, isComplies, isDerivedFrom, isAbstract, isSealed, isStatic, isSingleton, isDeprecated,
            isImplements, isInstanceOf, isMixed, getAssembly, getAttr, getContext, getResource, getRoute, getType, ns, getTypeOf,
            getTypeName, typeOf, dispose, using, Args, Exception, noop, nip, nim, nie, event } = flair;
    const { TaskInfo } = flair.Tasks;
    const { env } = flair.options;
    const { guid, stuff, replaceAll, splitAndTrim, findIndexByProp, findItemByProp, which, isArrowFunc, isASyncFunc, sieve,
            deepMerge, getLoadedScript, b64EncodeUnicode, b64DecodeUnicode, lens, globalSetting } = flair.utils;
    
    // access to DOC
    const DOC = ((env.isServer || env.isWorker) ? null : window.document);
    
    // current for this assembly
    const __currentContextName = AppDomain.context.current().name;
    const __currentFile = __asmFile;
    const __currentPath = __currentFile.substr(0, __currentFile.lastIndexOf('/') + 1);
    AppDomain.loadPathOf('flair.client.vue', __currentPath);
    
    // settings of this assembly
    let settings = JSON.parse('{"vue":{"extensions":[]},"showdown":{}}');
    let settingsReader = Port('settingsReader');
    if (typeof settingsReader === 'function') {
        let externalSettings = settingsReader('flair.client.vue');
        if (externalSettings) { settings = deepMerge([settings, externalSettings], false); }
    }
    settings = Object.freeze(settings);
    
    // config of this assembly
    let config = JSON.parse('{}');
    config = Object.freeze(config);
    
    /* eslint-enable no-unused-vars */
    // assembly closure: init (end)
    
    // assembly closure: global functions (start)
    // (not defined)
    // assembly closure: global functions (end)
    
    // set assembly being loaded
    AppDomain.context.current().currentAssemblyBeingLoaded('./flair.client.vue{.min}.js');
    
    // assembly closure: types (start)
        
    await (async () => { // type: ./src/flair.client.vue/flair.ui/@1-VueComponentMembers.js
        const { ViewState } = await ns('flair.ui');
        
        /**
         * @name VueComponentMembers
         * @description Vue Component Members
         */
        $$('ns', 'flair.ui');
		Mixin('VueComponentMembers', function() {
            var _this = this,
                viewState = new ViewState(),
                vueComponent = {};        
        
            $$('private');
            this.define = async (ctx, el) => {
                const { VueFilter, VueMixin, VueDirective, VueComponent } = await ns('flair.ui');
                const Vue = await include('vue/vue{.min}.js');  
                
                const stateAsComputed = async () => {
                    // state (implemented as build-in computed structure)
                    // global state properties are added as computed properties
                    // with get/set working over global ViewState store
                    // each state property is defined as in the array
                    // { "path": "path", "name": "name", "value": value }
                    if(this.state && Array.isArray(this.state)) {
                        for(let p of this.state) {
                            if (vueComponent.computed[p.name]) { throw Exception.InvalidDefinition(`Computed (state) property already defined. (${p.name})`); }
                            vueComponent.computed = vueComponent.computed || {};
                            vueComponent.computed[p.name] = {
                                get: function() { return (viewState.get(p.path, p.name) || p.value); },
                                set: function(val) { viewState.set(p.path, p.name, val); }
                            };
                        }          
                    }
                };
                const builtInMethods = async () => {
                    // built-in methods
                    vueComponent.methods = vueComponent.methods || {};
        
                    // built-in method: path 
                    // this helps in building client side path nuances
                    // e.g., {{ path('abc/xyz') }} will give: '/#/en/abc/xyz'
                    // e.g., {{ path('abc/:xyz', { xyz: 1}) }} will give: '/#/en/abc/1' or whatever url policy was configured
                    vueComponent.methods['path'] = (path, params, query) => { return _this.pathToUrl(path, params, query); };
        
                    // built-in method: route
                    // this helps in using path from route settings itself
                    // e.g., {{ route('home') }} will give: '/#/en/'
                    vueComponent.methods['route'] = (routeName, params, query) => { return _this.routeToUrl(routeName, params, query); };
        
                    // built-in method: stuff
                    // this helps in using stuffing values in a string
                    // e.g., {{ stuff('something %1, %2 and %3', A, B, C) }} will give: 'something A, B and C'
                    vueComponent.methods['stuff'] = (str, ...args) => { return stuff(str, args); };
        
                    // built-in method: lens
                    // this helps in getting a specific path value from an object or a default value
                    // e.g., {{ lens(user, 'rights.today.first', 'none') }} will give: value of rights.today.first if found, else will return 'none'
                    vueComponent.methods['lens'] = (obj, path, defaultValue) => { return lens(obj, path) || defaultValue; };
        
                    // i18n specific built-in methods
                    if (this.i18n) {
                        // built-in method: locale 
                        // e.g., {{ locale() }} will give: 'en'
                        vueComponent.methods['locale'] = (value) => { return _this.locale(value); };
        
                        // built-in method: i18n 
                        // e.g., {{ i18n('@strings.OK | Ok!') }} will give: '<whatever>' if this was the translation added in strings.json::OK key - ELSE it will give 'Ok!'
                        vueComponent.methods['i18n'] = (key) => { return _this.i18nValue(key); };
                    } 
                    
                    // built-in method: version 
                    // e.g., {{ version() }} will give: 'whatever'
                    vueComponent.methods['version'] = (value) => { return _this.version(value); };
        
                    // built-in method: ctx 
                    // this helps in getting context information
                    // e.g., {{ ctx('<propName>', 'defaultValue') }} will give: 'value of propName OR defaultValue'
                    vueComponent.methods['ctx'] = (prop, defaultValue) => { return (ctx ? (ctx[prop] || defaultValue) : defaultValue); };
                
                };
                const localComponents = async () => {
                    // local components
                    // each component as defined in html (<comp ... ></comp>) have at least following two
                    // { "name": "name", "type": "ns.typeName" }        
                    // other optional ones are: "id" and "params"
                    // 
                    // https://vuejs.org/v2/guide/components-registration.html#Local-Registration
                    // https://vuejs.org/v2/api/#components
                    let components = this.getComponents(el),
                        cEl = null,
                        cType = null,
                        cObj = null,
                        isDefined = false;
                    for (let comp of components) {
                        if (!Vue.options.components[comp.name] && !this.components[comp.name]) { // ignore global and local duplicates
                            cEl = el.querySelector(`[id="${comp.id}"]`);
                            if (cEl) { 
                                cType = as(await include(comp.type), VueComponent);
                                if (cType) { 
                                    cObj = new cType();
                                    if (cObj) { 
                                        this.components[comp.name] = await cObj.view(this.inViewName, ctx, cEl, comp.params); 
                                        
                                        // insert component's tag in cEl
                                        cEl.innerHTML = `<component is="${comp.name}"></component>`;
        
                                        isDefined = true;
                                    }
                                }
                            }
                        }
                    }
                    if (isDefined) { vueComponent.components = this.components; }
                };
                const localMixins = async () => {
                    // local mixins
                    // each mixin in array is defined as:
                    // { "name": "name", "type": "ns.typeName" }
                    // https://vuejs.org/v2/guide/mixins.html
                    // https://vuejs.org/v2/api/#mixins
                    if (this.mixins && Array.isArray(this.mixins)) {
                        let MixinType = null,
                            mixin = null;
                        for(let item of this.mixins) {
                            if (!vueComponent.mixins || !vueComponent.mixins[item.name]) { // ignore if duplicate
                                MixinType = as(await include(item.type), VueMixin);
                                mixin = new MixinType();
                                vueComponent.mixins = vueComponent.mixins || {};
                                vueComponent.mixins[item.name] = await mixin.factory();
                            }
                        }
                    }
                };
                const localDirectives = async () => {
                    // local directives
                    // each directive in array is defined as:
                    // { "name": "name", "type": "ns.typeName" }
                    // https://vuejs.org/v2/guide/custom-directive.html
                    // https://vuejs.org/v2/api/#directives
                    if (this.directives && Array.isArray(this.directives)) {
                        let DirectiveType = null,
                        directive = null;
                        for(let item of this.directives) {
                            if (!vueComponent.directives || !vueComponent.directives[item.name]) { // ignore if duplicate
                                DirectiveType = as(await include(item.type), VueDirective);
                                directive = new DirectiveType();
                                vueComponent.directives = vueComponent.directives || {};
                                vueComponent.directives[item.name] = await directive.factory();
                            }
                        }
                    }
                };
                const localFilters = async () => {
                    // local filters
                    // each filter in array is defined as:
                    // { "name": "name", "type": "ns.typeName" }
                    // https://vuejs.org/v2/guide/filters.html
                    // https://vuejs.org/v2/api/#filters
                    if (this.filters && Array.isArray(this.filters)) {
                        let FilterType = null,
                            filter = null;
                        for(let item of this.filters) {
                            if (!vueComponent.filters || !vueComponent.filters[item.name]) { // ignore if duplicate
                                FilterType = as(await include(item.type), VueFilter);
                                filter = new FilterType();
                                vueComponent.filters = vueComponent.filters || {};
                                vueComponent.filters[item.name] = await filter.factory();
                            }
                        } 
                    }
                };
                const otherSetups = async () => {
                    // render
                    // https://vuejs.org/v2/api/#render
                    // https://vuejs.org/v2/guide/render-function.html#Functional-Components
                    if (this.render && typeof this.render === 'function') {
                        vueComponent.render = this.render;
                    }
                
                    // functional
                    // https://vuejs.org/v2/api/#functional
                    // https://vuejs.org/v2/guide/render-function.html#Functional-Components
                    if (typeof this.functional === 'boolean') { 
                        vueComponent.functional = this.functional;
                    }
        
                
                    // computed 
                    // https://vuejs.org/v2/guide/computed.html#Computed-Properties
                    // https://vuejs.org/v2/guide/computed.html#Computed-Setter
                    // https://vuejs.org/v2/api/#computed
                    if (this.computed) {
                        for(let p in this.computed) {
                            if (this.computed.hasOwnProperty(p)) {
                                if (vueComponent.computed[p]) { throw Exception.InvalidDefinition(`Computed member already defined. (${p})`); }
                                vueComponent.computed = vueComponent.computed || {};
                                vueComponent.computed[p] = this.computed[p];
                            }
                        }
                    }
                
                    // methods
                    // https://vuejs.org/v2/api/#methods
                    if (this.methods) {
                        for(let m in this.methods) {
                            if (this.methods.hasOwnProperty(m)) {
                                if (vueComponent.methods[m]) { throw Exception.InvalidDefinition(`Method already defined. (${m})`); }
                                vueComponent.methods = vueComponent.methods || {};
                                vueComponent.methods[m] = this.methods[m];
                            }
                        }
                    } 
                
                    // watch
                    // https://vuejs.org/v2/guide/computed.html#Computed-vs-Watched-Property
                    // https://vuejs.org/v2/guide/computed.html#Watchers
                    // https://vuejs.org/v2/api/#watch
                    if (this.watch) {
                        for(let p in this.watch) {
                            if (this.watch.hasOwnProperty(p)) {
                                if (vueComponent.watch[p]) { throw Exception.InvalidDefinition(`Watch member already defined. (${p})`); }
                                vueComponent.watch = vueComponent.watch || {};
                                vueComponent.watch[p] = this.watch[p];
                            }
                        }
                    }
                
                    // lifecycle
                    // https://vuejs.org/v2/guide/instance.html#Instance-Lifecycle-Hooks
                    // https://vuejs.org/v2/api/#Options-Lifecycle-Hooks
                    if (this.lifecycle) {
                        for(let m in this.lifecycle) {
                            if (this.lifecycle.hasOwnProperty(m)) {
                                if (vueComponent[m]) { throw Exception.InvalidDefinition(`Lifecycle hook already defined. (${m})`); }
                                vueComponent[m] = this.lifecycle[m];
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
                        vueComponent.provide = this.provide;
                    }
                    if (this.inject && Array.isArray(this.inject)) {
                        vueComponent.inject = this.inject;
                    }            
                };        
        
                // define        
                await stateAsComputed();
                await builtInMethods();
                await localComponents();
                await localMixins();
                await localDirectives();
                await localFilters();
                await otherSetups();
        
                // done
                return vueComponent;
            };    
            
            $$('protected');
            this.state = null;
        
            $$('protected');
            this.template = null;
        
            $$('protected');
            this.render = null;
        
            $$('protected');
            this.functional = false;    
        
            $$('protected');
            this.computed = null;
        
            $$('protected');
            this.methods = null;
        
            $$('protected');
            this.watch = null;    
        
            $$('protected');
            this.lifecycle = null;    
        
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
        const { View, VueComponentMembers } = await ns('flair.ui');
        const Vue = await include('vue/vue{.min}.js');
        
        /**
         * @name VueView
         * @description Vue View
         */
        $$('ns', 'flair.ui');
		Class('VueView', View, [VueComponentMembers], function() {
            $$('private');
            this.factory = async (ctx, el) => {
                let vueComponent = null;
        
                // shared between view and component both
                // coming from VueComponentMembers mixin
                vueComponent = await this.define(ctx, el);
        
                // el
                // https://vuejs.org/v2/api/#el
                vueComponent.el = '#' + this.name;
        
                // propsData
                // https://vuejs.org/v2/api/#propsData
                if (this.propsData) {
                    vueComponent.propsData = this.propsData;
                }
        
                // data
                // https://vuejs.org/v2/api/#data
                if (this.data) {
                    if (typeof this.data === 'function') {
                        vueComponent.data = this.data();
                    } else {
                        vueComponent.data = this.data;
                    }
                }
        
                // done
                return vueComponent;
            };    
            
            $$('protected');
            $$('override');
            $$('sealed');
            this.onLoad = async (base, ctx, el) => {
                // don't call base, as that base functionality is defined here differently
        
                // load html into element
                el.innerHTML = this.html;
        
                // setup vue component
                let vueComponent = await this.factory(ctx, el);
        
                // load html
                this.html = el.innerHTML; // since components might have updated the html
        
                // initiate vue view
                new Vue(vueComponent);
            };
        
            $$('protected');
            this.propsData = null;
        });
        
    })();    
    await (async () => { // type: ./src/flair.client.vue/flair.ui/VueComponent.js
        const { ViewComponent, VueComponentMembers } = await ns('flair.ui');
        
        /**
         * @name VueComponent
         * @description Vue Component
         */
        $$('ns', 'flair.ui');
		Class('VueComponent', ViewComponent, [VueComponentMembers], function() {
            let _this = this;
        
            $$('private');
            this.factory = async (ctx, el) => {
                let vueComponent = null;
        
                // shared between view and component both
                // coming from VueComponentMembers mixin
                vueComponent = await this.define(ctx, el);
        
                // template
                // https://vuejs.org/v2/api/#template
                // built from html and css settings
                if (this.template || this.html) {
                    vueComponent.template = this.template || this.html; // template if set manually gets precedence - else html
                }
        
                // props
                // https://vuejs.org/v2/guide/components-props.html
                // https://vuejs.org/v2/api/#props
                // these names can then be defined as attribute on component's html node
                if (this.props && Array.isArray(this.props)) {
                    vueComponent.props = this.props;
                }
          
                // data
                // https://vuejs.org/v2/api/#data
                if (this.data) { 
                    if (typeof this.data === 'function') {
                        vueComponent.data = function() { return _this.data(); }
                    } else {
                        vueComponent.data = function() { return _this.data; }
                    }
                }
         
                // name
                // https://vuejs.org/v2/api/#name
                if (this.name) {
                    vueComponent.name = this.name;
                }
        
                // model
                // https://vuejs.org/v2/api/#model
                if (this.model) {
                    vueComponent.model = this.model;
                }
        
                // inheritAttrs
                // https://vuejs.org/v2/api/#inheritAttrs
                if (typeof this.inheritAttrs === 'boolean') { 
                    vueComponent.inheritAttrs = this.inheritAttrs;
                }
        
                // done
                return vueComponent;
            };
        
            $$('protected');
            $$('override');
            $$('sealed');
            this.onLoad = async (base, ctx, el) => {
                // don't call base, as that base functionality is defined here differently
        
                // load html into element
                el.innerHTML = this.html;
        
                // setup vue component
                let vueComponent = await this.factory(ctx, el);
        
                // load html
                this.html = el.innerHTML; // since components might have updated the html        
        
                // set it to viewComponentObject
                // so it will be returned from view() method
                this.viewComponentObject = vueComponent;
            };
        
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
		Class('VueDirective', function() {
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
		Class('VueFilter', function() {
            $$('virtual');
            $$('async');
            this.factory = noop;
        });
        
    })();    
    await (async () => { // type: ./src/flair.client.vue/flair.ui/VueMixin.js
        /**
         * @name VueMixin
         * @description Vue Mixin
         */
        $$('ns', 'flair.ui');
		Class('VueMixin', function() {
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
		Class('VuePlugin', function() {
            $$('virtual');
            $$('async');
            this.factory = noop;
        });
        
    })();    
    await (async () => { // type: ./src/flair.client.vue/flair.app.bw/@@1-VueSetup.js
        const { Bootware } = await ns('flair.app');
        const { VueComponent, VueDirective, VueFilter, VueMixin, VuePlugin } = await ns('flair.ui');
        const Vue = await include('vue/vue{.min}.js');
        
        /**
         * @name VueSetup
         * @description Vue initializer
         */
        $$('ns', 'flair.app.bw');
		Class('VueSetup', Bootware, function() {
            $$('override');
            this.boot = async (base) => {
                base();
        
                let list = null,
                    extType = null,
                    ExtType = null,
                    ext = null;
        
                // setup Vue configuration
                // TODO: (if any)
        
                // combined extensions (inbuilt and configured)
                // which() will pick as:
                // envProp::mainThreadOnServer{.min}.xyz ~ envProp::workerThreadOnServer{.min}.xyz | envProp::mainThreadOnClient{.min}.xyz ~ envProp::workerThreadOnClient{.min}.xyz
                // here definition is { "name": "name", "type": "ns.typeName", "options": {} }
                list = [
                ];
                list.push(...settings.vue.extensions);
        
                for(let item of list) {
                    if (item.name && item.type) { 
                        extType = which(item.type);
                        if (extType) {
                            try {
                                ExtType = await include(extType);
                                ext = new ExtType();
        
                                if (as(extType, VueComponent)) { // global components
                                    if (Vue.options.components[item.name]) { throw Exception.Duplicate(`Component already registered. (${item.name})`); } // check for duplicate
                                    Vue.component(item.name, await ext.view('', null, null, item.options)); // register globally (without any context)
                                } else if (as(extType, VueDirective)) { // global directives
                                    Vue.directive(item.name, await ext.factory()); 
                                } else if (as(ExtType, VueFilter)) { // filters
                                    // TODO: prevent duplicate filter registration, as done for components
                                    Vue.filter(item.name, await ext.factory());                            
                                } else if (as(ExtType, VueMixin)) { // mixins
                                    Vue.mixin(await ext.factory());
                                } else if (as(ExtType, VuePlugin)) { // plugins
                                    Vue.use(await ext.factory(), item.options || {});
                                } else {
                                    throw Exception.InvalidArgument(extType);
                                }                        
                            } catch (err) {
                                throw Exception.OperationFailed(`Extension registration failed. (${extType})`, err);
                            }
                        }
                    }
                }
            };   
        });
        
    })();
    // assembly closure: types (end)
    
    // assembly closure: embedded resources (start)
    // (not defined)
    // assembly closure: embedded resources (end)        
    
    // clear assembly being loaded
    AppDomain.context.current().currentAssemblyBeingLoaded('', (typeof onLoadComplete === 'function' ? onLoadComplete : null)); // eslint-disable-line no-undef
    
    // register assembly definition object
    AppDomain.registerAdo('{"name":"flair.client.vue","file":"./flair.client.vue{.min}.js","package":"flairjs-fabric","desc":"Foundation for True Object Oriented JavaScript Apps","title":"Flair.js Fabric","version":"0.60.36","lupdate":"Sat, 28 Sep 2019 15:50:58 GMT","builder":{"name":"flairBuild","version":"1","format":"fasm","formatVersion":"1","contains":["init","func","type","vars","reso","asst","rout","sreg"]},"copyright":"(c) 2017-2019 Vikas Burman","license":"MIT","types":["flair.ui.VueComponentMembers","flair.ui.VueView","flair.ui.VueComponent","flair.ui.VueDirective","flair.ui.VueFilter","flair.ui.VueMixin","flair.ui.VuePlugin","flair.app.bw.VueSetup"],"resources":[],"assets":[],"routes":[]}');
    
    // return settings and config
    return Object.freeze({
        name: 'flair.client.vue',
        settings: settings,
        config: config
    });
});