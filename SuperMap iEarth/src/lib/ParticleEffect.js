class ParticleEffect {
  constructor(viewer, options) {
    this.viewer = viewer;
    this.waterParticle = null;
    this.init(options);
  }

  init(params = {}) { }

  /**
   * @exam
   * 
   * @param {*} url 粒子系统依赖的url
   * @param {*} modelMatrix 模型矩阵，以便粒子能正确定位到指定位置
   * @param {*} option // 效果设置 （可选）
   * @returns 
   * 
   * @example
   *  const particleEffect = new ParticleEffect(viewer);
      const position = await drawHandler.startPoint();
      particleEffect.createWater(waterUrl, position);
   */

  // 创建喷泉
  createWater(url, position) {
    if (!url || !url.includes('.json')) return;
    if (!position || !(position instanceof SuperMap3D.Cartesian3)) return;
    const modelMatrix = this.computedModelMatrix(position);
    if(!modelMatrix || !(modelMatrix instanceof SuperMap3D.Matrix4)) return;

    // 如果已添加喷泉了，再次添加只是改变位置，暂时不支持添加多个
    if(this.waterParticle && (this.waterParticle instanceof SuperMap3D.ParticleSystem)){ 
      this.waterParticle.modelMatrix = modelMatrix;
    }else{
      const promise = SuperMap3D.ParticleHelper.fromJsonUrl(url, this.viewer.scene)
      promise.then(particleSystem => {
        if(particleSystem.preventAutoStart) return; // 请确保传入的粒子json文件中 "preventAutoStart": false
        this.waterParticle = particleSystem;
        this.waterParticle.modelMatrix = modelMatrix;

        // iEarth不添加这两句也能看到喷泉，范例里面必须加上才能看到，而且清除的时候还好崩溃报错
        // 和粒子json文件中的: preventAutoStart有关，设置false就不需要加上这两句，且清除不会报错
        // this.viewer.scene.primitives.add(this.waterParticle);
        // this.waterParticle.start();
      })
    }
  }
  // 修改喷泉属性:其他属性 todo...
  changeWater(option){
    const key = option.key;
    const value = option.value;
    switch (key) {
      case "EmitterType":
        this.changeWaterEmitterType(value);
        break;
      default:
        break;
    }
  }
  // 改变喷泉发射类型
  changeWaterEmitterType(type) {
    switch (type) {
      case "Cone":
        this.waterParticle.createConeEmitter(1.0, 1.05);
        break;
      case "Sphere":
        this.waterParticle.createSphereEmitter(1.0);
        break;
      case "Box":
        const direction1 = new SuperMap3D.Cartesian3(-1, 1, 1);
        const direction2 = new SuperMap3D.Cartesian3(1, 1, -1);
        const minBox = new SuperMap3D.Cartesian3(-10, 0, -10);
        const maxBox = new SuperMap3D.Cartesian3(10, 0, 10);
        this.waterParticle.createBoxEmitter(direction1, direction2, minBox, maxBox);
        break;
      default:
        break;
    }
  }
  // 关闭喷泉 
  clearWater() {
    if (this.waterParticle) {
      this.viewer.scene.primitives.remove(this.waterParticle);
      this.waterParticle = null;
    }
  }

  // 根据传入的position计算出变换矩阵，当做粒子系统的模型矩阵
  computedModelMatrix(position) {
    if (!position || !(position instanceof SuperMap3D.Cartesian3)) return;
    const modelMatrix = SuperMap3D.Transforms.eastNorthUpToFixedFrame(
      position,
      undefined,
      new SuperMap3D.Matrix4()
    );
    return modelMatrix;
  }

  // 火焰：todo...

  // 烟花：todo...
}

export default ParticleEffect;