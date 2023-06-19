import PolygonEmitter from './emitter'   //粒子随机发射功能，用于区域添加返回坐标

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
        this.s3mInstanceColc = new Cesium.S3MInstanceCollection(viewer.scene._context);
        viewer.scene.primitives.add(this.s3mInstanceColc);
        this.emitter = new PolygonEmitter(); //区域粒子随机发射器，用于区域添加
        this.color = Cesium.Color.fromCssColorString("#ffffff");
        this.selectedSymbol = null;
        this.allModelUrls = [];
    }

    /**
      * 更新可配置的内部参数
      * @param {object} options 配置项
      */
    updateOptionsParams(options) {
        if (!options) return;
        if (Cesium.defined(options.color)) this.color = options.color;
    }


    // 添加模型编辑器
    addModelEditor(model) {
        if (!Cesium.defined(model)) return;
        if (this.modelEditor) {
            this.modelEditor.setEditObject(model);
            this.modelEditor.activate();
            return;
        }
        this.modelEditor = new Cesium.ModelEditor({
            model: model,
            scene: this.viewer.scene,
            axesShow: {
                translation: true,
                rotation: true,
                scale: true
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
        if (!Cesium.defined(modelUrl) || !Cesium.defined(position)) return;
        if (!this.allModelUrls.includes(modelUrl)) this.allModelUrls.push(modelUrl); //保存所有添加的路径
        let id2 = 'symbol-' + new Date().getTime();
        this.s3mInstanceColc.add(modelUrl, {
            id: id || id2,
            position: position,
            color: this.color
        });
        let instance = this.s3mInstanceColc.getInstance(modelUrl, id2);
        return instance;
    }


    /**
      * 通过画线方式添加符号（沿线添加）
      * @param {string} modelUrl 模型路径
      * @param {array} line       添加画线坐标数组
      * @param {number} space       符号间间距
      * 
      */
    addByline(modelUrl, line, space) {
        if (!Cesium.defined(modelUrl) || !Cesium.defined(line)) return;
        let positions = [];
        for (let i = 1, j = line.length; i < j; i++) {
            let startPoint = line[i - 1];
            let endPoint = line[i];
            let d = Cesium.Cartesian3.distance(startPoint, endPoint)
            let count = getCount(parseInt(d), space);
            for (let i = 1, j = count; i <= j; i++) {
                positions.push(
                    Cesium.Cartesian3.lerp(
                        startPoint,
                        endPoint,
                        i / count,
                        new Cesium.Cartesian3()
                    )
                );
            }
        }
        viewer.scene.clampToHeightMostDetailed(positions)
            .then((Cartesians) => {
                for (let i = 0, j = Cartesians.length; i <= j; i++) {
                    let id = 'symbol-' + new Date().getTime() + i;
                    this.addByPoint(modelUrl, Cartesians[i], id);
                }
            });
        //精度计算count插值
        function getCount(distance, space) {
            let space2 = Cesium.defaultValue(space, 10);
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
        if (!Cesium.defined(modelUrl) || !Cesium.defined(positions) || positions.length < 3) return;
        this.emitter.initPolygonEmitter(positions);
        for (let i = 0; i < count; i++) {
            let p = this.emitter.getOneRandomPosition();
            let id = 'symbol-' + new Date().getTime() + i;
            this.addByPoint(modelUrl, p, id);
        }
    }

    // 设置符号颜色
    setSymbolColor(val) {
        if (typeof (val) === 'string') val = Cesium.Color.fromCssColorString(val);
        this.color = val;
        if (this.selectedSymbol) {
            let instance = this.selectedSymbol.primitive;
            let index = this.selectedSymbol.id;
            instance.updateColor(this.color, index);
        }
    }

    // 设置模型可编辑
    setModelEditor(symbol) {
        if (symbol && symbol.id && typeof (symbol.id) === 'string' && symbol.id.indexOf("symbol-") != -1) {
            if (this.selectedSymbol && this.selectedSymbol.id === symbol.id) return;
            this.selectedSymbol = symbol;
            this.addModelEditor(symbol.primitive);
        } else {
            this.selectedSymbol = null;
            if (this.modelEditor) this.modelEditor.deactivate();
        }
    }


    // 清除
    clear(modelUrl) {
        if (modelUrl) {
            if (this.selectedSymbol) this.s3mInstanceColc.removeInstance(modelUrl, this.selectedSymbol.id);
            else this.s3mInstanceColc.removeCollection(modelUrl);
        } else {
            this.allModelUrls.forEach((url) => this.s3mInstanceColc.removeCollection(url));
            this.allModelUrls.length = 0;
        }
        this.selectedSymbol = null;
        if (this.modelEditor) this.modelEditor.deactivate();
    }

    /**
    * 销毁
    */
    destroy() {
        this.clear();
        if (this.modelEditor) this.modelEditor.destroy();
        this.s3mInstanceColc = null;
        this.selectedSymbol = null;
    }
}

export default AddSymbol
