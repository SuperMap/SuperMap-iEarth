<template>
<canvas id="loadingbar"></canvas>
</template>

<script>
let $ = {}
export default {
  name: "loadingBar",
  data() {
    return {
    }
  },
  methods: {
  },
  mounted() {
  $.Particle = function(opt) {
    this.radius = 7;
    this.x = opt.x;
    this.y = opt.y;
    this.angle = opt.angle;
    this.speed = opt.speed;
    this.accel = opt.accel;
    this.decay = 0.01;
    this.life = 1;
};

$.Particle.prototype.step = function(i) {
    this.speed += this.accel;
    this.x += Math.cos(this.angle) * this.speed;
    this.y += Math.sin(this.angle) * this.speed;
    this.angle += $.PI / 64;
    this.accel *= 1.01;
    this.life -= this.decay;

    if (this.life <= 0) {
        $.particles.splice(i, 1);
    }
};

$.Particle.prototype.draw = function(i) {
    $.ctx.fillStyle = $.ctx.strokeStyle = 'hsla(' + ($.tick + (this.life * 120)) + ', 100%, 60%, ' + this.life + ')';
    $.ctx.beginPath();
    if ($.particles[i - 1]) {
        $.ctx.moveTo(this.x, this.y);
        $.ctx.lineTo($.particles[i - 1].x, $.particles[i - 1].y);
    }
    $.ctx.stroke();

    $.ctx.beginPath();
    $.ctx.arc(this.x, this.y, Math.max(0.001, this.life * this.radius), 0, $.TWO_PI);
    $.ctx.fill();

    var size = Math.random() * 1.25;
    $.ctx.fillRect(~~(this.x + ((Math.random() - 0.5) * 35) * this.life), ~~(this.y + ((Math.random() - 0.5) * 35) * this.life), size, size);
}

$.step = function() {
    $.particles.push(new $.Particle({
        x: $.width / 2 + Math.cos($.tick / 20) * $.min / 2,
        y: $.height / 2 + Math.sin($.tick / 20) * $.min / 2,
        angle: $.globalRotation + $.globalAngle,
        speed: 0,
        accel: 0.01
    }));

    $.particles.forEach(function(elem, index) {
        elem.step(index);
    });

    $.globalRotation += $.PI / 6;
    $.globalAngle += $.PI / 6;
};

$.draw = function() {
    $.ctx.clearRect(0, 0, $.width, $.height);

    $.particles.forEach(function(elem, index) {
        elem.draw(index);
    });
};

$.init = function() {
  if($.particles ){$.particles=[];
  }
    $.canvas = document.getElementsByTagName('canvas')[0];
    $.ctx = $.canvas.getContext('2d');
    $.width = 260;
    $.height = 260;
    $.canvas.width = $.width * window.devicePixelRatio;
    $.canvas.height = $.height * window.devicePixelRatio;
    $.canvas.style.width = $.width + 'px';
    $.canvas.style.height = $.height + 'px';
    $.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    $.min = $.width * 0.5;
    $.particles = [];
    $.globalAngle = 0;
    $.globalRotation = 0;
    $.tick = 0;
    $.PI = Math.PI;
    $.TWO_PI = $.PI * 2;
    $.ctx.globalCompositeOperation = 'lighter';
    // document.body.appendChild($.canvas);
    $.loop();


};

$.loop = function() {
    requestAnimationFrame($.loop);
    $.step();
    $.draw();
    $.tick++;
};

$.init();
  },
}

</script>

<style lang="scss" scoped>
canvas {
  bottom: 0;
  left: 0;
  margin: auto;
  position: absolute;
  right: 0;
  top: 0;
  z-index: 999999;
}
</style>
