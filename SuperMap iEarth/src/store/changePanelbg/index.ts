import { defineStore } from 'pinia';

export const useChangePanelStore = defineStore({
    id: 'changePanelBg', // id必填，且需要唯一
    state: (): any => ({
        // 1:通视分析 2：可视域
        analyserPanel: "panle-box-ts"
    }),
    actions: {
        // 修改三维分析面板背景
        setAnalyserPanel(name: any) {
            // 通视分析
            if (name == "intervisibility") {
                this.analyserPanel = "panle-box-ts";
                // 可视域
            } else if (name == "viewableRange") {
                // this.analyserPanel = "panle-box-ksy";
                this.analyserPanel = "panle-box-yy";
            } else if (name == "shadowAnalysis") {
                // 阴影
                this.analyserPanel = "panle-box-yy";
            } else if (name == "profile") {
                // 剖面
                this.analyserPanel = "panle-box-yy";
            } else if (name == "skyline") {
                // 天际线
                this.analyserPanel = "panle-box-yy";
            } else if (name == "box") {
                // box裁剪
                this.analyserPanel = "panle-box-boxcj";
            } else if (name == "plane") {
                // 平面裁剪裁剪
                this.analyserPanel = "panle-box-boxcj";
            } else if (name == "cross") {
                // cross裁剪
                this.analyserPanel = "panle-box-crosscj";
            } else if (name == "polygon") {
                // 多边形裁剪
                this.analyserPanel = "panle-box-boxcj";
            } else if (name == "Terrain-operation") {
                // 地形操作
                this.analyserPanel = "panle-box-dxcj";
            } else if (name == "Inundation-analysis") {
                // 淹没分析
                this.analyserPanel = "panle-box-dxym";
            } else if (name == "Slope-aspect") {
                // 坡度坡向
                this.analyserPanel = "panle-box-dxdzx";
            } else if (name == "Isoline") {
                // 等值线
                this.analyserPanel = "panle-box-dxdzx";
            }

            // 场景属性
            if (name == "baseAttribute") {
                // 基本属性
                this.analyserPanel = "panle-box-cjsx-bg";
            } else if (name == "speciallyEffect") {
                // 飞行
                this.analyserPanel = "panle-box-cjsx-tx-cjfg";
            } else if (name == "ligth") {
                // 灯光
                this.analyserPanel = "panle-box-cjsx-dg-dgy";
            } else if (name == "viewPorts") {
                // 视口
                this.analyserPanel = "panle-box-cjsx-dg-dgy";
            } else if (name == "viewPorts") {
                // 特效
                this.analyserPanel = "panle-box-dxdzx";
            }

            // 特效
            if (name == "场景泛光") {
                // 场景泛光
                this.analyserPanel = "panle-box-cjsx-tx-cjfg";
            } else if (name == "扫描线") {
                // 扫描线
                this.analyserPanel = "panle-box-cjsx-tx-smx";
            } else if (name == "雨雪") {
                // 雨雪
                this.analyserPanel = "panle-box-cjsx-tx-yx";
            }

            // 灯光
            if (name == "点光源") {
                this.analyserPanel = "panle-box-cjsx-dg-dgy";
            } else if (name == "聚光灯") {
                // 扫描线
                this.analyserPanel = "panle-box-cjsx-tx-smx";
            } else if (name == "平行光") {
                // 扫描线
                this.analyserPanel = "panle-box-cjsx-tx-smx";
            }
        }
    }


});
