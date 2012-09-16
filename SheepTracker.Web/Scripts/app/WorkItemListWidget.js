define(['dojo/_base/declare', 'dojo/dom-style',

        'dijit/_WidgetBase', 'dijit/_TemplatedMixin', 'dijit/_WidgetsInTemplateMixin', 'dojo/text!./templates/WorkItemListWidget.html',
        'dojox/mvc', 'dojox/rpc/Rest', 'dojorx',
    
        'dojox/mvc/Repeat',
        'dojox/mvc/Group',
        'dijit/form/TextBox',
        'dojox/mvc/Output',
        'dojox/mvc/WidgetList',
        './WorkItemListItemWidget'],
    function (declare, domStyle,
        _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, template,
        mvc, Rest, rx) {

        return declare("app.WorkItemListWidget", [_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
            baseClass: "WorkItemList",
            templateString: template,
            constructor: function () {
                this.searchRest = new Rest(getUrl("/api/WorkItems"), true);
                
                this.model = mvc.getStateful({
                    searchResults: [],
                    searchTerms: ""
                });
            },
            searchRest: null,
            postCreate: function () {
                this._searchTermsObserved = rx.selectProperty(this.model, 'searchTerms');

                this._searchTermsObserved
                    .throttle(300)
                    .distinctUntilChanged()
                    .where(function (q) { return q.length > 0; })
                    .select(dojo.hitch(this,this._search))
                    .switchLatest()
                    .subscribe(dojo.hitch(this, function (data) {
                        this.model.set("searchResults", data);
                        this._setDefaultSelection();
                    }));

                rx.on(this.domNode, ".selectable-action:click").subscribe(function () { alert("aaaa"); });
                rx.on(window, "keydown").subscribe(dojo.hitch(this, function (evt) {
                    switch(evt.keyCode) {
                        case dojo.keys.DOWN_ARROW:
                            evt.preventDefault();
                            this._selectDown();
                            break;
                        case dojo.keys.UP_ARROW:
                            evt.preventDefault();
                            this._selectUp();
                            break;
                    }
                }));
            },
            startup: function () {
                this.inherited(arguments);
                this._searchTermsObserved.subscribe(dojo.hitch(this, function (term) {
                    domStyle.set(this.searchResultsPanel, {display: (term.length > 0)?"block": "none"});
                }));
            },
            _selectDown: function() {
                var selectables = dojo.query(".selectable", this.domNode);
                var selected = selectables.filter(".selected")[0];
                var selectedIndex = selectables.indexOf(selected);
                
                if (selectedIndex < selectables.length - 1) {
                    dojo.removeClass(selected, "selected");
                    dojo.addClass(selectables[selectedIndex + 1], "selected");
                }
            },
            _selectUp: function () {
                var selectables = dojo.query(".selectable", this.domNode);
                var selected = selectables.filter(".selected")[0];
                var selectedIndex = selectables.indexOf(selected);

                if (selectedIndex > 0) {
                    dojo.removeClass(selected, "selected");
                    dojo.addClass(selectables[selectedIndex - 1], "selected");
                }
            },
            _setDefaultSelection: function () {
                dojo.query(".selected", this.domNode).removeClass("selected");

                var node = dojo.query(".selectable.work-item:first-of-type", this.domNode);
                if (node == null)
                    node = dojo.query(".selectable:first-of-type", this.domNode);

                dojo.addClass(node[0], "selected");
            },
            _search: function (searchText) {
                dojo.addClass(this.txSearch.domNode, "searching");
                var onCompleted = dojo.hitch(this, function() {
                    dojo.removeClass(this.txSearch.domNode, "searching");
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