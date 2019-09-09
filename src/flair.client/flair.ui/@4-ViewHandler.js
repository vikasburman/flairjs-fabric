const { Handler, ViewTypes } = await ns('flair.app');

/**
 * @name ViewHandler
 * @description GUI View Handler
 */
Class('', Handler, function() {
    $$('override');
    this.construct = (base, route) => {
        base(route);

        // view type
        this.type = route.type || ViewTypes.Client;

        // static/server context
        if (!this.type === ViewTypes.Client) {
            this.path = route.handler;
            this.connection = route.connection || '';
        }
    };

    $$('readonly');
    this.type = -1;

    $$('protected');
    this.path = '';

    $$('protected');
    this.connection = '';

    $$('protected');
    $$('virtual');
    $$('async');
    this.loadView = noop;

    this.view = async (ctx) => { await this.loadView(ctx); }
});
