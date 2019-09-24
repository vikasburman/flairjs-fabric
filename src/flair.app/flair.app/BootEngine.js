const { Bootware, IPortHandler } = await ns('flair.app');

/**
 * @name BootEngine
 * @description Bootstrapper functionality
 */
$$('static');
Class('', function() {
    this.start = async function() {
        let allBootwares = [],
            mountSpecificBootwares = [];
        
        const loadConfiguredEnv = async () => {
            env.x(settings.boot.env); // add it once as freezed
        };
        const addHeadElements = (list, elName) => {
            let el = null,
                value = null,
                isDefined = false,
                isEmpty = false,
                head = window.document.getElementsByTagName('head')[0];

            for(let item of list) {
                el = document.createElement(elName);
                isDefined = false;
                isEmpty = false;
                for(let key in item) { 
                    if (item.hasOwnProperty(key)) {
                        value = item[key];
                        if (['src', 'href'].indexOf(key) !== -1) { 
                            value = which(value); 
                            if (!value) { isEmpty = true; } // if src/href not defined, no point adding it
                        }
                        isDefined = true;
                        el.setAttribute(key, value); 
                    }
                }
                if (isDefined && !isEmpty) { head.appendChild(el); }
            }
        };
        const loadScripts = async () => { // scripts loading is supported only on client ui environment
            if (env.isClient && !env.isWorker) {
                // combined scripts (inbuilt and configured)
                // which() will pick as: (from src and href keys only)
                // envProp::mainThreadOnServer{.min}.xyz ~ envProp::workerThreadOnServer{.min}.xyz | envProp::mainThreadOnClient{.min}.xyz ~ envProp::workerThreadOnClient{.min}.xyz
                // here definition is an object having key-value pairs representing attribute and values of a script element in html header
                // e.g., { async: true, src: "./something" }
                // note: key-value pairs must match to a valid definition of script type element
                // it adds script one by one, they will end loading at different times
                // but since these are added, DOMReady will eventually ensure everything is loaded
                // before moving ahead
                let list = [
                ];
                list.push(...settings.boot.scripts);
                addHeadElements(list, 'script');
            }
        };
        const loadLinks = async () => { // links loading is supported only on client ui environment
            if (env.isClient && !env.isWorker) {
                // combined links (inbuilt and configured)
                // which() will pick as: (from src and href keys only)
                // envProp::mainThreadOnServer{.min}.xyz ~ envProp::workerThreadOnServer{.min}.xyz | envProp::mainThreadOnClient{.min}.xyz ~ envProp::workerThreadOnClient{.min}.xyz
                // here definition is an object having key-value pairs representing attribute and values of a link element in html header
                // e.g., { rel: "icon", href: "/favicon.ico" type: "image/x-icon" }
                // note: key-value pairs must match to a valid definition of link of that type
                // it adds links one by one, they will end loading at different times
                // but since these are added, DOMReady will eventually ensure everything is loaded
                // before moving ahead
                let list = [
                ];
                list.push(...settings.boot.links);
                addHeadElements(list, 'link');
            }
        };   
        const loadMeta = async () => {
            if (env.isClient && !env.isWorker) {
                // combined meta (inbuilt and configured)
                // which() will pick as: (from src and href keys only)
                // envProp::mainThreadOnServer{.min}.xyz ~ envProp::workerThreadOnServer{.min}.xyz | envProp::mainThreadOnClient{.min}.xyz ~ envProp::workerThreadOnClient{.min}.xyz
                // here definition is an object having key-value pairs representing attribute and values of a meta element in html header
                // e.g., { name: "viewport", content: "width=device-width, initial-scale=1" }
                // note: key-value pairs must match to a valid definition of meta of that type
                let list = [
                    { name: 'BuiltWith', content: `${flair.info.name}` }
                ];
                list.push(...settings.boot.meta);
                addHeadElements(list, 'meta');
            }
        };              
        const loadPreambles = async () => {
            let list = null,
                preambleLoader = null;

            // combined preambles (inbuilt and configured)
            // which() will pick as:
            // envProp::mainThreadOnServer{.min}.xyz ~ envProp::workerThreadOnServer{.min}.xyz | envProp::mainThreadOnClient{.min}.xyz ~ envProp::workerThreadOnClient{.min}.xyz
            // here definition is just the root folder of assembly group/module, where preamble.js would exists for that set of assemblies
            list = [
            ];
            list.push(...settings.boot.preambles);
            
            for(let item of list) {
                item = which(item);
                if (item) {
                    // suffix preamble.js
                    if (!item.endsWith('/')) { item += '/'; }
                    item += 'preamble{.min}.js'; // as bundled preambles can be minified too

                    // this loads it as a module and then call the exported function with flair instance
                    preambleLoader = await include(item);
                    await preambleLoader(flair);
                }
            }
        };
        const loadAssemblies = async () => {
            // combined assemblies (inbuilt and configured)
            // which() will pick as:
            // envProp::mainThreadOnServer{.min}.xyz ~ envProp::workerThreadOnServer{.min}.xyz | envProp::mainThreadOnClient{.min}.xyz ~ envProp::workerThreadOnClient{.min}.xyz
            // here definition is just the file and path name of the assembly to be loaded
            let list = [
                "./flair.app{.min}.js",
                "./flair.server{.min}.js | ./flair.client{.min}.js",
                "isExpress::./flair.server.express{.min}.js | isVue::./flair.client.vue{.min}.js",
                "isFirebase::./flair.server.firebase{.min}.js | x"
            ];
            list.push(...settings.boot.assemblies);

            for(let item of list) {
                item = which(item);
                if (item) { await AppDomain.context.loadAssembly(item); }
            }
        };
        const loadPortHandlers = async () => {
            let list = null,
                phType = null,
                ph = null;

            // combined port handlers (inbuilt and configured)
            // which() will pick as:
            // envProp::mainThreadOnServer{.min}.xyz ~ envProp::workerThreadOnServer{.min}.xyz | envProp::mainThreadOnClient{.min}.xyz ~ envProp::workerThreadOnClient{.min}.xyz
            // here definition is just the qualified type name which implements IPortHandler
            // note: ports of same type will be overwritten if defined multiple times, this is beneficial too, as
            // all inbuilt settings can be overwritten if need be 

            list = [
            ];
            list.push(...settings.boot.ports);

            for(let item of list) {
                item = which(item);
                if (item) {
                    phType = await include(phType);
                    ph = as(new phType(), IPortHandler);
                    if (ph) { Port.connect(ph.port, ph.factory); }
                }
            }
        };
        const loadBootwares = async () => {
            let list = null,
                bwType = null,
                bw = null;
                

            // combined bootwares (inbuilt and configured)
            // which() will pick as:
            // envProp::mainThreadOnServer{.min}.xyz ~ envProp::workerThreadOnServer{.min}.xyz | envProp::mainThreadOnClient{.min}.xyz ~ envProp::workerThreadOnClient{.min}.xyz
            // here definition is just the qualified type name which is derived from Bootware type
            list = [
                "flair.boot.NodeEnv ~ x | x",
                "isExpress::flair.boot.Middlewares ~ x | x",
                "flair.boot.ResHeaders ~ x | x",
                "flair.boot.DIContainer",
                "x | isVue::flair.boot.VueSetup ~ x",
                "flair.boot.ServerRouter ~ x | flair.boot.ClientRouter | x"
            ];
            list.push(...settings.boot.bootwares);

            for(let item of list) {
                item = which(item);
                if (item) {
                    bwType = as(await include(item), Bootware);
                    if (bwType) {
                        bw = new bwType(); 
                        allBootwares.push(bw); // push in array, so boot and ready would be called for them
                        if (bw.info.isMountSpecific) { // if bootware is mount specific bootware - means can run once for each mount
                            mountSpecificBootwares.push(bw);
                        }
                    }
                }
            }
        };
        const runBootwares = async (method) => {
            if (!env.isWorker) { // main env
                let mounts = AppDomain.host().mounts,
                    mountNames = Object.keys(mounts),
                    mountName = '',
                    mount = null;
            
                // run all bootwares for main
                mountName = 'main';
                mount = mounts[mountName];
                for(let bw of allBootwares) {
                    await bw[method](mount);
                }

                // run all bootwares which are mount specific for all other mounts (except main)
                for(let mountName of mountNames) {
                    if (mountName === 'main') { continue; }
                    mount = mounts[mountName];
                    for(let bw of mountSpecificBootwares) {
                        await bw[method](mount);
                    }
                }
            } else { // worker env
                // in this case as per load[] setting, no nountspecific bootwares should be present
                if (mountSpecificBootwares.length !== 0) { 
                    console.warn('Mount specific bootwares are not supported for worker environment. Revisit worker:flair.app->load setting.'); // eslint-disable-line no-console
                }

                // run all for once (ignoring the mountspecific ones)
                for(let bw of allBootwares) {
                    if (!bw.info.isMountSpecific) {
                        await bw[method]();
                    }
                }
            }
        };
        const boot = async () => {
            const Host = await include(settings.host);
            const App = await include(settings.app);
        
            // set host
            if (!env.isWorker) {
                let hostObj = new Host();
                await hostObj.boot();
                AppDomain.host(hostObj); 
            }
            
            // boot
            await runBootwares('boot');   
            
            // set app
            let appObj = new App();
            await appObj.boot();
            AppDomain.app(appObj); 
        };        
        const start = async () => {
            if (!env.isWorker) {
                await AppDomain.host().start();
            }
            await AppDomain.app().start();
        };
        const DOMReady = () => {
            return new Promise((resolve, reject) => { // eslint-disable-line no-unused-vars
                if( document.readyState !== 'loading' ) {
                    resolve();
                } else {
                    window.document.addEventListener("DOMContentLoaded", () => {
                        resolve();
                    });
                }
            });
        };
        const DeviceReady = () => {
            return new Promise((resolve, reject) => { // eslint-disable-line no-unused-vars
                window.document.addEventListener('deviceready', () => {
                    // NOTE: even if the device was already ready, registering for this event will immediately fire it
                    resolve();
                }, false);
            });
        };
        const ready = async () => {
            if (env.isClient && !env.isWorker) {
                await DOMReady();
                if (env.isCordova) { await DeviceReady(); }
            }

            if (!env.isWorker) {
                await AppDomain.host().ready();
            }
            await runBootwares('ready');
            await AppDomain.app().ready();
        };
          
        await loadConfiguredEnv();
        await loadMeta();
        await loadLinks();
        await loadScripts();
        await loadPreambles();
        await loadAssemblies();
        await loadPortHandlers();
        await loadBootwares();
        await boot();
        await start();
        await ready();
        console.log('ready!'); // eslint-disable-line no-console
        
        // return success
        return true;
    };
});
