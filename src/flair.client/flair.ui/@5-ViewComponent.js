const { ViewComponentMembers } = await ns('flair.ui');

/**
 * @name ViewComponent
 * @description View Component
 */
Class('', [ViewComponentMembers], function() {
    $$('virtual');
    this.construct = (hostView) => {
        // register itself to host view
        hostView.components(this);
        this.host = hostView;
    };

    // TODO: This needs to be called where Component instance is being created
    // THIS IS exactly what is like calling factory() -- so where factory ie being called, this should be called from within that
    $$('protected');
    this.loadComponent = async (ctx) => {
         // initialize in context of this type
        await this.init(this.$Type);

         // initialize html/style/json content
         await this.initContent();        

        // custom load op before component is created
        await this.beforeLoad(ctx);      

        // view
        await this.onLoad(ctx);

        // custom load op after component is created but not shown yet
        await this.afterLoad(ctx);

        // now initiate async server data load process, this may take long
        // therefore any must needed data should be loaded either in beforeLoad 
        // or afterLoad functions, anything that can wait still when UI is visible
        // should be loaded here
        // corresponding cancel operations must also be written in cancelLoadData
        // NOTE: this does not wait for completion of this async method
        this.loadData(ctx); 
    };  
});