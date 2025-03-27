<template>
  <n-layout-footer>
    <div class="footer"></div>
  </n-layout-footer>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped>
.footer {
  position: fixed;
  bottom: 0rem;
  @include setBackground(100%, 30px, "@/assets/images/footer-bg.png");
  background-size: 100% 100%;
}
</style>
