import { defineStore } from 'pinia';
import { PanelNameEnum } from "@/enums/layerEnum";

export const usePanelStore = defineStore({
    id: 'usePanelStore',
    state: (): any => ({
        addDataPanel: "layer-service-box", // 添加数据弹窗
        analyse3dPanel: "analyse3d-ts-box", // 三维分析弹窗
        panelList: {
            leftToolBarList: [
                {
                    id: PanelNameEnum.LayerList,
                    iconName: "icontuceng",
                    title: "t_layerList",
                    isSelected: false,
                    panelName: "LayerList"
                },
                {
                    id: PanelNameEnum.AddData,
                    iconName: "icontianjia",
                    title: "t_addData",
                    isSelected: false,
                    panelName: "AddLayerData"
                },
            ],
            rightToolBarList: [
                {
                    id: PanelNameEnum.Analyse3D,
                    iconName: "iconsanweifenxi",
                    title: "analyseSeries",
                    isSelected: false,
                    panelName: "Analyse3D"
                },
                {
                    id: PanelNameEnum.Measure,
                    iconName: "iconliangsuan",
                    title: "measure",
                    isSelected: false,
                    panelName: "Measure"
                },
                {
                    id: PanelNameEnum.SceneSet,
                    iconName: "iconkapianshi",
                    title: "sceneProperties",
                    isSelected: false,
                    panelName: "SceneSet"
                },
                {
                    id: PanelNameEnum.ObjectPainting,
                    iconName: "iconduixianghuizhi",
                    title: "objectPainting",
                    isSelected: false,
                    panelName: "ObjectPainting"
                },
                {
                    id: PanelNameEnum.LayerOpration,
                    iconName: "iconhuizhi",
                    title: "layerOpration",
                    isSelected: false,
                    panelName: "layerOpration"
                },
                {
                    id: PanelNameEnum.LayerAttribute,
                    iconName: "iconhuizhi",
                    title: "layerAttribute",
                    isSelected: false,
                    panelName: "layerAttr"
                },
                {
                    id: PanelNameEnum.LayerStyle,
                    iconName: "iconhuizhi",
                    title: "layerStyle",
                    isSelected: false,
                    panelName: "layerStyle"
                },
                {
                    id: PanelNameEnum.LayerQuery,
                    iconName: "iconhuizhi",
                    title: "layerQuery",
                    isSelected: false,
                    panelName: "layerQuery"
                },
                {
                    id: PanelNameEnum.ImageMapQuery,
                    iconName: "iconhuizhi",
                    title: "mapQuery",
                    isSelected: false,
                    panelName: "mapQuery"
                },
                {
                    id: PanelNameEnum.QXSingle,
                    iconName: "iconhuizhi",
                    title: "qxSingle",
                    isSelected: false,
                    panelName: "qxSingle"
                },
                {
                    id: PanelNameEnum.ImageMapCover,
                    iconName: "iconhuizhi",
                    title: "mapCover",
                    isSelected: false,
                    panelName: "mapCover"
                },
                {
                    id: PanelNameEnum.MVTStyle,
                    iconName: "iconhuizhi",
                    title: "mvtStyle",
                    isSelected: false,
                    panelName: "mvtStyle"
                },
                {
                    id: PanelNameEnum.LayerTheme,
                    iconName: "iconhuizhi",
                    title: "thematicMap",
                    isSelected: false,
                    panelName: "thematicMap"
                },
            ]
        },
        rightTooPanel: false,
        leftTooPanel: false,
        showSavePanel: false, // 保存面板是否显示
        myDataPanleShow: false,// 我的数据面板
        isFold:false, // 面板是否处于折叠状态
    }),
    getters: {
    },
    actions: {
        // 设置左侧导航栏
        setLeftToolBarList(iconItem: any) {
            this.leftTooPanel = true;
            this.panelList.leftToolBarList.map((item) => {
                if (item.id == iconItem.id) {
                    item.isSelected = true;
                } else {
                    item.isSelected = false;
                }
            })
        },
        // 设置右侧导航栏
        setRightToolBarList(iconItem: any) {
            // 每次切换，先将所有面板关闭
            this.panelList.rightToolBarList.map((item: any) => {
                item.isSelected = false;
            })

            // 确保所有面板能全部刷新
            setTimeout(() => {
                this.isFold = false; // 取消面板的折叠状态
                this.rightTooPanel = true;
                this.panelList.rightToolBarList.map((item: any) => {
                    if (item.id == iconItem.id) {
                        item.isSelected = true;
                    } else {
                        item.isSelected = false;
                    }
                })
            }, 10)
        },
        // 关闭弹窗面板
        closeRightToolPanel(leftOrRght: any) {
            if (leftOrRght == 1) {
                this.leftTooPanel = false;
                this.panelList.leftToolBarList.map((item) => {
                    item.isSelected = false;
                })
            } else {
                this.rightTooPanel = false;
                this.panelList.rightToolBarList.map((item) => {
                    item.isSelected = false;
                })
            }
        },
    }
})