define(['dojo/_base/xhr', './AsyncSubject'], function (xhr, AsyncSubject) {
    return dojo.mixin(xhr, {
        getAsObservable: function (options) {
            var subject = new AsyncSubject();
            options.load = function(data) {
                subject.onNext(data);
                subject.onCompleted();
            };
            options.error = function(error) {
                subject.onError(error);
            };
            xhrGet(options);
            return subject;
        },
        postAsObservable: function (options) {
            var subject = new AsyncSubject();
            options.load = function (data) {
                subject.onNext(data);
                subject.onCompleted();
            };
            options.error = function (error) {
                subject.onError(error);
            };
            xhrPost(options);
            return subject;
        },
        deleteAsObservable: function (options) {
            var subject = new asyncSubject();
            options.load = function (data) {
                subject.onNext(data);
                subject.onCompleted();
            };
            options.error = function (error) {
                subject.onError(error);
            };
            xhrDelete(options);
            return subject;
        }
    });
});