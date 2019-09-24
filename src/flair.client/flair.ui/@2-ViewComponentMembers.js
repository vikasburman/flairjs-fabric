/**
 * @name ViewComponentMembers
 * @description View Component Members
 */
Mixin('', function() {
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