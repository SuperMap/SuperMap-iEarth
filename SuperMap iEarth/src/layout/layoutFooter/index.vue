<template>
  <n-layout-footer>
    <div class="footer"></div>
  </n-layout-footer>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped>
.footer {
  position: fixed;
  bottom: -0.03rem;
  @include setBackground(100%, 0.17rem, "@/assets/images/footer-bg.png");
  background-size: 100% 100%;
}
</style>
