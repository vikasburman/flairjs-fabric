const { HandlerContext } = await ns('flair.app');

/**
 * @name RestHandlerContext
 * @description Restful API Handler Context
 */
Class('', HandlerContext, function() {
    $$('override');
    this.construct = (base, req, res) => { 
        base();

        this.req = req;
        this.res = res;
    };

    // ideally this should not be used directly
    $$('readonly');
    this.req = null;

    // ideally this should not be used directly
    $$('readonly');
    this.res = null;

    this.redirect = (route, status, params, query) => {
        this.setData('redirect-route', route);
        this.setData('redirect-status', status || 302); // Found
        this.setData('redirect-params', params || null);
        this.setData('redirect-query', query || null);
        throw Exception.Redirect(route);
    };

    // response specific items
    this.isHeadersSent = { get: () => { return this.res.headersSent; } }
    this.getResHeader = (name) => { return this.res.get(name); };
    this.setHeader = (name, value, isAppend) => { 
        if (isAppend) {
            this.res.append(name, value);
        } else {
            this.res.set(name, value); 
        }
    };
    this.setCookie = (name, value, options) => { this.res.cookie(name, value, options); };
    this.clearCookie = (name, options) => { this.res.clearCookie(name, options); };

    // request specific items
    this.isAjaxReq = { get: () => { return this.req.xhr; } }
    this.isStale = { get: () => { return this.req.stale; } }
    this.isFresh = { get: () => { return this.req.fresh; } }
    this.isSecure = { get: () => { return this.req.secure; } }
    this.url = { get: () => { return this.req.url; } }
    this.originalUrl = { get: () => { return this.req.originalUrl; } }
    this.baseUrl = { get: () => { return this.req.baseUrl; } }
    this.route = { get: () => { return this.req.route; } }
    this.ip = { get: () => { return this.req.ip; } }
    this.ips = { get: () => { return this.req.ips; } }
    this.hostName = { get: () => { return this.req.hostname; } }
    this.subDomains = { get: () => { return this.req.subdomains; } }
    this.protocol = { get: () => { return this.req.protocol; } }
    this.path = { get: () => { return this.req.path; } }
    this.method = { get: () => { return this.req.method; } }
    this.body = { get: () => { return this.req.body; } }
    this.params = { get: () => { return this.req.params; } }
    this.query = { get: () => { return this.req.query; } }
    this.isContentType = (mimeType) => { 
        // https://expressjs.com/en/api.html#req.is
        if (typeof this.req.is(mimeType) === 'string') {
            return true; 
        } else {
            return false;
        }
    };
    this.getHeader = (name) => { return this.req.get(name); };
    this.getCookie = (name, isSigned) => { 
        if (isSigned) {
            if (this.req.signedCookies) { return this.req.signedCookies[name] || null; }
        } else {
            if (this.req.cookies) { return this.req.cookies[name] || null; }
        }
        return null;
    };
    this.acceptsContentType = (...types) => { return this.req.accepts(types); }
    this.acceptsCharset = (...types) => { return this.req.acceptsCharsets(types); }
    this.acceptsEncoding = (...types) => { return this.req.acceptsEncodings(types); }
    this.acceptsLanguage = (...types) => { return this.req.acceptsLanguages(types); }
});
