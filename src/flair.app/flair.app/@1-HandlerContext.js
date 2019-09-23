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
});
