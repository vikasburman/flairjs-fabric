/**
 * @preserve
 * Preamble for assemblies at: ./
 * Created: Sun, 14 Jul 2019 23:27:37 GMT
 */
(function(root, loader) {
    'use strict';

    if (typeof define === 'function' && define.amd) { // AMD support
        define(loader);
    } else if (typeof exports === 'object') { // CommonJS and Node.js module support
        if (typeof module !== 'undefined' && module.exports) {
            exports = module.exports = loader; // Node.js specific module.exports
        }
        module.exports = exports = loader; // CommonJS        
    } else { // expose as global on window
        root['flair.preamble'] = loader; // always overwrites
    }
})(this, async function(flair) {
    'use strict';

    await flair(JSON.parse('{"name":"flair.app","file":"./flair.app{.min}.js","mainAssembly":"","desc":"True Object Oriented JavaScript","title":"Flair.js","version":"0.0.1","lupdate":"Sun, 14 Jul 2019 23:27:35 GMT","builder":{"name":"flairBuild","version":"1","format":"fasm","formatVersion":"1","contains":["init","func","type","vars","reso","asst","rout","sreg"]},"copyright":"(c) 2017-2019 Vikas Burman","license":"MIT","types":["flair.app.Bootware","flair.app.Handler","flair.ui.vue.VueComponentMembers","flair.api.RestHandler","flair.app.App","flair.app.Host","flair.ui.ViewHandler","flair.ui.Page","flair.app.ClientHost","flair.app.ServerHost","flair.boot.ClientRouter","flair.boot.DIContainer","flair.boot.Middlewares","flair.boot.NodeEnv","flair.boot.ResHeaders","flair.api.RESTfulService","flair.boot.vue.VueSetup","flair.ui.vue.VueView","flair.api.RestInterceptor","flair.ui.ViewInterceptor","flair.ui.ViewState","flair.ui.ViewTransition","flair.app.BootEngine","flair.ui.vue.VueComponent","flair.ui.vue.VueDirective","flair.ui.vue.VueFilter","flair.ui.vue.VueLayout","flair.ui.vue.VueMixin","flair.ui.vue.VuePlugin","flair.boot.ServerRouter"],"resources":[],"assets":[],"routes":[]}'));

});