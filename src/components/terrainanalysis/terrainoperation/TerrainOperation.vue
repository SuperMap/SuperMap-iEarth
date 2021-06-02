<template>
  <div v-show="terrainOperation">
    <div class="function-content operation">
        <div class="terrainDig">
            <div class="choose">
              <label class="radio">{{Resource.TilesetEditor}}<input type="radio" name="terrainModify" id="terrainModify" value="terrainModify" v-model="terrain"><i></i></label>
              <label class="radio" style="margin-left:38px;">{{Resource.TerrainMining}}<input type="radio" name="terrainDig" id="terrainDig" value="terrainDig" v-model="terrain"><i></i></label>
            </div>
        </div>
      <div v-show="terrainChange == 'terrainModify'">
        <div class="editBox" style="margin-top:35px;margin-bottom:15px;">
          <div>
            <input style="margin-left: 30px" type="checkbox" v-model="isTerrainModifyEdit"/>&nbsp;&nbsp;
            <label>{{ Resource.edit }}</label>
          </div>
          <div style="position:absolute;left:118px;">
            <input style="margin-left: 5px" type="checkbox" v-model="isEditZ" />
            <label style="margin-left: 5px;">{{ Resource.Zdrection }}</label>
          </div>
        </div>
        <div class="boxchild">
          <button @click="modifyTerrain" class="tbtn tbn1" type="button">
            {{ Resource.operation }}
          </button>
          <button @click="clearModify" class="tbtn" type="button">
            {{ Resource.clear }}
          </button>
        </div>
      </div>
      <div v-show="terrainChange == 'terrainDig'">
        <div class="sm-function-module-sub-section" style="margin-left:20px;margin-top:35px;width:175px;">
          <label class="span-box2">{{ Resource.TerrainMiningDepth }}</label>
          <input class="sm-input-long"
                 min="0"
                 type="number"
                 v-model="depth"
                 style="width:43%;border-radius:4px;margin-top:11px;"
          />
        </div>
        <div class="editBox" style="margin-left:22px;margin-top:10px;">
          <div>
            <input style="margin-left: 5px" type="checkbox" v-model="isEdit"/>&nbsp;&nbsp;
            <label>{{ Resource.edit }}</label>
          </div>
        </div>
        <div class="boxchild">
          <button @click="dig" @touchstart="dig" class="tbtn tbn1" type="button">
            {{ Resource.operation }}
          </button>
          <button @click="clearDig" class="tbtn" type="button">
            {{ Resource.clear }}
          </button>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
export default {
  name: "Sm3dTerrainOperation",
  data() {
    return {
      depth: 500,
      positions: [], //dig
      positionM: [], //mo
      //编辑功能
      isEditZ: false,
      isEdit: false,
      isTerrainModifyEdit:false,
      EditPositions: [],
      operationType: 0, //0 挖掘 1 地形修改
      sharedState: store.state,
      terrainChange:"terrainModify",
      terrain:"terrainModify",
      clearTerrainDig:false,
      clearTerrainModify:false
    };
  },
  computed: {
    terrainOperation: function () {
      return this.sharedState.terrain[0];
    },
  },
  methods: {
    // 挖掘模块
    dig() {
      this.positions = [];
      this.operationType = 0;
      if (viewer.terrainProvider.tablename) {
        //判断地形
        common.handlerDrawing("Polygon").then(
          (res) => {
            this.positions = res.positions;
            let handlerPolygon = window.handlerPolygon;
            this.EditUpdate(res.positions);
            handlerPolygon.polygon.show = false;
            handlerPolygon.polyline.show = false;
            handlerPolygon.deactivate();
            if (this.isEdit) {
              common.Edit(this, this.EditUpdate, "Polygon");
            }
          },
          (err) => {
            console.log(err);
          }
        );
        window.handlerPolygon.activate();
        if (!scene.pickPositionSupported) {
          alert("不支持深度纹理,无法绘制多边形，地形操作功能无法使用！");
        }
      } else {
        console.log("请在地形里使用地形组件！");
      }
    },
    //更新函数
    EditUpdate(p) {
      viewer.scene.globe.removeAllExcavationRegion();
      viewer.scene.globe.addExcavationRegion({
        name: "ggg",
        position: p,
        height: this.depth,
        transparent: false,
      });
    },
    clearDig() {
      this.positions = [];
      viewer.scene.globe.removeAllExcavationRegion();
      common.clearHandlerDrawing("Polygon");
      common.clearEditHandler("Polygon");
    },
    // 地形修改模块
    modifyTerrain() {
      this.positionM = [];
      this.operationType = 1;
      if (viewer.terrainProvider.tablename) {
        common.handlerDrawing("Polygon").then(
          (res) => {
            this.positionM = res.positions;
            let handlerPolygon = window.handlerPolygon;
            this.EditUpdateMod(res.positions);
            handlerPolygon.polygon.show = false;
            handlerPolygon.polyline.show = false;
            if (this.isTerrainModifyEdit) {
              common.Edit(this, this.EditUpdateMod, "Polygon");
            }
          },
          (err) => {
            console.log(err);
          }
        );

        window.handlerPolygon.activate();
        if (!scene.pickPositionSupported) {
          alert("不支持深度纹理,无法绘制多边形，地形修改功能无法使用！");
        }
      }
    },
    clearModify() {
      viewer.scene.globe.removeAllModifyRegion();
      common.clearHandlerDrawing("Polygon");
      common.clearEditHandler("Polygon");
    },
    //更新地形修改
    EditUpdateMod(p) {
      scene.globe.removeAllModifyRegion();
      scene.globe.addModifyRegion({
        name: "ggg",
        position: p,
      });
    }
  },

  watch: {
    // 地形操作挖掘深度
    depth(val) {
      if (this.positions.length == 0) {
        return;
      }
      this.EditUpdate(this.positions);
    },
    terrainOperation(val) {
      if (val && this.isEdit) {
        common.Edit(this, this.EditUpdate, "Polygon");
      } else {
        if (window.handlerPolygon) {
          if (window.handlerPolygon.polygon) {
            window.handlerPolygon.polygon.show = false;
          }
        }
        common.clearEditHandler("Polygon");
      }
    },

    isEdit(val) {
      //地形挖掘
      if (val) {
        if (this.operationType == 0) {
          common.Edit(this, this.EditUpdate, "Polygon");
        } else {
          common.Edit(this, this.EditUpdateMod, "Polygon");
        }
      } else {
        common.clearEditHandler("Polygon");
        if (window.handlerPolygon.polygon) {
          window.handlerPolygon.polygon.show = false;
        }
      }
    },
    isEditZ(val) {
      if (window.editHandler) {
        window.editHandler.isEditZ = val;
      }
    },
    isTerrainModifyEdit(val){
      if (val) {
        if (this.operationType == 0) {
          common.Edit(this, this.EditUpdate, "Polygon");
        } else {
          common.Edit(this, this.EditUpdateMod, "Polygon");
        }
      } else {
        common.clearEditHandler("Polygon");
        if (window.handlerPolygon.polygon) {
          window.handlerPolygon.polygon.show = false;
        }
      }
    },
    terrain(val){
      if(val === "terrainDig"){
        this.clearModify();
      }else{
        this.clearDig();
      }
      this.terrainChange = val;
    }
  },
};
</script>
<style lang="scss" scoped>
@import "TerrainOperation";
</style>

