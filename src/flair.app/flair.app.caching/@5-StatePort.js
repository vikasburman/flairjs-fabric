
const { IPortHandler } = await ns();

/**
 * @name StatePort
 * @description Default server/client persisted state caching definition
 */
Class('', [IPortHandler], function() {
    this.construct = () => {
        // this inbuilt state-cache works over node-localstorage (on server) and window.localStorage (on client)
        // any external state-cache can be applied by providing a custom state-cache handler
        this.handler = (env.isServer ? require('node-localstorage') : window.localStorage);
    };

    $$('private');
    this.handler = null;

    $$('private');
    this.itemNamePrefix = '__state_';

    $$('readonly');
    this.name = 'stateStorage';

    this.key = async (key) => { return this.handler.key(this.itemNamePrefix + key); }
    this.getItem = async (key) => { return this.handler.getItem(this.itemNamePrefix + key); }
    this.setItem = async (key, value) => { return this.handler.setItem(this.itemNamePrefix + key, value); }
    this.removeItem = async (key) => { return this.handler.removeItem(this.itemNamePrefix + key); }
    this.clear = async () => { 
        if (env.isServer) {
            this.handler.clear(); 
        } else {
            let stateKeys = Object.keys(window.localStorage);
            for(key of stateKeys) {
                if (key.startsWith(this.itemNamePrefix)) {
                    this.handler.removeItem(key);
                }
            }
        }
    }
});
