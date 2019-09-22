const { Payload } = await ns('flair.app');

/**
 * @name JSONPayload
 * @description JSON/JSONP data
 */
Class('', Payload, function() {
    $$('override');
    this.construct = (base, data, status, isJsonP, resHeaders) => {
        if (!data)  { throw new Exception.InvalidArgument('data'); }
        base(data, status, 'application/json', resHeaders);

        this.isJsonP = isJsonP || false;
    };

    $$('readonly');
    this.isJsonP = false;
});
