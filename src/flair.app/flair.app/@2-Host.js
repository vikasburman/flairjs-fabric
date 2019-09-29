const { IDisposable } = await ns();
const { Bootware } = await ns('flair.app');

/** 
 * @class
 * @desc Host base class
 * @public
 * @inherits flair.app.Bootware
 * @implements IDisposable
 */
Class('', Bootware, [IDisposable], function() {
    /**
     * @method start
     * @desc Initiate start sequence
     * @public
     * @virtual
     * @async
     * @returns Promise
     */     
    $$('virtual');
    $$('async');
    this.start = noop;

    /**
     * @method stop
     * @desc Initiate stop sequence
     * @public
     * @virtual
     * @async
     * @returns Promise
     */    
    $$('virtual');
    $$('async');
    this.stop = noop;

    /**
     * @event error
     * @desc Raised when an unhandled error has occurred
     * @public
     * @param object|Exception|string: err - generated error
     * @returns object: e - event arg
     * @returns @property object|Exception|string: error - generated error
     */
    this.error = event((err) => {
        return { error: err };
    });
    
    /**
     * @method raiseError
     * @desc Raise error event for given error
     * @public
     * @param object|Exception|string: err - generated error
     * @returns void
     */    
    this.raiseError = (err) => {
        this.error(err);
    };
});
