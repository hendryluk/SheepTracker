define(['dojo/_base/lang', './_base'], function (lang, rx) {
    var Observable = rx.Observable;

    lang.extend(Observable, {
        bindToStateful: function (stateful, attrName) {
            return this.subscribe(function(val) {
                stateful.set(attrName, val);
            });
        }
    });

    return Observable;
});
