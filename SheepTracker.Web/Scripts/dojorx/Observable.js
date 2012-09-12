define(['dojo/_base/lang', './_base'], function (lang, rx) {
    var Observable = rx.Observable;

    lang.extend(Observable, {
        bindToStateful: function (stateful, attrName) {
            return this.subscribe(function(val) {
                stateful.set(attrName, val);
            });
        }
    });

    return lang.mixin(Observable, {
        fromDojoEvent: function(dojoObject, eventType, context, dontFix) {
            return Rx.Observable.create(function(observer) {
                var handler = function(eventObject) {
                    observer.onNext(eventObject);
                },
                    handle = dojo.connect(dojoObject, eventType, context, handler, dontFix);
                return function() {
                    dojo.disconnect(handle);
                };
            });
        }
    });
});
