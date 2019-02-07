// Namespace
// Namespace(Type)
flair.Namespace = (Type) => {
    // any type name can be in this format:
    // .name <-- means, no namespace is given but still register this with root namespace
    // name <-- means, no namespace is given but since it is not forced, do not register this with root namespace
    // namespace.name
    
    // only valid types are allowed
    if (['class', 'enum', 'interface', 'mixin', 'struct', 'resource'].indexOf(Type._.type) === -1) { throw `Type (${Type._.type}) cannot be placed in a namespace.`; }

    // only unattached types are allowed
    if (Type._.namespace) { throw `Type (${Type._.name}) is already contained in a namespace.`; }

    // remove force register symbol (.) from name and also fix name
    let isForced = false;
    if (Type._.name.startsWith('.')) {
        Type._.name = Type._.name.substr(1); // remove .
        isForced = true;
    }

    // merge/add type in namespace tree
    let nextLevel = flair.Namespace.root,
        nm = Type._.name,
        nsName = '',
        ns = nm.substr(0, nm.lastIndexOf('.'));
    nm = nm.substr(nm.lastIndexOf('.') + 1);
    if (ns) {
        let nsList = ns.split('.');
        for(let nsItem of nsList) {
            if (nsItem) {
                // special name not allowed
                if (nsItem === '_') { throw `Special name "_" is used as namespace in ${Type._.name}.`; }
                nextLevel[nsItem] = nextLevel[nsItem] || {};
                nsName = nsItem;

                // check if this is not a type itself
                if (nextLevel[nsItem]._ && nextLevel[nsItem]._.type !== 'namespace') { throw `${Type._.name} cannot be contained in another type (${nextLevel[nsItem]._.name})`; }

                // pick it
                nextLevel = nextLevel[nsItem];
            }
        }
    } else {
        if (!isForced) {
            return; // don't do anything
        }
    }

        // add type at the bottom, if not already exists
    if (nextLevel[nm]) { throw `Type ${nm} already contained at ${ns}.`; }
    nextLevel[nm] = Type;

    // add namespace
    Type._.namespace = nextLevel;

    // define namespace meta
    nextLevel._ = nextLevel._ || {};
    nextLevel._.name = nextLevel._.name || nsName;
    nextLevel._.type = nextLevel._.type || 'namespace';
    nextLevel._.types = nextLevel._.types || [];
    
    // add to Namespace
    nextLevel._.types.push(Type);

    // attach Namespace functions
    let getTypes = () => { 
        return nextLevel._.types.slice(); 
    }
    let getType = (qualifiedName) => {
        let _Type = null,
            level = nextLevel; // TODO: This is problem, in this case it is b and I am finding from root .....
        if (qualifiedName.indexOf('.') !== -1) { // if a qualified name is given
            let items = qualifiedName.split('.');
            for(let item of items) {
                if (item) {
                    // special name not allowed InvalidNameException
                    if (item === '_') { throw `Special name "_" is used as name in ${qualifiedName}.`; }
    
                    // pick next level
                    level = level[item];
                    if (!level) { break; }
                }
            }
            _Type = level;
        } else {
            _Type = level[qualifiedName];
        }
        if (!_Type || !_Type._ || ['class', 'enum', 'interface', 'mixin', 'struct'].indexOf(_Type._.type) === -1) { return null; }
        return _Type;
    };
    let createInstance = (qualifiedName, ...args) => {
        let _Type = nextLevel.getType(qualifiedName);
        if (_Type && _Type._.type != 'class') { throw `${name} is not a class.`; }
        if (_Type) { return new _Type(...args); }
        return null;
    };   
    nextLevel.getTypes = nextLevel.getTypes || getTypes;
    nextLevel.getType = nextLevel.getType || getType;
    nextLevel.createInstance = nextLevel.createInstance || createInstance;
};
flair.Namespace.root = {};
flair.Namespace.getType = (qualifiedName) => { 
    if (flair.Namespace.root.getType) {
        return flair.Namespace.root.getType(qualifiedName);
    }
    return null;
};
flair.Namespace.getTypes = () => {
    if (flair.Namespace.root.getTypes) {
        return flair.Namespace.root.getTypes();
    }
    return [];
};
flair.Namespace.createInstance = (qualifiedName, ...args) => {
    if (flair.Namespace.root.createInstance) {
        return flair.Namespace.root.createInstance(qualifiedName, ...args);
    }
    return null;
};

const _Namespace = flair.Namespace; // TODO: Fix

// reset api
flair.Namespace._ = {
    reset: () => { 
        // flair.Namespace.root = {}; 
    }
};

// In Reset func, clean all static and singleton flags as well for all registered classes

// add to members list
flair.members.push('Namespace');