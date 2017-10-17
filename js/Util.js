define([],function(){
    var Util = {
        showErrorMsg : function(msg){
            if($('#errorPannel').hasClass('errorPannelVisible')){
                $('#errorPannel').removeClass('errorPannelVisible');
                $('#errorPannel').text(msg);
                $('#errorPannel').addClass('errorPannelVisible');
            }
            else{
                $('#errorPannel').addClass('errorPannelVisible');
                $('#errorPannel').text(msg);
            }
            setTimeout(function(){
                $('#errorPannel').removeClass('errorPannelVisible');
            },5000);
        },
        S3M_CACHE : {},
        IMAGERY_CACHE : {},
        TERRAIN_CACHE : {},
        SCPURL_SET : {}
    };
    return Util;
});