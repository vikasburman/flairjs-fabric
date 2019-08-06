/**
 * @name DirectFunctionHandler
 * @description Direct Function Handler
 */
$$('ns', '(auto)');
Class('(auto)', function() {
    this.direct = async (data, context) => { return await this.onCall(data, context); };

    $$('protected');
    $$('virtual');
    $$('async');
    this.onCall = noop;
});
