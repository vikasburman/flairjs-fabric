(() => { let ados = JSON.parse('[{"name":"flair.app","file":"./flair.app{.min}.js","mainAssembly":"flair","desc":"True Object Oriented JavaScript","title":"Flair.js","version":"0.30.71","lupdate":"Sat, 27 Apr 2019 21:54:36 GMT","builder":{"name":"<<name>>","version":"<<version>>","format":"fasm","formatVersion":"1","contains":["initializer","types","enclosureVars","enclosedTypes","resources","assets","routes","selfreg"]},"copyright":"(c) 2017-2019 Vikas Burman","license":"MIT","types":["flair.app.Bootware","flair.app.App","flair.app.Host","flair.app.Handler","flair.api.RestHandler","flair.app.BootEngine","flair.app.ClientHost","flair.app.ServerHost","flair.boot.DIContainer","flair.boot.Middlewares","flair.boot.NodeEnv","flair.boot.ResHeaders","flair.boot.Router"],"resources":[],"assets":[],"routes":[]},{"name":"flair.ui","file":"./flair.ui{.min}.js","mainAssembly":"flair","desc":"True Object Oriented JavaScript","title":"Flair.js","version":"0.30.71","lupdate":"Sat, 27 Apr 2019 21:54:37 GMT","builder":{"name":"<<name>>","version":"<<version>>","format":"fasm","formatVersion":"1","contains":["initializer","types","enclosureVars","enclosedTypes","resources","assets","routes","selfreg"]},"copyright":"(c) 2017-2019 Vikas Burman","license":"MIT","types":["flair.ui.ViewHandler","flair.ui.ViewTransition","flair.ui.vue.VueComponent","flair.ui.vue.VueFilter","flair.ui.vue.VueMixin","flair.ui.vue.VuePlugin","flair.ui.vue.VueSetup","flair.ui.vue.VueTransition","flair.ui.vue.VueView"],"resources":[],"assets":[],"routes":[]}]');
const flair = (typeof global !== 'undefined' ? require('flairjs') : (typeof WorkerGlobalScope !== 'undefined' ? WorkerGlobalScope.flair : window.flair));
flair.AppDomain.registerAdo(...ados);}
)();
