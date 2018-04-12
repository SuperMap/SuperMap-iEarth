define(['./Container','jquery'],function(Container,$){
    var ErrorPannel = Container.extend({
        tagName : 'div',
        id : 'errorPannel',
        className : 'errorPannel',
        initialize : function(options){
        },
        render : function(){
            return this;
        },
        onThumbnailClk : function(){
            this.trigger('thumbClicked', this.model);
        }
    });
    return ErrorPannel;
});