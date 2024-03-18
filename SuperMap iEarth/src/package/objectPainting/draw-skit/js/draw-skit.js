import PolygonEmitter from './emitter';   //粒子随机发射功能，用于区域添加返回坐标

//添加符号类
class AddSymbol {
    /**
       * Creates an instance of Roaming.
       * @param {*} viewer 需要传入
       * @example
       * 
   */
    constructor(viewer, options) {
        this.viewer = viewer;
        this.init(viewer);
        this.updateOptionsParams(options);
    }

    //初始化
    init(viewer) {
        this.s3mInstanceColc = new SuperMap3D.S3MInstanceCollection(viewer.scene._context);
        viewer.scene.primitives.add(this.s3mInstanceColc);
        this.emitter = new PolygonEmitter(); //区域粒子随机发射器，用于区域添加
        this.color = SuperMap3D.Color.fromCssColorString("#ffffff");
        this.selectedSymbol = null;
        this.treeManage = {
            pointList: [],
            polylineItems: {},
            polygonItems: {}
        };
        this.polylineIndex = 1;
        this.polygonIndex = 1;
        this.allModelUrls = [];
    }

    /**
      * 更新可配置的内部参数
      * @param {object} options 配置项
      */
    updateOptionsParams(options) {
        if (!options) return;
        if (SuperMap3D.defined(options.color)) this.color = options.color;
    }


    // 添加模型编辑器
    addModelEditor(model) {
        if (!SuperMap3D.defined(model)) return;
        if (this.modelEditor) {
            this.modelEditor.setEditObject(model);
            this.modelEditor.activate();
            return;
        }
        this.modelEditor = new SuperMap3D.ModelEditor({
            model: model,
            scene: this.viewer.scene,
            axesShow: {
                translation: true,
                rotation: true,
                scale: false
            }
        });
        this.modelEditor.activate();
    }


    /**
      * 通过点方式添加符号
      * @param {string} modelUrl 模型路径
      * @param {object} position 添加位置坐标
      * @param {string} id       可选
      * 
      */
    addByPoint(modelUrl, position, id) {
        if (!SuperMap3D.defined(modelUrl) || !SuperMap3D.defined(position)) return;
        if (!this.allModelUrls.includes(modelUrl)) this.allModelUrls.push(modelUrl); //保存所有添加的路径
        let s3mID = '';
        if (!id) {
            s3mID = 'point-' + new Date().getTime() + '-addSymbol';
        } else {
            s3mID = id;
        }

        let option = {
            url: modelUrl,
            id: s3mID
        }

        this.s3mInstanceColc.add(option.url, {
            id: option.id,
            position: position,
            color: this.color
        });

        if (!id) {
            this.treeManage.pointList.push(option);
        }

        return option;
    }


    /**
      * 通过画线方式添加符号（沿线添加）
      * @param {string} modelUrl 模型路径
      * @param {array} line       添加画线坐标数组
      * @param {number} space       符号间间距
      * 
      */
    addByline(modelUrl, line, space) {
        if (!SuperMap3D.defined(modelUrl) || !SuperMap3D.defined(line)) return;
        let positions = [];
        for (let i = 1, j = line.length; i < j; i++) {
            let startPoint = line[i - 1];
            let endPoint = line[i];
            let d = SuperMap3D.Cartesian3.distance(startPoint, endPoint)
            let count = getCount(parseInt(d), space);
            for (let i = 1, j = count; i <= j; i++) {
                positions.push(
                    SuperMap3D.Cartesian3.lerp(
                        startPoint,
                        endPoint,
                        i / count,
                        new SuperMap3D.Cartesian3()
                    )
                );
            }
        }
        viewer.scene.clampToHeightMostDetailed(positions)
            .then((Cartesians) => {
                let polylineOptionList = []
                let key = `polylineItem_${this.polylineIndex}`;
                for (let i = 0, j = Cartesians.length; i <= j; i++) {
                    let id = key + '-' + new Date().getTime() + i + '-addSymbol';
                    let instanceOption = this.addByPoint(modelUrl, Cartesians[i], id);
                    polylineOptionList.push(instanceOption);
                }
                this.treeManage.polylineItems[key] = polylineOptionList;
                this.polylineIndex++;
            });
        //精度计算count插值
        function getCount(distance, space) {
            let space2 = SuperMap3D.defaultValue(space, 10);
            return parseInt(distance / space2) + 1
        }
    }

    /**
  * 通过画面方式添加符号（区域添加）
  * @param {string} modelUrl 模型路径
  * @param {array} positions       区域坐标数组
  * @param {number} count       区域间添加符号总数
  * 
  */
    addByFace(modelUrl, positions, count) {
        if (!SuperMap3D.defined(modelUrl) || !SuperMap3D.defined(positions) || positions.length < 3) return;
        this.emitter.initPolygonEmitter(positions);
        let polygonOptionList = []
        let key = `polygonItem_${this.polygonIndex}`;
        for (let i = 0; i < count; i++) {
            let p = this.emitter.getOneRandomPosition();
            let id = key + '-' + new Date().getTime() + i + '-addSymbol';

            let url;
            if (modelUrl.length == 1) {
                url = modelUrl[0];
            } else {
                url = modelUrl[Math.floor((Math.random() * modelUrl.length))];
            }

            let instanceOption = this.addByPoint(url, p, id);
            polygonOptionList.push(instanceOption);
        }
        this.treeManage.polygonItems[key] = polygonOptionList;
        this.polygonIndex++;
    }

    // 设置符号颜色
    setSymbolColor(val) {
        if (typeof (val) === 'string') val = SuperMap3D.Color.fromCssColorString(val);
        this.color = val;
        if (this.selectedSymbol) {
            let instance = this.selectedSymbol.primitive;
            let index = this.selectedSymbol.id;
            instance.updateColor(this.color, index);
        }
    }

    // 设置模型可编辑
    setModelEditor(symbol) {
        if (symbol && symbol.id && typeof (symbol.id) === 'string' && symbol.id.indexOf("addSymbol") != -1) {
            if (this.selectedSymbol && this.selectedSymbol.id === symbol.id) return;
            this.selectedSymbol = symbol;
            this.addModelEditor(symbol.primitive);
        } else {
            this.selectedSymbol = null;
            if (this.modelEditor) this.modelEditor.deactivate();
        }
    }

    // 关闭模型编辑框
    delModelEditor() {
        this.selectedSymbol = null;
        if (this.modelEditor) this.modelEditor.deactivate();
    }

    // // 设置选中的实体项目高亮 - 还未完成
    // setItemsHighlight(symbol){
    //     let instanceID = symbol.id;
    //     let key = instanceID.split('-')[0];
    //     if(key.includes('polyline')){
    //         this.treeManage.polylineItems[key].forEach((item) => {
    //             if(item && item.url && item.id){
    //                 let instance = this.s3mInstanceColc.getInstance(item.url, item.id);
    //                 instance.updateColor(new SuperMap3D.Color(255, 1, 1, 1),item.id)
    //                 // instance.updateScale(new SuperMap3D.Cartesian3(0, 0, 0), item.id);
    //             }
    //         })
    //     }else if(key.includes('polygon')){

    //     }
    // }

    // 清除
    clear(instanceID, delType) {
        if (!delType) return;
        if (delType == 2) {
            let key = instanceID.split('-')[0];
            if (key.includes('polyline')) {
                this.treeManage.polylineItems[key].forEach((item) => {
                    if (item && item.url && item.id) {
                        // this.s3mInstanceColc.removeInstance(item.url, item.id);
                        let instance = this.s3mInstanceColc.getInstance(item.url, item.id);
                        instance.updateScale(new SuperMap3D.Cartesian3(0, 0, 0), item.id);
                    }
                })
            } else if (key.includes('polygon')) {
                this.treeManage.polygonItems[key].forEach((item) => {
                    if (item && item.url && item.id) {
                        // this.s3mInstanceColc.removeInstance(item.url, item.id);
                        let instance = this.s3mInstanceColc.getInstance(item.url, item.id);
                        instance.updateScale(new SuperMap3D.Cartesian3(0, 0, 0), item.id);
                    }
                })
            } else {
                let itemList = this.treeManage.pointList.filter((element) => {
                    if (element && element.id) return element.id == instanceID
                })
                let item = itemList[0];
                if (item && item.url && item.id) {
                    // this.s3mInstanceColc.removeInstance(item.url, item.id);
                    let instance = this.s3mInstanceColc.getInstance(item.url, item.id);
                    instance.updateScale(new SuperMap3D.Cartesian3(0, 0, 0), item.id);
                }
            }
        } else {
            let key = instanceID.split('-')[0];
            if (key.includes('polyline')) {
                let itemList = this.treeManage.polylineItems[key].filter((element) => {
                    if (element && element.id) return element.id == instanceID
                })
                let item = itemList[0];
                if (item && item.url && item.id) {
                    // this.s3mInstanceColc.removeInstance(item.url, item.id);
                    let instance = this.s3mInstanceColc.getInstance(item.url, item.id);
                    instance.updateScale(new SuperMap3D.Cartesian3(0, 0, 0), item.id);
                }
            } else if (key.includes('polygon')) {
                let itemList = this.treeManage.polygonItems[key].filter((element) => {
                    if (element && element.id) return element.id == instanceID
                })
                let item = itemList[0];
                if (item && item.url && item.id) {
                    // this.s3mInstanceColc.removeInstance(item.url, item.id);
                    let instance = this.s3mInstanceColc.getInstance(item.url, item.id);
                    instance.updateScale(new SuperMap3D.Cartesian3(0, 0, 0), item.id);
                }
            } else {
                let itemList = this.treeManage.pointList.filter((element) => {
                    if (element && element.id) return element.id == instanceID
                })
                let item = itemList[0];
                if (item && item.url && item.id) {
                    // this.s3mInstanceColc.removeInstance(item.url, item.id);
                    let instance = this.s3mInstanceColc.getInstance(item.url, item.id);
                    instance.updateScale(new SuperMap3D.Cartesian3(0, 0, 0), item.id);
                }
            }

        }


        this.selectedSymbol = null;
        if (this.modelEditor) this.modelEditor.deactivate();
    }

    /**
    * 销毁
    */
    destroy() {
        // this.clear();
        this.treeManage = {
            pointList: [],
            polylineItems: {},
            polygonItems: {}
        };
        this.selectedSymbol = null;
        if (this.modelEditor) this.modelEditor.deactivate();
        this.allModelUrls.forEach((url) => this.s3mInstanceColc.removeCollection(url));
        this.allModelUrls.length = 0;
        if (this.modelEditor) this.modelEditor.destroy();
        this.s3mInstanceColc = null;
        this.selectedSymbol = null;
    }
}

export default AddSymbol;
