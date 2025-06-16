import { FastMCP } from "fastmcp";
import { z } from "zod";
import * as services from "./services/index.js";
import { getComponentPrompt, getComponentQualityCheckPrompt, getFilterComponentsPrompt } from "./prompts/componentPrompts.js";
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
      // 智能识别用户描述中的图标库偏好
      const detectIconLibrary = (message: string): "@nuxt/icon" | "lucide" => {
        const lowerMessage = message.toLowerCase();
        // 优先检查明确的图标库关键词
        if (lowerMessage.includes("nuxt")) {
          return "@nuxt/icon";
        }
        // 如果没有明确指定，返回默认值
        return "lucide";
      };

      // 如果用户没有显式指定 icon，则从描述中智能识别
      const icon = detectIconLibrary(params.message);

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
      },
      "icon": "${icon}"
    }
   \`\`\`
3.  After outputting the JSON, you **must** call the \`components-filter\` tool with the JSON as the input. 
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
      "Retrieve documentation for all filtered components and charts to prepare for component generation, This tool ONLY returns the text snippet for that UI component. After calling this tool, you must edit or add files to integrate the snippet into the codebase.",
    parameters: z.object({
      icon: z
        .enum(["@nuxt/icon", "lucide"])
        .describe("icon module of the component")
        .optional()
        .default("lucide"),
      components: z
        .array(services.ComponentSchema)
        .describe("components from components-filter tool"),
      charts: z.array(services.ComponentSchema).describe("charts from components-filter tool"),
    }),
    execute: async (params) => {
      try {
        const necessityFilter = services.ComponentServices.createNecessityFilter("optional");
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
        console.error("Error executing component-builder tool:", error);
        throw error;
      }
    },
  });

  // component-quality-check tool 组件质量检查
  server.addTool({
    name: "component-quality-check",
    description:
      "Automatically check Vue component quality and provide detailed feedback. Use this tool when you need to validate component quality, accessibility, performance, and best practices compliance. or when mentions /check.",
    parameters: z.object({
      componentCode: z.string().describe("code of the component from component-builder tool")
    }),
    execute: async (params) => {
      const prompt = getComponentQualityCheckPrompt(params.componentCode || "");

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
