const { View } = await ns('flair.ui');

/**
 * @name ViewComponentMembers
 * @description View Component Members
 */
Mixin('', function() {
    let abortControllers = {},
        _thisId = guid(),
        clientFileLoader =  Port('clientFile'),
        _inViewName = ''; 

    $$('protected');
    this.name = '';

    $$('readonly');
    this.id = _thisId;

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
                } else { // either not defined OR defined as object itself
                    // nothing
                }
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
                let cEl = el.getElementById(comp.id);
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
                updatedHtml = () => { return doc.body.innerHTML; }
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
            for(s of scripts) { s.parentNode.remove(s); }
        }

        // pick first style and then delete all style tags, so nothing left inside
        let styles = doc.getElementsByTagName('style');
        if (styles) {
            if (styles.length > 0) {
                content.style = styles[0].innerHTML;
                for(s of styles) { s.parentNode.remove(s); }
            }
        }

        // pick first data and then delete all data tags, so nothing left inside
        let data = doc.getElementsByTagName('data');
        if (data) {
            if (data.length > 0) {
                content.data = data[0].innerHTML;
                for(d of data) { d.parentNode.remove(d); }
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
            for(cm of comps) { 
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