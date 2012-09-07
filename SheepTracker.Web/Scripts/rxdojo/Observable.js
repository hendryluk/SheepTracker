define (['dojo/_base/declare'], function (declare) {
    return declare([Rx.Observable], {
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
