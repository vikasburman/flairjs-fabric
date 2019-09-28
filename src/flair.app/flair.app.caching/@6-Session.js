
const { SessionPort } = await ns('flair.app.caching');

/**
 * @name Session
 * @description Session manager
 */
$$('singleton');
Class('', [SessionPort], function() {
});
