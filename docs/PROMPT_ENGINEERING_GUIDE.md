# CREATE_UI 提示词工程指南

## 概述

本文档详细说明了我们如何基于业界最佳实践重新设计 `CREATE_UI` 提示词，以生成高质量、现代化的 UI 组件。

## 问题分析

### 原有提示词的问题

1. **设计风格模糊**
   - 缺乏明确的现代设计指导
   - 没有具体的颜色主题约束
   - 导致生成的组件经常使用 `bg-gray-800` 等深色背景

2. **提示词冗长**
   - 过多的细节描述分散了 AI 的注意力
   - 核心设计原则不够突出
   - 影响了生成质量的一致性

3. **缺乏设计系统参考**
   - 没有明确指向 shadcn/ui 设计语言
   - 缺乏现代设计标准的具体指导

## 新提示词设计原理

### 1. 结构化设计 📋

```
## Core Design Principles        # 核心设计原则
## Color Palette Guidelines     # 颜色指导 
## Technical Requirements       # 技术要求
## Component Structure         # 组件结构
## Quality Standards          # 质量标准
## Design Inspiration         # 设计灵感
```

**为什么这样设计？**
- 清晰的分层结构让 AI 更容易理解和遵循
- 每个部分都有明确的作用和约束
- 符合现代提示词工程的最佳实践

### 2. 明确的颜色约束 🎨

```
🎨 **REQUIRED COLOR SCHEME**:
- **Backgrounds**: bg-white, bg-slate-50, bg-gray-50 (NO dark backgrounds)
- **Primary**: bg-blue-600, bg-indigo-600, bg-violet-600 
- **Text**: text-slate-900, text-gray-900, text-slate-700
- **Borders**: border-slate-200, border-gray-200
- **Accents**: text-blue-600, text-emerald-600, text-violet-600

❌ **AVOID**: bg-gray-800, bg-black, dark color schemes
```

**设计思路：**
- **正面约束** + **负面约束**：既告诉 AI 应该用什么，也明确告诉它避免什么
- **具体的 Tailwind 类名**：减少歧义，确保一致性
- **视觉标记**：使用 emoji 和格式化增强可读性

### 3. 现代设计标准 ✨

```
## Core Design Principles
- **Modern & Clean**: Create contemporary designs with professional aesthetics
- **Light & Accessible**: Use light, bright themes (white/neutral backgrounds, dark text)
- **shadcn/ui Standard**: Follow shadcn/ui design language and component patterns
- **Production Ready**: Generate code that's ready for real-world applications
```

**为什么重要？**
- 明确定义了"高质量"的具体含义
- 与业界标准保持一致
- 确保生成的组件具有专业外观

### 4. 设计灵感指导 🎯

```
## Design Inspiration
Follow modern app design patterns like:
- Linear, Notion, Stripe Dashboard
- Clean SaaS interfaces with plenty of whitespace
- Professional business applications
```

**参考选择标准：**
- **Linear**：现代、简洁的界面设计
- **Notion**：优秀的信息层次和布局
- **Stripe Dashboard**：专业的数据展示
- 这些都是业界公认的设计标杆

## 提示词工程最佳实践

### 1. SMART 原则

- **Specific（具体）**：明确的颜色、组件、技术要求
- **Measurable（可衡量）**：质量标准 checklist
- **Achievable（可实现）**：基于现有 shadcn/ui 组件
- **Relevant（相关）**：符合项目需求和现代标准
- **Time-bound（有时限）**：即时生成，无需迭代

### 2. 约束 vs 创造力平衡

```
✅ 明确约束：颜色、技术栈、组件结构
🎨 创造空间：布局、交互、内容组织
```

### 3. 格式化技巧

- **Emoji 视觉标记**：🎨 ✅ ❌ 增强可读性
- **代码示例**：提供具体的模板和结构
- **分层组织**：用 ## 标题清晰分段

## 效果对比

### 原提示词问题
- 生成深色背景组件（bg-gray-800）
- 设计风格不一致
- 缺乏现代感和专业感
- 过于冗长，重点不突出

### 新提示词效果
- 明亮、现代的设计风格
- 一致的 shadcn/ui 设计语言
- 专业的颜色搭配和布局
- 简洁但全面的指导

## 持续优化建议

1. **监控生成质量**
   - 收集用户反馈
   - 分析常见的设计问题
   - 定期更新颜色和设计标准

2. **跟随趋势更新**
   - 关注 shadcn/ui 更新
   - 参考最新的设计系统
   - 调整设计灵感来源

3. **A/B 测试**
   - 测试不同的提示词变体
   - 对比生成质量
   - 优化关键约束条件

## 总结

新的 `CREATE_UI` 提示词设计基于以下核心原则：

1. **简洁而精确**：去除冗余，突出核心
2. **约束明确**：具体的技术和设计要求
3. **标准统一**：遵循 shadcn/ui 和现代设计标准
4. **实用导向**：生成可直接使用的生产级组件

这种设计方法确保了 AI 能够生成一致、高质量、符合现代标准的 UI 组件，解决了之前深色背景和设计质量不佳的问题。 