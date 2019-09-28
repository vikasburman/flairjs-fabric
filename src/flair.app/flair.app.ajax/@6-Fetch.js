
const { FetchPort } = await ns('flair.app.ajax');

/**
 * @name Fetch
 * @description Fetch manager
 */
$$('singleton');
Class('', [FetchPort], function() {
});
