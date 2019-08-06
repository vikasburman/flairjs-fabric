/**
 * @name DirectFunctionHandler
 * @description Direct Function Handler
 */
$$('ns', '(auto)');
Class('(auto)', function() {
    this.run = async (context) => { return await this.onRun(context); };

    $$('protected');
    $$('virtual');
    $$('async');
    this.onRun = noop;
});
