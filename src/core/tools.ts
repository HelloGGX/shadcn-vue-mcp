import { FastMCP } from "fastmcp";
import { z } from "zod";
import * as services from "./services/index.js";
import {
  CHECK_COMPONENT_QUALITY_PROMPT,
  getComponentPrompt,
  getFilterComponentsPrompt,
} from "./prompts/componentPrompts.js";
// import { CallbackServer } from "../server/callback-server.js";

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
      "analyze the user's natural language and structure the requirements into a clear and structured component requirement document. Use this tool when the user requests a new UI component—e.g., mentions /ui, or asks for a button, input, dialog, table, form, banner, card, or other Vue component",
    parameters: z.object({
      message: z
        .string()
        .describe("Content about user requirement in specific contextual information"),
    }),
    execute: async (params) => {
      const prompt = `
# Role
You are a Vue.js Frontend Architect, an expert in shadcn-vue.

# Task
Your task is to convert a simple user requirement into a production-ready component blueprint in JSON format. Analyze the user's underlying intent and add essential features they might have overlooked, such as loading states, error handling, user interactions, edge cases, and accessibility.

# Input
The user requirement will be provided via the \`${params.message}\` variable.

# Output Requirements
1.  **Strictly** return a single, valid JSON object with absolutely no extra text, explanations, or markdown.
2.  The JSON object **must** strictly follow this exact structure:
    \`\`\`json
    {
      "main_goal": "A one-sentence summary of the component's core purpose.",
      "data_structure": {
        "propertyName": "TypeScriptType - Brief description of its purpose."
      },
      "user_actions": {
        "actionName": "Description of the action's trigger and its effect."
      }
    }
   \`\`\`
3.  After outputting the JSON, you **must** call the \`components-filter\` tool. 
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
        const filteringPrompt = `${getFilterComponentsPrompt(params.message)}\nAfter outputting the json, call the component-builder tool`;

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
      type: z.enum(["components", "charts"]).describe("type of the component"),
      name: z
        .string()
        .describe("name of the component in lowercase")
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

  // component-builder tool 读取所有组件文档
  server.addTool({
    name: "component-builder",
    description:
      "Retrieve documentation for all filtered components and charts to prepare for component generation",
    parameters: z.object({
      icon: z.enum(["@nuxt/icon", "lucide"]).describe("icon module of the component"),
      components: z
        .array(services.ComponentSchema)
        .describe("components from components-filter tool"),
      charts: z.array(services.ComponentSchema).describe("charts from components-filter tool"),
    }),
    execute: async (params) => {
      try {
        const necessityFilter = services.ComponentServices.createNecessityFilter("important");
        // 并发处理所有组件文档
        const componentPromises = params.components
          .filter(necessityFilter)
          .map(async (component) => {
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
        const chartPromises = params.charts.filter(necessityFilter).map(async (chart) => {
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
        const prompt = `${getComponentPrompt(params.icon, structuredMarkdown)}`;

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

  // component-quality-check tool 组件质量检查
  server.addTool({
    name: "component-quality-check",
    description:
      "Automatically check Vue component quality and provide detailed feedback. This tool should be called immediately after creating any component to ensure it meets production standards. Use this tool when you need to validate component quality, accessibility, performance, and best practices compliance.",
    parameters: z.object({
      absolute_component_path: z
        .string()
        .describe("Absolute path to the component file that needs to be checked"),
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

  // // review-ui tool  UI预览
  // server.addTool({
  //   name: "review-ui",
  //   description:
  //     "Whenever the user mentions /review, automatically use shadcn/ui components and Tailwind CSS to create or enhance a UI preview based on the results from all-components-doc tool. Trigger this behavior right after either tool completes. Provide a visual preview of the UI with clean, styled components using best practices.",
  //   parameters: z.object({
  //     code: z.string().describe("code of the Web UI from all-components-doc tool"),
  //   }),
  //   execute: async (params) => {
  //     // 预览组件
  //     const server = new CallbackServer();
  //     // 启动服务器并打开浏览器
  //     const { data } = await server.promptUser({
  //       initialData: params.code,
  //     });

  //     const componentData = data || {
  //       text: "No component data received. Please try again.",
  //     };

  //     return {
  //       content: [
  //         {
  //           type: "text",
  //           text: JSON.stringify(componentData, null, 2),
  //         },
  //       ],
  //     };
  //   },
  // });
}
