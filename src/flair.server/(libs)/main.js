/**
 * loader
 */
const start = require('flairjs-fabric/flair.server/start.js');
start(__dirname, __filename, (flair, app) => {
    console.log('!'); // application is started now
});
