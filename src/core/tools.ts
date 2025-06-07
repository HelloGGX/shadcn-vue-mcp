import { FastMCP } from "fastmcp";
import { z } from "zod";
import * as services from "./services/index.js";
import { FILTER_COMPONENTS_PROMPT } from "./prompts/componentPrompts.js";

/**
 * Register all tools with the MCP server
 *
 * @param server The FastMCP server instance
 */
export function registerTools(server: FastMCP) {
  // requirement-structuring 意图分析与需求结构化
  server.addTool({
    name: "requirement-structuring",
    description:
      "analyze the user's natural language and structure the requirements into a clear and structured component requirement document.",
    parameters: z.object({
      message: z
        .string()
        .describe(
          "Content about user requirement in specific contextual information"
        ),
    }),
    execute: async (params) => {
      const prompt = `You are an expert Vue.js Frontend Architect specializing in shadcn-vue components. Your task is to analyze user requirements, understand their underlying intent, and create a comprehensive JSON blueprint that includes both explicit requirements and essential features the user may not have considered.
  
  ANALYSIS APPROACH:
  1. First, understand what the user is trying to achieve
  2. Identify the core functionality they described
  3. Consider what additional features would be essential for a complete, production-ready component
  4. Think about common user interactions, edge cases, and accessibility needs
  5. Enhance the requirements with industry best practices
  
  TASK: Convert the following user requirement into a comprehensive JSON object that goes beyond their basic description.
  
  USER REQUIREMENT: "${params.message}"
  
  REQUIRED OUTPUT FORMAT:
  Return ONLY a valid JSON object with these exact keys (no explanations, no markdown, no extra text):
  
  {
    "main_goal": "One sentence describing the component's core purpose",
    "data_structure": {
      "property_name": "TypeScript_type - Brief description of purpose"
    },
    "user_actions": {
      "actionName": "Description of what triggers this action and its effect"
    }
  }
  
  EXAMPLE OUTPUT:
  {
    "main_goal": "Display a searchable user management table with add/edit capabilities and essential UX features",
    "data_structure": {
      "users": "User[] - Array of user objects to display",
      "searchQuery": "string - Current search filter value",
      "isDialogOpen": "boolean - Controls add/edit dialog visibility",
      "selectedUser": "User | null - User being edited",
      "isLoading": "boolean - Loading state for operations",
      "error": "string | null - Error message display"
    },
    "user_actions": {
      "searchUsers": "Triggered by search input; filters users with debouncing",
      "openAddDialog": "Triggered by Add button; opens dialog for new user",
      "openEditDialog": "Triggered by edit button; opens dialog with selected user data",
      "closeDialog": "Triggered by cancel/escape; closes dialog and clears state",
      "saveUser": "Triggered by form submit; validates and saves user with error handling",
      "deleteUser": "Triggered by delete button; shows confirmation then removes user"
    }
  }
  
   After outputting json, call components-filter tool`;

      return {
        content: [
          {
            type: "text",
            text: prompt,
          },
        ],
      };
    },
  });

  // filterComponents Tool
  server.addTool({
    name: "components-filter",
    description:
      "filter components with shadcn/ui components and tailwindcss, Use this tool when mentions /filter",
    parameters: z.object({
      message: z
        .string()
        .describe("requirement json from requirement-structuring tool"),
    }),
    execute: async (params) => {
      try {
        // 将筛选任务和数据传给 IDE 的 AI 处理
        const filteringPrompt = `
        ${FILTER_COMPONENTS_PROMPT}\n<user-message>${params.message}</user-message>
        After outputting the json, call the component-usage-doc tool for each element in components and charts
        `;

        return {
          content: [
            {
              type: "text",
              text: filteringPrompt,
            },
          ],
        };
      } catch (error) {
        console.error("Error executing tool:", error);
        throw error;
      }
    },
  });

  // readUsageDocTool  tool 读取组件使用文档
  server.addTool({
    name: "component-usage-doc",
    description:
      "read usage doc of a component， Use this tool when mentions /doc.",
    parameters: z.object({
      // components | charts
      type: z
        .enum(["components", "charts"])
        .describe("type of the component from components-filter tool"),
      name: z
        .string()
        .describe("name of the component from components-filter tool")
        .refine((name) => services.ComponentServices.isValidComponent(name), {
          message: "Component must be a valid shadcn/vue component",
        }),
    }),
    execute: async (params) => {
      try {
        const doc = await services.ComponentServices.readFullComponentDoc({
          type: params.type,
          name: params.name,
        });
        const demos = await services.ComponentServices.fetchUsageDemo(
          params.name
        );

        // 将文档中的 <ComponentPreview name="组件名" /> 替换为对应的 demo 代码
        // 确保demos是数组类型
        const demosArray = Array.isArray(demos) ? demos : [];
        const processedDoc =
          services.ComponentServices.replaceComponentPreviewsWithCode(
            doc,
            demosArray
          );

        // 在浏览器中打开markdown文档
        const componentTitle = `${params.name} - shadcn/vue Component Documentation`;
        await services.WebViewService.openMarkdownInBrowser(
          processedDoc || "No documentation found for this component",
          componentTitle
        );

        return {
          content: [
            {
              type: "text",
              text: `${processedDoc}\nAfter reading the documentation, call the component-creation tool`,
            },
          ],
        };
      } catch (error) {
        console.error("Error executing tool:", error);
        throw error;
      }
    },
  });

  // component-creation tool 组件生成器
  server.addTool({
    name: "component-creation",
    description: "create a new component",
    execute: async () => {
      const prompt = `
      **Task:**
        Now, combine all the parts to generate the final, production-level, complete \`.vue\` component code.

        1. **Code implementation:** Fill in all function logic and complete the attribute binding and event listening in the template.
        2. **Standard compliance:** During the implementation process, you must **check and meet** all the relevant items in the quality standards resource one by one, especially **performance optimization, DX, A11y and reverse constraints**.
        3. **Mock data processing:** If it is a pure display component, the generated Mock data structure must be clear, and the document comments should provide guidance on how to replace it with real data (\`mockDataGuidance\`).
        4. **Self-review:** After generating the final code, simulate a "Code Review" in your mind, and use the quality standards from the resource as a basis to conduct a quick self-assessment of your output to ensure that the delivered code can at least reach the 'A' level.

        **Please directly output the final \`.vue\` file code without any modification. **
        ## Component skeleton code
          \`\`\`vue
          <template>
            <!-- Use semantic HTML with proper ARIA attributes -->
          </template>

          <script setup lang="ts">
          import { ref, computed } from 'vue'
          <!-- shadcn-vue component imports -->
          <!-- Lucide icons imports   -->
          <!-- Type definitions -->

          <!-- Props with defaults -->
          interface Props {
            <!-- Define clear, typed props -->
          }

          const props = withDefaults(defineProps<Props>(), {
            <!-- Sensible defaults -->
          })

          <!-- Reactive state with proper types -->
          <!-- Computed properties for derived state -->
          <!-- Methods with clear naming -->
          </script>
          \`\`\`
      `;

      return {
        content: [
          {
            type: "text",
            text: prompt,
          },
        ],
      };
    },
  });

  server.addTool({
    name: "component-builder",
    description: `"Use this tool when the user requests a new UI component—e.g., mentions /ui, or asks for a button, input, dialog, table, form, banner, card, or other Vue component.
  This tool ONLY returns the text snippet for that UI component with shadcn/ui components and tailwindcss.
  After calling this tool, you must edit or add files to integrate the snippet into the codebase."`,
    parameters: z.object({
      message: z.string().describe("description of the Web UI"),
    }),
    execute: async (params) => {
      const prompt = `
      You are an AI code generation engine. Your sole mission is to generate Vue 3 components that meet the highest quality standards based on the shadcn-vue component library. Your behavior and output must **strictly and absolutely** adhere to the [High-Quality UI Component Standard Definition] available as a resource.

      **IMPORTANT**: Before proceeding, you MUST first read the quality standards from the resource:
      - Resource URI: standards://quality-profile
      - This resource contains the complete quality profile that defines all requirements for component generation

      Use the following MCP tools one after the other in this exact sequence. At each stage, you must review and apply the quality standards from the resource. Your responses must be professional, precise, and always with the ultimate goal of producing code that complies with the specifications. Do not make any assumptions or create anything outside of the standards.
       
       1. requirement-structuring, user requirement: ${params.message}
       `;

      return {
        content: [
          {
            type: "text",
            text: prompt,
          },
        ],
      };
    },
  });
}
