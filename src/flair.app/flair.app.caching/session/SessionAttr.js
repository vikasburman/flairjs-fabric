const { IAttribute } = await ns();

/**
 * @name SessionAttr
 * @description Session custom attribute
 * $$('session')
 */
$$('sealed');
Class('', [IAttribute], function() {
    this.construct = () => {
        this.port = Port('sessionStorage');
    };

    $$('private');
    this.port = null;

    $$('readonly');
    this.name = 'session';

    $$('readonly');
    this.constraints = '(class && prop) && !($static || $state || $readonly || $abstract || $virtual)';


    // TODO: here onwards - think how session and etate will come out of builder
    // considering addDisposal -- is that needed - because on dispose it is removed 
    // and no point of session and state availability then
    this.decorateFunction = (typeName, memberName, member, ttl) => {
        let _this = this,
            cacheId = `${typeName}___${memberName}`;

        let callMember = async (...args) => {
            let resultData = await member(...args);
            await _this.port.setItem(cacheId, resultData, ttl);
            return resultData;
        };

        // decorated function
        return async function(...args) {
            let fetchedData = await _this.port.getItem(cacheId);
            return (fetchedData !== null) ? fetchedData : await callMember(...args);
        };
    };
});
