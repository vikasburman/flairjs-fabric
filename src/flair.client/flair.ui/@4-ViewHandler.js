const { Handler } = await ns('flair.app');

/**
 * @name ViewHandler
 * @description GUI View Handler
 */
Class('', Handler, function() {
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
