/**
 * @name Page
 * @description Page routing (inspired from (https://www.npmjs.com/package/page))
 */
$$('sealed');
Class('', function() {
    let handlers = [],
        defaultHandler;

    this.construct = (options, params) => {
        // any path can be built using 

        // settings
        this.params = params || '';
        this.hasbang = options.hasbang || false;
        this.base = options.base || '';
        this.sensitive = options.sensitive || false;

        // ensure base has start '/' and no end '/'
        if (this.base.endsWith('/')) { this.base = this.base.substr(0, this.base.length - 1); }
        if (!this.base.startsWith('/')) { this.base = '/' + this.base; }
    };

    $$('readonly');
    this.hasbang = false;

    $$('readonly');
    this.params = '';

    $$('readonly');
    this.base = '';

    $$('readonly');
    this.sensitive = false;

    $$('private');
    this.pathToRegExp = (path, keys) => {
        /* eslint-disable no-useless-escape */
        // remove first and last slash
        if (path.startsWith('/')) { path = path.substr(1); }
        if (path.endsWith('/')) { path = path.substr(0, path.length - 1); }

        // break path into pieces and process
        let items = (path ? path.split('/') : []),
            regex = '',
            idx = 0;
        for(let item of items) {
            item = item.trim();
            if (item.startsWith(':')) { // param
                keys.push({ name: item.substr(1), index: idx });
                regex += '\/.[^\/]*'; // match anything till next /
            } else {
                regex += '\/' + item; // match exact
            }
            idx++;
        }

        // end with a slash
        regex += '\/';

        // case sensitive
        let regEx = null;
        if (!this.sensitive) {
            regEx = new RegExp(regex, "i"); // case in-sensitive
        } else {
            regEx = new RegExp(regex);
        }

        // NOTE: regular expression supports only placeholder
        // no optional params etc. are supported

        // done
        return regEx;
        /* eslint-enable no-useless-escape */
    };

    this.breakUrl = (url) => {
        let parts = {
            url: url,
            path: '',
            locale: '',
            version: '',
            params: {},
            handler: null,
            route: null
        },
        path = url;

        // remove hash etc.
        if (path.substr(0, 1) === '/') { path = path.substr(1); }        
        if (path.substr(0, 3) === '#!/') { path = path.substr(3); }
        if (path.substr(0, 2) === '#!') { path = path.substr(2); }
        if (path.substr(0, 2) === '#/') { path = path.substr(2); }
        if (path.substr(0, 1) === '#') { path = path.substr(1); }
        if (path.substr(0, 1) === '/') { path = path.substr(1); }
        path = '/' + path; // add initial slash

        // remove base
        if (path.startsWith(this.base)) {
            path = path.substr(this.base.length);
        }

        // add initial slash 
        if (!path.startsWith('/')) { path = '/' + path; }

        // extract query strings (?varName=value)
        let qsIndex = path.indexOf('?'),
            qs = '',
            qvars = null;
        if (qsIndex !== -1) { 
            qs = path.substr(qsIndex + 1);
            path = path.substr(0, qsIndex);
            let items = qs.split('&'),
                qitems = null;
            for(let item of items) {
                qitems = item.split('=');
                qvars = qvars || {};
                qvars[qitems[0].trim()] = decodeURIComponent(qitems[1].trim());
            }
        }     

        // add trailing slash 
        if (!path.endsWith('/')) { path += '/'; }

        // store
        parts.path = path;

        // find best matched handler and extract params
        for(let item of handlers) {
            let m = item.regex.exec(decodeURIComponent(path));
            if (m && m.input === m[0]) { // fully matched
                // remove first and last slash
                if (path.startsWith('/')) { path = path.substr(1); }
                if (path.endsWith('/')) { path = path.substr(0, path.length - 1); }
                let pathItems = (path ? path.split('/') : []);
                
                // pick key values from known index
                for(let key of item.keys) {
                    parts.params[key.name] = pathItems[key.index];
                }

                // set handler
                parts.handler = item.handler; 

                // set route
                parts.route = item.route;

                // set known mount params, if required
                if (this.params) {
                    let p = '';
                    p = ':version'; if (this.params.indexOf(p) !== -1 && parts.params['version']) { parts.version = parts.params['version']; }
                    p = ':locale'; if (this.params.indexOf(p) !== -1 && parts.params['locale']) { parts.locale = parts.params['locale']; }
                }

                // done
                break;
            }
        }

        // overwrite/merge params with qvars (if there were conflict)
        if (qvars) {
            parts.params = Object.assign(parts.params, qvars);
        }

        // done
        return parts;
    };
    this.buildUrl = (path, params) => {
        // start with base
        let url = this.base;
        if (!url.endsWith('/')) { url += '/'; }

        // add mount params next to base
        if (this.params) {
            let mountParams = this.params;
            if (mountParams.startsWith('/')) { mountParams = mountParams.substr(1); }
            url += mountParams;

            // add known mount params value to params
            // Note: All unknown mount params - means other than locale and version, whatever is
            // added in mount params - must be passed in params from outside
            // Note: For known mount params, this will always overwrite from what is set in env, so new URL can be built
            params = params || {};
            let p = '';
            p = ':version'; if (mountParams.indexOf(p) !== -1) { params['version'] = AppDomain.host().version(); }
            p = ':locale'; if (mountParams.indexOf(p) !== -1) { params['locale'] = AppDomain.host().locale(); }
        }

        // add path after base (and mountParams, if applicable)
        if (path.startsWith('/')) { path = path.substr(1); }
        url += path;
        if (!url.startsWith('/')) { url = '/' +  url; }
        
        // add # in the beginning
        if (this.hasbang) {
            url = '#!' + url;
        } else {
            url = '#' + url;
        }

        // end in /
        if (!url.endsWith('/')) { url += '/'; }

        // replace params
        // path can be like: test/:id
        // where it is expected that params.id property will 
        // have what to replace in this
        // If param var not found in path, it will be added as query string
        if (params) {
            let idx = -1,
                qs = '?',
                value = null;
            for(let p in params) {
                if (params.hasOwnProperty(p)) {
                    idx = url.indexOf(`:${p}`);
                    value = encodeURIComponent(params[p].toString());
                    if (idx !== -1) { 
                        url = replaceAll(url, `:${p}`, value); 
                    } else {
                        qs += `${p}=${value}`;
                    }
                }
            }
            if (qs !== '?') { url += qs; }            
        }

        // done
        return url;
    };

    this.add = (route, handler) => {
        let routePath = route.path;

        // modify route path to add mount params, other than base
        if (this.params) { // mount specific params are defined
            let newRoutePath = this.params;
            if (!newRoutePath.startsWith('/')) { newRoutePath = '/' + newRoutePath; } // add first /
            if (!newRoutePath.endsWith('/')) { newRoutePath = newRoutePath + '/'; } // add last /
            newRoutePath += routePath; // add route path
            routePath = newRoutePath.replace('//', '/'); // replace // with / (just in case)
        }

        let keys = []; // contains { name: name, index: indexPosition }
        handlers.push({
            route: route,
            path: routePath,
            keys: keys,
            regex: this.pathToRegExp(routePath, keys),
            handler: handler
        });
    };
    this.add404 = (handler) => {
        defaultHandler = handler;
    };
    this.run = async (url) => {
        // default ctx
        let ctx = {
            $url: url,
            $page: '',
            $route: '',
            $handler: '',
            $mount: '',
            $locale: '',
            $version: '',
            $path: '',
            $stop: false,  // if no further processing to be done
            $redirect: {
                route: '',
                params: {}
            } // route to redirect to
        };

        // get path parts
        let parts = this.breakUrl(url),
            params = parts.params;
        
        // enrich ctx
        ctx.$locale = parts.locale;
        ctx.$version = parts.version;
        if (parts.route) {
            ctx.$route = parts.route.name;
            ctx.$handler = parts.route.handler;
            ctx.$mount = parts.route.mount;
            ctx.$path = parts.route.path;
        } else {
            ctx.$path = parts.path;
        }

        // add params to ctx
        if (params) { ctx = Object.assign(ctx, params); }

        try {
            if (parts.handler) {
                // set locale
                if (parts.locale) { 
                    AppDomain.host().locale(parts.locale); // this will set only if changed
                }

                // set version
                if (parts.version) { 
                    AppDomain.host().version(parts.version); // this will set only if changed
                }
                
                // run handler
                await parts.handler(ctx);

                // redirect if configured
                if (ctx.$redirect.route) {
                    let route = ctx.$redirect,
                        params = ctx.$params;
                    setTimeout(() => { AppDomain.host().redirect(route, params) }, 0);
                }                
            } else {
                // run default handler 
                await defaultHandler(ctx);
            }
        } catch (err) {
            AppDomain.host().raiseError(err);
        }
    };
});
