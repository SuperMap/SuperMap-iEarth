<template>
  <!-- svg加载图 -->
  <!-- <div class="go-loading-svg go-flex-center loading-position">
    <img src="@/assets/images/loadingSvg1.svg" alt="" style="width:100px ; height:100px;" />
  </div> -->
  <div id='loadingbar' class="spinner">
    <div class="spinner-container container1">
        <div class="circle1"></div>
        <div class="circle2"></div>
        <div class="circle3"></div>
        <div class="circle4"></div>
    </div>
    <div class="spinner-container container2">
        <div class="circle1"></div>
        <div class="circle2"></div>
        <div class="circle3"></div>
        <div class="circle4"></div>
    </div>
    <div class="spinner-container container3">
        <div class="circle1"></div>
        <div class="circle2"></div>
        <div class="circle3"></div>
        <div class="circle4"></div>
    </div>
</div>

</template>
<style lang="scss" scoped>
// .loading-position {
//   width: 100%;
//   height: 100%;
//   background-color: #000;
//   img{
//     position: relative;
//     top: calc(50% - 50px);
//     left: calc(50% - 50px);
//   }
// }
.spinner {
    margin: auto;
    width: 60px;
    height: 60px;
    position: absolute ;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    z-index: 999;
}

.full-screen-mask {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    margin: 0;
}
// .full-screen-mask,
// .full-screen-mask-overlay:before {
//     background: rgba(0, 0, 0, 0.5);
// }
// .full-screen-mask {
//     -webkit-box-align: center;
//     -webkit-align-items: center;
//     -ms-flex-align: center;
//     align-items: center;
//     display: -webkit-box;
//     display: -webkit-flex;
//     display: -ms-flexbox;
//     display: flex;
//     -webkit-box-pack: center;
//     -webkit-justify-content: center;
//     -ms-flex-pack: center;
//     justify-content: center;
// }
// .full-screen-mask-overlay {
//     max-height: 200px;
//     margin: 0 auto;
//     max-width: 768px;
//     padding: 50px;
//     position: relative;
//     color: white;
//     font-family: 'Lato';
//     position: relative;
//     text-align: center;
//     margin-bottom: 13%;
// }
// .full-screen-mask-overlay:before {
//     content: '';
//     -webkit-filter: blur(100px);
//     filter: blur(100px);
//     height: 100%;
//     left: 0;
//     position: absolute;
//     top: 0;
//     width: 100%;
//     z-index: -1;
// }

.container1 > div, .container2 > div, .container3 > div {
    width: 16px;
    height: 16px;
    /*background-color: #67cf22;*/
    background-color: #3498db;
    border-radius: 100%;
    position: absolute;
    -webkit-animation: bouncedelay 1.2s infinite ease-in-out;
    animation: bouncedelay 1.2s infinite ease-in-out;
    -webkit-animation-fill-mode: both;
    animation-fill-mode: both;
}

.spinner .spinner-container {
    position: absolute;
    width: 100%;
    height: 100%;
}

.container2 {
    -webkit-transform: rotateZ(45deg);
    transform: rotateZ(45deg);
}

.container3 {
    -webkit-transform: rotateZ(90deg);
    transform: rotateZ(90deg);
}

.circle1 { top: 0; left: 0; }
.circle2 { top: 0; right: 0; }
.circle3 { right: 0; bottom: 0; }
.circle4 { left: 0; bottom: 0; }

.container2 .circle1 {
    -webkit-animation-delay: -1.1s;
    animation-delay: -1.1s;
}

.container3 .circle1 {
    -webkit-animation-delay: -1.0s;
    animation-delay: -1.0s;
}

.container1 .circle2 {
    -webkit-animation-delay: -0.9s;
    animation-delay: -0.9s;
}

.container2 .circle2 {
    -webkit-animation-delay: -0.8s;
    animation-delay: -0.8s;
}

.container3 .circle2 {
    -webkit-animation-delay: -0.7s;
    animation-delay: -0.7s;
}

.container1 .circle3 {
    -webkit-animation-delay: -0.6s;
    animation-delay: -0.6s;
}

.container2 .circle3 {
    -webkit-animation-delay: -0.5s;
    animation-delay: -0.5s;
}

.container3 .circle3 {
    -webkit-animation-delay: -0.4s;
    animation-delay: -0.4s;
}

.container1 .circle4 {
    -webkit-animation-delay: -0.3s;
    animation-delay: -0.3s;
}

.container2 .circle4 {
    -webkit-animation-delay: -0.2s;
    animation-delay: -0.2s;
}

.container3 .circle4 {
    -webkit-animation-delay: -0.1s;
    animation-delay: -0.1s;
}
</style>
