define(['dojo/_base/lang', './_base', 'dojo/_base/Deferred', './Observable', './AsyncSubject'],
    function (lang, rx, Deferred) {
         
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