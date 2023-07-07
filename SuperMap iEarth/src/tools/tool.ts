

const SuperMap3D = window.SuperMap3D;

// 获取两点的角度和弧度
function getAngleAndRadian(pointA:any, pointB:any) {
    //建立以点A为原点，X轴为east,Y轴为north,Z轴朝上的坐标系
    const transform = SuperMap3D.Transforms.eastNorthUpToFixedFrame(pointA);
    //向量AB
    const positionvector = SuperMap3D.Cartesian3.subtract(pointB, pointA, new SuperMap3D.Cartesian3());
    //因transform是将A为原点的eastNorthUp坐标系中的点转换到世界坐标系的矩阵
    //AB为世界坐标中的向量
    //因此将AB向量转换为A原点坐标系中的向量，需乘以transform的逆矩阵。
    const vector = SuperMap3D.Matrix4.multiplyByPointAsVector(SuperMap3D.Matrix4.inverse(transform, new SuperMap3D.Matrix4()), positionvector, new SuperMap3D.Cartesian3());
    //归一化
    const direction = SuperMap3D.Cartesian3.normalize(vector, new SuperMap3D.Cartesian3());
    //heading
    const heading1 = Math.atan2(direction.y, direction.x) - SuperMap3D.Math.PI_OVER_TWO;
  
    let radian = SuperMap3D.Math.TWO_PI - SuperMap3D.Math.zeroToTwoPi(heading1);
    var angle = radian * (180 / Math.PI);
    if (angle < 0) {
        angle = angle + 360;
    }
    return {angle,radian};
  }

  //坐标转化
//笛卡尔转经纬度
const CartesiantoDegrees = (Cartesians:any) => {
  let array = [].concat(Cartesians);
  let positions:number[] = [];
  for (let i = 0, len = array.length; i < len; i++) {
    let cartographic:any = SuperMap3D.Cartographic.fromCartesian(array[i]);
    // let longitude:number = Number(SuperMap3D.Math.toDegrees(cartographic.longitude).toFixed(2));
    // let latitude:number = Number(SuperMap3D.Math.toDegrees(cartographic.latitude).toFixed(2));
    // let h:number = Number(cartographic.height.toFixed(2));
    let longitude:number = Number(SuperMap3D.Math.toDegrees(cartographic.longitude));
    let latitude:number = Number(SuperMap3D.Math.toDegrees(cartographic.latitude));
    let h:number = Number(cartographic.height);
    if (positions.indexOf(longitude) == -1 && positions.indexOf(latitude) == -1) {
      positions.push(longitude);
      positions.push(latitude);
      positions.push(h);
    }
  }
  return positions
};

  const CartesiantoDegreesTestTS = (Cartesians:any):number[] => {
    let array = [].concat(Cartesians);
    let positions:number[] = [];
    for (let i = 0, len = array.length; i < len; i++) {
      let cartographic = SuperMap3D.Cartographic.fromCartesian(array[i]);
      let longitude:number = SuperMap3D.Math.toDegrees(cartographic.longitude);
      let latitude:number = SuperMap3D.Math.toDegrees(cartographic.latitude);
      let h:number = cartographic.height;
      if (positions.indexOf(longitude) == -1 && positions.indexOf(latitude) == -1) {
        positions.push(longitude);
        positions.push(latitude);
        positions.push(h);
      }
    }
    return positions
  };


  //笛卡尔转经纬度(每个点是独立的对象)
const CartesiantoDegreesObjs = (Cartesians) => {
  let array = [].concat(Cartesians);
  let positions:any[] = [];
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

// 获取渐变色函数
function gradientColors(start:any, end:any, steps:number, gamma:number) {
  var i, j, ms, me, output:any[] = [], so:any[] = [];
  gamma = gamma || 1;
  var normalize = function (channel) {
    return Math.pow(channel / 255, gamma);
  };
  start = parseColor(start).map(normalize);
  end = parseColor(end).map(normalize);
  for (i = 0; i < steps; i++) {
    ms = i / (steps - 1);
    me = 1 - ms;
    for (j = 0; j < 3; j++) {
      so[j] = pad(Math.round(Math.pow(start[j] * me + end[j] * ms, 1 / gamma) * 255).toString(16));
    }
    output.push('#' + so.join(''));
  }
  return output;
  function parseColor(hexStr) {
    return hexStr.length === 4 ? hexStr.substr(1).split('').map(function (s) { return 0x11 * parseInt(s, 16); }) : [hexStr.substr(1, 2), hexStr.substr(3, 2), hexStr.substr(5, 2)].map(function (s) { return parseInt(s, 16); })
  };
  // zero-pad 1 digit to 2
  function pad(s) {
    return (s.length === 1) ? '0' + s : s;
  }
};

// // 设置所有color-pick的初始样式-渐变条纹
// function setAllColorPickBg(){
//   document.querySelectorAll('.n-color-picker-trigger__fill div:nth-child(2)').forEach((el:any)=>{
//     el.style.backgroundImage = "linear-gradient(to right, rgb(255, 191, 112), rgb(52, 153, 229), rgb(1, 212, 219))";
//   })
// }

// // 移除指定color-pick的条纹样式
// function clearColorPickBgByIndex(index:number){
//   let el:any = document.querySelectorAll('.n-color-picker-trigger__fill div:nth-child(2)')[index];
//   if(el) el.style.backgroundImage = "none";
// }

function getPitch(pointA:any, pointB:any){
  let transfrom = SuperMap3D.Transforms.eastNorthUpToFixedFrame(pointA);
  const vector = SuperMap3D.Cartesian3.subtract(pointB, pointA, new SuperMap3D.Cartesian3());
  let direction = SuperMap3D.Matrix4.multiplyByPointAsVector(SuperMap3D.Matrix4.inverse(transfrom, transfrom), vector, vector);
  SuperMap3D.Cartesian3.normalize(direction, direction);
  //因为direction已归一化，斜边长度等于1，所以余弦函数等于direction.z
  let radian =  SuperMap3D.Math.PI_OVER_TWO - SuperMap3D.Math.acosClamped(direction.z);
  var angle = radian * (180 / Math.PI);
  if (angle < 0) {
      angle = angle + 360;
  }
  return {angle,radian};
}

  export default{
    getAngleAndRadian,
    CartesiantoDegrees,
    CartesiantoDegreesTestTS,
    CartesiantoDegreesObjs,
    gradientColors,
    // setAllColorPickBg,
    // clearColorPickBgByIndex
    getPitch,
  }