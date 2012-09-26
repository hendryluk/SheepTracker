define(['dojo/_base/declare', 'dojo/dom-style', 'dojo/dom-class',

        'dijit/_WidgetBase', 'dijit/_TemplatedMixin', 'dijit/_WidgetsInTemplateMixin', 'dojo/text!./templates/WorkItemListWidget.html',
        'dojox/mvc', 'dojox/rpc/Rest', 'dojorx',
    
        'dojo/NodeList-manipulate', 'dojo/NodeList-fx', 'dojo/NodeList-traverse',
        'dojox/mvc/Repeat',
        'dojox/mvc/Group',
        'dijit/form/TextBox',
        'dojox/mvc/Output',
        'dojox/mvc/WidgetList',
        './WorkItemListItemWidget'],
    function (declare, domStyle, domClass,
        _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, template,
        mvc, Rest, rx) {
        
        var workItemListWidget = declare("app.WorkItemListWidget", [_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
            baseClass: "WorkItemList",
            templateString: template,
            
            // Attach points
            _txSearch: null, 
            _createNewTask: null,
            
            searchTerms: "",
            searchResults: [],
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
            },
            select: function (node) {
                dojo.query(".selected").removeClass("selected");
                    
                dojo.addClass(node, "selected");
                
                var workItem=null;
                if(dojo.hasClass(node, "work-item"))
                    workItem = dijit.byNode(node).target;
                
                this.onSelectedWorkItem(workItem);
            },
            onSelectedWorkItem: function (workItem) { /* event */ }
        });

        
        function initKeyboardNavigation(self) {
            function selectDown() {
                var selectables = dojo.query(".selectable", self.domNode);
                var selected = selectables.filter(".selected")[0];
                var selectedIndex = selectables.indexOf(selected);

                if (selectedIndex < selectables.length - 1) {
                    self.select(selectables[selectedIndex + 1]);
                }
            }

            function selectUp() {
                var selectables = dojo.query(".selectable", self.domNode);
                var selected = selectables.filter(".selected")[0];
                var selectedIndex = selectables.indexOf(selected);

                if (selectedIndex > 0) {
                    self.select(selectables[selectedIndex - 1]);
                }
            }
            
            function selectRight(evt) {
                if (self._txSearch.textbox.selectionEnd < self.txSearch.value.length)
                    return;

                evt.preventDefault();
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
                dojo.addClass(self.domNode, "searching");
                var onCompleted = function () {
                    dojo.removeClass(self.domNode, "searching");
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
                if (!node.length)
                    node = dojo.query(".selectable:first-of-type", self.domNode);

                self.select(node[0]);
            }

            rx.watch(self.model, "workItems")
                .subscribe(setDefaultSelection);
            
            searchTermsObserved
                .throttle(300)
                .distinctUntilChanged()
                .where(function (q) { return q.length > 0; })
                .select(search)
                .switchLatest()
                .subscribe(function (data) {
                    self.model.set({ workItems: data });
                });

            rx.on(self.domNode, ".selectable-action:click").subscribe(function () { alert("aaaa"); });

            searchTermsObserved.subscribe(function (term) {
                domClass.toggle(self._createNewTask.domNode, "hide", term.length == 0);
            });
        }

        return workItemListWidget;
});