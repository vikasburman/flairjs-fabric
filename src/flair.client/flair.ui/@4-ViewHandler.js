const { Handler } = await ns('flair.app');
const { ViewTypes } = await ns('flair.ui');

/**
 * @name ViewHandler
 * @description GUI View Handler
 */
Class('', Handler, function() {
    $$('override');
    this.construct = (base, route) => {
        base(route);

        // view type
        if (!route.type || (route.type && route.type === -1)) { 
            this.type = ViewTypes.Client;
        } else {
            this.type = route.type;
        }
        this.handler = route.handler;

        // static (or server in future)
        if (!this.type === ViewTypes.Client) {
            this.connection = route.connection || '';
        }
    };

    $$('override');
    this.run = async (base, ctx) => {
        base('view', ctx); // verb is always view

        // run the handler - verb will always be 'view', so no need to check
        await this.onView(ctx); // no result - instead ui will be navigated to // it can throw any error
    };

    $$('readonly');
    this.type = -1;

    $$('protected');
    this.handler = '';

    $$('protected');
    this.connection = '';

    $$('protected');
    $$('virtual');
    $$('async');
    this.onView = noop;    
});
