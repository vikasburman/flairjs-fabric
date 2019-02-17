let container = {};

/**
 * @name Container
 * @description Returns registered types associated with given alias
 * @example
 *  Container(alias)
 *  Container(alias, isAll)
 * @params
 *  alias: string - name of alias to return registered items for //
 *  isAll: boolean - whether to return all items or only first item
 * @returns array/item - depending upon the value of isAll, return only first or all registered items
 *                        returns null, if nothing is registered for given alias
 */ 
flair.Container = (alias, isAll) => {
    if (typeof alias !== 'string') { throw new _Exception('InvalidArgument', 'Argument type is invalid. (alias)'); }
    // TODO: check and don't allow alias to have '.', as this means qualified name
    if (isAll) {
        return (container[alias] || []).slice();
    } else {
        if (container[alias] && container[alias].length > 0) {
            return container[alias][0]; 
        } else {
            return null;
        }
    }
};

/**
 * @name isRegistered
 * @description Checks if given alias is registered with container
 * @example
 *  isRegistered(alias)
 * @params
 *  alias: string - name of alias to check
 * @returns boolean - true/false
 */ 
flair.Container.isRegistered = (alias) => {
    if (typeof alias !== 'string') { throw new _Exception('InvalidArgument', 'Argument type is invalid. (alias)'); }
    return (typeof container[alias] !== 'undefined' &&  container[alias].length > 0);
};

/**
 * @name register
 * @description Register an actual type object OR a qualified name of a type OR a file, to resolve against given alias
 * @example
 *  register(alias, type)
 * @params
 *  alias: string - name of alias to register given type or qualified name
 *  type: object/string - it can be following:
 *      object - actual flair type or any non-primitive object
 *      string - qualified name of flair type OR path/name of a .js/.mjs file
 *      
 *      NOTE: Each type definition can also be defined for contextual consideration as:
 *      '<typeA> | <typeB>'
 *      when running on server, <typeA> would be considered, and when running on client <typeB> will be used* 
 * @returns boolean - true/false
 */ 
flair.Container.register = (alias, type) => {
    if (typeof alias !== 'string') { throw new _Exception('InvalidArgument', 'Argument type is invalid. (alias)'); }
    if (!type) { throw new _Exception('InvalidArgument', 'Argument type is invalid. (type)'); }

    // get what is being registered
    if (_is(type, 'flair')) {
        // flair type
    } else if (typeof type === 'object') {
        // some object
    } else if (typeof type === 'string') {
        // get contextual type for Server/Client scenario
        type = which(type);

        if (type.endsWith('.js') || type.endsWith('.mjs')) { 
            // its a JS file
        } else { 
            // qualified name
            // or it can be some other type of file as well like css, jpeg, anything and it is allowed
        }
    } else { // unknown type
        throw new _Exception('InvalidArgument', `Argument type is invalid. (${_typeOf(type)})`);
    }

    // register
    if (!container[alias]) { container[alias] = []; }
    container[alias].push(type);

    // return
    return true;
};

/**
 * @name resolve
 * @description Returns registered type(s) or associated with given alias
 * @example
 *  resolve(alias)
 *  resolve(alias, isMultiResolve)
 *  resolve(alias, isMultiResolve, ...args)
 * @params
 *  alias: string - name of alias to resolve
 *  isMultiResolve: boolean - should it resolve with all registered types or only first registered
 *  args: any - any number of arguments to pass to instance created for registered class or struct type
 * @returns array - having list of resolved types, qualified names or urls or created instances
 */ 
flair.Container.resolve = (alias, isMultiResolve, ...args) => {
    if (typeof alias !== 'string') { throw new _Exception('InvalidArgument', 'Argument type is invalid. (alias)'); }
    if (typeof isMultiResolve !== 'boolean') { throw new _Exception('InvalidArgument', 'Argument type is invalid. (isMultiResolve)'); }

    let result = null,
        getResolvedObject = (Type) => {
            let obj = Type; // whatever it was
            if (typeof Type === 'string') {
                if (Type.endsWith('.js') || Type.endsWith('.mjs')) { 
                    // file, leave it as is
                } else { // try to resolve it from a loaded type
                    let _Type = flair.Namespace.getType(Type); 
                    if (_Type) { Type = _Type; }
                }
            }

            if (['class', 'struct'].indexOf(_typeOf(Type)) !== -1) { // only class and struct need a new instance
                if (args) {
                    obj = new Type(...args); 
                } else {
                    obj = new Type(); 
                }
            }
            return obj;
        };
    
    if (container[alias] && container[alias].length > 0) {
        if (isMultiResolve) {
            result = [];
            for(let Type of container[alias]) {
                result.push(getResolvedObject(Type));
            }
        } else {
            let Type = container[alias][0]; // pick first
            result = getResolvedObject(Type);
        }
    }

    // resolved
    return result;
};

// reset api
flair.Container._ = {
    reset: () => { container = {}; }
};

// add to members list
flair.members.push('Container');

const _Container = flair.Container;