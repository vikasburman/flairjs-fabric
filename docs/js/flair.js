/**
 * @preserve
 * FlairJS
 * True Object Oriented JavaScript
 * Version 0.15.30
 * Sun, 17 Feb 2019 18:51:42 GMT
 * (c) 2017-2019 Vikas Burman
 * MIT
 * https://flairjs.com
 */

// eslint-disable-next-line for-direction
(function(root, factory) { // eslint-disable-line getter-return
    'use strict';

    if (typeof define === 'function' && define.amd) { // AMD support
        define(factory);
    } else if (typeof exports === 'object') { // CommonJS and Node.js module support
        if (module !== undefined && module.exports) {
            exports = module.exports = factory(); // Node.js specific `module.exports`
        }
        module.exports = exports = factory(); // CommonJS        
    } else { // expose as global on window
        root.flair = factory();
    }
})(this, function() {
    'use strict';

    // locals
    let isServer = new Function("try {return this===global;}catch(e){return false;}")(),
        _global = (isServer ? global : window),
        flair = {},
        sym = [],
        disposers = [],
        options = {},
        argsString = '';

    // read symbols from environment
    if (isServer) {
        let idx = process.argv.findIndex((item) => { return (item.startsWith('--flairSymbols') ? true : false); });
        if (idx !== -1) { argsString = process.argv[idx].substr(2).split('=')[1]; }
    } else {
        argsString = (typeof window.flairSymbols !== 'undefined') ? window.flairSymbols : '';
    }
    if (argsString) { sym = argsString.split(',').map(item => item.trim()); }

    options.symbols = Object.freeze(sym);
    options.env = Object.freeze({
        type: (isServer ? 'server' : 'client'),
        global: _global,
        isTesting: (sym.indexOf('TEST') !== -1),
        isServer: isServer,
        isClient: !isServer,
        isCordova: (!isServer && !!window.cordova),
        isNodeWebkit: (isServer && process.versions['node-webkit']),
        isProd: (sym.indexOf('DEBUG') === -1 && sym.indexOf('PROD') !== -1),
        isDebug: (sym.indexOf('DEBUG') !== -1)
    });

    // flair
    flair.info = Object.freeze({
        name: 'FlairJS',
        version: '0.15.30',
        copyright: '(c) 2017-2019 Vikas Burman',
        license: 'MIT',
        link: 'https://flairjs.com',
        lupdate: new Date('Sun, 17 Feb 2019 18:51:42 GMT')
    });
    flair.members = [];
    flair.options = Object.freeze(options);
    const a2f = (name, obj, disposer) => {
        flair[name] = Object.freeze(obj);
        flair.members.push(name);
        if (typeof disposer === 'function') { disposers.push(disposer); }
    };

    // members
    // Aspect
    flair.Aspect = flair.Class('Aspect', function(attr) {
        let beforeFn = null,
            afterFn = null,
            aroundFn = null;
        attr('abstract');
        this.construct((...args) => {
            this.args = args;
        });
        
        this.prop('args', []);
        this.func('before', (fn) => {
            if (typeof fn === 'function') {
                beforeFn = fn;
            }
            return beforeFn;
        });
        this.func('after', (fn) => {
            if (typeof fn === 'function') {
                afterFn = fn;
            }
            return afterFn;
        });
        this.func('around', (fn) => {
            if (typeof fn === 'function') {
                aroundFn = fn;
            }
            return aroundFn;
        });
    });
    
    // Aspects
    let allAspects = [],
        regExpEscape = (s) => { return s.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&'); },
        wildcardToRegExp = (s) => { return new RegExp('^' + s.split(/\*+/).map(regExpEscape).join('.*') + '$'); };
    flair.Aspects = {};
    flair.Aspects.raw = () => { return allAspects; }
    flair.Aspects.register = (pointcut, Aspect) => {
        // pointcut: [namespace.]class[:func][/attr1[,attr2[,...]]]
        //      namespace/class/func:
        //          ~ - any
        //          *<text> - any name that ends with <text> 
        //          <text>* - any name that starts with <text>
        //          <text>  - exact name
        //      attribute:
        //          <text>  - exact name
        //
        //      Examples:
        //          ~                   - on all functions of all classes in all namespaces
        //          abc                 - on all functions of all classes names abc in root namespace (without any namespace)
        //          ~.abc               - on all functions of all classes names abc in all namespaces
        //          ~.abc:~             - on all functions of all classes names abc in all namespaces
        //          xyz.*               - on all functions of all classes in xyz namespace
        //          xyz.abc             - on all functions of class abc under xyz namespace
        //          xyz.abc:*           - on all functions of class abc under xyz namespace
        //          xyz.abc:f1          - on func f1 of class abc under xyz namespace
        //          xyz.abc:f*          - on all funcs that starts with f in class abc under xyz namespace
        //          xyz.xx*.abc         - on functions of all classes names abc under namespaces where pattern matches xyz.xx* (e.g., xyz.xx1 and xyz.xx2)
        //          xy*.xx*.abc         - on functions of all classes names abc under namespaces where pattern matches xyz.xx* (e.g., xy1.xx1 and xy2.xx1)
        //          abc/service         - on all functions of abc class in root namespace which has service attribute applied
        //          ~/service           - on all functions of all classes in all namespaces which has service attribute applied
        //          /service            - on all functions of all classes which has service attribute applied
        //          /service*           - on all functions of all classes which has service* attribute name pattern applied
    
    
        // split name and attributes
        let nm = pointcut || '~',
            ns = '',
            cls = '',
            fnc = '',
            attr = '~',     
            bucket = '';    
        if (nm.indexOf('/') !== -1) {
            let items = nm.split('/');
            nm = items[0].trim();
            attr = items[1].trim();
        }
    
        // get bucket to store in
        if (nm === '~') { 
            ns = '~';
            cls = '~';
            fnc = '~';
        } else if (nm === '') {
            ns = '^';
            cls = '~';
            fnc = '~';
        } else if (nm.indexOf('.') === -1) {
            ns = '^';
            if (nm.indexOf(':') === -1) {
                cls = nm;
                fnc = '~';
            } else {
                let itms = nm.split(':');
                cls = itms[0].trim();
                fnc = itms[1].trim();
            }
        } else {
            ns = nm.substr(0, nm.lastIndexOf('.'));
            nm = nm.substr(nm.lastIndexOf('.') + 1);
            if (nm.indexOf(':') === -1) {
                cls = nm;
                fnc = '~';
            } else {
                let itms = nm.split(':');
                cls = itms[0].trim();
                fnc = itms[1].trim();
            }        
        }
        if (ns === '*' || ns === '') { ns = '~'; }
        if (cls === '*' || cls === '') { cls = '~'; }
        if (fnc === '*' || fnc === '') { fnc = '~'; }
        if (attr === '*' || attr === '') { attr = '~'; }
        bucket = `${ns}=${cls}=${fnc}=${attr}`;
    
        // add bucket if not already there
        allAspects[bucket] = allAspects[bucket] || [];
        allAspects[bucket].push(Aspect);
    };
    flair.Aspects.get = (typeName, funcName, attrs) => {
    
        //TODO: attrs is an array of attrs - check name by .name property
        // get parts
        let funcAspects = [],
            ns = '',
            cls = '',
            fnc = funcName.trim();
    
        if (typeName.indexOf('.') !== -1) {
            ns = typeName.substr(0, typeName.lastIndexOf('.')).trim();
            cls = typeName.substr(typeName.lastIndexOf('.') + 1).trim(); 
        } else {
            ns = '^';
            cls = typeName.trim();
        }
    
        for(let bucket in allAspects) {
            let items = bucket.split('='),
                thisNS = items[0],
                rxNS = wildcardToRegExp(thisNS),
                thisCls = items[1],
                rxCls = wildcardToRegExp(thisCls),
                thisFnc = items[2],
                rxFnc = wildcardToRegExp(thisFnc),
                thisAttr = items[3],
                rxAttr = wildcardToRegExp(thisAttr),
                isMatched = (thisAttr === '~');
            
            if (((ns === thisNS || rxNS.test(ns)) &&
                (cls === thisCls || rxCls.test(cls)) &&
                (fnc === thisFnc || rxFnc.test(fnc)))) {
                if (!isMatched) {
                    for(let attr of attrs) {
                        if (attr.name === thisAttr || rxAttr.test(attr.name)) {
                            isMatched = true;
                            break; // matched
                        }
                    }
                }
                if (isMatched) {
                    for(let aspect of allAspects[bucket]) {
                        if (funcAspects.indexOf(aspect) === -1) {
                            funcAspects.push(aspect);
                        }
                    }                  
                }
            }
        }
    
        // return
        return funcAspects;
    };
    flair.Aspects.attach = (fn, typeName, funcName, funcAspects) => {
    // TODO: consider now functions and events are also supported as join points
    
    
        let before = [],
            after = [],
            around = [],
            instance = null,
            _fn = null;
    
        // collect all advices
        for(let funcAspect of funcAspects) {
            instance = new funcAspect();
            _fn = instance.before(); if (typeof _fn === 'function') { before.push(_fn); }
            _fn = instance.around(); if (typeof _fn === 'function') { around.push(_fn); }
            _fn = instance.after(); if (typeof _fn === 'function') { after.push(_fn); }
        }
    
        // around weaving
        if (around.length > 0) { around.reverse(); }
    
        // weaved function
        let weavedFn = function(...args) {
            let error = null,
                result = null,
                ctx = {
                    typeName: () => { return typeName; },
                    funcName: () => { return funcName; },
                    error: (err) => { if (err) { error = err; } return error;  },
                    result: (value) => { if (typeof value !== 'undefined') { result = value; } return result; },
                    args: () => { return args; },
                    data: {}
                };
            
            // run before functions
            for(let beforeFn of before) {
                try {
                    beforeFn(ctx);
                } catch (err) {
                    error = err;
                }
            }
    
            // after functions executor
            const runAfterFn = (_ctx) =>{
                for(let afterFn of after) {
                    try {
                        afterFn(_ctx);
                    } catch (err) {
                        ctx.error(err);
                    }
                }
            };
    
            // run around func
            let newFn = fn,
                _result = null;
            for(let aroundFn of around) { // build a nested function call having each wrapper calling an inner function wrapped inside advices' functionality
                newFn = aroundFn(ctx, newFn);
            }                    
            try {
                _result = newFn(...args);
                if (_result && typeof _result.then === 'function') { // async function
                    ctx.result(new Promise((__resolve, __reject) => {
                        _result.then((value) => {
                            ctx.result(value);
                            runAfterFn(ctx);
                            __resolve(ctx.result());
                        }).catch((err) => {
                            ctx.error(err);
                            runAfterFn(ctx);
                            __reject(ctx.error());
                        });
                    }));
                } else {
                    ctx.result(_result);
                    runAfterFn(ctx);
                }
            } catch (err) {
                ctx.error(err);
            }
    
            // return
            return ctx.result();
        };
    
        // done
        return weavedFn;
    };
    
    const _Aspects = flair.Aspects;

    /**
     * @name attr / $$
     * @description Decorator function to apply attributes on type and member definitions
     * @example
     *  attr(name) OR $$(name)
     *  attr(name, ...args) OR $$(name, ...args)
     * @params
     *  attrName: string/type - Name of the attribute, it can be an internal attribute or namespaced attribute name
     *                          It can also be the Attribute flair type itself
     *  args: any - Any arguments that may be needed by attribute
     * @returns void
     */ 
    const _$$ = (name, ...args) => {
        if (!name || ['string', 'class'].indexOf(_typeOf(name) === -1)) { throw new _Exception('InvalidArgument', 'Argument type is invalid. (name)'); }
        if (name && typeof name !== 'string' && !_isDerivedFrom(name, 'Attribute')) { throw new _Exception('InvalidArgument', 'Argument type is invalid. (name)'); }
    
        let AttrType = null,
            attrInstance = null,
            cfg = null;
        if (typeof name === 'string') {
            cfg = _attr._.inbuilt[name] || null;
            if (!cfg) { // not an inbuilt attr
                AttrType = _getType(name);
                if (!AttrType) { throw new _Exception('NotFound', `Attribute is not found. (${name})`); }
                name = AttrType._.name;
            }
        } else {
            AttrType = name; // the actual Attribute type
            name = AttrType._.name;
        }
    
        // duplicate check
        if (findIndexByProp(_attr._.bucket, 'name', name) !== -1) { throw new _Exception('Duplicate', `Duplicate attributes are not allowed. (${name})`); }
    
        // custom attribute instance
        if (AttrType) {
            attrInstance = new AttrType(...args);
            cfg = new _attrConfig(attrInstance.constraints);
        }
    
        // store
        _attr._.bucket.push({name: name, cfg: cfg, isCustom: (attrInstance !== null), attr: attrInstance, args: args});
    };
    const _attr = (name, ...args) => {
        return _$$(name, ...args);
    };
    _attr._ = Object.freeze({
        bucket: [],
        inbuilt: Object.freeze({ 
            static: new _attrConfig(true, '((class || struct) && !$abstract) || (((class || struct) && (prop || func)) && !($abstract || $virtual || $override))'),
        
            abstract: new _attrConfig(true, '((class || struct) && !$sealed && !$static) || (((class || struct) && (prop || func || event)) && !($override || $sealed || $static))'),
            virtual: new _attrConfig(true, '(class || struct) && (prop || func || construct || dispose || event) && !($abstract || $override || $sealed || $static)'),
            override: new _attrConfig(true, '(class || struct) && (prop || func || construct || dispose || event) && ((@virtual || @abstract) && !(virtual || abstract)) && !($sealed || $static))'),
            sealed: new _attrConfig(true, '(class || ((class && (prop || func || event)) && override)'), 
        
            private: new _attrConfig(true, '(class || struct) && (prop || func || event) && !($protected || @private || $static)'),
            protected: new _attrConfig(true, '(class || struct) && (prop || func || event) && !($private|| $static)'),
            readonly: new _attrConfig(true, '(class || struct) && prop && !abstract'),
            async: new _attrConfig(true, '(class || struct) && func'),
        
            enumerate: new _attrConfig('(class || struct) && prop || func || event'),
            dispose: new _attrConfig('class && prop'),
            post: new _attrConfig('(class || struct || mixin) && event'),
            on: new _attrConfig('class && func && !(event || $async || $args || $inject || $static)'),
            timer: new _attrConfig('class && func && !(event || $async || $args || $inject || @timer || $static)'),
            type: new _attrConfig('(class || struct || mixin) && prop'),
            args: new _attrConfig('(class || struct || mixin) && (func || construct) && !$on'),
            inject: new _attrConfig('class && (prop || func || construct) && !(static || session || state)'),
            singleton: new _attrConfig('(class && !(prop || func || event) && !($abstract || $static)'),
            serialize: new _attrConfig('((class || struct) || ((class || struct) && prop)) && !($abstract || $static)'),
            deprecate: new _attrConfig('!construct && !dispose'),
            session: new _attrConfig('(class && prop) && !($static || $state || $readonly || $abstract || $virtual)'),
            state: new _attrConfig('(class && prop) && !($static || $session || $readonly || $abstract || $virtual)'),
            conditional: new _attrConfig('(class || struct || mixin) && (prop || func || event)'),
            noserialize: new _attrConfig('(class || struct || mixin) && prop'),
        
            mixed: new _attrConfig('class && (prop || func || event)'),
            event: new _attrConfig('(class || struct || mixin || interface) && func && !($inject || $async)')
        })
    });
    _attr.collect = () => {
        let attrs = _attr._.bucket.slice();
        _attr.clear();
        return attrs;
    }
    _attr.has = (name) => {
        return (_attr._.bucket.findIndex(item => item.name === name) !== -1);
    };
    _attr.clear = () => {
        _attr._.bucket.length = 0; // remove all
    };
    
    /**
     * @name attr.Config
     * @description Attribute definition configuration
     * @example
     *  attr(constraints)
     *  attr(isModifier, constraints)
     * @params
     *  isModifier: boolean - if this is actually a modifier
     *  constraints: string - An expression that defined the constraints of applying this attribute 
     *                        using NAMES, PREFIXES, SUFFIXES and logical Javascript operator
     * 
     *                  NAMES can be: 
     *                      type names: class, struct, enum, interface, mixin, resource
     *                      type member names: prop, func, construct, dispose, event
     *                      inbuilt modifier names: static, abstract, sealed, virtual, override, private, protected, readonly, async
     *                      inbuilt attribute names: promise, singleton, serialize, deprecate, session, state, conditional, noserialize
     *                      custom attribute names: any registered custom attribute name
     *                      type names itself: e.g., Assembly, Attribute, etc. (any registered type name is fine)
     *                          SUFFIX: A typename must have a suffix (^) e.g., Assembly^, Attribute^, etc. Otherwise this name will be treated as custom attribute name
     *                  
     *                  PREFIXES can be:
     *                      No Prefix: means it must match or be present at the level where it is being defined
     *                      @: means it must be inherited from or present at up in hierarchy chain
     *                      $: means it either must be present at the level where it is being defined or must be present up in hierarchy chain
     *                  <name> 
     *                  @<name>
     *                  $<name>
     * 
     *                  BOOLEAN Not (!) can also be used to negate:
     *                  !<name>
     *                  !@<name>
     *                  !$<name>
     *                  
     *                  NOTE: Constraints are processed as logical boolean expressions and 
     *                        can be grouped, ANDed or ORed as:
     * 
     *                        AND: <name1> && <name2> && ...
     *                        OR: <name1> || <name2>
     *                        GROUPING: ((<name1> || <name2>) && (<name1> || <name2>))
     *                                  (((<name1> || <name2>) && (<name1> || <name2>)) || <name3>)
     * 
     * 
     * @constructs Constructs attribute configuration object
     */ 
    const _attrConfig = function(isModifier, constraints) {
        if (typeof isModifier === 'string') {
            constraints = isModifier;
            isModifier = false;
        }
        if (typeof constraints !== 'string') { throw new _Exception.InvalidArgument('constraints'); }
    
    
        // config object
        let _this = {
            isModifier: isModifier,
            constraints: constraints
        };
    
        // return
        return _this;
    };
    
    // attach to flair (NOTE: _attr is for internal use only, so collect/clear etc. are not exposed out)
    a2f('attr', _$$);
    a2f('$$', _$$);
       // OK
    // Attribute
    flair.Attribute = flair.Class('Attribute', function(attr) {
        let decoratorFn = null;
        
        attr('abstract'); // for Attribute type
        this.construct((...args) => {
            // args can be static or dynamic or settings
            // static ones are defined just as is, e.g.,
            //  ('text', 012, false, Reference)
            // dynamic ones are defined as special string
            //  ('[publicPropOrFuncName]', 012, false, Reference)
            // when string is defined as '[...]', this argument is replaced by a 
            // function which can be called (with binded this) to get dynamic value of the argument
            // the publicPropName is the name of a public property or function
            // name of the same object where this attribute is applied
            // settings ones are defined as another special string
            this.args = [];
            for(let arg of args) {
                if (typeof arg === 'string') {
                    if (arg.startsWith('[') && arg.endsWith(']')) {
                        let fnName = arg.replace('[', '').replace(']', ''),
                            fn = function() {
                                let member = this[fnName]; // 'this' would change because of binding call when this function is called
                                if (typeof member === 'function') {
                                    return member();
                                } else {
                                    return member;
                                }
                            };
                            this.args.push(fn);
                    } else {
                        this.args.push(arg);
                    }
                } else {
                    this.args.push(arg);
                }
            }
        });
        
       /** 
        *  constraints: string - An expression that defined the constraints of applying this attribute 
        *                        using NAMES, PREFIXES, SUFFIXES and logical Javascript operator
        * 
        *                  NAMES can be: 
        *                      type names: class, struct, enum, interface, mixin, resource
        *                      type member names: prop, func, construct, dispose, event
        *                      inbuilt modifier names: static, abstract, sealed, virtual, override, private, protected, readonly, async
        *                      inbuilt attribute names: promise, singleton, serialize, deprecate, session, state, conditional, noserialize
        *                      custom attribute names: any registered custom attribute name
        *                      type names itself: e.g., Assembly, Attribute, etc. (any registered type name is fine)
        *                          SUFFIX: A typename must have a suffix (^) e.g., Assembly^, Attribute^, etc. Otherwise this name will be treated as custom attribute name
        *                  
        *                  PREFIXES can be:
        *                      No Prefix: means it must match or be present at the level where it is being defined
        *                      @: means it must be inherited from or present at up in hierarchy chain
        *                      $: means it either must ne present at the level where it is being defined or must be present up in hierarchy chain
        *                  <name> 
        *                  @<name>
        *                  $<name>
        * 
        *                  BOOLEAN Not (!) can also be used to negate:
        *                  !<name>
        *                  !@<name>
        *                  !$<name>
        *                  
        *                  NOTE: Constraints are processed as logical boolean expressions and 
        *                        can be grouped, ANDed or ORed as:
        * 
        *                        AND: <name1> && <name2> && ...
        *                        OR: <name1> || <name2>
        *                        GROUPING: ((<name1> || <name2>) && (<name1> || <name2>))
        *                                  (((<name1> || <name2>) && (<name1> || <name2>)) || <name3>)
        * 
        **/
        this.func('constraints', ''); 
        this.prop('args', []);
        this.func('decorate', (fn) => {
            if (typeof fn === 'function') {
                decoratorFn = fn;
            }
            return decoratorFn;
        });
    
        // TODO: following cannot be name of any custom attributes
        // _supportedMembers = ['prop', 'func', 'construct', 'dispose', 'event'],
        // _supportedTypes = ['class', 'struct', 'enum', 'interface', 'mixin'],
        // _supportedModifiers = ['static', 'abstract', 'sealed', 'virtual', 'override', 'private', 'protected', 'readonly', 'async'],
    
    
        // TODO: how to decorate prop, func, evebt seperately
        this.func('resetEventInterface', (source, target) => {
            // TODO: this should be outside somewhere when applying attribute to the member
            target.subscribe = source.subscribe;
            target.unsubscribe = source.unsubscribe;
            delete source.subscribe;
            delete source.unsubscribe;
        });
    });
    
    /**
     * @name getAttr
     * @description Gets the attributes for given object or Type.
     * @example
     *  getAttr(obj, name, attrName)
     * @params
     *  obj: object - flair object instance of flair Type that needs to be checked
     *  name: string - when passed is flair object instance - member name for which attributes are to be read 
     *                 when passed is flair type - attribute name - if any specific attribute needs to be read (it will read all when this is null)
     *  attrName: string - if any specific attribute needs to be read (it will read all when this is null)
     * @returns array of attributes information objects { name, isCustom, args, type }
     *          name: name of the attribute
     *          isCustom: true/false - if this is a custom attribute
     *          args: attribute arguments
     *          type: name of the Type (in inheritance hierarchy) where this attribute comes from (when a type is inherited, attributes can be applied anywhere in hierarchy)
     */ 
    const _getAttr = (obj, name, attrName) => {
        if (!_is(obj, 'flair')) { throw new _Exception.InvalidArgument('obj'); }
        let isType = (['class', 'struct', 'interface', 'mixin', 'enum'].indexOf(_typeOf(obj) !== -1));
        if (isType && name) { attrName = name; name = ''; }
        if (!isType && name === 'construct') { name = '_construct'; }
        let result = [],
            attrHostItem = (isType ? 'type' : 'members');
    
        if (!attrName) { // all
            let found_attrs = obj._.attrs[attrHostItem].all(name).anywhere();                           // NOTE: name will be ignored in case of type call, so no harm
            if (found_attrs) { result.push(...sieve(found_attrs, 'name, isCustom, args, type', true)); }
        } else { // specific
            let found_attr = obj._.attrs[attrHostItem].probe(attrName, name).anywhere();                // NOTE: name will be ignored in case of type call, so no harm
            if (found_attr) { result.push(sieve(found_attr, 'name, isCustom, args, type', true)); }
        }
    
        // return
        return result;
    };
    
    // attach to flair
    a2f('getAttr', _getAttr);
        // OK

    /**
     * @name cli
     * @description Command Line Interface setup for server use
     * @example
     *  cli.build(options, cb)
     */
    const _cli = {
        build: (isServer ? require('./flair.build.js') : null)
    };
    
    // attach to flair
    a2f('cli', _cli);
    
        // OK
    /**
     * @name getAssembly
     * @description Gets the assembly information of a given object/type
     * @example
     *  _getAssembly(obj)
     * @params
     *  obj: instance/type/string - instance or flair type ir qualified type name whose assembly information is required
     * @returns object - if type is available and registered, assembly definition object is returned
     */ 
    const _getAssembly = (obj) => { 
        if (!obj) { throw new _Exception('InvalidArgument', 'Argument type is invalid. (obj)'); }
        if (typeof obj === 'string') { return _Assembly.get(obj); }
        else if (obj._ && typeof obj._.assembly === 'function') { return obj._.assembly(); }
        else if (obj._ && obj._.Type) { return obj._.Type._.assembly(); }
        return null;
    };
    
    // attach to flair
    a2f('getAssembly', _getAssembly);
        // OK
    /**
     * @name getType
     * @description Gets the flair Type of a registered type definition
     * @example
     *  getType(name)
     * @params
     *  name: string - qualified type name whose reference is needed
     * @returns object - if assembly which contains this type is loaded, it will return flair type object OR will return null
     */ 
    const _getType = (name) => { 
        if (typeof name !== 'string') { throw new _Exception('InvalidArgument', 'Argument type is invalid. (name)'); }
        return _Namespace.getType(name);
    };
    
    // attach to flair
    a2f('getType', _getType);
        // OK
    let asmFiles = {},
        asmTypes = {};
    
    /**
     * @name Assembly
     * @description Constructs an Assembly object
     * @example
     *  Assembly(ado)
     * @params
     *  ado: object - An ADO is an object that defines assembly definition as:
     *      name: string - name
     *      file: string - file name and path
     *      desc: string - description
     *      version: string - version
     *      copyright: string - copyright message
     *      license: - string - license
     *      types: - array - list of all type names that reside in this assembly
     *      assets: - array - list of all assets that are available outside this assembly but deployed together
     *      settings: - assembly settings
     * @returns object - flair assembly object
     */ 
    flair.Assembly = (ado) => {
        if (typeof ado !== 'object') { throw _Exception.InvalidArgument('ado'); }
        if (_typeOf(ado.types) !== 'array' || 
            _typeOf(ado.assets) !== 'array' ||
            typeof ado.name !== 'string' ||
            typeof ado.file !== 'string') {
            throw _Exception.InvalidArgument('ado');
        }
      
        // define assembly structure
        let _Assembly = flair.Struct('Assembly', function() {
            this.construct((ado) => {
                this.ado = ado;
                this.name = ado.name;
                this.file = which(ado.file, true); // min/dev contextual pick //TODO: make this readonly actuall all of it
                this.desc = ado.desc || '';
                this.version = ado.version || '';
                this.copyright = ado.copyright || '';
                this.license = ado.license || '';
                this.types = ado.types.slice() || [];
                this.settings = ado.settings || {};
                this.assets = ado.assets.slice() || [];
                this.hasAssets = (ado.assets.length > 0);
            });
    
            // TODO: isLoaded should be a property - as used in include
            // load is a async method
    
            // TODO: check, this should be same as in build engine
            // const appendADO = (ados, asm, asm_min, asmName, dest) => {
            //     // each ADO object has:
            //     //      "name": "", 
            //     //      "file": "",
            //     //      "desc": "",
            //     //      "version": "",
            //     //      "copyright": "",
            //     //      "license": "",
            //     //      "types": ["", "", ...],
            //     //      "assets": ["", "", ...],
            //     //      "settings: {}"
            
            /// TODO: props is no longer supported
            this.props(['readonly'], ['ado', 'name', 'file', 'desc', 'version', 'copyright', 'license', 'types', 'hasAssets']);
            
            this.prop('isLoaded', false);
            this.func('load', () => {
                return flair.Assembly.load(this.file);
            });
            this.func('getType', (name) => {
                if (typeof name !== 'string') { throw new _Exception('InvalidArgument', 'Argument type is invalid. (name)'); }
                if (!this.isLoaded) { throw new _Exception('NotLoaded', `Assembly is not yet loaded. (${this.file})`); }
                if (this.types.indexOf(name) === -1) { throw new _Exception('NotFound', `Type is not found in this assembly. (${name})`); }
                let Type = flair.Namespace.getType(name);
                if (!Type) { throw new _Exception('NotRegistered', `Type is not registered. (${name})`); }
                return Type;
            });
            this.func('createInstance', (name, ...args) => {
                if (typeof name !== 'string') { throw new _Exception('InvalidArgument', 'Argument type is invalid. (name)'); }
                let Type = flair.Assembly.get(name),
                    obj = null;
                if (args) {
                    obj = new Type(...args);
                } else {
                    obj = new Type();
                }
                return obj;
            });
        });
    
        // return
        return new _Assembly(ado);
    };
    
    /**
     * @name register
     * @description Register one or more assemblies as per given Assembly Definition Objects
     * @example
     *  register(...ados)
     * @params
     *  ados: object - An ADO is an object that defines assembly definition as:
     *      name: string - name
     *      file: string - file name and path
     *      desc: string - description
     *      version: string - version
     *      copyright: string - copyright message
     *      license: - string - license
     *      types: - array - list of all type names that reside in this assembly
     *      assets: - array - list of all assets that are available outside this assembly but deployed together
     *      settings: - assembly settings
     * @returns boolean - true/false
     */ 
    flair.Assembly.register = (...ados) => { 
        if (!ados) { throw new _Exception('InvalidArgument', 'Argument type is invalid. (ados)'); }
    
        let success = false;
        for(let ado of ados) {
            let asm = flair.Assembly(ado),
                asmFile = asm.file;
            if (asmFiles[asmFile]) {
                throw new _Exception('DuplicateName', `Assembly is already registered. (${asmFile})`);
            } else {
                // register
                asmFiles[asmFile] = asm;
    
                // load types
                for(let type of asm.types) {
                    // qualified names across anywhere should be unique
                    if (asmTypes[type]) {
                        throw new _Exception('DuplicateName', `Type is already registered. (${type})`);
                    } else {
                        asmTypes[type] = asm; // means this type can be loaded from this assembly
                    }
                }
    
                // success
                success = true;
            }
        }
    
        // returns
        return success;
    };
    
    /**
     * @name load
     * @description Loads an assembly file
     * @example
     *  load(file)
     * @params
     *  file: string - Assembly file to be loaded
     * @returns object - promise object
     */
    flair.Assembly.load = (file) => {
        return new Promise((resolve, reject) => {
            if (typeof file !== 'string') { reject(new _Exception('InvalidArgument', 'Argument type is invalid. (file)')); return; }
            if (!flair.Assembly.isRegistered(file)) { reject(new _Exception('NotFound', `Assembly is not registered. (${file})`)); return; }
    
            if (asmFiles[file].isLoaded) { resolve(); return; }
                
            if (isServer) {
                try {
                    require(file);
                    asmFiles[file].markLoaded();
                    resolve();
                } catch (e) {
                    reject(new _Exception('FileLoad', `File load operation failed. (${file})`, e));
                }
            } else {
                const script = flair.options.env.global.document.createElement('script');
                script.onload = () => {
                    asmFiles[file].isLoaded = true;
                    resolve();
                };
                script.onerror = (e) => {
                    reject(new _Exception('FileLoad', `File load operation failed. (${file})`, e));
                };
                script.async = true;
                script.src = file;
                flair.options.env.global.document.body.appendChild(script);
            }
        });
    };
    
    /**
     * @name isRegistered
     * @description Checks to see if given assembly file is registered
     * @example
     *  isRegistered(file)
     * @params
     *  file: string - full path and name of the assembly file to check for
     * @returns boolean - true/false
     */ 
    flair.Assembly.isRegistered = (file) => {
        if (typeof file !== 'string') { throw new _Exception('InvalidArgument', 'Argument type if not valid. (file)'); }
        return typeof asmFiles[file] !== 'undefined';
    };
    
    /**
     * @name isLoaded
     * @description Checks to see if given assembly file is loaded
     * @example
     *  isLoaded(file)
     * @params
     *  file: string - full path and name of the assembly file to check for
     * @returns boolean - true/false
     */ 
    flair.Assembly.isLoaded = (file) => {
        if (typeof file !== 'string') { throw new _Exception('InvalidArgument', 'Argument type if not valid. (file)'); }
        return typeof asmFiles[file] !== 'undefined' && asmFiles[file].isLoaded;
    };
    
    /**
     * @name get
     * @description Returns assembly object that is associated with given flair type name
     * @example
     *  get(name)
     * @params
     *  name: string - qualified type name of the flair type whose assembly is to be located
     * @returns object - flair assembly type object
     */ 
    flair.Assembly.get = (name) => {
        if (typeof name !== 'string') { throw new _Exception('InvalidArgument', 'Argument type if not valid. (name)'); }
        return asmTypes[name] || null;
    };
    
    /**
     * @name all
     * @description Returns all registered assembly files
     * @example
     *  all()
     * @params
     *  None
     * @returns array - registered assemblies list
     */ 
    flair.Assembly.all = () => { 
        return Object.values(asmFiles).slice();
    };
    
    /**
     * @name allTypes
     * @description Returns all registered types
     * @example
     *  allTypes()
     * @params
     *  None
     * @returns array - registered types list
     */ 
    flair.Assembly.allTypes = () => { 
        return Object.keys(asmTypes).slice();
    };
    
    // reset api
    flair.Assembly._ = {
        reset: () => { asmFiles = {}; asmTypes = {}; }
    };
    
    // add to members list
    flair.members.push('Assembly');
    
    const _Assembly = flair.Assembly; // TODO: To fix
    
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
    flair.Namespace.getType = (qualifiedName) => { // TOOD: used in serialize and elsewhere -- throw exception when not found
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
    // Resource
    // Resource(resName, resFile)
    flair.Resource = (resName, resFile, data) => {
        const b64EncodeUnicode = (str) => { // eslint-disable-line no-unused-vars
            // first we use encodeURIComponent to get percent-encoded UTF-8,
            // then we convert the percent encodings into raw bytes which
            // can be fed into btoa.
            return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
                function toSolidBytes(match, p1) {
                    return String.fromCharCode('0x' + p1);
            }));
        };
        const b64DecodeUnicode = (str) => {
            // Going backwards: from bytestream, to percent-encoding, to original string.
            return decodeURIComponent(atob(str).split('').map(function(c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
        };
        
        let resData = data; // data is base64 encoded string, added by build engine
        let resType = resFile.substr(resFile.lastIndexOf('.') + 1).toLowerCase(),
            textTypes = ['txt', 'xml', 'js', 'json', 'md', 'css', 'html', 'svg'];
        
        // decode
        if (textTypes.indexOf(resType) !== -1) { // text
            if (flair.options.env.isServer) {
                let buff = new Buffer(resData).toString('base64');
                resData = buff.toString('utf8');
            } else { // client
                resData = b64DecodeUnicode(resData); 
            }
        } else { // binary
            if (flair.options.env.isServer) {
                resData = new Buffer(resData).toString('base64');
            } else { // client
                // no change, leave it as is
            }        
        }
    
        let _res = {
            file: () => { return resFile; },
            type: () => { return resType; },
            get: () => { return resData; },
            load: (...args) => {
                if (flair.options.env.isClient) {
                    if (!_res._.isLoaded) {
                        _res._.isLoaded = true;
                        if (['gif', 'jpeg', 'jpg', 'png'].indexOf(resType) !== -1) { // image types
                            // args:    node
                            let node = args[0];
                            if (node) {
                                let image = new Image();
                                image.src = 'data:image/png;base64,' + data; // use base64 version itself
                                node.appendChild(image);
                                _res._.isLoaded = true;
                            }
                        } else { // css, js, html or others
                            let css, js, node, position = null;
                            switch(resType) {
                                case 'css':     // args: ()
                                    css = flair.options.env.global.document.createElement('style');
                                    css.type = 'text/css';
                                    css.name = resFile;
                                    css.innerHTML = resData;
                                    flair.options.env.global.document.head.appendChild(css);
                                    break;
                                case 'js':      // args: (callback)
                                    js = flair.options.env.global.document.createElement('script');
                                    js.type = 'text/javascript';
                                    js.name = resFile;
                                    js.src = resData;
                                    if (typeof cb === 'function') {
                                        js.onload = args[0]; // callback
                                        js.onerror = () => { _res._.isLoaded = false; }
                                    }
                                    flair.options.env.global.document.head.appendChild(js);
                                    break;           
                                case 'html':    // args: (node, position)
                                    // position can be: https://developer.mozilla.org/en-US/docs/Web/API/Element/insertAdjacentHTML
                                    // if empty, it will replace node html
                                    node = args[0];
                                    position = args[1] || '';
                                    if (node) {
                                        if (position) {
                                            node.innerHTML = resData;
                                        } else {
                                            node.insertAdjacentHTML(position, resData);
                                        }
                                    }
                                    break;
                                default:
                                    // load not supported for all other types
                                    break;
                            }
                        }
                    }
                }
                return _res._.isLoaded;
            }
        };
        _res._ = {
            name: resName,
            type: 'resource',
            namespace: null,
            file: resFile,
            isLoaded: false,
            data: () => { return resData; }
        };
    
        // set json 
        _res.JSON = null;
        if (_res.type() === 'json') {
            try {
                _res.JSON = Object.freeze(JSON.parse(resData));
            } catch (e) {
                // ignore
            }
        }
    
        // register type with namespace
        flair.Namespace(_res);
    
        // return
        return Object.freeze(_res);
    };
    flair.Resource.get = (resName) => {
        let resObj = flair.Namespace.getType(resName);
        if (resObj._ && resObj._.type === 'resource') {
           return resObj.get();
        }
        return null;
    };
    
    
    // TODO: Update build engine, as per new definitions defined here - once done
    // let dump = `;flair.Resource("${resName}", "${resFile}", "${content}");`;
    // appendToFile(asm_min, dump);

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
    /**
     * @name include
     * @description Fetch, load and/or resolve an external dependency for required context
     * @example
     *  include(deps, fn)
     * @usage
     *  include([
     *    'my.namespace.MyStruct',
     *    '[IBase]'
     *    'myServerClass | myClientClass'
     *    'fs | '
     *    './abc.mjs'
     *    './somepath/somefile.css'
     *  ], (MyStruct, IBase, MyClass, fs, abc, someCSS) => {
     *      ... use them here
     *  });
     * @params
     *  deps: array - array of strings, each defining a dependency to fetch/load or resolve
     *      >> each dep definition string  can take following form:
     *
     *          >> [<name>]
     *              >> e.g., '[IBase]'
     *              >> this can be a registered alias to any type and is resolved via DI container
     *              >> if resolved type is an string, it will again pass through <namespace>.<name> resolution process
     
     *          >> <namespace>.<name>
     *              >> e.g., 'my.namespace.MyClass'
     *              >> this will be looked in given namespace first, so an already loaded type will be picked first
     *              >> if not found in given namespace, it will look for the assembly where this type might be registered
     *              >> if found in a registered assembly, it will load that assembly and again look for it in given namespace
     * 
     *          >> <name>
     *              >> e.g., 'fs'
     *              >> this can be a NodeJS module name (on server side) or a JavaScript module name (on client side)
     * 
     *          >> <path>/<file>.js|.mjs
     *              >> e.g., '/my/path/somefile.js'
     *              >> this can be a bare file to load to
     *              >> path is always treated in context of the root path - full, relative paths from current place are not supported
     *              >> to handle PRODUCTION and DEBUG scenarios automatically, use <path>/<file>{.min}.js|.mjs format. 
     *              >> it PROD symbol is available, it will use it as <path>/<file>.min.js otherwise it will use <path>/<file>.js
     * 
     *          >> <path>/<file.css|json|html|...>
     *              >> e.g., '/my/path/somefile.css'
     *              >>  if ths is not a js|mjs file, it will treat it as a resource file and will use fetch/require, as applicable
     *      
     *          NOTE: Each dep definition can also be defined for contextual consideration as:
     *          '<depA> | <depB>'
     *          when running on server, <depA> would be considered, and when running on client <depB> will be used
     * 
     *          IMPORTANT: Each dependency is resolved with the resolved Object/content returned by dependency
     *                     if a dependency could not be resolved, it will throw the console.error()
     *                     cyclic dependencies are taken care of - if A is looking for B which is looking for C and that is looking for A - or any such scenario - it will throw error
     *  fn: function - function where to pass resolved dependencies, in order they are defined in deps
     * @returns void
     */ 
    const incCycle = [];
    const _include = (deps, fn) => {
        if (['string', 'array'].indexOf(_typeOf(deps)) === -1) { throw new _Exception('InvalidArgument', 'Argument type is invalid. (deps)'); }
        if (typeof fn !== 'function') { throw new _Exception('InvalidArgument', 'Argument type is invalid. (fn)'); }
        if (!Array.isArray(deps)) { deps = [deps]; }
    
        let _resolvedItems = [],
            _deps = deps.slice();
    
        let processedAll = () => {
            fn(..._resolvedItems); 
        };
        let resolveNext = () => {
            if (_deps.length === 0) {
                processedAll(); return;
            } else {
                let _dep = _deps.shift().trim(),
                    _resolved = null;
    
                // pick contextual dep
                _dep = which(_dep);
    
                // check if this is an alias registered on DI container
                let option1 = (done) => {
                    if (_dep.startsWith('[') && _dep.endsWith(']') && _dep.indexOf('.') === -1) {
                        let _alias = _dep.substr(1, _dep.length -2).trim(); // remove [ and ]
                        _resolved = _Container.resolve(_alias, false); // first item
                        if (typeof _resolved === 'string') { // this was an alias to something else, treat it as not resolved
                            _dep = _resolved; // instead continue resolving with this new redirected _dep 
                            _resolved = null;
                        }
                    }
                    done();
                };            
    
                // check if it is available in any namespace
                let option2 = (done) => {
                    _resolved = _getType(_dep); done();
                };
    
                // check if it is available in any unloaded assembly
                let option3 = (done) => {
                    let asm = _getAssembly(_dep);
                    if (asm) { // if type exists in an assembly
                        if (!asm.isLoaded) {
                            asm.load().then(() => {
                                _resolved = _getType(_dep); done();
                            }).catch((e) => {
                                throw new _Exception('AssemblyLoad', `Assembly load operation failed with error: ${e}. (${asm.file})`);
                            });
                        } else {
                            _resolved = _getType(_dep); done();
                        }
                    } else {
                        done();
                    }
                };
    
                // check if this is a file
                let option4 = (done) => {
                    let ext = _dep.substr(_dep.lastIndexOf('.') + 1).toLowerCase();
                    if (ext) {
                        if (ext === 'js' || ext === 'mjs') {
                            // pick contextual file for DEBUG/PROD
                            _dep = which(_dep, true);
                            
                            // this will be loaded as module in next option as a module
                            done();
                        } else { // some other file (could be json, css, html, etc.)
                            loadFile(_dep).then((content) => {
                                _resolved = content; done();
                            }).catch((e) => {
                                throw new _Exception('FileLoad', `File load failed. (${_dep})`, e); 
                            });
                        }
                    } else { // not a file
                        done();
                    }
                };
    
                // check if this is a module
                let option5 = (done) => {
                    loadModule(_dep).then((content) => { // as last option, try to load it as module
                        _resolved = content; done();
                    }).catch((e) => {
                       throw new _Exception('ModuleLoad', `Module load operation failed with error: ${e}. (${_dep})`);
                    });
                };
    
                // done
                let resolved = (isExcludePop) => {
                    _resolvedItems.push(_resolved);
                    if (!isExcludePop) { incCycle.pop(); } // removed the last added dep
                    resolveNext();
                };
    
                // process
                if (_dep === '') { // nothing is defined to process
                    resolved(true); return;
                } else {
                    // cycle break check
                    if (incCycle.indexOf(_dep) !== -1) {
                        throw new _Exception('CircularDependency', `Circular dependency identified. (${_dep})`);
                    } else {
                        incCycle.push(_dep);
                    }
    
                    // run
                    option1(() => {
                        if (!_resolved) { option2(() => {
                            if (!_resolved) { option3(() => {
                                if (!_resolved) { option4(() => {
                                    if (!_resolved) { option5(() => {
                                        if (!_resolved) {
                                            throw new _Exception('DependencyResolution', `Failed to resolve dependency. ${_dep}`);
                                        } else { resolved(); }
                                    }) } else { resolved(); }
                                }) } else { resolved(); }
                            }) } else { resolved(); }
                        }) } else { resolved(); }
                    });
                }
            }
        }
    
        // start processing
        resolveNext();
    };
    
    // attach to flair
    a2f('include', _include, () => {
        incCycle.length = 0;
    });
        // OK

    /**
     * @name dispose
     * @description Call dispose of given flair object
     * @example
     *  dispose(obj)
     * @params
     *  obj: object - flair object that needs to be disposed
     *       boolean - if passed true, it will clear all of flair internal system
     * @returns void
     */ 
    const _dispose = (obj) => {
        if (typeof obj === 'boolean' && obj === true) { // special call to dispose flair
            disposers.forEach(disposer => { disposer(); });
            disposers.length = 0;
        } else { // regular call
            if (_typeOf(obj) !== 'instance') { throw new _Exception('InvalidArgument', 'Argument type is invalid. (obj)'); }
    
            // call disposer
            obj._.dispose();
        }
    };
    
    // attach to flair
    a2f('dispose', _dispose);   // OK
    /**
     * @name using
     * @description Ensures the dispose of the given object instance is called, even if there was an error 
     *              in executing processor function
     * @example
     *  using(obj, fn)
     * @params
     *  obj: object - object that needs to be processed by processor function
     *                If a disposer is not defined for the object, it will not do anything
     *  fn: function - processor function
     * @returns any - returns anything that is returned by processor function, it may also be a promise
     */ 
    const _using = (obj, fn) => {
        if (_typeOf(obj) !== 'instance') { throw new _Exception('InvalidArgument', 'Argument type is invalid. (obj)'); }
        if (_typeOf(fn) !== 'function') { throw new _Exception('InvalidArgument', 'Argument type is invalid. (fn)'); }
    
        let result = null,
            isDone = false,
            isPromiseReturned = false,
            doDispose = () => {
                if (!isDone && typeof obj._.dispose === 'function') {
                    isDone = true; obj._.dispose();
                }
            };
        try {
            result = fn(obj);
            if (result && typeof result.finally === 'function') { // a promise is returned
                isPromiseReturned = true;
                result = result.finally((args) => {
                    doDispose();
                    return args;
                });
            }
        } finally {
            if (!isPromiseReturned) { doDispose(); }
        }
    
        // return
        return result;
    };
    
    // attach to flair
    a2f('using', _using);     // OK

    /**
     * @name Args
     * @description Lightweight args pattern processing that returns a validator function to validate arguments against given arg patterns
     * @example
     *  Args(...patterns)
     * @params
     *  patterns: string(s) - multiple pattern strings, each representing one pattern set
     *                        each pattern set can take following forms:
     *                        'type, type, type, ...' OR 'name: type, name: type, name: type, ...'
     *                          type: can be following:
     *                              > expected native javascript data types like 'string', 'number', 'function', 'array', etc.
     *                              > inbuilt flair object types like 'class', 'struct', 'enum', etc.
     *                              > custom flair object instance types which are checked in following order:
     *                                  >> for class instances: 
     *                                     isInstanceOf given as type
     *                                     isImplements given as interface 
     *                                     isMixed given as mixin
     *                                  >> for struct instances:
     *                                     isInstance of given as struct type
     *                          name: argument name which will be used to store extracted value by parser
     * @returns function - validator function that is configured for specified patterns
     */ 
    const _Args = (...patterns) => {
        if (patterns.length === 0) { throw new _Exception('InvalidArgument', 'Argument must be defined. (patterns)'); }
    
        /**
         * @description Args validator function that validates against given patterns
         * @example
         *  (...args)
         * @params
         *  args: any - multiple arguments to match against given pattern sets
         * @returns object - result object, having:
         *  raw: (array) - original arguments as passed
         *  index: (number) - index of pattern-set that matches for given arguments, -1 if no match found
         *                    if more than one patterns may match, it will stop at first match
         *  isInvalid: (boolean) - to check if any match could not be achieved
         *  <name(s)>: <value(s)> - argument name as given in pattern having corresponding argument value
         *                          if a name was not given in pattern, a default unique name will be created
         *                          special names like 'raw', 'index' and 'isInvalid' cannot be used.
         */    
        let _args = (...args) => {
            // process each pattern - exit with first matching pattern
            let types = null, items = null,
                name = '', type = '',
                pIndex = -1, aIndex = -1,
                matched = false,
                mCount = 0,
                result = {
                    raw: args || [],
                    index: -1,
                    isInvalid: false,
                    error: null,
                    values: {}
                };
            if (patterns) {
                for(let pattern of patterns) {
                    pIndex++; aIndex=-1; matched = false; mCount = 0;
                    types = pattern.split(',');
                    for(let item of types) {
                        aIndex++;
                        items = item.split(':');
                        if (items.length !== 2) { 
                            name = `_${pIndex}_${aIndex}`; // e.g., _0_0 or _1_2, etc.
                            type = item.trim() || '';
                        } else {
                            name = items[0].trim() || '',
                            type = items[1].trim() || '';
                        }
                        if (aIndex > result.raw.length) { matched = false; break; }
                        if (!_is(result.raw[aIndex], type)) { matched = false; break; }
                        result.values[name] = result.raw[aIndex]; matched = true; mCount++;
                    }
                    if (matched && mCount === result.raw.length) {result.index = pIndex; break; }
                }
            }
    
            // set state
            result.isInvalid = (result.index === -1 ? true : false);
            result.error = (result.isInvalid ? new _Exception('InvalidArguments', 'One or more argument types are invalid.') : null );
    
            // return
            return result;
        };
    
        // return freezed
        return Object.freeze(_args);
    };
    
    // attach to flair
    a2f('Args', _Args);
        // OK
    
    /**
     * @name Exception
     * @description Lightweight Exception class that extends Error object and serves as base of all exceptions
     * @example
     *  Exception()
     *  Exception(type)
     *  Exception(error)
     *  Exception(type, message)
     *  Exception(type, error)
     *  Exception(type, message, error)
     * @params
     *  type: string - error name or type
     *  message: string - error message
     *  error: object - inner error or exception object
     * @constructs Exception object
     */  
    const _Exception = function(arg1, arg2, arg3) {
        let _this = new Error();
        switch(typeof arg1) {
            case 'string':
                _this.name = arg1;
                switch(typeof arg2) {
                    case 'string': 
                        _this.message = arg2;
                        _this.error = (typeof arg3 === 'object' ? arg3 : null);
                        break;
                    case 'object': 
                        _this.message = arg2.message || '';
                        _this.error = arg2;
                        break;
                }
                break;
            case 'object':
                _this.name = arg1.name || 'Unknown';
                _this.message = arg1.message || '';
                _this.error = arg1;
                break;
        }
    
        _this.name =  _this.name || 'Undefined';
        if (!_this.name.endsWith('Exception')) { _this.name += 'Exception'; }
    
        // return
        return Object.freeze(_this);
    };
    
    // all inbuilt exceptions
    _Exception.InvalidArgument = (name) => { return new _Exception('InvalidArgument', `Argument type is invalid. (${name})`); }
    
    // attach to flair
    a2f('Exception', _Exception);
       // OK

    /**
     * @name on
     * @description Register an event handler to handle a specific event. 
     * @example
     *  on(event, handler)
     *  on(event, handler, isRemove)
     * @params
     *  event: string - Name of the even to subscribe to
     *  handler: function - event handler function
     *  isRemove: boolean - is previously associated handler to be removed
     * @returns void
     */ 
    const _dispatcher = new Dispatcher();
    const dispatch = _dispatcher.dispatch;  // this can be used in any other member to dispatch any event
    const _on = (event, handler, isRemove) => {
        if (isRemove) { _dispatcher.remove(event, handler); return; }
        _dispatcher.add(event, handler);
    };
    
    // attach to flair
    a2f('on', _on, () => {
        _dispatcher.clear();
    });
     // OK
    /**
     * @name post
     * @description Post an event for any flair component to react.
     *              This together with 'on' makes a local pub/sub system which is capable to react to external
     *              events when they are posted via 'post' here and raise to external world which can be hooked to 'on'
     * @example
     *  post(event)
     *  post(event, args)
     * @params
     *  event: string - Name of the even to dispatch
     *         Note: external events are generally namespaced like pubsub.channelName
     *  args: any - any arguments to pass to event handlers
     * @returns void
     */ 
    const _post = (event, args) => {
        dispatch(event, args);
    };
    
    // attach to flair
    a2f('post', _post);
     // OK

    const attributesAndModifiers = (def, memberName) => {
        let appliedAttrs = _attr.collect(), // [{name, cfg, attr, args}]
            attrBucket = null,
            modifierBucket = null,
            isTypeLevel = (def.level === 'type'),
            modifiers = modifierOrAttrRefl(true, def),
            attrs = modifierOrAttrRefl(false, def);
        if (isTypeLevel) {
            attrBucket = def.attrs.type;
            modifierBucket = def.modifiers.type;
        } else {
            attrBucket = def.attrs.members[memberName] = []; // create bucket
            modifierBucket = def.modifiers.members[memberName] = []; // create bucket
        }
    
        // validator
        const validator = (appliedAttr) => {
            let result = false,
                _supportedTypes = ['class', 'struct', 'enum', 'interface', 'mixin'],
                _supportedMemberTypes = ['prop', 'func', 'construct', 'dispose', 'event'],
                _supportedModifiers = ['static', 'abstract', 'sealed', 'virtual', 'override', 'private', 'protected', 'readonly', 'async'],
                _list = [], // { withWhat, matchType, original, name, value }
                dump = [],
                constraintsLex = appliedAttr.constraints; // logical version with filled booleans
    
            // extract names
            const sortAndStore = (match) => {
                let item = {
                    withWhat: '',
                    matchType: '',
                    original: match,
                    name: '',
                    value: false
                };
    
                // which type of match
                switch(match.substr(0, 1)) { 
                    case '$': 
                        item.matchType = 'anywhere';
                        item.name = match.substr(1);
                        break;
                    case '@':
                        item.matchType = 'inherited';
                        item.name = match.substr(1);
                        break;
                    default:
                        item.matchType = 'current';
                        item.name = match;
                        break;
                }
    
                // match with what
                if (match.endsWith('^')) { // type name
                    item.withWhat = 'typeName';
                    item.name = item.name.replace('^', ''); // remove ^
                } else { // members, types, modifiers or attributes
                    if (_supportedTypes.indexOf(item.name) !== -1) {
                        item.withWhat = 'typeType';
                        item.matchType = 'current'; // match type in this case is always taken as current
                    } else if (_supportedMemberTypes.indexOf(item.name) !== -1) {
                        item.withWhat = 'memberType';
                        item.matchType = 'current'; // match type in this case is always taken as current
                    } else if (_supportedModifiers.indexOf(item.name) !== 0-1) {
                        item.withWhat = 'modifier';
                    } else { // inbuilt or custom attribute name
                        item.withWhat = 'attribute';
                    }
                }
    
                // store
                _list.push(item);
            }; 
            const extractConstraints = () => {
                // select everything except these !, &, |, (, and )
                let rex = new RegExp('/[^!\&!|()]/g'), // eslint-disable-line no-useless-escape
                match = '';
                while(true) { // eslint-disable-line no-constant-condition
                    match = rex.exec(constraintsLex);
                    if (match !== null) { dump.push(match); continue; }
                    break; 
                }
                match = '';
                for(let char of dump) {
                    if (char[0] !== ' ') { 
                        match+= char[0]; 
                    } else {
                        if (match !== '') { sortAndStore(match); }
                        match = '';
                    }
                }
            };    
            extractConstraints(); // this will populate _list
    
            // get true/false value of each item in expression
            for(let item of _list) {
                switch(item.withWhat) {
                    case 'typeName':
                        switch(item.matchType) {
                            case 'anywhere':
                                item.value = ((item.name === memberName) || def.Type._.isDerivedFrom(item.name)); break;
                            case 'inherited':
                                item.value = def.Type._.isDerivedFrom(item.name); break;
                            case 'current':
                                item.value = (item.name === memberName); break;
                        }
                        break;
                    case 'typeType':
                        // matchType is always 'current' in this case 
                        item.value = (def.type === item.name); 
                        break;
                    case 'memberType':
                        // matchType is always 'current' in this case 
                        item.value = (def.members[memberName] === item.name);
                        break;
                    case 'modifier':
                        // call to configured probe's anywhere, inherited or current function
                        item.value = (modifiers.members.probe(item.name, memberName)[item.matchType]() ? true : false);
                        break;
                    case 'attribute':
                        // call to configured probe's anywhere, inherited or current function
                        item.value = (attrs.members.probe(item.name, memberName)[item.matchType]() ? true : false);
                        break;
                }
                constraintsLex = replaceAll(constraintsLex, item.original, item.value.toString());
            }
            
            // validate expression
            result = (new Function("try {return constraintsLex;}catch(e){return false;}"))();
            if (!result) {
                // TODO: send telemetry of _list, so it can be debugged
                throw new _Exception('InvalidOperation', `${appliedAttr.cfg.isModifier ? 'Modifier' : 'Attribute'} ${appliedAttr.name} could not be applied. (${memberName})`);
            }
    
            // return
            return result;
        };
    
        // validate and collect
        for (let appliedAttr of appliedAttrs) {
            if (validator(appliedAttr)) {
                appliedAttr = sieve(appliedAttr, null, false, { type: def.name });
                if (appliedAttr.isCustom) { // custom attribute instance
                    attrBucket.push(appliedAttr);
                } else { // inbuilt attribute or modifier
                    if (appliedAttr.cfg.isModifier) { 
                        modifierBucket.push(appliedAttr);
                    } else {
                        attrBucket.push(appliedAttr);
                    }
                }
            }
        }
    };
    const modifierOrAttrRefl = (isModifier, def) => {
        let defItemName = (isModifier ? 'modifiers' : 'attrs');
        let root_get = (name, memberName, isCheckInheritance) => {
            let isTypeLevel = (def.level === 'type'),
                result = null; 
            if (isTypeLevel) {
                if (!isCheckInheritance) {
                    result = findItemByProp(def[defItemName].type, 'name', name);
                } else {
                    // check from parent onwards, keep going up till find it or hierarchy ends
                    let prv = def.previous();
                    while(true) { // eslint-disable-line no-constant-condition
                        if (prv === null) { break; }
                        result = findItemByProp(prv[defItemName].type, 'name', name);
                        if (!result) {
                            prv = prv.previous();
                        } else {
                            break;
                        }
                    }
                }
            } else {
                if (!isCheckInheritance) {
                    result = findItemByProp(def[defItemName].members[memberName], 'name', name);
                } else {
                    let prv = def.previous();
                    while(true) { // eslint-disable-line no-constant-condition
                        if (prv === null) { break; }
                        result = findItemByProp(prv[defItemName].members[memberName], 'name', name);
                        if (!result) { 
                            prv = prv.previous();
                        } else {
                            break;
                        }
                    }
                }
            }
            return result; // {name, cfg, attr, args}
        };     
        let root_has = (name, memberName, isCheckInheritance) => {
            return root.get(name, memberName, isCheckInheritance) !== null;
        }; 
        const members_probe = (name, memberName) => {
            let _probe = {
                anywhere: () => {
                    return root.get(name, memberName) || root.get(name, memberName, true); 
                },
                current: () => {
                    return root.get(name, memberName); 
                },
                inherited: () => {
                    return root.get(name, memberName, true); 
                },
                only: {
                    current: () => {
                        return root.get(name, memberName) && !root.get(name, memberName, true); 
                    },
                    inherited: () => {
                        return !root.get(name, memberName) && root.get(name, memberName, true); 
                    }
                }
            };
            return _probe;      
        };    
        const type_probe = (name) => {
            let _probe = {
                anywhere: () => {
                    return root.get(name, '') || root.get(name, '', true); 
                },
                current: () => {
                    return root.get(name, ''); 
                },
                inherited: () => {
                    return root.get(name, '', true); 
                },
                only: {
                    current: () => {
                        return root.get(name, '') && !root.get(name, '', true); 
                    },
                    inherited: () => {
                        return !root.get(name, '') && root.get(name, '', true); 
                    }
                }
            };
            return _probe;
        };
        const members_all = (memberName) => {
            let _all = {
                current: () => {
                    return def[defItemName].members[memberName].slice();
                },
                inherited: () => {
                    let all_inherited_attrs = [],
                        prv_attrs = null;
                    // check from parent onwards, keep going up till hierarchy ends
                    let prv = def.previous();
                    while(true) { // eslint-disable-line no-constant-condition
                        if (prv === null) { break; }
                        prv_attrs = findItemByProp(prv[defItemName].members, 'name', memberName);
                        if (prv_attrs) { all_inherited_attrs.push(...prv_attrs); }
                        prv = prv.previous(); // go one level back now
                    }
                    return all_inherited_attrs;
                },
                anywhere: () => {
                    return [..._all.current(), ..._all.inherited()];
                }
            };
            return _all;
        };
        const type_all = () => {
            let _all = {
                current: () => {
                    return def[defItemName].type.slice();
                },
                inherited: () => {
                    let all_inherited_attrs = [],
                        prv_attrs = null;
                    // check from parent onwards, keep going up till hierarchy ends
                    let prv = def.previous();
                    while(true) { // eslint-disable-line no-constant-condition
                        if (prv === null) { break; }
                        prv_attrs = prv[defItemName].type.slice();
                        if (prv_attrs) { all_inherited_attrs.push(...prv_attrs); }
                        prv = prv.previous(); // go one level back now
                    }
                    return all_inherited_attrs;
                },
                anywhere: () => {
                    return [..._all.current(), ..._all.inherited()];
                }
            };
            return _all;
        };
        const root = {
            get: root_get,
            has: root_has,
            type: {
                get: (name, isCheckInheritance) => {
                    return root.get(name, true, isCheckInheritance);
                },
                has: (name, isCheckInheritance) => {
                    return root.has(name, true, isCheckInheritance);
                },
                all: type_all,
                probe: type_probe
            },
            members: {
                get: root_get,
                has: root_has,
                all: members_all,
                probe: members_probe,
            }
        };
        if (isModifier) {
            root.members.is = (modifierName, memberName) => {
                // it applied modifiers' relative logic to identify 
                // if specified member is of that type depending upon
                // modifier definitions on current and previous levels
                let _probe = members_probe(modifierName, memberName); // local
                switch(modifierName) {
                    case 'static': 
                        return _probe.anywhere(); 
                    case 'abstract':
                        return _probe.anywhere() && !(members_probe.anywhere('virtual', memberName) || members_probe.anywhere('override', memberName)); 
                    case 'virtual':
                        return _probe.anywhere() && !members_probe.anywhere('override', memberName); 
                    case 'override':
                        return _probe.anywhere() && !members_probe.anywhere('sealed', memberName); 
                    case 'sealed':
                        return _probe.anywhere(); 
                    case 'private':
                        return _probe.anywhere(); 
                    case 'protected':
                        return _probe.anywhere(); 
                    case 'readonly':
                        return _probe.anywhere(); 
                    case 'async':
                        return _probe.anywhere(); 
                }
            };
            root.members.type = (memberName) => {
                let isTypeLevel = (def.level === 'type'),
                    result = ''; 
                if (!isTypeLevel) {
                    let prv = def; // start from current
                    while(true) { // eslint-disable-line no-constant-condition
                        if (prv === null) { break; }
                        result = prv.members[memberName];
                        if (!result) { 
                            prv = prv.previous();
                        } else {
                            break;
                        }   
                    }         
                }
                return result;
            };
            root.members.isProperty = (memberName) => { return root.members.type(memberName) === 'prop'; };
            root.members.isFunction = (memberName) => { return root.members.type(memberName) === 'func'; };
            root.members.isEvent = (memberName) => { return root.members.type(memberName) === 'event'; };
        }
        return root;
    };
    const buildTypeInstance = (cfg, Type, params, obj) => {
        if (cfg.singleton && params.isTopLevelInstance && Type._.singleInstance()) { return Type._.singleInstance(); }
    
        // define vars
        let exposed_obj = {},
            mixin_being_applied = null,
            _constructName = '_construct',
            _disposeName = '_dispose',
            _props = {}, // plain property values storage inside this closure
            _previousDef = null,
            def = { 
                name: cfg.params.typeName,
                type: cfg.types.type, // the type of the type itself: class, struct, etc.
                Type: Type,
                level: 'object',
                members: {}, // each named item here defines the type of member: func, prop, event, construct, etc.
                attrs: { 
                    members: {} // each named item array in here will have: {name, cfg, attr, args}
                },
                modifiers: {
                    members: {} // each named item array in here will have: {name, cfg, attr, args}
                },
                previous: () => {
                    return _previousDef;
                }
            },
            proxy = null,
            isBuildingObj = false,
            _member_dispatcher = null,
            _local_storage_not_supported_message = "Use of 'state' is not support on server. Using 'session' instead.";
    
        const _sessionStorage = {
            key: (key) => {
                if (isServer) {
                    return ((global.sessionStorage && global.sessionStorage[key]) ? true : false); // the way, on browser sessionStorage is different for each tab, here 'sessionStorage' property on global is different for each node instance in a cluster
                } else { // client
                    return sessionStorage.key(key);
                }
            },
            getItem: (key) => {
                if (isServer) {
                    return ((global.sessionStorage && global.sessionStorage[key]) ? global.sessionStorage[key] : null);
                } else {
                    return sessionStorage.getItem(key);
                }
            },
            setItem: (key, value) => {
                if (isServer) {
                    if (!global.sessionStorage) { global.sessionStorage = {}; }
                    global.sessionStorage[key] = value;
                    
                } else {
                    sessionStorage.setItem(key, value);
                }
            },
            removeItem: (key) => {
                if (isServer) {
                    if (global.sessionStorage) { 
                        delete global.sessionStorage[key];
                    }
                } else {
                    sessionStorage.removeItem(key);
                }
            }
        };
        const _localStorage = {
            key: (key) => {
                if (isServer) {
                    console.log(_local_storage_not_supported_message); // eslint-disable-line no-console
                    return _sessionStorage.key(key);
                } else { // client
                    return localStorage.key(key);
                }
            },
            getItem: (key) => {
                if (isServer) {
                    console.log(_local_storage_not_supported_message); // eslint-disable-line no-console
                    return _sessionStorage.getItem(key);
                } else {
                    return localStorage.getItem(key);
                }
            },
            setItem: (key, value) => {
                if (isServer) {
                    console.log(_local_storage_not_supported_message); // eslint-disable-line no-console
                    return _sessionStorage.setItem(key, value);
                } else {
                    localStorage.setItem(key, value);
                }            
            },
            removeItem: (key) => {
                if (isServer) {
                    console.log(_local_storage_not_supported_message); // eslint-disable-line no-console
                    return _sessionStorage.removeItem(key);
                } else {
                    localStorage.removeItem(key);
                }
            }
        };
        const applyCustomAttributes = (bindingHost, memberName, memberType, member) => {
            for(let appliedAttr of attrs.members.all(memberName).current()) {
                if (appliedAttr.isCustom) { // custom attribute instance
                    if (memberType === 'prop') {
                        let newSet = appliedAttr.attr.decorate(memberName, memberType, member.get, member.set); // set must return a object with get and set members
                        if (newSet.get && newSet.set) {
                            newSet.get = newSet.get.bind(bindingHost);
                            newSet.set = newSet.set.bind(bindingHost);
                            member = newSet; // update for next attribute application
                        } else {
                            throw new _Exception('Unexpected', `${appliedAttr.name} decoration result is unexpected. (${memberName})`);
                        }
                    } else { // func or event
                        let newFn = appliedAttr.attr.decorate(memberName, memberType, member);
                        if (newFn) {
                            member = newFn.bind(bindingHost); // update for next attribute application
                        } else {
                            throw new _Exception('Unexpected', `${appliedAttr.name} decoration result is unexpected. (${memberName})`);
                        }
                    }
    
                    // now since attribute is applied, this attribute instance is of no use,
                    appliedAttr.attr = null;
                }
            }
            return member;           
        };
        const applyAspects = (memberName, member) => {
            let weavedFn = null,
                funcAspects = [];
    
            // get aspects that are applicable for this function
            funcAspects = _Aspects.get(def.name, memberName, attrs.members.all(memberName).anywhere());
            def.aspects.members[memberName] = funcAspects; // store for reference
                
            // apply these aspects
            if (funcAspects.length > 0) {
                weavedFn = _Aspects.attach(member, def.name, memberName, funcAspects); 
                if (weavedFn) {
                    member = weavedFn; // update member itself
                }
            }
    
            // return weaved or unchanged member
            return member;
        };
        const buildExposedObj = () => {
            let isCopy = false,
            doCopy = (memberName) => { Object.defineProperty(exposed_obj, memberName, Object.getOwnPropertyDescriptor(obj, memberName)); };
            
            // copy meta member as non-enumerable
            let desc = Object.getOwnPropertyDescriptor(exposed_obj, '_');
            desc.enumerable = false;
            Object.defineProperty(exposed_obj, '_', desc);
            
            // copy other members
            for(let memberName in obj) { 
                isCopy = false;
                if (obj.hasOwnProperty(memberName) && memberName !== '_') { 
                    isCopy = true;
                    if (def.members[memberName]) { // member is defined here
                        if (modifiers.members.probe('private', memberName).current()) { isCopy = false; }   // private members don't get out
                        if (isCopy && (modifiers.members.probe('protected', memberName).current() && !params.isNeedProtected)) { isCopy = false; } // protected don't go out of top level instance
                    } else { // some derived member (protected or public)
                        if (modifiers.members.probe('protected', memberName).anywhere() && !params.isNeedProtected) { isCopy = false; } // protected don't go out of top level instance
                    }
                    if (isCopy) { doCopy(memberName); }
    
                    // any abstract member should not left unimplemented now
                    if (isCopy && modifiers.members.is('abstract', memberName)) {
                        throw new _Exception('InvalidDefinition', `Abstract member is not implemented. (${memberName})`);
                    }
    
                    // apply enumerate attribute now
                    if (isCopy) {
                        let the_attr = attrs.members.probe('enumerate', memberName).current();
                        if (the_attr && the_attr.args[0] === false) { // if attr('enumerate', false) is defined
                            let desc = Object.getOwnPropertyDescriptor(exposed_obj, memberName);
                            desc.enumerable = false;
                            Object.defineProperty(exposed_obj, memberName, desc);
                        } // else by default it is true anyways
                    }
    
                    // rewire event definition when at the top level object creation step
                    if (isCopy && !params.isNeedProtected && typeof obj[memberName].subscribe === 'function') { 
                        exposed_obj[memberName].strip(exposed_obj);
                    }
                }
            }
    
            // extend with configured extensions only at top level, since (1) these will always be same at all levels
            // since these are of same object type, and since overwriting of this is allowed, add only at top level
            // and only missing ones
            if (params.isTopLevelInstance) {
                exposed_obj = extend(exposed_obj, cfg.ex.instance, false); // don;t overwrite, since overriding defaults are allowed
            }
    
            // expose def of this level for upper level to access if not on top level
            if (!params.isTopLevelInstance) {
                exposed_obj._.def = def; // this will be deleted as soon as picked at top level
            }
        };
        const validateInterfaces = () => {
            for(let _interfaceType of def.interfaces) { 
                // an interface define members just like a type
                // with but its function and event will be noop and
                // property values will be null
                let _interface = new _interfaceType(); // so we get to read members of interface
                for(let _memberName in _interface) {
                    if (_interface.hasOwnProperty(_memberName) && _memberName !== '_') {
                        if (exposed_obj[_memberName]) {
                            let _interfaceMemberType = _interface._.modifiers.members.type(_memberName);
                            if (_interfaceMemberType !== def.members[_memberName]) { throw new _Exception('NotDefined', `Interface (${_interface._.name}) member is not defined as ${_interfaceMemberType}. (${_memberName})`); }
                        }
                    }
                }
            }
    
            // delete it, no longer needed (a reference is available at Type level)
            delete def.interfaces;
        };
        const validatePreMemberDefinitionFeasibility = (memberName, memberType, memberDef) => { // eslint-disable-line no-unused-vars
            if (['func', 'prop', 'event'].indexOf(memberType) !== -1 && memberName.startsWith('_')) { new _Exception('InvalidName', `Name is not valid. (${memberName})`); }
            switch(memberType) {
                case 'func':
                    if (!cfg.func) { throw new _Exception('InvalidOperation', `Function cannot be defined on this type. (${def.name})`); }
                    break;
                case 'prop':
                    if (!cfg.prop) { throw new _Exception('InvalidOperation', `Property cannot be defined on this type. (${def.name})`); }
                    break;
                case 'event':
                    if (!cfg.event) { throw new _Exception('InvalidOperation', `Event cannot be defined on this type. (${def.name})`); }
                    break;
                case 'construct':
                    if (!cfg.construct) { throw new _Exception('InvalidOperation', `Constructor cannot be defined on this type. (${def.name})`); }
                    memberType = 'func'; 
                    break;
                case 'dispose':
                    if (!cfg.dispose) { throw new _Exception('InvalidOperation', `Dispose cannot be defined on this type. (${def.name})`); }
                    memberType = 'func'; 
                    break;
            }
            return memberType;
        };
        const validateMemberDefinitionFeasibility = (memberName, memberType, memberDef) => {
            let result = false;
            // conditional check
            let the_attr = attrs.members.probe('conditional', memberName).current();
            if (the_attr) {
                let conditions = splitAndTrim(the_attr.args[0] || []);
                for (let condition of conditions) {
                    condition = condition.toLowerCase();
                    if (condition === 'test' && options.env.isTesting) { result = true; break; }
                    if (condition === 'server' && options.env.isServer) { result = true; break; }
                    if (condition === 'client' && options.env.isClient) { result = true; break; }
                    if (condition === 'debug' && options.env.isDebug) { result = true; break; }
                    if (condition === 'prod' && options.env.isProd) { result = true; break; }
                    if (condition === 'cordova' && options.env.isCordova) { result = true; break; }
                    if (condition === 'nodewebkit' && options.env.isNodeWebkit) { result = true; break; }
                    if (options.symbols.indexOf(condition) !== -1) { result = true; break; }
                }
                if (!result) { return result; } // don't go to define, yet leave meta as is, so at a later stage we know that this was conditional and yet not available, means condition failed
            }
            
            // abstract check
            if (cfg.inheritance && attrs.members.probe('abstract', memberName).current() && (memberDef !== _noop || memberDef !== null) && (memberDef.get && memberDef.get !== _noop)) {
                throw new _Exception('InvalidDefinition', `Abstract member must point to noop function or a null value. (${memberName})`);
            }
    
            // constructor arguments check for a static type
            if (cfg.static && cfg.construct && memberName === _constructName && memberDef.length !== 0) {
                throw new _Exception('InvalidDefinition', `Static constructors cannot have arguments. (construct)`);
            }
    
            // dispose arguments check always
            if (cfg.dispose && memberName === _disposeName && memberDef.length !== 0) {
                throw new _Exception('InvalidDefinition', `Destructor method cannot have arguments. (dispose)`);
            }
            
            // duplicate check, if not overriding and its not a mixin factory running
            // mixins overwrite previous mixin's member, if any
            // at class/struct level, overwriting any mixin added member is allowed (and when added, it's attributes, type and modified etc. 
            // which might be added earlier, will be overwritten anyways)
            if (mixin_being_applied === null && typeof obj[memberName] !== 'undefined' &&
                (!attrs.members.probe('mixed', memberName).current()) &&
                (!cfg.inheritance || (cfg.inheritance && !attrs.members.probe('override', memberName).current()))) {
                    throw new _Exception('InvalidOperation', `Member with this name is already defined. (${memberName})`); 
            }
    
            // overriding member must be present and of the same type
            if (cfg.inheritance && attrs.members.probe('override', memberName).current()) {
                if (typeof obj[memberName] === 'undefined') {
                    throw new _Exception('InvalidOperation', `Member not found to override. (${memberName})`); 
                } else if (modifiers.members.type(memberName) !== memberType) {
                    throw new _Exception('InvalidOperation', `Overriding member type is invalid. (${memberName})`); 
                }
            }
    
            // static members cannot be arrow functions and properties cannot have custom getter/setter
            if (cfg.static && attrs.members.probe('static', memberName).current()) {
                if (memberType === 'func') {
                    if (isArrow(memberDef)) { 
                        throw new _Exception('InvalidOperation', `Static functions cannot be defined as an arrow function. (${memberName})`); 
                    }
                } else if (memberType === 'prop') {
                    if (memberDef.get && typeof memberDef.get === 'function') {
                        throw new _Exception('InvalidOperation', `Static properties cannot be defined with a custom getter/setter. (${memberName})`); 
                    }
                }
            }
    
            // session/state properties cannot have custom getter/setter and also relevant port must be configured
            if (cfg.storage && attrs.members.probe('session', memberName).current()) {
                if (memberDef.get && typeof memberDef.get === 'function') {
                    throw new _Exception('InvalidOperation', `Session properties cannot be defined with a custom getter/setter. (${memberName})`); 
                }
            }
            if (cfg.storage && attrs.members.probe('state', memberName).current()) {
                if (memberDef.get && typeof memberDef.get === 'function') {
                    throw new _Exception('InvalidOperation', `State properties cannot be defined with a custom getter/setter. (${memberName})`); 
                }
                if (!_localStorage) { throw new _Exception('NotConfigured', 'Port is not configured. (localStorage)'); }
            }
    
            // return (when all was a success)
            return result;
        };
        const buildProp = (memberName, memberType, memberDef) => {
            let _member = {
                get: null,
                set: null
            },
            _getter = _noop,
            _setter = _noop,
            _isReadOnly = attrs.members.probe('readonly', memberName).anywhere(),
            _isStatic = attrs.members.probe('static', memberName).anywhere(),
            _isSession = attrs.members.probe('session', memberName).anywhere(),
            _isState = attrs.members.probe('state', memberName).anywhere(),
            _deprecate_attr = attrs.members.probe('deprecate', memberName).current(),
            inject_attr = attrs.members.probe('inject', memberName).current(),
            type_attr = attrs.members.probe('type', memberName).current(),
            _isDeprecate = (_deprecate_attr !== null),
            _deprecate_message = (_isDeprecate ? (_deprecate_attr.args[0] || `Event is marked as deprecate. (${memberName})`) : ''),
            propHost = _props, // default place to store property values inside closure
            bindingHost = obj,
            uniqueName = def.name + '_' + memberName,
            isStorageHost = false,
            _injections = [];     
    
            // define or redefine
            if (memberDef.get || memberDef.set) { // normal property, cannot be static because static cannot have custom getter/setter
                if (memberDef.get && typeof memberDef.get === 'function') {
                    _getter = memberDef.get;
                }
                if (memberDef.set && typeof memberDef.set === 'function') {
                    _setter = memberDef.set;
                }
                _member.get = function() {
                    if (_isDeprecate) { console.log(_deprecate_message); } // eslint-disable-line no-console
                    return _getter.apply(bindingHost);
                }.bind(bindingHost);
                _member.set = function(value) {
                    if (_isDeprecate) { console.log(_deprecate_message); } // eslint-disable-line no-console
                    if (_isReadOnly && !obj._.constructing) { throw new _Exception('InvalidOperation', `Property is readonly. (${memberName})`); } // readonly props can be set only when object is being constructed 
                    if (type_attr && type_attr.args[0] && !_is(value, type_attr.args[0])) { throw new _Exception('InvalidArgument', 'Argument type is invalid. (value)'); } // type attribute is defined
                    return _setter.apply(bindingHost, [value]);
                }.bind(bindingHost);            
            } else { // direct value
                if (cfg.static && _isStatic) {
                    propHost = params.staticInterface._.props; // property values are stored on static interface itself in  ._.props
                    bindingHost = params.staticInterface; // binding to static interface, so with 'this' object internals are not accessible
                    if (type_attr && type_attr.args[0] && !_is(memberDef, type_attr.args[0])) { throw new _Exception('InvalidArgument', 'Argument type is invalid. (value)'); } // type attribute is defined
                    propHost[uniqueName] = memberDef;
                } else if (cfg.storage && (_isSession || _isState)) {
                    propHost = (_isSession ? _sessionStorage : _localStorage);
                    isStorageHost = true;
                    uniqueName = obj._.id + '_' + uniqueName; // because multiple instances of same object will have different id
                    addDisposable((_isSession ? 'session' : 'state'), uniqueName);
                    if (!propHost.key(uniqueName)) { 
                        if (type_attr && type_attr.args[0] && !_is(memberDef, type_attr.args[0])) { throw new _Exception('InvalidArgument', 'Argument type is invalid. (value)'); } // type attribute is defined
                        propHost.setItem(uniqueName, JSON.stringify({value: memberDef})); 
                    }
                } else { // normal value
                    if (type_attr && type_attr.args[0] && !_is(memberDef, type_attr.args[0])) { throw new _Exception('InvalidArgument', 'Argument type is invalid. (value)'); } // type attribute is defined
                    propHost[uniqueName] = memberDef;
                }
                _member.get = function() {
                    if (_isDeprecate) { console.log(_deprecate_message); } // eslint-disable-line no-console
                    if (isStorageHost) { return JSON.parse(propHost.getItem(uniqueName)).value; }
                    return propHost[uniqueName];             
                }.bind(bindingHost);
                _member.set = function(value) {
                    if (_isDeprecate) { console.log(_deprecate_message); } // eslint-disable-line no-console
                    if (_isReadOnly && !_isStatic && !obj._.constructing) { throw new _Exception('InvalidOperation', `Property is readonly. (${memberName})`); } // readonly props can be set only when object is being constructed 
                    if (type_attr && type_attr.args[0] && !_is(value, type_attr.args[0])) { throw new _Exception('InvalidArgument', 'Argument type is invalid. (value)'); } // type attribute is defined
                    if (isStorageHost) {
                        propHost.setItem(uniqueName, JSON.stringify({value: value}));
                    } else {
                        propHost[uniqueName] = value;
                    }
                }.bind(bindingHost);
            }
    
            // set injected value now
            if (inject_attr && !_isStatic && !isStorageHost) {
                // resolve injections
                let _injectWhat = inject_attr.args[0],                                          // aliasName || qualifiedTypeName || Type itself || array ot Types // TODO: Map this that container.resolve() can work on all these
                    _injectWith = (inject_attr.args.length > 0 ? inject_attr.args[1] : []),     // [..., ...] <- any parameters to pass to constructor of type(s) being injected
                    _injectMany = (inject_attr.args.length > 1 ? inject_attr.args[2] : false);  // true | false <- if multi injection to be done
    
                _injections = _Container.resolve(_injectWhat, _injectWith, _injectMany);
                if (!Array.isArray(_injections)) { _injections = [_injections]; }
    
                _member.set(_injections); // set injected value now - this includes the case of customer setter
            }
    
            // disposable
            if (attrs.members.probe('dispose', memberName).anywhere() || inject_attr) { // if injected or marked for disposal
                addDisposable('prop', memberName);
            }
    
            // apply custom attributes
            if (cfg.customAttrs) {
                _member = applyCustomAttributes(bindingHost, memberName, memberType, _member);
            }
    
            // weave advices from aspects
            if (cfg.aop) {
                _member = applyAspects(memberName, _member);
            }        
    
            // return
            return _member;
        };
        const buildFunc = (memberName, memberType, memberDef) => {
            let _member = null,
                bindingHost = obj,
                _isOverriding = (cfg.inheritance && attrs.members.probe('override', memberName).current()),
                _isStatic = (cfg.static && attrs.members.probe('static', memberName).current()),
                _isASync = (modifiers.members.probe('async', memberName).current()),
                _deprecate_attr = attrs.members.probe('deprecate', memberName).current(),
                inject_attr = attrs.members.probe('inject', memberName).current(),
                on_attr = attrs.members.probe('on', memberName).current(),              // always look for current on, inherited case would already be baked in
                timer_attr = attrs.members.probe('timer', memberName).current(),          // always look for current auto
                args_attr = attrs.members.probe('args', memberName).current(),
                _isDeprecate = (_deprecate_attr !== null),
                _deprecate_message = (_isDeprecate ? (_deprecate_attr.args[0] || `Function is marked as deprecate. (${memberName})`) : ''),
                base = null,
                _injections = [];
    
            // override, if required
            if (_isOverriding) {
                base = obj[memberName].bind(bindingHost);
            } else if (_isStatic) {
                // shared (static) copy bound to staticInterface
                // so with 'this' it will be able to access only static properties
                bindingHost = params.staticInterface; // redefine binding host
            }
    
            // resolve injections first
            if (inject_attr) {  
                let _injectWhat = inject_attr.args[0],                                          // aliasName || qualifiedTypeName || Type itself
                    _injectWith = (inject_attr.args.length > 0 ? inject_attr.args[1] : []),     // [..., ...] <- any parameters to pass to constructor of type(s) being injected
                    _injectMany = (inject_attr.args.length > 1 ? inject_attr.args[2] : false);  // true | false <- if multi injection to be done
    
                _injections = _Container.resolve(_injectWhat, _injectWith, _injectMany);
                if (!Array.isArray(_injections)) { _injections = [_injections]; }
            }
    
            // define
            if (_isASync) {
                _member = function(...args) {
                    return new Promise(function(resolve, reject) {
                        if (_isDeprecate) { console.log(_deprecate_message); } // eslint-disable-line no-console
                        let fnArgs = [];
                        if (base) { fnArgs.push(base); }                                // base is always first, if overriding
                        if (_injections.length > 0) { fnArgs.push(_injections); }       // injections comes after base or as first, if injected
                        fnArgs.push(resolve);                                           // resolve, reject follows, in async mode
                        fnArgs.push(reject);
                        if (args_attr && args.attr.args.length > 0) {
                            let argsObj = _Args(...args.attr.args)(...args);
                            if (argsObj.isInvalid) { throw argsObj.error; }
                            fnArgs.push(argsObj);                                       // push a single args processor's result object
                        } else {
                            fnArgs.concat(args);                                        // add args as is
                        }
                        return memberDef.apply(bindingHost, fnArgs);
                    }.bind(bindingHost));
                }.bind(bindingHost);                 
            } else {
                _member = function(...args) {
                    if (_isDeprecate) { console.log(_deprecate_message); } // eslint-disable-line no-console
                    let fnArgs = [];
                    if (base) { fnArgs.push(base); }                                // base is always first, if overriding
                    if (_injections.length > 0) { fnArgs.push(_injections); }       // injections comes after base or as first, if injected
                    if (args_attr && args.attr.args.length > 0) {
                        let argsObj = _Args(...args.attr.args)(...args);
                        if (argsObj.isInvalid) { throw argsObj.error; }
                        fnArgs.push(argsObj);                                       // push a single args processor's result object
                    } else {
                        fnArgs.concat(args);                                        // add args as is
                    }
                    return memberDef.apply(bindingHost, fnArgs);
                }.bind(bindingHost);                  
            }
    
            // apply custom attributes
            if (cfg.customAttrs) {
                _member = applyCustomAttributes(bindingHost, memberName, memberType, _member);
            }
    
            // weave advices from aspects
            if (cfg.aop) {
                _member = applyAspects(memberName, _member);
            }
    
            // hook it to handle posted event, if configured
            if (on_attr && on_attr.args.length > 0) {
                _on(on_attr.args[0], _member); // attach event handler
                addDisposable('handler', {name: on_attr.args[0], handler: _member});
            }
    
            // hook it to run on timer if configured
            if (timer_attr && timer_attr.args.length > 0) {
                let isInTimerCode = false;
                let intervalId = setInterval(() => {
                    // run only, when object construction is completed
                    if (!obj._.constructing && !isInTimerCode) {
                        isInTimerCode = true;
                        obj[memberName](); // call as if called from outside
                        isInTimerCode = false;
                    }
                }, (timer_attr.args[0] * 1000));         // timer_attr.args[0] is number of seconds (not milliseconds)
                addDisposable('timer', intervalId);
            }
    
            // return
            return _member;
        };
        const buildEvent = (memberName, memberType, memberDef) => {
            let _member = null,
                argsProcessorFn = null,
                base = null,
                fnArgs = null,     
                _isOverriding = (cfg.inheritance && attrs.members.probe('override', memberName).current()), 
                _deprecate_attr = attrs.members.probe('deprecate', memberName).current(),
                _post_attr = attrs.members.probe('post', memberName).current(), // always post as per what is defined here, in case of overriding
                _isDeprecate = (_deprecate_attr !== null),
                _deprecate_message = (_isDeprecate ? (_deprecate_attr.args[0] || `Event is marked as deprecate. (${memberName})`) : ''),
                bindingHost = obj;
    
            // create dispatcher, if not already created
            if (!_member_dispatcher) {
                _member_dispatcher = new Dispatcher();
                addDisposable('event', _member_dispatcher); // so it can be cleared on dispose
            }
    
            // override, if required
            if (_isOverriding) {
                // wrap for base call
                base = obj[memberName]._.processor;
            } 
       
            // define
            _member = function(...args) {
                if (_isDeprecate) { console.log(_deprecate_message); } // eslint-disable-line no-console
                if (base) {
                    fnArgs = [base].concat(args); 
                } else {
                    fnArgs = args; 
                }
                return memberDef.apply(bindingHost, fnArgs);
            }.bind(bindingHost);                  
    
           // apply custom attributes (before event interface is added)
            if (cfg.customAttrs) {
                _member = applyCustomAttributes(bindingHost, memberName, memberType, _member);
            }
    
            // weave advices from aspects (before event interface is added)
            if (cfg.aop) {
                _member = applyAspects(memberName, _member);
            }
    
            // attach event interface
            argsProcessorFn = _member; 
            _member = function(...args) {
                // preprocess args
                let processedArgs = args;
                if (typeof argsProcessorFn === 'function') { processedArgs = argsProcessorFn(...args); }
    
                // dispatch
                _member_dispatcher.dispatch(name, processedArgs);
    
                // post, if configured
                if (_post_attr && _post_attr.args.length > 0) { // post always happens for current() configuration, in case of overriding, any post defined on inherited event is lost
                    _post(_post_attr.args[0], processedArgs);   // .args[0] is supposed to the channel name on which to post, so there is no conflict
                }
            }.bind(bindingHost);
            _member._ = Object.freeze({
                processor: argsProcessorFn
            });
            _member.add = (handler) => { _member_dispatcher.add(name, handler); };
            _member.remove = (handler) => { _member_dispatcher.remove(name, handler); };
            _member.strip = (_exposed_obj) => {
                // returns the stripped version of the event without event raising ability
                let strippedEvent = Object.freeze(extend({}, _member, true, ['strip']));
    
                // delete strip feature now, it is no longer needed
                delete _member.strip;
                delete _exposed_obj.strip;
    
                // return
                return strippedEvent;
            }
    
            // return
            return _member;
        };
        const addMember = (memberName, memberType, memberDef) => {
            // validate pre-definition feasibility of member definition - throw when failed - else return updated or same memberType
            memberType = validatePreMemberDefinitionFeasibility(memberName, memberType, memberDef); 
    
            // set/update member meta
            // NOTE: This also means, when a mixed member is being overwritten either
            // because of other mixin or by being defined here, these values will be
            // overwritten as per last added member
            def.members[memberName] = memberType;
            def.attrs.members[memberName] = [];
            def.modifiers.members[memberName] = [];
            if (cfg.aop) {
                def.aspects = {
                    members: {} // each named item array in here will have: [aspect type]
                };
            }
    
            // pick mixin being applied at this time
            if (cfg.mixins) {        
                if (mixin_being_applied !== null) {
                    _attr('mixed', mixin_being_applied);
                }
            }
    
            // collect attributes and modifiers - validate applied attributes as per attribute configuration - throw when failed
            attributesAndModifiers(def, memberName);
    
            // validate feasibility of member definition - throw when failed
            if (!validateMemberDefinitionFeasibility(memberName, memberType, memberDef)) { return; } // skip defining this member
    
            // member type specific logic
            let memberValue = null,
                _isStatic = ((cfg.static && attrs.members.probe('static', memberName).current())),
                bindingHost = (_isStatic ? params.staticInterface : obj);
            switch(memberType) {
                case 'func':
                    memberValue = buildFunc(memberName, memberType, memberDef);
                    Object.defineProperty(bindingHost, memberName, {
                        configurable: true, enumerable: true,
                        value: memberValue
                    });
                    break;
                case 'prop':
                    memberValue = buildProp(memberName, memberType, memberDef);
                    Object.defineProperty(bindingHost, memberName, {
                        configurable: true, enumerable: true,
                        get: memberValue.get, set: memberValue.set
                    });
                    break;
                case 'event':
                    memberValue = buildEvent(memberName, memberType, memberDef);
                    Object.defineProperty(obj, memberName, { // events are always defined on objects, and static definition is not allowed
                        configurable: true, enumerable: true,
                        value: memberValue
                    });
                    break;
            }
    
            // finally hold the references for reflector
            def.members[memberName] = memberValue;
        };
        const addDisposable = (disposableType, data) => {
            obj._.disposables.push({type: disposableType, data: data});
        }
        const modifiers = modifierOrAttrRefl(true, def);
        const attrs = modifierOrAttrRefl(false, def);
        
        // construct base object from parent, if applicable
        if (cfg.inheritance) {
            if (params.isTopLevelInstance) {
                if (modifiers.type.has('abstract')) { throw new _Exception('InvalidOperation', `Cannot create instance of an abstract type. (${def.name})`); }
            }
    
            // create parent instance, if required, else use passed object as base object
            let Parent = Type._.inherits;
            if (Parent) {
                if (Parent._.isSealed() || Parent._.isSingleton() || Parent._.isStatic()) {
                    throw new _Exception('InvalidOperation', `Cannot inherit from a sealed, static or singleton type. (${Parent._.name})`); 
                }
                if (Parent._.type !== Type._.type) {
                    throw new _Exception('InvalidOperation', `Cannot inherit from another type family. (${Parent._.type})`); 
                }
    
                // construct base object (the inherited one)
                obj = new Parent(params._flagName, params.staticInterface, params.args); // obj reference is now parent of object
    
                // pick previous level def
                _previousDef = obj._.def;
                delete obj._.def;
            }
        }
    
         // set object meta
         if (typeof obj._ === 'undefined') {
            obj._ = extend({}, cfg.mex.instance, false); // these will always be same, since inheritance happen in same types, and these are defined at a type configuration level, so these will always be same and should behave just like the next set of definitions here
            if (cfg.mixins) {
                def.mixins = cfg.params.mixins; // mixin types that were applied to this type, will be deleted after apply
            }
            if (cfg.interfaces) {
                def.interfaces = cfg.params.interfaces; // interface types that were applied to this type, will be deleted after validation
            }
            if (cfg.dispose) {
                obj._.disposables = []; // can have {type: 'session', data: 'unique name'} OR {type: 'state', data: 'unique name'} OR {type: 'prop', data: 'prop name'} OR {type: 'event', data: dispatcher object} OR {type: 'handler', data: {name: 'event name', handler: exact func that was attached}}
            }
         }
         obj._.id = obj._.id || guid(); // inherited one or create here
         obj._.type = cfg.types.instance; // as defined for this instance by builder, this will always be same for all levels -- class 'instance' at all levels will be 'instance' only
        if (params.isTopLevelInstance) {
            obj._.Type = Type; // top level Type (all inheritance for these types will come from Type._.inherits)
            obj._.isInstanceOf = (name) => {
                if (name._ && name._.name) { name = name._.name; } // could be the 'Type' itself
                if (!name) { throw new _Exception('InvalidArgument', 'Argument type is invalid. (name)'); }
                return (obj._.Type._.name === name) || Type._.isDerivedFrom(name); 
            };
            if (cfg.mixins) {
                obj._.isMixed = (name) => { return obj._.Type._.isMixed(name); };
            }
            if (cfg.interfaces) {
                obj._.isImplements = (name) => { return obj._.Type._.isImplements(name); };
            }
            obj._.modifiers = modifiers;
            obj._.attrs = attrs;
        }
    
        // building started
        isBuildingObj = true; 
    
        // define proxy for clean syntax inside factory
        proxy = new Proxy({}, {
            get: (_obj, name) => { return obj[name]; },
            set: (_obj, name, value) => {
                if (isBuildingObj) {
                    // get member type
                    let memberType = '';
                    if (name === 'construct') {
                        memberType = 'construct'; 
                    } else if (name === 'dispose') {
                        memberType = 'dispose'; 
                    } else {
                        if (typeof value === 'function') {
                            if (_attr.has('event')) {
                                memberType = 'event'; 
                            } else {
                                memberType = 'func'; 
                            }
                        } else {
                            memberType = 'prop';
                        }
                    }
                    
                    // add member
                    addMember(name, memberType, value);
                } else {
                    // a function or event is being redefined
                    if (typeof value === 'function') { throw new _Exception('InvalidOperation', `Redefinition of members is not allowed. (${name})`); }
    
                    // allow setting property values
                    obj[name] = value;
                }
                return true;
            }
        });
    
        // apply mixins
        if (cfg.mixins) { 
            for(let mixin of def.mixins) {
                mixin_being_applied = mixin;
                mixin.apply(proxy); // run mixin's factory too having 'this' being proxy object
                mixin_being_applied = null;
            }
    
            // delete it, its no longer needed (a reference is available at Type level)
            delete def.mixins;
        }
    
        // construct using factory having 'this' being proxy object
        params.factory.apply(proxy);
    
        // clear any (by user's error left out) attributes, so that are not added by mistake elsewhere
        _attr.clear();
    
        // building ends
        isBuildingObj = false; 
    
        // move constructor and dispose out of main object
        if (params.isTopLevelInstance) { // so that till now, a normal override behavior can be applied to these functions as well
            if (cfg.construct && typeof obj[_constructName] === 'function') {
                obj._.construct = obj[_constructName]; delete obj[_constructName];
            }
            if (cfg.dispose && typeof obj[_disposeName] === 'function') {
                // wrap dispose to clean all types of disposables
                let customDisposer = obj[_disposeName]; delete obj[_disposeName];
                obj._.dispose = () => {
                    // clear all disposables
                    for(let item of obj._.disposables) {
                        switch(item.type) {
                            case 'session': _sessionStorage.removeItem(item.data); break;           // data = sessionStorage key name
                            case 'state': _localStorage.removeItem(item.data); break;               // data = localStorage key name
                            case 'prop': obj[item.data] = null; break;                              // data = property name
                            case 'event': obj[item.data].clear(); break;                            // data = dispatcher object
                            case 'handler': _on(item.data.name, item.data.handler, true); break;    // data = {name: event name, handler: handler func}
                            case 'timer': clearInterval(item.data); break;                          // data = id returned by the setInterval() call
                        }
                    }
    
                    // call customer disposer
                    if (typeof customDisposer === 'function') {
                        customDisposer();
                    }
    
                    // clear all key references related to this object
                    obj._.disposables.length = 0; 
                    obj._.Type = null;
                    obj._.modifiers = null;
                    obj._.attrs = null;
                    obj._ = null;
                    _props = null;
                    _previousDef = null;
                    def = null;
                    proxy = null;
                    _member_dispatcher = null;
                    exposed_obj = null;
                    obj = null;
                };
            }  
        }
    
        // prepare protected and public interfaces of object
        buildExposedObj();
    
        // validate interfaces of type
        if (cfg.interfaces) {
            validateInterfaces();
        }
    
        // call constructor
        if (cfg.construct && params.isTopLevelInstance && typeof exposed_obj._[_constructName] === 'function') {
            exposed_obj._.constructing = true;
            exposed_obj._[_constructName](...params.args);
            delete exposed_obj._.constructing;
        }
    
        // add/update meta on top level instance
        if (params.isTopLevelInstance) {
            if (cfg.singleton && attrs.type.has('singleton')) {
                Type._.singleInstance = () => { return exposed_obj; }; 
                Type._.singleInstance.clear = () => { 
                    Type._.singleInstance = () => { return null; };
                };
            }
        }
    
        // seal object, so nothing can be added/deleted from outside
        // also, keep protected version intact for 
        if (params.isTopLevelInstance) {
            exposed_obj._ = Object.freeze(exposed_obj._); // freeze meta information
            exposed_obj = Object.seal(exposed_obj);
        }
    
        // return
        return exposed_obj;
    };
    const builder = (cfg) => {
        // process cfg
        cfg.mixins = cfg.mixins || false;
        cfg.interfaces = cfg.interfaces || false;
        cfg.inheritance = cfg.inheritance || false;
        cfg.singleton = cfg.singleton || false;
        cfg.static = cfg.static || false;
        cfg.func = cfg.func || false;
        cfg.construct = cfg.construct || false;
        cfg.dispose = cfg.dispose || false;
        cfg.prop = cfg.prop || false;
        cfg.storage = cfg.storage || false;
        cfg.event = cfg.event || false;
        cfg.aop = cfg.aop || false;
        cfg.customAttrs = cfg.customAttrs || false;
        cfg.types.instance = cfg.types.instance || 'unknown';
        cfg.types.type = cfg.types.type || 'unknown';
        cfg.mex.instance = ((cfg.mex && cfg.mex.instance) ? cfg.mex.instance : {});
        cfg.mex.type = ((cfg.mex && cfg.mex.type) ? cfg.mex.type : {})
        cfg.ex.instance = ((cfg.ex && cfg.ex.instance) ? cfg.ex.instance : {});
        cfg.ex.type = ((cfg.ex && cfg.ex.type) ? cfg.ex.type : {});
        cfg.params.typeName = cfg.params.typeName || 'unknown';
        cfg.params.inherits = cfg.params.inherits || null;
        cfg.params.mixins = [];
        cfg.params.interfaces = [];
        cfg.params.factory = cfg.params.factory || null;
        if (!cfg.func) {
            cfg.construct = false;
            cfg.dispose = false;
        }
        if (!cfg.prop) {
            cfg.storage = false;
        }
        if (!cfg.inheritance) {
            cfg.singleton = false;
        }
        if (!cfg.func && !cfg.prop && !cfg.event) {
            cfg.aop = false;
            cfg.customAttrs = false;
        }
    
        // extract mixins and interfaces
        for(let item of cfg.params.mixinsAndInterfaces) {
           if (item._ && item._.type) {
                switch (item._.type) {
                    case 'mixin': cfg.params.mixins.push(item); break;
                    case 'interface': cfg.params.interfaces.push(item); break;
                }
           }
        }
        delete cfg.params.mixinsAndInterfaces;
    
        // object extensions
        let _oex = { // every object of every type will have this, that means all types are derived from this common object
        }; 
        cfg.ex.instance = extend(cfg.ex.instance, _oex, false); // don't override, which means defaults overriding is allowed
    
        // top level definitions
        let _flagName = '___flag___';
    
        // base type definition
        let _Object = function(_flag, _static, ...args) {
            // define parameters and context
            let params = {
                _flagName: _flagName
            };
            if (typeof _flag !== 'undefined' && _flag === _flagName) { // inheritance in play
                params.isNeedProtected = true;
                params.isTopLevelInstance = false;
                params.staticInterface = _static;
                params.args = args;
            } else {
                params.isNeedProtected = false;
                params.isTopLevelInstance = true;
                params.staticInterface = _Object;
                if (typeof _flag !== 'undefined') {
                    if (typeof _static !== 'undefined') {
                        params.args = [_flag, _static].concat(args); // one set
                    } else {
                        params.args = [_flag]; // no other args given
                    }
                } else {
                    params.args = []; // no args
                }
            }
    
            // base object
            let _this = {};
    
            // build instance
            return buildTypeInstance(cfg, _Object, params, _this);
        };
    
        // extend type itself
        _Object = extend(_Object, cfg.ex.type, false); // don't overwrite while adding type extensions, this means defaults override is allowed
    
        // type def
        let typeDef = { 
            name: cfg.params.typeName,
            type: cfg.types.type, // the type of the type itself: class, struct, etc.
            Type: _Object,
            level: 'type',
            members: {}, // each named item here defines the type of member: func, prop, event, construct, etc.
            attrs: { 
                type: [], // will have: {name, cfg, attr, args}
            },
            modifiers: {
                type: [], // will have: {name, cfg, attr, args}
            },
            previous: () => {
                return _Object._.inherits ? _Object._.inherits._.def() : null;
            }
        };
        const modifiers = modifierOrAttrRefl(true, typeDef);
        const attrs = modifierOrAttrRefl(false, typeDef);
    
        // type level attributes pick here
        attributesAndModifiers(typeDef, cfg.params.typeName);
    
        // set type meta
        _Object._ = extend({}, cfg.mex.type, true);
        _Object._.name = cfg.params.typeName;
        _Object._.type = cfg.types.type;
        _Object._.id = guid();
        _Object._.namespace = null;
        _Object._.assembly = () => { return _Assembly.get(_Object._.name) || null; };
        _Object._.inherits = null;
        if (cfg.inheritance) {
            _Object._.inherits = cfg.params.inherits || null;
            _Object._.isAbstract = () => { return modifiers.type.has('abstract'); };
            _Object._.isSealed = () => { return modifiers.type.has('sealed'); };
            _Object._.isDerivedFrom = (name) => { 
                if (name._ && name._.name) { name = name._.name; }
                if (typeof name !== 'string') { throw new _Exception('InvalidArgument', 'Argument type is invalid. (name)'); }
                let result = false,
                    prv = cfg.params.inherits; // look from parent onwards
                if (!result) {
                    while(true) { // eslint-disable-line no-constant-condition
                        if (prv === null) { break; }
                        if (prv._.name === name) { result = true; break; }
                        prv = prv._.inherits;
                    }
                }
                return result;
            };
    
            // warn for type deprecate at the time of inheritance
            if (_Object._.inherits) {
                let deprecateMessage = _Object._.inherits._.isDeprecated();
                if (deprecateMessage) {
                    console.log(deprecateMessage); // eslint-disable-line no-console
                }
            }
        }
        if (cfg.static) {
            _Object._.isStatic = () => { return modifiers.type.has('static'); };
            _Object._.props = {}; // static property values host
        }
        if (cfg.singleton) {
            _Object._.isSingleton = () => { return attrs.type.has('singleton'); };
            _Object._.singleInstance = () => { return null; };
            _Object._.singleInstance.clear = _noop;
        }
        if (cfg.mixins) {
            _Object._.mixins = cfg.params.mixins; // mixin types that were applied to this type
            _Object._.isMixed = (name) => {
                if (name._ && name._.name) { name = name._.name; }
                if (typeof name !== 'string') { throw new _Exception('InvalidArgument', 'Argument type is invalid. (name)'); }
                let result = false,
                    prv = _Object; // look from this itself
                while(true) { // eslint-disable-line no-constant-condition
                    if (prv === null) { break; }
                    result = (findItemByProp(prv._.mixins, 'name', name) !== -1);
                    if (result) { break; }
                    prv = prv._.inherits;
                }
                return result;
            };
        }
        if (cfg.interfaces) {
            _Object._.interfaces = cfg.params.interfaces,     
            _Object._.isImplements = (name) => {
                if (name._ && name._.name) { name = name._.name; }
                if (typeof name !== 'string') { throw new _Exception('InvalidArgument', 'Argument type is invalid. (name)'); }
                let result = false,
                    prv = _Object; // look from this itself
                while(true) { // eslint-disable-line no-constant-condition
                    if (prv === null) { break; }
                    result = (findItemByProp(prv._.interfaces, 'name', name) !== -1);
                    if (result) { break; }
                    prv = prv._.inherits;
                }
                return result;
            };                
        }
        _Object._.isDeprecated = () => { 
            let the_attr = attrs.type.get('deprecate');
            if (the_attr) {
                return the_attr.args[0] || `Type is marked as deprecated. (${_Object._.name})`;
            } else {
                return false;
            }
        };
        _Object._.def = () => { return typeDef; };
        _Object._.modifiers = modifiers;
        _Object._.attrs = attrs;
    
        // register type with namespace
        _Namespace(_Object); 
    
        // freeze object meta
        _Object._ = Object.freeze(_Object._);
    
        // return 
        if (_Object._.isStatic()) {
            return new _Object();
        } else { // return type
            return Object.freeze(_Object);
        }
    };
       // OK
    const Dispatcher = function() {
        let events = {};
    
        // add event listener
        this.add = (event, handler) => {
            if (typeof name !== 'string') { throw new _Exception('InvalidArgument', 'Argument type is invalid. (event)'); }
            if (typeof handler !== 'function') { throw new _Exception('InvalidArgument', 'Argument type is invalid. (handler)'); }
            if (!events[event]) { events[name] = []; }
            events[name].push(handler);
        };
    
        // remove event listener
        this.remove = (event, handler) => {
            if (typeof name !== 'string') { throw new _Exception('InvalidArgument', 'Argument type is invalid. (event)'); }
            if (typeof handler !== 'function') { throw new _Exception('InvalidArgument', 'Argument type is invalid. (handler)'); }
            if (events[event]) {
                let idx = events[event].indexOf(handler);
                if (idx !== -1) { events[event].splice(idx, 1); }
            }
        };
    
        // dispatch event
        this.dispatch = (event, args) => {
            if (events[event]) {
                events[event].forEach(handler => {
                    setTimeout(() => { handler({ name: event, args: args }); }, 0);
                });
            }
        };
    
        // get number of attached listeners
        this.count = (event) => {
            return (events[event] ? events[event].length : 0);
        };
    
        // clear all handlers for all events associated with this dispatcher
        this.clear = () => {
            events = {};
        };
    };
    
        // OK
    const guid = () => {
        return '_xxxxxxxx_xxxx_4xxx_yxxx_xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    };
    const which = (def, isFile) => {
        if (isFile) { // debug/prod specific decision
            // pick minified or dev version
            if (def.indexOf('{.min}') !== -1) {
                if (flair.options.env.isProd) {
                    return def.replace('{.min}', '.min'); // a{.min}.js => a.min.js
                } else {
                    return def.replace('{.min}', ''); // a{.min}.js => a.js
                }
            }
        } else { // server/client specific decision
            if (def.indexOf('|') !== -1) { 
                let items = def.split('|'),
                    item = '';
                if (flair.options.env.isServer) {
                    item = items[0].trim();
                } else {
                    item = items[1].trim();
                }
                if (item === 'x') { item = ''; } // special case to explicitely mark absence of a type
                return item;
            }            
        }
        return def; // as is
    };
    const isArrow = (fn) => {
        return (!(fn).hasOwnProperty('prototype'));
    };
    const findIndexByProp = (arr, propName, propValue) => {
        return arr.findIndex((item) => {
            return (item[propName] === propValue ? true : false);
        });
    };
    const findItemByProp = (arr, propName, propValue) => {
        let idx = arr.findIndex((item) => {
            return (item[propName] === propValue ? true : false);
        });
        if (idx !== -1) { return arr[idx]; }
        return null;
    };
    const splitAndTrim = (str) => {
        return str.split(',').map((item) => { return item.trim(); });
    };
    const escapeRegExp = (string) => {
        return string.replace(/([.*+?\^=!:${}()|\[\]\/\\])/g, '\\$1'); // eslint-disable-line no-useless-escape
    };
    const replaceAll = (string, find, replace) => {
        return string.replace(new RegExp(escapeRegExp(find), 'g'), replace);
    };
    const extend = (target, source, overwrite, except) => {
        if (!except) { except = []; }
        for(let item in source) {
            if (source.hasOwnProperty(item) && except.indexOf(item) === -1) { 
                if (!overwrite) { if (item in target) { continue; }}
                target[item] = source[item];
            }
        }
        return target;
    };
    const loadFile = (file) => {
        return new Promise((resolve, reject) => {
            let ext = file.substr(file.lastIndexOf('.') + 1).toLowerCase();
            if (isServer) {
                try {
                    let httpOrhttps = null,
                        body = '';
                    if (file.startsWith('https')) {
                        httpOrhttps = require('https');
                    } else {
                        httpOrhttps = require('http'); // for urls where it is not defined
                    }
                    httpOrhttps.get(file, (resp) => {
                        resp.on('data', (chunk) => { body += chunk; });
                        resp.on('end', () => { 
                            if (ext === 'json') { 
                                resolve(JSON.parse(body));
                            } else {
                                resolve(body);
                            }
                        });
                    }).on('error', reject);
                } catch(e) {
                    reject(e);
                }
            } else { // client
                fetch(file).then((response) => {
                    if (response.status !== 200) {
                        reject(response.status);
                    } else {
                        if (ext === 'json') { // special case of JSON
                            response.json().then(resolve).catch(reject);
                        } else {
                            resolve(response.text());
                        }
                    }
                }).catch(reject);
            }
        });
    };
    const loadModule = (module) => {
        return new Promise((resolve, reject) => {
            if (isServer) {
                try {
                    resolve(require(module));
                } catch(e) {
                    reject(e);
                }
            } else { // client
                let ext = module.substr(module.lastIndexOf('.') + 1).toLowerCase();
                try {
                    if (typeof require !== 'undefined') { // if requirejs type library having require() is available to load modules / files on client
                        require([module], resolve, reject);
                    } else { // load it as file on browser
                        let js = flair.options.env.global.document.createElement('script');
                        if (ext === 'mjs') {
                            js.type = 'module';
                        } else {
                            js.type = 'text/javascript';
                        }
                        js.name = module;
                        js.src = module;
                        js.onload = resolve;    // TODO: Check how we can pass the loaded 'exported' object of module to this resolve.
                        js.onerror = reject;
                        flair.options.env.global.document.head.appendChild(js);
                    }
                } catch(e) {
                    reject(e);
                }
            }
        });
    };
    const sieve = (obj, props, isFreeze, add) => {
        let _props = splitAndTrim(props);
        const extract = (_obj) => {
            let result = {};
            if (_props.length > 0) { // copy defined
                for(let prop of _props) { result[prop] = _obj[prop]; } 
            } else { // copy all
                for(let prop in obj) { 
                    if (obj.hasOwnProperty(prop)) { result[prop] = obj[prop]; }
                }            
            }
            if (add) { for(let prop in add) { result[prop] = add[prop]; } }
            if (isFreeze) { result = Object.freeze(result); }
            return result;
        };
        if (Array.isArray(obj)) {
            let result = [];
            for(let item of obj) { result.push(extract(item)); }
            return result;
        } else {
            return extract(obj);
        }
    };   // OK

    /**
     * @name Class
     * @description Constructs a Class type.
     * @example
     *  Class(name, factory)
     *  Class(name, inherits, factory)
     *  Class(name, applications, factory)
     *  Class(name, inherits, applications, factory)
     * @params
     *  name: string - name of the class
     *                 it can take following forms:
     *                 >> simple, e.g.,
     *                    MyClass
     *                 >> qualified, e.g., 
     *                    com.myCompany.myProduct.myFeature.MyClass
     *                 >> special, e.g.,
     *                    .MyClass
     *         NOTE: Qualified names are automatically registered with Namespace while simple names are not.
     *               to register simple name on root Namespace, use special naming technique, it will register
     *               this with Namespace at root, and will still keep the name without '.'
     *  inherits: type - A flair class type from which to inherit this class
     *  applications: array - An array of mixin and/or interface types which needs to be applied to this class type
     *                        mixins will be applied in order they are defined here
     *  factory: function - factory function to build class definition
     * @returns type - constructed flair class type
     */
    flair.Class = (name, inherits, mixinsAndInterfaces, factory) => {
        if (typeof name !== 'string') { throw new _Exception('InvalidArgument', 'Argument type is invalid. (name)'); }
        switch(_typeOf(inherits)) {
            case 'function':
                factory = inherits;
                inherits = null;
                mixinsAndInterfaces = [];
                break;
            case 'array':
                if (typeof mixinsAndInterfaces !== 'function') { throw new _Exception('InvalidArgument', 'Argument type is invalid. (factory)'); }
                factory = mixinsAndInterfaces;
                mixinsAndInterfaces = inherits;
                inherits = null;
                break;
            case 'class':
                if (['array', 'function'].indexOf(_typeOf(mixinsAndInterfaces)) === -1) { throw new _Exception('InvalidArgument', 'Argument type is invalid. (factory)'); }
                if (typeof mixinsAndInterfaces === 'function') {
                    factory = mixinsAndInterfaces;
                    mixinsAndInterfaces = [];
                } else {
                    if (typeof factory !== 'function') { throw new _Exception('InvalidArgument', 'Argument type is invalid. (factory)'); }
                }
                break;
            default:
                throw new _Exception('InvalidArgument', 'Argument type is invalid. (factory)'); 
        }
    
        // builder config
        let cfg = {
            mixins: true,
            interfaces: true,
            inheritance: true,
            singleton: true,
            static: true,
            func: true,
            construct: true,
            dispose: true,
            prop: true,
            event: true,
            storage: true,
            aop: true,
            customAttrs: true,
            types: {
                instance: 'instance',
                type: 'class'
            },
            params: {
                typeName: name,
                inherits: inherits,
                mixinsAndInterfaces: mixinsAndInterfaces,
                factory: factory
            },
            mex: {  // meta extensions (under <>._ property)
                instance: {},
                type: {}
            },
            ex: {   // extensions (on <> itself)
                instance: {},
                type: {}
            }
        };
        
        // return built type
        return builder(cfg);
    };
    
    // add to members list
    flair.members.push('Class'); 
    /**
     * @name getTypeOf
     * @description Gets the underlying type which was used to construct this object
     * @example
     *  getType(obj)
     * @params
     *  obj: object - object that needs to be checked
     * @returns type - flair type for the given object
     */ 
    const _getTypeOf = (obj) => {
        return ((obj._ && obj._.Type)  ? obj._.Type : null);
    };
    
    // attach to flair
    a2f('getTypeOf', _getTypeOf);
         // OK 
    /**
     * @name isDerivedFrom
     * @description Checks if given flair class type is derived from given class type, directly or indirectly
     * @example
     *  isDerivedFrom(type, parent)
     * @params
     *  type: class - flair class type that needs to be checked
     *  parent: string OR class - class type to be checked for being in parent hierarchy, it can be following:
     *                            > fully qualified class type name
     *                            > class type reference
     * @returns boolean - true/false
     */ 
    const _isDerivedFrom = (type, parent) => {
        if (_typeOf(type) !== 'class') { throw new _Exception('InvalidArgument', 'Argument type is invalid. (type)'); }
        if (['string', 'class'].indexOf(_typeOf(parent)) === -1) { throw new _Exception('InvalidArgument', 'Argument type is invalid. (parent)'); }
        return type._.isDerivedFrom(parent);
    }; 
    
    // attach to flair
    a2f('isDerivedFrom', _isDerivedFrom);
     // OK
    /**
     * @name isInstanceOf
     * @description Checks if given flair class/struct instance is an instance of given class/struct type or
     *              if given class instance implements given interface or has given mixin mixed somewhere in class/struct 
     *              hierarchy
     * @example
     *  isInstanceOf(obj, type)
     * @params
     *  obj: object - flair object that needs to be checked
     *  type: string OR class OR struct OR interface OR mixin - type to be checked for, it can be following:
     *                         > fully qualified type name
     *                         > type reference
     * @returns boolean - true/false
     */ 
    const _isInstanceOf = (obj, type) => {
        let _objType = _typeOf(obj),
            _typeType = _typeOf(type),
            isMatched = false;
        if (['instance', 'sinstance'].indexOf(_objType) === -1) { throw new _Exception('InvalidArgument', 'Argument type is invalid. (obj)'); }
        if (['string', 'class', 'interface', 'struct', 'mixin'].indexOf(_typeType) === -1) { throw new _Exception('InvalidArgument', 'Argument type is invalid. (type)'); }
    
        switch(_typeType) {
            case 'class':
            case 'struct':
                isMatched = obj._.isInstanceOf(type); break;
            case 'interface':
                isMatched = obj._.isImplements(type); break;
            case 'mixin':
                isMatched = obj._.isMixed(type); break;
            case 'string':
                isMatched = obj._.isInstanceOf(type);
                if (!isMatched && typeof obj._.isImplements === 'function') { isMatched = obj._.isImplements(type); }
                if (!isMatched && typeof obj._.isMixed === 'function') { isMatched = obj._.isMixed(type); }
                break;
        }
    
        // return
        return isMatched;
    };
    
    // attach to flair
    a2f('isInstanceOf', _isInstanceOf);
      // OK
    /**
     * @name Struct
     * @description Constructs a Struct type
     * @example
     *  Struct(name, factory)
     *  Struct(name, implementations, factory)
     * @params
     *  name: string - name of the struct
     *                 it can take following forms:
     *                 >> simple, e.g.,
     *                    MyStruct
     *                 >> qualified, e.g., 
     *                    com.myCompany.myProduct.myFeature.MyStruct
     *                 >> special, e.g.,
     *                    .MyStruct
     *         NOTE: Qualified names are automatically registered with Namespace while simple names are not.
     *               to register simple name on root Namespace, use special naming technique, it will register
     *               this with Namespace at root, and will still keep the name without '.'
     *  implementations: array - An array of mixin and/or interface types which needs to be applied to this struct type
     *                        mixins will be applied in order they are defined here
     *  factory: function - factory function to build struct definition
     * @returns type - constructed flair struct type
     */
    const _Struct = (name, implementations, factory) => {
        if (typeof name !== 'string') { throw _Exception.InvalidArgument('name'); }
        if (_typeOf(implementations) === 'array') {
            if (typeof factory !== 'function') { throw _Exception.InvalidArgument('factory'); }
        } else if (typeof implementations !== 'function') {
            throw _Exception.InvalidArgument('factory');
        } else {
            factory = implementations;
            implementations = [];
        }
    
        // builder config
        let cfg = {
            mixins: true,
            interfaces: true,
            static: true,
            func: true,
            construct: true,
            prop: true,
            event: true,
            customAttrs: true,
            types: {
                instance: 'sinstance',
                type: 'struct'
            },
            params: {
                typeName: name,
                inherits: null,
                mixinsAndInterfaces: implementations,
                factory: factory
            }
        };
    
        // return built type
        return builder(cfg);
    };
    
    // attach
    flair.Struct = Object.freeze(_Struct);
    flair.members.push('Struct');
    
    /**
     * @name typeOf
     * @description Finds the type of given object in flair type system
     * @example
     *  typeOf(obj)
     * @params
     *  obj: object - object that needs to be checked
     * @returns string - type of the given object
     *                   it can be following:
     *                    > special ones like 'undefined', 'null', 'NaN', infinity
     *                    > special javascript data types like 'array', 'date', etc.
     *                    > inbuilt flair object types like 'class', 'struct', 'enum', etc.
     *                    > native regular javascript data types like 'string', 'number', 'function', 'symbol', etc.
     */ 
    const _typeOf = (obj) => {
        let _type = '';
    
        // undefined
        if (typeof obj === 'undefined') { _type = 'undefined'; }
    
        // null
        if (!_type && obj === null) { _type = 'null'; }
    
        // NaN
        if (!_type && isNaN(obj)) { _type = 'NaN'; }
    
        // infinity
        if (!_type && typeof obj === 'number' && isFinite(obj) === false) { _type = 'infinity'; }
    
        // array
        if (!_type && Array.isArray(obj)) { _type = 'array'; }
    
        // date
        if (!_type && (obj instanceof Date)) { _type = 'date'; }
    
        // flair types
        if (!_type && obj._ && obj._.type) { _type = obj._.type; }
    
        // native javascript types
        if (!_type) { _type = typeof obj; }
    
        // return
        return _type;
    };
    
    // attach to flair
    a2f('typeOf', _typeOf);    // OK

    /**
     * @name as
     * @description Checks if given object can be consumed as an instance of given type
     * @example
     *  as(obj, type)
     * @params
     *  obj: object - object that needs to be checked
     *  type: string OR type - type to be checked for, it can be following:
     *                         > expected native javascript data types like 'string', 'number', 'function', 'array', 'date', etc.
     *                         > any 'flair' object or type
     *                         > inbuilt flair object types like 'class', 'struct', 'enum', etc.
     *                         > custom flair object instance types which are checked in following order:
     *                           >> for class instances: 
     *                              isInstanceOf given as type
     *                              isImplements given as interface 
     *                              isMixed given as mixin
     *                           >> for struct instances:
     *                              isInstance of given as struct type
     * @returns object - if can be used as specified type, return same object, else null
     */ 
    const _as = (obj, type) => {
        if (_is(obj, type)) { return obj; }
        return null;
    };
    
    // attach to flair
    a2f('as', _as);
      // OK
    // Interface
    // Interface(interfaceName, function() {})
    flair.Interface = (interfaceName, factory) => {
        let meta = {},
            _this = {};
    
        // definition helpers
        const isSpecialMember = (member) => {
            return ['constructor', 'dispose', '_constructor', '_dispose', '_'].indexOf(member) !== -1;
        };     
        _this.func = (name) => {
            if (typeof meta[name] !== 'undefined') { throw `${interfaceName}.${name} is already defined.`; }
            if (isSpecialMember(name)) { throw `${interfaceName}.${name} can only be defined for a class.`; }
            meta[name] = [];
            meta[name].type = 'func';
        };
        _this.prop = (name) => {
            if (typeof meta[name] !== 'undefined') { throw `${interfaceName}.${name} is already defined.`; }
            if (isSpecialMember(name)) { throw `${interfaceName}.${name} can only be defined as a function for a class.`; }
            meta[name] = [];
            meta[name].type = 'prop';
        };
        _this.event = (name) => {
            if (typeof meta[name] !== 'undefined') { throw `${interfaceName}.${name} is already defined.`; }
            if (isSpecialMember(name)) { throw `${interfaceName}.${name} can only be defined as a function for a class.`; }
            meta[name] = [];
            meta[name].type = 'event';
        };
    
        // add name
        meta._ = {
            name: interfaceName,
            type: 'interface',
            namespace: null        
        };
    
        // register type with namespace
        flair.Namespace(meta);
    
        // run factory
        factory.apply(_this);
    
        // remove definition helpers
        delete _this.func;
        delete _this.prop;
        delete _this.event;
    
        // return
        return meta;
    };
    
    // add to members list
    flair.members.push('Interface');
    /**
     * @name is
     * @description Checks if given object is of a given type
     * @example
     *  is(obj, type)
     * @params
     *  obj: object - object that needs to be checked
     *  type: string OR type - type to be checked for, it can be following:
     *                         > expected native javascript data types like 'string', 'number', 'function', 'array', 'date', etc.
     *                         > any 'flair' object or type
     *                         > inbuilt flair object types like 'class', 'struct', 'enum', etc.
     *                         > custom flair object instance types which are checked in following order:
     *                           >> for class instances: 
     *                              isInstanceOf given as type
     *                              isImplements given as interface 
     *                              isMixed given as mixin
     *                           >> for struct instances:
     *                              isInstance of given as struct type
     * @returns boolean - true/false
     */ 
    const _is = (obj, type) => {
        // obj may be undefined or null or false, so don't check for validation of that here
        if (type._ && type._.name) { type = type._.name; } // can be a type as well
        if (_typeOf(type) !== 'string') { throw new _Exception('InvalidArgument', 'Argument type is invalid. (type)'); }
        let isMatched = false, 
            _typ = '';
    
        // undefined
        if (type === 'undefined') { isMatched = (typeof obj === 'undefined'); }
    
        // null
        if (!isMatched && type === 'null') { isMatched = (obj === null); }
    
        // NaN
        if (!isMatched && type === 'NaN') { isMatched = isNaN(obj); }
    
        // infinity
        if (!isMatched && type === 'infinity') { isMatched = (typeof obj === 'number' && isFinite(obj) === false); }
    
        // array
        if (!isMatched && (type === 'array' || type === 'Array')) { isMatched = Array.isArray(obj); }
    
        // date
        if (!isMatched && (type === 'date' || type === 'Date')) { isMatched = (obj instanceof Date); }
    
        // flair
        if (!isMatched && (type === 'flair' && obj._ && obj._.type)) { isMatched = true; }
    
        // native javascript types
        if (!isMatched) { isMatched = (typeof obj === type); }
    
        // flair types
        if (!isMatched) {
            if (obj._ && obj._.type) { 
                _typ = obj._.type;
                isMatched = _typ === type; 
            }
        }
        
        // flair custom types (i.e., class or struct type names)
        if (!isMatched && _typ && ['instance', 'sinstance'].indexOf(_typ) !== -1) { isMatched = _isInstanceOf(obj, type); }
    
        // return
        return isMatched;
    };
    
    // attach to flair
    a2f('is', _is);
      // OK
    /**
     * @name isComplies
     * @description Checks if given object complies to given flair interface
     * @example
     *  isComplies(obj, intf)
     * @params
     *  obj: object - any object that needs to be checked
     *  intf: interface - flair interface type to be checked for
     * @returns boolean - true/false
     */ 
    const _isComplies = (obj, intf) => {
        if (!obj) { throw new _Exception('InvalidArgument', 'Argument type is invalid. (obj)'); }
        if (_typeOf(intf) !== 'interface') { throw new _Exception('InvalidArgument', 'Argument type is invalid. (intf)'); }
        
        let complied = true;
        for(let member in intf) {
            if (intf.hasOwnProperty(member) && member !== '_') {
                if (typeof obj[member] !== typeof intf[member]) {
                    complied = false; break;
                }
            }
        }
    
        return complied;
    };
    
    // attach to flair
    a2f('isComplies', _isComplies);
      // OK
    /**
     * @name isImplements
     * @description Checks if given flair class/struct instance or class/struct implements given interface
     * @example
     *  isImplements(obj, intf)
     * @params
     *  obj: object - flair object that needs to be checked
     *  intf: string OR interface - interface to be checked for, it can be following:
     *                              > fully qualified interface name
     *                              > interface type reference
     * @returns boolean - true/false
     */ 
    const _isImplements = (obj, intf) => {
        if (['instance', 'class', 'sinstance', 'struct'].indexOf(_typeOf(obj)) === -1) { throw new _Exception('InvalidArgument', 'Argument type is invalid. (obj)'); }
        if (['string', 'interface'].indexOf(_typeOf(intf)) === -1) { throw new _Exception('InvalidArgument', 'Argument type is invalid. (intf)'); }
        return obj._.isImplements(intf);
    };
    
    // attach to flair
    a2f('isImplements', _isImplements);
        // OK

    /**
     * @name Enum
     * @description Constructs a Enum type
     * @example
     *  Enum(name, factory)
     * @params
     *  name: string - name of the enum
     *                 it can take following forms:
     *                 >> simple, e.g.,
     *                    MyEnum
     *                 >> qualified, e.g., 
     *                    com.myCompany.myProduct.myFeature.MyEnum
     *                 >> special, e.g.,
     *                    .MyEnum
     *         NOTE: Qualified names are automatically registered with Namespace while simple names are not.
     *               to register simple name on root Namespace, use special naming technique, it will register
     *               this with Namespace at root, and will still keep the name without '.'
     *  data: object - enum data in form of object literal. It can have:
     *                  { Key1, Key2, Key3, ... }
     *                  { Key1: startingValue, Key2, Key3, ... }
     *                  { Key1: value, Key2: value, Key3: value, ... }
     * 
     * TODO: https://www.alanzucconi.com/2015/07/26/enum-flags-and-bitwise-operators/
     * @returns type - constructed flair enum type
     */
    const _Enum = (name, factory) => {
        if (typeof name !== 'string') { throw _Exception.InvalidArgument('name'); }
        if (typeof factory !== 'function') { throw _Exception.InvalidArgument('factory'); }
    
        // builder config
        let cfg = {
            prop: true, // TODO: fix this whole config
            types: {
                instance: 'einstance',
                type: 'enum'
            },
            params: {
                typeName: name,
                inherits: null,
                mixinsAndInterfaces: null,
                factory: factory
            }
        };
    
        // return built type
        return builder(cfg);
    };
    
    // attach
    flair.Enum = Object.freeze(_Enum);
    flair.members.push('Enum');
    
    
    // // Enum
    // // Enum(name, def)
    // //  name: name of the enum
    // //  def: object with key/values or an array of values
    // flair.Enum = (name, data) => {
    //     'use strict';
    
    //     // args validation
    //     if (!(typeof data === 'object' || Array.isArray(data))) { throw flair.Exception('ENUM01', 'Invalid enum data.'); }
    
    //     // // enum type
    //     // let _Enum = data;
    //     // if (Array.isArray(data)) {
    //     //     let i = 0,
    //     //         _Enum = {};
    //     //     for(let value of data) {
    //     //         _Enum[i] = value; i++;
    //     //     }
    //     // } 
    
    //     // // meta extensions
    //     // let mex = {
    //     //     keys: () => {
    //     //         let keys = [];
    //     //         for(let key in _Enum) {
    //     //             if (_Enum.hasOwnProperty(key) && key !== '_') {
    //     //                 keys.push(key);
    //     //             }
    //     //         }
    //     //         return keys;
    //     //     },
    //     //     values: () => {
    //     //         let values = [];
    //     //         for(let key in _Enum) {
    //     //             if (_Enum.hasOwnProperty(key) && key !== '_') {
    //     //                 values.push(_Enum[key]);
    //     //             }
    //     //         }
    //     //         return values;
    //     //     }
    //     // };
    
    //     // return
    //     //return flarizedType('enum', name, _Enum, mex);
    // };
    // flair.Enum.getKeys = (obj) => {
    //     try {
    //         return obj._.keys();
    //     } catch (e) {
    //         throw flair.Exception('ENUM02', 'Object is not an Enum.', e);
    //     }
    // };
    // flair.Enum.getValues = (obj) => {
    //     try {
    //         return obj._.values();
    //     } catch (e) {
    //         throw flair.Exception('ENUM02', 'Object is not an Enum.', e);
    //     }
    // };
    // flair.Enum.isDefined = (obj, keyOrValue) => {
    //     return (flair.Enum.getKeys().indexOf(keyOrValue) !== -1 || flair.Enum.getValues().indexOf(keyOrValue) !== -1);
    // };
    
    
    /**
     * @name noop
     * @description No Operation function
     * @example
     *  noop()
     * @params
     * @returns
     */ 
    const _noop = () => {};
    
    // attach to flair
    a2f('noop', _noop);
         // OK
    /**
     * @name telemetry
     * @description Telemetry enable/disable/filter/collect
     * @example
     *  .on()
     *  .on(...types)
     *  .on(handler, ...types)
     *  .collect()
     *  .off()
     *  .off(handler)
     *  .isOn()
     *  .types
     * @params
     *  types: string - as many types, as needed, when given, telemetry for given types only will be released
     *  handler: function - an event handler for telemetry event
     *                      Note: This can also be done using flair.on('telemetry', handler) call.
     */ 
    let telemetry = _noop,
        telemetry_buffer = [],
        telemetry_max_items = 500;
    const _telemetry = {
        // turn-on telemetry recording
        on: (handler, ...types) => {
            if (telemetry === _noop) {
                if (typeof handler === 'string') { types.unshift(handler); }
                else if (typeof handler === 'function') { _on('telemetry', handler); }
    
                // redefine telemetry
                telemetry = (type, data) => {
                    if (types.length === 0 || types.indexOf(type) !== -1) { // filter
                        // pack
                        let item = Object.freeze({type: type, data: data});
    
                        // buffer
                        telemetry_buffer.push(item);
                        if (telemetry_buffer.length > (telemetry_max_items - 25)) {
                            telemetry_buffer.splice(0, 25); // delete 25 items from top, so it is always running buffer of last 500 entries
                        }
    
                        // emit
                        dispatch('telemetry', item);
                    }
                };
            }
        },
    
        // collect buffered telemetry and clear buffer
        collect: () => {
            if (telemetry !== _noop) {
                let buffer = telemetry_buffer.slice();
                telemetry_buffer.length = 0; // initialize
                return buffer;
            }
            return [];
        },
    
        // turn-off telemetry recording
        off: (handler) => {
            if (telemetry !== _noop) {
                if (typeof handler === 'function') { _on('telemetry', handler, true); }
    
                // redefine telemetry
                telemetry = _noop;
    
                // return
                return _telemetry.collect();
            }
            return [];
        },
    
        // telemetry recording status check
        isOn: () => { return telemetry !== _noop; },
    
        // telemetry types list
        types: Object.freeze({
            RAW: 'raw',         // type and instances creation telemetry
            EXEC: 'exec',       // member access execution telemetry
            INFO: 'info',       // info, warning and exception telemetry
            INCL: 'incl'        // external component inclusion, fetch, load related telemetry
        })
    };
    
    // attach to flair
    a2f('telemetry', _telemetry, () => {
        telemetry_buffer.length = 0;
    });
        // OK

    /**
     * @name isMixed
     * @description Checks if given flair class/struct instance or class/struct has mixed with given mixin
     * @example
     *  isMixed(obj, mixin)
     * @params
     *  obj: object - flair object instance or type that needs to be checked
     *  mixin: string OR mixin - mixin to be checked for, it can be following:
     *                           > fully qualified mixin name
     *                           > mixin type reference
     * @returns boolean - true/false
     */ 
    const _isMixed = (obj, mixin) => {
        if (['instance', 'class', 'sinstance', 'struct'].indexOf(_typeOf(obj)) === -1) { throw new _Exception('InvalidArgument', 'Argument type is invalid. (obj)'); }
        if (['string', 'mixin'].indexOf(_typeOf(mixin)) === -1) { throw new _Exception('InvalidArgument', 'Argument type is invalid. (mixin)'); }
        return obj._.isMixed(mixin);
    };
    
    // attach to flair
    a2f('isMixed', _isMixed);
     // OK
    // Mixin
    // Mixin(mixinName, function() {})
    flair.Mixin = (mixinName, factory) => {
        // add name
        factory._ = {
            name: mixinName,
            type: 'mixin',
            namespace: null        
        };
    // TODO: check that mixin either can be defined as struct or should have at least basic class definition approach or allow mixing classes itself
    
    
        // register type with namespace
        flair.Namespace(factory);
    
        // return
        return factory;
    };
    
    // add to members list
    flair.members.push('Mixin');

    // Reflector
    flair.Reflector = function (forTarget) {
        // define
        const CommonTypeReflector = function(target) {
            this.getType = () => { return target._.type; };
            this.getName = () => { return target._.name || ''; };
            this.getNamespace = () => { 
                let _Namespace = target._.namespace;
                if (_Namespace) { return new NamespaceReflector(_Namespace); }
                return null; 
            };
            this.getAssembly = () => {
                let _Assembly = flair.Assembly.get(target._.name);
                if (_Assembly) { return new AssemblyReflector(_Assembly); }
                return null;
            }
            this.getTarget = () => { return target; };
            this.isInstance = () => { return target._.type === 'instance'; };
            this.isClass = () => { return target._.type === 'class'; };
            this.isEnum = () => { return target._.type === 'enum'; };
            this.isStruct = () => { return target._.type === 'struct'; };
            this.isStructInstance = () => { return target._.type === 'sinstance'; };
            this.isNamespace = () => { return target._.type === 'namespace'; };
            this.isResource = () => { return target._.type === 'resource'; };
            this.isAssembly = () => { return target._.type === 'assembly'; };
            this.isMixin = () => { return target._.type === 'mixin'; };
            this.isInterface = () => { return target._.type === 'interface'; };
        };
        const CommonMemberReflector = function(type, target, name) {
            this.getType = () => { return 'member'; }
            this.getMemberType = () => { return type; }
            this.getTarget = () => { return target; }
            this.getTargetType = () => { return target._.type; }
            this.getName = () => { return name; }
        };
        const AttrReflector = function(Attr, name, args, target) {
            this.getType = () => { return 'attribute'; }
            this.getName = () => { return name; }
            this.getTarget = () => { return target; }
            this.getArgs = () => { return args.slice(); }
            this.getClass = () => { 
                if (Attr) { return new ClassReflector(Attr); }
                return null;
                }
        };
        const AspectReflector = function(Aspect, target) {
            this.getType = () => { return 'aspect'; }
            this.getName = () => { return Aspect._.name; }
            this.getTarget = () => { return target; }
            this.getClass = () => { 
                if (Aspect) { return new ClassReflector(Aspect); }
                return null;
                }
        };
        const CommonInstanceMemberReflector = function(type, target, name, ref) {
            let refl = new CommonMemberReflector(type, target, name);
            refl.getRef = () => { return ref; };
            refl.getAttributes = () => {
                let items = [],
                    attrs = [];
                for (let item of target._.instanceOf) {
                    if (item.meta[name]) {
                        attrs = item.meta[name];
                        for(let attr of attrs) {
                            items.push(new AttrReflector(attr.Attr, attr.name, attr.args, target));
                        }
                    }
                }
                return items;
            };
            refl.hasAttribute = (attrName) => {
                let isOk = false,
                    attrs = [];
                for (let item of target._.instanceOf) {
                    if (item.meta[name]) {
                        attrs = item.meta[name];
                        for(let attr of attrs) {
                            if (attr.name == attrName) {
                                isOk = true; break;
                            }
                        }
                    }
                    if (isOk) { break; }
                }
                return isOk;                 
            };
            refl.getAttribute = (attrName) => {
                let attrInfo = null;
                for (let item of target._.instanceOf) {
                    if (item.meta[name]) {
                        let attrs = item.meta[name];
                        for(let attr of attrs) {
                            if (attr.name === attrName) {
                                attrInfo = new AttrReflector(attr.Attr, attr.name, attr.args, target);
                                break;
                            }
                        }
                    }
                    if (attrInfo !== null) { break; }
                }
                return attrInfo;
            };
            refl.isEnumerable = () => {
                if (target[name]) { 
                    return Object.getOwnPropertyDescriptor(target, name).enumerable;
                }
                return false;
            };
            // TODO: Update these as per new API ._.member and ._.attrs
            refl.isDeprecated = () => { return target._._.hasAttrEx('deprecate', name); };
            refl.isConditional = () => { return target._._.hasAttrEx('conditional', name); };
            refl.isOverridden = () => { return target._._.hasAttrEx('override', name); };
            refl.isOwn = () => { return target._.isOwnMember(name); };
            refl.isDerived = () => { return target._._.isDerivedMember(name); };
            refl.isPrivate = () => { return target._._.hasAttrEx('private', name); };
            refl.isProtected = () => { return target._._.isProtectedMember(name); };
            refl.isPublic = () => { return (!refl.isPrivate && !refl.isProtected); };
            refl.isSealed = () => { return target._._.isSealedMember(name); };
            refl.isMixed = () => { return target._._.hasAttrEx('mixed', name); };
            refl.getMixin = () => { 
                if (refl.isMixed()) {
                    let mixin = refl.getAttribute('mixed').getArgs()[0];
                    return new MixinReflector(mixin);
                }
                return null;
            };
            refl.isInterfaceEnforced = () => { return refl.getInterfaces().length > 0; };
            refl.getInterfaces = () => {
                let items = [],
                    interfaces = [];
                for (let item of target._.instanceOf) {
                    if (item.meta[name]) {
                        interfaces = item.meta[name].interfaces;
                        for(let iface of interfaces) {
                            items.push(new InterfaceReflector(iface, target));
                        }
                    }
                }
                return items;                    
            };        
            refl.isProp = () => { return type === 'prop'; }
            refl.isFunc = () => { return type === 'func'; }
            refl.isEvent = () => { return type === 'event'; }
            return refl;
        };
        const PropReflector = function(target, name, ref) {
            let refl = new CommonInstanceMemberReflector('prop', target, name, ref);
            refl.getValue = () => { return target[name]; };
            refl.setValue = (value) => { return target[name] = value; };
            refl.getRaw = () => { return ref; };
            refl.isReadOnly = () => { return target._._.hasAttrEx('readonly', name); };
            refl.isSetOnce = () => { return target._._.hasAttrEx('readonly', name) && target._._.hasAttrEx('once', name); };
            refl.isStatic = () => { return target._._.hasAttrEx('static', name); };
            refl.isSerializable = () => { return target._._.isSerializableMember(name); }
            return refl;
        };
        const FuncReflector = function(target, name, ref, raw) {
            let refl = new CommonInstanceMemberReflector('func', target, name, ref);
            refl.invoke = (...args) => { return target[name](...args); };
            refl.getAspects = () => {
                let items = [],
                    aspects = [];
                for (let item of target._.instanceOf) {
                    if (item.meta[name]) {
                        aspects = item.meta[name].aspects;
                        for(let aspect of aspects) {
                            items.push(new AspectReflector(aspect, target));
                        }
                    }
                }
                return items;                    
            };
            refl.getRaw = () => { return raw; };
            refl.isASync = () => { return target._._.hasAttrEx('async', name); }
            refl.isConstructor = () => { return name === '_constructor'; }
            refl.isDisposer = () => { return name === '_dispose'; }
            return refl;
        };
        const EventReflector = function(target, name, ref) {
            let refl = new CommonInstanceMemberReflector('event', target, name, ref);
            refl.raise = (...args) => { return ref(...args); }
            refl.isSubscribed = () => { return ref.subscribe.all().length > 0; }
            return refl;
        };
        const KeyReflector = function(target, name) {
            let refl = new CommonMemberReflector('key', target, name);
            refl.getValue = () => { return target[name]; }
            return refl;
        };
        const InstanceReflector = function(target) {
            let refl = new CommonTypeReflector(target),
                filterMembers = (members, type, attrs) => {
                    if (type === '' && attrs.length === 0) { return members.slice(); }
                    let filtered = [],
                        hasAllAttrs = true;
                    for(let member of members) {
                        if (member.getType() !== 'member') { continue; }
                        if (type !== '' && member.getMemberType() !== type) { continue; }
                        hasAllAttrs = true;
                        if (attrs.length !== 0) {
                            for(let attrName of attrs) {
                                if (!member.hasAttribute(attrName)) {
                                    hasAllAttrs = false;
                                    break; 
                                }
                            }
                        }
                        if (hasAllAttrs) {
                            filtered.push(member);
                        }
                    }
                    return filtered;
                },
                getMembers = (oneMember) => {
                    let members = [],
                        attrs = [], // eslint-disable-line no-unused-vars
                        lastMember = null,
                        member = null;
                    for(let instance of target._.instanceOf) {
                        for(let name in instance.meta) {
                            if (instance.meta.hasOwnProperty(name)) {
                                attrs = instance.meta[name];
                                switch(instance.meta[name].type) {
                                    case 'func':
                                        lastMember = new FuncReflector(target, name, instance.meta[name].ref, instance.meta[name].raw);
                                        members.push(lastMember);
                                        break;
                                    case 'prop':
                                        lastMember = new PropReflector(target, name, instance.meta[name].ref);
                                        members.push(lastMember);
                                        break;
                                    case 'event':
                                        lastMember = new EventReflector(target, name, instance.meta[name].argNames, instance.meta[name].ref);
                                        members.push(lastMember);
                                        break;
                                    default:
                                        throw 'Unknown member type';
                                }
                                if (typeof oneMember !== 'undefined' && name === oneMember) { 
                                    members = [];
                                    member = lastMember;
                                }
                            }
                            if (member !== null) { break; }
                        }
                        if (member !== null) { break; }
                    }
                    if (member !== null) { return member; }
                    return {
                        all: (...attrs) => { 
                            return filterMembers(members, '', attrs);
                        },
                        func: (...attrs) => { 
                            return filterMembers(members, 'func', attrs);
                        },
                        prop: (...attrs) => {
                            return filterMembers(members, 'prop', attrs);
                        },
                        event: (...attrs) => {
                            return filterMembers(members, 'event', attrs);
                        }
                    };                  
                };
            refl.getClass = () => { 
                if (target._.inherits !== null) {
                    return new ClassReflector(target._.inherits);
                }
                return null;
            };
            refl.getFamily = () => {
                let items = [],
                    prv = target._.inherits;
                // eslint-disable-next-line no-constant-condition
                while(true) {
                    if (prv === null) { break; }
                    items.push(new ClassReflector(prv));
                    prv = prv._.inherits;
                }
                return items;
            };
            refl.getMixins = () => { 
                let items = [],
                    family = refl.getFamily();
                for(let cls of family) {
                    items = items.concat(cls.getMixins());
                }
                return items;
            };
            refl.getInterfaces = () => { 
                let items = [],
                    family = refl.getFamily();
                for(let cls of family) {
                    items = items.concat(cls.getInterfaces());
                }
                return items;
            };
            refl.getMembers = (...attrs) => { 
                let members = getMembers();
                if (attrs.length !== 0) {
                    return members.all(...attrs);
                }
                return members;
            };
            refl.getMember = (name) => { return getMembers(name); };
            refl.isSingleton = () => { return refl.getClass().isSingleton(); };                       
            refl.isInstanceOf = (name) => { return target._.isInstanceOf(name); };
            refl.isMixed = (name) => { return target._.isMixed(name); };
            refl.isImplements = (name) => { return target._.isImplements(name); };
            return refl;              
        };
        const StructInstanceReflector = function(target) {
            let refl = new CommonTypeReflector(target);
            refl.getStruct = () => { 
                if (target._.inherits !== null) {
                    return new StructReflector(target._.inherits);
                }
                return null;
            };
            refl.getMembers = () => { 
                let keys = Object.keys(target),
                    _At = keys.indexOf('_');
                if (_At !== -1) {
                    keys.splice(_At, 1);
                }
                return keys;
            };
            refl.getMember = (name) => { return target[name]; };
            refl.invoke = (...args) => { return target[name](...args); };
            refl.isInstanceOf = (name) => { return target._.inherits._.name === name; };
            return refl;              
        };    
        const ClassReflector = function(target) {
            let refl = new CommonTypeReflector(target);
            refl.getParent = () => { 
                if (target._.inherits !== null) {
                    return new ClassReflector(target._.inherits);
                }
                return null;
            };
            refl.getFamily = () => {
                let items = [],
                    prv = target._.inherits;
                // eslint-disable-next-line no-constant-condition    
                while(true) {
                    if (prv === null) { break; }
                    items.push(new ClassReflector(prv));
                    prv = prv._.inherits;
                }
                return items;
            };       
            refl.getMixins = () => {
                let items = [];
                for(let mixin of target._.mixins) {
                    items.push(new MixinReflector(mixin));
                }
                return items;
            };
            refl.getInterfaces = () => {
                let items = [];
                for(let _interface of target._.interfaces) {
                    items.push(new InterfaceReflector(_interface));
                }
                return items;
            };
            refl.isSingleton = () => { return target._.isSingleton(); };                       
            refl.isSingleInstanceCreated = () => { return target._.singleInstance() !== null; };
            refl.isSealed = () => { return target._.isSealed(); }
            refl.isDerivedFrom = (name) => { return target._.isDerivedFrom(name); }
            refl.isMixed = (name) => { return target._.isMixed(name); }
            refl.isImplements = (name) => { return target._.isImplements(name); }
            return refl;                
        };
        const EnumReflector = function(target) {
            let refl = new CommonTypeReflector(target);
            refl.getMembers = () => { 
                let keys = target._.keys(),
                    members = [];
                for(let key of keys) {
                    members.push(new KeyReflector(target, key));
                }
                return members;
            };
            refl.getMember = (name) => {
                if (typeof target[name] === 'undefined') { throw `${name} is not defined.`; }
                return new KeyReflector(target, name);
            };
            refl.getKeys = () => { return target._.keys(); }
            refl.getValues = () => { return target._.values(); }
            return refl;
        };
        const ResourceReflector = function(target) {
            let refl = new CommonTypeReflector(target);
            refl.getFile = () => { return target.file(); };
            refl.getResType = () => { return target.type(); };
            refl.getContent = () => { return target.get(); };
            return refl;
        };
        const StructReflector = function(target) {
            let refl = new CommonTypeReflector(target);
            return refl;
        };            
        const NamespaceReflector = function(target) {
            let refl = new CommonTypeReflector(target);
            refl.getMembers = () => { 
                let types = target.getTypes(),
                    members = [];
                if (types) {
                    for(let type of types) {
                        switch(type._.type) {
                            case 'class': members.push(new ClassReflector(type)); break;
                            case 'enum': members.push(new EnumReflector(type)); break;
                            case 'struct': members.push(new StructReflector(type)); break;
                            case 'mixin': members.push(new MixinReflector(type)); break;
                            case 'interface': members.push(new InterfaceReflector(type)); break;                    
                        }
                    }
                }
                return members;
            };
            refl.getMember = (qualifiedName) => {
                let Type = target.getType(qualifiedName),
                    member = null;
                if (Type) {
                    switch(Type._.type) {
                        case 'class': member = new ClassReflector(Type); break;
                        case 'enum': member = new EnumReflector(Type); break;
                        case 'struct': member = new StructReflector(Type); break;
                        case 'mixin': member = new MixinReflector(Type); break;
                        case 'interface': member = new InterfaceReflector(Type); break;                    
                    }
                }
                return member;
            };
            refl.createInstance = (qualifiedName, ...args) => {
                return target.createInstance(qualifiedName, ...args);
            };
            return refl;
        };
        const AssemblyReflector = function(target) {
            let refl = new CommonTypeReflector(target);
            refl.getTypes = () => { 
                return target.types;
            };
            refl.getAssets = () => { 
                return target.assets;
            };
            refl.getADO = () => { return target._.ado; }
            refl.load = () => {
                return target.load();
            };
            return refl;
        };    
        const MixinReflector = function(target) {
            let refl = new CommonTypeReflector(target);
            return refl;
        };
        const InterfaceReflector = function(target) {
            let refl = new CommonTypeReflector(target),
                getMembers = () => {
                    let members = [];
                    for(let _memberName in target) {
                        if (target.hasOwnProperty(_memberName) && _memberName !== '_') {
                            members.push(new CommonMemberReflector(target[_memberName].type, target, _memberName));
                        }
                    }
                    return members;                     
                };
            refl.getMembers = () => { 
                return getMembers();
            }
            refl.getMember = (name) => {
                if (typeof target[name] === 'undefined') { throw `${name} is not defined.`; }
                return new CommonMemberReflector(target[name].type, target, name);
            };
            return refl;
        };
    
        // get
        let ref = null;
        switch(forTarget._.type) {
            case 'instance': ref = new InstanceReflector(forTarget); break;
            case 'sinstance': ref = new StructInstanceReflector(forTarget); break;
            case 'class': ref = new ClassReflector(forTarget); break;
            case 'enum': ref = new EnumReflector(forTarget); break;
            case 'resource': ref = new ResourceReflector(forTarget); break;
            case 'struct': ref = new StructReflector(forTarget); break;
            case 'namespace': ref = new NamespaceReflector(forTarget); break;
            case 'assembly': ref = new AssemblyReflector(forTarget); break;
            case 'mixin': ref = new MixinReflector(forTarget); break;
            case 'interface': ref = new InterfaceReflector(forTarget); break;
            default:
                throw `Unknown type ${forTarget._.type}.`;
        }
    
        // return
        return ref;
    };
    
    // add to members list
    flair.members.push('Reflector');    

    /**
     * @name Serializer
     * @description Serializer/Deserialize object instances
     * @example
     *  .serialiaze(instance)
     *  .deserialize(json)
     * @params
     *  instance: object - supported flair type's object instance to serialize
     *  json: object - previously serialized object by the same process
     * @returns
     *  string: json string when serialized
     *  object: flair object instance, when deserialized
     */ 
    const serilzer_process = (source, isDeserialize) => {
        let result = null,
            memberNames = null,
            src = (isDeserialize ? JSON.parse(source) : source),
            Type = (isDeserialize ? null : source._.Type);
        const getMemberNames = (obj, isSelectAll) => {
            let attrRefl = obj._.attrs,
                modiRefl = obj._.modifiers,
                props = [],
                isOK = false;
            for(let memberName in obj) {
                if (obj.hasOwnProperty(memberName) && memberName !== '_') {
                    isOK = modiRefl.members.isProperty(memberName);
                    if (isOK) {
                        if (isSelectAll) {
                            isOK = !attrRefl.members.probe('noserialize', memberName).anywhere(); // not marked as noserialize when type itself is marked as serialize
                        } else {
                            isOK = attrRefl.members.probe('serialize', memberName).anywhere(); // marked as serialize when type is not marked as serialize
                        }
                        if (isOK) {
                            isOK = (!modiRefl.members.is('private', memberName) &&
                                    !modiRefl.members.is('protected', memberName) &&
                                    !modiRefl.members.is('static', memberName) &&
                                    !modiRefl.members.is('readonly', memberName) &&
                                    !attrRefl.members.probe('inject', memberName).anywhere());
                        }
                    }
                    if (isOK) { props.push(memberName); }
                }
            }
            return props;
        }; 
    
        if (isDeserialize) {
            // validate 
            if (!src.type && !src.data) { throw _Exception.InvalidArgument('json'); }
    
            // get base instance to load property values
            Type = _getType(src.type);
            if (!Type) { throw new _Exception('NotRegistered', `Type is not registered. (${src.type})`); }
            result = new Type(); // that's why serializable objects must be able to create themselves without arguments 
            
            // get members to deserialize
            if (Type._.attrs.type.has('serialize', true)) {
                memberNames = getMemberNames(result, true);
            } else {
                memberNames = getMemberNames(result, false);
            }
            
            // deserialize
            for(let memberName of memberNames) { result[memberName] = src.data[memberName]; }
        } else {
            // get members to serialize
            if (Type._.attrs.type.has('serialize', true)) {
                memberNames = getMemberNames(src, true);
            } else {
                memberNames = getMemberNames(src, false);
            }
    
            // serialize
            result = {
                type: src._.Type._.name,
                data: {}
            };
            for(let memberName of memberNames) { result.data[memberName] = src[memberName]; }
            result = JSON.stringify(result);
        }
    
        // return
        return result;
    };
    const _Serializer = {
        // serialize given supported flair type's instance
        serialize: (instance) => { 
            if (!(instance && instance._ && instance._.type) || ['instance', 'sinstance'].indexOf(instance._.type) === -1) { throw _Exception.InvalidArgument('instance'); }
            return serilzer_process(instance);
        },
    
        // deserialize last serialized instance
        deserialize: (json) => {
            if (!json || typeof json !== 'string') { throw _Exception.InvalidArgument('json'); }
            return serilzer_process(json, true);
        }
    };
    
    // attach to flair
    a2f('Serializer', _Serializer);
    
      // OK

    // freeze members
    flair.members = Object.freeze(flair.members);

    // return
    return Object.freeze(flair);
});    
