process.env.FLAIR_SYMBOLS="DEV,DEBUG";

const flair = require('flairjs');
const preamble = require('../../dist/preamble.js');
preamble(flair).then(() => {
    const info = flair.AppDomain.getAdo(flair.AppDomain.allAdos()[1]); // first one - after flair (flair is always first)
    console.log(`${info.package} - v${info.version}`);
    debugger;
}).catch((err) => {
    console.log(err);
    debugger;
});
