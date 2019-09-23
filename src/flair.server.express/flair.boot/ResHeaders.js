const { Bootware } = await ns('flair.app');

/**
 * @name ResHeaders
 * @description Express Response Header Settings (Common to all routes)
 */
$$('sealed');
Class('', Bootware, function() {
    $$('override');
    this.construct = (base) => {
        base('Server Response Headers', true); // mount specific
    };

    $$('override');
    this.boot = async (base, mount) => {
        base();
        
        let resHeaders = this.getMountSpecificSettings('resHeaders', settings.routing, mount.name, 'name');
        if (resHeaders && resHeaders.length > 0) {
            mount.app.use((req, res, next) => {
                // each item is: { name: '', value:  }
                // name: standard header name
                // value: header value
                for(let header of resHeaders) {
                    res.set(header.name, header.value);
                }
                next();
            });         
        }
    };
});
