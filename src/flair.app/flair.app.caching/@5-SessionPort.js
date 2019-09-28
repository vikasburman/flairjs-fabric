
const { IPortHandler } = await ns();

/**
 * @name SessionPort
 * @description Default server/client session caching definition
 */
Class('', [IPortHandler], function() {
    this.construct = () => {
        // this inbuilt session-cache works over global.sessionStorage (on server) and window.sessionStorage (on client)
        // any external session-cache can be applied by providing a custom session-cache handler
        // in both server/client cases values are available in current node process (server) OR current browser page (client)
        this.handler = (env.isServer ? global.sessionStorage : window.sessionStorage);
    };

    $$('private');
    this.handler = null;

    $$('private');
    this.itemNamePrefix = '__session_';    

    $$('readonly');
    this.name = 'sessionStorage';

    this.key = async (key) => { return this.handler.key(this.itemNamePrefix + key); }
    this.getItem = async (key) => { return this.handler.getItem(this.itemNamePrefix + key); }
    this.setItem = async (key, value) => { return this.handler.setItem(this.itemNamePrefix + key, value); }
    this.removeItem = async (key) => { return this.handler.removeItem(this.itemNamePrefix + key); }
    this.clear = async () => { 
        let sessionKeys = Object.keys(this.handler);
        for(let key of sessionKeys) {
            if (key.startsWith(this.itemNamePrefix)) {
                this.handler.removeItem(key);
            }
        }
    };
});
