// assembly globals
const onLoadComplete = (asm) => {
    // register custom attributes
    const registerCustomAttribute = (customAttrName, qualifiedTypeName) => {
        let customAttrType = asm.getType(qualifiedTypeName);
        if (customAttrType) { Container.register(customAttrName, customAttrType); }
    };
    
    registerCustomAttribute('cache', 'flair.app.attr.Cache');
};