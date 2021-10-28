import Vue from 'vue';

Vue.directive('drag',{

  inserted:function(el,binding){
      el.onmousedown=function(e){
          e.stopPropagation();
          let disx = e.pageX - el.offsetLeft;
          let disy = e.pageY - el.offsetTop;
          document.onmousemove = function (e){
              e.preventDefault();
              el.style.left = e.pageX - disx+'px';
              el.style.top = e.pageY - disy+'px';
          }
          document.onmouseup = function(){
              document.onmousemove = document.onmouseup = null;
              //binding 传参，可忽略
              if(binding && binding.value){
                  binding.value.clientX=parseInt(el.style.left);
                  binding.value.clientY=parseInt(el.style.top);
              }

          }
      }
  },

});
