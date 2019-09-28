
const { IPortHandler } = await ns();

/**
 * @name CachePort
 * @description Default server/client caching definition
 */
Class('', [IPortHandler], function() {
    this.construct = () => {
        const CacheStorage = function () {
            // this inbuilt cache-storage works over node-cache (on server) and window.localStorage + custom (on client)
            // any external cache-storage can be applied by providing a custom cache-storage handler
            // in both server/client cases values are available across node process (if supported) (server) OR across browser tabs/windows (client)

            let handler = null,
                options = {};

            const CacheItem = function(value, ttl = options.stdTTL) {
                let _value = value
                    _created = Date.now(),
                    _expiry = _created + ttl;
    
                this.value = () => { return value || null; };
                this.ttl = () => { return ttl; };
                this.created = () => { return _created; };
                this.isExpired = () => { return Date.now() > _expiry; };
                this.toJSONString = () => { return JSON.stringify({ v: _value, t: ttl, c: _created }); };
            };
            CacheItem.fromJSONString = (json) => {
                if (!json) { return null; }
                let _json = JSON.parse(json);
                return new CacheItem(_json.value(), _json.created(), _json.ttl());
            }; 

            if (env.isServer) {
                // define handler and options
                const NodeCache = require('node-cache');
                options = {
                    stdTTL: settings.boot.cache.TTL, // seconds
                    errorOnMissing: false,
                    checkperiod: 0, // no automatic deletion
                    useClones: true,
                    deleteOnExpire: false
                };
                handler = new NodeCache(options);

                // define calls
                this.key = async (key) => {
                    return (await this.getItem(key) ? true : false);
                };
                this.getItem = async (key) => {
                    if (!key) { return null; }
                    let item = CacheItem.fromJSONString(handler.get(key));
                    if (!item) { return null; }
                    if (item.isExpired()) { await this.removeItem(key); return null; }
                    if (settings.boot.cache.slidingTTL) { await this.setItem(key, item.value(), item.ttl()); }
                    return item.value();
                };
                this.setItem = async (key, value, ttl = options.stdTTL) => {
                    if (!key) { return false; }
                    let item = new CacheItem(value, ttl);
                    return handler.set(key, item.toJSONString());
                };
                this.removeItem = async (key) => {
                    if (!key) { return false; }
                    return (handler.del(key) > 0 ? true : false);
                };
                this.keys = async () => {
                    return handler.keys();
                };
            } else { // client
                // define handler and options
                options = {
                    stdTTL: settings.boot.cache.TTL
                };
                handler = window.localStorage;

                // define calls
                this.key = async (key) => {
                    return (await this.getItem(key) ? true : false);
                };
                this.getItem = async (key) => {
                    if(!key) { return null; }
                    let item = CacheItem.fromJSONString(handler.getItem(key));
                    if (!item) { return null; }
                    if (item.isExpired()) { await this.removeItem(key); return null; }
                    if (settings.boot.cache.slidingTTL) { await this.setItem(key, item.value(), item.ttl()); }
                    return item.value();
                };
                this.setItem = async (key, value, ttl = options.stdTTL) => {
                    if(!key) { return false; }
                    let item = new CacheItem(value, ttl);
                    return handler.setItem(key, item.toJSONString());
                };
                this.removeItem = async (key) => {
                    if (!key) { return false; }
                    if (!handler[key]) { return false; }
                    handler.removeItem(key);
                    return true;
                };
                this.keys = async () => {
                    return Object.keys(handler);
                };                
            }
        };
        this.handler = new CacheStorage();
    };

    $$('private');
    this.handler = null;

    $$('private');
    this.itemNamePrefix = '__cache_';      

    $$('readonly');
    this.name = 'cacheStorage';

    this.key = async (key) => { return await this.handler.key(this.itemNamePrefix + key); }
    this.getItem = async (key) => { return await this.handler.getItem(this.itemNamePrefix + key); }
    this.setItem = async (key, value) => { return await this.handler.setItem(this.itemNamePrefix + key, value); }
    this.removeItem = async (key) => { return await this.handler.removeItem(this.itemNamePrefix + key); }
    this.clear = async () => { 
        let cacheKeys = await this.handler.keys();
        for(key of cacheKeys) {
            if (key.startsWith(this.itemNamePrefix)) {
                await this.handler.removeItem(key);
            }
        }
    };
});
