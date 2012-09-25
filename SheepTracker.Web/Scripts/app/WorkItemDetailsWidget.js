define(['dojo/_base/declare', 'dojo/dom-style',
     'dijit/_WidgetBase', 'dijit/_TemplatedMixin', 'dijit/_WidgetsInTemplateMixin', 'dojo/text!./templates/WorkItemDetailsWidget.html',
    'dojox/mvc/Output'],
    function (declare, domStyle,
    _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, template) {
        declare("app.WorkItemDetailsWidget", [_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
            templateString: template,

            // Attach Points
            _lbTitle: null,
            _lbDescription: null,
            
            showWorkItem: function (workItem) {
                if (workItem) {
                    domStyle.set(this.domNode, {display: "block"});
                    this._lbTitle.set("value", workItem.Title);
                }
                else {
                    domStyle.set(this.domNode, { display: "none" });
                }
            }
        });
});