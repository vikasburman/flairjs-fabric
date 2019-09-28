const { Bootware, ServerMiddleware } = await ns('flair.app');

/**
 * @name Middlewares
 * @description Express Middleware Configurator
 */
$$('sealed');
Class('', Bootware, function() {
    $$('override');
    this.construct = (base) => {
        base(true); // mount specific
    };

    $$('override');
    this.boot = async (base, mount) => {
        base();

        const processMwArgs = (args = []) => {
            let mwArgs = [],
                argValue = null;
            for (let arg of args) {
                if (typeof arg === 'string' && arg.startsWith('return ')) { // note a space after return
                    argValue = new Function(arg)();
                } else if (typeof arg === 'object') {
                    for(let prop in arg) {
                        if (arg.hasOwnProperty(prop)) {
                            argValue = arg[prop];
                            if (typeof argValue === 'string' && argValue.startsWith('return ')) { // note a space after return
                                argValue = new Function(arg)();
                                arg[prop] = argValue;
                            }
                        }
                    }
                    argValue = arg;
                } else {
                    argValue = arg;
                }
                mwArgs.push(argValue);
            }
            return mwArgs;
        };

        // middleware information is defined at: https://expressjs.com/en/guide/using-middleware.html#middleware.application
        // each item is: { name: '', func: '', 'args': []  } OR { name: '', 'args': []  }
        // name: module name of the middleware, which will be included. This can also be a type inherited from Middleware
        // type: qualified type name that is derived from ServerMiddleware type
        // func: if middleware has a function that needs to be called for configuration, empty if required object itself is a function
        //       this is ignored when it is a type derived from ServerMiddleware
        // args: an array of args that need to be passed to this function or middleware function or onRun function of the custom Middleware
        //       Note: In case a particular argument setting is a function - define the function code as an arrow function string with a 'return prefix' and it will be loaded as function
        //       E.g., setHeaders in https://expressjs.com/en/4x/api.html#express.static is a function
        //       define it as: "return (res, path, stat) => { res.set('x-timestamp', Date.now()) }"
        //       this string will be passed to new Function(...) and returned values will be used as value of option
        //       all object type arguments will be scanned for string values that start with 'return ' and will be tried to convert into a function
        let middlewares = this.getMountSpecificSettings('middlewares', settings.routing, mount.name, 'name');
        if (middlewares && middlewares.length > 0) {
            let mod = null,
                func = null,
                MWType = null,
                mwObj = null;
            for(let middleware of middlewares) {
                try {
                    let mwArgs = processMwArgs(middleware.args);

                    // get module
                    // it could be 'express' itself for inbuilt middlewares
                    // it could be a type name as well which is inherited from 
                    MWType = null; mwObj = null;
                    mod = await include(middleware.name);
                    if (is(mod, 'flairtype') && as(mod, ServerMiddleware)) { // custom Middleware
                        MWType = mod;
                        mwObj = new MWType();
                        func = function (mw, ...args) {
                            return function (req, res, next) {
                                mw.run(req, res, next, ...args);
                            };
                        };
                    } else {
                        // get func
                        if (middleware.func) {
                            func = mod[middleware.func];
                        } else {
                            func = mod;
                        }
                    }

                    // add middleware
                    // this means, this middleware will be used on all methods on this mount path
                    if (mwObj) {
                        mount.app.use(func(mwObj, ...mwArgs));
                    } else {
                        mount.app.use(func(...mwArgs));
                    }
                } catch (err) {
                    throw Exception.OperationFailed(`Middleware ${middleware.name} load failed.`, err, this.boot);
                }
            }
        }
    };
});
