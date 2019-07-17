// load flair
const flair = require('../node_modules/flairjs/flair.js');

// define options
const options = {
    main: './server.js',
    config: '',
    module: './dist',
    engine: 'flair.app.BootEngine'
};

// start
flair(options).then((app) => {
    console.log(`*`);
    debugger;
});
