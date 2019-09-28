
const { CachePort } = await ns('flair.app.caching');

/**
 * @name Cache
 * @description Cache manager
 */
$$('singleton');
Class('', [CachePort], function() {
});
