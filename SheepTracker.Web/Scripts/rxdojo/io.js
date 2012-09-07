define(['dojo/io.script', './AsyncSubject'], function(io, AsyncSubject) {
    return declare([io], {
        getAsObservable: function (args) {
            var subject = new AsyncSubject();
            args.load = function (data) {
                subject.onNext(data);
                subject.onCompleted();
            };
            args.error = function (error) {
                subject.onError(error);
            };
            dojo.io.script.get(args);
            return subject;
        }
    });
})