// 剖面封装类
class ProfileAnalysis {
    /**
       * Creates an instance of Roaming.
       * @param {*} viewer 需要传入
       * @param {*} options.echarts  需要传入
       * @param {*} options.entityUrl  需要传入
       * @param {*} options.show  可选，显隐容器
       * @memberof Roaming
       * @example
       * 
   */
    constructor(viewer, options) {
        this.viewer = viewer;
        this.echarts = options.echarts;
        this.entityUrl = options.entityUrl;
        this.entityPosition = null;
        this.entity = null;
        this.myChart = null;
        this.echarts_dom = null;
        // this.fa_dom = null;
        this.echarts_dom_show = options.show || false;
        this.clampedCartesians = [];
        this.LatAndLons = [];
    }

    //初始化echarts
    initEcharts() {
        this.getEchartsDom();
        // if (!this.echarts_dom_show) return;  //解决未显示容器就执行init的警告问题
        if (!this.myChart) {
            this.myChart = this.echarts.init(this.echarts_dom); //初始化echarts
            window.onresize = () => {
                this.myChart.resize(); //自适应屏幕
            };
        }
        this.myChart.setOption({
            title: {
                text: GlobalLang.Section,
                textStyle: {
                    fontSize: 15
                }
            },
            grid: {
                left: 30,
                right: 0,
                top: 30,
                bottom: 8
            },
            tooltip: {},
            xAxis: {
                show: true
            },
            yAxis: {
                show: true
            },
            series: [
                {
                    type: "line",
                    data: []
                }
            ]
        });
    }

    // 创建天际线二维echarts容器
    getEchartsDom() {
        if (this.echarts_dom) return;
        // this.echarts_dom = document.createElement("div");
        // this.fa_dom = document.getElementById("cesiumContainer");
        // this.echarts_dom.classList.add("echarts-profile");
        // this.fa_dom.appendChild(this.echarts_dom);

        this.echarts_dom = document.getElementById("echartsProfile");
    }

    /**
     * 执行剖面分析.
     * @param {Array} _positions 剖面分析绘制线的笛卡尔坐标数组
     * 
    */
    startProfile(_positions) {
        this.addLine(_positions);
        this.addEntity(_positions);
        this.clampedCartesians.length = 0;
        this.LatAndLons.length = 0;
        let positions = [];
        //折线实现
        for (let i = 1, j = _positions.length; i < j; i++) {
            let startPoint = _positions[i - 1];
            let endPoint = _positions[i];
            let dis = SuperMap3D.Cartesian3.distance(startPoint, endPoint)
            let count = getCount(parseInt(dis));
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

        // this.clampedCartesians = positions;
        // this.LatAndLons = CartesiantoDegreesObjs(positions);
        // this.setOptions();
      
        return new Promise((resolve, reject) => {
            this.viewer.scene
            .clampToHeightMostDetailed(positions)
            .then((clampedCartesians) => {
                    this.clampedCartesians = clampedCartesians;
                    this.LatAndLons = CartesiantoDegreesObjs(clampedCartesians);
                    this.setOptions();

                    // return Promise.resolve(true);
                    resolve(true);
            },(err)=>{
                console.log("剖面:",err)
            });
        })
    };

    /**
       * @param {Boolean} val 设置容器显隐
       * 
     */
    setEchartsShow(val) {
        this.echarts_dom_show = val;
        if (val) {
            this.echarts_dom.style.display = "block";
            if (!this.myChart) this.initEcharts();
            this.myChart.resize(); //自适应屏幕
            return;
        }
        this.echarts_dom.style.display = "none";
    }

    /**
       * @param {Array} positions 绘制剖面分析的线 笛卡尔坐标数组
       * 
     */
    addLine(positions) {
        this.clearEntities();
        this.viewer.entities.add({
            id: "polyline-profile",
            polyline: {
                // positions: SuperMap3D.Cartesian3.fromDegreesArrayHeights(position),
                positions: positions,
                width: 5,
                material: SuperMap3D.Color.fromCssColorString("rgb(250, 213, 6)"),
                clampToGround: true, //线贴地
            },
        });
    };

    /**
       * @param {Array} positions 更新交互图标 笛卡尔坐标数组
       * 
     */
    addEntity(positions) {
        if (this.entity || !SuperMap3D.defined(this.entityUrl)) return;
        this.entityPosition = positions[0];
        this.entity = viewer.entities.add({
            id: "location-profile",
            position: new SuperMap3D.CallbackProperty(() => {
                return this.entityPosition;
            }, false),
            billboard: {
                image: this.entityUrl,
                width: 30,
                height: 40,
                scaleByDistance: new SuperMap3D.NearFarScalar(10, 1.0, 2000, 0.6),
                eyeOffset: new SuperMap3D.Cartesian3(0, 1, -5)
            },
        });
    };

    // 设置echarts
    setOptions() {
        console.log("this.LatAndLons：",this.LatAndLons);
        this.myChart.clear();
        let option = {
            title: {
                text: GlobalLang.Section,
                textStyle: {
                    fontSize: 15,
                    color: '#CAE6FF'
                },
                top: '3%',
                left:'3%', 
            },
            // 定位
            grid: {
                top: '20%',
                left: '3%',
                right: '3%',
                bottom: '6%',
                containLabel: true
            },
            axisLabel: {// 设置坐标轴字的颜色
               color: 'color: rgba(255, 255, 255, 0.85);'
            },
            backgroundColor: "#000817",
            tooltip: {
                trigger: "axis",
                backgroundColor: "#fff",
                textStyle: {
                    color: "#000",
                },
                formatter: (param) => {
                    let index = param[0].dataIndex;
                    this.entityPosition = this.clampedCartesians[index];
                    return [
                        "当前位置: " + '<hr size=1 style="margin: 3px 0">',
                        "经度: " +
                        this.LatAndLons[index].longitude.toFixed(6) +
                        "<br/>",
                        "纬度: " +
                        this.LatAndLons[index].latitude.toFixed(6) +
                        "<br/>",
                        "海拔: " +
                        this.LatAndLons[index].height.toFixed(2) +
                        "米" +
                        "<br/>",
                    ].join("");
                },
            },
            toolbox: {
                show: true,
                feature: {
                //   restore: {
                //     title:'刷新'
                //   },
                  saveAsImage: {
                    title:"下载"
                  }
                },
                right: "3%",
                iconStyle: {
                    borderColor: "#fff",  // 图标默认颜色
                  },
              },
            xAxis: {
                data: this.LatAndLons.map((item, index) => {
                    return index;
                }),
                show: true,
            },
            yAxis: {
                min: function (value) {
                    return value.min < 20 ? 0 : Math.floor(value.min);
                },
                axisLabel: {
                    interval: "auto",
                    formatter: function (value, index) {
                        return value > 999
                            ? (value / 1000).toFixed(2) + "km"
                            : value + "m";
                    },
                },
                splitLine: {
                    show: true,
                },
            },
            dataZoom: [
                {
                    type: "inside",
                    xAxisIndex: 0,
                    filterMode: "filter",
                    start: 0,
                    end: 100,
                },
            ],
            series: {
                name: "height",
                type: "line",
                data: this.LatAndLons.map(function (item) {
                    return item.height;
                }),
                areaStyle: {
                opacity: 0
                },
                lineStyle: {
                    color: '#3499E5'
                },
                showSymbol: false
            },
        };
        this.myChart.setOption(option);
    }

    /**
       * 清除分析
       */
    clearEntities() {
        this.viewer.entities.removeById('location-profile');
        this.viewer.entities.removeById('polyline-profile');
        this.entity = null;
    }

    clear() {
        this.clearEntities();
        if (this.myChart) this.myChart.clear();
        this.initEcharts();
    }

    /**
    * 销毁
    */
    destroy() {
        if (this.myChart) this.myChart.dispose();
        this.entityPosition = null;
        this.entity = null;
        // this.fa_dom.removeChild(this.echarts_dom);
        this.echarts_dom.style.display = 'none';
        // this.fa_dom = null;
    }
}

//精度计算count插值
function getCount(distance) {
    let count = 0;
    if (distance / 10000 > 1) {
        count = parseInt(distance / 100)    //  (>10000)  100m
    } else if (distance / 1000 > 5) {
        count = parseInt(distance / 10)    // (5000-10000)  10m
    } else if (distance / 1000 > 2) {
        count = parseInt(distance / 5)     // (2000-5000)  5m
    } else if (distance / 1000 > 1) {
        count = parseInt(distance / 2)     // (1000-2000)  2m
    } else if (distance / 100 > 5) {
        count = parseInt(distance / 1.5)   //  (500-1000) 1.5m
    } else if (distance / 100 > 2) {
        count = distance                  // (200-500) 1m 
    } else {
        count = distance * 2              //   (<200) 0.5m
    }
    return count;
}

//笛卡尔转经纬度(每个点是独立的对象)
function CartesiantoDegreesObjs(Cartesians) {
    let array = [].concat(Cartesians);
    let positions = [];
    for (let i = 0, len = array.length; i < len; i++) {
        let cartographic = SuperMap3D.Cartographic.fromCartesian(array[i]);
        let obj = {
            longitude: SuperMap3D.Math.toDegrees(cartographic.longitude),
            latitude: SuperMap3D.Math.toDegrees(cartographic.latitude),
            height: cartographic.height
        };
        positions.push(obj);
    }
    return positions
}


export default ProfileAnalysis
