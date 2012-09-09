define(['dojo/io/script', '../AsyncSubject'], function(script, AsyncSubject) {
    return declare([script], {
        getAsObservable: function (args) {
            var subject = new AsyncSubject();
            args.load = function (data) {
                subject.onNext(data);
                subject.onCompleted();
            };
            args.error = function (error) {
                subject.onError(error);
            };
            script.get(args);
            return subject;
        }
    });
})