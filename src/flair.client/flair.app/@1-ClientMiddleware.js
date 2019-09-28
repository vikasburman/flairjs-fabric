const { Middleware } = await ns('flair.app');

/**
 * @name Client Middleware
 * @description Client middleware, where code executes on route where it is attached
 */
Class('', Middleware, function() {
    $$('override');
    this.run = async (ctx, ...mwArgs) => {
        await this.onRun(ctx, ...mwArgs);
    };
    
    $$('virtual');
    $$('async');
    this.onRun = nim;
});
