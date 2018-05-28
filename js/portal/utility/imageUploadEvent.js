define([
    "utility/iportalUtility",
    "utility/imagePreview",
    "utility/fileupLoad"
],function(utility,SMIP){
    var imageUploadEvent = {};
    window.imageUploadEvent = imageUploadEvent;
    imageUploadEvent.inputFileChange = function(uploadImgInputId, imgElementId, resourceName) {
        $("input[type='file'][id='" + uploadImgInputId + "']").unbind("change").bind("change", function() {
            if(!$(this).val()){
                return;
            }
            if(isSizeOver(this)){
                utility.messageBox.warning(iPortal.Lang.Common.FILE.SIZE_OVER);
                return;
            };
            var resourceId = $(this).data("id");
            var fileName = $(this).val().match(/[^\\\/]+$/)[0];
            if (fileName.search("(.jpg|.JPG|.png|.PNG)$") < 1) {
                utility.messageBox.warning(iPortal.Lang.Common.FILE.FILE_TYPE_NO_MATCH);
                return;
            }
            SMIP.imagePreview(this, $("#" + imgElementId).get(0), function() {
                SMIP.customFileBtn.loding(uploadImgInputId);
                window.imageUploadEvent.ajaxFileUpload(uploadImgInputId, fileName, imgElementId, resourceId, resourceName);
            }, function() {
                SMIP.customFileBtn.fail(uploadImgInputId,iPortal.Lang.Common.FILE.FILE_EMPTY);
                utility.messageBox.danger(iPortal.Lang.Common.FILE.INVALID_IMAGE);
            });
        });
    }
    imageUploadEvent.ajaxFileUpload = function(uploadImgInputId, fileName, imgElementId, resourceId, resourceName){
        var fileUploadPathPostFix = "./resources/thumbnail/"+resourceName+"/temp/",
            uri = utility.getRootUrl() + "web/uploadfile.json",
            uploadFileName = uploadImgInputId + new Date().getTime() + "." + fileName.split(".")[1];
        uri += "?toFile=" + fileUploadPathPostFix +resourceId+"/"+ uploadFileName;
        $.ajaxFileUpload({
            url: uri,
            secureuri: false,
            fileElementId: uploadImgInputId,
            dataType: 'json',
            timeout: 60 * 60 * 1000,
            success: function (data) {
                SMIP.customFileBtn.success(uploadImgInputId,fileName);
                window.imageUploadEvent.inputFileChange(uploadImgInputId, imgElementId, resourceName);
                var jsonStr = SMIP.getJsonStr(data);
                var uploadFilePath = JSON.parse(jsonStr).filePath.substr(2);
                $("#" + imgElementId).attr("src", utility.getRootUrl() + uploadFilePath);
                $("#" + imgElementId).data("uploadFilePath", uploadFilePath);
            },
            error: function (data) {
                console.log(data);
            }
        });
    }
    imageUploadEvent.SMIP = SMIP;
    //验证上传图片大小是否超过限制
    function isSizeOver(img){
        var imgSize = img.files[0].size,
            maxSize = 150 * 1024;//图片单位为b, 1b = 1024kb, 限制图片大小为150kb

        return imgSize > maxSize? true: false;
    }
});