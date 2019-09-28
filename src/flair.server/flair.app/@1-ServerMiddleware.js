const { Middleware } = await ns('flair.app');

/**
 * @name Server Middleware
 * @description Server middleware, where code executes on route where it is attached
 */
Class('', Middleware, function() {
    $$('override');
    this.run = async (req, res, next, ...mwArgs) => {
        await this.onRun(req, res, ...mwArgs);
        next();
    };
    
    $$('virtual');
    $$('async');
    this.onRun = nim;
});
