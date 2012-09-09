define(['dojo/_base/lang', 'dojo/_base/Deferred'],
    function (lang, Deferred) {
        var rx = lang.mixin(window.Rx, {
            watch: function (stateful, propertyName) {
                return Rx.Observable.create(function (observer) {
                    var handler = function (eventObject) {
                        observer.onNext(eventObject);
                    },
                    handle = stateful.watch(propertyName, handler);
                    return function () {
                        dojo.disconnect(handle);
                    };
                });
            }
        });
        
        lang.extend(Deferred, {
            asObservable: function () {
                var subject = new rx.AsyncSubject();
                this.then(function (value) {
                    subject.onNext(value);
                    subject.onCompleted();
                },
                    function (error) {
                        subject.onError(error);
                    });
                return subject;
            }
        });

        return rx;

});