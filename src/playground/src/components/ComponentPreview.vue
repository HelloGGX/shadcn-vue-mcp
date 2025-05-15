<script setup lang="ts">
import { ref, watch, defineProps, onMounted } from "vue";
import { createApp, defineComponent } from "vue";
import * as uiComponents from "./ui";

const props = defineProps<{
  code: string;
}>();

const previewContainer = ref<HTMLElement | null>(null);
const error = ref<string | null>(null);

// 解析完整的 Vue 组件代码
const parseVueComponent = (code: string) => {
  try {
    // 提取各个部分
    const templateMatch = code.match(/<template>([\s\S]*?)<\/template>/);
    const scriptSetupMatch = code.match(/<script setup[\s\S]*?>([\s\S]*?)<\/script>/);
    const scriptMatch = code.match(/<script[\s\S]*?(?<!setup)>([\s\S]*?)<\/script>/);
    const styleMatch = code.match(/<style[\s\S]*?>([\s\S]*?)<\/style>/);

    // 提取模板内容
    const template = templateMatch ? templateMatch[1] : "";

    // 提取脚本内容
    const scriptSetup = scriptSetupMatch ? scriptSetupMatch[1] : "";
    const script = scriptMatch ? scriptMatch[1] : "";

    // 提取样式内容
    const style = styleMatch ? styleMatch[1] : "";

    return { template, scriptSetup, script, style };
  } catch (e) {
    console.error("解析组件代码失败:", e);
    error.value = e instanceof Error ? e.message : "解析组件代码时发生未知错误";
    return { template: "", scriptSetup: "", script: "", style: "" };
  }
};

// 动态渲染组件
const renderComponent = (code: string) => {
  if (!previewContainer.value) return;

  // 清空容器
  previewContainer.value.innerHTML = "";
  error.value = null;

  try {
    // 创建一个新的 div 作为挂载点
    const mountEl = document.createElement("div");
    previewContainer.value.appendChild(mountEl);

    // 解析组件代码
    const { template, scriptSetup, script, style } = parseVueComponent(code);

    // 如果只有模板部分，使用简单的渲染方式
    if (template && !scriptSetup && !script) {
      const AsyncComp = defineComponent({
        template,
        components: { ...uiComponents },
      });

      const app = createApp(AsyncComp);
      app.mount(mountEl);
      return;
    }

    // 处理完整组件代码
    // 创建样式元素
    if (style) {
      const styleEl = document.createElement("style");
      styleEl.textContent = style;
      document.head.appendChild(styleEl);
    }

    // 尝试评估脚本代码并创建组件
    let setupCode = "";
    let dataObj = {};

    // 处理 setup 脚本
    if (scriptSetup) {
      // 这里简化处理，实际上需要更复杂的解析
      setupCode = scriptSetup;
    }

    // 处理普通脚本
    if (script) {
      try {
        // 提取变量和方法
        const scriptFn = new Function(`
          let exports = {};
          ${script}
          return { exports };
        `);
        const result = scriptFn();
        dataObj = result.exports || {};
      } catch (e) {
        console.error("评估脚本代码失败:", e);
      }
    }

    // 创建组件
    const AsyncComp = defineComponent({
      template,
      components: { ...uiComponents },
      setup() {
        try {
          // 简单的 setup 函数评估
          if (setupCode) {
            const setupFn = new Function(`
              return function(props) {
                ${setupCode}
                return {};
              }
            `)();
            return setupFn({});
          }
          return {};
        } catch (e) {
          console.error("执行 setup 函数失败:", e);
          return {};
        }
      },
      data() {
        return { ...dataObj };
      },
    });

    const app = createApp(AsyncComp);

    // 注册 UI 组件
    Object.entries(uiComponents).forEach(([name, component]) => {
      app.component(name, component);
    });

    app.mount(mountEl);
  } catch (e) {
    console.error("渲染组件失败:", e);
    error.value = e instanceof Error ? e.message : "渲染组件时发生未知错误";
  }
};

// 监听代码变化
watch(
  () => props.code,
  (newCode) => {
    if (newCode) {
      renderComponent(newCode);
    }
  },
  { immediate: true }
);

onMounted(() => {
  if (props.code) {
    renderComponent(props.code);
  }
});
</script>

<template>
  <div>
    <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
      <p>{{ error }}</p>
    </div>
    <div ref="previewContainer" class="preview-container"></div>
  </div>
</template>

<style scoped>
.preview-container {
  min-height: 200px;
}
</style>
