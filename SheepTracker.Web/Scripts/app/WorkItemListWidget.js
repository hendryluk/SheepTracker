define(['dojo/_base/declare', 'dijit/_WidgetBase', 'dijit/_TemplatedMixin', 'dijit/_WidgetsInTemplateMixin', 'dojo/text!./templates/WorkItemListWidget.html',
        'dojorx/Observable', 'dojox/mvc', 'dojox/rpc/Rest', 'dojorx',
        'dojox/mvc/Group', 'dijit/form/TextBox', 'dojox/mvc/Output', 'dojox/mvc/Repeat', 'dojox/mvc/at'],
    function (declare, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, template,
        Observable, mvc, Rest, rx) {
        return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
            templateString: template,
            constructor: function () {
                this.model = mvc.newStatefulModel({
                    data: {searchResults: [{a: 'ccc'}], searchTerms: "123"}
                });
            },
            postCreate: function () {
                var searchRest = new Rest("api/WorkItems", true);
                //this.txSearch.watch('value', dojo.hitch(this, function () { alert(this.model.searchTerms); }));

                //this.model.searchTerms.watch(dojo.hitch(this, function () {
                //    debugger; alert(this.model.searchTerms); }));
                //this.model.watch("searchTerms", function () { alert('aaa'); });
                //this.model.searchTerms.set('value', 'aaa');

                //this.model.searchTerms.set('type', 'submit');

                //this.model.searchTerms.set([mvc.newStatefulModel({ a: "vvv" })]);
                //this.model.searchResults.add(1, mvc.newStatefulModel({ data: { a: "vvv" } }));
                //this.model.searchResults.set([mvc.newStatefulModel({ data: { a: "vvv" } })]);
                this.model.searchResults.set([mvc.newStatefulModel({ data: { a: "vvv" } })]);


                rx.watch(this.model.searchTerms, 'value')
                    .throttle(200)
                    .select(dojo.hitch(this, function () {
                        return this.txSearch.value;
                    }))
                    .distinctUntilChanged()
                    .where(function (q) { return q.length > 0; })
                    .select(function (searchText) {
                        return searchRest({ q: searchText, pageSize: 10, pageIndex: 0 }).asObservable();
                    })
                    .switchLatest()
                    .subscribe(dojo.hitch(this, function (data) {
                        var result = this.model.searchResults;
                        debugger;
                        this.model.searchResults.set([mvc.newStatefulModel({ data: { a: "bbb" } })]);
                        debugger;

                        //this.model.searchResults.set("data", mvc.newStatefulModel({ data: data }));
                        //this.model.searchResults.add(1, mvc.newStatefulModel({data: data[0]}));
                        //this.model.set("searchResults", mvc.newStatefulModel({data: data}));
                    }));
            }
        });
});