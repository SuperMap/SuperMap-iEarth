import store from '@/store';
import configToken from "@/../public/Resource/config/configToken.json"
import { useLayerStore } from "@/store/layerStore";
import { getRootUrl } from "@/tools/iportal/portalTools";

const layerStore = useLayerStore(store);

function getConfig() {

    return new Promise((resolve, reject) => {
        // 在iportal环境中，启动iportal处理程序
        if (location.href.indexOf('/iportal/apps') != -1) {
            let configTokenUrl = getRootUrl() + "apps/config.rjson";
            console.log("configTokenUrl:", configTokenUrl);

            window.axios
                .get(configTokenUrl, { withCredentials: true })
                .then(function (response) {
                    // console.log("获取配置:", response);
                    if (response.data && response.data.commonConfig) {
                        // let commonConfig = JSON.parse("{\"tiandituKey\":\"7933ae29d47bcf1440889ad983dbe0af\",\"googleMapsAPIKey\":\"\"}");

                        let commonConfig = JSON.parse(response.data.commonConfig);
                        // console.log("地图token在线配置-commonConfig:", commonConfig);
                        if (commonConfig.tiandituKey && commonConfig.tiandituKey != '') {
                            layerStore.configToken.TiandituToken = commonConfig.tiandituKey;
                        } else {
                            layerStore.configToken.TiandituToken = configToken.tiandituKey;
                        }

                        if (commonConfig.bingMapsKey && commonConfig.bingMapsKey != '') {
                            layerStore.configToken.BingMapKey = commonConfig.bingMapsKey;
                        } else {
                            layerStore.configToken.BingMapKey = configToken.bingMapsKey;
                        }
                        resolve(layerStore.configToken);
                    }
                })
                .catch(function (error) {
                    console.log(error);
                    reject('获取地图token配置信息失败');
                });
        } else {
            // 普通模式
            // console.log('地图token本地配置-json:', configToken);
            if (configToken.tiandituKey) {
                layerStore.configToken.TiandituToken = configToken.tiandituKey;
            }

            if (configToken.bingMapsKey) {
                layerStore.configToken.BingMapKey = configToken.bingMapsKey;
            }
            resolve(layerStore.configToken);
        }
    })


}

export default getConfig;