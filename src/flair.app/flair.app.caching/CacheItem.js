/**
 * @name CacheItem
 * @description CacheItem structure
 */
Struct('', function() {
    this.construct = (id, cacheConfig) => {
        // TODO: check with Args() both are mandatory
        this.id = id;
        this.config = (typeof cacheConfig === 'number' ? { duration: cacheConfig } : cacheConfig)
    };

    $$('readonly');
    this.id = null;

    $$('readonly');
    this.config = null;    
});
