const { Bootware, HandlerResult } = await ns('flair.app');
const { ViewInterceptor, ViewHandler, ViewHandlerContext } = await ns('flair.ui');

/**
 * @name ClientRouter
 * @description Client Router Configuration Setup
 */
$$('sealed');
Class('', Bootware, function() {
    let routes = null;
    
    $$('override');
    this.construct = (base) => {
        base('Client Router', true); // mount specific 
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
        const runInterceptors = async (ctx) => {
            // run mount specific interceptors
            // each interceptor is derived from ViewInterceptor and
            // async run method of it takes ctx, can update it
            // each item is: "InterceptorTypeQualifiedName"
            let mountInterceptors = this.getMountSpecificSettings('interceptors', settings.routing, mount.name);
            for(let ic of mountInterceptors) {
                let ICType = as(await include(ic), ViewInterceptor);
                if (!ICType) { throw Exception.InvalidDefinition(`Invalid interceptor type. (${ic})`); }
                await new ICType().run(ctx); // it can throw error that will be passed in response and response cycle will stop here
            }
        };
        const runHandler = async (route, routeHandler, ctx) => {
            // get route handler
            let RouteHandler = as(await include(routeHandler), ViewHandler);
            if (RouteHandler) {
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
        const getHandler = (route) => {
            return async (routerCtx) => {
                let ctx = new ViewHandlerContext(routerCtx);
                // ctx.params has all the route parameters.
                // e.g., for route "/users/:userId/books/:bookId" ctx.params will 
                // have "ctx.params: { "userId": "34", "bookId": "8989" }"
                // it supports everything in here: https://www.npmjs.com/package/path-to-regexp

                // note: using HandlerResult and no ViewHandlerResult is created, because 
                // there are no results for views - but since HandlerResult gives an easy way to manage
                // status - it is being used for that functionality only
                const onError = (err) => {
                    let result = new HandlerResult(err);

                    // unlike server router handling status 100 (continue) is not supported here
                    
                    onDone(result, ctx);
                };
                const handleRoute = async () => {
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
                    if (!routeHandler) { throw Exception.NotDefined(route); }
                    await runHandler(route, routeHandler, ctx);
                };                

                runInterceptors(ctx).then(() => {
                    handleRoute().then(() => {
                        let result = HandlerResult(null, true); // since all is OK - use true as result value
                        onDone(result, ctx);
                    }).catch(onError);
                }).catch(onError);
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

            // note: 404 handler does not run interceptors
            
            // instead of running the route (for which this ctx was setup)
            // it will pick the handler of notfound route and show that view with this ctx
            let route404 = settings.view.routes.notfound;
            if (route404) { route404 = AppDomain.context.current().getRoute(route404); }
            if (!route404) { // break it here
                alert(`404: ${ctx.originalUrl} not found.`); // eslint-disable-line no-alert
                setTimeout(() => { window.history.back(); }, 0);
                return;
            }

            // use route404 handler
            let routeHandler = chooseRouteHandler(route404);
            await runHandler(route404, routeHandler, ctx);
        });
    };
});