const { IPortHandler } = await ns('flair.app');

/**
 * @name CachePort
 * @description CacheHandlerPort and default implementation
 */
$$('sealed');
Class('', [IPortHandler], function() {
    this.construct = () => {
        this.port = 'cacheHandler';
        this.interface = ['get', 'set', 'remove'];
        Port.define(this.port, this.interface, this.cacheHandler);
    };

    $$('readonly');
    this.port = null;

    $$('readonly');
    this.interface = null;

    this.factory = (e) => { // eslint-disable-line no-unused-vars
        // this inbuilt caching works over localstorage 
        // any external caching can be applied by providing a custom cache handler
        let cacheStorage = Port('localStorage'),
            cacheItemNamePrefix = '__cache_',
            cachedItemSavedAtNameSuffix = '__savedAt_';
    
        let funcs = {
            get: async (cacheId, cacheConfig) => {
                if (typeof cacheId !== 'string') { throw Exception.InvalidArgument('cacheId'); }
                if (!cacheConfig || !cacheConfig.duration) { throw Exception.InvalidArgument('cacheConfig'); }
    
                let itemKey = `${cacheItemNamePrefix}${cacheId}`,
                    savedAtItemKey = `${itemKey}${cachedItemSavedAtNameSuffix}`,
                    fetchedData = JSON.parse(cacheStorage.getItem(itemKey)).value,
                    dataSavedAt = parseInt(cacheStorage.getItem(savedAtItemKey));
                if ((Date.now() - dataSavedAt) <= cacheConfig.duration) { // cache is still hot
                    return fetchedData;
                } else { // cache is stale, delete it
                    cacheStorage.removeItem(itemKey);
                    cacheStorage.removeItem(savedAtItemKey);
                    throw Exception.NotFound(cacheId);
                }
            },
            set: async (cacheId, cacheConfig, fetchedData) => {
                if (typeof cacheId !== 'string') { throw Exception.InvalidArgument('cacheId'); }
                if (!cacheConfig) { throw Exception.InvalidArgument('cacheConfig'); }
                if (typeof fetchedData === 'undefined') { throw Exception.InvalidArgument('fetchedData'); }
    
                let itemKey = `${cacheItemNamePrefix}${cacheId}`,
                    savedAtItemKey = `${itemKey}${cachedItemSavedAtNameSuffix}`,
                    jsonFetchedData = JSON.stringify({value: fetchedData}),
                    dataSavedAt = Date.now().toString();
                cacheStorage.setItem(itemKey, jsonFetchedData);
                cacheStorage.setItem(savedAtItemKey, dataSavedAt);
            },
            remove: async (cacheId, cacheConfig) => { 
                if (typeof cacheId !== 'string') { throw Exception.InvalidArgument('cacheId'); }
                if (!cacheConfig) { throw Exception.InvalidArgument('cacheConfig'); }
            
                let itemKey = `${cacheItemNamePrefix}${cacheId}`,
                    savedAtItemKey = `${itemKey}${cachedItemSavedAtNameSuffix}`;
                cacheStorage.removeItem(itemKey);
                cacheStorage.removeItem(savedAtItemKey);
            }
        };
        return funcs;
    };
});
