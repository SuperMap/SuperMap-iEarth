define([], function () {
    var Util = {
        showErrorMsg: function (msg) {
            if ($('#errorPannel').hasClass('errorPannelVisible')) {
                $('#errorPannel').removeClass('errorPannelVisible');
                $('#errorPannel').text(msg);
                $('#errorPannel').addClass('errorPannelVisible');
            }
            else {
                $('#errorPannel').addClass('errorPannelVisible');
                $('#errorPannel').text(msg);
            }
            setTimeout(function () {
                $('#errorPannel').removeClass('errorPannelVisible');
            }, 5000);
        },
        S3M_CACHE: {},
        IMAGERY_CACHE: {},
        TERRAIN_CACHE: {},
        SCPURL_SET: {},
        /**
         * 进入全屏模式。目前并不是所有的浏览器都实现了无前缀版本的API（2018-12-10）
         */
        launchFullscreen: function (element) {
            if (element.requestFullscreen) {
                element.requestFullscreen();
            } else if (element.mozRequestFullScreen) {
                element.mozRequestFullScreen();
            } else if (element.msRequestFullscreen) {
                element.msRequestFullscreen();
            } else if (element.webkitRequestFullscreen) {
                element.webkitRequestFullscreen();
            }
        },
        /**
         * 退出全屏模式。兼容模式。
         */
        exitFullscreen: function () {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            }
        },
        s3mLayerUrlPattern: /^http(s?):\/\/\S+\/(realspace|iserver)\/services\/3D-\S+\/rest\/realspace\/datas\/\S+\/config$/, // S3M图层URL正则表达式
        imageryOrTerrainLayerUrlPattern: /^http(s?):\/\/\S+\/(realspace|iserver)\/services\/3D-\S+\/rest\/realspace\/datas((?!\/config).)*$/, // 影像或地形图层URL正则表达式
        sceneUrlPattern: /^http(s?):\/\/\S+\/(realspace|iserver)\/services\/3D-\S+\/rest\/realspace$/ // 场景URL正则表达式
    };
    return Util;
});