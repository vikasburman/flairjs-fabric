
const { IDisposable } = await ns();

/**
 * @name Handler
 * @description Handler base class
 */
$$('ns', '(auto)');
Class('(auto)', [IDisposable], function() {
    $$('virtual');
    this.construct = noop;

    $$('virtual');
    this.dispose = noop;
});
