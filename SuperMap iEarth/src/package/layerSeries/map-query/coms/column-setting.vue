<template>
    <n-popover placement="bottom" trigger="click" style="max-height: 240px" scrollable>
      <template #trigger>
          <n-tooltip placement="top-end" trigger="hover">
              <template #trigger>
                  <i class="iconfont iconSize iconshaixuan"></i>
              </template>
             {{ $t('global.filterFiledTip') }}
          </n-tooltip>
      </template>
      <div>
        <vue-draggable v-model="list" item-key="key">
          <template #item="{ element }">
            <div v-if="element.key" >
              <n-checkbox v-model:checked="element.checked">
                {{ element.title }}
              </n-checkbox>
            </div>
          </template>
        </vue-draggable>
      </div>
    </n-popover>
  </template>
  
  <script setup lang="ts">
  import { ref, watch } from 'vue';
  import type { DataTableColumn } from 'naive-ui';
  import VueDraggable from 'vuedraggable';
  
  type Column = DataTableColumn;
  
  interface Props {
    columns: Column[];
  }
  
  const props = defineProps<Props>();
  
  interface Emits {
    (e: 'update:columns', columns: Column[]): void;
  }
  
  const emit = defineEmits<Emits>();
  
  type List = Column & { checked?: boolean };
  
  const list = ref(initList());
  function initList(): List[] {
    return props.columns.map(item => ({ ...item, checked: true }));
  }
  
  watch(
    list,
    newValue => {
      const newColumns = newValue.filter(item => item.checked);
  
      const columns: Column[] = newColumns.map(item => {
        const column = { ...item };
        delete column.checked;
  
        return column;
      }) as Column[];
  
      emit('update:columns', columns);
    },
    { deep: true }
  );
  </script>
  
  <style scoped></style>
  