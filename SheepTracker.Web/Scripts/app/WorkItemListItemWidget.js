define(['dojo/_base/declare', 'dijit/_WidgetBase', 'dijit/_TemplatedMixin', 'dijit/_WidgetsInTemplateMixin', 'dojo/text!./templates/WorkItemListItemWidget.html',
        'dojox/mvc', 'dojorx',
        'dojox/mvc/Output'],
    function (declare, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, template,
        mvc, rx) {
        return declare("app.WorkItemListItemWidget", [_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
            templateString: template,
            viewDetails: function () {
                alert(this.model.a);
            },
            startup: function () {
                this.inherited(arguments);
                
            }
        });
});