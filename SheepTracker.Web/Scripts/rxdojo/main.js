define(['dojo/_base/lang', 'dojo/_base/Deferred', 'dojo/_base/io', './AsyncSubject'],
    function (lang, Deferred, AsyncSubject) {
        alert('aaa');
        lang.extend(Deferred, {
            asObservable: function () {
                var subject = new AyncSubject();
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
    
        lang.extend(Rx.AsyncSubject, {
            asDeferred: function () {
                var deferred = new dojo.Deferred();
                this.subscribe(function (value) {
                    deferred.callback(value);
                }, function (error) {
                    deferred.errback(error);
                });
                return deferred;
            }
        });
});