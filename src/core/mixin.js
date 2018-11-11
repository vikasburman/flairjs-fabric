// Mixin
// Mixin(mixinName, function() {})
oojs.Mixin = (mixinName, factory) => {
    // add name
    factory._ = {
        name: mixinName,
        type: 'mixin'
    };

    // return
    return factory;
};