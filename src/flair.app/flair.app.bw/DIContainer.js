const { Bootware } = await ns('flair.app');

/**
 * @name DIContainer
 * @description Initialize DI Container
 */
$$('sealed');
Class('', Bootware, function() {
    $$('override');
    this.boot = async (base) => {
        base();
        
        let containerItems = settings.boot.di.container;
        for(let alias in containerItems) {
            if (containerItems.hasOwnProperty(alias)) {
                Container.register(alias, containerItems[alias]);
            }
        }
    };
});
