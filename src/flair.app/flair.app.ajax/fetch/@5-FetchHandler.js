const { IPortHandler } = await ns();

/**
 * @name FetchPort
 * @description Default server/client fetch implementation
 */
Class('', [IPortHandler], function() {
    this.construct = () => {
        if (env.isServer) {
            this.handler = require('node-fetch'); // node specific fetch clone
        } else {
            this.handler = fetch; // inbuilt javascript function
        }
    };

    $$('private');
    this.handler = null;

    $$('readonly');
    this.name = 'fetchHandler';

    this.fetch = async (url, dataType, opts) => {
        if (typeof url !== 'string') { throw Exception.InvalidArgument('url'); }
        if (typeof dataType !== 'string' || ['text', 'json', 'buffer', 'form', 'blob'].indexOf(dataType) === -1) { throw Exception.InvalidArgument('dataType'); }
        if (!opts) { throw Exception.InvalidArgument('opts'); }

        let response = await this.handler(url, opts);
        if (!response.ok) { throw Exception.OperationFailed(url, response.status); }

        let resMethod = '';
        switch(dataType) {
            case 'text': resMethod = 'text'; break;
            case 'json': resMethod = 'json'; break;
            case 'buffer': resMethod = 'arrayBuffer'; break;
            case 'form': resMethod = 'formData'; break;
            case 'blob': resMethod = 'blob'; break;
        }
        return await response[resMethod]();
    };
});
