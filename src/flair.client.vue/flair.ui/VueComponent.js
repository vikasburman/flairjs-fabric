const { ViewComponent, VueComponentMembers } = await ns('flair.ui');

/**
 * @name VueComponent
 * @description Vue Component
 */
Class('', ViewComponent, [VueComponentMembers], function() {
    let _this = this;

    $$('private');
    this.factory = async (ctx, el) => {
        let vueComponent = null;

        // shared between view and component both
        // coming from VueComponentMembers mixin
        vueComponent = await this.define(ctx, el);

        // template
        // https://vuejs.org/v2/api/#template
        // built from html and css settings
        if (this.html) {
            vueComponent.template = this.html.trim();
        }

        // props
        // https://vuejs.org/v2/guide/components-props.html
        // https://vuejs.org/v2/api/#props
        // these names can then be defined as attribute on component's html node
        if (this.props && Array.isArray(this.props)) {
            vueComponent.props = this.props;
        }
  
        // data
        // https://vuejs.org/v2/api/#data
        if (this.data) { 
            if (typeof this.data === 'function') {
                vueComponent.data = function() { return _this.data(); }
            } else {
                vueComponent.data = function() { return _this.data; }
            }
        }
 
        // name
        // https://vuejs.org/v2/api/#name
        if (this.name) {
            vueComponent.name = this.name;
        }

        // model
        // https://vuejs.org/v2/api/#model
        if (this.model) {
            vueComponent.model = this.model;
        }

        // inheritAttrs
        // https://vuejs.org/v2/api/#inheritAttrs
        if (typeof this.inheritAttrs === 'boolean') { 
            vueComponent.inheritAttrs = this.inheritAttrs;
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

        // set it to viewComponentObject
        // so it will be returned from view() method
        this.viewComponentObject = vueComponent;
    };

    $$('protected');
    this.props = null;

    $$('protected');
    this.model = null;    

    $$('protected');
    this.inheritAttrs = null;
});
