const Handler = await include('flair.app.Handler');

/**
 * @name ViewHandler
 * @description GUI View Handler
 */
$$('ns', '(auto)');
Class('(auto)', Handler, function() {
    let mainEl = '',
        abortControllers = [];       

    $$('override');
    this.construct = (base, el, title, transition) => {
        base();

        // read from setting which are not specified
        el = el || settings.view.el || 'main';
        title = title || settings.view.title || '';
        transition = transition || settings.view.transition || '';

        mainEl = el;
        this.viewTransition = transition;
        this.title = this.title + (title ? ' - ' + title : '');
    };

    $$('privateSet');
    this.viewTransition = '';

    $$('protectedSet');
    this.name = '';

    $$('protectedSet');
    this.title = '';

    // each meta in array can be defined as:
    // { "<nameOfAttribute>": "<contentOfAttribute>", "<nameOfAttribute>": "<contentOfAttribute>", ... }
    $$('protectedSet');
    this.meta = null;

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

    $$('protected');
    this.cancelLoadData = async () => {
        for(let abortController of abortControllers) {
            try {
                abortController.abort();
            } catch (err) { // eslint-disable-line no-unused-vars
                // ignore
            }
        }
        abortControllers = []; // reset

        // any custom cleanup
        await this.onCancelLoadData();
    };

    $$('protected');
    this.abortHandle = () => {
        let abortController = new AbortController(); // create new
        abortControllers.push(abortController); // push to list, so it can be cancelled later
        return abortController; // give back the new handle
    };

    $$('protected');
    $$('virtual');
    $$('async');
    this.onCancelLoadData = noop;    

    this.view = async (ctx) => {
        const { ViewTransition } = ns('flair.ui');

        // give it a unique name, if not already given
        this.name = this.name || this.$Type.getName(true); // $Type is the main view which is finally inheriting this ViewHandler
        this.$static.loadingViewName = this.name;

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
        let el = DOC.createElement('div'),
            parentEl = DOC.getElementById(mainEl);
        el.id = this.name;
        el.setAttribute('hidden', '');
        parentEl.appendChild(el);
        
        // custom load op before view is created
        await this.beforeLoad(ctx, el);      

        // view
        await this.onView(ctx, el);

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

    $$('protected');
    $$('virtual');
    $$('async');
    this.onView = noop;

    $$('private');
    this.swap = async () => {
        let thisViewEl = DOC.getElementById(this.name);

        // outgoing view
        if (this.$static.currentView) {
            let currentViewEl = DOC.getElementById(this.$static.currentView);

            // cancel load data, if any
            this.$static.currentViewCancelLoadData(); // note: this is called and not waited for, so cancel can keep happening in background

            // remove outgoing view meta   
            if (this.$static.currentViewMeta) {
                for(let meta of this.$static.currentViewMeta) {
                    DOC.head.removeChild(DOC.querySelector('meta[name="' + meta + '"]'));
                }
            }

            // remove outgoing view styles   
            this.$static.removeStyles()

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

        // update title
        DOC.title = this.title;

        // set new current
        this.$static.currentViewName = this.name;
        this.$static.loadingViewName = null;
        this.$static.currentViewMeta = this.meta;
        this.currentViewCancelLoadData = this.cancelLoadData;
    };

    $$('static');
    this.currentViewName = null;

    $$('static');
    this.currentViewMeta = null;

    $$('static');
    this.currentViewCancelLoadData = null;    

    $$('static');
    this.loadingViewName = null;

    $$('static');
    this.removeStyles = () => {
        if (this.$static.currentViewName) {
            let styles = document.head.getElementsByTagName("style"),
                outgoingViewName = this.$static.currentViewName;
            for(let styleEl of styles) { // remove all styles which were added by any component (view itself, layout or any component) of this view
                if (styleEl.id && styleEl.id.startsWith(`_${outgoingViewName}_style_`)) { // this must match the way styles were added, see below in: addStyle
                    document.head.removeChild(styleEl);
                }
            }
        }
    };

    $$('static');
    this.addStyle = (scopeId, style) => {
        if (this.$static.loadingViewName) {
            let styleEl = window.document.createElement('style');
            styleEl.id = `_${this.$static.loadingViewName}_style_${scopeId}`
            styleEl.type = 'text/css';
            styleEl.appendChild(window.document.createTextNode(style));
            window.document.head.appendChild(styleEl);
        }
    };
});
