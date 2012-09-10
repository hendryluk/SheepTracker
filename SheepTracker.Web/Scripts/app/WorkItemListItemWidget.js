define(['dojo/_base/declare', 'dijit/_WidgetBase', 'dijit/_TemplatedMixin', 'dijit/_WidgetsInTemplateMixin', 'dojo/text!./templates/WorkItemListItemWidget.html',
        'dojox/mvc', 'dojorx',
        'dojox/mvc/Output'],
    function (declare, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, template,
        mvc, rx) {
        return declare("app.WorkItemListItemWidget", [_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
            templateString: template,
            startup: function () {
                this.inherited(arguments);
                console.log("ITEM: " + this.item);
                this.model = mvc.getStateful(this.item);
            }
        });
});