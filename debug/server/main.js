const flair = require('flairjs');
const preamble = require('../../dist/preamble.js');
preamble(flair).then(() => {
    const fabric = flair.AppDomain.getAdo('./flair.app.js');
    console.log(`${fabric.package} - v${fabric.version}`);
    debugger;
}).catch((err) => {
    console.log(err);
    debugger;
});
