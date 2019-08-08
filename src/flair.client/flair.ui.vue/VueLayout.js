const { ViewHandler } = ns('flair.ui');

/**
 * @name VueLayout
 * @description Vue Layout
 *              It's purpose is mostly to define layout - so components can be places differently
 *              the html of the layout should not have anything else - no data binding etc.
 */
$$('ns', '(auto)');
Class('(auto)', function() {
    let _thisId = guid();

    $$('readonly');
    this.id = _thisId;

    $$('protected');
    this.html = '';

    $$('protected');
    this.style = '';

    // this is the "div-id" (in defined html) where actual view's html will come
    $$('protected');
    this.viewArea = 'view';

    // each area here can be as:
    // { "area: "", component": "", "type": "" } 
    // "area" is the placeholder-text where the component needs to be placed
    // "area" placeholder can be defined as: [[area_name]]
    // "component" is the name of the component
    // "type" is the qualified component type name
    $$('protectedSet');
    this.areas = [];

    this.merge = async (viewHtml) => {
        // get port
        let clientFileLoader = Port('clientFile');  

        // load style content in property
        if (this.style && this.style.endsWith('.css')) { // if style file is defined via $$('asset', '<fileName>'); OR directly name is written
            // pick file from assets folder
            this.style = this.$Type.getAssembly().getAssetFilePath(this.style);
            // load file content
            this.style = await clientFileLoader(this.style);
            // load styles in dom - as scoped style
            if (this.style) {
                this.style = replaceAll(this.style, '#SCOPE_ID', `#${_thisId}`); // replace all #SCOPE_ID with #<this_component_unique_id>
                ViewHandler.addStyle(_thisId, this.style); // static method, that add this style in context of view-being-loaded
            }
        }

        // load html content in property
        if (this.html && this.html.endsWith('.html')) { // if html file is defined via $$('asset', '<fileName>');  OR directly name is written
            // pick file from assets folder
            this.html = this.$Type.getAssembly().getAssetFilePath(this.html);
            // load file content
            this.html = await clientFileLoader(this.html);
            // put entire html into a unique id div
            // even empty html will become an empty div here with ID - so it ensures that all layouts have a div
            this.html = `<div id="${_thisId}">${this.html}</div>`;            
        }

        // inject components
        let layoutHtml = this.html;
        if (this.areas && Array.isArray(this.areas)) {
            for(let area of this.areas) {
                layoutHtml = replaceAll(layoutHtml, `[[${area.area}]]`, `<component is="${area.component}"></component>`);
            }
        }       

        // inject view 
        layoutHtml = layoutHtml.replace(`[[${this.viewArea}]]`, viewHtml);

        // done
        return layoutHtml;
    };
});
