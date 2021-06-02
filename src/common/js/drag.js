// import Vue from 'vue'
import debounce from 'lodash/debounce'

export default function (Vue) {
  Vue.directive('drag', {
    bind(a, binding) {
      let isStart = false; // 是否已经开始拖拽
      let distance = {}; // 拖动的距离
      let l, t, x, y; // 当前被拖动的距离
      let w; // 当前屏幕宽度
      let h; // 当前屏幕的高度 // 移动端
      const dragElem = a;
      let firstTime = '',
        lastTime = ''; //记录鼠标按下松开时间

      dragElem.addEventListener(
        'touchstart',
        function (e) {
          isStart = true // 如果没有开始拖拽， 则可以拖拽
          if (!e.changedTouches[0]) return;
          const {
            clientX,
            clientY
          } = e.changedTouches[0];
          x = clientX - e.changedTouches[0].target.x;
          y = clientY - e.changedTouches[0].target.y;
          w = document.body.clientWidth; // 当前屏幕宽度
          h = document.body.clientHeight; // 当前屏幕的高度
        }, {
          passive: false
        }
      )
      debounce; //防抖

      dragElem.addEventListener(
        'touchmove',
        debounce(function (e) {
          // e.preventDefault()
          l = e.changedTouches[0].clientX - x;
          t = e.changedTouches[0].clientY - y;
          if (l < 0 && t < 0) {
            a.style.left = 0 + 'px';
            a.style.top = 0 + 'px';
          } else if (l < 0 && t + a.clientHeight < h) {
            a.style.left = 0 + 'px';
            a.style.top = t + 'px';
          } else if (l < 0 && t + a.clientHeight >= h) {
            a.style.left = 0 + 'px';
            a.style.top = h - a.clientHeight + 'px'
          } else if (l + a.clientWidth > w && t < 0) {
            a.style.left = w - a.clientWidth + 'px';
            a.style.top = 0 + 'px';
          } else if (l + a.clientWidth < w && t + a.clientHeight >= h) {
            a.style.left = l + 'px';
            a.style.top = h - a.clientHeight + 'px'
          } else if (l + a.clientWidth < w && t < 0) {
            a.style.left = l + 'px';
            a.style.top = 0 + 'px';
          } else if (l + a.clientWidth > w && t + a.clientHeight < h) {
            a.style.left = w - a.clientWidth + 'px';
            a.style.top = t + 'px';
          } else if (l + a.clientWidth > w && t + a.clientHeight >= h) {
            a.style.left = w - a.clientWidth + 'px';
            a.style.top = h - a.clientHeight + 'px';
          } else {
            a.style.left = l + 'px';
            a.style.top = t + 'px';
          }
        }, 5), {
          passive: false
        }
      );

      dragElem.addEventListener(
        'touchend',
        function (e) {
          isStart = false
          document.ontouchmove = null
          document.ontouchmove = null
          distance = {
            type: 'move',
            clientX: x - e.changedTouches[0].clientX, // 拖动的 x 距离
            clientY: y - e.changedTouches[0].clientY // 拖动的 y 距离
          }

          // binding.value(distance) // 返回拖动的距离
        }, {
          passive: false
        }
      );
      dragElem.onmousedown = function (e) {
        // e.stopPropagation();
        // e.preventDefault()
        if (e.target.className == "min-solider" || e.target.className == "sm-input sm-input-long"|| e.target.className == "sm-input-long" || e.target.className == "sm-input-right") { //
          e.stopPropagation();
          return;
        }
        dragElem.setAttribute('data-flag', false) //防止拖动时触发点击事件
        firstTime = new Date().getTime();
        // a.style.minWidth = a.clientWidth + 'px';

        w = document.body.clientWidth; // 当前屏幕宽度
        h = document.body.clientHeight; // 当前屏幕的高度
        if (isStart) return; // 如果已经开始拖拽， 返回
        isStart = true; // 如果没有开始拖拽， 则可以拖拽
        const {
          clientX,
          clientY
        } = e;
        const x = clientX - a.offsetLeft;
        const y = clientY - a.offsetTop;
        document.onmousemove = debounce(function (e) {
          e.preventDefault();
          // e.stopPropagation();
          l = e.clientX - x;
          t = e.clientY - y;
          if (l < 0 && t < 0) {
            a.style.left = 0 + 'px';
            a.style.top = 0 + 'px';
          } else if (l < 0 && t + a.clientHeight < h) {
            a.style.left = 0 + 'px';
            a.style.top = t + 'px';
          } else if (l < 0 && t + a.clientHeight >= h) {
            a.style.left = 0 + 'px';
            a.style.top = h - a.clientHeight + 'px';
          } else if (l + a.clientWidth > w && t < 0) {
            a.style.left = w - a.clientWidth + 'px';
            a.style.top = 0 + 'px';
          } else if (l + a.clientWidth < w && t + a.clientHeight >= h) {
            a.style.left = l + 'px';
            a.style.top = h - a.clientHeight + 'px'
          } else if (l + a.clientWidth < w && t < 0) {
            a.style.left = l + 'px';
            a.style.top = 0 + 'px';
          } else if (l + a.clientWidth > w && t + a.clientHeight < h) {
            a.style.left = w - a.clientWidth + 'px';
            a.style.top = t + 'px';
          } else if (l + a.clientWidth > w && t + a.clientHeight >= h) {
            a.style.left = w - a.clientWidth + 'px';
            a.style.top = h - a.clientHeight + 'px';
          } else {
            a.style.left = l + 'px';
            a.style.top = t + 'px';
          }
        }, 5)

        document.onmouseup = function (e) {
          document.onmousedown = null;
          document.onmousemove = null;
          isStart = false;
          // onmouseup 时的时间，并计算差值
          lastTime = new Date().getTime();
          if ((lastTime - firstTime) < 200) {
            dragElem.setAttribute('data-flag', true)
          }
          distance = {
            type: 'move',
            clientX: clientX - e.clientX, // 拖动的 x 距离
            clientY: clientY - e.clientY // 拖动的 y 距离
          }


          // binding.value(distance) // 返回拖动的距离
        }
      }
    }
  })
}
