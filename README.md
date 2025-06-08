<div align="center">
  <a href="https://smithery.ai/server/@HelloGGX/shadcn-vue-mcp">
    <img src="https://github.com/HelloGGX/tailwindcss-mcp/raw/fast-agent/docs/logo.png" alt="shadcnVue MCP Logo">
  </a>

  <br />

A powerful AI Agent tool that helps developers instantly create high-quality UI components

  <p align="center">
    <a href="https://github.com/HelloGGX/shadcn-vue-mcp">GitHub Repository</a>
  </p>

  [![GitHub forks](https://img.shields.io/github/forks/HelloGGX/shadcn-vue-mcp.svg?style=social&label=Fork&maxAge=2592000)](https://GitHub.com/HelloGGX/shadcn-vue-mcp/network/)
  [![GitHub stars](https://img.shields.io/github/stars/HelloGGX/shadcn-vue-mcp.svg?style=social&label=Star&maxAge=2592000)](https://GitHub.com/HelloGGX/shadcn-vue-mcp/stargazers/)
  [![GitHub commits](https://badgen.net/github/commits/HelloGGX/shadcn-vue-mcp)](https://GitHub.com/HelloGGX/shadcn-vue-mcp/commit/)
  [![License](https://img.shields.io/github/license/HelloGGX/shadcn-vue-mcp?colorA=00C586&colorB=000000)](https://github.com/HelloGGX/shadcn-vue-mcp/blob/main/LICENSE)
  [![Contributors](https://img.shields.io/github/contributors/HelloGGX/shadcn-vue-mcp?colorA=00C586&colorB=000000)](https://github.com/HelloGGX/shadcn-vue-mcp/graphs/contributors)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6)
[![smithery badge](https://smithery.ai/badge/@HelloGGX/shadcn-vue-mcp)](https://smithery.ai/server/@HelloGGX/shadcn-vue-mcp)


Shadcn-vue MCP Server is a powerful AI-driven tool that helps developers instantly create beautiful, modern UI components through natural language descriptions. It integrates the shadcn-vue component library and tailwindcss, seamlessly connects with mainstream IDEs, and provides a streamlined UI development workflow.

<div align="center">
  🌐 Available Languages: <a href="./docs/README.zh-CN.md"><img src="https://img.shields.io/badge/docs-中文版-yellow" alt="中文文档"></a>
</div>



</div>

## ❌ Without shadcn-vue MCP

Developers face multiple challenges when building UI components:

- ❌ Need to manually check shadcn-vue and tailwindcss4.0 documentation, wasting significant time
- ❌ Component code needs to be written from scratch, inefficient
- ❌ Difficult to achieve design consistency, components lack unified style
- ❌ Hard to implement high-quality components that meet design and coding standards

## ✅ With shadcn-vue MCP

shadcn-vue MCP provides an intelligent UI component development experience:

- 1️⃣ Simply describe your desired component in natural language
- 2️⃣ MCP automatically generates code compliant with shadcn-vue and tailwindcss standards
- 3️⃣ Get production-ready, design-consistent shadcn-vue UI components



## ✨ Features

- **Natural Language Descriptions**:
  - Create UI components effortlessly by describing them in plain language.

- **Multi-IDE Support**:
  - [Cursor](https://cursor.com) IDE integration for seamless workflows.
  - [Trae](https://www.trae.ai/) support for advanced AI-driven development.
  - [VSCode](https://code.visualstudio.com/) support for a robust coding experience.
  - [VSCode + Cline](https://cline.bot) integration (Beta) for enhanced collaboration.

- **Modern Component Library**:
  - Built on the shadcn-vue component library and tailwindcss for modern, responsive designs.

- **TypeScript Support**:
  - Full TypeScript support ensures type-safe and scalable development.

- **Intelligent Documentation Query**:
  - Real-time access to detailed shadcn-vue component documentation.Generate real-time previews of components document.
  - Integrated previews of component usage and best practices.

- **Component Enhancement**:
    - Accessibility: WCAG 2.1 compliant, keyboard navigation, ARIA support
    - Performance: Code splitting, tree shaking, optimized bundles
    - Consistency: Unified design system, consistent behavior patterns
    - Maintainability: Clean code architecture, well-documented components
    - Developer Experience: TypeScript support, hot reload, intuitive APIs

## 🚀 Getting Started

### Method 1: CLI Quick Installation

To install shadcn-vue-mcp for all clients automatically via [Smithery](https://smithery.ai/server/@HelloGGX/shadcn-vue-mcp):

<img src="https://raw.githubusercontent.com/HelloGGX/shadcn-vue-mcp/main/docs/install.png" width="600" >

- Supported clients: cursor, windsurf, cline, claude, vscode, vscode-insiders

> **Note**: Take vscode as an example: When you select Auto, run the Smithery CLI command in the terminal:
```bash
npx -y @smithery/cli@latest install @HelloGGX/shadcn-vue-mcp --client vscode --profile parental-gayal-aplQPT --key xxxxx
```
You may get an error: Failed to install @HelloGGX/shadcn-vue-mcp
```bash
Error: spawnSync code-insiders.cmd EINVAL
```
**Solution**: Downgrade the Node version to 18.20.1 and rerun

### Method 2: Manual Configuration

Manually configure AI application (e.g. Claude Desktop).你可以选择JSON选项，并选择对应的操作系统进行复制：

for Mac/Linux:
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

### Method 3 URL Quick Installation for copilot
You can also install shadcn-vue-mcp via URL.
Step 1. copy the following URL and paste it into the URL field of the Smithery AI application:

<img src="https://raw.githubusercontent.com/HelloGGX/shadcn-vue-mcp/main/docs/install_URL.png" width="600">

Step 2. Open vscode, open copilot and select Agent model

Step 3: Select Add Server

<img src="https://raw.githubusercontent.com/HelloGGX/shadcn-vue-mcp/main/docs/add_server.png" width="600">

Step 4: choose HTTP

<img src="https://raw.githubusercontent.com/HelloGGX/shadcn-vue-mcp/main/docs/choose_mcp_type.png" width="600">

Step 5: paste the URL

Step 6: config like this:

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

Config file locations:

- Cursor: `~/.cursor/mcp.json`
- Trae: `~/.Trae/mcp.json`
- Cline: `~/.cline/mcp_config.json`
- Claude: `~/.claude/mcp_config.json`

## 🛠️ Tool List & Core Features

### Component Generation Tools
- **`requirement-structuring`**
  - Analyzes natural language requirements
  - Converts user needs into structured JSON format
  - Considers core functionality and essential features
  - Built-in user interaction and edge case analysis

### Documentation & Analysis Tools
- **`component-usage-doc`**
  - Real-time access to shadcn-vue component documentation
  - Interactive preview of component variants
  - Built-in markdown rendering in browser
  - Detailed API and usage examples

### Component Filtering & Management
- **`components-filter`**
  - Smart component recommendation system
  - Supports multi-language description parsing
  - Component relationship analysis
  - Usage frequency statistics and weighting

### Code Quality & Testing
- **`component-quality-check`**
  - Automated code quality assessment
  - A11y (Accessibility) compliance checking
  - Performance optimization suggestions
  - Best practices validation

### Smart Code Generation
- **`component-builder`**
  - AI-powered component generation
  - shadcn-vue and Tailwind CSS integration
  - TypeScript type safety
  - Built-in best practices implementation


## Result Example

User: /ui create a flight display component

AI: Generated code as follows:

![UI Component Example](https://github.com/HelloGGX/tailwindcss-mcp/raw/main/docs/ui.png)

## 🤝 Contribution Guide

We welcome all contributions! Help us improve @agent/shadcn-vue. Source code is open-sourced on [GitHub](https://github.com/HelloGGX/shadcn-vue-mcp).

## 👥 Community & Support

- [Discord Community](https://discord.gg/82Kf65ut) - Join our active community

## 📝 License

Apache2.0 License
---
