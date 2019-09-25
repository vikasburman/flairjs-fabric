const { Bootware, Payload } = await ns('flair.app');
const { RestInterceptor, RestHandler, RestHandlerResult, RestHandlerContext, AttachmentPayload, BinaryPayload, JSONPayload } = await ns('flair.api');

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

        const onDone = (result, ctx) => {
            let req = ctx.req, res = ctx.res; // eslint-disable-line no-unused-vars

            // complete the call
            if (result.status === 302) { // redirect - Found
                let redirectRoute = ctx.getData('redirect-route'),
                    redirectStatus = ctx.getData('redirect-status'),
                    redirectParams = ctx.getData('redirect-params'),
                    redirectQuery = ctx.getData('redirect-query');
                
                // build path
                let redirectPath = AppDomain.host().routeToUrl(redirectRoute, redirectParams, redirectQuery);

                // perform redirect
                res.redirect(redirectStatus, redirectPath);
            } else { // send data
                let isCompleted = false;
                if (!result.isError && is(result.data, Payload)) { // extended but otherwise normal payload case when not error
                    // add any res headers
                    for(let rh of result.data.resHeaders) { 
                        res.set(rh.name, rh.value);
                    }

                    if (is(result.data, AttachmentPayload)) { // https://expressjs.com/en/api.html#res.download
                        isCompleted = true;
                        res.download(result.data.file, result.data.displayName, result.data.options, result.data.cb).end();
                    } else if (is(result.data, BinaryPayload)) { // https://expressjs.com/en/api.html#res.end AND // https://nodejs.org/api/http.html#http_response_end_data_encoding_callback
                        isCompleted = true;
                        res.end(result.data.buffer, result.data.encoding, result.data.cb);
                    } else if (is(result.data, JSONPayload)) { // https://expressjs.com/en/api.html#res.jsonp
                        isCompleted = true;
                        res.status(result.status).jsonp(result.value(true)).end(); // since there is no error, send minimal packet
                    }
                }
                if (result.isError || !isCompleted) { // error or normal payload or plain but extended payload cases 
                    if (ctx.isAjaxReq) {
                        res.status(result.status).json(result.value(!result.isError)).end(); // get minimal data, when there is no error
                    } else {
                        res.status(result.status).send(result.value(!result.isError)).end(); // get minimal data, when there is no error
                    }
                }
            }
        };
        const runInterceptors = async (req, res) => {
            // run mount specific interceptors
            // each interceptor is derived from RestInterceptor and
            // run method of it takes req, can update it, also takes res method and can generate response, in case request is being stopped
            // each item is: "InterceptorTypeQualifiedName"
            let mountInterceptors = this.getMountSpecificSettings('interceptors', settings.routing, mount.name);
            for (let ic of mountInterceptors) {
                let ICType = as(await include(ic), RestInterceptor);
                if (!ICType) { throw Exception.InvalidDefinition(`Invalid interceptor type. (${ic})`); }
                await new ICType().run(req, res); // it can throw error that will be passed in response and response cycle will stop here
            }
        };
        const runHandler = async (route, routeHandler, verb, ctx) => {
            let RouteHandler = as(await include(routeHandler), RestHandler);
            if (RouteHandler) {
                let rh = new RouteHandler(route);
                return await rh.run(verb, ctx);
            } else {
                throw Exception.InvalidDefinition(`Invalid route handler. (${routeHandler})`);
            }
        };
        const chooseRouteHandler = (route) => {
            if (typeof route.handler === 'string') { return route.handler; }
            return route.handler[AppDomain.app().getRoutingContext(route.name)] || route.handler.default || ''; // will pick current context handler OR default handler OR error situation
        };
        const getHandler = (route, verb) => {
            return (req, res, next) => { 
                let ctx = new RestHandlerContext(req, res);

                const onError = (err) => {
                    let result = new RestHandlerResult(err);
                    if (result.status === 100) { // continue
                        next(); // continue to next
                    } else {
                        onDone(result, ctx);
                    }
                };
                const handleRoute = async () => {
                    // route.handler can be defined as:
                    // string: qualified type name of the handler
                    // object: { "routingContext": "handler", ...}
                    //      routingContext can be any value that represents a routing context for whatever situation 
                    //      this is read from App.getRoutingContext(routeName) - where some context string can be provided - 
                    //      basis it will pick required handler from here some examples of handlers can be:
                    //          free | freemium | full  - if some routing is to be based on license model
                    //          anything else
                    //      'default' must be defined to handle a catch-anything-else scenario 
                    //  this gives a handy way of diverting some specific routes while rest can be as is - statically defined
                    let routeHandler = chooseRouteHandler(route);
                    if (!routeHandler) { throw Exception.NotDefined(route); }
                    return await runHandler(route, routeHandler, verb, ctx); // it can throw any error including 100 (to continue to next handler)
                };

                // run interceptors
                runInterceptors(req, res).then(() => {
                    handleRoute().then((result) => {
                        onDone(result, ctx);
                    }).catch(onError);
                }).catch(onError);
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
            var err = Exception.NotFound(req.originalUrl);
            next(err);
        });

        // error handler
        mount.app.use((err, req, res) => {
            // note: 404 handler does not run interceptors
            let result = new RestHandlerResult(err);
            onDone(result, req, res);
        });
    };
});