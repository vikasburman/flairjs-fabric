
const { IDisposable } = await ns();

/**
 * @name Handler
 * @description Handler base class
 */
Class('', [IDisposable], function() {
    $$('virtual');
    this.construct = noop;

    $$('virtual');
    this.dispose = noop;
});
