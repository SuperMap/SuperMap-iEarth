import { getRootUrl } from "@/tools/iportal/portalTools";

function getConfig() {
    return new Promise((resolve, reject) => {
        // 在iportal环境中，启动iportal处理程序
        if (location.href.indexOf('/iportal/apps') != -1) {
            let configTokenUrl = getRootUrl() + "apps/config.rjson";

            window.axios
                .get(configTokenUrl, { withCredentials: true })
                .then(function (response) {
                    if (response.data && response.data.commonConfig) {
                        // let commonConfig = JSON.parse("{\"tiandituKey\":\"7933ae29d47bcf1440889ad983dbe0af\",\"googleMapsAPIKey\":\"\"}");
                        let commonConfig = JSON.parse(response.data.commonConfig);
                        if (commonConfig.tiandituKey && commonConfig.tiandituKey != '') {
                            window.tokenConfig.tiandituKey = commonConfig.tiandituKey;
                        }

                        if (commonConfig.bingMapsKey && commonConfig.bingMapsKey != '') {
                            window.tokenConfig.bingMapsKey = commonConfig.bingMapsKey;
                        }
                        resolve(window.tokenConfig);
                    } else {
                        resolve(window.tokenConfig);
                    }
                })
                .catch(function (error) {
                    console.log(error);
                    resolve(window.tokenConfig);
                });
        } else {
            // 普通模式
            resolve(window.tokenConfig);
        }
    })
}

export default getConfig;