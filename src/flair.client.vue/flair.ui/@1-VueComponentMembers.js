/**
 * @name VueComponentMembers
 * @description Vue Component Members
 */
$$('ns', '(auto)');
Mixin('(auto)', function() {
    var _this = this,
        _thisId = guid();

    $$('private');
    this.define = async () => {
        const Vue = await include('vue/vue{.min}.js');  
        const { ViewHandler, ViewState } = await ns('flair.ui');
        const { VueFilter, VueMixin, VueDirective, VueComponent } = await ns('flair.ui');

        let viewState = new ViewState(),
            component = {};

        // base name
        let typeQualifiedName = this.$Type.getName(),
            baseName = typeQualifiedName.substr(typeQualifiedName.lastIndexOf('.') + 1);
        this.baseName = baseName;

        // get port
        let clientFileLoader = Port('clientFile');  

        // auto wire html and styles, if configured as 'true' - for making it ready to pick from assets below
        if (typeof this.style === 'boolean' && this.style) {
            this.style = which(`./${baseName}/index{.min}.css`, true);
        }
        if (typeof this.html === 'boolean' && this.html) {
            this.html = which(`./${baseName}/index{.min}.html`, true);
        }

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
                    i18ResFile = this.$Type.getAssembly().getLocaleFilePath(this.locale(), (this.i18n[i18nNs] || `./${i18nNs}.json`));
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
            // e.g., {{ i18n('@strings.OK | Ok!') }} will give: '<whatever>' if this was the translation added in strings.json::OK key - ELSE it will give 'Ok!'
            component.methods['i18n'] = (key) => { return _this.i18nValue(key); };
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
    this.baseName = '';

    $$('protected');
    this.locale = (value) => { return AppDomain.host().locale(value); };

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
