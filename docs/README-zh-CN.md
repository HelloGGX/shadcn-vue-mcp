<div align="center">
  <a href="https://smithery.ai/server/@HelloGGX/shadcn-vue-mcp">
    <img src="https://github.com/HelloGGX/tailwindcss-mcp/raw/fast-agent/docs/logo.png" alt="shadcnVue MCP Logo" height="450">
  </a>

  <br />

一个强大的 AI 代理工具，可以帮助开发者即时创建高质量的 UI 组件

  <p align="center">
    <a href="https://github.com/HelloGGX/shadcn-vue-mcp">GitHub 仓库</a>
  </p>

[![GitHub forks](https://img.shields.io/github/forks/HelloGGX/shadcn-vue-mcp.svg?style=social&label=Fork&maxAge=2592000)](https://GitHub.com/HelloGGX/shadcn-vue-mcp/network/)
[![GitHub stars](https://img.shields.io/github/stars/HelloGGX/shadcn-vue-mcp.svg?style=social&label=Star&maxAge=2592000)](https://GitHub.com/HelloGGX/shadcn-vue-mcp/stargazers/)
[![GitHub commits](https://badgen.net/github/commits/HelloGGX/shadcn-vue-mcp)](https://GitHub.com/HelloGGX/shadcn-vue-mcp/commit/)
[![smithery badge](https://smithery.ai/badge/@HelloGGX/shadcn-vue-mcp)](https://smithery.ai/server/@HelloGGX/shadcn-vue-mcp)
[![License](https://img.shields.io/github/license/HelloGGX/shadcn-vue-mcp?colorA=00C586&colorB=000000)](https://github.com/HelloGGX/shadcn-vue-mcp/blob/main/LICENSE)
[![Contributors](https://img.shields.io/github/contributors/HelloGGX/shadcn-vue-mcp?colorA=00C586&colorB=000000)](https://github.com/HelloGGX/shadcn-vue-mcp/graphs/contributors)

Shadcn-vue MCP Server 是一个强大的 AI 驱动工具，可帮助开发人员通过自然语言描述即时创建美观、现代的 UI 组件。它集成了 shadcn-vue 组件库和 tailwindcss，与主流 IDE 无缝连接，并提供简化的 UI 开发工作流程。

<div align="center">
  🌐 可用语言: <a href="../README.md"><img src="https://img.shields.io/badge/docs-English-blue" alt="English document"></a>
</div>

</div>

## ❌ 没有 shadcn-vue MCP

开发者在构建 UI 组件时面临多重挑战：

- ❌ **开发流程繁琐**: 需要在 IDE、官方文档和浏览器之间不断切换，严重影响开发效率和专注度。
- ❌ **组件选择困难**: 面对 `shadcn-vue` 提供的众多组件，开发者难以快速找到最符合需求的那个，缺乏智能化的推荐。
- ❌ **重复性工作量大**: 需要手动编写大量模板代码，并处理组件的各种状态和复杂的交互逻辑。
- ❌ **质量保障不足**: 容易忽略可访问性（A11y）、性能优化、代码最佳实践等质量标准，导致组件质量参差不齐。
- ❌ **维护成本高**: 随着项目规模扩大，手动维护所有组件的风格、行为和依赖关系变得异常困难，难以保证一致性。

## ✅ 使用 shadcn-vue MCP

shadcn-vue MCP 提供了智能化的 UI 组件开发体验，彻底改变了传统开发流程：

- ✅ **一站式开发体验**: 无需离开编辑器，只需通过自然语言描述，即可完成从组件选择、编码到预览的全过程。
- ✅ **智能组件推荐**: `components-filter` 工具会根据你的需求描述，智能分析并推荐最适合的 `shadcn-vue` 组件。
- ✅ **高质量代码自动生成**: `component-builder` 能够自动生成符合 `shadcn-vue` 和 `tailwindcss` 规范的高质量 Vue 组件代码，内置最佳实践。
- ✅ **内置质量保证**: `component-quality-check` 会自动对生成的代码进行可访问性（A11y）和代码质量检查，确保组件的专业水准。
- ✅ **即时文档与预览**: `component-usage-doc` 提供实时的组件文档、API 和用法示例，让你即刻上手。
- ✅ **确保设计高度一致**: 所有生成的组件都严格遵守统一的设计规范，确保整个应用的视觉和交互一致性，提升品牌价值。

## 先决条件

在开始之前，请确保您的系统上已安装 Node.js。

- **推荐 Node.js 版本**: `18.20.1` 或更高版本。

> 使用不同版本可能会导致安装错误，如 `Error: spawnSync code-insiders.cmd EINVAL`。降级或升级到推荐版本是最佳解决方案。

## ✨ 特性

- **自然语言描述**:

  - 通过简单的语言描述，轻松创建 UI 组件。

- **多 IDE 支持**:

  - 集成 [Cursor](https://cursor.com) IDE，实现无缝工作流。
  - 支持 [Trae](https://www.trae.ai/)，实现先进的 AI 驱动开发。
  - 支持 [VSCode](https://code.visualstudio.com/)，提供强大的编码体验。
  - 集成 [VSCode + Cline](https://cline.bot) (Beta)，增强协作能力。

- **现代化组件库**:

  - 基于 shadcn-vue 组件库和 tailwindcss 构建，实现现代化、响应式设计。

- **TypeScript 支持**:

  - 全面支持 TypeScript，确保类型安全和可扩展的开发。

- **智能文档查询**:

  - 实时访问详细的 shadcn-vue 组件文档，并集成用法和最佳实践的预览。

- **组件增强**:
  - 可访问性：符合 WCAG 2.1 标准，支持键盘导航和 ARIA
  - 性能：代码分割、摇树优化、优化的捆绑包
  - 一致性：统一的设计系统，一致的行为模式
  - 可维护性：清晰的代码架构，文档齐全的组件
  - 开发者体验：TypeScript 支持、热重载、直观的 API

## 🚀 快速上手

### 方法一：CLI 快速安装

通过 [Smithery](https://smithery.ai/server/@HelloGGX/shadcn-vue-mcp) 为所有客户端自动安装 shadcn-vue-mcp：

<img src="https://raw.githubusercontent.com/HelloGGX/shadcn-vue-mcp/main/docs/install.png" width="600" >

- 支持的客户端: cursor, windsurf, cline, claude, vscode, vscode-insiders

> **注意**: 以 vscode 为例：当您选择"自动"时，在终端中运行 Smithery CLI 命令：

```bash
npx -y @smithery/cli@latest install @HelloGGX/shadcn-vue-mcp --client vscode --profile parental-gayal-aplQPT --key xxxxx
```

您可能会遇到错误：`Failed to install @HelloGGX/shadcn-vue-mcp`

```bash
Error: spawnSync code-insiders.cmd EINVAL
```

**解决方案**: 如"先决条件"部分所述，请确保您使用的是 Node.js `18.20.1` 版本。

### 方法二：手动配置

通过选择 JSON 选项并复制适用于您操作系统的配置，手动配置您的 AI 应用程序（例如 Claude 桌面版）：

**对于 Mac/Linux:**

```json
{
  "mcpServers": {
    "shadcn-vue-mcp": {
      "command": "npx",
      "args": [
        "-y",
        "@smithery/cli@latest",
        "run",
        "@HelloGGX/shadcn-vue-mcp",
        "parental-gayal-aplQPT"
      ]
    }
  }
}
```

**对于 Windows:**

```json
{
  "mcpServers": {
    "shadcn-vue-mcp": {
      "command": "cmd",
      "args": [
        "/c",
        "npx",
        "-y",
        "@smithery/cli@latest",
        "run",
        "@HelloGGX/shadcn-vue-mcp",
        "parental-gayal-aplQPT"
      ]
    }
  }
}
```

### 方法三：通过 URL 为 Copilot 快速安装

您还可以通过 URL 安装 shadcn-vue-mcp。
步骤 1. 复制以下 URL 并将其粘贴到 Smithery AI 应用程序的 URL 字段中：

<img src="https://raw.githubusercontent.com/HelloGGX/shadcn-vue-mcp/main/docs/install_URL.png" width="600">

步骤 2. 打开 VSCode，打开 Copilot 并选择 Agent 模型

步骤 3: 选择"添加服务器"

<img src="https://raw.githubusercontent.com/HelloGGX/shadcn-vue-mcp/main/docs/add_server.png" width="600">

步骤 4: 选择 HTTP

<img src="https://raw.githubusercontent.com/HelloGGX/shadcn-vue-mcp/main/docs/choose_mcp_type.png" width="600">

步骤 5: 粘贴 URL

步骤 6: 配置如下:

```json
{
  "mcp": {
    "servers": {
      "shadcn-vue-mcp": {
        "url": "https://server.smithery.ai/@HelloGGX/shadcn-vue-mcp/mcp?profile=parental-gayal-aplQPT&api_key=xxxxxxx"
      }
    }
  }
}
```

配置文件位置:

- Cursor: `~/.cursor/mcp.json`
- Trae: `~/.Trae/mcp.json`
- Cline: `~/.cline/mcp_config.json`
- Claude: `~/.claude/mcp_config.json`

## 🛠️ 工具列表与核心功能

### 组件生成工具

- **`requirement-structuring`**
  - 分析自然语言需求
  - 将用户需求转换为结构化的 JSON 格式
  - 考虑核心功能和基本特性
  - 内置用户交互和边缘情况分析

### 文档与分析工具

- **`component-usage-doc`**
  - 实时访问 shadcn-vue 组件文档
  - 组件变体的交互式预览
  - 浏览器内置 Markdown 渲染
  - 详细的 API 和使用示例

### 组件筛选与管理

- **`components-filter`**
  - 智能组件推荐系统
  - 支持多语言描述解析
  - 组件关系分析
  - 使用频率统计与加权

### 代码质量与测试

- **`component-quality-check`**
  - 自动化代码质量评估
  - A11y (可访问性) 合规性检查
  - 性能优化建议
  - 最佳实践验证

### 智能代码生成

- **`component-builder`**
  - AI 驱动的组件生成
  - 集成 shadcn-vue 和 Tailwind CSS
  - TypeScript 类型安全
  - 内置最佳实践实现

## 效果示例

用户: /ui 创建一个航班信息展示组件

AI: 生成代码如下:

![UI Component Example](https://github.com/HelloGGX/tailwindcss-mcp/raw/main/docs/ui.png)

用户: /check

AI: ![alt text](https://github.com/HelloGGX/tailwindcss-mcp/raw/fast-agent/docs/check.png)

AI: 生成代码如下:

## 🤝 贡献指南

我们欢迎所有形式的贡献！您可以通过以下方式帮助我们改进 `@agent/shadcn-vue`：

- **报告错误：** 如果您发现错误，请在我们的 [GitHub 仓库](https://github.com/HelloGGX/shadcn-vue-mcp/issues)中创建一个问题。
- **建议增强功能：** 对新功能或改进有想法吗？通过创建问题让我们知道。
- **提交拉取请求：** 我们很乐意审查和合并拉取请求。在进行重大更改之前，请先打开一个问题来讨论您的想法。

源代码在 [GitHub](https://github.com/HelloGGX/shadcn-vue-mcp) 上开源。

## 👥 社区与支持

- [Discord Community](https://discord.gg/82Kf65ut) - 加入我们活跃的社区

## 📝 许可证

## 根据 [Apache 2.0 许可证](./LICENSE) 授权。
