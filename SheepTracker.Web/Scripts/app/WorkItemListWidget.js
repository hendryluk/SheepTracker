define(['dojo/_base/declare', 'dijit/_WidgetBase', 'dijit/_TemplatedMixin', 'dijit/_WidgetsInTemplateMixin', 'dojo/text!./templates/WorkItemListWidget.html',
        'dojox/mvc', 'dojox/rpc/Rest', 'dojorx',
    
        'dojox/mvc/Group',
        'dijit/form/TextBox',
        'dojox/mvc/Output',
        'dojox/mvc/WidgetList',
        './WorkItemListItemWidget'],
    function (declare, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, template,
        mvc, Rest, rx) {
        
        return declare("app.WorkItemListWidget", [_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
            templateString: template,
            constructor: function () {
                this.model = mvc.getStateful({
                    searchResults: [],
                    searchTerms: "123"
                });
            },
            searchRest: new Rest(dojo.getUrl("/api/WorkItems"), true),
            postCreate: function () {
                rx.watch(this.model, 'searchTerms')
                    .throttle(300)
                    .select(dojo.hitch(this, function () {
                        return this.model.searchTerms;
                    }))
                    .distinctUntilChanged()
                    .where(function (q) { return q.length > 0; })
                    .select(dojo.hitch(this,this._search))
                    .switchLatest()
                    .subscribe(dojo.hitch(this, function (data) {
                        this.model.set("searchResults", data);
                    }));
            },
            _search: function (searchText) {
                dojo.style(this.txSearch.textbox, "color", "red");
                var onCompleted = dojo.hitch(this, function() {
                    dojo.style(this.txSearch.textbox, { "color": "green" });
                });

                return this.searchRest({ q: searchText, pageSize: 10, pageIndex: 0 })
                    .asObservable()
                    .doAction({
                        onNext: function () { }, 
                        onError: onCompleted,
                        onCompleted: onCompleted
                    });
            }
        });
});