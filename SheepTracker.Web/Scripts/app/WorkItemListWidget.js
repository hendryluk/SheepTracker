define(['dojo/_base/declare', 'dojo/dom-style', 'dojo/dom-class',

        'dijit/_WidgetBase', 'dijit/_TemplatedMixin', 'dijit/_WidgetsInTemplateMixin', 'dojo/text!./templates/WorkItemListWidget.html',
        'dojox/mvc', 'dojox/rpc/Rest', 'dojorx', 'dijit/focus',
    
        'dojo/NodeList-manipulate', 'dojo/NodeList-fx', 'dojo/NodeList-traverse',
        'dojox/mvc/Repeat',
        'dojox/mvc/Group',
        'dijit/form/TextBox',
        'dojox/mvc/Output',
        'dojox/mvc/WidgetList'],
    function (declare, domStyle, domClass,
        _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, template,
        mvc, Rest, rx, focus) {
        
        var workItemListWidget = declare("app.WorkItemListWidget", [_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
            baseClass: "WorkItemList",
            templateString: template,
            
            // Attach points
            _txSearch: null, 
            _createNewTask: null,
            
            workItemRest: new Rest(getUrl("/api/WorkItems"), true),
            
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
                    
                var workItem = null;
                if (node) {
                    dojo.addClass(node, "selected");
                    if (dojo.hasClass(node, "work-item"))
                        workItem = dijit.byNode(node).target;
                }
                
                this.onSelectedWorkItem(workItem);
            },
            
            executeAction: function (node) {
                if (node == this._createNewTask.domNode) {
                    var name = this.model.searchTerms;
                    this.workItemRest.post({ name: name })
                        .then(dojo.hitch(this, function () {
                            dojo.addClass(node, "hide");
                            this.select(null);
                            this.onItemCreated(name);
                        }));
                }
            },
            
            // EVENTS
            onSelectedWorkItem: function (workItem) { },
            onItemCreated: function(name){}
        });

        
        function initKeyboardNavigation(self) {
            function selectDown() {
                var selectables = dojo.query(".selectable:not(.hide)", self.domNode);

                if (selectables.length) {
                    var selected = selectables.filter(".selected")[0];
                    var selectedIndex = selectables.indexOf(selected);

                    if (selectedIndex < selectables.length - 1) {
                        self.select(selectables[selectedIndex + 1]);
                    }
                }
            }

            function selectUp() {
                var selectables = dojo.query(".selectable:not(.hide)", self.domNode);

                if (selectables.length) {
                    var selected = selectables.filter(".selected")[0];
                    var selectedIndex = selectables.indexOf(selected);

                    if (selectedIndex > 0) {
                        self.select(selectables[selectedIndex - 1]);
                    }
                }
            }

            function selectRight(evt) {
                if (self._txSearch.textbox.selectionEnd < self._txSearch.value.length)
                    return;

                evt.preventDefault();
                var actions = dojo.query(".work-item.selected .action-list li", self.domNode);
                
                var selected = actions.filter(".selected");
                var index = selected.length ? actions.indexOf(selected[0]) + 1 : 0;

                if (index < actions.length) {
                    actions.removeClass("selected");
                    dojo.addClass(actions[index], "selected");
                    self._txSearch.textbox.blur();
                }
            }

            function selectLeft(evt) {
                var actions = dojo.query(".work-item.selected .action-list li", self.domNode);
                var selected = actions.filter(".selected");

                if (selected.length) {
                    evt.preventDefault();
                    actions.removeClass("selected");

                    var index = actions.indexOf(selected[0]) - 1;
                    if (index >= 0) {
                        dojo.addClass(actions[index], "selected");
                    }
                    else {
                        focus.focus(self._txSearch.textbox);
                    }
                }
            }

            rx.on(self._txSearch.textbox, "focus")
                .subscribe(function () {
                    dojo.query(".action-list li", self.domNode).removeClass("selected");
                });

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
                        case dojo.keys.LEFT_ARROW:
                            selectLeft(evt);
                            break;
                        case dojo.keys.ENTER:
                            self.executeAction(dojo.query(".selectable:not(.hide).selected", self.domNode)[0]);
                            break;
                        case dojo.keys.ESCAPE:
                            self.model.set({ searchTerms: "" });
                            break;
                        default:
                            focus.focus(self._txSearch.textbox);
                    }
                });
        }
        
        function initSearch(self) {
            function search(searchText) {
                dojo.addClass(self.domNode, "searching");
                var onCompleted = function () {
                    dojo.removeClass(self.domNode, "searching");
                };

                return self.workItemRest({ q: searchText, pageSize: 10, pageIndex: 0 })
                    .asObservable()
                    .doAction({
                        onNext: function () { },
                        onError: onCompleted,
                        onCompleted: onCompleted
                    });
            }
            
            function setDefaultSelection() {
                var node = dojo.query(".selectable.work-item:first-of-type", self.domNode);
                if (!node.length)
                    node = dojo.query(".selectable:first-of-type", self.domNode);

                self.select(node[0]);
            }

            var searchTermsObserved = rx.selectProperty(self.model, 'searchTerms');
            searchTermsObserved.subscribe(function (term) {
                domClass.toggle(self._createNewTask.domNode, "hide", term.length == 0);
            });

            rx.Observable.merge(null,
                searchTermsObserved
                    .throttle(600)
                    .distinctUntilChanged(),
                rx.on(self, "onItemCreated")
            ).select(search)
             .switchLatest()
             .subscribe(function (data) {
                 self.model.set({ workItems: data });
             });

            rx.watch(self.model, "workItems")
                .subscribe(setDefaultSelection);

            rx.on(self.domNode, ".selectable:click").subscribe(function (e) { self.select(e.target); });
            rx.on(self.domNode, ".selectable-action:click").subscribe(function () { alert("aaaa"); });
        }

        return workItemListWidget;
});