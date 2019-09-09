const { View, VueComponentMembers } = await ns('flair.ui');
const Vue = await include('vue/vue{.min}.js');

/**
 * @name VueView
 * @description Vue View
 */
Class('', View, [VueComponentMembers], function() {
    $$('private');
    this.factory = async (ctx, el) => {
        let vueComponent = null;

        // shared between view and component both
        // coming from VueComponentMembers mixin
        vueComponent = await this.define(ctx, el);

        // el
        // https://vuejs.org/v2/api/#el
        vueComponent.el = '#' + this.name;

        // propsData
        // https://vuejs.org/v2/api/#propsData
        if (this.propsData) {
            vueComponent.propsData = this.propsData;
        }

        // data
        // https://vuejs.org/v2/api/#data
        if (this.data) {
            if (typeof this.data === 'function') {
                vueComponent.data = this.data();
            } else {
                vueComponent.data = this.data;
            }
        }

        // done
        return vueComponent;
    };    
    
    $$('protected');
    $$('override');
    $$('sealed');
    this.onLoad = async (base, ctx, el) => {
        // don't call base, as that base functionality is defined here differently

        // load html into element
        el.innerHTML = this.html;

        // setup vue component
        let vueComponent = await this.factory(ctx, el);

        // load html
        this.html = el.innerHTML; // since components might have updated the html

        // initiate vue view
        new Vue(vueComponent);
    };

    $$('protected');
    this.propsData = null;
});
