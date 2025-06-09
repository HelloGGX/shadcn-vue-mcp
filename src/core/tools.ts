import { FastMCP } from "fastmcp";
import { z } from "zod";
import * as services from "./services/index.js";
import {
  CHECK_COMPONENT_QUALITY_PROMPT,
  CREATE_COMPONENT_PROMPT,
  FILTER_COMPONENTS_PROMPT,
} from "./prompts/componentPrompts.js";

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
        .describe("Content about user requirement in specific contextual information"),
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

  // filterComponents Tool 筛选组件
  server.addTool({
    name: "components-filter",
    description:
      "filter components with shadcn/ui components and tailwindcss, Use this tool when mentions /filter",
    parameters: z.object({
      message: z.string().describe("requirement json from requirement-structuring tool"),
    }),
    execute: async (params) => {
      try {
        // 将筛选任务和数据传给 IDE 的 AI 处理
        const filteringPrompt = `
        ${FILTER_COMPONENTS_PROMPT}\n<user-message>${params.message}</user-message>
        After outputting the json, call the all-components-doc tool
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
    description: "read usage doc of a component， Use this tool when mentions /doc.",
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
        const processedDoc = await services.ComponentServices.createComponentDoc(
          params.name,
          params.type
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
              text: `${processedDoc}`,
            },
          ],
        };
      } catch (error) {
        console.error("Error executing tool:", error);
        throw error;
      }
    },
  });

  // all-components-doc tool 读取所有组件文档
  server.addTool({
    name: "all-components-doc",
    description:
      "Retrieve documentation for all filtered components and charts to prepare for component generation",
    parameters: z.object({
      components: z
        .array(services.ComponentSchema)
        .describe("components from components-filter tool"),
      charts: z.array(services.ComponentSchema).describe("charts from components-filter tool"),
    }),
    execute: async (params) => {
      try {
        // 并发处理所有组件文档
        const componentPromises = params.components.map(async (component) => {
          const processedDoc = await services.ComponentServices.fetchLibraryDocumentation(
            "/unovue/shadcn-vue",
            {
              topic: component.name,
              tokens: 700,
            }
          );
          return {
            name: component.name,
            type: "component",
            doc: JSON.stringify(processedDoc),
          };
        });

        // 并发处理所有图表文档
        const chartPromises = params.charts.map(async (chart) => {
          const processedDoc = await services.ComponentServices.fetchLibraryDocumentation(
            "/unovue/shadcn-vue",
            {
              topic: chart.name,
              tokens: 700,
            }
          );
          return {
            name: chart.name,
            type: "chart",
            doc: JSON.stringify(processedDoc),
          };
        });

        // 等待所有文档处理完成
        const [componentResults, chartResults] = await Promise.all([
          Promise.all(componentPromises),
          Promise.all(chartPromises),
        ]);

        const filteredComponents = {
          components: componentResults,
          charts: chartResults,
        };

        // 转为结构化 markdown 内容
        const structuredMarkdown =
          services.ComponentServices.convertToStructuredMarkdown(filteredComponents);
        const prompt = `${structuredMarkdown}\n${CREATE_COMPONENT_PROMPT}`;

        return {
          content: [
            {
              type: "text",
              text: prompt,
            },
          ],
        };
      } catch (error) {
        console.error("Error executing all-components-doc tool:", error);
        throw error;
      }
    },
  });

  // 生成一个质量打分工具，给基于component-builder tool生成的组件进行检测
  server.addTool({
    name: "component-quality-check",
    description:
      "Check the quality of a component whenever a component is generate or updated. Use this tool when mentions /check",
    parameters: z.object({
      absolute_component_path: z.string().describe("absolute path of the component"),
    }),
    execute: async (params) => {
      // 1. 规范化文件路径
      const componentCode = await services.ComponentServices.getContentOfFile(
        params.absolute_component_path
      );

      const prompt = `${CHECK_COMPONENT_QUALITY_PROMPT}\n\`\`\`vue\n${componentCode}\`\`\``;

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

  // component-builder tool 组件构建
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
      - query resource standards://component-quality
      - This resource contains the complete quality profile that defines all requirements for component generation
      - Five core dimensions: Accessibility, Performance, Consistency, Maintainability, Developer Experience
      - Target quality level: A or higher (450+ points out of 500)

      Use the following MCP tools one after the other in this exact sequence. At each stage, you must review and apply the quality standards from the resource. Your responses must be professional, precise, and always with the ultimate goal of producing code that complies with the specifications. Do not make any assumptions or create anything outside of the standards.
       
       1. requirement-structuring, user requirement: ${params.message}
       2. components-filter
       3. all-components-doc
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
