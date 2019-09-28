
const { StatePort } = await ns('flair.app.caching');

/**
 * @name State
 * @description State manager
 */
$$('singleton');
Class('', [StatePort], function() {
});
