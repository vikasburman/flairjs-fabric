const { Handler } = await ns('flair.app');

/**
 * @name ViewHandler
 * @description GUI View Handler
 */
Class('', Handler, function() {
    $$('override');
    this.construct = (base, staticFile) => {
        base();

        // static view situation
        if (typeof staticFile === 'string') {
            this.isStatic = true;
            this.staticRoot = settings.view.static.root || './pages/';
            this.staticFile = staticFile.replace('./', this.staticRoot);
        }
    };

    $$('readonly');
    this.isStatic = false;

    $$('readonly');
    this.staticFile = '';

    $$('protected');
    $$('readonly');
    this.staticRoot = '';

    $$('protected');
    $$('virtual');
    $$('async');
    this.loadView = noop;

    this.view = async (ctx) => { await this.loadView(ctx); }
});
