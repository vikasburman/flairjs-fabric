const { ViewTypes, ViewHandler, ViewTransition, ViewComponentMembers } = await ns('flair.ui');

/**
 * @name View
 * @description GUI View
 */
Class('', ViewHandler, [ViewComponentMembers], function() {
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
    this.assembleView = async ($mainType) => { // eslint-disable-line no-unused-vars
        let clientFileLoader = Port('clientFile');
        const autoWireAndLoadLayout = async () => {
            // layout will always be an html (direct) OR an html file as asset or embedded resource
            // with embedded styles in itself having SCOPED styles
            // auto-wire logic works like this:
            // this.layout can be:
            //  undefined/null (default):
            //      it assumes an empty string and follows the 'string' approach below
            //  object:
            //      it can be the resource object itself to get resource string and then it follows the 'string' approach below
            //      any other type of object is treated as empty string
            //  anything else is treated as empty string
            //  string:
            //      it can start with 'res:<resTypeName>' to define the qualified type name for the resource which is to be loaded to the layout
            //      it can end with '.html' to have a file name, and filename can be:
            //          './path/file.html' to define a html file inside assets folder - in relation to root of the asset folder
            //          './file.layout.html' that is assumed to be in-place namespaced asset file and it will be located as: ./layouts/<namespaceOfType>.file.html
            //      any other non-empty string is treated as html string itself
            //      if empty string, it picks the default layout setting value based on the view type and then follows the string approach from start
            //      if still empty string, it builds a default layout as: <div type="${viewEl}"></div>
            if (typeof this.layout !== 'string') { // undefined/null/object/anything else
                if (this.layout && typeof this.layout === 'object' && this.layout.data) { // resource object
                    let resData = this.layout.data;
                    this.layout = resData; // set it as its data
                } else {
                    this.layout = ''; // set as empty string
                }   
            }
            if (typeof this.layout === 'string') {
                if (this.layout === '') { // if empty string
                    switch(this.type) {
                        case ViewTypes.Client: this.layout = settings.view.layout.client || ''; break;
                        case ViewTypes.Server: this.layout = settings.view.layout.server || ''; break;
                        case ViewTypes.Static: this.layout = settings.view.layout.static || ''; break;
                    }
                }
                if (this.layout.startsWith('res:')) { //  its an embedded resource - res:<resTypeName>
                    this.layout = this.getResIfDefined(this.layout);
                    if (this.layout.startsWith('res:')) { // embedded resource could not resolved
                        this.layout = '';
                    }
                }
                if (this.layout.endsWith('.layout.html') || this.layout.endsWith('.layout{.min}.html')) { // its namespaced in-place asset html file
                    // build proper name of the file
                    this.layout = which(`./${config.assetRoots.layout}/${this.baseName}.${this.layout.replace('.layout', '')}`, true);
                }
                if (this.layout.endsWith('.html')) { // its html file
                    // pick file from base path
                    // file is generally defined as ./path/fileName.html and this will replace it as: ./<basePath>/path/fileName.html
                    this.layout = this.layout.replace('./', this.basePath);
                    this.layout = await clientFileLoader(this.layout); // load file content
                }
                // else this is assumed to be html string itself
            }
            if (!this.layout) { // nothing defined
                this.layout = `<div type="${viewEl}"></div>`; // bare minimum layout, so at least view is loaded 
            }
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

            // TODO: In case of static view - set path to config.assetRoots.content
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
        if (content.title) { this.title = content.title; }
    };

    $$('static');
    this.currentView = null

    $$('static');
    this.inView = null    

    $$('static');
    this.outView = null    
});
