define(['dojo/_base/lang', './main'], function (lang, Rx) {
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
    
    return Rx.AsyncSubject;
});