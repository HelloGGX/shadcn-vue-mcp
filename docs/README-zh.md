# shadcnVue-mcp-server

![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6)
![Bun](https://img.shields.io/badge/Bun-1.0+-FBF0DF)
![fastmcp](https://img.shields.io/badge/fastmcp-1.21+-3178C6)

一个基于 FastMCP 的强大后端服务，旨在通过 AI 的能力，将用户的自然语言需求，转化为结构清晰、可维护性高、遵循设计规范的 `shadcn-vue` 前端组件。

## 📖 核心功能

本 MCP Server 提供了一套完整的工具链，以支持从需求分析到组件生成和质量检查的全过程：

- **需求分析与结构化 (`requirement-structuring`)**: 深入理解用户的自然语言描述，自动分析其潜在意图，并将其结构化为一份详尽的组件需求文档（JSON 格式）。

- **智能组件筛选 (`components-filter`)**: 基于结构化的需求，从 `shadcn-vue` 组件库中智能筛选出最合适的原子组件和图表，为后续的组件构建提供基础。

- **组件文档查询 (`component-usage-doc` & `all-components-doc`)**: 提供单个或多个组件的文档查询功能，并将格式化后的文档在浏览器中打开，帮助开发者快速理解并使用组件。

- **高质量组件构建 (`component-builder`)**: 根据需求文档和筛选出的基础组件，自动生成符合高质量标准的 Vue 3 组件代码。该工具会遵循预设的[高质量UI组件标准定义]，确保代码的健壮性与可维护性。

- **组件质量检查 (`component-quality-check`)**: 对生成或更新的组件代码进行质量评估，确保其符合可访问性、性能、一致性、可维护性和开发者体验等多个维度的标准。

## 🚀 快速开始

在开始之前，请确保您的开发环境中已安装 [Bun](https://bun.sh/)。

1. **安装依赖**:
   ```bash
   bun install
   ```

2. **启动服务**:
   - **Stdio 模式** (用于本地开发和 Cursor 集成):
     ```bash
     bun start
     ```
   - **HTTP 模式** (用于 Web 应用或远程访问):
     ```bash
     bun run start:http
     ```

3. **开发模式 (带自动重载)**:
   - **Stdio 模式**:
     ```bash
     bun run dev
     ```
   - **HTTP 模式**:
     ```bash
     bun run dev:http
     ```

4. **服务检查**:
   您可以使用 MCP Inspector 工具来查看服务状态和已注册的工具：
   ```bash
   bun run inspect
   ```

> **注意**: 本项目默认使用 `Bun` 作为运行时。所有的命令都已在 `package.json` 中配置好。

## 🔗 与 Cursor 集成

您可以轻松地将此 MCP Server 集成到 Cursor 中，以在 IDE 中直接使用其强大的功能。

### 1. 使用 `mcp.json` (推荐)

在您的项目根目录下创建一个 `.cursor/mcp.json` 文件，内容如下：

```json
{
  "mcpServers": {
    "my-shadcn-vue-server-stdio": {
      "command": "bun",
      "args": [
        "start"
      ],
      "env": {
        "NODE_ENV": "development"
      }
    },
    "my-shadcn-vue-server-http": {
      "url": "http://localhost:3001/sse"
    }
  }
}
```

- `my-shadcn-vue-server-stdio`: 通过 `stdio` 与 Cursor 通信，适合本地开发。
- `my-shadcn-vue-server-http`: 通过 `http` 与 Cursor 通信，需要先运行 `bun run start:http`。

### 2. 手动在 Cursor 设置中添加

1.  打开 Cursor 设置（左下角齿轮图标）。
2.  进入 "Features" -> "MCP Servers" 部分。
3.  点击 "Add new MCP server"。
4.  根据您的需求配置：
    - **stdio 模式**:
      - **Type**: `command`
      - **Command**: `bun start`
    - **SSE 模式**:
      - **Type**: `url`
      - **URL**: `http://localhost:3001/sse`

## 工作流示例: 从需求到组件

本 MCP Server 的核心价值在于其自动化的工作流。当用户提出一个组件需求时（例如："我想要一个可以搜索、添加和编辑用户的表格"），服务器会按以下顺序自动调用工具链：

1.  **`requirement-structuring`** 工具被触发，将用户的自然语言需求转换为一个结构化的 JSON 对象，清晰地定义出组件的目标、数据结构和用户行为。

2.  该 JSON 对象被传递给 **`components-filter`** 工具，该工具会分析需求并从 `shadcn-vue` 库中挑选出所需的基础组件（如 `Table`, `Input`, `Button`, `Dialog` 等）。

3.  **`all-components-doc`** 工具会获取所有已选定组件的文档，为代码生成做准备。

4.  最后，**`component-builder`** 工具接收所有信息，生成一个完整、高质量的 Vue 组件。

5.  在组件生成或更新后，您可以手动调用 **`component-quality-check`** 工具来确保代码质量。

## 🛠️ 自定义与扩展

本项目具有良好的扩展性。您可以在以下目录中添加或修改功能：

- **`src/core/tools.ts`**: 添加或修改工具。
- **`src/core/resources.ts`**: 定义新的资源。
- **`src/core/prompts/`**: 管理和添加新的提示。

每个模块都已结构化，方便您进行二次开发。

## 📚 相关文档

- **FastMCP**: [FastMCP GitHub Repository](https://github.com/punkpeye/fastmcp)
- **Model Context Protocol**: [MCP Documentation](https://modelcontextprotocol.io/introduction)
- **shadcn-vue**: [shadcn-vue Documentation](https://www.shadcn-vue.com/)

## 📄 许可证

本项目基于 MIT 许可证 - 详情请见 [LICENSE](LICENSE) 文件。
