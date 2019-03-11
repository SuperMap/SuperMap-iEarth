define([
    "jquery"
], function ($) {
    return {
        /****
         * 服务端功能交互
         *
         * 参数
         * url
         * type: "GET"、"POST"
         * dataType: "xml"、"html"、"script"、"json"、"jsonp"
         * data: "POST" 传值参数
         * onSuccessed: 成功回调函数
         * onFailed: 失败回掉函数
         */
        sendRequest: function (url, type, dataType, data, onSuccessed, onFailed) {
            $.ajax({
                url: url,
                type: type,
                dataType: dataType,
                data: data,
                success: function (data, textStatus, xhr) {
                    onSuccessed(data, textStatus, xhr);
                },
                error: function (xhr, textStatus, errorThrown) {
                    try {
                        var msg = JSON.parse(xhr.responseText);
                        onFailed(msg);
                    } catch (e) {
                        onFailed(xhr, textStatus, errorThrown);
                    }
                }
            });
        }
    };
});