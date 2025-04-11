class SkitCollection {
  constructor(viewer, options) {
    this.viewer = viewer;
    this.init(options);
  }

  init(params={}) {
    this.treeGroup = params.Data;
    if (this.treeGroup && (this.treeGroup instanceof Array)) {
      if (this.treeGroup[0].children && (this.treeGroup[0].children instanceof Array)) {
        this.treeData = this.treeGroup[0].children;
      }
    }
  }

  // 向图层列表中添加项目
  addItemToTree(item, type) {
    if (!item) return;
    const types = ['point', 'polylineGroup', 'polygonGroup'];
    if (!type || !types.includes(type)) return;

    if (type == 'point') { // 添加点集合
      let instanceID = item.options.id;
      let keyIndex = instanceID.split('-')[1];
      item.label = instanceID.replace('-addSymbol', '');
      item.type = type;
      item.key = `1-0-${keyIndex}`;
      if (this.treeData) this.treeData[0].children.push(item);
      return item;
    } else if (type == 'polylineGroup') {
      if (item.length <= 1) return; // 场景中未成功添加实例
      let currentIndex = item[item.length - 1];
      let group = {
        label: `线集合-${currentIndex}`,
        key: `2-${currentIndex}`,
        type: type,
        children: []
      }

      item.forEach((node, index) => {
        if (node && node.url) {
          let instanceID = node.options.id;
          let keyIndex = instanceID.split('-')[2];
          node.label = instanceID.replace('-addSymbol', '').replace('poly', '');
          node.type = 'polyline';
          node.key = `${group.key}-${keyIndex}`;
          node.parentKey = group.key;
          group.children.push(node);
        }
      })
      if (this.treeData) this.treeData[1].children.push(group);
      return group;
    } else if (type == 'polygonGroup') {
      if (item.length <= 1) return;
      let currentIndex = item[item.length - 1];
      let group = {
        label: `面集合-${currentIndex}`,
        key: `3-${currentIndex}`,
        type: type,
        children: []
      }

      item.forEach((node, index) => {
        if (node && node.url) {
          let instanceID = node.options.id;
          let keyIndex = instanceID.split('-')[2];
          node.label = instanceID.replace('-addSymbol', '').replace('polygon', 'face');;
          node.type = 'polygon';
          node.key = `${group.key}-${keyIndex}`;
          node.parentKey = group.key;
          group.children.push(node);
        }
      })

      if (this.treeData) this.treeData[2].children.push(group);
      return group;
    }
  }

  // 计算当前索引值（基于当前图层树数据）
  computedCurrentIndex(type) {
    if (!this.treeData) return;

    let index = -1;
    if (type == 'point') {
      index = 0;
    } else if (type == 'polylineGroup') {
      index = 1;
    } else if (type == 'polygonGroup') {
      index = 2;
    }
    if (index == -1) return;
    let targetList = this.treeData[index].children;
    let lastOne = targetList[targetList.length - 1];
    if (lastOne) {
      let cusIndex = lastOne.label.split('-')[1];
      return Number(cusIndex) + 1;
    } else {
      return 1;
    }
  }

  // 删除TreeData中指定S3MInstance的option：用于点选删除
  removeInstanceOptionInTreeData(selectInstance) {
    if (!this.treeData) return;
    if (!selectInstance || !(selectInstance instanceof SuperMap3D.S3MInstance)) return;
    if (!selectInstance.id || !selectInstance.id.includes('addSymbol')) return;

    let instanceID = selectInstance.id;
    let idList = instanceID.split('-'); // instance中的ID里面可以直接生成其在图层列表中对应的parentKey，因为他们都是基于currentIndex生成的
    let type = idList[0];
    let target = undefined;
    if (type == 'point') {  // 点集合
      target = this.treeData[0].children.find((child) => {
        if (child.options && child.options.id) {
          return instanceID === child.options.id;
        }
      })
      if (target) this.removeTargetOption(this.treeData[0], target);
    } else if (type == 'polyline') { // 线集合
      let parentKey = `2-${idList[1]}`;
      this.treeData[1].children.forEach((node) => {
        if (node.key == parentKey) {
          target = node.children.find((child) => {
            if (child.options && child.options.id) {
              return instanceID === child.options.id;
            }
          })
          if (target) this.removeTargetOption(node, target);
        }
      })
    } else if (type == 'polygon') { // 面集合
      let parentKey = `3-${idList[1]}`;
      this.treeData[2].children.forEach((node) => {
        if (node.key == parentKey) {
          target = node.children.find((child) => {
            if (child.options && child.options.id) {
              return instanceID === child.options.id;
            }
          })
          if (target) this.removeTargetOption(node, target);
        }
      })
    }

    return target;

  }
  // 删除数组中指定option
  removeTargetOption(targetParent, targetOption) {
    targetParent.children.map((node, index) => {
      if (node.key == targetOption.key) {
        targetParent.children.splice(index, 1);
      }
    })
  }

  // 当使用模型编辑器或拖拽S3MInstance时，更新其在TreeData里面的值
  updateInstanceOptionInTreeData(instance, treeData, types = ['position', 'scale', 'hpr']) {
    if (!instance || !instance.id || !treeData) return;

    let treeDataList = treeData[0].children;
    let instanceID = instance.id;
    let idList = instanceID.split('-'); // instance中的ID里面可以直接生成其在图层列表中对应的parentKey，因为他们都是基于currentIndex生成的
    let type = idList[0];
    let target = undefined;

    if (type == 'point') { // 点集合
      target = treeDataList[0].children.find((child) => {
        if (child.options && child.options.id) {
          return instanceID === child.options.id;
        }
      })
      if (target) typesToOptions(target, instance, types);
    } else if (type == 'polyline') { // 线集合
      let parentKey = `2-${idList[1]}`;
      treeDataList[1].children.forEach((node) => {
        if (node.key == parentKey) {
          target = node.children.find((child) => {
            if (child.options && child.options.id) {
              return instanceID === child.options.id;
            }
          })
          if (target) typesToOptions(target, instance, types);
        }
      })
    } else if (type == 'polygon') { // 面集合
      let parentKey = `3-${idList[1]}`;
      treeDataList[2].children.forEach((node) => {
        if (node.key == parentKey) {
          target = node.children.find((child) => {
            if (child.options && child.options.id) {
              return instanceID === child.options.id;
            }
          })
          if (target) typesToOptions(target, instance, types);
        }
      })
    }

    return target;

    // 将指定type的属性从instance传给target
    // 这里设计DragTool和ModelEdit的callback回调，导致this指向有问题指向（DragTool），所以不用this
    function typesToOptions(target, instance, types) {
      if (types.length === 1) {
        const type = types[0];
        target.options[type] = instance[type];
      } else if (types.length > 1) {
        for (let index = 0; index < types.length; index++) {
          const type = types[index];
          target.options[type] = instance[type];
        }
      }
    }
  }


  // naive-Tree中批量删除
  removeTreeOptionBatch(option, instanceCollection) {
    if (!option || !option.key) return;
    if (!this.treeData) return;

    let instanceCollection_tree = instanceCollection;
    if (!instanceCollection_tree) {
      viewer.scene.primitives._primitives.forEach(primitive => {
        if (primitive.customID && primitive.customID == "plantTree") {
          instanceCollection_tree = primitive;
        }
      })
    };
    if (!instanceCollection_tree || !(instanceCollection_tree instanceof SuperMap3D.S3MInstanceCollection)) return;

    // console.log('del-option:', option);

    if (option.key == '0') { } // 删除所有：clearAllTree()
    else if (option.key == '1') { // 删除所有点添加
      option.children.forEach(node => {
        instanceCollection_tree.removeInstance(node.url, [node.options.id]);
      })
      this.treeData[0].children = [];
    } else if (option.key == '2') { // 删除所有线添加
      option.children.forEach(nodes => {
        nodes.children.forEach(node => {
          instanceCollection_tree.removeInstance(node.url, [node.options.id]);
        })
      })
      this.treeData[1].children = [];
    } else if (option.key == '3') { // 删除所有面添加
      option.children.forEach(nodes => {
        nodes.children.forEach(node => {
          instanceCollection_tree.removeInstance(node.url, [node.options.id]);
        })
      })
      this.treeData[2].children = [];
    } else if (option.type == 'polylineGroup') { // 删除线集合
      option.children.forEach(node => {
        instanceCollection_tree.removeInstance(node.url, [node.options.id]);
      })
      let targetGroup = this.treeData[1];
      this.delTarget(targetGroup, option);
    } else if (option.type == 'polygonGroup') { // 删除面集合
      option.children.forEach(node => {
        instanceCollection_tree.removeInstance(node.url, [node.options.id]);
      })
      let targetGroup = this.treeData[2];
      this.delTarget(targetGroup, option);
    } else {
      instanceCollection_tree.removeInstance(option.url, [option.options.id]); // 单个删除
      if (option.type == 'point') { // 点集合中
        let targetGroup = this.treeData[0];
        this.delTarget(targetGroup, option);
      } else if (option.type == 'polyline') { // 线集合中
        let lineAddNodes = this.treeData[1].children;
        let targetGroup = lineAddNodes.find(item => item.key == option.parentKey);
        this.delTarget(targetGroup, option);
      } else if (option.type == 'polygon') { // 面集合中
        let polygonAddNodes = this.treeData[2].children;
        let targetGroup = polygonAddNodes.find(item => item.key == option.parentKey);
        this.delTarget(targetGroup, option);
      }
    }
  }
  // 删除数组中指定对象
  delTarget(targetGroup, option) {
    let target = undefined;
    targetGroup.children.map((node, index) => {
      if (node.key == option.key) {
        target = targetGroup.children.splice(index, 1);
      }
    })
    return target;
  }

  // 定位实例
  instenceLocate(option) {
    if (!option || !option.options || !option.options.position) return;
    // if(!(option.options.position instanceof SuperMap3D.Cartesian3)) return;

    let BoundingSphere = new SuperMap3D.BoundingSphere(option.options.position, 5);
    viewer.camera.flyToBoundingSphere(BoundingSphere, {
      duration: 0.5
    });
  }

  // 将数据中的hpr和scale转成一个模型矩阵进行保存
  hprAndScaleToModelMatrix(treeData) {
    if (treeData && treeData.children) {
      delete treeData.key;
      treeData.model = {};
      treeData.children.forEach(group => {
        delete group.key;
        group.children.forEach(item => {
          if (item.children && item.children.length > 0) {
            delete item.label;
            delete item.type;
            delete item.key;
            item.children.forEach(element => {
              computedModelMatrix(element, treeData);
            });
          } else {
            computedModelMatrix(item, treeData);
          }
        });
      });
    }

    return treeData;

    function computedModelMatrix(item, treeData) {
      if (item && item.options && item.options.scale && item.options.hpr) {
        // 缩放矩阵
        const scaleMatrix = SuperMap3D.Matrix3.fromScale(item.options.scale);

        // 旋转矩阵
        const rotationMatrix = SuperMap3D.Matrix3.fromHeadingPitchRoll(item.options.hpr);

        // 先缩放后旋转
        const combinedMatrix3 = SuperMap3D.Matrix3.multiply(
          rotationMatrix,
          scaleMatrix,
          new SuperMap3D.Matrix3()
        );

        // 转换为Matrix4
        const finalMatrix = SuperMap3D.Matrix4.fromRotationTranslation(
          combinedMatrix3,
          SuperMap3D.Cartesian3.ZERO
        );

        // item.options.modelMatrix = finalMatrix;
        let matrixArray = [];
        finalMatrix.toArray(matrixArray);
        item.options.modelMatrix = matrixArray;

        // 笛卡尔转经纬度:球面场景下
        if(viewer.scene.mode ===  SuperMap3D.SceneMode.SCENE3D){
          item.options.position = CartesiantoDegrees(item.options.position);
        }

        // 处理url => modelID
        const s3mbName = item.url.split("/").pop();
        const modelID = s3mbName.split(".").shift();
        treeData.model[modelID] = item.url;
        item.modelID = modelID;
        delete item.url;

        // 删除scale和hpr
        delete item.options.scale;
        delete item.options.hpr;

        // 删除多余属性
        delete item.options.id;
        delete item.options.sceneMode;
        delete item.label;
        delete item.type;
        delete item.key;
        delete item.parentKey;
      }
    }

    function CartesiantoDegrees(Cartesians) {
      const cartographic = SuperMap3D.Cartographic.fromCartesian(Cartesians);
      const longitude = Number(SuperMap3D.Math.toDegrees(cartographic.longitude));
      const latitude = Number(SuperMap3D.Math.toDegrees(cartographic.latitude));
      const height = Number(cartographic.height);
      const positions = {
        "x": longitude,
        "y": latitude,
        "z": height
      }
      return positions;
    }
  }

  getTreeData() {
    return this.treeData;
  }
}

export default SkitCollection;