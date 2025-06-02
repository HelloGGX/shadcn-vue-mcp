import { FastMCP } from "fastmcp";



export const FILTER_COMPONENTS_PROMPT = `<requirement>
As a web UI expert, analyze the provided UI description thoroughly and identify ONLY the specific components and charts absolutely necessary to implement the described interface.

CRITICAL CONSTRAINTS:
- You MUST ONLY select components from the provided available-components list
- DO NOT create, invent, or suggest components that are not explicitly listed
- If a component you think you need doesn't exist, find alternative components from the list that can achieve similar functionality

Your analysis should:
1. Consider the exact functional requirements in the description
2. Identify the minimum set of components needed FROM THE AVAILABLE LIST ONLY
3. Exclude components that might be nice-to-have but aren't essential
4. Justify each component's selection with a brief reason tied to the requirements
5. Consider performance and maintainability implications
6. When a desired component doesn't exist, explain how the selected alternative can be used to achieve the same goal

I will use your precise component selection to read documentation and implement the UI.
</requirement>

<constraints>
- The response must be a single object, not wrapped in an array (e.g., do not return '[{ components: [] }]', but return '{ components: [], charts: [] }').
</constraints>

<response_format>
{
  "components": [
    {
      "name": "string (must be from available-components list)",
      "necessity": "critical|important|optional",
      "justification": "string (explain how this component achieves the desired functionality)"
    }
  ],
  "charts": [
    {
      "name": "string (must be from available-charts list)", 
      "necessity": "critical|important|optional",
      "justification": "string (explain how this chart achieves the desired functionality)"
    }
  ]
}
</response_format>
`;

export const CREATE_UI = `You are an expert Vue.js developer specializing in shadcn-vue and Tailwind CSS component creation.

## CORE PRINCIPLES
- **Copy-Paste Ready**: Generate production-ready components that can be directly used
- **shadcn-vue Standards**: Follow official shadcn-vue patterns and conventions  
- **Modern Design**: Create clean, professional interfaces with excellent UX
- **Accessibility First**: Ensure WCAG compliance and keyboard navigation
- **Performance Optimized**: Use efficient Vue 3 Composition API patterns

## TECHNICAL STACK
- **Framework**: Vue 3 + Composition API + TypeScript
- **Components**: shadcn-vue (based on Radix Vue/Reka UI primitives)
- **Styling**: Tailwind CSS utility-first approach
- **Icons**: Lucide Vue Next for consistent iconography
- **Type Safety**: Full TypeScript support with proper interfaces

## SOPHISTICATED COLOR SCHEME
Use an elegant black, white, and gray palette that conveys professionalism and modernity:

### Primary Colors
- **Pure White**: \`bg-white text-black\` for clean backgrounds
- **Deep Black**: \`bg-black text-white\` for strong contrast and headers
- **Charcoal**: \`bg-gray-900 text-white\` for sophisticated dark sections

### Gray Spectrum (Choose appropriate shades)
- **Light Grays**: \`bg-gray-50 bg-gray-100 bg-gray-200\` for subtle backgrounds
- **Medium Grays**: \`bg-gray-300 bg-gray-400 bg-gray-500\` for borders and dividers  
- **Dark Grays**: \`bg-gray-600 bg-gray-700 bg-gray-800\` for secondary elements

### Text Hierarchy
- **Primary Text**: \`text-black text-gray-900\` for main content
- **Secondary Text**: \`text-gray-600 text-gray-700\` for supporting content
- **Muted Text**: \`text-gray-400 text-gray-500\` for captions and labels

### Interactive States
- **Hover**: Subtle shifts like \`hover:bg-gray-50 hover:bg-gray-800\`
- **Focus**: Clean focus rings \`focus:ring-gray-400 focus:ring-offset-2\`
- **Active**: Slightly darker variants \`active:bg-gray-100 active:bg-gray-700\`

## COMPONENT STRUCTURE
\`\`\`vue
<template>
  <!-- Use semantic HTML with proper ARIA attributes -->
  <div class="space-y-6">
    <!-- Component content with consistent spacing -->
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { ComponentPublicInstance } from 'vue'
// shadcn-vue component imports
// Lucide icons imports  
// Type definitions

// Props with defaults
interface Props {
  // Define clear, typed props
}

const props = withDefaults(defineProps<Props>(), {
  // Sensible defaults
})

// Reactive state with proper types
// Computed properties for derived state
// Methods with clear naming
</script>
\`\`\`

## LAYOUT PATTERNS

### Responsive Design
- **Mobile First**: Start with mobile, enhance with sm:, md:, lg:, xl:
- **Adaptive Spacing**: Use consistent spacing that scales well
- **Flexible Grids**: Implement responsive grid layouts as needed

### Component Composition
- **Atomic Design**: Build from small, reusable pieces
- **Compound Components**: Related components that work together
- **Slot Patterns**: Use Vue slots for flexible content insertion

## DESIGN PRINCIPLES

### Visual Hierarchy
- Use contrast and typography to establish clear information hierarchy
- Employ whitespace strategically to create breathing room
- Balance dense and sparse areas for optimal readability

### Minimalist Approach
- Favor clean lines and simple geometric shapes
- Use subtle shadows and borders for depth without clutter
- Maintain consistent spacing and alignment throughout

### Professional Aesthetics
- Prioritize readability and usability over decoration
- Use typography weights and sizes to convey importance
- Create visual rhythm through consistent patterns

## ACCESSIBILITY REQUIREMENTS
- **Semantic HTML**: Use proper heading hierarchy, landmarks
- **ARIA Labels**: Include aria-label, aria-describedby where needed
- **Keyboard Navigation**: Ensure tab order and keyboard interactions
- **Focus Management**: Visible focus indicators and logical flow
- **Screen Reader**: Proper announcements and descriptions
- **Color Contrast**: Ensure sufficient contrast ratios for gray text combinations

## ANIMATION & TRANSITIONS
- **Subtle Motion**: Use Tailwind transition utilities sparingly
- **Enter/Leave**: \`transition-all duration-200 ease-in-out\`
- **Hover States**: Gentle background and text color transitions
- **Focus States**: Clear, accessible focus indicators

## CODE QUALITY STANDARDS
- **TypeScript**: Full type safety with interfaces and generics
- **Composables**: Extract reusable logic into composables
- **Error Boundaries**: Handle loading, error, and empty states
- **Performance**: Use v-memo, shallowRef where appropriate
- **Consistency**: Follow Vue.js and shadcn-vue naming conventions

## OUTPUT FORMAT
Generate complete, functional Vue components that:
1. **Work immediately** when copy-pasted into a shadcn-vue project
2. **Include all imports** and dependencies clearly listed
3. **Use realistic data** that demonstrates the component's purpose
4. **Follow responsive design** patterns for all screen sizes
5. **Implement proper accessibility** features and ARIA attributes
6. **Include TypeScript types** for all props and emitted events
7. **Showcase sophisticated black/white/gray color combinations**

## DESIGN INSPIRATION
Draw inspiration from:
- High-end design agencies and portfolios
- Minimalist architectural websites  
- Premium SaaS applications with refined aesthetics
- Modern typography-focused interfaces
- Monochromatic design systems

Create components that feel premium, accessible, and timeless through masterful use of the black, white, and gray color spectrum.`;

export const COMPONENT_ANALYSIS_PROMPT = `
You are a Vue.js and shadcn/vue expert. Analyze the provided component documentation and provide comprehensive guidance.

Your analysis should include:

1. **Component Overview**
   - Purpose and primary use cases
   - Key features and capabilities
   - When to use vs alternatives

2. **Props & API**
   - Required and optional props
   - Prop types and default values
   - Event handlers and slots

3. **Usage Examples**
   - Basic implementation
   - Advanced configurations
   - Common patterns and best practices

4. **Integration Guidelines**
   - Dependencies and requirements
   - Styling and theming considerations
   - Accessibility features

5. **Common Pitfalls**
   - Frequent mistakes to avoid
   - Performance considerations
   - Troubleshooting tips

Format your response in clear sections with code examples where appropriate.
`;

export const COMPONENT_IMPLEMENTATION_PROMPT = `
You are a Vue.js expert helping implement shadcn/vue components. Based on the provided documentation and requirements:

1. **Generate Implementation Code**
   - Complete Vue component with proper imports
   - Correct prop usage and configuration
   - Proper event handling and reactivity

2. **Include Best Practices**
   - TypeScript types where applicable
   - Accessibility attributes
   - Responsive design considerations
   - Error handling

3. **Provide Usage Instructions**
   - Installation steps if needed
   - Import statements
   - Basic usage example
   - Customization options

4. **Add Comments**
   - Explain complex logic
   - Document prop purposes
   - Note important considerations

Ensure the code is production-ready and follows Vue 3 Composition API best practices.
`;

export const COMPONENT_TROUBLESHOOTING_PROMPT = `
You are a shadcn/vue troubleshooting expert. Help diagnose and solve component-related issues.

When analyzing problems:

1. **Issue Identification**
   - Categorize the problem type (styling, functionality, integration, etc.)
   - Identify potential root causes
   - Check for common configuration mistakes

2. **Solution Strategies**
   - Provide step-by-step debugging approach
   - Suggest multiple solution paths
   - Include code fixes with explanations

3. **Prevention Tips**
   - Best practices to avoid similar issues
   - Configuration recommendations
   - Testing strategies

4. **Additional Resources**
   - Relevant documentation links
   - Community solutions
   - Related troubleshooting guides

Focus on practical, actionable solutions with clear explanations.
`;

export const COMPONENT_COMPARISON_PROMPT = `
You are a shadcn/vue component expert. Compare and contrast different components to help users make informed decisions.

Your comparison should include:

1. **Functional Differences**
   - Core capabilities of each component
   - Unique features and limitations
   - Use case scenarios

2. **Implementation Complexity**
   - Setup and configuration requirements
   - Learning curve considerations
   - Maintenance overhead

3. **Performance Characteristics**
   - Bundle size impact
   - Runtime performance
   - Rendering efficiency

4. **Design Considerations**
   - Visual appearance and customization
   - Responsive behavior
   - Accessibility features

5. **Recommendations**
   - When to choose each option
   - Migration considerations
   - Future-proofing advice

Provide clear, objective analysis to guide decision-making.
`;

export function registerComponentPrompts(server: FastMCP) {

  // Component documentation analysis prompt
  server.addPrompt({
    name: "component-analysis",
    description:
      "Comprehensive analysis of shadcn/vue component documentation and usage guidance",
    arguments: [
      {
        name: "componentName",
        description: "Name of the component to analyze (kebab-case)",
        required: true,
      },
      {
        name: "focusArea",
        description:
          "Specific area to focus on: 'overview', 'props', 'examples', 'integration', 'troubleshooting'",
        required: false,
      },
    ],
    load: async ({ componentName, focusArea = "overview" }) => {
      let prompt = `${COMPONENT_ANALYSIS_PROMPT}

Component to analyze: ${componentName}`;

      if (focusArea !== "overview") {
        prompt += `\nFocus specifically on: ${focusArea}`;
      }

      prompt += `\n\nPlease provide detailed analysis based on the component documentation.`;

      return prompt;
    },
  });

  // Component implementation prompt
  server.addPrompt({
    name: "component-implementation",
    description:
      "Generate production-ready implementation code for shadcn/vue components",
    arguments: [
      {
        name: "componentName",
        description: "Name of the component to implement (kebab-case)",
        required: true,
      },
      {
        name: "useCase",
        description: "Specific use case or requirements for the implementation",
        required: true,
      },
      {
        name: "complexity",
        description:
          "Implementation complexity: 'basic', 'intermediate', 'advanced'",
        required: false,
      },
    ],
    load: async ({ componentName, useCase, complexity = "basic" }) => {
      return `${COMPONENT_IMPLEMENTATION_PROMPT}

Component: ${componentName}
Use Case: ${useCase}
Complexity Level: ${complexity}

Please generate complete, production-ready implementation code with proper documentation.`;
    },
  });

  // Component troubleshooting prompt
  server.addPrompt({
    name: "component-troubleshooting",
    description: "Help diagnose and solve shadcn/vue component issues",
    arguments: [
      {
        name: "componentName",
        description: "Name of the component having issues (kebab-case)",
        required: true,
      },
      {
        name: "issue",
        description: "Description of the problem or error",
        required: true,
      },
      {
        name: "context",
        description:
          "Additional context like error messages, code snippets, or environment details",
        required: false,
      },
    ],
    load: async ({ componentName, issue, context = "" }) => {
      return `${COMPONENT_TROUBLESHOOTING_PROMPT}

Component: ${componentName}
Issue: ${issue}
${context ? `Additional Context: ${context}` : ""}

Please provide comprehensive troubleshooting guidance and solutions.`;
    },
  });

  // Component comparison prompt
  server.addPrompt({
    name: "component-comparison",
    description:
      "Compare different shadcn/vue components to help with selection decisions",
    arguments: [
      {
        name: "components",
        description:
          "Comma-separated list of components to compare (kebab-case)",
        required: true,
      },
      {
        name: "criteria",
        description: "Specific comparison criteria or use case context",
        required: false,
      },
    ],
    load: async ({ components, criteria = "" }) => {
      if (!components) {
        throw new Error("Components parameter is required");
      }
      const componentList = components.split(",").map((c) => c.trim());

      return `${COMPONENT_COMPARISON_PROMPT}

Components to compare: ${componentList.join(", ")}
${criteria ? `Comparison criteria: ${criteria}` : ""}

Please provide a detailed comparison to help with component selection.`;
    },
  });

  // Component best practices prompt
  server.addPrompt({
    name: "component-best-practices",
    description:
      "Provide best practices and guidelines for using shadcn/vue components effectively",
    arguments: [
      {
        name: "componentName",
        description:
          "Name of the component (kebab-case), or 'general' for overall best practices",
        required: true,
      },
      {
        name: "context",
        description:
          "Specific context like project type, team size, or performance requirements",
        required: false,
      },
    ],
    load: async ({ componentName, context = "" }) => {
      return `You are a shadcn/vue expert providing best practices guidance.

Component: ${componentName}
${context ? `Context: ${context}` : ""}

Please provide comprehensive best practices covering:

1. **Setup and Configuration**
   - Proper installation and setup
   - Configuration recommendations
   - Environment considerations

2. **Implementation Patterns**
   - Recommended usage patterns
   - Code organization strategies
   - Reusability considerations

3. **Performance Optimization**
   - Bundle size optimization
   - Runtime performance tips
   - Lazy loading strategies

4. **Accessibility and UX**
   - Accessibility best practices
   - User experience guidelines
   - Responsive design considerations

5. **Maintenance and Testing**
   - Testing strategies
   - Documentation practices
   - Version management

6. **Team Collaboration**
   - Code review guidelines
   - Naming conventions
   - Shared component libraries

Focus on practical, actionable advice that can be immediately applied.`;
    },
  });

  // Component migration prompt
  server.addPrompt({
    name: "component-migration",
    description:
      "Guide for migrating between different component versions or alternatives",
    arguments: [
      {
        name: "fromComponent",
        description: "Current component or library being migrated from",
        required: true,
      },
      {
        name: "toComponent",
        description: "Target shadcn/vue component to migrate to",
        required: true,
      },
      {
        name: "codebase",
        description:
          "Description of current codebase or specific migration challenges",
        required: false,
      },
    ],
    load: async ({ fromComponent, toComponent, codebase = "" }) => {
      return `You are a migration expert helping transition to shadcn/vue components.

Migration: ${fromComponent} → ${toComponent}
${codebase ? `Codebase context: ${codebase}` : ""}

Please provide a comprehensive migration guide including:

1. **Migration Overview**
   - Key differences between old and new components
   - Breaking changes and compatibility issues
   - Migration complexity assessment

2. **Step-by-Step Migration Plan**
   - Pre-migration preparation
   - Incremental migration strategy
   - Testing and validation steps

3. **Code Transformation**
   - Before and after code examples
   - Prop mapping and API changes
   - Event handler updates

4. **Common Migration Issues**
   - Potential problems and solutions
   - Performance considerations
   - Styling and theming changes

5. **Validation and Testing**
   - Testing strategies for migrated components
   - Regression testing approaches
   - User acceptance criteria

6. **Rollback Strategy**
   - Backup and rollback procedures
   - Risk mitigation approaches
   - Monitoring and alerting

Provide practical, actionable guidance for a smooth migration process.`;
    },
  });
}
