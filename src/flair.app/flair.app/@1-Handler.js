
const { IDisposable } = await ns();

/**
 * @name Handler
 * @description Handler base class
 */
Class('', [IDisposable], function() {
    $$('virtual');
    this.construct = (route) => {
        // convert this route (coming from routes.json) to registered route (Route)
        this.route = AppDomain.context.current().getRoute(route.name); // now this object has all route properties like getAssembly() etc.
    };

    $$('protected')
    this.route = null;

    $$('virtual');
    this.dispose = noop;
});
