const { IDisposable } = await ns();
const { Bootware } = await ns('flair.app');

/**
 * @name App
 * @description App base class
 */
Class('', Bootware, [IDisposable], function() {
    $$('virtual');
    $$('async');
    this.start = noop;

    $$('virtual');
    $$('async');
    this.stop = noop;

    this.error = event((err) => {
        return { error: err };
    });
    
    this.raiseError = (err) => {
        this.error(err);
    };
});
