import { FastMCP } from "fastmcp";
import { z } from "zod";
import * as services from "./services/index.js";
import { FILTER_COMPONENTS_PROMPT, SHADCN_VUE_COMPONENTS, SHADCN_VUE_CHARTS } from "./prompts/componentPrompts.js";

/**
 * Register all tools with the MCP server
 *
 * @param server The FastMCP server instance
 */
export function registerTools(server: FastMCP) {
  // readUsageDocTool  tool
  server.addTool({
    name: "read-usage-doc",
    description:
      "read usage doc of a component， Use this tool when mentions /usedoc.",
    parameters: z.object({
      name: z.string().describe("name of the component, lowercase, kebab-case"),
    }),
    execute: async (params) => {
      try {
        const doc = await services.DocServices.fetchLibraryDocumentation(
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
    name: "read-full-doc",
    description:
      "read full doc of a component, Use this tool when mentions /doc.",
    parameters: z.object({
      name: z.string().describe("name of the component, lowercase, kebab-case"),
    }),
    execute: async (params) => {
      try {
        const doc = await services.DocServices.readFullComponentDoc({
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
    name: "filter-components",
    description:
      "filter components with shadcn/ui components and tailwindcss, Use this tool when mentions /filter",
    parameters: z.object({
      description: z.string().describe("description of the Web UI"),
    }),
    execute: async (params) => {
      try {
        // 将筛选任务和数据传给 IDE 的 AI 处理
        const filteringPrompt = `
            ${FILTER_COMPONENTS_PROMPT}
            <description>${params.description}</description>
            <available-components>
            Available shadcn/vue components:
            ${SHADCN_VUE_COMPONENTS.map((comp) => `- ${comp}`).join("\n")}
            
            Available charts:
            ${SHADCN_VUE_CHARTS.map((chart) => `- ${chart}`).join("\n")}
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

  
}
