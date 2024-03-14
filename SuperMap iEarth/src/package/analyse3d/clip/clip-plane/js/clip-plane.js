//平面裁剪封装类
class ClipPlane {
    /**
       * Creates an instance of Roaming.
       * @param {*} viewer 需要传入
       * @param {*} options.modelUrl  需要传入，模型编辑器需要的载体
       * @param {*} options.ClipPlaneShow  可选，平面显隐
       * @param {*} options.clipPlaneScale  可选，平面的缩放系数
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
        this.s3mInstanceColc = new SuperMap3D.S3MInstanceCollection(viewer.scene._context);
        viewer.scene.primitives.add(this.s3mInstanceColc);
        this.clipPlanePositions = null;
        this.ClipPlaneShow = true;
        this.clipPlaneScale = 5;
        this.LocalToWorldMatrix = null;
        this.setDirectionByNormal = false;
    }

    /**
      * 更新可配置的内部参数
      * @param {object} options 配置项
      */
    updateOptionsParams(options) {
        if (!options) return;
        if (SuperMap3D.defined(options.modelUrl)) this.modelUrl = options.modelUrl;
        if (SuperMap3D.defined(options.ClipPlaneShow)) this.ClipPlaneShow = options.ClipPlaneShow;
        if (SuperMap3D.defined(options.clipPlaneScale)) this.clipPlaneScale = options.clipPlaneScale;
        if (SuperMap3D.defined(options.setDirectionByNormal)) this.setDirectionByNormal = options.setDirectionByNormal;
    }


    /**
     * 设置裁剪面位置
    * @param {object} _LocalToWorldMatrix 模型矩阵
    */
    setPlanePositions(_LocalToWorldMatrix) {
        this.LocalToWorldMatrix = _LocalToWorldMatrix;
        let width = 10 * this.clipPlaneScale;
        // 在本地坐标
        let _localPos4 = new SuperMap3D.Cartesian3(width, width, 0);
        let _localPos3 = new SuperMap3D.Cartesian3(width, -width, 0);
        let _localPos2 = new SuperMap3D.Cartesian3(-width, -width, 0);
        let _localPos1 = new SuperMap3D.Cartesian3(-width, width, 0);
        // 将本地坐标转世界坐标
        let _worldPoint1 = SuperMap3D.Matrix4.multiplyByPoint(_LocalToWorldMatrix, _localPos1, _localPos1);
        let _worldPoint2 = SuperMap3D.Matrix4.multiplyByPoint(_LocalToWorldMatrix, _localPos2, _localPos2);
        let _worldPoint3 = SuperMap3D.Matrix4.multiplyByPoint(_LocalToWorldMatrix, _localPos3, _localPos3);
        let _worldPoint4 = SuperMap3D.Matrix4.multiplyByPoint(_LocalToWorldMatrix, _localPos4, _localPos4);

        this.clipPlanePositions = [_worldPoint1, _worldPoint2, _worldPoint3, _worldPoint4];
        this.clipPlaneUpdate();
    }

    // 添加裁剪面entity
    addsurface() {
        this.planeSurface = this.viewer.entities.add({
            id: "clip-plane",
            polygon: {
                hierarchy: new SuperMap3D.CallbackProperty(() => {
                    return {
                        positions: this.clipPlanePositions,
                        holes: []
                    };
                }, false),
                show: new SuperMap3D.CallbackProperty(() => {
                    return this.ClipPlaneShow
                }, false),
                material: SuperMap3D.Color.GOLD.withAlpha(0.2),
                outline: true,
                outlineColor: SuperMap3D.Color.GOLD,
                perPositionHeight: true
            }
        });
    }

    //添加编辑模型 
    // addModel(position, quaternion) {
    //     let id = "clip-model";
    //     this.s3mInstanceColc.add(this.modelUrl, {
    //         id: id,
    //         position: position,
    //         scale: new SuperMap3D.Cartesian3(1, 1, 0.01)
    //     });
    //     let editEntity = this.s3mInstanceColc.getInstance(this.modelUrl, id);
    //     let hpr = SuperMap3D.HeadingPitchRoll.fromQuaternion(quaternion, new SuperMap3D.HeadingPitchRoll());
    //     editEntity.updateRotation(hpr);
    //     if (!this.modelEditor) this.addModelEditor(editEntity);
    //     else {
    //         this.modelEditor.setEditObject(editEntity);
    //         this.modelEditor.deactivate();
    //     }
    // }

    addModel(position, quaternion) {
        if (!SuperMap3D.defined(this.referencePlane)) {
            this.s3mInstanceColc.add(this.modelUrl, {
                id: "clip-model",
                position: position,
                scale: new SuperMap3D.Cartesian3(0.1, 0.1, 0.01)
            });
            this.referencePlane = this.s3mInstanceColc.getInstance(this.modelUrl, "clip-model");
            if (quaternion) {
                let hpr = SuperMap3D.HeadingPitchRoll.fromQuaternion(quaternion, new SuperMap3D.HeadingPitchRoll());
                this.referencePlane.updateRotation(hpr);
            }
        }
    }

    // 设置裁剪前的参考面
    setReferencePlane(position, normal) {
        if (!SuperMap3D.defined(position)) return;
        this.addModel(position);
        if (!this.referencePlane) return;
        this.referencePlane.updatePosition(position);
        if (normal && this.setDirectionByNormal) {
            let LocalToWorldMatrix = SuperMap3D.Transforms.eastNorthUpToFixedFrame(position);
            let mat = getMatrixByNormal(LocalToWorldMatrix, normal);
            let hpr = SuperMap3D.HeadingPitchRoll.fromQuaternion(mat.quaternion, new SuperMap3D.HeadingPitchRoll());
            this.referencePlane.updateRotation(hpr);
        }
    }

    // 开始裁剪
    startClip(position, normal) {
        if (!SuperMap3D.defined(position)) return;
        if (this.planeSurface) this.clear();
        let LocalToWorldMatrix = SuperMap3D.Transforms.eastNorthUpToFixedFrame(position);
        if (normal && this.setDirectionByNormal) {
            let mat = getMatrixByNormal(LocalToWorldMatrix, normal); //法线为上方向的局部坐标系
            this.setPlanePositions(mat.matrix);
            this.addModel(position, mat.quaternion);
        } else {
            this.addModel(position);
            this.setPlanePositions(LocalToWorldMatrix);
        }
        if (!SuperMap3D.defined(this.planeSurface)) this.addsurface();
        if (!this.modelEditor) this.addModelEditor(this.referencePlane);
        else {
            // this.addModelEditor(this.referencePlane);
            this.modelEditor.setEditObject(this.referencePlane);
            this.modelEditor.activate();
        }
    }

    // 添加模型编辑器
    addModelEditor(model) {
        this.modelEditor = new SuperMap3D.ModelEditor({
            model: model,
            scene: this.viewer.scene,
            scale: 3,
            axesShow: {
                translation: true,
                rotation: true,
                scale: false
            },
            lineWidthScale: 5
        });
        this.modelEditor.activate();
        this.modelEditor.changedEvt.addEventListener(param => {
            this.setPlanePositions(param.modelMatrix)
        });
    }

    // 更新
    clipPlaneUpdate() {
        if (!this.clipPlanePositions) return;
        let layers = this.viewer.scene.layers.layerQueue;
        for (let layer of layers) {
            layer.setCustomClipPlane(
                this.clipPlanePositions[0],
                this.clipPlanePositions[1],
                this.clipPlanePositions[2]
            );
        }
    }

    /**
   * 设置裁剪面显隐
   * @param {object} val Boolean
   */
    setPlaneShow(val) {
        this.ClipPlaneShow = val;
        this.referencePlane.show = val;
    }

    /**
   * 
   * @param {object} val Boolean
   */
    setModelEditorShow(val) {
        if (!this.modelEditor) return;
        if (!val) {
            this.modelEditor.deactivate();
            // this.modelEditor = null;
        } else {
            let editEntity = this.s3mInstanceColc.getInstance(this.modelUrl, "clip-model");
            // if (!this.modelEditor) this.addModelEditor(this.referencePlane);
            this.modelEditor.setEditObject(editEntity);
            this.modelEditor.activate();
        }
    }

    /**裁剪平面缩放系数
    * @param {object} val Number 默认1
    */
    setClipPlaneScale(val) {
        this.clipPlaneScale = val;
        if (this.LocalToWorldMatrix) {
            this.setPlanePositions(this.LocalToWorldMatrix);
        }
    }

    // 清除
    clear() {
        let layers = this.viewer.scene.layers.layerQueue;
        for (let layer of layers) {
            layer.clearCustomClipBox();
        }
        if (this.referencePlane) {
            this.s3mInstanceColc.removeCollection(this.modelUrl);
            this.referencePlane = null;
        }
        if (this.planeSurface) {
            this.viewer.entities.remove(this.planeSurface);
            this.modelEditor.deactivate();
            this.modelEditor = null;
            this.planeSurface = null;
            this.clipPlanePositions = null;
            this.LocalToWorldMatrix = null;
        }
    }

    /**
    * 销毁
    */
    destroy() {
        this.clear();
        if (this.modelEditor) this.modelEditor.destroy();
    }
}

// 根据法线返回旋转后坐标系
function getMatrixByNormal(matrix, normal) {
    let up = new SuperMap3D.Cartesian3(0, 0, 1);
    let b = SuperMap3D.Cartesian3.cross(up, normal, new SuperMap3D.Cartesian3());
    let cos = SuperMap3D.Cartesian3.dot(normal, up);
    let quaternion = SuperMap3D.Quaternion.fromAxisAngle(b, Math.acos(cos), new SuperMap3D.Quaternion());
    let rotation = SuperMap3D.Matrix3.fromQuaternion(quaternion, new SuperMap3D.Matrix3());
    let mat = SuperMap3D.Matrix4.multiplyByMatrix3(matrix, rotation, new SuperMap3D.Matrix4());
    return {
        matrix: mat,
        quaternion: quaternion
    }
}

export default ClipPlane;
