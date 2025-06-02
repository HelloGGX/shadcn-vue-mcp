import { FastMCP } from "fastmcp";
import { z } from "zod";
import * as services from "./services/index.js";
import {
  FILTER_COMPONENTS_PROMPT,
  SHADCN_VUE_COMPONENTS,
  SHADCN_VUE_CHARTS,
} from "./prompts/componentPrompts.js";

/**
 * Register all tools with the MCP server
 *
 * @param server The FastMCP server instance
 */
export function registerTools(server: FastMCP) {
  // readUsageDocTool  tool
  server.addTool({
    name: "component-usage-doc",
    description:
      "read usage doc of a component， Use this tool when mentions /usedoc.",
    parameters: z.object({
      name: z.string().describe("name of the component, lowercase, kebab-case"),
    }),
    execute: async (params) => {
      try {
        const doc = await services.ComponentServices.fetchLibraryDocumentation(
          "/unovue/shadcn-vue",
          {
            topic: params.name,
            tokens: 1000,
          }
        );
        return {
          content: [
            {
              type: "text",
              text: doc || "No documentation found for this component",
            },
          ],
        };
      } catch (error) {
        console.error("Error executing tool:", error);
        throw error;
      }
    },
  });

  // readFullDocTool  tool
  server.addTool({
    name: "component-full-doc",
    description:
      "read full doc of a component, Use this tool when mentions /doc.",
    parameters: z.object({
      // components | charts
      type: z.enum(["components", "charts"]),
      name: z.string().describe("name of the component, lowercase, kebab-case"),
    }),
    execute: async (params) => {
      try {
        const doc = await services.ComponentServices.readFullComponentDoc({
          type: params.type,
          name: params.name,
        });
        return {
          content: [
            {
              type: "text",
              text: doc,
            },
          ],
        };
      } catch (error) {
        console.error("Error executing tool:", error);
        throw error;
      }
    },
  });

  // filterComponents Tool
  server.addTool({
    name: "components-filter",
    description:
      "filter components with shadcn/ui components and tailwindcss, Use this tool when mentions /filter",
    parameters: z.object({
      description: z.string().describe("description of the Web UI"),
    }),
    execute: async (params) => {
      try {
        // 使用readFullComponentDoc获取每个组件的文档
        async function getInfo(type: string, name: string) {
          const doc = await services.ComponentServices.readFullComponentDoc({
            type: type,
            name: name,
          });
          // 获取每个文档中的description的内容
          const description = doc.match(/description: (.*)/)?.[1];
          return `- ${name}: ${description}`;
        }
        // 将筛选任务和数据传给 IDE 的 AI 处理
        const filteringPrompt = `
            ${FILTER_COMPONENTS_PROMPT}
            <description>${params.description}</description>
            <available-components>
            ${SHADCN_VUE_COMPONENTS.map((comp) =>
              getInfo("components", comp)
            ).join("\n")}
            ${SHADCN_VUE_CHARTS.map((chart) => getInfo("charts", chart)).join(
              "\n"
            )}
            </available-components>
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

  // createComponentTool  tool
  server.addTool({
    name: "component-builder",
    description: `"Use this tool when the user requests a new UI component—e.g., mentions /ui, or asks for a button, input, dialog, table, form, banner, card, or other Vue component.
This tool ONLY returns the text snippet for that UI component with shadcn/ui components and tailwindcss. 
After calling this tool, you must edit or add files to integrate the snippet into the codebase."`,
    parameters: z.object({
      filteredComponents: z.string().transform((str) => {
        return services.ComponentsSchema.parse(JSON.parse(str));
      }),
      message: z.string().describe("Full users message"),
    }),
    execute: async (params) => {
      try {
        // 验证组件是否存在于可用组件列表中
        const availableComponents = new Set([
          ...SHADCN_VUE_COMPONENTS,
          ...SHADCN_VUE_CHARTS,
        ]);

        // 过滤掉不存在的组件
        const validComponents = params.filteredComponents.components.filter(
          (component) => {
            const isValid = availableComponents.has(component.name);
            if (!isValid) {
              console.warn(
                `Warning: Component "${component.name}" is not available in shadcn/vue. Skipping...`
              );
            }
            return isValid;
          }
        );

        const validCharts = params.filteredComponents.charts.filter((chart) => {
          const isValid = availableComponents.has(chart.name);
          if (!isValid) {
            console.warn(
              `Warning: Chart "${chart.name}" is not available in shadcn/vue. Skipping...`
            );
          }
          return isValid;
        });

        // 如果没有有效组件，提供默认建议
        if (validComponents.length === 0 && validCharts.length === 0) {
          console.warn(
            "No valid components found. Using default components for basic layout."
          );
          return {
            content: [
              {
                type: "text",
                text: "No valid components found. Using default components for basic layout.",
              },
            ],
          };
        }

        


      } catch (error) {
        console.error("Error executing tool:", error);
        throw error;
      }
    },
  });
}
