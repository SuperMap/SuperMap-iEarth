
let scratchWindowPosition = new Cesium.Cartesian2();
let scratchCartesian3 = new Cesium.Cartesian3();
let scratchVLength = new Cesium.Cartesian3();
let scratchVZoomAxis = new Cesium.Cartesian3();
let scratchNormal = new Cesium.Cartesian3();
let scratchVecPre = new Cesium.Cartesian3();
let scratchVecCur = new Cesium.Cartesian3();
let scratchAxis = new Cesium.Cartesian3();
let scratchTiltFrame = new Cesium.Matrix4();
let scratchOldTransform = new Cesium.Matrix4();
let scratchDepthIntersection = new Cesium.Cartesian3();
let scratchRayIntersection = new Cesium.Cartesian3();
let scratchPickGlobeRay = new Cesium.Ray();
let listener;
function zoom(viewMode,diff){
  let scene = viewMode.viewer.scene;
  let camera = scene.camera;
  let canvas = scene.canvas;
  scratchWindowPosition.x = canvas.clientWidth / 2;
  scratchWindowPosition.y = canvas.clientHeight / 2;
  let rayIntersection = pickGlobe(viewMode,scratchWindowPosition);
  if(!Cesium.defined(rayIntersection)){
    return ;
  }
  let dCamDistance = Cesium.Cartesian3.distance(camera.position,rayIntersection);
  let dValue = diff * 0.0618 * 0.2;
  dValue = dCamDistance > 300 ? dValue : dValue*2;
  let dDeltaDistance = dCamDistance * dValue;

  //定点缩放
  Cesium.Cartesian3.subtract(rayIntersection,camera.position,scratchCartesian3);
  let dotProduct =  Cesium.Cartesian3.dot(scratchCartesian3,camera.right);
  Cesium.Cartesian3.multiplyByScalar(camera.right,dotProduct,scratchVLength);
  Cesium.Cartesian3.subtract(scratchCartesian3,scratchVLength,scratchVZoomAxis);
  Cesium.Cartesian3.normalize(scratchVZoomAxis,scratchNormal);
  camera.move(scratchNormal,dDeltaDistance);
  Cesium.Cartesian3.normalize(rayIntersection,scratchVecPre);
  let magnitude = Cesium.Cartesian3.magnitude(rayIntersection);
  let newEllipsoid = Cesium.Ellipsoid.fromCartesian3(magnitude);
  camera.pickEllipsoid(scratchWindowPosition,newEllipsoid,scratchVecCur);
  if(!Cesium.defined(scratchVecCur) || isNaN(scratchVecCur.x) || isNaN(scratchVecCur.y) || isNaN(scratchVecCur.z)){
    return;
  }
  Cesium.Cartesian3.normalize(scratchVecCur,scratchVecCur);
  if(camera._positionCartographic.height < 0){
    return;
  }
  let angle = Cesium.Cartesian3.angleBetween(scratchVecPre,scratchVecCur);
  if(Cesium.CesiumMath.equalsEpsilon(angle,0,Cesium.CesiumMath.EPSILON10)){
    return;
  }
  Cesium.Cartesian3.cross(scratchVecPre,scratchVecCur,scratchAxis);
  camera.rotate(scratchAxis,angle);
}

function pickGlobe(viewModel,mousePosition){
  let scene = viewModel.viewer.scene;
  let globe = scene.globe;
  let camera = scene.camera;
  if(!Cesium.defined(globe)){
    return undefined;
  }

  let depthIntersection;
  if(scene.pickPositionSupported){
    depthIntersection = scene.pickPositionWorldCoordinates(mousePosition,scratchDepthIntersection);
  }

  let ray = camera.getPickRay(mousePosition,scratchPickGlobeRay);
  let rayIntersection = globe.pick(ray,scene,scratchRayIntersection);

  let pickDistance = Cesium.defined(depthIntersection)? Cesium.Cartesian3(depthIntersection,camera.positionWC):Number.POSITIVE_INFINITY;
  let rayDistance = Cesium.defined(rayIntersection)? Cesium.Cartesian3(rayIntersection,camera.positionWC):Number.POSITIVE_INFINITY;

  if(pickDistance < rayDistance){
    return depthIntersection;
  }else{
    return rayIntersection;
  }
}

export default class CompassViewModel{

     constructor(options){
       this.viewer = options.viewer;
       this.scene = options.scene;
       this.heading = options.scene.camera.heading;
       this.defaultCameraPosition = new Cesium.Cartesian3.fromDegrees(110.60396458865515, 34.54408834959379, 30644793.325518917);
       this.viewerId = options.viewerId;
       this.viewerChanged = true;
       this._unsubcribeFromPostRender = undefined;

       let that = this;
       this.zoomInTickFunction = function(){
         if(that.viewer.scene.mode === Cesium.SceneMode.COLUMBUS_VIEW){
           that.viewer.scene.camera.zoomIn();
         }else{
           zoom(that,1);
         }
       };
       this.zoomOutTickFunction = function(){
         if(that.viewer.scene.mode === Cesium.SceneMode.COLUMBUS_VIEW){
           that.viewer.scene.camera.zoomOut();
         }else{
           zoom(that,-1);
         }
       };
       this.zoomInMouseUpFunction = function(){
         if(Cesium.defined(that.zoomInTickFunction)){
           that.viewer.clock.onTick.removeEventListener(that.zoomInTickFunction);
           document.removeEventListener("mouseup", that.zoomInMouseUpFunction);
         };
       };
       this.zoomOutMouseUpFunction = function(){
         if(Cesium.defined(that.zoomOutTickFunction)){
           that.viewer.clock.onTick.removeEventListener(that.zoomOutTickFunction);
           document.removeEventListener("mouseup", that.zoomOutMouseUpFunction);
         }
       };
     }

      //相机放大
      handleZoomInMouseDown(){
          if(Cesium.defined(this.zoomInTickFunction)){
             this.viewer.clock.onTick.removeEventListener(this.zoomInTickFunction);
             document.addEventListener("mouseup", this.zoomInMouseUpFunction);
          }
          this.viewer.clock.onTick.addEventListener(this.zoomInTickFunction);
          document.addEventListener("mouseup", this.zoomInMouseUpFunction);
     }

      //相机缩小
      handleZoomOutMouseDown(){
          if(Cesium.defined(this.zoomOutTickFunction)){
             this.viewer.clock.onTick.removeEventListener(this.zoomOutTickFunction);
             document.addEventListener("mouseup", this.zoomOutMouseUpFunction);
          }
          this.viewer.clock.onTick.addEventListener(this.zoomOutTickFunction);
          document.addEventListener("mouseup", this.zoomOutMouseUpFunction);
      }


      //相机复位
      resetCameraPosition(){
        let that = this;
        this.viewer.camera.flyTo({
          destination: this.defaultCameraPosition
        });
        let cameraListener = function(){
          if( Cesium.Math.toDegrees(scene.camera.heading) === 360){
            that.viewerChanged = false;
            that.handleViewerChange();
            that.viewer.clock.onTick.removeEventListener(cameraListener);
          }
        }
        this.viewerChanged = true;
        this.handleViewerChange();
        this.viewer.clock.onTick.addEventListener(cameraListener);
      }

      //相机指北
      compassPointingNorth(){
        let that = this;
        let scene = this.scene;
        scratchWindowPosition.x = scene.canvas.clientWidth / 2;
        scratchWindowPosition.y = scene.canvas.clientHeight / 2;
        let viewCenter = viewer.scene.pickPosition(scratchWindowPosition);
        if (!viewCenter || listener !== undefined) {
          return;
        }
        let tiltFrame = Cesium.Transforms.eastNorthUpToFixedFrame(viewCenter, scene.globe.ellipsoid,scratchTiltFrame);
        let rotateAngle;
        listener = setInterval(function(){
          let currentHeading = Cesium.Math.toDegrees(viewer.scene.camera.heading);
          let oldTransform = Cesium.Matrix4.clone(viewer.scene.camera.transform,scratchOldTransform);
          viewer.scene.camera.lookAtTransform(tiltFrame);
          if(currentHeading > 180 && currentHeading < 360){
            rotateAngle = Cesium.Math.toRadians(360 - currentHeading)/3;
            viewer.scene.camera.rotateLeft(rotateAngle); //顺时针旋转
            viewer.scene.camera.lookAtTransform(oldTransform);
            if((360 - currentHeading) < 1){             //罗盘指北移除监听
              that.viewerChanged = false;
              that.handleViewerChange();
              clearInterval(listener);
              listener = undefined;
            }
          }else{
            rotateAngle = Cesium.Math.toRadians(currentHeading)/3;
            viewer.scene.camera.rotateRight(rotateAngle);  //逆时针旋转
            viewer.scene.camera.lookAtTransform(oldTransform);
            if((1-currentHeading) > 0 ){        //罗盘指北移除监听
              that.viewerChanged = false;
              that.handleViewerChange();
              clearInterval(listener);
              listener = undefined;
            }
          }
        },50);
        this.viewerChanged = true;
        this.handleViewerChange();
      };

      //相机指北针功能
      handleViewerChange (){
       let that = this;
       if(Cesium.defined(this._unsubcribeFromPostRender)){
         this._unsubcribeFromPostRender();
         this._unsubcribeFromPostRender = undefined;
       }
       if(this.viewerChanged){
       this._unsubcribeFromPostRender = this.scene.postRender.addEventListener(function(){
           //避免camera.heading突变造成罗盘方位错误
           //diff < CesiumMath.PI_OVER_TWO 排除PI左右的突变量
           //diff > CesiumMath.PI_OVER_TWO * 3 包含2PI和0之间的偏差
           let diff = Math.abs(that.scene.camera.heading - that.heading);
           if(diff < Cesium.Math.PI_OVER_TWO || diff > Cesium.Math.PI_OVER_TWO * 3){
             that.heading = that.scene.camera.heading;
             if(Cesium.defined(that.heading)){
               let x = Cesium.Math.toDegrees(that.heading);
               let transfromdegress = -x;
               let degrees = "rotate(" + transfromdegress + "deg)";
               document.getElementById(that.viewerId).style.transform = degrees;
             }
           }
       });
     }
   };

}



