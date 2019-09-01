const { Bootware } = await ns('flair.app');
const { RestHandler, RestInterceptor } = await ns('flair.api');

/**
 * @name ServerRouter
 * @description Server Router Configuration Setup
 */
$$('sealed');
$$('ns', '(auto)');
Class('(auto)', Bootware, function () {
    let routes = null;
    
    $$('override');
    this.construct = (base) => {
        base('Server Router', true); // mount specific 
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

        let result = false;

        const runInterceptors = async (interceptors, req, res) => {
            for (let ic of interceptors) {
                let ICType = as(await include(ic), RestInterceptor);
                if (!ICType) { throw Exception.InvalidDefinition(`Invalid interceptor type. (${ic})`); }
                
                await new ICType().run(req, res);
                if (req.$stop) { break; } // break, if someone forced to stop 
            }
        };
        const chooseRouteHandler = (route) => {
            if (typeof route.handler === 'string') { return route.handler; }
            return route.handler[AppDomain.app().getRoutingContext(route.name)] || '**undefined**';
        };

        // add routes related to current mount
        for (let route of routes) {
            // route.mount can be one string or an array of strings - in that case, same route will be mounted to multiple mounts
            if ((typeof route.mount === 'string' && route.mount === mount.name) || (route.mount.indexOf(mount.name) !== -1)) { // add route-handler
                route.verbs.forEach(verb => {
                    mount.app[verb](route.path, (req, res, next) => { // verb could be get/set/delete/put/, etc.
                        const onError = (err) => {
                            next(err);
                        };
                        const onDone = (result) => {
                            if (!result) {
                                next();
                            }
                        };
                        const handleRoute = () => {
                            // route.handler can be defined as:
                            // string: qualified type name of the handler
                            // object: { "routingContext": "handler", ...}
                            //      routingContext can be any value that represents a routing context for whatever situation 
                            //      this is read from App.getRoutingContext(routeName) - where some context string can be provided - 
                            //      basis it will pick required handler from here some examples of handlers can be:
                            //          mobile | tablet | tv  etc.  - if some routing is to be based on device type
                            //          free | freemium | full  - if some routing is to be based on license model
                            //          anything else
                            //  this gives a handy way of diverting some specific routes while rest can be as is - statically defined
                            let routeHandler = chooseRouteHandler(route);
                            include(routeHandler).then((theType) => {
                                let RouteHandler = as(theType, RestHandler);
                                if (RouteHandler) {
                                    try {
                                        using(new RouteHandler(), (routeHandler) => {
                                            // req.params has all the route parameters.
                                            // e.g., for route "/users/:userId/books/:bookId" req.params will 
                                            // have "req.params: { "userId": "34", "bookId": "8989" }"
                                            result = routeHandler[verb](req, res);
                                            if (result && typeof result.then === 'function') {
                                                result.then((delayedResult) => {
                                                    onDone(delayedResult);
                                                }).catch(onError);
                                            } else {
                                                onDone(result);
                                            }
                                        });
                                    } catch (err) {
                                        onError(err);
                                    }
                                } else {
                                    onError(Exception.InvalidDefinition(`Invalid route handler. ${routeHandler}`));
                                }
                            }).catch(onError);
                        };

                        // add special properties to req
                        req.$stop = false;

                        // run mount specific interceptors
                        // each interceptor is derived from RestInterceptor and
                        // run method of it takes req, can update it, also takes res method and can generate response, in case request is being stopped
                        // each item is: "InterceptorTypeQualifiedName"
                        let mountInterceptors = this.getMountSpecificSettings('interceptors', settings.routing, mount.name);
                        runInterceptors(mountInterceptors, req, res).then(() => {
                            if (!req.$stop) {
                                handleRoute();
                            } else {
                                res.end();
                            }
                        }).catch((err) => {
                            if (req.stop) {
                                res.end();
                            } else {
                                onError(err);
                            }
                        });
                    });
                });
            }
        }

        // catch 404 for this mount and forward to error handler
        mount.app.use((req, res, next) => {
            var err = new Error('Not Found');
            err.status = 404;
            next(err);
        });

        // dev/prod error handler
        if (env.isProd) {
            mount.app.use((err, req, res) => {
                res.status(err.status || 500);
                if (req.xhr) {
                    res.status(500).send({
                        error: err.toString()
                    });
                } else {
                    res.render('error', {
                        message: err.message,
                        error: err
                    });
                }
                res.end();
            });
        } else {
            mount.app.use((err, req, res) => {
                res.status(err.status || 500);
                if (req.xhr) {
                    res.status(500).send({
                        error: err.toString()
                    });
                } else {
                    res.render('error', {
                        message: err.message,
                        error: err
                    });
                }
                res.end();
            });
        }
    };
});