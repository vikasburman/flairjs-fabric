const { IAttribute } = await ns();

/**
 * @name FetchAttr
 * @description Fetch custom attribute
 * $$('fetch', 'connName', 'optsName', 'dataType', 'path');
 * connName: name of settings structure inside settings.api.connections.<connectionName>
 * optsName: name inside chosen connection inside settings.api.connections.<connectionName>.options.<optsName>
 * dataType: response data type: 'text', 'json', 'buffer', 'form', 'blob'
 * path: partial path of the resource where fetch call will go as per connection settings
 */
$$('sealed');
Class('', [IAttribute], function() {
    this.construct = () => {
        this.port = Port('fetchHandler');
    };

    $$('private');
    this.port = null;

    $$('readonly');
    this.name = 'fetch';

    $$('readonly');
    this.constraints = '(class || struct) && (func && async) && !($inject || $on || @fetch)';

    this.decorateFunction = (typeName, memberName, member, connName, optsName, dataType, path) => {
        let _this = this,
            connection = settings.api.connections[connName] || { options: {} },
            opts = connection.options[optsName] || {},
            url = connection.url || '';

        let replaceIt = (url, key, value) => {
            if (url.indexOf(key) !== -1) {
                // try to replace optional version first
                let _key = `/:${key}?`;
                if (url.indexOf(_key) !== -1) { 
                    if (value) {
                        url = replaceAll(url, _key, `/${encodeURIComponent(value.toString())}`); 
                    } else {
                        url = replaceAll(url, _key, ''); // replace with empty, so even '/' is removed - collapsing the whole section
                    }
                }

                // try to replace mandatory version next
                _key = `/:${key}`;
                if (url.indexOf(_key) !== -1) { 
                    if (value) {
                        url = replaceAll(url, _key, `/${encodeURIComponent(value.toString())}`); 
                    } else {
                        throw Exception.InvalidDefinition(key);
                    }
                }
            }
            return url;
        };       
        let composeApiUrl = (apiArgs) => {
            if (url) {
                if (!url.endsWith('/')) { url += '/'; }
                if (path) {
                    if (path.startsWith('/')) { path = path.substr(1); }
                    url += path;
                }
                if (apiArgs) { 
                    // fill values in URL from apiArgs values
                    // this goes like this
                    // any variable can be defined as /:varName 
                    // optional variable can be defined /:varName?
                    // it will find and replace any occurrence of /:varName with corresponding value from apiArgs
                    // if placeholder is set as /:varName and value is not found - it will throw error instead if it is /:varName? and value not found, this will remove that section from url
                    // NO OTHER FORM OF RESOLVE IS SUPPORTED - BECAUSE THIS IS NOT A URL MATCH SCENARIO - BUT STUFF DATA SCENARIO
                    //
                    // some special variables can also be defined
                    // :version <-- resolve to current version setting in environment
                    // :locale  <-- resolve to current locale setting in environment
                    //
                    // globally api specific environment values can be defined via
                    // env.props('api', 'key', 'value');
                    // any such values defined like these can be used in any path same as any other key like: /:key
                    // in this case, if same name variable is passed in apiArgs, that will gets precedence

                    // replace all values in apiArgs, leaving special keys: query, abortable and options
                    for(let key in apiArgs) {
                        if (apiArgs.hasOwnProperty(key) && ['query', 'abortable', 'options'].indexOf(key) === -1) {
                            url = replaceIt(url, key, apiArgs[key]);
                        }
                    }

                    // process all remaining keys from 'api' namespace in env props
                    // :version and :locale are also api keys, so will get resolved from this cycle
                    let apiNS = env.props('api');
                    for(let key in apiNS) {
                        url = replaceIt(url, key, apiNS[key]);
                    }
                }

                if (apiArgs.query) { // add query string
                    let qs = '?',
                        value = null;
                    for(let p in apiArgs.query) {
                        if (apiArgs.query.hasOwnProperty(p)) {
                            value = encodeURIComponent(apiArgs.query[p].toString());
                            qs += `${p}=${value}&`;
                        }
                    }
                    if (qs !== '?') {
                        if (qs.endsWith('&')) { qs = qs.substr(0, qs.length - 1); }
                        url += qs; // add these as well
                    }               
                }

            }
            return url;
        };

        // decorated function
        return async function(...args) {
            let api = (apiArgs) => { // eslint-disable-line no-unused-vars
                // returns a promise with an abort() if abortable is set 
                // apiArgs can be:
                // {
                //      key: value, key: value, ...                 <-- used to replace placeholders on url/path
                //      query: { key: value, key: value, ...}       <-- if present added as query-string to url at the end
                //      abortable: true/false                       <-- make call abortable, in this case adds an abort() method in returned promise object
                //      options: { key: value, key: value, ... }    <-- fetch-options picked for this call are overwritten with these (deep-merged)
                // }

                let apiAborter = (apiArgs.abortable ? new AbortController() : null),
                    apiReject = null;
                let apiPromise = new Promise((resolve, reject) => {
                    apiReject = reject;

                    // compose api url
                    composeApiUrl(apiArgs);
                    if (!url) { reject(Exception.InvalidDefinition(`${typeName}::${memberName}::fetch`)); return; }

                    // merge options with provided options
                    let fetchOptions = deepMerge([opts, apiArgs.options || {}], true);

                    // set abort signal
                    if (apiAborter) { fetchOptions.signal = apiAborter.signal; }

                    // initiate fetch
                    _this.port.fetch(url, dataType, fetchOptions).then(resolve).catch(reject);
                });

                // add abort method to promise for initiating the abort and rejection of promise
                if (apiAborter) {
                    apiPromise.abort = () => {
                        apiAborter.abort(); // abort the fetch call
                        apiReject(); // reject the promise
                    };
                }

                return apiPromise;
            };

            // inject configured api caller in args as first arg
            let mergedArgs = [new InjectedArg(api)];
            if (args) { mergedArgs.push(...args); }

            // call member
            return await member(...mergedArgs);
        };
    };
});
