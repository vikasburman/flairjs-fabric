const { Payload } = await ns('flair.app');

/**
 * @name BinaryPayload
 * @description Binary data
 */
Class('', Payload, function() {
    $$('override');
    this.construct = (base, data, status, mimeType, filename, cb, resHeaders) => {
        if (!data)  { throw new Exception.InvalidArgument('data'); }

        this.buffer = Buffer.from(data, this.encoding);
        
        base(this.buffer, status, mimeType, resHeaders);

        this.cb = cb || null;

        this.resHeaders.push({ name: 'Content-disposition', value: `attachment;filename=${filename || 'unknown.unknown'}` });
        this.resHeaders.push({ name: 'Content-Length', value: this.buffer.length });
    };

    $$('readonly');
    this.buffer = null;

    $$('readonly');
    this.encoding = 'binary';

    $$('readonly');
    this.cb = null;
});
