// 添加S3MInstance模型：支持点、线、面三种添加方式
class AddSymbol {
    constructor(viewer, options) {
        this.viewer = viewer;
        this.init(options);
        this.updateOptionsParams(options);
    }

    //初始化
    init(params={}) {
        this.checkInstanceCollection(); // 检查this.instanceCollection是否完备

        this.emitter = new PolygonEmitter(); //区域粒子随机发射器，用于区域添加
        this.instanceCollection = null; // S3MInstanceCollection图层
        this.allModelUrls = []; // 所有模型的url，方便删除指定url的模型
        this.scaleRange = [1,1]; // 随机缩放：[1,1]默认关闭
        this.angleRange = [1,1]; // 随机角度：[1,1]默认关闭
        this.openRandomID = false; // 添加模型时是否开启随机instanceID（全局）（暂时用不上）
    }

    updateOptionsParams(options) {
        if (!options) return;
        if (options.scaleRange instanceof Array && options.scaleRange.length === 2) this.scaleRange = options.scaleRange;
        if (options.angleRange instanceof Array && options.angleRange.length === 2) this.angleRange = options.angleRange;
    }

    // 设置随机大小范围
    updateScaleRange(scaleRange){
        if (scaleRange instanceof Array && scaleRange.length === 2) this.scaleRange = scaleRange;
    };

    // 设置随机角度范围
    updateRotateRange(angleRange){
        if (angleRange instanceof Array && angleRange.length === 2) this.angleRange = angleRange;
    };

    // 从指定范围内获取随机数（小数）
    getRandomFromRange(range){
        if(!range) return 1; 
        if(range.length != 2) return 1; 
        const min = range[0];
        const max = range[1];
        return Math.random() * (max - min) + min;
    }

    // 检查instanceCollection是否存在，统一使用一个
    checkInstanceCollection(){
        if(!this.instanceCollection){
            viewer.scene.primitives._primitives.forEach(primitive => {
                if (primitive.customID && primitive.customID == "plantTree") {
                    this.instanceCollection = primitive;
                }
            })
        }
        if(!this.instanceCollection){
            this.instanceCollection = new SuperMap3D.S3MInstanceCollection(viewer.scene._context);
            this.instanceCollection.customID = 'plantTree';
            viewer.scene.primitives.add(this.instanceCollection);
        }
    }

    /**
      * 通过点方式添加符号
      * @param {string}     modelUrl   模型路径
      * @param {Cartesian3} position   添加位置坐标
      * @param {string}     instanceID 当前instance的ID，传入时有规范要求：'x-x-x-addSymbol'且不可重复（可选）,
      * 
      */
    addByPoint(modelUrl, position, instanceID=`point-${new Date().getTime()}-addSymbol`) {
        if(!modelUrl || !position) return; 
        if(!(position instanceof SuperMap3D.Cartesian3)) return; // position必须为笛卡尔坐标
            
        if(!instanceID.includes('addSymbol') || instanceID.split('-').length < 3) return; // 不添加不符合规范的instanceID

        this.checkInstanceCollection();

        const randomScaleNumber = this.getRandomFromRange(this.scaleRange);
        const randomScale = new SuperMap3D.Cartesian3(randomScaleNumber,randomScaleNumber,randomScaleNumber);
        const randomRotateNumber  = this.getRandomFromRange(this.angleRange);
        const randomHpr = new SuperMap3D.HeadingPitchRoll(SuperMap3D.Math.toRadians(randomRotateNumber), 0, 0);

        const instanceOption = {
            id: instanceID,
            position: position,
            scale:randomScale,
            hpr:randomHpr
        }

        this.instanceCollection.add(modelUrl, instanceOption);

        // 删除sceneMode属性
        delete instanceOption.sceneMode; // 这里的sceneMode，是上面源代码add方法自己加上去的

        if (!this.allModelUrls.includes(modelUrl)) this.allModelUrls.push(modelUrl); //保存所有添加的路径

        return {
            url:modelUrl,
            options:instanceOption
        };
    }


    /**
      * 通过画线方式添加符号（沿线添加）
      * @param {string}        modelUrl      模型路径
      * @param {Cartesian3[]}  line          添加画线坐标数组
      * @param {number}        space         符号间间距
      * @param {number}        currentIndex  当前批次：传入时不可重复，未指定批次时，将使用时间戳（可选）
      * 
      */
    addByline(modelUrl, line, space=1, currentIndex=new Date().getTime()) {
        if (!modelUrl || !line || line.length < 2 ) return;

        const positions = [];
        for (let i = 1, j = line.length; i < j; i++) {
            const startPoint = line[i - 1];
            const endPoint = line[i];
            const distance = SuperMap3D.Cartesian3.distance(startPoint, endPoint)
            const count = getCount(parseInt(distance), space);
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

        const polylineOptionList = []

        return viewer.scene.clampToHeightMostDetailed(positions)
            .then((Cartesians) => {
                const key = `polyline-${currentIndex}`;
                for (let i = 0, j = Cartesians.length; i <= j; i++) {
                    const instanceID = `${key}-${i}-addSymbol`;
                    const instanceOption = this.addByPoint(modelUrl, Cartesians[i], instanceID);
                    if(instanceOption) polylineOptionList.push(instanceOption);
                }
                polylineOptionList.push(currentIndex);
                return polylineOptionList;
            });

        // 根据两点直接的距离和间距计算模型总数
        function getCount(distance, space) {
            return parseInt(distance / space) + 1; // 如果distance < space 返回1
        }
    }

    /**
  * 通过画面方式添加符号（区域添加）
  * @param {string[]}        modelUrl     模型路径,支持一个区域内添加多种模型
  * @param {Cartesian3[]}    positions    区域坐标数组
  * @param {number}          count        区域间添加符号总数
  * @param {number}          currentIndex 当前批次：传入时不可重复，未指定批次时，将使用时间戳（可选）
  * 
  */
    addByFace(modelUrl, positions, count=3, currentIndex=new Date().getTime()) {
        if (!modelUrl || !positions || positions.length < 3 || count < 1) return;
        if( !(modelUrl instanceof Array)) { // 如果直接传入路径（字符串），将其改为数组形式
            modelUrl = [modelUrl]
        } 
        
        this.emitter.initPolygonEmitter(positions);

        const polygonOptionList = []
        const key = `polygon-${currentIndex}`;
        for (let i = 0; i < count; i++) {
            const url = modelUrl.length == 1 ? modelUrl[0] : modelUrl[Math.floor((Math.random() * modelUrl.length))];
            const position = this.emitter.getOneRandomPosition();
            const instanceID = `${key}-${i}-addSymbol`;
            const instanceOption = this.addByPoint(url, position, instanceID);
            if(instanceOption) polygonOptionList.push(instanceOption);
        }

        polygonOptionList.push(currentIndex);

        return polygonOptionList;
    }

    /**
    * 销毁
    */
    destroy() {
        this.allModelUrls.forEach((url) => this.instanceCollection.removeCollection(url)); // 通过URL删除所有实例对象
        this.allModelUrls.length = 0;
        this.viewer.scene.primitives.remove(this.instanceCollection); // 直接删除这个实例化图层
        this.instanceCollection = null;
        this.scaleRange = [1,1]
        this.angleRange = [1,1]
    }
}

//根据一个面发射面内的某个随机点坐标，主要用于粒子发射也可以用于返回区域随机坐标
class PolygonEmitter {
    constructor() {
        this._positions = null;
        this.boundingSphere = null;
        this._geometry = null;
        this._triangleArrayByWeight = null;
    }
    initPolygonEmitter(positions) {
        this._positions = SuperMap3D.defaultValue(positions, [new SuperMap3D.Cartesian3(), new SuperMap3D.Cartesian3(), new SuperMap3D.Cartesian3()]);
        this.boundingSphere = SuperMap3D.BoundingSphere.fromPoints(positions);
        if (SuperMap3D.defaultValue(positions)) {
            const polygonGeometry = SuperMap3D.PolygonGeometry.fromPositions({
                positions: positions,
                perPositionHeight: true
            });
            this._geometry = SuperMap3D.PolygonGeometry.createGeometry(polygonGeometry);
            this._triangleArrayByWeight = this.initWeight(this._geometry);
        }
    }

    get positions() {
        return this._positions;
    };
    set positions(positions) {
        if (!SuperMap3D.defaultValue(positions)) {
            return;
        }
        this._positions = positions;
        const polygonGeometry = SuperMap3D.PolygonGeometry.fromPositions({
            positions: this._positions,
            perPositionHeight: true
        });
        this._geometry = SuperMap3D.PolygonGeometry.createGeometry(polygonGeometry);
        this._triangleArrayByWeight = this.initWeight(this._geometry);
        this.boundingSphere = SuperMap3D.BoundingSphere.fromPoints(positions);
    }


    initWeight(geometry) {
        const vertex0 = new SuperMap3D.Cartesian3();
        const vertex1 = new SuperMap3D.Cartesian3();
        const vertex2 = new SuperMap3D.Cartesian3();
        const indices = geometry.indices;
        const triangleCount = indices.length / 3;
        const vertices = geometry.attributes.position.values;
        const areaArray = [];
        let i, j;
        let totalArea = 0.0;
        for (i = 0; i < triangleCount; i++) {
            const vertexIndex0 = indices[i * 3];
            const vertexIndex1 = indices[i * 3 + 1];
            const vertexIndex2 = indices[i * 3 + 2];
            vertex0.x = vertices[vertexIndex0 * 3];
            vertex0.y = vertices[vertexIndex0 * 3 + 1];
            vertex0.z = vertices[vertexIndex0 * 3 + 2];

            vertex1.x = vertices[vertexIndex1 * 3];
            vertex1.y = vertices[vertexIndex1 * 3 + 1];
            vertex1.z = vertices[vertexIndex1 * 3 + 2];

            vertex2.x = vertices[vertexIndex2 * 3];
            vertex2.y = vertices[vertexIndex2 * 3 + 1];
            vertex2.z = vertices[vertexIndex2 * 3 + 2];
            const area = this.triangleArea(vertex0, vertex1, vertex2);
            totalArea += area;
            areaArray.push(area);
        }

        const weightArraySize = Math.max(100, triangleCount * 10);
        const triangleWeightArray = [];
        for (i = 0; i < triangleCount; i++) {
            let weight = Math.floor(areaArray[i] / totalArea * weightArraySize);
            weight = Math.max(1, weight);
            for (j = 0; j < weight; j++) {
                triangleWeightArray.push(i);
            }
        }
        return triangleWeightArray;
    }

    triangleArea(v0, v1, v2) {
        let scratchCartesian0 = new SuperMap3D.Cartesian3();
        let scratchCartesian1 = new SuperMap3D.Cartesian3();
        let scratchCartesian2 = new SuperMap3D.Cartesian3();
        scratchCartesian0 = SuperMap3D.Cartesian3.subtract(v1, v0, scratchCartesian0);
        scratchCartesian1 = SuperMap3D.Cartesian3.subtract(v2, v0, scratchCartesian1);
        scratchCartesian2 = SuperMap3D.Cartesian3.cross(scratchCartesian0, scratchCartesian1, scratchCartesian2);
        return 0.5 * SuperMap3D.Cartesian3.magnitude(scratchCartesian2);
    }

    randomVertex(r1, r2, A, B, C) {
        return (1 - Math.sqrt(r1)) * A + Math.sqrt(r1) * (1 - r2) * B + Math.sqrt(r1) * r2 * C;
    }

    getOneRandomPosition() {
        if (!SuperMap3D.defaultValue(this._geometry)) {
            return;
        }
        const indexInWeightArray = Math.floor(SuperMap3D.Math.randomBetween(0.0, this._triangleArrayByWeight.length));
        const triangleIndex = this._triangleArrayByWeight[indexInWeightArray];
        const vertexIndex0 = this._geometry.indices[triangleIndex * 3];
        const vertexIndex1 = this._geometry.indices[triangleIndex * 3 + 1];
        const vertexIndex2 = this._geometry.indices[triangleIndex * 3 + 2];
        const vertices = this._geometry.attributes.position.values;
        const vertex0X = vertices[vertexIndex0 * 3];
        const vertex0Y = vertices[vertexIndex0 * 3 + 1];
        const vertex0Z = vertices[vertexIndex0 * 3 + 2];

        const vertex1X = vertices[vertexIndex1 * 3];
        const vertex1Y = vertices[vertexIndex1 * 3 + 1];
        const vertex1Z = vertices[vertexIndex1 * 3 + 2];

        const vertex2X = vertices[vertexIndex2 * 3];
        const vertex2Y = vertices[vertexIndex2 * 3 + 1];
        const vertex2Z = vertices[vertexIndex2 * 3 + 2];

        const r1 = SuperMap3D.Math.randomBetween(0.0, 1.0);
        const r2 = SuperMap3D.Math.randomBetween(0.0, 1.0);
        const x = this.randomVertex(r1, r2, vertex0X, vertex1X, vertex2X);
        const y = this.randomVertex(r1, r2, vertex0Y, vertex1Y, vertex2Y);
        const z = this.randomVertex(r1, r2, vertex0Z, vertex1Z, vertex2Z);

        return SuperMap3D.Cartesian3.fromElements(x, y, z);
    };
}

export default AddSymbol;
