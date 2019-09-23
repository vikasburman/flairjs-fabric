const { Handler } = await ns('flair.app');
const { RestHandlerResult } = await ns('flair.api');

/**
 * @name RestHandler
 * @description Restful API Handler
 */
Class('', Handler, function() {
    $$('override');
    this.run = async (base, verb, ctx) => {
        base(verb, ctx);

        let result = null,
            error = null,
            fn = null;

        // get handler function
        switch(verb) {
            case 'get': fn = this.onGet; break;
            case 'post': fn = this.onPost; break;
            case 'put': fn = this.onPut; break;
            case 'patch': fn = this.onPatch; break;
            case 'delete': fn = this.onDelete; break;
            case 'head': fn = this.onHead; break;
            case 'options': fn = this.onOptions; break;
            case 'trace': fn = this.onTrace; break;
        }

        // run the handler
        if (fn && fn !== noop) {
            try {
                result = await fn(ctx); // (result can be: AttachmentPayload, BinaryPayload, Payload OR any normal data like a number, object, string, boolean, array, etc. just anything )
            } catch (err) {
                error = err;
            }
        } else {
            error = Exception.NotImplemented(`Verb ${verb} is not implemented.`);
        }

        // get well formed result
        let isError = error ? true : false,
            isWellFormedResult = !isError && is(result, RestHandlerResult);
        if (!isWellFormedResult) { result = new RestHandlerResult(error, result); }

        // return 
        return result;
    };

    $$('protected');
    $$('virtual');
    $$('async');
    this.onGet = noop;

    $$('protected');
    $$('virtual');
    $$('async');
    this.onPost = noop;

    $$('protected');
    $$('virtual');
    $$('async');
    this.onPut = noop;

    $$('protected');
    $$('virtual');
    $$('async');
    this.onPatch = noop;

    $$('protected');
    $$('virtual');
    $$('async');
    this.onDelete = noop;

    $$('protected');
    $$('virtual');
    $$('async');
    this.onHead = noop;
    
    $$('protected');
    $$('virtual');
    $$('async');
    this.onOptions = noop;
    
    $$('protected');
    $$('virtual');
    $$('async');
    this.onTrace = noop;    
});
