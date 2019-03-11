(function (window) {
    "use strict";

    /**
     * 定义SMIP变量。 SM=SuperMap，IP=iPortal
     */
    var SMIP = {
        VERSION: "7.1.2"
    };



    //AMD规范, for requirejs
    if(typeof define === "function" && define.amd) {
        define(function() {
            return SMIP;
        });
    } else {
        //window下全局变量
        window.SMIP = window.SMIP || SMIP;
    }

    /**
     * 实现图片选择后预览效果
     * fileElem - {DOMElement} 当前选择图片的input元素
     * imgElem - {DOMElement} 要实现预览的img元素
     * successed - {Function} 预览图片成功的回调函数
     * failed - {Function} 预览图片失败的回掉函数
     */
    SMIP.imagePreview = function(fileElem, imgElem, successed, failed) {
        var fileTypes = ["image/png", "image/jpg", "image/jpeg", "image/gif", "image/bmp"];
        var index = -1;
        if(!(fileElem instanceof HTMLInputElement)) {
            throw new TypeError(iPortal.Lang.Common.FILE.INVALID_INPUT);
        }
        if(!(imgElem instanceof HTMLImageElement)) {
            throw new TypeError(iPortal.Lang.Common.FILE.INVALID_IMAGE);
        }
        if(fileElem.files && fileElem.files.length === 0) {
            throw new Error(iPortal.Lang.Common.FILE.FILE_EMPTY);
        }

        if(fileElem.files && fileElem.files[0]) {
            if(fileTypes.indexOf(fileElem.files[0].type)) {
                index = fileTypes.indexOf(fileElem.files[0].type);
            } else {
                index = fileTypes.join(",").indexOf(fileElem.files[0].type);
            }
            if(index === -1) {
                throw new Error(iPortal.Lang.Common.FILE.FILE_TYPES);
            }
            imgElem.onerror = function() {
                imgElem.onload = null;
                imgElem.onerror = null;
                failed();
            };
            imgElem.onload = function() {
                imgElem.onload = null;
                imgElem.onerror = null;
                successed();
            }
            // if(imgElem.complete) {
            //     successed();
            // } else {
            //     imgElem.onload = function() {
            //         imgElem.onload = null;
            //         imgElem.onerror = null;
            //         successed();
            //     }
            // }
            if(window.FileReader) {
                var fileReader = new FileReader();
                fileReader.onload = function(e) {imgElem.src = e.target.result;};
                fileReader.readAsDataURL(fileElem.files[0]);
            } else {
                imgElem.src = window.URL.createObjectURL(fileElem.files[0]);
            }
        } else {
            fileElem.select();
            var imageSrc = document.selection.createRange().text;
            try {
                imgElem.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod=scale)";
                imgElem.filters.item("DXImageTransform.Microsoft.AlphaImageLoader").src = imageSrc;
                successed();
            } catch(e) {
                imgElem.style.filter = null;
                imgElem.src = null;
                failed();
            }
        }
    };

    /**
     * $.ajaxFileUpload获取的data,会用<pre>包裹json，这里删除<pre>
     */
    SMIP.getJsonStr = function(data){
        var start = data.indexOf(">");
        if(start != -1){
            var end = data.indexOf("<", start + 1);
            if(end != -1){
                data = data.substring(start + 1, end);
            }
        }
        return data;
    }
    /****自定义 文件上传按钮*********/
    SMIP.customFileBtn = {
        btnStatus : 'succ', //succ / fail / load
        success : function(id, fileName){
            this.btnStatus = 'succ';
            $("#"+id).attr("title",fileName);
            $("#"+id).siblings("div.custom-file-btn").addClass("verify-success").html(fileName);
        },
        fail : function(id, fileName, isClearSrc){
            this.btnStatus = 'fail';
            this.reset(id, fileName, isClearSrc);
        },
        loding: function(id){
            this.btnStatus = 'load';
            this.reset(id, '', false, iPortal.Lang.Common.UPLOADING);
        },
        reset: function(id, fileName, isClearSrc, btnTips){
            btnTips = btnTips || iPortal.Lang.Common.FILE_DEFAULT_TXT;
            isClearSrc && $("#"+id+"Img").attr("src","");
            $("#"+id).attr("title", fileName || '');
            $("#"+id).siblings("div.custom-file-btn").removeClass("verify-success").html(btnTips);
        }
    };
})(window);