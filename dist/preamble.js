/**
 * @preserve
 * Preamble for assemblies at: ./
 * Created: Tue, 24 Sep 2019 05:32:46 GMT
 */
(function(root, loader) {
    'use strict';

    if (typeof define === 'function' && define.amd) { // AMD support
        define(() => { return loader; });
    } else if (typeof exports === 'object') { // CommonJS and Node.js module support
        if (typeof module !== 'undefined' && module.exports) {
            exports = module.exports = loader; // Node.js specific module.exports
        }
        module.exports = exports = loader; // CommonJS        
    } else { // expose as global on window
        root.preamble = loader;
    }
})((this || globalThis), async function(flair) {
    'use strict';

    await flair(JSON.parse('{"name":"flair.app","file":"./flair.app{.min}.js","package":"flairjs-fabric","desc":"Foundation for True Object Oriented JavaScript Apps","title":"Flair.js Fabric","version":"0.60.6","lupdate":"Tue, 24 Sep 2019 05:32:43 GMT","builder":{"name":"flairBuild","version":"1","format":"fasm","formatVersion":"1","contains":["init","func","type","vars","reso","asst","rout","sreg"]},"copyright":"(c) 2017-2019 Vikas Burman","license":"MIT","types":["flair.app.Bootware","flair.app.HandlerContext","flair.app.Payload","flair.app.Handler","flair.app.App","flair.app.HandlerResult","flair.app.Host","flair.app.BootEngine","flair.app.IPortHandler","flair.app.attr.Cache","flair.boot.DIContainer"],"resources":[],"assets":[],"routes":[]}'));
	await flair(JSON.parse('{"name":"flair.client","file":"./flair.client{.min}.js","package":"flairjs-fabric","desc":"Foundation for True Object Oriented JavaScript Apps","title":"Flair.js Fabric","version":"0.60.6","lupdate":"Tue, 24 Sep 2019 05:32:44 GMT","builder":{"name":"flairBuild","version":"1","format":"fasm","formatVersion":"1","contains":["init","func","type","vars","reso","asst","rout","sreg"]},"copyright":"(c) 2017-2019 Vikas Burman","license":"MIT","types":["flair.ui.ViewComponentMembers","flair.ui.ViewHandlerContext","flair.ui.ViewTransition","flair.ui.ViewHandler","flair.ui.View","flair.ui.ViewComponent","flair.ui.Page","flair.boot.ClientRouter","flair.app.ClientHost","flair.ui.ViewInterceptor","flair.ui.ViewState"],"resources":[],"assets":["index.html","index.js","start.js"],"routes":[]}'));
	await flair(JSON.parse('{"name":"flair.client.vue","file":"./flair.client.vue{.min}.js","package":"flairjs-fabric","desc":"Foundation for True Object Oriented JavaScript Apps","title":"Flair.js Fabric","version":"0.60.6","lupdate":"Tue, 24 Sep 2019 05:32:45 GMT","builder":{"name":"flairBuild","version":"1","format":"fasm","formatVersion":"1","contains":["init","func","type","vars","reso","asst","rout","sreg"]},"copyright":"(c) 2017-2019 Vikas Burman","license":"MIT","types":["flair.ui.VueComponentMembers","flair.ui.VueView","flair.ui.VueComponent","flair.ui.VueDirective","flair.ui.VueFilter","flair.ui.VueMixin","flair.ui.VuePlugin","flair.boot.VueSetup"],"resources":[],"assets":[],"routes":[]}'));
	await flair(JSON.parse('{"name":"flair.server","file":"./flair.server{.min}.js","package":"flairjs-fabric","desc":"Foundation for True Object Oriented JavaScript Apps","title":"Flair.js Fabric","version":"0.60.6","lupdate":"Tue, 24 Sep 2019 05:32:45 GMT","builder":{"name":"flairBuild","version":"1","format":"fasm","formatVersion":"1","contains":["init","func","type","vars","reso","asst","rout","sreg"]},"copyright":"(c) 2017-2019 Vikas Burman","license":"MIT","types":["flair.api.AttachmentPayload","flair.api.BinaryPayload","flair.api.JSONPayload","flair.api.RestHandlerResult","flair.api.RestHandlerContext","flair.api.RestHandler","flair.api.RestInterceptor","flair.boot.NodeEnv"],"resources":[],"assets":["main.js","start.js"],"routes":[]}'));
	await flair(JSON.parse('{"name":"flair.server.express","file":"./flair.server.express{.min}.js","package":"flairjs-fabric","desc":"Foundation for True Object Oriented JavaScript Apps","title":"Flair.js Fabric","version":"0.60.6","lupdate":"Tue, 24 Sep 2019 05:32:45 GMT","builder":{"name":"flairBuild","version":"1","format":"fasm","formatVersion":"1","contains":["init","func","type","vars","reso","asst","rout","sreg"]},"copyright":"(c) 2017-2019 Vikas Burman","license":"MIT","types":["flair.app.ServerHost","flair.boot.Middlewares","flair.boot.ResHeaders","flair.boot.ServerRouter"],"resources":[],"assets":[],"routes":[]}'));
	await flair(JSON.parse('{"name":"flair.server.firebase","file":"./flair.server.firebase{.min}.js","package":"flairjs-fabric","desc":"Foundation for True Object Oriented JavaScript Apps","title":"Flair.js Fabric","version":"0.60.6","lupdate":"Tue, 24 Sep 2019 05:32:45 GMT","builder":{"name":"flairBuild","version":"1","format":"fasm","formatVersion":"1","contains":["init","func","type","vars","reso","asst","rout","sreg"]},"copyright":"(c) 2017-2019 Vikas Burman","license":"MIT","types":["flair.app.FirebaseApp"],"resources":[],"assets":["main.js","start.js"],"routes":[]}'));

});