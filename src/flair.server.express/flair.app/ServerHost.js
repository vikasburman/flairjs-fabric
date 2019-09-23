const { Host } = await ns('flair.app');

/**
 * @name ServerHost
 * @description Server host implementation
 */
$$('sealed');
Class('', Host, function() {
    let mountedApps = {},
        httpServer = null,
        httpsServer = null,
        httpSettings = settings.express['server-http'],
        httpsSettings = settings.express['server-https'];         
    
    $$('override');
    this.construct = (base) => {
        base('Server');
    };

    this.app = {
        get: () => { return this.mounts['main'].app; },  // main express app
        set: noop
    };
    this.mounts = { // all mounted express apps
        get: () => { return mountedApps; },
        set: noop
    };

    // path support (start)
    this.routeToUrl = (route, params, query) => {
        if (!route) { return null; }

        // get route object
        let routeObj = AppDomain.context.current().getRoute(route); // route = qualifiedRouteName
        if (!routeObj) {
            return replaceAll(route, '.', '_'); // convert route qualified name in a non-existent url, so it will automatically go to notfound view
        }

        let url = routeObj.path;
        if (!url.startsWith('/')) { url = '/' +  url; }

        // replace params
        // path can be like: test/:id
        // where it is expected that params.id property will 
        // have what to replace in this
        // If param var not found in path, it will be added as query string
        // but ideally query string should be passed separately as object 
        let isQueryAdded = false;
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
                        qs += `${p}=${value}&`;
                    }
                }
            }
            if (qs !== '?') { 
                isQueryAdded = true;
                if (qs.endsWith('&')) { qs = qs.substr(0, qs.length - 1); } // remove last &
                url += qs; 
            }            
        }

        // query
        if (query) {
            let qs = isQueryAdded ? '&' : '?',
                value = null;
            for(let p in query) {
                if (query.hasOwnProperty(p)) {
                    value = encodeURIComponent(query[p].toString());
                    qs += `${p}=${value}&`;
                }
            }
            if (qs !== '?' || qs !== '&') {
                url += qs; // add these as well
            }               
        }

        // done
        return url;
    };
    // path support (end)    

    $$('override');
    this.boot = async (base) => { // mount all express app and sub-apps
        base();

        const express = await include('express | x');

        const applySettings = (mountName, mount) => {
            // app settings
            // each item is: { name: '', value:  }
            // name: as in above link (as-is)
            // value: as defined in above link
            let appSettings = this.getMountSpecificSettings('settings', settings.routing, mountName, 'name');
            if (appSettings && appSettings.length > 0) {
                for(let appSetting of appSettings) {
                    mount.set(appSetting.name, appSetting.value);
                }
            }            
        };

        // create main app instance of express
        let mainApp = express(),
            mainAppMountParams = (settings.routing['main'] ? settings.routing['main']['params'] : '') || '';
        applySettings('main', mainApp);

        // create one instance of express app for each mounted path
        let mountPath = '',
            mount = null,
            mountParams = '';
        for(let mountName of Object.keys(settings.routing.mounts)) {
            if (mountName === 'main') {
                mountPath = '/';
                mount = mainApp;
                mountParams = mainAppMountParams;
            } else {
                mountPath = settings.routing.mounts[mountName];
                mountParams = (settings.routing[mountName] ? settings.routing[mountName]['params'] : '') || '';
                mount = express(); // create a sub-app
            }

            // attach
            mountedApps[mountName] = Object.freeze({
                name: mountName,
                root: mountPath,
                params: mountParams,
                app: mount
            });

            // apply settings and attach to main app
            if (mountName !== 'main') {
                applySettings(mountName, mount);
                mainApp.use(mountPath, mount); // mount sub-app on given root path                
            }
        }

        // store
        mountedApps = Object.freeze(mountedApps);        
    };

    $$('override');
    this.start = async (base) => { // configure express http and https server
        base();

        // proceed only if not serverless environment
        if (env.x().isServerless) { return; }

        const fs = await include('fs | x');
        const http = await include('http | x');
        const https = await include('https | x');
        const httpShutdown = await include('http-shutdown | x');    

        // configure http server
        if (httpSettings.enable) { 
            httpServer = http.createServer(this.app);
            httpServer = httpShutdown(httpServer); // wrap
            httpServer.on('error', (err) => {
                this.error(err);
            }); // pass-through event
            if (httpSettings.timeout !== -1) { httpServer.timeout = httpSettings.timeout; } // timeout must be in milliseconds
        }

        // configure httpS server
        if (httpsSettings.enable) { 
            // SSL Certificate
            // NOTE: For creating test certificate:
            //  > Goto http://www.cert-depot.com/
            //  > Create another test certificate
            //  > Download KEY+PEM files
            //  > Rename *.private.pem as key.pem
            //  > Rename *.public.pem as cert.pem
            //  > Update these files at private folder
            const privateKey  = fs.readFileSync(AppDomain.resolvePath(httpsSettings.privateKey), 'utf8');
            const publicCert = fs.readFileSync(AppDomain.resolvePath(httpsSettings.publicCert), 'utf8');
            const credentials = { key: privateKey, cert: publicCert };

            httpsServer = https.createServer(credentials, this.app);
            httpsServer = httpShutdown(httpsServer); // wrap
            httpsServer.on('error', (err) => {
                this.error(err);
            }); // pass-through event
            if (httpsSettings.timeout !== -1) { httpsServer.timeout = httpsSettings.timeout; } // timeout must be in milliseconds
        }
    };

    $$('override');
    this.ready = (base) => { // start listening express http and https servers
        return new Promise((resolve, reject) => { // eslint-disable-line no-unused-vars
            base();

            // proceed only if not serverless environment
            if (env.x().isServerless) { resolve(); return; }

            // start server
            let httpPort = httpSettings.port || 80,
                httpsPort = process.env.PORT || httpsSettings.port || 443;
            if (httpServer && httpsServer) {
                httpServer.listen(httpPort, () => {
                    httpsServer.listen(httpsPort, () => {
                        console.log(`${AppDomain.app().info.name}, v${AppDomain.app().info.version} (http: ${httpPort}, https: ${httpsPort})`); // eslint-disable-line no-console
                        resolve();
                    });
                });
            } else if (httpServer) {
                httpServer.listen(httpPort, () => {
                    console.log(`${AppDomain.app().info.name}, v${AppDomain.app().info.version} (http: ${httpPort})`); // eslint-disable-line no-console
                    resolve();
                });
            } else if (httpsServer) {
                httpsServer.listen(httpsPort, () => {
                    console.log(`${AppDomain.app().info.name}, v${AppDomain.app().info.version} (https: ${httpsPort})`); // eslint-disable-line no-console
                    resolve();
                });
            } else {
                console.log(`${AppDomain.app().info.name}, v${AppDomain.app().info.version}`); // eslint-disable-line no-console
                resolve();
            }
        });
    };

    $$('override');
    this.stop = async (base) => { // graceful shutdown express http and https servers
        base();

        // proceed only if not serverless environment
        if (env.x().isServerless) { return; }

        // stop http server gracefully
        if (httpServer) {
            console.log('http server is shutting down...'); // eslint-disable-line no-console
            httpServer.shutdown(() => {
                httpServer = null;
                console.log('http server is cleanly shutdown!'); // eslint-disable-line no-console
            });
        }

        // stop https server gracefully
        if (httpsServer) {
            console.log('https server is shutting down...'); // eslint-disable-line no-console
            httpsServer.shutdown(() => {
                httpsServer = null;
                console.log('https server is cleanly shutdown!'); // eslint-disable-line no-console
            });
        }
    }; 

    $$('override');
    this.dispose = (base) => {
        base();

        mountedApps = null;
    };
});
