import ResourceCN from "@/resource/resourceCN"
import ResourceEN from "@/resource/resourceEN"
import ResourceJA from "@/resource/resourceJA"

import iEarth_resource_services_CN from "@/data/iEarth_resource_services_CN.json";
import specialEffects_CN from "@/data/specialEffects_CN.json";
import hotSpots_CN from "@/data/hotSpots_CN.json";
import iEarth_resource_services_EN from "@/data/iEarth_resource_services_EN.json";
import specialEffects_EN from "@/data/specialEffects_EN.json";
import hotSpots_EN from "@/data/hotSpots_EN.json";
import iEarth_resource_services_JA from "@/data/iEarth_resource_services_JA.json";
import specialEffects_JA from "@/data/specialEffects_JA.json";
import hotSpots_JA from "@/data/hotSpots_JA.json";

var currentLanguage, Resource;
var cookieLanguage = getLang().toLowerCase();
if (cookieLanguage !== undefined) {
  currentLanguage = cookieLanguage;
} else {
  currentLanguage = (navigator.language || navigator.browserLanguage).toLowerCase(); // 获取当前浏览器的语言
}
if (currentLanguage.startsWith('zh')) {
  Resource = ResourceCN;
  window.iEarth_resource_services = iEarth_resource_services_CN;
  window.specialEffects = specialEffects_CN;
  window.hotSpots = hotSpots_CN;

  setInterval(()=>{
    if(document.getElementsByClassName("ivu-input-small").length >= 1){
      document.getElementsByClassName('ivu-input-small')[0].style.width = "90%";
    }
  })

} else if (currentLanguage.startsWith('ja')) {
  Resource = ResourceJA;
  window.iEarth_resource_services = iEarth_resource_services_JA;
  window.specialEffects = specialEffects_JA;
  window.hotSpots = hotSpots_JA;
  inputCSS("static/css/cover_JA.css");
  let promise = inputJS("static/js/view-design/dist/locale/ja-JP.js");
  promise.then(() => {
    iview.lang('ja-JP');
  })

  
  setInterval(()=>{
    if(document.getElementsByClassName("ivu-btn-default").length >= 1){
      document.getElementsByClassName("ivu-btn-default")[0].innerText = "パージ";
      document.getElementsByClassName("ivu-btn-primary")[0].innerText = "確認";
      document.getElementsByClassName('ivu-input-small')[0].style.marginRight = "14px";
      document.getElementsByClassName('ivu-input-small')[0].style.width = "90%";
    }
  })

} else {
  Resource = ResourceEN;
  window.iEarth_resource_services = iEarth_resource_services_EN;
  window.specialEffects = specialEffects_EN;
  window.hotSpots = hotSpots_EN;
  inputCSS("static/css/cover_EN.css");
  let promise = inputJS("static/js/view-design/dist/locale/es-ES.js");
  promise.then(() => {
    iview.lang('es-ES');
  })

  setInterval(()=>{
    if(document.getElementsByClassName("ivu-btn-default").length >= 1){
      document.getElementsByClassName("ivu-btn-default")[0].innerText = "clear";
      document.getElementsByClassName("ivu-btn-primary")[0].innerText = "comfim";
      document.getElementsByClassName('ivu-input-small')[0].style.marginRight = "14px";
      document.getElementsByClassName('ivu-input-small')[0].style.width = "90%";
    }
  })
  
}

function getLang() {
  //浏览器语言  IE用browserLanguage，非IE使用language进行判断
  let lang = (navigator.language || navigator.browserLanguage).toLowerCase();
  window.lang = lang;
  //判断portal设置语言 通过cookie获取
  const cookies = document.cookie.split(';');
  if (cookies.length > 0) {
    cookies.forEach(function (cookie) {
      const arr = cookie.split('=');
      if (arr[0].toLowerCase().trim() === 'language') {
        lang = arr[1];
        return;
      }
    });
  }
  return lang;
};

function inputCSS(href) {
  let link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = href;
  document.getElementsByTagName("HEAD")[0].appendChild(link);
}

function inputJS(src) {
  return new Promise((resolve, reject) => {
    let newScript = document.createElement("script");
    newScript.type = 'text/javascript';
    newScript.src = src;
    document.body.appendChild(newScript);
    newScript.addEventListener('load', ev => { // when the js execute done
      resolve(src + "请求完成");
    });

  }).then(res => {
    // 此处的参数res代表成功请求到的数据
    console.log(res);
  }).catch(data => {
    // 此处的data代表网络请求失败后的错误信息
    console.log(data);
  });


}
export default Resource;