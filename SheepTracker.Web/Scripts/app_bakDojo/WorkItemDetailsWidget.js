define(['dojo/_base/declare', 'dojo/dom-style',
     'dijit/_WidgetBase', 'dijit/_TemplatedMixin', 'dijit/_WidgetsInTemplateMixin', 'dojo/text!./templates/WorkItemDetailsWidget.html',
    'dojox/mvc', 'dojox/rpc/Rest', 'dojorx',
    'dojox/mvc/Output'],
    function (declare, domStyle,
    _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, template,
        mvc) {
        declare("app.WorkItemDetailsWidget", [_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
            templateString: template,

            constructor: function () {
                this.model = mvc.getStateful({
                    title: "",
                    description: ""
                });
            },
            showWorkItem: function (workItem) {
                if (workItem) {
                    domStyle.set(this.domNode, {display: "block"});
                    this.model.set({title: workItem.Title});
                }
                else {
                    domStyle.set(this.domNode, { display: "none" });
                }
            }
        });
});