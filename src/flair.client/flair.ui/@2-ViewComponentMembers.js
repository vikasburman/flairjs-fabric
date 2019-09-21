const { ViewTypes } = await ns('flair.ui');

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
            this.html = await this.autoWire('view', this.html, $mainType, this.basePath, this.baseName);
        };
        const autoWireStyle = async () => {
            this.style = await this.autoWire('style', this.style, $mainType, this.basePath, this.baseName);
        };
        const autoWireData = async () => {
            this.data = await this.autoWire('data', this.data, $mainType, this.basePath, this.baseName);
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
                let styleId = `${_inViewName}_${_thisId}`;
                let style = replaceAll(this.style, '#SCOPE_ID', `#${_thisId}`); // replace all #SCOPE_ID with #<this_view_or_component_unique_id>
                this.addStyle(style, styleId);
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
    this.autoWire = async (type, def, $type, basePath, baseName, viewType, viewEl) => {
        let value = def,
            res = null;

        const autoWire1 = async () => {
            // 1: if resource object
            if (value && typeof value === 'object' && value.data) { value = value.data; } // resource object
        };
        const autoWire3 = async (ext) => {
            // 3: if string 
            if (typeof value === 'string' && value !== '') { // not an empty string
                // possibilities are:
                //  res:<qualifiedResourceName> -- embedded resource
                //  'path/file.<ext>' --> ./<assemblyFolder>/path/file.<ext>
                //  'file.<type>.<ext>' --> ./<assemblyFolder>/<typeFolder>/<namespace>.file.<ext>
                //  './path/file.<ext>' -- ./path/file.<ext>

                // 3.1: resource
                if (value.startsWith('res:')) {
                    res = AppDomain.context.current().getResource(value.substr(4)) || null; // remove res: and then find resource
                    value = (res && res.data ? res.data : '');
                }

                // 3.2: namespaced asset <ext> file
                if (value.endsWith(`.${type}.${ext}`) || value.endsWith(`.${type}{.min}.${ext}`)) {
                    value = which(`${config.assetRoots[type]}/${$type.getName()}.${ext}`, true);
                }

                // 3.3: <ext> file (may be namespaced asset file itself)
                if (value.endsWith(`.${ext}`)) {
                    if (!value.startsWith('./')) { value = basePath + value; }
                    value = await clientFileLoader(value); // load file content
                }

                // 3.4: else this may be <ext> string itself
            }
        };    
        const autoWireLayout = async () => {
            await autoWire1(); 

            // 2: pick from settings default value for current view type, if not defined
            if (!value) { 
                switch(viewType) {
                    case ViewTypes.Client: value = settings.view.layout.client || ''; break;
                    case ViewTypes.Server: value = settings.view.layout.server || ''; break;
                    case ViewTypes.Static: value = settings.view.layout.static || ''; break;
                }
            }

           await autoWire3('html');

            // 4: nothing defined
            if (!value) { 
                value = `<div type="${viewEl}"></div>`; // bare minimum layout, so at least view is loaded 
            } 
        };
        const autoWireView = async () => {
            await autoWire1(); 

            // 2: associated resource, if not defined
            if (!value) { 
                res = AppDomain.context.current().getResource(`${$type.getName()}_html`) || null;
                value = (res && res.data ? res.data : '');
            }

            // 2: namespaces asset file, otherwise
            if (!value) {
                value = which(`${baseName}.view{.min}.html`, true);
            }

            await autoWire3('html');
        };
        const autoWireStyle = async () => {
            await autoWire1(); 

            // 2: associated resource, if not defined
            if (!value) { 
                res = AppDomain.context.current().getResource(`${$type.getName()}_css`) || null;
                value = (res && res.data ? res.data : '');
            }

            await autoWire3('css');
        };
        const autoWireData = async () => {
            await autoWire1(); 

            // 2: associated resource, if not defined
            if (!value) { 
                res = AppDomain.context.current().getResource(`${$type.getName()}_json`) || null;
                value = (res && res.data ? res.data : '');
            }

            await autoWire3('json');
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

        // an html definition can be of multiple forms
        // 1. standard html
        //  <!doctype html>
        //  <html>
        //      <head>
        //          <style></style>
        //          <data></data>
        //      </head>
        //      <body>
        //      </body>
        //  </html>
        //
        // 2. bare minimum
        //  <html>...</html>
        //  OR
        //  direct any tag
        //
        // 3. scattered
        //  <style>...</style>
        //  <data>...</data>
        //  <html>...</html>
        //  
        // 4. partial
        //  <style>...</style>
        //  <html>...</html>
        //
        // 5. free flow
        //  ...text...

        let docParser = new window.DOMParser();
        doc = docParser.parseFromString(html, 'text/html');

        // delete all script tags, so nothing left inside body
        let scripts = doc.getElementsByTagName('script');
        if (scripts) {
            for(let s of scripts) { s.parentNode.remove(s); }
        }

        // delete all link tags, so nothing left inside body
        let links = doc.getElementsByTagName('link');
        if (links) {
            for(let l of links) { l.parentNode.remove(l); }
        }        

        // pick first style and then delete all style tags, so nothing left inside
        let styles = doc.getElementsByTagName('style');
        if (styles) {
            if (styles.length > 0) {
                let style = styles[0],
                    styleSrc = style.getAttribute('src');
                if (styleSrc) { // give pref to defined source
                    content.style = styleSrc;
                } else {
                    content.style = style.innerHTML;
                }
                for(let s of styles) { s.parentNode.remove(s); }
            }
        }

        // pick first data and then delete all data tags, so nothing left inside
        let data = doc.getElementsByTagName('data');
        if (data) {
            if (data.length > 0) {
                let dt = data[0],
                    dtSrc = dt.getAttribute('src');
                if (dtSrc) { // give pref to defined source
                    content.data = dtSrc;
                } else {
                    content.data = dt.innerHTML;
                }                
                for(let d of data) { d.parentNode.remove(d); }
            }
        }

        // pick title
        // title may have pattern like this: {{ i18n('@titles.home | Home') }}
        // just to match everything else in document, but here it is not needed like this
        // instead needed is just: '@titles.home | Home'
        // so remove other known parts: {{ }} and i18n( and )
        let docTitle = doc.title || null;
        if (docTitle) {
            docTitle = replaceAll(docTitle, '{{', ''); docTitle = replaceAll(docTitle, '}}', ''); docTitle = replaceAll(docTitle, 'i18n', ''); docTitle = replaceAll(docTitle, '(', ''); docTitle = replaceAll(docTitle, ')', '');
            content.title = docTitle;
        }

        // find all component holders
        content.elements = this.extractComponents(doc.body);

        // pick clean html from body
        content.html = doc.body.innerHTML;

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
    this.pathToUrl = (path, params) => { return AppDomain.host().pathToUrl(path, params); };
    
    $$('protected');
    this.routeToUrl = (routeName, params) => { return AppDomain.host().routeToUrl(routeName, params); };

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