/**
 * loader
 */
const start = require('flairjs-fabric/flair.server.firebase/start.js');
let _functions = start(__dirname, __filename, (flair, app) => {
    console.log('!'); // application is started now
});
for(let f in _functions) {
    exports[f] = _functions[f];
} // functions are ready now
