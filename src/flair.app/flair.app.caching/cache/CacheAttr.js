const { IAttribute } = await ns();

/**
 * @name CacheAttr
 * @description Cache custom attribute
 * $$('cache')
 * $$('cache', ttl)
 * ttl: integer - time to live in seconds
 */
$$('sealed');
Class('', [IAttribute], function() {
    this.construct = () => {
        this.port = Port('cacheStorage');
    };

    $$('private');
    this.port = null;

    $$('readonly');
    this.name = 'cache';

    $$('readonly');
    this.constraints = '(class || struct) && (func && async) && !(timer || on || @cache)';

    this.decorateFunction = (typeName, memberName, member, ttl) => {
        let _this = this,
            cacheId = `${typeName}___${memberName}`;

        let callMember = async (...args) => {
            let resultData = await member(...args);
            await _this.port.setItem(cacheId, resultData, ttl);
            return resultData;
        };

        // decorated function
        return async function(...args) {
            let fetchedData = await _this.port.getItem(cacheId);
            return (fetchedData !== null) ? fetchedData : await callMember(...args);
        };
    };
});
