# MCP Prompts for shadcn/vue

这个目录包含了为shadcn/vue组件开发优化的MCP (Model Context Protocol) prompts。这些prompts遵循官方最佳实践，提供结构化的上下文管理和专业的AI交互。

## 📁 文件结构

```
src/core/prompts/
├── index.ts              # 主注册文件
├── componentPrompts.ts   # 组件相关prompts
└── README.md            # 使用文档
```

## 🎯 可用的Prompts

### 1. component-filter-guide

**用途**: 根据UI需求筛选和选择合适的shadcn/vue组件

**参数**:

- `uiDescription` (必需): UI界面描述
- `requirements` (可选): 特定需求或约束

**使用场景**: 当你需要为特定UI需求选择最合适的组件时

### 2. component-analysis

**用途**: 全面分析shadcn/vue组件文档和使用指导

**参数**:

- `componentName` (必需): 要分析的组件名称 (kebab-case)
- `focusArea` (可选): 聚焦领域 ('overview', 'props', 'examples', 'integration', 'troubleshooting')

**使用场景**: 深入了解特定组件的功能、API和最佳实践

### 3. component-implementation

**用途**: 生成生产就绪的shadcn/vue组件实现代码

**参数**:

- `componentName` (必需): 要实现的组件名称 (kebab-case)
- `useCase` (必需): 具体用例或需求
- `complexity` (可选): 实现复杂度 ('basic', 'intermediate', 'advanced')

**使用场景**: 需要快速生成组件实现代码时

### 4. component-troubleshooting

**用途**: 诊断和解决shadcn/vue组件问题

**参数**:

- `componentName` (必需): 有问题的组件名称 (kebab-case)
- `issue` (必需): 问题描述
- `context` (可选): 额外上下文信息

**使用场景**: 遇到组件相关问题需要调试时

### 5. component-comparison

**用途**: 比较不同的shadcn/vue组件以帮助选择决策

**参数**:

- `components` (必需): 要比较的组件列表 (逗号分隔)
- `criteria` (可选): 特定比较标准

**使用场景**: 在多个相似组件间做选择时

### 6. component-best-practices

**用途**: 提供shadcn/vue组件使用的最佳实践和指导

**参数**:

- `componentName` (必需): 组件名称或 'general'
- `context` (可选): 特定上下文

**使用场景**: 学习组件最佳实践和规范

### 7. component-migration

**用途**: 组件版本间或替代方案的迁移指导

**参数**:

- `fromComponent` (必需): 当前组件或库
- `toComponent` (必需): 目标shadcn/vue组件
- `codebase` (可选): 代码库描述

**使用场景**: 需要迁移到shadcn/vue组件时

## 🚀 使用示例

### 在MCP客户端中使用

```typescript
// 获取组件筛选指导
const filterPrompt = await client.getPrompt("component-filter-guide", {
  uiDescription: "一个包含用户列表和搜索功能的管理界面",
  requirements: "需要支持分页和排序",
});

// 分析特定组件
const analysisPrompt = await client.getPrompt("component-analysis", {
  componentName: "data-table",
  focusArea: "props",
});

// 生成实现代码
const implementationPrompt = await client.getPrompt("component-implementation", {
  componentName: "dialog",
  useCase: "确认删除操作的模态框",
  complexity: "intermediate",
});
```

### 在工具中集成

```typescript
// 在MCP工具中使用prompt
server.addTool({
  name: "analyze-component",
  description: "分析组件并提供使用指导",
  parameters: z.object({
    componentName: z.string(),
  }),
  execute: async (params) => {
    // 使用component-analysis prompt的逻辑
    const analysisPrompt = `${COMPONENT_ANALYSIS_PROMPT}
    
    Component to analyze: ${params.componentName}
    Please provide detailed analysis based on the component documentation.`;

    return {
      content: [{ type: "text", text: analysisPrompt }],
    };
  },
});
```

## 📋 最佳实践

### 1. Prompt设计原则

- **清晰性**: 每个prompt都有明确的目的和预期输出
- **一致性**: 所有prompts遵循统一的格式和命名约定
- **可扩展性**: 支持可选参数以适应不同需求
- **文档化**: 详细的描述和参数说明

### 2. 参数命名约定

- 使用camelCase命名参数
- 组件名称使用kebab-case格式
- 布尔参数使用is/has前缀
- 枚举参数提供明确的选项列表

### 3. 错误处理

- 验证必需参数的存在
- 提供有意义的错误消息
- 优雅地处理边界情况
- 记录错误以便调试

### 4. 性能考虑

- 避免在prompt中包含过多静态内容
- 使用模板变量减少重复
- 缓存常用的prompt模板
- 优化token使用

## 🔧 扩展指南

### 添加新的Prompt

1. 在`componentPrompts.ts`中定义prompt常量:

```typescript
export const NEW_PROMPT_TEMPLATE = `
Your prompt template here...
`;
```

2. 在`registerComponentPrompts`函数中注册:

```typescript
server.addPrompt({
  name: "new-prompt-name",
  description: "Clear description of the prompt purpose",
  arguments: [
    {
      name: "paramName",
      description: "Parameter description",
      required: true,
    },
  ],
  load: async ({ paramName }) => {
    return `${NEW_PROMPT_TEMPLATE}
    
    Parameter: ${paramName}`;
  },
});
```

### 创建新的Prompt类别

1. 创建新的prompt文件 (如 `stylingPrompts.ts`)
2. 在`index.ts`中导入并注册
3. 更新文档说明新的prompt类别

## 📚 相关资源

- [MCP官方文档](https://modelcontextprotocol.io/docs/concepts/prompts)
- [shadcn/vue组件文档](https://www.shadcn-vue.com/)
- [FastMCP框架](https://github.com/punkpeye/fastmcp)
- [Vue 3 Composition API](https://vuejs.org/guide/extras/composition-api-faq.html)

## 🤝 贡献指南

1. 遵循现有的代码风格和命名约定
2. 为新的prompts添加完整的文档
3. 包含使用示例和测试用例
4. 确保prompts遵循MCP最佳实践
5. 更新README文档

## 📄 许可证

本项目遵循MIT许可证。
