const { ViewHandler } = await ns('flair.ui');
const { VueComponentMembers } = await ns('flair.ui');

/**
 * @name VueView
 * @description Vue View
 */
Class('', ViewHandler, [VueComponentMembers], function() {
    $$('private');
    this.factory = async (ctx) => {
        let component = null,
            clientFileLoader = Port('clientFile');

        const autoWireAndLoadLayout = async () => {
            let isHtml = false,
                htmlContent = '';
            if (typeof this.layout === 'boolean' && this.layout === true) { // pick default layout from settings, if required
                this.layout = settings.layout.default || null; // the qualified type name
            } else if (typeof this.layout === 'string') {
                if (this.layout.startsWith('res:')) { // its an embedded resource (html) - res:<resTypeName>
                    let resTypeName = this.layout.substr(4); // remove res:
                    let res = AppDomain.context.current().getResource(resTypeName) || null;
                    isHtml = res && res.data;
                    if (isHtml) {
                        htmlContent = res.data;
                        this.layout = settings.layout.html2Layout; // default type, which will load given html
                    }
                } else if (this.layout.endsWith('.html')) { // its an asset file
                    isHtml = true;
                    let htmlFile = which(this.layout.replace('./', this.basePath), true);
                    htmlContent = await clientFileLoader(htmlFile);
                    this.layout = settings.layout.html2Layout; // default type, which will load given html
                } else { // its qualified type name
                    // let it be as is
                }
            }
            // load layout first, if only layout type name is given (e.g., in case it was picked from settings as above)
            if (typeof this.layout === 'string') {
                let layoutType = await include(this.layout);
                if (layoutType) {
                    if (isHtml) {
                        this.layout = new layoutType(htmlContent);
                    } else {
                        this.layout = new layoutType(); // note: this means only those layouts which do not require constructor arguments are suitable for this auto-wiring
                    }
                } else {
                    throw Exception.NotFound(`Layout not found. (${this.layout})`);
                }
            }

            // merge layout's components
            // each area here can be as:
            // { "area: "", component": "", "type": "" } 
            // "area" is the div-id (in defined html) where the component needs to be placed
            // "component" is the name of the component
            // "type" is the qualified component type name      
            if (this.layout && this.layout.areas && Array.isArray(this.layout.areas)) {
                this.components = this.components || [];
                for(let area of this.layout.areas) {
                    // each component array item is: { "name": "name", "type": "ns.typeName" }
                    this.components.push({ name: area.component, type: area.type });
                }
            }
        };
        const factory_component = async () => {
            // shared between view and component both
            // coming from VueComponentMembers mixin
            component = await this.define(ctx);
        };
        const setTitle = async () => {
            // set title 
            this.title = this.i18nValue(this.title);
        };
        const factory_el = async () => {
            // el
            // https://vuejs.org/v2/api/#el
            component.el = '#' + this.name;
        };
        const factory_propsData = async () => {
            // propsData
            // https://vuejs.org/v2/api/#propsData
            if (this.propsData) {
                component.propsData = this.propsData;
            }
        };
        const factory_data = async () => {
            // data
            // https://vuejs.org/v2/api/#data
            if (this.data) {
                if (typeof this.data === 'function') {
                    component.data = this.data();
                } else {
                    component.data = this.data;
                }
            }
        };

        await autoWireAndLoadLayout();
        await factory_component();
        await setTitle();
        await factory_el();
        await factory_propsData();
        await factory_data();

        // done
        return component;
    };    
    
    $$('protected');
    $$('override');
    $$('sealed');
    this.onView = async (base, ctx, el) => {
        base();

        const Vue = await include('vue/vue{.min}.js');

        // get component
        let component = await this.factory(ctx);

        // set view Html
        let viewHtml = this.html || '';
        if (this.layout) {
            el.innerHTML = await this.layout.merge(viewHtml);
        } else {
            el.innerHTML = viewHtml;
        }            

        // setup Vue view instance
        new Vue(component);
    };

    $$('protected');
    this.el = null;

    $$('protected');
    this.propsData = null;

    $$('protected');
    this.layout = null;
});
