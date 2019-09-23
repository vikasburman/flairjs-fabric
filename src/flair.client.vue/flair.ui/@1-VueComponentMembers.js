const { ViewState } = await ns('flair.ui');

/**
 * @name VueComponentMembers
 * @description Vue Component Members
 */
Mixin('', function() {
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
