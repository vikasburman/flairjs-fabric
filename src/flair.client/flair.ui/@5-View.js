const { ViewHandler, ViewTransition, ViewComponentMembers } = await ns('flair.ui');

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
