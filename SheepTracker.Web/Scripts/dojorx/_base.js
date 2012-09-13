define(['dojo/_base/lang'],
    function (lang) {
        var rx = lang.delegate(window.Rx, (function () {
            function watch(stateful, propertyName) {
                var props = propertyName.split(".", 2);
                if (props.length > 1) {
                    return selectProperty(props[0])
                        .selectMany(function (child) { return watch(child, props[1]); });
                }

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

            function selectProperty(stateful, propertyName) {
                return watch(stateful, propertyName)
                    .select(function () { return stateful.get(propertyName); })
                    .startWith(stateful.get(propertyName));
            }
            
            function selectProperties(stateful, propertyNames) {
                var obs = Observable.fromArray([{ }]);
                for (var i in propertyNames) {
                    var prop = propertyNames[i];
                    obs = obs.combineLatest(selectProperty(stateful, prop), function (a, b) {
                        a[prop] = b;
                        return obj;
                    });
                }
                return obs;
            }
            
            function deriveProperties(stateful, targetName, sourcePropertyNames, selector) {
                return selectProperties(stateful, sourcePropertyNames)
                    .select(selector)
                    .bindToStateful(stateful, targetName);
            }
            
            function on(dojoObject, eventType) {
                return Rx.Observable.create(function(observer) {
                    var handler = function(eventObject) {
                        observer.onNext(eventObject);
                    },
                        handle = dojo.connect(dojoObject, eventType, handler);
                    return function() {
                        handle.remove();
                    };
                });
            }

            return {
                watch: watch,
                selectProperty: selectProperty,
                selectProperties: selectProperties,
                deriveProperties: deriveProperties,
                on: on
            };
        })());

        return rx;

    });