const { IDisposable } = await ns();
const { Bootware } = await ns('flair.app');

/**
 * @name App
 * @description App base class
 */
Class('', Bootware, [IDisposable], function() {
    $$('override');
    this.construct = (base) => {
        // set info
        let asm = getAssembly(this);
        base(asm.title, asm.version);
    };
    
    $$('override');
    $$('sealed');
    this.boot = async (base) => {
        base();
        AppDomain.host().error.add(this.handleError); // host's errors are handled here
    };

    this.start = async () => {
        // initialize view state
        if (!env.isServer && !env.isWorker) {
            const { ViewState } = await ns('flair.ui');
            new ViewState(); // this initializes the global view state store's persistance via this singleton object
        }

        // do more
        await this.onStart();
    };

    $$('virtual');
    $$('async');
    this.onStart = noop;

    $$('override');
    $$('sealed');
    this.ready = async () => {
        // do more
        await this.onReady();
    };

    $$('virtual');
    $$('async');
    this.onReady = noop;

    this.stop = async () => {
        // clear view state
        if (!env.isServer && !env.isWorker) {
            const { ViewState } = await ns('flair.ui');
            new ViewState().clear();
        }

        // do more
        await this.onStop();
    };

    $$('virtual');
    $$('async');
    this.onStop = noop;

    $$('private');
    this.handleError = (e) => {
        // do more
        this.onError(e.args.error);
    };

    $$('virtual');
    this.onError = (err) => {
        throw Exception.OperationFailed(err, this.onError);
    };

    $$('virtual');
    $$('async');
    this.getRoutingContext = noop;

    $$('override');
    this.dispose = (base) => {
        base();
        AppDomain.host().error.remove(this.handleError); // remove error handler
    };
});
