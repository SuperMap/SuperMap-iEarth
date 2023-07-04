// 阴影分析封装类
class ShadowQuery {
    /**
       * Creates an instance of Roaming.
       * @param {*} viewer 需要传入
       * @param {*} options.visibleColor  需要传入
       * @param {*} options.hiddenColor  需要传入
       * @param {*} options.lineWidth  可选，显隐容器
       * @memberof Roaming
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
        this.shadowQuery = new SuperMap3D.ShadowQueryPoints(viewer.scene);    //创建阴影查询对象
        this.s3mInstanceCollection = new SuperMap3D.S3MInstanceCollection(viewer.scene._context);
        viewer.scene.primitives.add(this.s3mInstanceCollection);
        this.timeInterval = 60; //时间间隔
        this.spacing = 10; //间距（米）
        this.bottomHeight = 1; //底部高程（米）
        this.extrudeHeight = 30; //拉伸高度（米）
        // this.shadowShow = false; //阴影显示
        this.shadowBodyShow = false; //阴影率体显示
        this.colorArr = initBoxColor(); //初始化体显示颜色
        this.shadowPoints = [];  //保存分析完成时的结果
        this.filterInterval = [0, 100]; //阴影率过滤数组，显示区间类的阴影率点
        this.shadowQuery.queryPointsEvent.addEventListener((data) => {  //分析完成回调
            this.shadowPoints = data;
            this.setBodyShow(this.shadowBodyShow);
        })
    }

    /**
      * 更新可配置的内部参数
      * @param {object} options 配置项
      */
    updateOptionsParams(options) {
        if (!options) return;
        if (SuperMap3D.defined(options.modelUrl)) {
            this.modelUrl = options.modelUrl;
            this.s3mInstanceCollection.setCullEnabled(options.modelUrl, true)//开启单面渲染
        };
        if (SuperMap3D.defined(options.timeInterval)) this.timeInterval = options.timeInterval;
        if (SuperMap3D.defined(options.spacing)) this.spacing = options.spacing;
        if (SuperMap3D.defined(options.bottomHeight)) this.bottomHeight = options.bottomHeight;
        if (SuperMap3D.defined(options.extrudeHeight)) this.extrudeHeight = options.extrudeHeight;
        if (SuperMap3D.defined(options.shadowBodyShow)) this.shadowBodyShow = options.shadowBodyShow;
    }

    setShadow(val) {
        this.viewer.shadows = val;
        let layers = viewer.scene.layers.layerQueue;
        for (let i = 0; i < layers.length; i++) {
            if (val) layers[i].shadowType = SuperMap3D.ShadowType.ALL;
            else layers[i].shadowType = SuperMap3D.ShadowType.NONE;
        }
    }


    /**
     * 开始执行分析
     * @param {Array} _positions 添加点的笛卡尔坐标
     * 
    */

    setshadowQuery(positions, startTime, endTime) {
        if (positions.length < 3) return;
        if (!this.viewer.shadows) return alert('viewer.shadows Should be true!');
        this.shadowQuery.spacing = this.spacing;
        this.shadowQuery.timeInterval = this.timeInterval;
        this.shadowQuery.startTime = startTime;
        this.shadowQuery.endTime = endTime;
        let pos = CartesiantoDegrees(positions);
        this.shadowQuery.qureyRegion({
            position: pos,
            bottom: this.bottomHeight,
            extend: this.extrudeHeight
        });
        this.shadowQuery.build();
    }

    //体显示
    setBodyShow(val) {
        this.shadowBodyShow = val;
        if (val) {
            let objs = [];
            if (this.shadowQuery._bottom < 0 || this.shadowPoints.length == 0) return;
            this.shadowQuery.isPointsVisible = false;  //隐藏点
            let boxWidth = Number(this.spacing - 0.5);
            for (let i = 0, j = this.shadowPoints.length; i < j; i++) {
                objs.push({
                    id: 'shadow_body_box-' + i,
                    position: this.shadowPoints[i].position,
                    color: getShadowRadioColor(this.shadowPoints[i].shadowRatio, this.colorArr),
                    scale: new SuperMap3D.Cartesian3(boxWidth, boxWidth, boxWidth)
                })
            };
            if (objs.length > 0) {
                this.s3mInstanceCollection.add(this.modelUrl, objs);
                this.setFilterBodyShow(this.filterInterval);
            }
            return;
        }
        this.shadowQuery.isPointsVisible = true;
        this.s3mInstanceCollection.removeCollection(this.modelUrl);
    };



    //过滤体显示
    setFilterBodyShow(arr) {
        this.filterInterval = arr;
        if (!this.shadowBodyShow) return;
        if (this.shadowQuery._bottom < 0 || this.shadowPoints.length == 0) return;
        for (let i = 0, j = this.shadowPoints.length; i < j; i++) {
            let Ratio = this.shadowPoints[i].shadowRatio * 100;
            let model = this.s3mInstanceCollection.getInstance(this.modelUrl, 'shadow_body_box-' + i);
            if (Ratio < arr[0] || Ratio > arr[1])
                if (model) model.visible = false
            else if (model) model.visible = true
        }
    }




    /**
   * 销毁
   */
    clear() {
        this.shadowQuery.clear();
        this.shadowPoints.length = 0;
        this.s3mInstanceCollection.removeCollection(this.modelUrl);
    }

    /**
    * 销毁
    */
    destroy() {
        this.clear();
        this.setShadow(false);
        this.shadowQuery.destroy();
        this.shadowQuery = undefined;
    }
}


//笛卡尔转经纬度
const CartesiantoDegrees = (Cartesians) => {
    let pos = SuperMap3D.arrayRemoveDuplicates(
        Cartesians,
        SuperMap3D.Cartesian3.equalsEpsilon
    );
    let array = [].concat(pos);
    let positions = [];
    for (let i = 0, len = array.length; i < len; i++) {
        let cartographic = SuperMap3D.Cartographic.fromCartesian(array[i]);
        let longitude = SuperMap3D.Math.toDegrees(cartographic.longitude);
        let latitude = SuperMap3D.Math.toDegrees(cartographic.latitude);
        positions.push(longitude);
        positions.push(latitude);
    }
    return positions
};



//初始化体显示颜色(根据采光率0-100设置对应颜色值)
function initBoxColor() {
    let color = ['#0000ff'];
    color = color.concat(gradientColors('#0000ff', '#00ffff', 20))
        .concat(gradientColors('#00ffff', '#00ff00', 20))
        .concat(gradientColors('#00ff00', '#ffff00', 20))
        .concat(gradientColors('#ffff00', '#ff7f00', 20))
        .concat(gradientColors('#ff7f00', '#ff0000', 20));
    return color;
}

//体显示获取颜色
function getShadowRadioColor(shadowRadio, colorArr) {
    let index = parseInt((shadowRadio * 100));
    let col = colorArr[index];
    return SuperMap3D.Color.fromCssColorString(col);
};

// 获取渐变色函数
function gradientColors(start, end, steps, gamma) {
    var i, j, ms, me, output = [], so = [];
    gamma = gamma || 1;
    var normalize = function (channel) {
        return Math.pow(channel / 255, gamma);
    };
    start = parseColor(start).map(normalize);
    end = parseColor(end).map(normalize);
    for (i = 0; i < steps; i++) {
        ms = i / (steps - 1);
        me = 1 - ms;
        for (j = 0; j < 3; j++) {
            so[j] = pad(Math.round(Math.pow(start[j] * me + end[j] * ms, 1 / gamma) * 255).toString(16));
        }
        output.push('#' + so.join(''));
    }
    return output;
    function parseColor(hexStr) {
        return hexStr.length === 4 ? hexStr.substr(1).split('').map(function (s) { return 0x11 * parseInt(s, 16); }) : [hexStr.substr(1, 2), hexStr.substr(3, 2), hexStr.substr(5, 2)].map(function (s) { return parseInt(s, 16); })
    };
    // zero-pad 1 digit to 2
    function pad(s) {
        return (s.length === 1) ? '0' + s : s;
    }
};

export default ShadowQuery
