const { Bootware } = await ns('flair.app');

/**
 * @name SessionStorage
 * @description Ensure availability of browser sessionStorage clone in node process
 *              the way, on browser sessionStorage is different for each tab
 *              here 'sessionStorage' property on global will be different for each node instance in a cluster
 */
$$('sealed');
Class('', Bootware, function() {
    $$('override');
    this.boot = async (base, mount) => {
        base();
        
        if (!global.sessionStorage) { 
            const NodeSessionStorage = function() {
                let keys = {};
                this.key = (key) => { 
                    return (keys.key ? true : false); 
                };
                this.getItem = (key) => { 
                    return keys.key || null;
                };
                this.setItem = (key, value) => {
                    keys[key] = value || null;
                };
                this.removeItem = (key) => { 
                    delete keys[key];
                };
                this.clear = () => { 
                    keys = {};
                };                        
            };
            global.sessionStorage = new NodeSessionStorage();
        }
    };
});
