const { IDisposable, ILifeCycleHandler, Bootware, LifeCycleHandler } = ns();

/**
 * @name App
 * @description App base class
 */
$$('ns', '(auto)');
Class('(auto)', Bootware, [LifeCycleHandler, ILifeCycleHandler, IDisposable], function() {
    $$('override');
    this.construct = (base) => {
        // set info
        let asm = getAssembly(this);
        base(asm.title, asm.version);
    };

    $$('virtual');
    this.dispose = noop;
});
