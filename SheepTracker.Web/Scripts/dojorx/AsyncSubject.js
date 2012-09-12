define(['dojo/_base/lang', './_base'], function (lang, rx) {
    lang.extend(rx.AsyncSubject, {
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