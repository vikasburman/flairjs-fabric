const { IPortHandler } = await ns('flair.app');

/**
 * @name FetchPort
 * @description FetchPort and default implementation
 */
$$('sealed');
Class('', [IPortHandler], function() {
    this.construct = () => {
        this.port = which('serverFetch | clientFetch');
        Port.define(this.port, this.factory);
    };

    $$('readonly');
    this.port = null;

    $$('readonly');
    this.interface = null;

    $$('private');
    this.fetcher = async (fetchFunc, url, resDataType, reqData) => {
        if (typeof url !== 'string') { throw Exception.InvalidArgument('url'); }
        if (typeof resDataType !== 'string' || ['text', 'json', 'buffer', 'form', 'blob'].indexOf(resDataType) === -1) { throw Exception.InvalidArgument('resDataType'); }
        if (!reqData) { throw Exception.InvalidArgument('reqData'); }

        let response = await fetchFunc(url, reqData);
        if (!response.ok) { throw Exception.OperationFailed(url, response.status); }

        let resMethod = '';
        switch(resDataType) {
            case 'text': resMethod = 'text'; break;
            case 'json': resMethod = 'json'; break;
            case 'buffer': resMethod = 'arrayBuffer'; break;
            case 'form': resMethod = 'formData'; break;
            case 'blob': resMethod = 'blob'; break;
        }
        return await response[resMethod]();
    };

    $$('private');
    this.serverFetchFactory = (e) => { // eslint-disable-line no-unused-vars
        return (url, resDataType, reqData) => {
            return this.fetcher(require('node-fetch'), url, resDataType, reqData);
        };
    };

    $$('private');
    this.clientFetchFactory = (e) => { // eslint-disable-line no-unused-vars
        return (url, resDataType, reqData) => {
            return this.fetcher(fetch, url, resDataType, reqData);
        };
    };

    this.factory = (e) => {
        if (env.isServer) {
            return this.serverFetchFactory(e);
        } else {
            return this.clientFetchFactory(e);
        }
    };
});
