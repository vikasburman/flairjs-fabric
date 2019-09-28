const { Bootware, ClientMiddleware, HandlerResult } = await ns('flair.app');
const { ViewHandler, ViewHandlerContext } = await ns('flair.ui');

/**
 * @name ClientRouter
 * @description Client Router Configuration Setup
 */
$$('sealed');
Class('', Bootware, function() {
    let routes = null;
    
    $$('override');
    this.construct = (base) => {
        base(true); // mount specific 
    };

    $$('override');
    this.boot = async (base, mount) => {
        base();
        
        // get all registered routes, and sort by index, if was not already done in previous call
        if (!routes) {
            routes = AppDomain.context.current().allRoutes(true);
            routes.sort((a, b) => {
                if (a.index < b.index) {
                    return -1;
                }
                if (a.index > b.index) {
                    return 1;
                }
                return 0;
            });
        }

        const onDone = (result, ctx) => {
            // complete the call
            if (result.status === 302) { // redirect - Found
                let redirectRoute = ctx.getData('redirect-route'),
                    redirectParams = ctx.getData('redirect-params'),
                    redirectQuery = ctx.getData('redirect-query');
    
                // perform redirect
                setTimeout(() => { AppDomain.host().redirect(redirectRoute, redirectParams, redirectQuery) }, 0);
            } // navigate to view already happened, nothing else is needed
        };      
        const onError = (err, ctx) => {
            // note: using HandlerResult and no ViewHandlerResult is created, because 
            // there are no results for views - but since HandlerResult gives an easy way to manage
            // status - it is being used for that functionality only
            let result = new HandlerResult(err);

            // unlike server router handling status 100 (continue) is not supported here
            
            onDone(result, ctx);
        };    
        const runMW = async (mw, ctx) => {
            try {
                let MWType = as(await include(mw.name), ClientMiddleware);
                if (!MWType) { throw Exception.InvalidDefinition(`Invalid middleware type. (${mw.name})`); }
                
                let mwArgs = mw.args || [];
                await new MWType().run(ctx, ...mwArgs); // it can throw error that will be passed in response and response cycle will stop here
            } catch (err) {
                throw Exception.OperationFailed(`Middleware ${mw.name} failed.`, err);                
            }
        };
        const runMiddlewares = async (ctx) => {
            // run mount specific middlewares
            // each middleware is derived from ClientMiddleware and
            // async run method of it takes ctx, which can update it also
            // each item is: { name: "ClientMiddlewareTypeQualifiedName", args: [] }
            let mountMiddlewares = this.getMountSpecificSettings('middlewares', settings.routing, mount.name);
            for(let mw of mountMiddlewares) {
                await runMW(mw, ctx);
            }
        };
        const runHandler = async (route, routeHandler, ctx) => {
            // get route handler
            let RouteHandler = as(await include(routeHandler), ViewHandler);
            if (RouteHandler) {
                // run route-specific middlewares, if defined
                if (route.mw && route.mw.length > 0) {
                    for(let mw of route.mw) {
                        await runMW(mw, ctx);
                    }
                }

                // run route haadler
                let rh = new RouteHandler(route);
                await rh.run(ctx);
            } else {
                throw Exception.InvalidDefinition(`Invalid route handler. (${routeHandler})`);
            }
        };
        const chooseRouteHandler = (route) => {
            if (typeof route.handler === 'string') { return route.handler; }
            return route.handler[AppDomain.app().getRoutingContext(route.name)] || route.handler.default || '';  // will pick current context handler OR default handler OR error situation
        };
        const handleRoute = async (route, ctx) => {
            // route.handler can be defined as:
            // string: 
            //      qualified type name of the handler (e.g., abc.xyz)
            //          one limitation is that the name of the type cannot ends with '.xml' (or configured fileExt)
            //      OR
            //      static view name - ends with '.xml' (or configured fileExt) (e.g., ./about.xml or ./path/contact.xml)
            //          this XML file must be present in on specified path under configured 'static' root folder
            // object: { "routingContext": "handler", ...}
            //      routingContext can be any value that represents a routing context for whatever situation 
            //      this is read from App.getRoutingContext(routeName) - where some context string can be provided - 
            //      basis it will pick required handler from here some examples of handlers can be:
            //          mobile | tablet | tv  etc.  - if some routing is to be based on device type
            //          free | freemium | full  - if some routing is to be based on license model
            //          guest | auth - if different view is to be loaded for when its guest user or an authorized user
            //          anything else
            //      'default' must be defined to handle a catch-anything-else scenario 
            //  this gives a handy way of diverting some specific routes while rest can be as is - statically defined                    let routeHandler = chooseRouteHandler(route);
            let routeHandler = chooseRouteHandler(route);
            if (!routeHandler) { throw Exception.NotDefined(route.handler); }
            await runHandler(route, routeHandler, ctx);
        };
        const getHandler = (route) => {
            return async (routerCtx) => {
                let ctx = new ViewHandlerContext(routerCtx);
                // ctx.params has all the route parameters.
                // e.g., for route "/users/:userId/books/:bookId" ctx.params will 
                // have "ctx.params: { "userId": "34", "bookId": "8989" }"
                // it supports everything in here: https://www.npmjs.com/package/path-to-regexp

                try {
                    await runMiddlewares(ctx);
                    await handleRoute(route, ctx);
                    let result = HandlerResult(null, true); // since all is OK - use true as result value
                    onDone(result, ctx);
                } catch (err) {
                    onError(err, ctx);
                }
            };
        };
        const addHandler = (app, route) => {
            app.add(route, getHandler(route));
        };

        // add routes related to current mount
        let app = mount.app;
        for (let route of routes) {
            // route.mount can be one string or an array of strings - in that case, same route will be mounted to multiple mounts
            if ((typeof route.mount === 'string' && route.mount === mount.name) || (route.mount.indexOf(mount.name) !== -1)) { // add route-handler
                if (route.name !== settings.view.routes.notfound) { // add all except the 404 route
                    addHandler(app, route);
                } 
            }
        }

        // catch 404 for this mount
        app.add404(async (routerCtx) => {
            let ctx = new ViewHandlerContext(routerCtx);

            // instead of running the route (for which this ctx was setup)
            // it will pick the handler of notfound route and show that view with this ctx
            let route404 = settings.view.routes.notfound;
            if (route404) { route404 = AppDomain.context.current().getRoute(route404); }
            if (!route404) { // break it here
                alert(`404: ${ctx.originalUrl} not found.`); // eslint-disable-line no-alert
                setTimeout(() => { window.history.back(); }, 0);
                return;
            }

            try {
                let routeHandler = chooseRouteHandler(route404);  // use route404 handler
                await runMiddlewares(ctx);
                await runHandler(route404, routeHandler, ctx);
                let err = Exception.NotFound(ctx.originalUrl);
                let result = HandlerResult(err);
                onDone(result, ctx);
            } catch (err) {
                onError(err, ctx);
            }
        });
    };
});