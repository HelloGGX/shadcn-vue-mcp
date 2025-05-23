# ShadcnVue MCP Server - 强大的 AI 组件生成工具，助力开发者快速构建高质量 UI 组件

[![smithery badge](https://smithery.ai/badge/@HelloGGX/shadcn-vue-mcp)](https://smithery.ai/server/@HelloGGX/shadcn-vue-mcp)

[![中文文档](https://img.shields.io/badge/docs-中文版-yellow)](./docs/README.zh-CN.md)

Shadcn-vue MCP Server 是一个强大的 AI 驱动工具，能够帮助开发者通过自然语言描述，瞬间生成美观、现代的 UI 组件。它集成了 shadcn-vue 组件库与 tailwindcss，并无缝连接主流 IDE，提供流畅的 UI 开发体验。

## ❌ 没有 shadcn-vue MCP 的开发过程

开发者在构建 UI 组件时面临诸多挑战：

* ❌ 需要反复查阅 shadcn-vue 与 tailwindcss 4.0 的文档，浪费大量时间
* ❌ 组件代码需要从头编写，效率低下
* ❌ 难以保持设计风格一致，组件缺乏统一性
* ❌ 很难实现高质量、符合设计和编码规范的组件

## ✅ 拥有 shadcn-vue MCP 的开发体验

shadcn-vue MCP 提供智能化的 UI 组件开发方式：

* 1️⃣ 仅需用自然语言描述你想要的组件
* 2️⃣ MCP 自动生成符合 shadcn-vue 与 tailwindcss 标准的代码
* 3️⃣ 获取可用于生产、设计一致的 shadcn-vue UI 组件

示例用法：

```txt
/ui create a navigation bar component
```

```txt
/refine optimize the navbar's responsiveness and accessibility
```

优势：

* 实时获取最新的 shadcn-vue 组件规范
* 生成的代码 100% 符合当前版本要求
* 基于 context7 提供的 LLM.txt 文件生成更精准的代码
* 无需频繁查文档，无需担心版本兼容问题
* 无缝集成多种主流 IDE 工作流程

### 核心功能

* AI 生成 UI：通过自然语言描述创建 UI 组件
  **多 IDE 支持**：

  * 支持 [Cursor](https://cursor.com)
  * 支持 [Trae](https://www.trae.ai/)
  * 支持 [VSCode](https://code.visualstudio.com/)
  * 支持 [VSCode + Cline](https://cline.bot) 集成（Beta）
* 现代组件库：基于 shadcn-vue 与 tailwindcss
* TypeScript 支持：全类型安全开发体验
* 智能查询 shadcn-vue 组件文档
* 组件增强功能：可访问性支持 / 性能优化 / 高级设计优化 / 动效增强
* 实时组件预览生成（即将上线）

## 使用前提

Node.js 版本需为 22 或以上。

## 快速开始

### 通过 Smithery 安装

1. **访问 **[https://openrouter.ai/models](https://openrouter.ai/models)** 注册账号，获取 OPENROUTER\_API\_KEY，并查看可用模型列表， 推荐使用openrouter中付费的大模型,效果更好，比如：deepcoder、deepseek/deepseek-chat-v3**

2. **选择安装方式**

### 方法一：CLI 快速安装

通过 [Smithery](https://smithery.ai/server/@HelloGGX/shadcn-vue-mcp) 自动为所有客户端安装 shadcn-vue-mcp：

<img src="https://raw.githubusercontent.com/HelloGGX/shadcn-vue-mcp/main/docs/install.png" width="600" >

* 支持的客户端：cursor、windsurf、cline、claude、vscode、vscode-insiders

示例（以 vscode 为例）：

```bash
npx -y @smithery/cli@latest install @HelloGGX/shadcn-vue-mcp --client vscode --profile parental-gayal-aplQPT --key xxxxx
```

如出现错误：

```bash
Error: spawnSync code-insiders.cmd EINVAL
```

解决方案：降级 Node 至 18.20.1 版本后重新执行命令

### 方法二：手动配置

手动配置 AI 应用（如 Claude Desktop）。选择 JSON 配置项并复制适用于操作系统的配置：

Mac/Linux 示例：

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
        "--key",
        "your api key",
        "--profile",
        "parental-gayal-aplQPT"
      ]
    }
  }
}
```

### 方法三：URL 快速安装（用于 copilot）

步骤 1：复制以下 URL，粘贴至 Smithery AI 应用的 URL 输入框：

<img src="https://raw.githubusercontent.com/HelloGGX/shadcn-vue-mcp/main/docs/install_URL.png" width="600">

步骤 2：打开 vscode，启用 copilot 并选择 Agent 模型

步骤 3：选择 Add Server

<img src="https://raw.githubusercontent.com/HelloGGX/shadcn-vue-mcp/main/docs/add_server.png" width="600">

步骤 4：选择 HTTP

<img src="https://raw.githubusercontent.com/HelloGGX/shadcn-vue-mcp/main/docs/choose_mcp_type.png" width="600">

步骤 5：粘贴 URL

步骤 6：配置如下：

```json
{
    "mcp": {
		"servers": {
			"shadcn-vue-mcp": {
				"url": "https://server.smithery.ai/@HelloGGX/shadcn-vue-mcp/mcp?profile=parental-gayal-aplQPT&api_key=xxxxxxx"
			},
		}
	}
}
```

配置文件存放路径：

* Cursor: `~/.cursor/mcp.json`
* Trae: `~/.Trae/mcp.json`
* Cline: `~/.cline/mcp_config.json`
* Claude: `~/.claude/mcp_config.json`

## 工具列表

### read-usage-doc

> 查询组件使用文档

#### 参数

* name: `String`

  > shadcn-vue 组件名。例如：“button component usage documentation”

### read-full-doc

> 获取组件完整文档
> 当涉及 /doc 时使用此工具

#### 参数

* name: `String`

  > shadcn-vue 组件名。例如：“button component full documentation”

### create-ui

> 创建 UI 组件
> 使用 shadcn/ui 和 tailwindcss 构建 Web UI。涉及 /ui 时使用此工具

#### 参数

* description: `String`

  > 组件需求描述。例如：“/ui create a flight display component”

### refine-code

> 优化指定组件代码
> 涉及 /refine 时使用此工具

#### 参数

* userMessage: `String`

  > 待优化代码描述。例如：“/refine optimize this code to have mobile responsive layout”
* absolutePathToRefiningFile: `String`

  > 需优化文件的绝对路径
* context: `String`

  > 根据用户消息、代码、对话历史提取需改进的 UI 元素与要点

## 结果示例

用户：/ui create a flight display component

AI：生成如下代码：

![UI Component Example](https://github.com/HelloGGX/tailwindcss-mcp/raw/main/docs/ui.png)

## 🤝 贡献指南

欢迎任何贡献！帮助我们持续优化 @agent/shadcn-vue。源码已开源至 [GitHub](https://github.com/HelloGGX/shadcn-vue-mcp)。

## 👥 社区与支持

* [Discord 社区](https://discord.gg/82Kf65ut) - 加入我们活跃的社区

## 📝 许可证

Apache2.0 License
