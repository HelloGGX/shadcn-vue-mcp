<script setup lang="ts">
import { ref, onMounted } from "vue";
import ComponentPreview from "./components/ComponentPreview.vue";

const code = ref("");

onMounted(() => {
  // 从 URL 参数中获取组件代码
  const urlParams = new URLSearchParams(window.location.search);
  const encodedCode = urlParams.get("code");
  if (encodedCode) {
    code.value = decodeURIComponent(encodedCode);
  }
});
</script>

<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">Shadcn Vue 组件预览</h1>
    <div class="border rounded-lg p-4 bg-white">
      <ComponentPreview :code="code" />
    </div>
  </div>
</template>
