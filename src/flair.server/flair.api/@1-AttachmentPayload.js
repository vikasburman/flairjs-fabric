const { Payload } = await ns('flair.app');
const path = require('path');

/**
 * @name AttachmentPayload
 * @description Downloadable file payload
 */
Class('', Payload, function() {
    $$('override');
    this.construct = (base, file, status, mimeType, displayName, options, cb, resHeaders) => {
        if (!this.file) { throw Exception.InvalidArgument('file'); }
        base(file, status, mimeType, resHeaders);
        
        this.file = file || ''; 
        this.displayName = displayName || path.basename(this.file);
        this.options = options || null;
        this.cb = cb || null;

        this.resHeaders.push({ name: 'Content-disposition', value: `attachment;filename=${this.displayName || 'unknown.unknown'}` });
    };

    $$('readonly');
    this.file = '';

    $$('readonly');
    this.displayName = '';

    $$('readonly');
    this.options = null;

    $$('readonly');
    this.cb = null;
});
