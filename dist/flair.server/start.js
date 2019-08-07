/**
 * start-server
*/
(function(root, factory) {
    'use strict';

    if (typeof define === 'function' && define.amd) { // AMD support
        define(() => { return factory; });
    } else if (typeof exports === 'object') { // CommonJS and Node.js module support
        if (typeof module !== 'undefined' && module.exports) {
            exports = module.exports = factory; // Node.js specific module.exports
        }
        module.exports = exports = factory; // CommonJS        
    } else { // expose as global on root
        root['flair_server_start'] = factory;
    }
})(this, function(entryPoint, callback) {
    'use strict';

    const flair = require('flairjs');
    flair(entryPoint).then((app) => {
        console.log('*');
        if (typeof callback === 'function') { callback(flair, app); }
    });
});
