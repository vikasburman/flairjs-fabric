/**
 * @name Middleware
 * @description Server/Client middleware, where code executes on route where it is attached
 */
Class('', function() {
    $$('virtual');
    $$('async');
    this.run = noop;
});
