// assembly globals
const onLoadComplete = (asm) => { // eslint-disable-line no-unused-vars
    // ports definition - start

    //  sessionStorage {
    //      key: (key)
    //      getItem: (key)
    //      setItem: (key, value)
    //      removeItem: (key)
    //      clear: ()
    //  }
    //  key: unique key of the session-item
    //  value: data to put in session
    Port.define('sessionStorage', ['key', 'getItem', 'setItem', 'removeItem', 'clear']);    

    //  stateStorage {
    //      key: (key)
    //      getItem: (key)
    //      setItem: (key, value)
    //      removeItem: (key)
    //      clear: ()
    //  }
    //  key: unique key of the state-item
    //  value: data to put in state
    Port.define('stateStorage', ['key', 'getItem', 'setItem', 'removeItem', 'clear']);    

    //  cacheStorage {
    //      key: (key)
    //      getItem: (key)
    //      setItem: (key, value)
    //      removeItem: (key)
    //      clear: ()
    //  }
    //  key: unique key of the state-item
    //  value: data to put in state
    Port.define('cacheStorage', ['key', 'getItem', 'setItem', 'removeItem', 'clear']);     

    //  fetchHandler {
    //      fetch: async (url, dataType, opts)
    //  }
    //  url: url to send fetch request
    //  dataType: response data type: 'text', 'json', 'buffer', 'form', 'blob' <-- based on this, it pre-process response data before return
    //  opts: fetch call configuration options 
    //      client (fetch): https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch#Syntax
    //      server (node-fetch): https://www.npmjs.com/package/node-fetch#options
    Port.define('fetchHandler', ['fetch']);

    // ports definition - end
};