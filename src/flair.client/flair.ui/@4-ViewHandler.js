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

        // static/server context
        if (!this.type === ViewTypes.Client) {
            this.connection = route.connection || '';
        }
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
    this.loadView = noop;

    this.view = async (ctx) => { await this.loadView(ctx); }
});
