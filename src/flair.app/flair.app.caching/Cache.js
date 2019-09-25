/**
 * @name Cache
 * @description Cache handler wrapper
 */
$$('static');
Class('', function() {

    this.construct = () => {
        this.cacheHandler = Port('cacheHandler');
    };

    $$('private');
    this.cacheHandler = null;

    // TODO: complete this class with methods:
    // get(cacheItem)
    // set(cacheItem, value)
    // remove(cacheItem OR cacheId or Fn or Prop) <-- in case of fn or prop, it will build id on its own as cache attribute builds

    // also create a CacheItem structure
    // CacheItem(id, duration)

    this.get = async (cacheItem) => { // eslint-disable-line no-unused-vars
        // TODO - check args as well of cacheItem
    };
    this.set = async (cacheItem, value) => { // eslint-disable-line no-unused-vars
        // TODO
    };
    this.remove = async (cacheRef) => { // eslint-disable-line no-unused-vars
        // TODO // cacheRef: cacheItem OR cacheId or Fn or Prop 
    };
});
