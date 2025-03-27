<template></template>

<script lang="ts" setup>
import { useMessage, useNotification } from "naive-ui";

//挂载在 window 方便调用
window["$message"] = useMessage();
window["$notification"] = useNotification();
</script>
