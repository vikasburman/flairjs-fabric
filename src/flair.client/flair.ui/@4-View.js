const { ViewHandler, ViewTransition, ViewComponentMembers } = await ns('flair.ui');

/**
 * @name View
 * @description GUI View
 */
Class('', ViewHandler, [ViewComponentMembers], function() {
    let mainEl = '',
        viewEl = '',
        components = [];

    $$('override');
    this.construct = (base, staticFile) => {
        base(staticFile);

        // settings
        mainEl = settings.view.mainEl || 'main';
        viewEl = settings.view.viewEl || 'view';
        this.viewTransition = settings.view.transition || '';
        
        // host
        this.host = this;

        // set layout
        if (!this.layout) {
            this.layout = (this.isStatic ? settings.view.static.layout : settings.view.layout);
        }

        // set base, if static
        if (this.isStatic) {
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
        base(ctx);

        // initialize in context of this type
        await this.init(this.$Type);

        // load view transition
        if (this.viewTransition) {
            let ViewTransitionType = as(await include(this.viewTransition), ViewTransition);
            if (ViewTransitionType) {
                this.viewTransition = new ViewTransitionType();
            } else {
                this.viewTransition = '';
            }
        }

        // add view el to parent
        let el = null,
            parentEl = DOC.getElementById(mainEl);
        if (!this.$static.currentView || this.$static.currentView.name !== this.name) { // if same view is already loaded, don't add again
            el = DOC.createElement('div');
            el.id = this.name;
            el.setAttribute('hidden', '');
            parentEl.appendChild(el);
        } else {
            el = DOC.getElementById(this.name);
        }
        
        // static file load support
        if (this.isStatic) {
            await this.loadStaticFile();
        }

        // initialize html/style/json content
        await this.initContent();

        // initialize layout and merge view with layout
        await this.assembleView();

        // custom load op before view is created
        await this.beforeLoad(ctx, el);      

        // view
        await this.onLoad(ctx, el);

        // custom load op after view is created but not shown yet
        await this.afterLoad(ctx, el);

        // swap views (old one is replaced with this new one)
        await this.swap();

        // now initiate async server data load process, this may take long
        // therefore any must needed data should be loaded either in beforeLoad 
        // or afterLoad functions, anything that can wait still when UI is visible
        // should be loaded here
        // corresponding cancel operations must also be written in cancelLoadData
        // NOTE: this does not wait for completion of this async method
        this.loadData(ctx);  
    };

    $$('private');
    this.assembleView = async () => {
        // TODO: load layout and assembly view html in final state
    };

    $$('private');
    this.loadStaticFile = async () => {
        // TODO: read static file and load html, style and data, whatever is applicable
        if (this.staticFile.endsWith('.html')) {

        } else if (this.staticFile.endsWith('.md')) {

        } else if (this.staticFile.endsWith('.xml')) {

        } else {

        }
    };

    this.memberComponents = (component) => {
        if (typeof component !== 'undefined') { components.push(component); }
        return components.slice();
    };

    $$('private');
    this.swap = async () => {
        let thisViewEl = DOC.getElementById(this.name);

        // broadcast all components about state
        await this.broadcast('entering');

        // outgoing view
        if (this.$static.currentView) {
            let currentViewEl = DOC.getElementById(this.$static.currentView.name);

            // broadcast to current view and all its components
            await this.$static.currentView.broadcast('leaving');

            // if incoming view is not same as outgoing view
            if (this.$static.currentView.name !== this.name) {
                // remove outgoing view meta
                if (this.$static.currentView.meta) {
                    for(let meta of this.$static.currentView.meta) {
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

                // broadcast to current view and all its components
                await this.$static.currentView.broadcast('left');
            }
        }

        // if incoming view is not same as outgoing view
        if (!this.$static.currentView || this.$static.currentView.name !== this.name) {
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
            if (!this.$static.currentView && thisViewEl) {
                thisViewEl.hidden = false;
            }
        }

        // update title
        DOC.title = this.title;

        // set new current
        this.$static.currentView = this;

        // broadcast all components about state
        await this.broadcast('entered');
    };

    $$('static');
    this.currentView = null
});
