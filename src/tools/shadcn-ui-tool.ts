import { z } from "zod";
import { BaseTool } from "../utils/base-tool.js";
import {
  ComponentsSchema,
  createNecessityFilter,
  fetchLibraryDocumentation,
  readFullComponentDoc,
} from "../utils/components.js";
import { CREATE_UI, FILTER_COMPONENTS, REFINED_UI } from "../prompts/ui.js";
import dotenv from "dotenv";
import { CallbackServer } from "../utils/callback-server.js";
import components from "../Data/shadcn-vue.json" with { type: "json" };
import { jsonrepair } from "jsonrepair";

// Load environment variables from .env file if present
dotenv.config();

export class readUsageDocTool extends BaseTool {
  name = "read-usage-doc";
  description = "read usage doc of a component， Use this tool when mentions /usedoc.";

  // 参数定义
  schema = z.object({
    name: z.string().describe("name of the component, lowercase, kebab-case"),
  });

  async execute({ name }: z.infer<typeof this.schema>): Promise<{
    content: Array<{ type: "text"; text: string }>;
  }> {
    try {
      const doc = await fetchLibraryDocumentation("/unovue/shadcn-vue", {
        topic: name,
        tokens: 1000,
      });
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
  }
}
export class readFullDocTool extends BaseTool {
  name = "read-full-doc";
  description = "read full doc of a component, Use this tool when mentions /doc.";

  // 参数定义
  schema = z.object({
    name: z.string().describe("name of the component, lowercase, kebab-case"),
  });

  async execute({ name }: z.infer<typeof this.schema>): Promise<{
    content: Array<{ type: "text"; text: string }>;
  }> {
    try {
      const doc = await readFullComponentDoc({ name });
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
  }
}
export class filterComponentsTool extends BaseTool {
  name = "filter-components";
  description = `filter components with shadcn/ui components and tailwindcss, Use this tool when mentions /filter`;

  schema = z.object({
    description: z.string().describe("description of the Web UI"),
  });

  async execute({ description }: z.infer<typeof this.schema>): Promise<{
    content: Array<{ type: "text"; text: string }>;
  }> {
    // 将筛选任务和数据传给 IDE 的 AI 处理
    const filteringPrompt = `
    ${FILTER_COMPONENTS}
    <description>${description}</description>
    <available-components>
    - Available shadcn/vue components:
    ${components.components.map((comp) => `- ${comp}`).join("\n")}
    - Available charts:
    ${components.charts.map((chart) => `- ${chart}`).join("\n")}
    </available-components>
`;

    return {
      content: [
        {
          type: "text",
          text: jsonrepair(filteringPrompt),
        },
      ],
    };
  }
}
export class createUiWithDocTool extends BaseTool {
  name = "create-ui-with-doc";
  description = `create Web UI with shadcn/ui components and tailwindcss, after filter-components`;

  // 参数定义
  schema = z.object({
    filteredComponents: z.string().transform((str) => {
      return ComponentsSchema.parse(JSON.parse(str));
    }),
    description: z.string().describe("description of the Web UI"),
  });

  async execute({ filteredComponents, description }: z.infer<typeof this.schema>): Promise<{
    content: Array<{ type: "text"; text: string }>;
  }> {
    // 验证组件是否存在于可用组件列表中
    const availableComponents = new Set([...components.components, ...components.charts]);

    // 过滤掉不存在的组件
    const validComponents = filteredComponents.components.filter((component) => {
      const isValid = availableComponents.has(component.name);
      if (!isValid) {
        console.warn(
          `Warning: Component "${component.name}" is not available in shadcn/vue. Skipping...`
        );
      }
      return isValid;
    });

    const validCharts = filteredComponents.charts.filter((chart) => {
      const isValid = availableComponents.has(chart.name);
      if (!isValid) {
        console.warn(`Warning: Chart "${chart.name}" is not available in shadcn/vue. Skipping...`);
      }
      return isValid;
    });

    // 如果没有有效组件，提供默认建议
    if (validComponents.length === 0 && validCharts.length === 0) {
      console.warn("No valid components found. Using default components for basic layout.");
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
      validComponents.filter(createNecessityFilter("optional")).map(async (c) => {
        return {
          ...c,
          doc: await fetchLibraryDocumentation("/unovue/shadcn-vue", {
            topic: c.name,
            tokens: 700,
          }),
        };
      })
    );
    const promptForClientAI = `${CREATE_UI}
  <description>
  ${description}
  </description>
  <available-components>
  ${usageDocs
    .map((d) => {
      return `<component name="${d.name}">
    <justification><![CDATA[${d.justification}]]></justification>
    <documentation><![CDATA[${d.doc}]]></documentation>
  </component>`;
    })
    .join("\n")}
  </available-components>
  <instructions>
  Based on the user description and available components above, create a complete Vue.js component that implements the requested UI. Follow all the guidelines in the system prompt above.
  </instructions>`;
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(promptForClientAI),
        },
      ],
    };
  }
}
export class createUiTool extends BaseTool {
  name = "create-ui";
  description = `create Web UI with shadcn/ui components and tailwindcss, Use this tool when mentions /ui`;

  schema = z.object({});

  async execute({}: z.infer<typeof this.schema>): Promise<{
    content: Array<{ type: "text"; text: string }>;
  }> {
    return {
      content: [
        {
          type: "text",
          text: `Use the following MCP tools one after the other in this exact sequence:
          1. filter-components
          2. create-ui-with-doc
          `,
        },
      ],
    };
  }
}
export class refineCodeTool extends BaseTool {
  name = "refine-code";
  description = `refine code with shadcn/ui components and tailwindcss,
  Use this tool when the user requests to refine/improve current UI component with /ui commands`;

  schema = z.object({
    absolutePathToRefiningFile: z
      .string()
      .describe("Absolute path to the file that needs to be refined"),
    context: z
      .string()
      .describe(
        "Extract the specific UI elements and aspects that need improvement based on user messages, code, and conversation history. Identify exactly which components (buttons, forms, modals, etc.) the user is referring to and what aspects (styling, layout, responsiveness, etc.) they want to enhance. Do not include generic improvements - focus only on what the user explicitly mentions or what can be reasonably inferred from the available context. If nothing specific is mentioned or you cannot determine what needs improvement, return an empty string."
      ),
  });

  async execute({ absolutePathToRefiningFile, context }: z.infer<typeof this.schema>) {
    try {
      const fileContent = await this.getContentOfFile(absolutePathToRefiningFile);

      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(`
              ${REFINED_UI}
              <description>${context}</description>
              <refining-component>${fileContent}</refining-component>
              `),
          },
        ],
      };
    } catch (error) {
      console.error("Error executing tool", error);
      throw error;
    }
  }

  private async getContentOfFile(path: string): Promise<string> {
    try {
      const fs = await import("fs/promises");
      return await fs.readFile(path, "utf-8");
    } catch (error) {
      console.error(`Error reading file ${path}:`, error);
      return "";
    }
  }
}
export class reviewUITool extends BaseTool {
  name = "review-ui";
  description = `Whenever the user mentions /review, automatically use shadcn/ui components and Tailwind CSS to create or enhance a UI preview based on the results from createUiTool or refineCodeTool. Trigger this behavior right after either tool completes. Provide a visual preview of the UI with clean, styled components using best practices.`;

  // 参数定义
  schema = z.object({
    code: z.string().describe("code of the Web UI from createUiTool or refineCodeTool"),
  });

  async execute({ code }: z.infer<typeof this.schema>): Promise<{
    content: Array<{ type: "text"; text: string }>;
  }> {
    // 预览组件
    const server = new CallbackServer();
    // 启动服务器并打开浏览器
    const { data } = await server.promptUser({
      initialData: code,
    });

    const componentData = data || {
      text: "No component data received. Please try again.",
    };

    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify(componentData, null, 2),
        },
      ],
    };
  }
}
