const { ServerMiddleware } = await ns('flair.app');

/**
 * @name ResHeaders
 * @description Set response headers
 */
$$('sealed');
Class('', ServerMiddleware, function() {
    $$('override');
    this.onRun = async (base, req, res, ...args) => {
        base();
        
        // args can be defined as [ {}, {}, {} ]
        // each item is: { name: '', value:  }
        // name: standard header name
        // value: header value
        if (args && args.length > 0) {
            for(let header of args) {
                res.set(header.name, header.value);
            }
        }
    };
});
