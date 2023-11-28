import { getRootUrl } from "@/tools/iportal/portalTools";

function getIPortalSceneInfo() {
    return new Promise((resolve, reject) => {
        let url = window.location.href;
        if (url.indexOf("id=") != -1) {
            let openExistSceneUrl = window.location.href;
            let parmeter = openExistSceneUrl.split("id=")[1];
            let sceneID = parmeter.split("&")[0];
          
            let url = getRootUrl() + "web/scenes/" + sceneID + ".json";
          
            window.axios
              .get(url, { withCredentials: true })
              .then(function (response) {
                let content = JSON.parse(response.data.content);
                console.log("content-已保存-获取场景信息：",content);
                if(content.environmentState && content.environmentState.sceneMode){
                    resolve(Number(content.environmentState.sceneMode));
                }else{
                    resolve(3);
                }
              })
              .catch(function (error) {
                console.log(error);
                // reject(-1);
                reject(3);
              });
        } else {
            // 普通模式
            resolve(3);
        }
    })
}

export default getIPortalSceneInfo;