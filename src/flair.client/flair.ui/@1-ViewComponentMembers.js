const { View } = await ns('flair.ui');

/**
 * @name ViewComponentMembers
 * @description View Component Members
 */
Mixin('', function() {
    let abortControllers = {},
        _id = guid();

    $$('protected');
    this.init = async ($mainType) => {
        // give it a unique name, if not already given
        this.name = this.name || $mainType.getName(true); // $mainType is actually this.$Type of view/component which is finally being instantiated

        // set baseName
        if (!this.baseName) {
            let typeQualifiedName = $mainType.getName(),
                baseName = typeQualifiedName.substr(typeQualifiedName.lastIndexOf('.') + 1);
            this.baseName = baseName;
        }

        // set paths
        if (!this.basePath) {
            this.basePath = $mainType.getAssembly().assetsPath();
        }
        if (!this.localePath) {
            this.localePath = $mainType.getAssembly().localesPath(); // note: this is without any specific locale
        }
    };

    $$('protected');
    this.initContent = async () => {
        // TODO: load everything except layout and merging of layout with main view html -- 
        // load i18n resources as well

        this.addStyle(); // will be called from here - once style is loaded
    };

    $$('protected');
    this.name = '';

    $$('readonly');
    this.id = _id;

    this.elId = () => {
        if (!this.host) {
            return `_GLOBAL_${this.name}`;  // for global components and view
        } else {
            return `_${this.host.name}_${this.name}`; // for local components and view
        }
    };

    $$('protected');
    this.host = null; // for view, this is view itself; for component this is hosting component

    $$('protected');
    this.html = null;

    $$('protected');
    this.style = null;

    $$('protected');
    this.data = null;

    $$('protected');
    this.baseName = '';

    $$('protected');
    this.basePath = '';

    $$('protected');
    this.localePath = '';    

    $$('protected');
    this.locale = (value) => { return AppDomain.host().locale(value, true); };

    $$('protected');
    this.version = (value) => { return AppDomain.host().version(value, true); };

    $$('protected');
    this.path = (path, params) => { return AppDomain.host().pathToUrl(path, params); };
    
    $$('protected');
    this.route = (routeName, params) => { return AppDomain.host().routeToUrl(routeName, params); };

    $$('protected');
    this.i18n = null;

    $$('protected');
    this.i18nValue = (key) => {
        let value = key || '',
            notFoundRepresentative = (env.isDebug ? ':' : '');

        // key can also be defined as: 
        //  @i18nNs.keyName | default value
        //  the value
        if (key && key.startsWith('@')) {
            key = key.substr(1); // remove @
            let keyItems = key.split('|');
            key = keyItems[0].trim();
            value = keyItems[1].trim() || '';
            if (this.i18n) {
                value = lens(this.i18n, key) || (notFoundRepresentative + value + notFoundRepresentative);
                // Note: notFoundRepresentative is added, to visually display in debug mode that key was defined, but key not found in json
            }
        }
        return value || '(i18n: 404)'; // finally if no default was defined
    };    

    $$('protected');
    $$('virtual');
    $$('async');
    this.loadData = noop;    

    $$('protected');
    this.cancelLoadData = async () => {
        let abortController = null;
        for(let handleId in abortControllers) {
            try {
                abortController = abortControllers[handleId];
                abortController.abort();
            } catch (err) { // eslint-disable-line no-unused-vars
                // ignore
            }
        }
        abortControllers = {}; // reset

        // any custom cleanup
        await this.onCancelLoadData();
    };

    $$('protected');
    this.abortHandle = (handleId) => {
        handleId = handleId || guid(); // use a unique if none is given
        let abortController = new AbortController(); // create new
        abortControllers[handleId] = abortController; // this may overwrite also
        return abortController; // give back the new handle
    };

    $$('protected');
    this.abort = (handleId) => {
        try {
            let abortController = abortControllers[handleId]; // this may or may not be present
            abortController.abort();
        } catch (err) { // eslint-disable-line no-unused-vars
            // ignore
        }
    };

    $$('protected');
    $$('virtual');
    $$('async');
    this.onCancelLoadData = noop; 
    
    $$('protected');
    $$('virtual');
    $$('async');
    this.onLoad = noop;

    $$('protected');
    $$('virtual');
    $$('async');
    this.beforeLoad = noop;

    $$('protected');
    $$('virtual');
    $$('async');
    this.afterLoad = noop;

    $$('protected');
    $$('virtual');
    $$('async');
    this.beforeLeave = noop;

    $$('private');
    this.removeStyle = () => {
        if (this.style) {
            let styleEl = document.head.getElementById(this.elId());
            if (styleEl) {  document.head.removeChild(styleEl); }
        }
    };

    $$('private');
    this.addStyle = () => {
        if (this.style) {
            let styleEl = window.document.createElement('style');
            styleEl.id = this.elId();
            styleEl.type = 'text/css';
            styleEl.appendChild(window.document.createTextNode(this.style));
            window.document.head.appendChild(styleEl);
        }
    };    

    this.broadcast = async (message, ...args) => {
        if (message.startsWith('receive:')) { // receive mode
            message = message.replace('receive:', '').trim();
            await this.onBroadcast({
                message: message,
                args: args
            });
        } else { // send mode
            if (View.currentView) {
                // first broadcast to view
                await View.currentView.broadcast('receive:' + message, ...args);
                
                // now broadcast to all components
                let components = View.currentView.memberComponents();
                for(let component of components) {
                    await component.broadcast('receive:' + message, ...args);
                }
            }
        }
    };

    $$('protected');
    $$('virtual');
    this.onBroadcast = async (e) => {
        switch(e.message) {
            case 'entering':
                break;
            case 'entered':
                break;
            case 'leaving':
                await this.beforeLeave();
                this.cancelLoadData(); // note: this is called and not waited for, so cancel can keep happening in background
                break;
            case 'left': 
                this.removeStyle();
                break;                
        }
    };
});