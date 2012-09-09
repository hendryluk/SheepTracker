define(['dojo/_base/declare', 'dijit/_WidgetBase', 'dijit/_TemplatedMixin', 'dijit/_WidgetsInTemplateMixin', 'dojo/text!./templates/DashboardWidget.html',
    './WorkItemListWidget'],
    function (declare, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, template) {
        return declare("app.DashboardWidget", [_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
            templateString: template
        });
    });