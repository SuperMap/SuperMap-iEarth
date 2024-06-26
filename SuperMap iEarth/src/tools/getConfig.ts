import store from '@/store';
import { useLayerStore } from "@/store/layerStore/layer";
import { getRootUrl } from "@/tools/iportal/portalTools";

const configToken = window.configToken;
const layerStore = useLayerStore(store);

function getConfig() {

    return new Promise((resolve, reject) => {

        if (configToken.tiandituKey) {
            layerStore.configToken.TiandituToken = configToken.tiandituKey;
        }
        if (configToken.bingMapsKey) {
            layerStore.configToken.BingMapKey = configToken.bingMapsKey;
        }

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
                    } else {
                        resolve(layerStore.configToken);
                    }
                })
                .catch(function (error) {
                    console.log(error);
                    resolve(layerStore.configToken);
                });
        } else {
            // 普通模式
            resolve(layerStore.configToken);
        }
    })
}

export default getConfig;