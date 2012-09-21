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
        
        function initKeyboardNavigation(self) {
            function selectDown() {
                var selectables = dojo.query(".selectable", self.domNode);
                var selected = selectables.filter(".selected")[0];
                var selectedIndex = selectables.indexOf(selected);

                if (selectedIndex < selectables.length - 1) {
                    dojo.removeClass(selected, "selected");
                    dojo.addClass(selectables[selectedIndex + 1], "selected");
                }
            }

            function selectUp() {
                var selectables = dojo.query(".selectable", self.domNode);
                var selected = selectables.filter(".selected")[0];
                var selectedIndex = selectables.indexOf(selected);

                if (selectedIndex > 0) {
                    dojo.removeClass(selected, "selected");
                    dojo.addClass(selectables[selectedIndex - 1], "selected");
                }
            }
            
            function selectRight(evt) {
                if (self.txSearch.textbox.selectionEnd < self.txSearch.value.length)
                    return;

                evt.preventDefault();
                var selectedWidget = dijit.byNode(dojo.query(".selectable", self.domNode)[0]);
            }

            rx.on(window, "keydown")
                .subscribe(function (evt) {
                    switch (evt.keyCode) {
                        case dojo.keys.DOWN_ARROW:
                            evt.preventDefault();
                            selectDown();
                            break;
                        case dojo.keys.UP_ARROW:
                            evt.preventDefault();
                            selectUp();
                            break;
                        case dojo.keys.RIGHT_ARROW:
                            selectRight(evt);
                            break;
                    }
                });
        }
        
        function initSearch(self) {
            var searchRest = new Rest(getUrl("/api/WorkItems"), true);
            var searchTermsObserved = rx.selectProperty(self.model, 'searchTerms');

            function search(searchText) {
                dojo.addClass(self.txSearch.domNode, "searching");
                var onCompleted = function () {
                    dojo.removeClass(self.txSearch.domNode, "searching");
                };

                return searchRest({ q: searchText, pageSize: 10, pageIndex: 0 })
                    .asObservable()
                    .doAction({
                        onNext: function () { },
                        onError: onCompleted,
                        onCompleted: onCompleted
                    });
            }
            
            function setDefaultSelection() {
                dojo.query(".selected", self.domNode).removeClass("selected");

                var node = dojo.query(".selectable.work-item:first-of-type", self.domNode);
                if (node == null)
                    node = dojo.query(".selectable:first-of-type", self.domNode);

                dojo.addClass(node[0], "selected");
            }
            
            searchTermsObserved
                .throttle(300)
                .distinctUntilChanged()
                .where(function (q) { return q.length > 0; })
                .select(search)
                .switchLatest()
                .subscribe(function (data) {
                    self.model.set("searchResults", data);
                    setDefaultSelection();
                });

            rx.on(self.domNode, ".selectable-action:click").subscribe(function () { alert("aaaa"); });

            searchTermsObserved.subscribe(function (term) {
                domStyle.set(self.searchResultsPanel, { display: (term.length > 0) ? "block" : "none" });
            });
        }
        
        return declare("app.WorkItemListWidget", [_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
            baseClass: "WorkItemList",
            templateString: template,
            txSearch: null, // attach-point
            searchResultsPanel: null, // attach-point
            constructor: function () {
                
                this.model = mvc.getStateful({
                    searchResults: [],
                    searchTerms: ""
                });
            },
            startup: function () {
                this.inherited(arguments);
                initSearch(this);
                initKeyboardNavigation(this);
            }
        });
});