/**
 * @preserve
 * Flair.js Fabric
 * Foundation for True Object Oriented JavaScript Apps
 * 
 * Assembly: flair.client
 *     File: ./flair.client.js
 *  Version: 0.60.9
 *  Tue, 24 Sep 2019 16:45:52 GMT
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

    // assembly closure: init (start)
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
    
    // access to DOC
    const DOC = ((env.isServer || env.isWorker) ? null : window.document);
    
    // current for this assembly
    const __currentContextName = AppDomain.context.current().name;
    const __currentFile = __asmFile;
    const __currentPath = __currentFile.substr(0, __currentFile.lastIndexOf('/') + 1);
    AppDomain.loadPathOf('flair.client', __currentPath);
    
    // settings of this assembly
    let settings = JSON.parse('{"view":{"mainEl":"main","viewEl":"view","transition":"","layout":"","routes":{"home":"","notfound":""}},"i18n":{"lang":{"default":"en","locales":[{"code":"en","name":"English","native":"English"}]}},"routing":{"mounts":{"main":"/"},"all":{"before":{"settings":[{"name":"hashbang","value":false},{"name":"sensitive","value":false}],"interceptors":[]},"after":{"settings":[],"interceptors":[]}}}}');
    let settingsReader = Port('settingsReader');
    if (typeof settingsReader === 'function') {
        let externalSettings = settingsReader('flair.client');
        if (externalSettings) { settings = deepMerge([settings, externalSettings], false); }
    }
    settings = Object.freeze(settings);
    
    // config of this assembly
    let config = JSON.parse('{"assetRoots":{"view":"views","layout":"layouts","content":"content","data":"data","style":"css"}}');
    config = Object.freeze(config);
    
    /* eslint-enable no-unused-vars */
    // assembly closure: init (end)
    
    // assembly closure: global functions (start)
    // (not defined)
    // assembly closure: global functions (end)
    
    // set assembly being loaded
    AppDomain.context.current().currentAssemblyBeingLoaded('./flair.client{.min}.js');
    
    // assembly closure: types (start)
        
    await (async () => { // type: ./src/flair.client/flair.ui/@2-ViewComponentMembers.js
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
        
            $$('protected');
            this.id = '';
        
            $$('protected');
            this.inViewName = ''
        
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
            this.init = async (inViewName, $mainType) => { // eslint-disable-line no-unused-vars
                let result = null;
                
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
                        baseName = typeQualifiedName.substr(typeQualifiedName.lastIndexOf('.') + 1); // namespace name
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
                result = await this.initContent($mainType);
        
                // initialize layout and merge view with layout
                await this.assembleView($mainType);  
                
                return result;
            };
        
            $$('private');
            this.initContent = async ($mainType) => { // eslint-disable-line no-unused-vars
                let result = {
                    title: null
                };
                const autoWireHtml = async () => {
                    this.html = await this.autoWire('view', this.html, $mainType);
                };
                const autoWireStyle = async () => {
                    this.style = await this.autoWire('style', this.style, $mainType);
                };
                const autoWireData = async () => {
                    this.data = await this.autoWire('data', this.data, $mainType);
                };
        
                const loadHtml = async () => {
                    if (this.html) { // if some string is defined
                        let content = this.extractContent(this.html); // extract content from loaded html
                        if (content.html) { this.html = content.html; } 
                        if (content.title) { result.title = content.title; } // put title to be set later
                        if (content.i18n && !this.i18n) { this.i18n = content.i18n; } // load i18n if not already defined
                        if (content.style) { // if style was defined inside html give it a precedence and overwrite, even if defined earlier
                            this.style = content.style; 
                            await autoWireStyle(); // re-wire                    
                        } 
                        if (content.data) { // if data was defined inside html give it a precedence and overwrite, even if defined earlier
                            this.data = content.data; 
                            await autoWireData(); // re-wire
                        }
                    }
        
                    // put entire html into a unique id div
                    // even empty html will become an empty div here with ID - so it ensures that all components have a root div and SCOPED styles for same ID are applied rightly as well here under
                    this.html = `<div id="${_thisId}">${this.html}</div>`;
                };        
                const loadStyle = async () => {
                    // load styles in dom - as scoped style
                    if (this.style) {
                        let style = replaceAll(this.style, '#SCOPE_ID', `#${_thisId}`); // replace all #SCOPE_ID with #<this_view_or_component_unique_id>
                        this.addStyle(style);
                    }            
                };
                const loadJson = async () => {
                    // load static data in property
                    if (typeof this.data === 'string') { // json string
                        if (this.data) {
                            this.data = JSON.parse(this.data);
                        } else {
                            this.data = null; // reset to null
                        }
                    } // else either not defined OR defined as object itself
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
                        let $asm = $mainType.getAssembly(),
                            currentLocale = this.locale();
                        for(let i18nNs in this.i18n) {
                            if (this.i18n.hasOwnProperty(i18nNs)) {
                                i18ResFile = this.i18n[i18nNs] || `./${i18nNs}.json`;
                                if ($asm.hasLocale(currentLocale, i18ResFile)) {
                                    this.i18n[i18nNs] = await clientFileLoader($asm.getLocale(currentLocale, i18ResFile)); // this will load defined json file as json object here
                                } else {
                                    this.i18n[i18nNs] = {}; // keep it empty
                                }
                            }
                        }
                    }
                };
        
                await autoWireHtml();
                await autoWireStyle();
                await autoWireData();
                await loadHtml();
                await loadStyle();
                await loadJson();
                await loadI18NResources();
        
                return result;
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
                const { ViewComponent } = await ns('flair.ui');
                
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
                        cEl = el.querySelector(`[id="${comp.id}"]`);
                        if (cEl) { 
                            cType = as(await include(comp.type), ViewComponent);
                            if (cType) { 
                                cObj = new cType();
                                if (cObj) { 
                                    this.components[comp.name] = await cObj.view(_inViewName, ctx, cEl, comp.params);
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
                    styleEl.id = _id || `${_thisId}`;
                    styleEl.owner = _inViewName;
                    styleEl.type = 'text/css';
                    styleEl.appendChild(window.document.createTextNode(style));
                    window.document.head.appendChild(styleEl);
                }
            };  
            
            $$('private');
            this.autoWire = async (type, def, $type, viewEl) => {
                let value = def,
                    _value = null,
                    res = null;
        
                const autoWire1 = async () => {
                    // 1: if resource object
                    if (value && typeof value === 'object' && value.data) { value = value.data; } // resource object
                };
                const autoWire2 = async (ext) => {
                    // 2: pick associated resource, if need
                    if (!value) { 
                        _value = `${$type.getName()}_${ext}`; // myapp.views.404_html
                        if ($type.getAssembly().hasResource(_value)) {
                            res = AppDomain.context.current().getResource(_value);
                            value = (res && res.data ? res.data : '');
                        }
                    }
                    
                    // 3: pick namespaces asset file, if need
                    if (!value) {
                        _value = which(`./${config.assetRoots[type]}/${$type.getName()}.${ext}`); // ./<knownAssetFolderType>/<namespace>.<type>.<ext>
                        if ($type.getAssembly().hasAsset(_value)) {
                            value = $type.getAssembly().getAsset(_value); // gives all resolved asset file path 
                        }
                    } 
                };
                const autoWire3 = async (ext) => {
                    // 3: if string 
                    if (typeof value === 'string' && value !== '') { // not an empty string
                        // possibilities are:
                        //  res:<qualifiedResourceName> -- embedded resource
                        //  ast:<fileName> -- asset file name and path
                        //  './file.<type>{.min}.<ext>' --> ./<assemblyFolder>/<typeFolder>/<namespace>.file.<ext>
                        //  './path/file{.min}.<ext>' --> -- (first as: asset file name and path, then if not found in context of root)
        
                        // 3.1: resource
                        if (value.startsWith('res:')) {
                            value = value.substr(4); // remove res: to get qualified name
                            if ($type.getAssembly().hasResource(value)) {
                                res = AppDomain.context.current().getResource() || null; 
                                value = (res && res.data ? res.data : '');
                            }
                        }
        
                        // 3.2: specific asset file
                        if (value.startsWith('ast:')) {
                            value = value.substr(4); // remove ast: to get asset file name and path
                            if (!value.startsWith('./')) { value = './' + value; } // add ./ if not already there
                            if ($type.getAssembly().hasAsset(value)) {
                                value = $type.getAssembly().getAsset(value); // gives all resolved asset file path 
                            }
                        }
        
                        // 3.3: namespaced asset <ext> file
                        if (value.startsWith('./') && (value.endsWith(`.${type}.${ext}`) || value.endsWith(`.${type}{.min}.${ext}`))) {
                            _value = which(`./${config.assetRoots[type]}/${$type.getName()}.${ext}`); // ./<knownAssetFolderType>/<namespace>.<type>.<ext>
                            if ($type.getAssembly().hasAsset(_value)) {
                                value = $type.getAssembly().getAsset(_value); // gives all resolved asset file path 
                            } else {
                                // leave value untouched, because this seems to be some other type of file definition
                                // try to resolve via next approach
                            }
                        }
        
                        // 3.4: <ext> file (may be specific asset file, namespaced asset file or a file in context of root)
                        if (value.startsWith('./') && value.endsWith(`.${ext}`)) {
                            // since both asset files and normal files starts with ./ first check if this is available as
                            // asset, pick from there - else go for normal file in context of root
                            if ($type.getAssembly().hasAsset(value)) {
                                value = $type.getAssembly().getAsset(value); // gives all resolved asset file path 
                            } else {
                                // leave it untouched, this could be root context file
                            }                
                        }
        
                        // 3.5: load if file (of known or some other ext type)
                        if (value.startsWith('./')) {
                            value = await clientFileLoader(value); // load file content
                        } else {
                            // this may be <ext> type string itself
                        }
                    }
                };    
                const autoWireLayout = async () => {
                    await autoWire1(); 
        
                    // 2: pick from settings default value, if not defined
                    if (!value) { 
                        value = settings.view.layout;
                    }
        
                   await autoWire3('html');
        
                    // 4: nothing defined
                    if (!value) { 
                        value = `<div type="${viewEl}"></div>`; // bare minimum layout, so at least view is loaded 
                    } 
                };
                const autoWireView = async () => {
                    await autoWire1(); 
                    await autoWire2('html');
                    await autoWire3('html');
        
                    // 4: nothing defined
                    if (!value) { 
                        value = `<div><!-- view markup not defined / could not be resolved --></div>`; // bare minimum view
                    }             
                };
                const autoWireStyle = async () => {
                    await autoWire1(); 
                    await autoWire2('css');           
                    await autoWire3('css');
        
                    // 4: nothing defined
                    if (!value) { 
                        value = ``; // bare minimum style
                    }             
                };
                const autoWireData = async () => {
                    await autoWire1(); 
                    await autoWire2('json');   
                    await autoWire3('json');
        
                    // 4: nothing defined
                    if (!value) { 
                        value = {}; // bare minimum data
                    }
                };      
        
                switch(type) {
                    case 'layout': await autoWireLayout(); break;
                    case 'view': await autoWireView(); break;
                    case 'style': await autoWireStyle(); break;
                    case 'data': await autoWireData(); break;
                }
        
                return value;
            };
        
            $$('private');
            this.extractContent = (html) => {
                let doc = null,
                    content = {
                        title: null,
                        i18n: null,
                        html: null,
                        style: null,
                        data: null,
                        elements: {
                            components: [], 
                            view: null
                        },
                        updatedHtml: () => { return doc.body.innerHTML; }
                    };
        
                // an html definition of a view and component can be as:
                // <!DOCTYPE html>                              <-- so that editors don't complain - otherwise not needed
                // <html title="@titles.home | Home">           <-- title is read only for views - not needed for components
                //     <style src="./path/file.css"></style>    <-- can define a local asset file OR a root level file in SRC or can place content here itself inside tag - if both are defined, content here will get be taken SRC file will not be read
                //     <data src="./path/file.css"></data>      <-- can define a local asset file OR a root level file in SRC or can place content here itself inside tag - if both are defined, content here will get be taken SRC file will not be read
                //     <body>                                   <-- main markup of the view or component comes here
                //          <...> ... </...>
                //     </body>
                // </html>       
                // NOTE: In all places in the html markup, all paths that start with:
                //  ./ <-- represents the assets root folder for the assembly
                //  ~/ <-- represents the root folder 
        
                let docParser = new window.DOMParser();
                doc = docParser.parseFromString(html, 'text/html');
        
                // delete all script tags, so nothing left inside body
                let scriptTag = doc.getElementsByTagName('script');
                if (scriptTag) { for(let s of scriptTag) { s.parentNode.removeChild(s); } }
        
                // delete all link tags, so nothing left inside body
                let linkTag = doc.getElementsByTagName('link');
                if (linkTag) { for(let l of linkTag) { l.parentNode.removeChild(l); } }
        
                // pick first style and then delete all style tags, so nothing left inside
                let styleTag = doc.getElementsByTagName('style');
                if (styleTag) {
                    if (styleTag.length > 0) {
                        let style = styleTag[0];
                        content.style = style.innerHTML.trim(); // give pref to defined content
                        if (!content.style) { // if nothing defined here
                            let styleSrc = style.getAttribute('src');
                            if (styleSrc) { 
                                if (styleSrc.startsWith('~/')) { styleSrc = styleSrc.replace('~/', './'); } // since auto-wiring handles paths starting with './' first at assembly root - then at main root, it will still work -- the only edge case is that if same file is present on assembly root and on main root - assembly root one will be picked --- but that is a rare edge case
                                content.style = styleSrc; 
                            }
                        }
                        
                        // delete all styles tags, so nothing left inside body
                        for(let s of styleTag) { s.parentNode.removeChild(s); }
                    }
                }
        
                // pick first data and then delete all data tags, so nothing left inside
                let dataTag = doc.getElementsByTagName('data');
                if (dataTag) {
                    if (dataTag.length > 0) {
                        let dt = dataTag[0];
                        content.data = dt.innerHTML.trim(); // give pref to defined content
                        if (!content.data) { // if nothing defined here
                            let dtSrc = dt.getAttribute('src');
                            if (dtSrc) { 
                                if (dtSrc.startsWith('~/')) { dtSrc = dtSrc.replace('~/', './'); } // since auto-wiring handles paths starting with './' first at assembly root - then at main root, it will still work -- the only edge case is that if same file is present on assembly root and on main root - assembly root one will be picked --- but that is a rare edge case
                                content.data = dtSrc; 
                            }
                        }
        
                         // delete all data tags, so nothing left inside body
                        for(let d of dataTag) { d.parentNode.removeChild(d); }
                    }
                }
        
                // find all component holders
                content.elements = this.extractComponents(doc.body);
        
                // pick clean html from body
                content.html = (doc.body.innerHTML || '').trim();
        
                // 1. replace all paths starting from './' to assets folder of this type
                // 2. thereafter replace all paths starting from '~/' to './', the actual root folder
                content.html = replaceAll(content.html, './', this.basePath);
                content.html = replaceAll(content.html, '~/', './');
        
                // pick all usage of i18n string
                // i18n strings will generally be written as {{ i18n('@fileName.stringName | defaultValue') }}
                // it looks for '@fileName. pattern via /('|")@\w*./ regex and extract 'fileName' to build a comma delimited string
                // of required i18n resources
                let matched = content.html.match(/('|")@\w*./g);
                if (matched && Array.isArray(matched) && matched.length > 0) {
                    content.i18n = '';
                    matched.forEach((m) => { content.i18n += ',' + m.substr(2, m.length - 3); });
                    if (content.i18n.startsWith(',')) { content.i18n = content.i18n.substr(1); }
                }
        
                // pick title
                // title may have pattern like this: '@titles.home | Home' OR 'Home' OR '@titles.home'
                let htmlTag = doc.getElementsByTagName('html');
                if (htmlTag) {
                    if (htmlTag.length > 0) {
                        htmlTag = htmlTag[0];
                        let docTitle = htmlTag.getAttribute('title');
                        if (docTitle) {
                            content.title = docTitle;
        
                            // add i18n resources for title, if not already in list
                            if (docTitle.startsWith('@')) { // i18n resource is referred
                                let titleI18nRes = docTitle.substr(1).split('.')[0]; // @titles.home | Home --> titles
                                if (titleI18nRes) {
                                    if (content.i18n) {
                                        if (content.i18n.indexOf(titleI18nRes) === -1) { content.i18n += ',' + titleI18nRes; }
                                    } else {
                                        content.i18n = titleI18nRes;
                                    }
                                }
                            }
                        }
                    }
                }
        
                return content;
            };
            
            $$('private');
            this.extractComponents = (el) => {
                // components can be defined in html anywhere as:
                //  <div ctype="<quaklified-type-name-of-component>" "params"="..."></div>
                // a special component that will hold view - (in case of layout only) - will have a type same as viewEl setting
                let elements = {
                    components: [],
                    view: null
                };
        
                let comps = el.querySelectorAll('div[ctype]');
                if (comps) {
                    let typeValue = '',
                        viewContainerTypeValue = settings.view.viewEl || 'view';
                    for(let cm of comps) { 
                        typeValue = cm.getAttribute('ctype');
                        if (typeValue !== '') {
                            if (typeValue === viewContainerTypeValue) {
                                if (!elements.view) { elements.view = cm; } // pick first one only
                            } else { // add to components
                                let _id = cm.getAttribute('id'),
                                    _type = cm.getAttribute('ctype') || '',
                                    _params = cm.getAttribute('params') || '',
                                    _name = cm.getAttribute('name');
                                if (!_id) { // give it a new id (it is recommended that no id is given manually - so all IDs are set unique here automatically)
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
            this.pathToUrl = (path, params, query) => { return AppDomain.host().pathToUrl(path, params, query); };
            
            $$('protected');
            this.routeToUrl = (routeName, params, query) => { return AppDomain.host().routeToUrl(routeName, params, query); };
        
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
            this.preloadData = noop;     
        
            $$('protected');
            $$('virtual');
            $$('async');
            this.loadData = noop;     
        });
    })();    
    await (async () => { // type: ./src/flair.client/flair.ui/@3-ViewHandlerContext.js
        const { HandlerContext } = await ns('flair.app');
        
        // Credit: https://gist.github.com/allenhwkim/19c2f36a7afa6f0c507008613e966d1b
        const Cookie = function (tld) {
            this.tld = tld; // if true, set cookie domain at top level domain
            this.set = (name, value, days) => {
                let cookie = { [name]: value, path: '/' };
                if (days) {
                    let date = new Date();
                    date.setTime(date.getTime()+(days*24*60*60*1000));
                    cookie.expires = date.toUTCString();
                }
                  
                if (Cookie.tld) {
                    cookie.domain = '.' + window.location.hostname.split('.').slice(-2).join('.');
                } 
              
                let arr = [];
                for(let key in cookie) {
                    arr.push(`${key}=${cookie[key]}`);
                }
                document.cookie = arr.join('; ');
              
                return this.get(name);
            };
            this.getAll = () => {
                let cookie = {};
                document.cookie.split(';').forEach(el => {
                    let [k,v] = el.split('=');
                    cookie[k.trim()] = v;
                });
                return cookie;
            };
            this.get = (name) => {
                return this.getAll()[name];
            };
            this.delete = (name) => {
                this.set(name, '', -1);
            };
            this.deleteAll = () => {
                let cookie = this.getAll();
                for(let key in cookie) {
                    this.delete(key);
                }        
            };
        };
        
        /**
         * @name ViewHandlerContext
         * @description View Handler Context
         */
        $$('ns', 'flair.ui');
		Class('ViewHandlerContext', HandlerContext, function() {
            $$('override');
            this.construct = (base, ctx) => { 
                base();
        
                this.ctx = ctx; // internal context
            };
        
            // ideally this should not be used directly
            $$('readonly');
            this.ctx = null;
        
            this.redirect = (route, params, query) => {
                this.setData('redirect-route', route);
                this.setData('redirect-params', params || null);
                this.setData('redirect-query', query || null);
                throw Exception.Redirect(route);
            };
        
            this.isSecure = { get: () => { this.protocol === 'https' ? true : false; } }
            this.readyState = { get: () => { return window.document.readyState; } }
            this.characterSet = { get: () => { return window.document.characterSet; } }
            this.url = { get: () => { return window.document.location.href; } }
            this.originalUrl = { get: () => { return this.ctx.$url; } } // location.pathname
            this.baseUrl = { get: () => { return this.ctx.$mount; } }
            this.route = { get: () => { return this.ctx.$route; } }
            this.origin = { get: () => { return window.document.location.origin; } }
            this.hostName = { get: () => { return window.document.location.hostname; } }
            this.port = { get: () => { return window.document.location.port; } }
            this.protocol = { get: () => { return window.document.location.protocol; } }
            this.path = { get: () => { return this.ctx.$path; } }
            this.hash = { get: () => { return window.document.location.hash; } }
            this.handler = { get: () => { return this.ctx.$handler; } }
            this.locale = { get: () => { return this.ctx.$locale; } }
            this.version = { get: () => { return this.ctx.$version; } }
            this.params = { get: () => { return this.ctx.$params; } }
            this.query = { get: () => { return this.ctx.$query; } }
            this.cookie = Object.freeze(new Cookie(true));
        });
        
    })();    
    await (async () => { // type: ./src/flair.client/flair.ui/@3-ViewTransition.js
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
    await (async () => { // type: ./src/flair.client/flair.ui/@4-ViewHandler.js
        const { Handler } = await ns('flair.app');
        
        /**
         * @name ViewHandler
         * @description GUI View Handler
         */
        $$('ns', 'flair.ui');
		Class('ViewHandler', Handler, function() {
            $$('override');
            this.construct = (base, route) => {
                base(route);
            };
        
            $$('override');
            this.run = async (base, ctx) => {
                base('view', ctx); // verb is always view
        
                // run the handler - verb will always be 'view', so no need to check
                await this.onView(ctx); // no result - instead ui will be navigated to // it can throw any error
            };
        
            $$('protected');
            $$('virtual');
            $$('async');
            this.onView = noop;    
        });
        
    })();    
    await (async () => { // type: ./src/flair.client/flair.ui/@5-View.js
        const { ViewHandler, ViewTransition, ViewComponentMembers } = await ns('flair.ui');
        
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
            this.onView = async (base, ctx) => {
                this.$static.outView = this.$static.currentView;
                this.$static.inView = this;
        
                // call base
                base(ctx);
        
                // give it a unique name
                this.name = this.name || this.$Type.getName(true); // this is the name of the type which is being instantiated
        
                // initialize in context of this type
                let result = await this.init(this.$static.inView.name, this.$Type);
                if (result && result.title) { this.title = result.title; }
        
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
        
                // now initiate async data load process for any data that needs to be preloaded 
                // before view is shown, this will wait before views are swapped
                // corresponding cancel operations must also be written in cancelLoadData
                // NOTE: this DOES wait for completion of this async method
                await this.preloadData(ctx);
        
                // swap views (old one is replaced with this new one)
                await this.swap();
        
                // now initiate async server data load process for any data which may take long to load
                // corresponding cancel operations must also be written in cancelLoadData
                // NOTE: this DOES NOT wait for completion of this async method
                this.loadData(ctx);
        
                // remove all styles related to outview
                if (this.$static.outView && this.$static.outView.name !== this.$static.inView.name) { // if not the same view and there was an outview
                    let styles = document.head.getElementsByTagName('style');
                    if (styles && styles.length > 0) {
                        let styleOwner = '';
                        for(let s of styles) {
                            styleOwner = s.getAttribute('owner') || '';
                            if (styleOwner === this.$static.outView.name) { // owner was this view
                                s.parentNode.removeChild(s); // remove this style
                            }
                        }
                    }
                }
            
                // reset
                this.$static.outView = null;
                this.$static.inView = null;        
            };
        
            $$('protected');
            this.assembleView = async ($mainType) => { // eslint-disable-line no-unused-vars
                const autoWireAndLoadLayout = async () => {
                    this.layout = await this.autoWire('layout', this.layout, $mainType, viewEl);
                };
                const mergeLayoutWithView = async () => {
                    // a layout html is defined as (sample):
                    // <!DOCTYPE html>
                    // <html>
                    //  <head>
                    //      <style>
                    //          #SCOPE_ID .div {
                    //              ...  
                    //          }
                    //      </style>
                    //  </head>
                    //  <body>
                    //      <div type="ns.Header" "params"=""></div>
                    //      <div class="container">
                    //          <div type="<viewEl>"></div>
                    //      </div>
                    //      <div type="ns.Footer"></div>
                    //  </body>
                    // </html>
        
                    // extract content from htmls
                    let content = this.extractContent(this.layout);
        
                    // load layout style if defined
                    if (content.style) {
                        let layoutStyleId = `${this.id}_LAYOUT`;
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
            };
        
            $$('protected');
            $$('virtual');
            this.afterInit = async ($mainType) => { // eslint-disable-line no-unused-vars
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
        
            // TODO: check view's loadView is gone, so why it is here
            $$('protected');
            this.loadView = async (ctx, el) => {
                 // initialize in context of this type
                await this.init(_inViewName, this.$Type);
        
                // view
                await this.load(ctx, el);
        
                // now initiate async data load process for any data that needs to be preloaded 
                // before view is shown, this will wait before views are swapped
                // corresponding cancel operations must also be written in cancelLoadData
                // NOTE: this DOES wait for completion of this async method
                await this.preloadData(ctx);
        
                // note: unlike View, there is no view swapping happening here, 
                // still having two methods: preload and load makes sense because
                // one waits for completion while other not
        
                // now initiate async server data load process for any data which may take long to load
                // corresponding cancel operations must also be written in cancelLoadData
                // NOTE: this DOES NOT wait for completion of this async method
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
                defaultHandler = null;
        
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
                    query: {},
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
                        qvars[qitems[0].trim()] = qitems[1] ? decodeURIComponent(qitems[1].trim()) : '';
                    }
                    if (qvars) { parts.query = qvars; }
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
        
                // done
                return parts;
            };
            this.buildUrl = (path, params, query) => {
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
                // but ideally query string should be passed separately as object 
                let isQueryAdded = false;
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
                                qs += `${p}=${value}&`;
                            }
                        }
                    }
                    if (qs !== '?') { 
                        isQueryAdded = true;
                        if (qs.endsWith('&')) { qs = qs.substr(0, qs.length - 1); } // remove last &
                        url += qs; 
                    }            
                }
        
                // query
                if (query) {
                    let qs = isQueryAdded ? '&' : '?',
                        value = null;
                    for(let p in query) {
                        if (query.hasOwnProperty(p)) {
                            value = encodeURIComponent(query[p].toString());
                            qs += `${p}=${value}&`;
                        }
                    }
                    if (!(qs === '?' || qs === '&')) {
                        url += qs; // add these as well
                    }               
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
                // get path parts
                let parts = this.breakUrl(url);
        
                // default ctx
                let ctx = {
                    $url: url,
                    $route: '',
                    $handler: '',
                    $mount: '',
                    $path: parts.path || '',
                    $locale: parts.locale || '',
                    $version: parts.version || '',
                    $params: parts.params || {},
                    $query: parts.query || {}
                };
        
                // enrich ctx for route
                if (parts.route) {
                    ctx.$route = parts.route.name;
                    ctx.$handler = parts.route.handler;
                    ctx.$mount = parts.route.mount;
                    ctx.$path = parts.route.path;
                }
        
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
        const { Bootware, HandlerResult } = await ns('flair.app');
        const { ViewInterceptor, ViewHandler, ViewHandlerContext } = await ns('flair.ui');
        
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
        
                const onDone = (result, ctx) => {
                    // complete the call
                    if (result.status === 302) { // redirect - Found
                        let redirectRoute = ctx.getData('redirect-route'),
                            redirectParams = ctx.getData('redirect-params'),
                            redirectQuery = ctx.getData('redirect-query');
            
                        // perform redirect
                        setTimeout(() => { AppDomain.host().redirect(redirectRoute, redirectParams, redirectQuery) }, 0);
                    } // navigate to view already happened, nothing else is needed
                };        
                const runInterceptors = async (ctx) => {
                    // run mount specific interceptors
                    // each interceptor is derived from ViewInterceptor and
                    // async run method of it takes ctx, can update it
                    // each item is: "InterceptorTypeQualifiedName"
                    let mountInterceptors = this.getMountSpecificSettings('interceptors', settings.routing, mount.name);
                    for(let ic of mountInterceptors) {
                        let ICType = as(await include(ic), ViewInterceptor);
                        if (!ICType) { throw Exception.InvalidDefinition(`Invalid interceptor type. (${ic})`); }
                        await new ICType().run(ctx); // it can throw error that will be passed in response and response cycle will stop here
                    }
                };
                const runHandler = async (route, routeHandler, ctx) => {
                    // get route handler
                    let RouteHandler = as(await include(routeHandler), ViewHandler);
                    if (RouteHandler) {
                        let rh = new RouteHandler(route);
                        await rh.run(ctx);
                    } else {
                        throw Exception.InvalidDefinition(`Invalid route handler. (${routeHandler})`);
                    }
                };
                const chooseRouteHandler = (route) => {
                    if (typeof route.handler === 'string') { return route.handler; }
                    return route.handler[AppDomain.app().getRoutingContext(route.name)] || route.handler.default || '';  // will pick current context handler OR default handler OR error situation
                };
                const getHandler = (route) => {
                    return async (routerCtx) => {
                        let ctx = new ViewHandlerContext(routerCtx);
                        // ctx.params has all the route parameters.
                        // e.g., for route "/users/:userId/books/:bookId" ctx.params will 
                        // have "ctx.params: { "userId": "34", "bookId": "8989" }"
                        // it supports everything in here: https://www.npmjs.com/package/path-to-regexp
        
                        // note: using HandlerResult and no ViewHandlerResult is created, because 
                        // there are no results for views - but since HandlerResult gives an easy way to manage
                        // status - it is being used for that functionality only
                        const onError = (err) => {
                            let result = new HandlerResult(err);
        
                            // unlike server router handling status 100 (continue) is not supported here
                            
                            onDone(result, ctx);
                        };
                        const handleRoute = async () => {
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
                            //      'default' must be defined to handle a catch-anything-else scenario 
                            //  this gives a handy way of diverting some specific routes while rest can be as is - statically defined                    let routeHandler = chooseRouteHandler(route);
                            let routeHandler = chooseRouteHandler(route);
                            if (!routeHandler) { throw Exception.NotDefined(route); }
                            await runHandler(route, routeHandler, ctx);
                        };                
        
                        runInterceptors(ctx).then(() => {
                            handleRoute().then(() => {
                                let result = HandlerResult(null, true); // since all is OK - use true as result value
                                onDone(result, ctx);
                            }).catch(onError);
                        }).catch(onError);
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
                app.add404(async (routerCtx) => {
                    let ctx = new ViewHandlerContext(routerCtx);
        
                    // note: 404 handler does not run interceptors
                    
                    // instead of running the route (for which this ctx was setup)
                    // it will pick the handler of notfound route and show that view with this ctx
                    let route404 = settings.view.routes.notfound;
                    if (route404) { route404 = AppDomain.context.current().getRoute(route404); }
                    if (!route404) { // break it here
                        alert(`404: ${ctx.originalUrl} not found.`); // eslint-disable-line no-alert
                        setTimeout(() => { window.history.back(); }, 0);
                        return;
                    }
        
                    // use route404 handler
                    let routeHandler = chooseRouteHandler(route404);
                    await runHandler(route404, routeHandler, ctx);
                });
            };
        });
    })();    
    await (async () => { // type: ./src/flair.client/flair.app/ClientHost.js
        const { Host } = await ns('flair.app');
        const { Page } = await ns('flair.ui');
        
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
    // assembly closure: types (end)
    
    // assembly closure: embedded resources (start)
    // (not defined)
    // assembly closure: embedded resources (end)        
    
    // clear assembly being loaded
    AppDomain.context.current().currentAssemblyBeingLoaded('', (typeof onLoadComplete === 'function' ? onLoadComplete : null)); // eslint-disable-line no-undef
    
    // register assembly definition object
    AppDomain.registerAdo('{"name":"flair.client","file":"./flair.client{.min}.js","package":"flairjs-fabric","desc":"Foundation for True Object Oriented JavaScript Apps","title":"Flair.js Fabric","version":"0.60.9","lupdate":"Tue, 24 Sep 2019 16:45:52 GMT","builder":{"name":"flairBuild","version":"1","format":"fasm","formatVersion":"1","contains":["init","func","type","vars","reso","asst","rout","sreg"]},"copyright":"(c) 2017-2019 Vikas Burman","license":"MIT","types":["flair.ui.ViewComponentMembers","flair.ui.ViewHandlerContext","flair.ui.ViewTransition","flair.ui.ViewHandler","flair.ui.View","flair.ui.ViewComponent","flair.ui.Page","flair.boot.ClientRouter","flair.app.ClientHost","flair.ui.ViewInterceptor","flair.ui.ViewState"],"resources":[],"assets":["index.html","index.js","start.js"],"routes":[]}');
    
    // return settings and config
    return Object.freeze({
        name: 'flair.client',
        settings: settings,
        config: config
    });
});