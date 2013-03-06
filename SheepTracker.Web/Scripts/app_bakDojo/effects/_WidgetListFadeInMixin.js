define(["dojo/_base/declare"],
    function(declare, fx) {
        return declare('app.effects._WidgetListFadeInMixin', null, {
            addChild: function (widget) {
                dojo.style(widget.domNode, "opacity", 0);
                this.inherited(arguments);
                dojo.fadeIn({ node: widget.domNode }).play();
           } 
        });
    });