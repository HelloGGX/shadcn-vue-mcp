import { chromium } from 'playwright';
import * as fs from 'fs';
import * as path from 'path';

// 创建一个临时HTML文件，包含shadcn-vue的引用和组件模板
async function createTempHtml(componentHtml: string): Promise<string> {
  const tempDir = path.join(process.cwd(), 'temp');
  
  // 确保临时目录存在
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }
  
  const tempFile = path.join(tempDir, `component-${Date.now()}.html`);
  
  // 创建HTML模板，引入shadcn-vue
  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Shadcn Vue Component Preview</title>
  <!-- 引入Tailwind CSS -->
  <script src="https://cdn.tailwindcss.com"></script>
  <!-- 引入Vue 3 -->
  <script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
  <!-- 引入shadcn-vue的样式和组件 -->
  <link href="https://cdn.jsdelivr.net/npm/@shadcn/ui/dist/style.css" rel="stylesheet">
  <script src="https://cdn.jsdelivr.net/npm/@shadcn/vue/dist/index.umd.js"></script>
  <style>
    body {
      padding: 2rem;
      font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }
    #app {
      max-width: 1200px;
      margin: 0 auto;
    }
  </style>
</head>
<body class="bg-background text-foreground">
  <div id="app">
    ${componentHtml}
  </div>

  <script>
    // 初始化Vue应用
    const app = Vue.createApp({
      template: '#app',
      mounted() {
        console.log('Component mounted');
      }
    });
    
    // 注册shadcn-vue组件
    for (const componentName in window.ShadcnVue) {
      app.component(componentName, window.ShadcnVue[componentName]);
    }
    
    app.mount('#app');
  </script>
</body>
</html>
  `;
  
  fs.writeFileSync(tempFile, htmlContent);
  return tempFile;
}

// 在浏览器中渲染组件
export async function renderComponentInBrowser(componentHtml: string): Promise<string> {
  const htmlFile = await createTempHtml(componentHtml);
  const fileUrl = `file://${htmlFile}`;
  
  // 启动浏览器
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  // 导航到临时HTML文件
  await page.goto(fileUrl);
  
  // 等待用户手动关闭浏览器窗口
  console.log('组件已在浏览器中渲染，请手动关闭浏览器窗口以继续...');
  
  // 这里可以选择等待一段时间后自动关闭，或者等待用户交互
  // 例如，等待30秒后自动关闭
  await new Promise(resolve => setTimeout(resolve, 30000));
  
  await browser.close();
  
  // 返回成功消息
  return `组件已成功在浏览器中渲染，临时文件位置: ${htmlFile}`;
}

// // MCP工具定义
// export const browserRenderTool = {
//   name: "renderInBrowser",
//   description: "在浏览器中渲染shadcn-vue组件",
//   parameters: {
//     type: "object",
//     properties: {
//       componentHtml: {
//         type: "string",
//         description: "要渲染的组件HTML模板"
//       }
//     },
//     required: ["componentHtml"]
//   },
//   handler: async ({ componentHtml }: { componentHtml: string }) => {
//     return await renderComponentInBrowser(componentHtml);
//   }
// };