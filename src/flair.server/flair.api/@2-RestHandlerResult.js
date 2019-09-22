const { HandlerResult } = await ns('flair.app');

/**
 * @name RESTHandlerResult
 * @description RESTful service Handler Result 
 */
Class('', HandlerResult, function() {
    $$('override');
    this.construct = (base, error, payload, resHeaders) => {
        base(error, payload, resHeaders);
    };
});
