<template>
  <div class="sm-function-module-content" v-show="ParticleSystem">
    <label class="sm-function-module-sub-section-setting">{{Resource.symbolicLibrary}}</label>
    <div class="symbolicLibrary">
      <div
        class="Thematicbox"
        :class="{lightSelected:ParticleSystemSourceType===0}"
        @click="ParticleType(0)"
      >
        <div id="pointLight" class="minbox">
          <span class="iconfont iconICON_huoyan"></span>
        </div>{{Resource.Fire}}
      </div>
      <div
        class="Thematicbox"
        :class="{lightSelected:ParticleSystemSourceType===1}"
        @click="ParticleType(1)"
      >
        <div class="minbox" id="spotLight">
          <span class="iconfont iconICON_penquan"></span>
        </div>{{Resource.Fountain}}
      </div>
    </div>
    <!-- 火焰 -->
    <div v-show="FireShow" class="ParticleSystem">
      <div class="sm-function-module-sub-section particle">
        <label class="label-container">{{Resource.emissionRate}}</label>
        <div class="sm-solider-input-box">
          <input
            class="min-solider"
            min="0.0"
            max="1000.0"
            step="1"
            style="width:63%;background-color:rgba(51,51,51,1);border:1px solid rgb(87,93,96);padding:0 3px;height:25px;border-radius:3px;"
            type="range"
            v-model="emissionRate"
          />
          <input
            class="min-solider"
            min="0.0"
            max="1000.0"
            step="1"
            style="width:34%"
            type="number"
            v-model="emissionRate"
          />
        </div>
      </div>
      <div class="sm-function-module-sub-section particle">
        <label class="label-container">{{Resource.particleSize}}</label>
        <div class="sm-solider-input-box">
          <input
            class="min-solider"
            min="0"
            max="60.0"
            step="0.1"
            style="width:63%;background-color:rgba(51,51,51,1);border:1px solid rgb(87,93,96);padding:0 3px;height:25px;border-radius:3px;"
            type="range"
            v-model="particleSize"
          />
          <input
            class="min-solider"
            min="0"
            max="60.0"
            step="0.1"
            style="width:34%"
            type="number"
            v-model="particleSize"
          />
        </div>
      </div>
      <div class="sm-function-module-sub-section particle">
        <label class="label-container">{{Resource.minimumParticleLife}}</label>
        <div class="sm-solider-input-box">
          <input
            class="min-solider"
            min="0.1"
            max="30.0"
            step="1"
            style="width:63%;background-color:rgba(51,51,51,1);border:1px solid rgb(87,93,96);padding:0 3px;height:25px;border-radius:3px;"
            type="range"
            v-model="minimumParticleLife"
          />
          <input
            class="min-solider"
            min="0.1"
            max="30.0"
            step="1"
            style="width:34%"
            type="number"
            v-model="minimumParticleLife"
          />
        </div>
      </div>
      <div class="sm-function-module-sub-section particle">
        <label class="label-container">{{Resource.maximumParticleLife}}</label>
        <div class="sm-solider-input-box">
          <input
            class="min-solider"
            min="0.1"
            max="30.0"
            step="1"
            style="width:63%;background-color:rgba(51,51,51,1);border:1px solid rgb(87,93,96);padding:0 3px;height:25px;border-radius:3px;"
            type="range"
            v-model="maximumParticleLife"
          />
          <input
            class="min-solider"
            min="0.1"
            max="30.0"
            step="1"
            style="width:34%"
            type="number"
            v-model="maximumParticleLife"
          />
        </div>
      </div>
      <div class="sm-function-module-sub-section particle">
        <label class="label-container">{{Resource.minimumSpeed}}</label>
        <div class="sm-solider-input-box">
          <input
            class="min-solider"
            min="0.0"
            max="30.0"
            step="1"
            style="width:63%;background-color:rgba(51,51,51,1);border:1px solid rgb(87,93,96);padding:0 3px;height:25px;border-radius:3px;"
            type="range"
            v-model="minimumSpeed"
          />
          <input
            class="min-solider"
            min="0.0"
            max="30.0"
            step="1"
            style="width:34%"
            type="number"
            v-model="minimumSpeed"
          />
        </div>
      </div>
      <div class="sm-function-module-sub-section particle">
        <label class="label-container">{{Resource.maximumSpeed}}</label>
        <div class="sm-solider-input-box">
          <input
            class="min-solider"
            min="0.0"
            max="30.0"
            step="1"
            style="width:63%;background-color:rgba(51,51,51,1);border:1px solid rgb(87,93,96);padding:0 3px;height:25px;border-radius:3px;"
            type="range"
            v-model="maximumSpeed"
          />
          <input
            class="min-solider"
            min="0.0"
            max="30.0"
            step="1"
            style="width:34%"
            type="number"
            v-model="maximumSpeed"
          />
        </div>
      </div>
      <div class="sm-function-module-sub-section particle">
        <label class="label-container">{{Resource.startScale}}</label>
        <div class="sm-solider-input-box">
          <input
            class="min-solider"
            min="0.0"
            max="10.0"
            step="1"
            style="width:63%;background-color:rgba(51,51,51,1);border:1px solid rgb(87,93,96);padding:0 3px;height:25px;border-radius:3px;"
            type="range"
            v-model="startScale"
          />
          <input
            class="min-solider"
            min="0.0"
            max="10.0"
            step="1"
            style="width:34%"
            type="number"
            v-model="startScale"
          />
        </div>
      </div>
      <div class="sm-function-module-sub-section particle">
        <label class="label-container">{{Resource.endScale}}</label>
        <div class="sm-solider-input-box">
          <input
            class="min-solider"
            min="0.0"
            max="10.0"
            step="1"
            style="width:63%;background-color:rgba(51,51,51,1);border:1px solid rgb(87,93,96);padding:0 3px;height:25px;border-radius:3px;"
            type="range"
            v-model="endScale"
          />
          <input
            class="min-solider"
            min="0.0"
            max="10.0"
            step="1"
            style="width:34%"
            type="number"
            v-model="endScale"
          />
        </div>
      </div>
      <div class="sm-function-module-sub-section particle">
        <label class="label-container">{{Resource.gravity}}</label>
        <div class="sm-solider-input-box">
          <input
            class="min-solider"
            min="-10.0"
            max="10.0"
            step="1"
            style="width:63%;background-color:rgba(51,51,51,1);border:1px solid rgb(87,93,96);padding:0 3px;height:25px;border-radius:3px;"
            type="range"
            v-model="gravity"
          />
          <input
            class="min-solider"
            min="-10.0"
            max="10.0"
            step="1"
            style="width:34%"
            type="number"
            v-model="gravity"
          />
        </div>
      </div>
      <div class="sm-function-module-sub-section">
        <label class="label-container">{{Resource.LaunchType}}</label>
        <select class="sm-select" v-model="particleSystemType">
          <option value="圆形放射">{{Resource.CircularRadiation}}</option>
          <option value="球体放射">{{Resource.SpheroidRadiation}}</option>
          <option value="圆锥体放射">{{Resource.ConicalRadiation}}</option>
          <option value="盒状放射">{{Resource.BoxedRadiation}}</option>
        </select>
      </div>
    </div>
    <!-- 喷泉 -->
    <div v-show="FountainShow" class="ParticleSystem">
      <div class="sm-function-module-sub-section particle">
        <label class="label-container">{{Resource.emissionRate}}</label>
        <div class="sm-solider-input-box">
          <input
            class="min-solider"
            min="0.0"
            max="1000.0"
            step="1"
            style="width:63%;background-color:rgba(51,51,51,1);border:1px solid rgb(87,93,96);padding:0 3px;height:25px;border-radius:3px;"
            type="range"
            v-model="emissionRate"
          />
          <input
            class="min-solider"
            min="0.0"
            max="1000.0"
            step="1"
            style="width:34%"
            type="number"
            v-model="emissionRate"
          />
        </div>
      </div>
      <div class="sm-function-module-sub-section particle">
        <label class="label-container">{{Resource.particleSize}}</label>
        <div class="sm-solider-input-box">
          <input
            class="min-solider"
            min="0"
            max="60.0"
            step="0.1"
            style="width:63%;background-color:rgba(51,51,51,1);border:1px solid rgb(87,93,96);padding:0 3px;height:25px;border-radius:3px;"
            type="range"
            v-model="particleSize"
          />
          <input
            class="min-solider"
            min="0"
            max="60.0"
            step="0.1"
            style="width:34%"
            type="number"
            v-model="particleSize"
          />
        </div>
      </div>
      <div class="sm-function-module-sub-section particle">
        <label class="label-container">{{Resource.minimumParticleLife}}</label>
        <div class="sm-solider-input-box">
          <input
            class="min-solider"
            min="0.1"
            max="30.0"
            step="1"
            style="width:63%;background-color:rgba(51,51,51,1);border:1px solid rgb(87,93,96);padding:0 3px;height:25px;border-radius:3px;"
            type="range"
            v-model="minimumParticleLife"
          />
          <input
            class="min-solider"
            min="0.1"
            max="30.0"
            step="1"
            style="width:34%"
            type="number"
            v-model="minimumParticleLife"
          />
        </div>
      </div>
      <div class="sm-function-module-sub-section particle">
        <label class="label-container">{{Resource.maximumParticleLife}}</label>
        <div class="sm-solider-input-box">
          <input
            class="min-solider"
            min="0.1"
            max="30.0"
            step="1"
            style="width:63%;background-color:rgba(51,51,51,1);border:1px solid rgb(87,93,96);padding:0 3px;height:25px;border-radius:3px;"
            type="range"
            v-model="maximumParticleLife"
          />
          <input
            class="min-solider"
            min="0.1"
            max="30.0"
            step="1"
            style="width:34%"
            type="number"
            v-model="maximumParticleLife"
          />
        </div>
      </div>
      <div class="sm-function-module-sub-section particle">
        <label class="label-container">{{Resource.minimumSpeed}}</label>
        <div class="sm-solider-input-box">
          <input
            class="min-solider"
            min="0.0"
            max="30.0"
            step="1"
            style="width:63%;background-color:rgba(51,51,51,1);border:1px solid rgb(87,93,96);padding:0 3px;height:25px;border-radius:3px;"
            type="range"
            v-model="minimumSpeed"
          />
          <input
            class="min-solider"
            min="0.0"
            max="30.0"
            step="1"
            style="width:34%"
            type="number"
            v-model="minimumSpeed"
          />
        </div>
      </div>
      <div class="sm-function-module-sub-section particle">
        <label class="label-container">{{Resource.maximumSpeed}}</label>
        <div class="sm-solider-input-box">
          <input
            class="min-solider"
            min="0.0"
            max="30.0"
            step="1"
            style="width:63%;background-color:rgba(51,51,51,1);border:1px solid rgb(87,93,96);padding:0 3px;height:25px;border-radius:3px;"
            type="range"
            v-model="maximumSpeed"
          />
          <input
            class="min-solider"
            min="0.0"
            max="30.0"
            step="1"
            style="width:34%"
            type="number"
            v-model="maximumSpeed"
          />
        </div>
      </div>
      <div class="sm-function-module-sub-section particle">
        <label class="label-container">{{Resource.startScale}}</label>
        <div class="sm-solider-input-box">
          <input
            class="min-solider"
            min="0.0"
            max="10.0"
            step="1"
            style="width:63%;background-color:rgba(51,51,51,1);border:1px solid rgb(87,93,96);padding:0 3px;height:25px;border-radius:3px;"
            type="range"
            v-model="startScale"
          />
          <input
            class="min-solider"
            min="0.0"
            max="10.0"
            step="1"
            style="width:34%"
            type="number"
            v-model="startScale"
          />
        </div>
      </div>
      <div class="sm-function-module-sub-section particle">
        <label class="label-container">{{Resource.endScale}}</label>
        <div class="sm-solider-input-box">
          <input
            class="min-solider"
            min="0.0"
            max="10.0"
            step="1"
            style="width:63%;background-color:rgba(51,51,51,1);border:1px solid rgb(87,93,96);padding:0 3px;height:25px;border-radius:3px;"
            type="range"
            v-model="endScale"
          />
          <input
            class="min-solider"
            min="0.0"
            max="10.0"
            step="1"
            style="width:34%"
            type="number"
            v-model="endScale"
          />
        </div>
      </div>
      <div class="sm-function-module-sub-section particle">
        <label class="label-container">{{Resource.gravity}}</label>
        <div class="sm-solider-input-box">
          <input
            class="min-solider"
            min="-10.0"
            max="10.0"
            step="1"
            style="width:63%;background-color:rgba(51,51,51,1);border:1px solid rgb(87,93,96);padding:0 3px;height:25px;border-radius:3px;"
            type="range"
            v-model="gravity"
          />
          <input
            class="min-solider"
            min="-10.0"
            max="10.0"
            step="1"
            style="width:34%"
            type="number"
            v-model="gravity"
          />
        </div>
      </div>
      <div class="sm-function-module-sub-section particle">
        <label class="label-container">{{Resource.LaunchType}}</label>
        <select class="sm-select" v-model="particleSystemType">
          <option value="圆形放射">{{Resource.CircularRadiation}}</option>
          <option value="球体放射">{{Resource.SpheroidRadiation}}</option>
          <option value="圆锥体放射">{{Resource.ConicalRadiation}}</option>
          <option value="盒状放射">{{Resource.BoxedRadiation}}</option>
        </select>
      </div>
    </div>

    <div class="boxchild">
      <button class="tbtn tbn1" type="button" @click="addParticleSystem">{{Resource.Add}}</button>
      <button class="tbtn right" type="button" @click="clearParticleSystemSource">{{Resource.clear}}</button>
    </div>
  </div>
</template>

<script>
let pointParticleSystemDrawHandler, entityParticleSystemPairs; // Entity和粒子特效对象的键值对
let viewModelFire,
  viewModelFountain,
  selectedParticleSystem,
  addEventRemoveFunc = [],
  SelectaddEveL;
export default {
  name: "sceneParticleSystem",
  data() {
    return {
      sharedState: store.state,
      ParticleSystemSourceType: 0,
      FireShow: true,
      FountainShow: false,
      emissionRate: 200,
      particleSize: 2,
      minimumParticleLife: 1.5,
      maximumParticleLife: 1.8,
      minimumSpeed: 7,
      maximumSpeed: 9,
      startScale: 3,
      endScale: 1.5,
      gravity: 0,
      particleSystemType: "圆形放射",
      isDestroyFlag: true
    };
  },

  computed: {
    ParticleSystem: function () {
      return this.sharedState.sceneAtttribute[3];
    },
    SceneAtttributeShow: function () {
      return this.sharedState.toolBar[3];
    },
  },
  beforeDestroy() {
    if (this.isDestroyFlag && entityParticleSystemPairs) {
      if (pointParticleSystemDrawHandler) {
        pointParticleSystemDrawHandler.deactivate();
        pointParticleSystemDrawHandler = undefined;
      }
      entityParticleSystemPairs = undefined;
      viewModelFire = null;
      viewModelFountain = null;
    }
  },
  mounted() {
    if (this.SceneAtttributeShow && this.ParticleSystem) {
      this.init();
    }
  },
  methods: {
    init() {
      if (entityParticleSystemPairs) {
        return;
      }
      entityParticleSystemPairs = new Map();

      //火焰粒子特效
      viewModelFire = {
        emissionRate: 200,
        particleSize: 2,
        minimumParticleLife: 1.5,
        maximumParticleLife: 1.8,
        minimumSpeed: 7,
        maximumSpeed: 9,
        startScale: 3,
        endScale: 1.5,
        gravity: 0,
      };
      //喷泉粒子特效
      viewModelFountain = {
        emissionRate: 40.0,
        particleSize: 1,
        minimumParticleLife: 6,
        maximumParticleLife: 7,
        minimumSpeed: 9,
        maximumSpeed: 9.5,
        startScale: 1,
        endScale: 20,
        gravity: -3.5,
      };
    },
    ParticleType(i) {
      this.ParticleSystemSourceType = i;
      switch (i) {
        case 0:
          this.FireShow = true;
          this.FountainShow = false;
          this.emissionRate = 200;
          this.particleSize = 2;
          this.minimumParticleLife = 1.5;
          this.maximumParticleLife = 1.8;
          this.minimumSpeed = 7;
          this.maximumSpeed = 9;
          this.startScale = 3;
          this.endScale = 1.5;
          this.gravity = 0;
          break;
        case 1:
          this.FireShow = false;
          this.FountainShow = true;
          this.emissionRate = 40;
          this.particleSize = 1;
          this.minimumParticleLife = 6;
          this.maximumParticleLife = 7;
          this.minimumSpeed = 9;
          this.maximumSpeed = 9.5;
          this.startScale = 1;
          this.endScale = 20;
          this.gravity = -3.5;
          break;
        default:
          null;
      }
    },
    addParticleSystem() {
      this.isDestroyFlag = false;
      if (!pointParticleSystemDrawHandler) {
        this.initParticleSystemDrawHandler();
      }
      this.addEventListener(); //监听
      pointParticleSystemDrawHandler.activate();
    },
    initParticleSystemDrawHandler() {
      pointParticleSystemDrawHandler = new Cesium.DrawHandler(
        viewer,
        Cesium.DrawMode.Point
      );
      pointParticleSystemDrawHandler.activeEvt.addEventListener(function (
        isActive
      ) {
        if (isActive == true) {
          viewer.enableCursorStyle = false;
          viewer._element.style.cursor = "";
          document.body.classList.add("drawCur");
        } else {
          viewer.enableCursorStyle = true;
          document.body.classList.remove("drawCur");
        }
      });
      pointParticleSystemDrawHandler.movingEvt.addEventListener(
        (windowPosition) => {
          window.tooltip.showAt(
            windowPosition,
            "<p>点击确定粒子位置</p><p>点击选中粒子可进行更改属性</p>"
          );
        }
      );
      pointParticleSystemDrawHandler.drawEvt.addEventListener((result) => {
        let cartesian = result.object.position;
        let entityFire;
        let entityFountain;
        let imageurl;
        window.tooltip.setVisible(false);
        switch (this.ParticleSystemSourceType) {
          case 0:
            entityFire = viewer.entities.add({
              id: "Particle-System-" + new Date().getTime(),
              // position: cartesian,
              position: new Cesium.Cartesian3(
                cartesian.x,
                cartesian.y,
                cartesian.z + 5
              ),
            });

            imageurl = "@/../static/images/ParticleSystem/fire4.png";
            let particleSystemFire = scene.primitives.add(
              new Cesium.ParticleSystem({
                image: imageurl,
                startColor: new Cesium.Color(1, 1, 1, 1),
                endColor: new Cesium.Color(1, 0, 0, 0),
                startScale: viewModelFire.startScale,
                endScale: viewModelFire.endScale,
                minimumParticleLife: viewModelFire.minimumParticleLife,
                maximumParticleLife: viewModelFire.maximumParticleLife,
                minimumSpeed: viewModelFire.minimumSpeed,
                maximumSpeed: viewModelFire.maximumSpeed,
                imageSize: new Cesium.Cartesian2(
                  viewModelFire.particleSize,
                  viewModelFire.particleSize
                ),
                emissionRate: viewModelFire.emissionRate,
                lifetime: 6.0,
                //循环是否开启
                loop: true,
                emitter: new Cesium.ConeEmitter(Cesium.Math.toRadians(45.0)),
                // emitterModelMatrix: computeEmitterModelMatrix(),
                updateCallback: applyGravityFire,
                sizeInMeters: true,
                performance: false,
              })
            );
            entityParticleSystemPairs.set(entityFire, particleSystemFire);
            break;
          case 1:
            entityFountain = viewer.entities.add({
              id: "Particle-System2-" + new Date().getTime(),
              position: new Cesium.Cartesian3(
                cartesian.x,
                cartesian.y,
                cartesian.z + 5
              ),
            });

            imageurl = "@/../static/images/ParticleSystem/fountain2.png";
            let particleSystemFountain = scene.primitives.add(
              new Cesium.ParticleSystem({
                image: imageurl,
                startColor: new Cesium.Color(1, 1, 1, 0.6),
                endColor: new Cesium.Color(0.8, 0.86, 1, 0.4),
                startScale: viewModelFountain.startScale,
                endScale: viewModelFountain.endScale,
                minimumParticleLife: viewModelFountain.minimumParticleLife,
                maximumParticleLife: viewModelFountain.maximumParticleLife,
                minimumSpeed: viewModelFountain.minimumSpeed,
                maximumSpeed: viewModelFountain.maximumSpeed,
                imageSize: new Cesium.Cartesian2(
                  viewModelFountain.particleSize,
                  viewModelFountain.particleSize
                ),
                emissionRate: viewModelFountain.emissionRate,
                lifetime: 16.0,
                //粒子发射器
                emitter: new Cesium.CircleEmitter(0.2),
                // emitterModelMatrix: computeEmitterModelMatrix(),
                updateCallback: applyGravityFountain,
                sizeInMeters: true,
                performance: false,
              })
            );
            entityParticleSystemPairs.set(
              entityFountain,
              particleSystemFountain
            );
            break;
        }

        let gravityScratchFire = new Cesium.Cartesian3();
        function applyGravityFire(p, dt) {
          // We need to compute a local up vector for each particle in geocentric space.
          let position = p.position;
          Cesium.Cartesian3.normalize(position, gravityScratchFire);
          Cesium.Cartesian3.multiplyByScalar(
            gravityScratchFire,
            viewModelFire.gravity * dt,
            gravityScratchFire
          );
          p.velocity = Cesium.Cartesian3.add(
            p.velocity,
            gravityScratchFire,
            p.velocity
          );
        }

        let gravityScratchFountain = new Cesium.Cartesian3();
        function applyGravityFountain(p, dt) {
          // We need to compute a local up vector for each particle in geocentric space.
          let position = p.position;
          Cesium.Cartesian3.normalize(position, gravityScratchFountain);
          Cesium.Cartesian3.multiplyByScalar(
            gravityScratchFountain,
            viewModelFountain.gravity * dt,
            gravityScratchFountain
          );
          p.velocity = Cesium.Cartesian3.add(
            p.velocity,
            gravityScratchFountain,
            p.velocity
          );

        }
        pointParticleSystemDrawHandler.clear();
      });
    },
    addEventListener() {
      if (!SelectaddEveL) {
        //获取选中的粒子
        SelectaddEveL = viewer.selectedEntityChanged.addEventListener(
          (selectedEntity) => {
            let entityID;
            if (selectedEntity && selectedEntity.collection) {
              entityID = selectedEntity.collection._textureAtlasGUID;
            } else {
              return;
            }
            if (entityParticleSystemPairs) {
              for (let key of entityParticleSystemPairs.keys()) {
                let particleSystem = entityParticleSystemPairs.get(key);
                if (particleSystem) {
                  if (
                    particleSystem._billboardCollection._textureAtlasGUID ==
                    entityID
                  ) {
                    selectedParticleSystem = particleSystem;
                    break;
                  }
                }
              }
            }
          }
        );
      }
      let addEventRemoveF = viewer.scene.preUpdate.addEventListener(function (
        scene,
        time
      ) {
        //循循环数组
        if (entityParticleSystemPairs) {
          for (let key of entityParticleSystemPairs.keys()) {
            let particleSystem = entityParticleSystemPairs.get(key);
            if (particleSystem) {
              particleSystem.modelMatrix = computeModelMatrix(key, time);
            }
          }
        }
      });
      function computeModelMatrix(entity, time) {
        return entity.computeModelMatrix(time, new Cesium.Matrix4());
      }
      addEventRemoveFunc.push(addEventRemoveF);
    },
    clearParticleSystemSource() {
      this.isDestroyFlag = true;
      for (let key of entityParticleSystemPairs.keys()) {
        viewer.entities.remove(key);
        let particleSystem = entityParticleSystemPairs.get(key);
        scene._primitives.remove(particleSystem);
      }
      entityParticleSystemPairs.clear();
      if (SelectaddEveL) {
        SelectaddEveL();
        SelectaddEveL = undefined;
      }
      if (addEventRemoveFunc.length > 0) {
        //停止监听
        addEventRemoveFunc.forEach((item) => {
          item();
        });
        addEventRemoveFunc = [];
      }
    },
  },

  watch: {
    ParticleSystem: function (val) {
      if (val) {
        this.init();
      }
    },
    emissionRate(val) {
      viewModelFire.emissionRate = parseFloat(val);
      viewModelFountain.emissionRate = parseFloat(val);
      if (selectedParticleSystem) {
        selectedParticleSystem.emissionRate = parseFloat(val);
      }
    },
    particleSize(val) {
      viewModelFire.particleSize = parseFloat(val);
      viewModelFountain.particleSize = parseFloat(val);
      if (selectedParticleSystem) {
        let particleSystem = selectedParticleSystem;
        let particleSize = parseFloat(val);
        particleSystem.minimumImageSize.x = particleSize;
        particleSystem.minimumImageSize.y = particleSize;
        particleSystem.maximumImageSize.x = particleSize;
        particleSystem.maximumImageSize.y = particleSize;
      }
    },
    minimumParticleLife(val) {
      viewModelFire.minimumParticleLife = parseFloat(val);
      viewModelFountain.minimumParticleLife = parseFloat(val);
      if (selectedParticleSystem) {
        let particleSystem = selectedParticleSystem;
        particleSystem.minimumParticleLife = parseFloat(val);
      }
    },
    maximumParticleLife(val) {
      viewModelFire.maximumParticleLife = parseFloat(val);
      viewModelFountain.maximumParticleLife = parseFloat(val);
      if (selectedParticleSystem) {
        let particleSystem = selectedParticleSystem;
        particleSystem.maximumParticleLife = parseFloat(val);
      }
    },
    minimumSpeed(val) {
      viewModelFire.minimumSpeed = parseFloat(val);
      viewModelFountain.minimumSpeed = parseFloat(val);
      if (selectedParticleSystem) {
        let particleSystem = selectedParticleSystem;
        particleSystem.minimumSpeed = parseFloat(val);
      }
    },
    maximumSpeed(val) {
      viewModelFire.maximumSpeed = parseFloat(val);
      viewModelFountain.maximumSpeed = parseFloat(val);
      if (selectedParticleSystem) {
        let particleSystem = selectedParticleSystem;
        particleSystem.maximumSpeed = parseFloat(val);
      }
    },
    startScale(val) {
      viewModelFire.startScale = parseFloat(val);
      viewModelFountain.startScale = parseFloat(val);
      if (selectedParticleSystem) {
        let particleSystem = selectedParticleSystem;
        particleSystem.startScale = parseFloat(val);
      }
    },
    endScale(val) {
      viewModelFire.endScale = parseFloat(val);
      viewModelFountain.endScale = parseFloat(val);
      if (selectedParticleSystem) {
        let particleSystem = selectedParticleSystem;
        particleSystem.endScale = parseFloat(val);
      }
    },
    gravity(val) {
      viewModelFire.gravity = parseFloat(val);
      viewModelFountain.gravity = parseFloat(val);
      if (selectedParticleSystem) {
        let particleSystem = selectedParticleSystem;
        if (particleSystem) {
          //更新重力，待完成
        }
      }
    },
    particleSystemType(val) {
      if (viewer.selectedEntity) {
        let particleSystem = selectedParticleSystem;
        if (particleSystem) {
          switch (val) {
            case "圆形放射":
              particleSystem.emitter = new Cesium.CircleEmitter(2.0);
              break;
            case "球体放射":
              particleSystem.emitter = new Cesium.SphereEmitter(2.5);
              break;
            case "圆锥体放射":
              particleSystem.emitter = new Cesium.ConeEmitter(
                Cesium.Math.toRadians(45.0)
              );
              break;
            case "盒状放射":
              particleSystem.emitter = new Cesium.BoxEmitter(
                new Cesium.Cartesian3(10.0, 10.0, 10.0)
              );
              break;
            default:
              break;
          }
        }
      }
    },
  },
};
</script>

<style lang="scss"  scoped>
@import "ParticleSystem";
</style>
