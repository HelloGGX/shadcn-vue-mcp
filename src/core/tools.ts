import { FastMCP } from "fastmcp";
import { z } from "zod";
import * as services from "./services/index.js";
import {
  FILTER_COMPONENTS_PROMPT,
  CREATE_UI,
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
      "read usage doc of a component， Use this tool when mentions /doc.",
    parameters: z.object({
      // components | charts
      type: z.enum(["components", "charts"]),
      name: z
        .string()
        .describe(
          "name of the component from shadcn/vue, lowercase, kebab-case"
        )
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
              text: processedDoc || "No documentation found for this component",
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
      message: z.string().describe("description of the Web UI"),
    }),
    execute: async (params) => {
      try {
        // 将筛选任务和数据传给 IDE 的 AI 处理
        const filteringPrompt = `${FILTER_COMPONENTS_PROMPT}\n<user-message>${params.message}</user-message>`;

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
      filteredComponents: z
        .string()
        .transform((str) => {
          return services.ComponentsSchema.parse(JSON.parse(str));
        })
        .describe("filtered components from components-filter tool"),
      message: z.string().describe("Full users message"),
    }),
    execute: async (params) => {
      try {
        // 过滤掉不存在的组件
        const validComponents = params.filteredComponents.components.filter(
          (component) => {
            const isValid = services.ComponentServices.isValidComponent(
              component.name
            );
            if (!isValid) {
              console.warn(
                `Warning: Component "${component.name}" is not available in shadcn/vue. Skipping...`
              );
            }
            return isValid;
          }
        );

        const validCharts = params.filteredComponents.charts.filter((chart) => {
          const isValid = services.ComponentServices.isValidComponent(
            chart.name
          );
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

        // 获取组件文档
        const usageDocs = await Promise.all(
          [...validComponents, ...validCharts]
            .filter(
              services.ComponentServices.createNecessityFilter("optional")
            )
            .map(async (c) => {
              return {
                ...c,
                doc: await services.ComponentServices.fetchLibraryDocumentation(
                  "/unovue/shadcn-vue",
                  {
                    topic: c.name,
                    tokens: 1000,
                  }
                ),
              };
            })
        );

        const promptForClientAI = `${CREATE_UI}\n<message>${params.message}</message>`;

        return {
          content: [
            {
              type: "text",
              text: promptForClientAI,
            },
          ],
        };
      } catch (error) {
        console.error("Error executing tool:", error);
        throw error;
      }
    },
  });
}
