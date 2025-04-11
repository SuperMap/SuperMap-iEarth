class OpenSkitCollection {
  constructor(viewer, options) {
    this.viewer = viewer;
    this.init(options);
  }

  init(params={}) { }

  // 根据传入的小品列表，往场景中添加
  addSkitInstanceCollection(SkitInstanceCollection) {
    let treeDataHandled = this.handleTreeData(SkitInstanceCollection);
    treeDataHandled = this.modelMatrixTohprAndScale(treeDataHandled);
    let instanceCollection = this.createS3MInstanceCollection();

    this.addS3MInstances(treeDataHandled, instanceCollection);
    
    return Promise.resolve(treeDataHandled);
  }

  // 处理传入进来的小品列表数据，转换成符合iEarth规范的结构
  handleTreeData(SkitInstanceCollection) {
    const isEarthSave = false; // 转为矩阵存储前保存的JSON有该字段，后续保存的JSON剔除多余属性，只保留children结构
    const treeData = SkitInstanceCollection;

    if(!treeData.sceneMode) treeData.sceneMode = viewer.scene.mode;
    if (isEarthSave) { // 校验当前图层树是否存在空数组,如果有直接删除
      treeData.children.forEach((nodes) => { 
        if (nodes.label === '沿线添加') {
          nodes.children.forEach((polylineGroup) => {
            if (polylineGroup.children == 0) this.removeTargetOption(nodes, polylineGroup);
          })
        } else if (nodes.label === '区域添加') {
          nodes.children.forEach((polygonGroup) => {
            if (polygonGroup.children == 0) this.removeTargetOption(nodes, polygonGroup);
          })
        }
      })
    } else {  // 在改为矩阵存储的极简版JSON后，每个option的[key/label/type/instanceID]都基于实际所处的位置来遍历计算
      treeData.key = "0";
      treeData.children.forEach((nodes) => {
        if (nodes.label === '单个添加') {
          nodes.key = "1";
          nodes.children.forEach((pointItem, index) => {
            const currentIndex = index + 1; // 从1开始，避免出现0
            if (pointItem && pointItem.modelID && pointItem.options) {
              pointItem.key = `1-0-${currentIndex}`;
              pointItem.label = `point-${currentIndex}`;
              pointItem.type = "point";
              pointItem.options.id = `point-${currentIndex}-addSymbol`;
            } else {
              console.log('异常数据:', pointItem); // 剔除JSON中的异常数据
              this.removeTargetOption(nodes, pointItem);
            }
          })
        } else if (nodes.label === '沿线添加') {
          nodes.key = "2";
          nodes.children.forEach((polylineGroup, index) => {
            const currentIndex = index + 1;
            if (polylineGroup.children == 0) this.removeTargetOption(nodes, polylineGroup);
            polylineGroup.key = `2-${currentIndex}`;
            polylineGroup.label = `线集合-${currentIndex}`;
            polylineGroup.type = `polylineGroup`;
            polylineGroup.children.forEach((child, index_child) => {
              if (child && child.modelID && child.options) {
                const keySame = `${currentIndex}-${index_child}`;
                child.key = `2-${keySame}`;
                child.label = `line-${keySame}`;
                child.parentKey = `2-${currentIndex}`;
                child.type = "polyline";
                child.options.id = `polyline-${keySame}-addSymbol`;
              } else {
                console.log('异常数据:', child); // 剔除JSON中的异常数据
                this.removeTargetOption(polylineGroup, child);
              }
            })
          })
        } else if (nodes.label === '区域添加') {
          nodes.key = "3";
          nodes.children.forEach((polygonGroup, index) => {
            const currentIndex = index + 1;
            if (polygonGroup.children == 0) this.removeTargetOption(nodes, polygonGroup);
            polygonGroup.key = `3-${currentIndex}`;
            polygonGroup.label = `面集合-${currentIndex}`;
            polygonGroup.type = `polygonGroup`;
            polygonGroup.children.forEach((child, index_child) => {
              if (child && child.modelID && child.options) {
                const keySame = `${currentIndex}-${index_child}`;
                child.key = `3-${keySame}`;
                child.label = `face-${keySame}`;
                child.parentKey = `3-${currentIndex}`;
                child.type = "polygon";
                child.options.id = `polygon-${keySame}-addSymbol`;
              } else {
                console.log('异常数据:', child); // 剔除JSON中的异常数据
                this.removeTargetOption(polygonGroup, child);
              }
            })
          })
        }
      })
    }

    return treeData;
  }

  // 将模型矩阵分解成hpr和scale用来添加S3MInstance
  modelMatrixTohprAndScale(treeData){
    if(treeData && treeData.children){
      treeData.children.forEach(group => {
        group.children.forEach(item=>{
          if(item.children && item.children.length>0){
            item.children.forEach(element=>{
              computedHprAndScale(element, treeData);
            })
          }else{
            computedHprAndScale(item, treeData);
          }
        })
      });
    }

    return treeData;

    function computedHprAndScale(item, treeData){
      if(item && item.options && item.options.modelMatrix){
        let modelMatrix =  item.options.modelMatrix;
        if(modelMatrix instanceof Array){ // 矩阵存储为数组形式
          modelMatrix = SuperMap3D.Matrix4.fromArray(modelMatrix);
        }

        let scale = SuperMap3D.Matrix4.getScale(modelMatrix, new SuperMap3D.Cartesian3());

        let newMat4 = SuperMap3D.Matrix4.setScale(modelMatrix, new SuperMap3D.Cartesian3(1,1,1), new SuperMap3D.Matrix4());
        let rotationMatrix3 = SuperMap3D.Matrix4.getRotation(newMat4, new SuperMap3D.Matrix3());
        let rotationQuaternion = SuperMap3D.Quaternion.fromRotationMatrix(rotationMatrix3, new SuperMap3D.Quaternion());
        let hpr = SuperMap3D.HeadingPitchRoll.fromQuaternion(rotationQuaternion, new SuperMap3D.HeadingPitchRoll())

        item.options.scale = scale;
        item.options.hpr = hpr;

        // 经纬度转笛卡尔
        if(viewer.scene.mode ===  SuperMap3D.SceneMode.SCENE3D){
          const position = item.options.position;
          item.options.position = SuperMap3D.Cartesian3.fromDegrees(position.x, position.y, position.z);
        }

        // 处理modelID => url
        item.url = treeData.model[item.modelID];
        delete item.modelID;

        delete item.options.modelMatrix;
      }
    }

  }

  // 删除数组中指定option
  removeTargetOption(targetParent, targetOption) {
    targetParent.children.map((node, index) => {
      if (node.key == targetOption.key) {
        targetParent.children.splice(index, 1);
      }
    })
  }

  // 创建实例集合
  createS3MInstanceCollection() {
    let instanceCollection = undefined;

    // 首先从当前场景里面找是否有该实例集合
    this.viewer.scene.primitives._primitives.forEach(primitive => {
      if (primitive.customID && primitive.customID == "plantTree") {
        instanceCollection = primitive;
      }
    })

    // 如果没有就新创建一个
    if (!instanceCollection) {
      // 新的种树
      instanceCollection = new SuperMap3D.S3MInstanceCollection(this.viewer.scene._context);
      instanceCollection.customID = 'plantTree';
      this.viewer.scene.primitives.add(instanceCollection);

      //分到不同的地形块里面，
      // instanceCollection.tileWidth = 50; // 50太小了，拉远了会消失
      //默认是2，范围是0-5，理解成lodscale
      // instanceCollection.maxSSE = 1.5;
    }

    return instanceCollection;
  }

  // 往场景中添加S3MIntance
  addS3MInstances(treeDataHandled, instanceCollection){
    if(!treeDataHandled || !treeDataHandled.children) return;
    if(!(treeDataHandled.children instanceof Array)) return;
    if(!instanceCollection || !(instanceCollection instanceof SuperMap3D.S3MInstanceCollection)) return;

    treeDataHandled.children.forEach((nodes) => {
      if (nodes.label === '单个添加') {
        // 遍历点
        nodes.children.forEach((pointItem) => {
          if (pointItem && pointItem.url && pointItem.options) {
            instanceCollection.add(pointItem.url, pointItem.options);
          }
        })
      } else if (nodes.label === '沿线添加') {
        // 遍历线进行添加
        nodes.children.forEach((polylineGroup) => {
          if (polylineGroup.children.length > 0) {
            polylineGroup.children.forEach((polylineItem) => {
              if (polylineItem && polylineItem.url && polylineItem.options) {
                instanceCollection.add(polylineItem.url, polylineItem.options)
              }
            })
          }
        })
      } else if (nodes.label === '区域添加') {
        // 遍历面进行添加
        nodes.children.forEach((polygonGroup) => {
          if (polygonGroup.children.length > 0) {
            polygonGroup.children.forEach((polygonItem) => {
              if (polygonItem && polygonItem.url && polygonItem.options) {
                instanceCollection.add(polygonItem.url, polygonItem.options)
              }
            })
          }
        })
      }
    })
  }
}

export default OpenSkitCollection;