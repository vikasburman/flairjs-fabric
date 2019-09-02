const { ViewHandler } = await ns('flair.ui');

/**
 * @name VueLayout
 * @description Vue Layout
 *              It's purpose is mostly to define layout - so components can be places differently
 *              the html of the layout should not have anything else - no data binding etc.
 */
$$('ns', '(auto)');
Class('(auto)', function() {
    let _thisId = guid();

    $$('virtual');
    this.construct = () => {
        this.viewArea = settings.layout.viewAreaEl || 'view';
    };

    this.merge = async (viewHtml) => {
        let layoutHtml = '',
            clientFileLoader = Port('clientFile');  

        const setBase = async () => {
            if (!this.baseName) {
                let typeQualifiedName = this.$Type.getName(),
                    baseName = typeQualifiedName.substr(typeQualifiedName.lastIndexOf('.') + 1);
                this.baseName = baseName;
            }

            if (!this.basePath) {
                this.basePath = this.$Type.getAssembly().assetsPath();
            }
        };        
        const autoWireHtmlAndCss = async () => {
            // auto wire html and styles, if configured as 'true' - for making 
            // it ready to pick from assets below
            if (typeof this.style === 'boolean' && this.style === true) {
                this.style = which(`./${this.baseName}/index{.min}.css`, true);
            }
            if (typeof this.html === 'boolean' && this.html === true) {
                this.html = which(`./${this.baseName}/index{.min}.html`, true);
            }
        };        
        const loadStyle = async () => {
            // load style content in property
            // if style file name is defined as text
            if (typeof this.style === 'string' && this.style.endsWith('.css')) { 
                // pick file from base path
                // file is generally defined as ./fileName.css and this will replace it as: ./<basePath>/fileName.css
                this.style = this.style.replace('./', this.basePath);
                
                // load file content
                this.style = await clientFileLoader(this.style);
            }

            // load styles in dom - as scoped style
            if (this.style) {
                this.style = replaceAll(this.style, '#SCOPE_ID', `#${_thisId}`); // replace all #SCOPE_ID with #<this_component_unique_id>
                ViewHandler.addStyle(_thisId, this.style); // static method, that add this style in context of view-being-loaded
            }
        };
        const loadHtml = async () => {
            // load html content in property
            // if html file is defined as text
            if (typeof this.html === 'string' && this.html.endsWith('.html')) { 
                // pick file from base path
                // file is generally defined as ./fileName.html and this will replace it as: ./<basePath>/fileName.html
                this.html = this.html.replace('./', this.basePath);

                // load file content
                this.html = await clientFileLoader(this.html);
            }

            // put entire html into a unique id div
            // even empty html will become an empty div here with ID - so it ensures that all components have a root div
            this.html = `<div id="${_thisId}">${this.html}</div>`;
        };      
        const injectComponents = async () => {
            // inject components
            layoutHtml = this.html;
            if (layoutHtml && this.areas && Array.isArray(this.areas)) {
                for(let area of this.areas) {
                    layoutHtml = replaceAll(layoutHtml, `[[${area.area}]]`, `<component is="${area.component}"></component>`);
                }
            }       
        };
        const injectView = async () => {
            // inject view
            if (layoutHtml) {
                layoutHtml = layoutHtml.replace(`[[${this.viewArea}]]`, viewHtml);
            }
        };

        await setBase();
        await autoWireHtmlAndCss();
        await loadStyle();
        await loadHtml();
        await injectComponents();
        await injectView();

        // done
        return layoutHtml;
    };

    $$('readonly');
    this.id = _thisId;

    $$('protected');
    this.baseName = '';

    $$('protected');
    this.basePath = '';

    $$('protected');
    this.html = null;

    $$('protected');
    this.style = null;

    // this is the "div-id" (in defined html) where actual view's html will come
    $$('protected');
    $$('readonly');
    this.viewArea = '';

    // each area here can be as:
    // { "area: "", component": "", "type": "" } 
    // "area" is the placeholder-text where the component needs to be placed
    // "area" placeholder can be defined as: [[area_name]]
    // "component" is the name of the component
    // "type" is the qualified component type name
    $$('protectedSet');
    this.areas = [];    
});
