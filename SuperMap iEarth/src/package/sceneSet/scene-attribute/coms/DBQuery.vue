<template></template>
  
<script lang="ts" setup>
import { onMounted, onBeforeUnmount } from "vue";
import CustomBubble from "@/lib/CustomBubble";

const viewer = window.viewer;
const customBubble = new CustomBubble(viewer,{
    bubbleFields: window.iEarthBindData.bubbleFields
});
customBubble.start();

let handler = new SuperMap3D.ScreenSpaceEventHandler(viewer.scene.canvas);

onMounted(() => {
    window["$message"].success($t('openDBTip'));
    startDBQuery(); // 隐藏面板，开启DB属性查询
})

onBeforeUnmount(() => {
    clearHandler(false);
    customBubble.destroy();
});

// 开启属性查询
function startDBQuery() {
    // 左键点击DB查询属性数据,右键关闭销毁查询
    handler.setInputAction(updateScenePosition, SuperMap3D.ScreenSpaceEventType.LEFT_CLICK);
    handler.setInputAction(clearHandler, SuperMap3D.ScreenSpaceEventType.RIGHT_CLICK);

}

// 基于当前点击位置计算弹窗position
async function updateScenePosition(e: any) {
    // 执行DB查询并计算弹窗table-data
    await viewer.scene.pickAsync(e.position);
    const layer = viewer.scene.layers.getSelectedLayer();
    if (layer) {
        const ids = layer.getSelection();
        console.log('DB当前查询ID:', ids);
        layer.getAttributesById(ids).then(function (data) {
            console.log("DB属性查询结果:", data); // 根据SMID查询对象属性，取data.UniqueID
            if (data) {
                let rowsContent: any = [];
                for (let key in data) {
                    let value = String(data[key]);
                    if (value.includes(".")) {
                        let value_num = Number(value);
                        if(!isNaN(value_num)){
                            value = value_num.toFixed(2);
                        }
                    }
                    let array = [key, value];
                    rowsContent.push(array);
                }

                customBubble.open({
                    title: `模型ID:${ids[0]}`,
                    content: [
                        {
                            type: 'table', data: {
                                headers: ['字段', '值'],
                                rows: rowsContent
                            }
                        }
                    ]
                });
            } else {
                 customBubble.hidden();
                window["$message"].success($t("noData"));
            }
        })
    } else {
        customBubble.hidden();
        window["$message"].success($t("noData"));
    }
}

// 清除关闭监听事件
function clearHandler(showMessage: boolean = true) {
    if (showMessage) window["$message"].success($t('closeDBtip'));
    if (handler) {
        handler.removeInputAction(SuperMap3D.ScreenSpaceEventType.LEFT_CLICK);
        handler.removeInputAction(SuperMap3D.ScreenSpaceEventType.RIGHT_CLICK);
        handler.destroy();
        handler = null;
    }
}


</script>
  