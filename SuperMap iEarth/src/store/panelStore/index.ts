import { defineStore } from 'pinia'


export const usePanelStore = defineStore({
    id: 'usePanelStore',
    state: (): any => ({
        addDataPanel: "layer-service-box", // 添加数据弹窗
        analyse3dPanel: "analyse3d-ts-box", // 三维分析弹窗
        panelList: {
            leftToolBarList: [
                {
                    id: 1,
                    iconName: "icontuceng",
                    title: "图层列表",
                    isSelected: false,
                    panelName: "LayerList"
                },
                {
                    id: 2,
                    iconName: "icontianjia",
                    title: "添加数据",
                    isSelected: false,
                    panelName: "AddLayerData"
                },
            ],
            rightToolBarList: [
                {
                    id: 3,
                    iconName: "iconfenxi",
                    title: "三维分析",
                    isSelected: false,
                    panelName: "Analyse3D"
                },
                {
                    id: 4,
                    iconName: "iconliangsuan",
                    title: "量算",
                    isSelected: false,
                    panelName: "Measure"
                },
                {
                    id: 5,
                    iconName: "iconkapianshi",
                    title: "场景属性",
                    isSelected: false,
                    panelName: "SceneSet"
                },
                {
                    id: 6,
                    iconName: "iconhuizhi",
                    title: "对象绘制",
                    isSelected: false,
                    panelName: "ObjectPainting"
                },
            ]
        },
        rightTooPanel: false,
        leftTooPanel: false,
        showSceneModal: false,
        showSavePanel:false, // 保存面板是否显示
        isEditMode:false, // iportal中用来控制保存面板的与showSavePanel搭配使用，以便适应不同环境
        // isViewer:false, // Cesium.Viewer这个东西初始化完成的标志
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
            this.rightTooPanel = true;
            this.panelList.rightToolBarList.map((item) => {
                if (item.id == iconItem.id) {
                    item.isSelected = true;
                } else {
                    item.isSelected = false;
                }
            })

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
        // 设置保存场景弹窗
        setSceneModal(isShow: Boolean) {
            this.showSceneModal = isShow;
        }
    }
})











