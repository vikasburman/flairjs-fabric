const { IAttribute } = await ns();
const { State } = await ns('flair.app.caching');

/**
 * @name StateAttr
 * @description State custom attribute
 * $$('state')
 */
$$('sealed');
Class('', [IAttribute], function() {
    $$('readonly');
    this.name = 'state';

    $$('readonly');
    this.constraints = '(class && prop) && !($static || $session || $readonly || $abstract || $virtual)';


    // TODO: here onwards - think how session and etate will come out of builder
    // considering addDisposal -- is that needed - because on dispose it is removed 
    // and no point of session and state availability then
    this.decorateFunction = (typeName, memberName, member, ttl) => {
        let cacheId = `${typeName}___${memberName}`;

        let callMember = async (...args) => {
            let resultData = await member(...args);
            await State.setItem(cacheId, resultData, ttl);
            return resultData;
        };

        // decorated function
        return async function(...args) {
            let fetchedData = await State.getItem(cacheId);
            return (fetchedData !== null) ? fetchedData : await callMember(...args);
        };
    };
});
