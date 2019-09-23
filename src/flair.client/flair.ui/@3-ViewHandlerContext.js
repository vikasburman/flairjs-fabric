const { HandlerContext } = await ns('flair.app');

// Credit: https://gist.github.com/allenhwkim/19c2f36a7afa6f0c507008613e966d1b
const Cookie = function (tld) {
    this.tld = tld; // if true, set cookie domain at top level domain
    this.set = (name, value, days) => {
        let cookie = { [name]: value, path: '/' };
        if (days) {
            let date = new Date();
            date.setTime(date.getTime()+(days*24*60*60*1000));
            cookie.expires = date.toUTCString();
        }
          
        if (Cookie.tld) {
            cookie.domain = '.' + window.location.hostname.split('.').slice(-2).join('.');
        } 
      
        let arr = [];
        for(let key in cookie) {
            arr.push(`${key}=${cookie[key]}`);
        }
        document.cookie = arr.join('; ');
      
        return this.get(name);
    };
    this.getAll = () => {
        let cookie = {};
        document.cookie.split(';').forEach(el => {
            let [k,v] = el.split('=');
            cookie[k.trim()] = v;
        });
        return cookie;
    };
    this.get = (name) => {
        return this.getAll()[name];
    };
    this.delete = (name) => {
        this.set(name, '', -1);
    };
    this.deleteAll = () => {
        let cookie = this.getAll();
        for(let key in cookie) {
            this.delete(key);
        }        
    };
};

/**
 * @name ViewHandlerContext
 * @description View Handler Context
 */
Class('', HandlerContext, function() {
    $$('override');
    this.construct = (base, ctx) => { 
        base();

        this.ctx = ctx; // internal context
    };

    // ideally this should not be used directly
    $$('readonly');
    this.ctx = null;

    this.redirect = (route, params, query) => {
        this.setData('redirect-route', route);
        this.setData('redirect-params', params || null);
        this.setData('redirect-query', query || null);
        throw Exception.Redirect(route);
    };

    this.isSecure = { get: () => { this.protocol === 'https' ? true : false; } }
    this.readyState = { get: () => { return window.document.readyState; } }
    this.characterSet = { get: () => { return window.document.characterSet; } }
    this.url = { get: () => { return window.document.location.href; } }
    this.originalUrl = { get: () => { return this.ctx.$url; } } // location.pathname
    this.baseUrl = { get: () => { return this.ctx.$mount; } }
    this.route = { get: () => { return this.ctx.$route; } }
    this.origin = { get: () => { return window.document.location.origin; } }
    this.hostName = { get: () => { return window.document.location.hostname; } }
    this.port = { get: () => { return window.document.location.port; } }
    this.protocol = { get: () => { return window.document.location.protocol; } }
    this.path = { get: () => { return this.ctx.$path; } }
    this.hash = { get: () => { return window.document.location.hash; } }
    this.handler = { get: () => { return this.ctx.$handler; } }
    this.locale = { get: () => { return this.ctx.$locale; } }
    this.version = { get: () => { return this.ctx.$version; } }
    this.params = { get: () => { return this.ctx.$params; } }
    this.query = { get: () => { return this.ctx.$query; } }
    this.cookie = Object.freeze(new Cookie(true));
});
