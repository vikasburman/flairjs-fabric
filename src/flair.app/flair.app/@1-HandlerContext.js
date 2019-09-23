/**
 * @name HandlerContext
 * @description HandlerContext data
 */
Class('', function() {
    $$('virtual');
    this.construct = () => { };

    $$('private');
    this.items = {};

    this.getData = (key, defaultValue) => { return this.items[key] || defaultValue; };
    this.setData = (key, value) => { this.items[key] = value; };

    this.redirect = (path, status, additionalInfo) => { // additionalInfo can be and object with key: value - these will be passed as querystring to redirect call
        this.setData('redirect-path', path);
        this.setData('redirect-status', status || 302); // Found
        this.setData('redirect-additionalInfo', additionalInfo || null);
        throw Exception.Redirect(path);
    };
});
