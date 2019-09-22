/**
 * @name Payload
 * @description Extended payload
 */
Class('', function() {
    $$('virtual');
    this.construct = (data, status, mimeType, resHeaders) => {
        this.data = data || null;
        this.status = status || null;
        if (Array.isArray(resHeaders)) { this.resHeaders.push(...resHeaders); }
        
        if (mimeType) { this.resHeaders.push({ name: 'Content-Type', value: mimeType || 'text/plain' }); }
    };

    $$('readonly');
    this.data = null;

    $$('readonly');
    this.status = null;

    $$('readonly');
    this.resHeaders = [];
});
