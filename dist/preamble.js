/**
 * @preserve
 * Preamble for assemblies at: ./
 * Created: Wed, 17 Jul 2019 21:52:59 GMT
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
        root['preambles'] = root['preambles'] || [];
        root['preambles'].push(loader);
    }
})(this, async function(flair) {
    'use strict';

    await flair(JSON.parse('{"name":"flair.app","file":"./flair.app{.min}.js","mainAssembly":"","desc":"Foundation for True Object Oriented JavaScript Apps","title":"Flair.js Fabric","version":"0.9.11","lupdate":"Wed, 17 Jul 2019 21:52:58 GMT","builder":{"name":"flairBuild","version":"1","format":"fasm","formatVersion":"1","contains":["init","func","type","vars","reso","asst","rout","sreg"]},"copyright":"(c) 2017-2019 Vikas Burman","license":"MIT","types":["flair.app.Bootware","flair.app.Handler","flair.app.App","flair.app.Host","flair.app.BootEngine","flair.boot.DIContainer"],"resources":[],"assets":[],"routes":[]}'));
	await flair(JSON.parse('{"name":"flair.client","file":"./flair.client{.min}.js","mainAssembly":"","desc":"Foundation for True Object Oriented JavaScript Apps","title":"Flair.js Fabric","version":"0.9.11","lupdate":"Wed, 17 Jul 2019 21:52:59 GMT","builder":{"name":"flairBuild","version":"1","format":"fasm","formatVersion":"1","contains":["init","func","type","vars","reso","asst","rout","sreg"]},"copyright":"(c) 2017-2019 Vikas Burman","license":"MIT","types":["flair.ui.ViewHandler","flair.ui.Page","flair.ui.vue.VueComponentMembers","flair.app.ClientHost","flair.boot.ClientRouter","flair.boot.vue.VueSetup","flair.ui.ViewInterceptor","flair.ui.ViewState","flair.ui.ViewTransition","flair.ui.vue.VueComponent","flair.ui.vue.VueDirective","flair.ui.vue.VueFilter","flair.ui.vue.VueLayout","flair.ui.vue.VueMixin","flair.ui.vue.VuePlugin","flair.ui.vue.VueView"],"resources":[],"assets":[],"routes":[]}'));
	await flair(JSON.parse('{"name":"flair.server","file":"./flair.server{.min}.js","mainAssembly":"","desc":"Foundation for True Object Oriented JavaScript Apps","title":"Flair.js Fabric","version":"0.9.11","lupdate":"Wed, 17 Jul 2019 21:52:59 GMT","builder":{"name":"flairBuild","version":"1","format":"fasm","formatVersion":"1","contains":["init","func","type","vars","reso","asst","rout","sreg"]},"copyright":"(c) 2017-2019 Vikas Burman","license":"MIT","types":["flair.api.RestHandler","flair.api.RESTfulService","flair.api.RestInterceptor","flair.app.ServerHost","flair.boot.Middlewares","flair.boot.NodeEnv","flair.boot.ResHeaders","flair.boot.ServerRouter"],"resources":[],"assets":[],"routes":[]}'));

});