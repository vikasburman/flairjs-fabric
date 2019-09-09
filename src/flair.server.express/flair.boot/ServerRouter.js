const { Bootware } = await ns('flair.app');
const { RestHandler, RestInterceptor } = await ns('flair.api');

/**
 * @name ServerRouter
 * @description Server Router Configuration Setup
 */
$$('sealed');
Class('', Bootware, function() {
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

        const runInterceptors = async (req, res) => {
            // run mount specific interceptors
            // each interceptor is derived from RestInterceptor and
            // run method of it takes req, can update it, also takes res method and can generate response, in case request is being stopped
            // each item is: "InterceptorTypeQualifiedName"
            let mountInterceptors = this.getMountSpecificSettings('interceptors', settings.routing, mount.name);
            for (let ic of mountInterceptors) {
                let ICType = as(await include(ic), RestInterceptor);
                if (!ICType) { throw Exception.InvalidDefinition(`Invalid interceptor type. (${ic})`); }
                
                await new ICType().run(req, res);
                if (req.$stop) { break; } // break, if someone forced to stop 
            }
        };
        const runHandler = async (route, routeHandler, verb, req, res) => {
            let RouteHandler = as(await include(routeHandler), RestHandler);
            if (RouteHandler) {
                // req.params has all the route parameters.
                // e.g., for route "/users/:userId/books/:bookId" req.params will 
                // have "req.params: { "userId": "34", "bookId": "8989" }"
                let rh = new RouteHandler(route);
                return await rh[verb](req, res);
            } else {
                throw Exception.InvalidDefinition(`Invalid route handler. (${routeHandler})`);
            }
        };
        const chooseRouteHandler = (route) => {
            if (typeof route.handler === 'string') { return route.handler; }
            return route.handler[AppDomain.app().getRoutingContext(route.name)] || '**undefined**';
        };
        const getHandler = (route, verb) => {
            return (req, res, next) => { 
                const onError = (err) => {
                    next(err);
                };
                const onDone = (result) => {
                    if (!result) {
                        next();
                    }
                };
                const handleRoute = async () => {
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
                    return await runHandler(route, routeHandler, verb, req, res);
                };

                // add special properties to req
                req.$stop = false;

                // run interceptors
                runInterceptors(req, res).then(() => {
                    if (!req.$stop) {
                        handleRoute().then(onDone).catch(onError);
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
            };
        };
        const addHandler = (verb, route) => {
            let routePath = route.path;

            // modify route path to add mount params in the beginning of the path
            if (mount.params) { // mount specific params are defined
                let newRoutePath = mount.params;
                if (!newRoutePath.startsWith('/')) { newRoutePath = '/' + newRoutePath; } // add first /
                if (!newRoutePath.endsWith('/')) { newRoutePath = newRoutePath + '/'; } // add last /
                newRoutePath += routePath; // add route path
                routePath = newRoutePath.replace('//', '/'); // replace // with / (just in case)
            }
    
            mount.app[verb](routePath, getHandler(route, verb));
        };

        // add routes related to current mount
        for (let route of routes) {
            // route.mount can be one string or an array of strings - in that case, same route will be mounted to multiple mounts
            if ((typeof route.mount === 'string' && route.mount === mount.name) || (route.mount.indexOf(mount.name) !== -1)) { // add route-handler
                let routeVerbs = [];
                if (route.verbs && route.verbs.length !== 0) { routeVerbs.push(...route.verbs); }
                if (routeVerbs.length === 0) { routeVerbs.push('get'); } // by default get verb is used
                routeVerbs.forEach(verb => { // verb could be get/set/delete/put/, etc.
                    addHandler(verb, route);
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