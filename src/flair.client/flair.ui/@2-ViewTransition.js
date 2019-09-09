/**
 * @name ViewTransition
 * @description GUI View Transition
 */
Class('', function() {
    $$('virtual');
    $$('async');
    this.enter = noop;

    $$('virtual');
    $$('async');
    this.leave = noop;
});
