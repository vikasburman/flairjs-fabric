const { Bootware } = await ns('flair.app');
const { VueComponent, VueDirective, VueFilter, VueMixin, VuePlugin } = await ns('flair.ui');
const Vue = await include('vue/vue{.min}.js');

/**
 * @name VueSetup
 * @description Vue initializer
 */
Class('', Bootware, function() {
    $$('override');
    this.boot = async (base) => {
        base();

        let list = null,
            extType = null,
            ExtType = null,
            ext = null;

        // setup Vue configuration
        // TODO: (if any)

        // combined extensions (inbuilt and configured)
        // which() will pick as:
        // envProp::mainThreadOnServer{.min}.xyz ~ envProp::workerThreadOnServer{.min}.xyz | envProp::mainThreadOnClient{.min}.xyz ~ envProp::workerThreadOnClient{.min}.xyz
        // here definition is { "name": "name", "type": "ns.typeName", "options": {} }
        list = [
        ];
        list.push(...settings.vue.extensions);

        for(let item of list) {
            if (item.name && item.type) { 
                extType = which(item.type);
                if (extType) {
                    try {
                        ExtType = await include(extType);
                        ext = new ExtType();

                        if (as(extType, VueComponent)) { // global components
                            if (Vue.options.components[item.name]) { throw Exception.Duplicate(`Component already registered. (${item.name})`); } // check for duplicate
                            Vue.component(item.name, await ext.view('', null, null, item.options)); // register globally (without any context)
                        } else if (as(extType, VueDirective)) { // global directives
                            Vue.directive(item.name, await ext.factory()); 
                        } else if (as(ExtType, VueFilter)) { // filters
                            // TODO: prevent duplicate filter registration, as done for components
                            Vue.filter(item.name, await ext.factory());                            
                        } else if (as(ExtType, VueMixin)) { // mixins
                            Vue.mixin(await ext.factory());
                        } else if (as(ExtType, VuePlugin)) { // plugins
                            Vue.use(await ext.factory(), item.options || {});
                        } else {
                            throw Exception.InvalidArgument(extType);
                        }                        
                    } catch (err) {
                        throw Exception.OperationFailed(`Extension registration failed. (${extType})`, err);
                    }
                }
            }
        }
    };   
});
