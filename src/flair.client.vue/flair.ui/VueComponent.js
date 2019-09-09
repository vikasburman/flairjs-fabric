const { VueComponentMembers } = await ns('flair.ui');

/**
 * @name VueComponent
 * @description Vue Component
 */
Class('', [VueComponentMembers], function() {
    let _this = this;

    this.factory = async (ctx) => {
        // shared between view and component both
        // coming from VueComponentMembers mixin
        let component = await this.define(ctx);

        const factory_template = async () => {
            // template
            // https://vuejs.org/v2/api/#template
            // built from html and css settings
            if (this.html) {
                component.template = this.html.trim();
            }
        };
        const factory_props = async () => {
            // props
            // https://vuejs.org/v2/guide/components-props.html
            // https://vuejs.org/v2/api/#props
            // these names can then be defined as attribute on component's html node
            if (this.props && Array.isArray(this.props)) {
                component.props = this.props;
            }
        };
        const factory_data = async () => {
            // data
            // https://vuejs.org/v2/api/#data
            if (this.data) { 
                if (typeof this.data === 'function') {
                    component.data = function() { return _this.data(); }
                } else {
                    component.data = function() { return _this.data; }
                }
            }
        };
        const factory_name = async () => {
            // name
            // https://vuejs.org/v2/api/#name
            if (this.name) {
                component.name = this.name;
            }
        };
        const factory_model = async () => {
            // model
            // https://vuejs.org/v2/api/#model
            if (this.model) {
                component.model = this.model;
            }
        };
        const factory_inheritAttrs = async () => {
            // inheritAttrs
            // https://vuejs.org/v2/api/#inheritAttrs
            if (typeof this.inheritAttrs === 'boolean') { 
                component.inheritAttrs = this.inheritAttrs;
            }
        };

        await factory_template();
        await factory_props();
        await factory_data();
        await factory_name();
        await factory_model();
        await factory_inheritAttrs();

        // done
        return component;
    };

    $$('protected');
    this.props = null;

    $$('protected');
    this.model = null;    

    $$('protected');
    this.inheritAttrs = null;
});
