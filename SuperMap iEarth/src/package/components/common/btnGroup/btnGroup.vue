<template>
  <rowLayOut lableWidth="0.77rem">
    <template #item-content>
      <div class="btn-group">
        <slot name="btn-left"></slot>
        <slot name="btn-right"></slot>
      </div>
    </template>
  </rowLayOut>
</template>

<script setup lang="ts">
import rowLayOut from "../rowLayOut/rowLayOut.vue";
</script>

<style lang="scss" scoped>
.btn-group {
  margin-left: 0.18rem;
  margin-top: 0.1rem;
}
</style>