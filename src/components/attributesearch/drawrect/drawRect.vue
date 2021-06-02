<template>
  <div>
    <div v-if="drawrect">
      <div class="sm-function-module-content">
        <div class="sm-function-module-sub-section">
          <label class="sm-function-module-sub-section-caption">选择模式:</label>
          <select class="sm-select" style="width:100%" v-model="selectVal">
            <option :value="1">重置模式</option>
            <option :value="2">并集模式</option>
            <option :value="4">交集模式</option>
            <option :value="8">减去模式</option>
          </select>
        </div>
        <div>
          <label class="sm-viewshed-label-right">实时选择:</label>
          <input style="margin-left: 10px" type="checkbox" v-model="isCallInMoving" />
        </div>
        <label class="media-hidden" style="font-size:12px">注：（按下Shift键开始框选）</label>
      </div>
    </div>

    <div id="viewshed-panel" class="sm-viewshed-panel" v-if="combinationMode" v-drag>
      <div
        class="sm-viewshed-toggle-btn"
        @click="toggleVisibility"
        :class="{'sm-viewshed-toggle-btn-only': !show}"
      >
        <span class="iconfont iconcaijian"></span>
      </div>
      <div class="sm-viewshed-content" :class="{'sm-viewshed-content-hidden' : !show}">
        <div class="sm-viewshed-panel-header">
          <span>框选</span>
        </div>
        <div class="sm-function-module-content">
          <div class="sm-function-module-sub-section">
            <label class="sm-function-module-sub-section-caption">选择模式:</label>
            <select class="sm-select" style="width:100%" v-model="selectVal">
              <option :value="1">重置模式</option>
              <option :value="2">并集模式</option>
              <option :value="4">交集模式</option>
              <option :value="8">减去模式</option>
            </select>
          </div>
          <div>
            <label class="sm-viewshed-label-right">实时选择:</label>
            <input style="margin-left: 10px" type="checkbox" v-model="isCallInMoving" />
          </div>
          <label class="media-hidden" style="font-size:12px">注：（按下Shift键开始框选）</label>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Sm3dSearchDrawrect",
  data() {
    return {
      drawrect: false,
      combinationMode: 1, //显示模式0组合，1单个
      show: true,
      selectVal: 1,
      isCallInMoving: false
    };
  },
  mounted() {
    this.tooltip = createTooltip(document.body);
    eventBus.$on("init", e => {
      this.start();
    });
  },
  methods: {
    toggleVisibility() {
      this.show = !this.show;
    },
    start() {
      let layers = scene.layers._layers._array;
      this.selectedObjs = Object.create(null, {});
      this.resetIds = Object.create(null, {});
      let that = this;
      /**
       * @param dom ScreenSpaceEventHandler操作的dom节点，画的框会成为其子节点
       */
      function DrawRectHandler(dom) {
        let startPoint,
          self = this,
          isShiftAndLeftDown = false,
          handler = new Cesium.ScreenSpaceEventHandler(dom),
          removalFunctions = [],
          rect = new Rect(dom);
        this.isDestroyed = false;
        this.activeEvt = new Cesium.Event();
        this.cancelEvt = new Cesium.Event();
        this.movingEvt = new Cesium.Event();
        this.drawEvt = new Cesium.Event();

        // div框
        function Rect(parentDom) {
          this.rect = document.createElement("div");
          this.rect.style.visibility = "hidden";
          parentDom.appendChild(this.rect);
          this.leftTopPoint = new Cesium.Cartesian2();
          this.rightBottomPoint = new Cesium.Cartesian2();
          Rect.prototype.setPosition = function(startPoint, endPosition) {
            let w = endPosition.x - startPoint.x;
            let h = endPosition.y - startPoint.y;
            let left, top, width, height;
            if (w < 0) {
              left = endPosition.x;
              width = -w;
            } else {
              left = startPoint.x;
              width = w;
            }
            if (h < 0) {
              top = endPosition.y;
              height = -h;
            } else {
              top = startPoint.y;
              height = h;
            }
            this.leftTopPoint = new Cesium.Cartesian2(left, top);
            this.rightBottomPoint = new Cesium.Cartesian2(
              left + width,
              top + height
            );
            this.rect.style = `position:fixed;top:${top}px;left:${left}px;width:${width}px;height:${height}px;border:2px dashed #333;`;
            this.setVisible(true);
          };
          Rect.prototype.setVisible = function(isVisible) {
            this.rect.style.visibility = isVisible ? "visible" : "hidden";
          };
          Rect.prototype.getRectPoint = function() {
            return {
              leftTopPoint: this.leftTopPoint,
              rightBottomPoint: this.rightBottomPoint
            };
          };
          Rect.prototype.destroy = function() {
            dom.removeChild(rect);
            this.rect = null;
          };
        }

        // canvas框
        function RectCanvas(parentDom) {
          let canvas = document.createElement("canvas"),
            ctx = canvas.getContext("2d");
          this.canvas = canvas;
          canvas.width = parentDom.clientWidth;
          canvas.height = parentDom.clientHeight;
          canvas.style = "position:fixed;top:0;left:0;z-index:-1";
          parentDom.appendChild(canvas);
          this.leftTopPoint = new Cesium.Cartesian2();
          this.rightBottomPoint = new Cesium.Cartesian2();
          RectCanvas.prototype.setPosition = function(startPoint, endPosition) {
            let w = endPosition.x - startPoint.x;
            let h = endPosition.y - startPoint.y;
            let left, top, width, height;
            if (w < 0) {
              left = endPosition.x;
              width = -w;
            } else {
              left = startPoint.x;
              width = w;
            }
            if (h < 0) {
              top = endPosition.y;
              height = -h;
            } else {
              top = startPoint.y;
              height = h;
            }
            this.leftTopPoint = new Cesium.Cartesian2(left, top);
            this.rightBottomPoint = new Cesium.Cartesian2(
              left + width,
              top + height
            );
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.strokeRect(left, top, width, height);
          };
          RectCanvas.prototype.setVisible = function(isVisible) {
            if (isVisible) {
              canvas.style.zIndex = "999";
            } else {
              canvas.style.zIndex = "-1";
            }
          };
          RectCanvas.prototype.getRectPoint = function() {
            return {
              leftTopPoint: this.leftTopPoint,
              rightBottomPoint: this.rightBottomPoint
            };
          };
          RectCanvas.prototype.destroy = function() {
            dom.removeChild(canvas);
            ctx = null;
            this.canvas = null;
          };
        }

        // 开关相机控制
        function setCameraCtrl(isActive) {
          let cameraCtrl = scene.screenSpaceCameraController;
          cameraCtrl.enableRotate = isActive;
          cameraCtrl.enableTranslate = isActive;
          cameraCtrl.enableZoom = isActive;
          cameraCtrl.enableTilt = isActive;
          cameraCtrl.enableLook = isActive;
        }

        // 鼠标cursor控制
        function toggleCursorStyle(isActive) {
          if (isActive) {
            viewer.enableCursorStyle = false;
            viewer._element.style.cursor = "";
            dom.style.cursor = "default";
          } else {
            viewer.enableCursorStyle = true;
          }
        }

        // 初始化事件处理
        function initEvent() {
          handler.setInputAction(
            function(e) {
              isShiftAndLeftDown = true;
              startPoint = new Cesium.Cartesian2(e.position.x, e.position.y);
              rect.setVisible(true);
            },
            Cesium.ScreenSpaceEventType.LEFT_DOWN,
            Cesium.KeyboardEventModifier.SHIFT
          );
          // shift松开时，始终将rect隐藏
          let keyUpFunction = function(e) {
            self.cancelEvt.raiseEvent();
            if (e.key == "Shift" && isShiftAndLeftDown && !self.isDestroyed) {
              isShiftAndLeftDown = false;
              rect.setVisible(false);
            }
          };
          document.addEventListener("keyup", keyUpFunction);
          removalFunctions.push(function() {
            document.removeEventListener("keyup", keyUpFunction);
          });

          handler.setInputAction(
            function(e) {
              let endPosition = e.endPosition;
              self.activeEvt.raiseEvent(endPosition);
              if (!isShiftAndLeftDown) return;
              rect.setPosition(startPoint, endPosition);
              self.movingEvt.raiseEvent(rect.getRectPoint());
            },
            Cesium.ScreenSpaceEventType.MOUSE_MOVE,
            Cesium.KeyboardEventModifier.SHIFT
          );
          handler.setInputAction(
            function(e) {
              isShiftAndLeftDown = false;
              rect.setVisible(false);
              self.drawEvt.raiseEvent(rect.getRectPoint());
            },
            Cesium.ScreenSpaceEventType.LEFT_UP,
            Cesium.KeyboardEventModifier.SHIFT
          );
          handler.setInputAction(function(e) {
            isShiftAndLeftDown = false;
            rect.setVisible(false);
          }, Cesium.ScreenSpaceEventType.LEFT_UP);
        }

        // 移除事件监听
        function removeEvent() {
          handler.removeInputAction(
            Cesium.ScreenSpaceEventType.LEFT_DOWN,
            Cesium.KeyboardEventModifier.SHIFT
          );
          handler.removeInputAction(
            Cesium.ScreenSpaceEventType.MOUSE_MOVE,
            Cesium.KeyboardEventModifier.SHIFT
          );
          handler.removeInputAction(
            Cesium.ScreenSpaceEventType.LEFT_UP,
            Cesium.KeyboardEventModifier.SHIFT
          );
          handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_UP);
        }

        DrawRectHandler.prototype.destroy = function() {
          if (this.isDestroyed) return;
          setCameraCtrl(true);
          removeEvent();
          for (let i = 0, j = removalFunctions.length; i < j; i++) {
            removalFunctions[i]();
          }
          handler.destroy();
          rect.destroy();
          rect = null;
          this.isDestroyed = true;
        };
        DrawRectHandler.prototype.activate = function() {
          if (this.isDestroyed) return;
          setCameraCtrl(false);
          toggleCursorStyle(true);
          initEvent();
        };
        DrawRectHandler.prototype.deactivate = function() {
          if (this.isDestroyed) return;
          setCameraCtrl(true);
          toggleCursorStyle(false);
          removeEvent();
        };
      }

      for (let layer of layers) {
        layer.selectColorType = 1;
        that.selectedObjs[layer.name] = [];
        that.resetIds[layer.name] = [];
      }

      let drawRect = (that.drawRect = new DrawRectHandler(document.body));
      // res为框的左上点与右下点的相对于给定dom节点的坐标
      drawRect.drawEvt.addEventListener(function(res) {
        for (let layer of layers) {
          layer.selectColorType = 1;
        }
        that.tooltip.setVisible(false);
        let selectedColor = new Cesium.Color(1, 0, 0, 1);
        scene.pickRect(res.leftTopPoint, res.rightBottomPoint);
        let objs = scene.getPickRectIDs();
        let selectedObjs = that.selectedObjs;
        let resetIds = that.resetIds;
        for (let k in selectedObjs) {
          scene.layers.find(k).removeObjsColor(selectedObjs[k]);
        }
        for (let layer of layers) {
          let layerName = layer.name;
          let layerSlt = objs.find(e => e.layerName === layerName);
          let sltIds = (layerSlt && layerSlt.ids) || [];
          let lastIds = selectedObjs[layerName];
          switch (that.selectVal) {
            case 1:
              resetIds[layerName] = selectedObjs[layerName];
              selectedObjs[layerName] = sltIds;
              break;
            case 2:
              resetIds[layerName] = [];
              selectedObjs[layerName] = _.union(lastIds, sltIds);
              break;
            case 4:
              selectedObjs[layerName] = _.intersection(lastIds, sltIds);
              break;
            case 8:
              selectedObjs[layerName] = _.difference(lastIds, sltIds);
              break;
            default:
              break;
          }
          layer.setObjsColor(selectedObjs[layerName], selectedColor);
        }
      });
      drawRect.movingEvt.addEventListener(function(res) {
        that.tooltip.showAt(
          res.rightBottomPoint,
          "<p>松开鼠标左键以结束选择区域</p>"
        );
        if (that.isCallInMoving) {
          for (let layer of layers) {
            layer.selectColorType = 1;
          }
          scene.pickRect(res.leftTopPoint, res.rightBottomPoint);
        }
      });
      drawRect.activeEvt.addEventListener(function(position) {
        that.tooltip.showAt(position, "<p>点击鼠标左键以开始选择区域</p>");
      });
      drawRect.cancelEvt.addEventListener(function() {
        that.tooltip.setVisible(false);
      });

      let canvas = document.querySelector("div.cesium-widget canvas");
      canvas.setAttribute("tabindex", "0"); // needed to put focus on the canvas
      canvas.focus();
      document.addEventListener("keydown", function(e) {
        if (e.key === "Shift") {
          drawRect.activate();
        }
      });
      document.addEventListener("keyup", function(e) {
        if (e.key === "Shift") {
          drawRect.deactivate();
        }
      });
    }
  },
  beforeMount() {
    eventBus.$emit("sendPname", {
      type: "search",
      name: "框选",
      value: this.drawrect
    });
    eventBus.$on("sendCname", e => {
      if (this.clipPlaneMode) {
        this.clipPlaneMode = 0;
      }
      if (e == "框选") {
        this.drawrect = true;
      } else {
        this.drawrect = false;
      }
    });
  }
};
</script>
<style lang="scss" scoped>
@import "drawRect";
</style>
