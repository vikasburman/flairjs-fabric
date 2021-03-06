const { ViewComponentMembers } = await ns('flair.ui');

/**
 * @name ViewComponent
 * @description View Component
 */
Class('', [ViewComponentMembers], function() {
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