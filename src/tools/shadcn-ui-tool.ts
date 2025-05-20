import { z } from "zod";
import { BaseTool } from "../utils/base-tool.js";
import {
  ComponentsSchema,
  ComponentSchema,
  createNecessityFilter,
  extractComponents,
  transformMessages,
  fetchComponentFiles,
} from "../utils/components.js";
import { CREATE_UI, FILTER_COMPONENTS, REFINED_UI } from "../prompts/ui.js";
import { generateText } from "ai";
import { createDeepSeek } from "@ai-sdk/deepseek";
import dotenv from "dotenv";
import { CallbackServer } from "../utils/callback-server.js";
import { parseMessageToJson } from "../utils/parser.js";

// Load environment variables from .env file if present
dotenv.config();

const OPENROUTER_MODEL_ID = process.env.OPENROUTER_MODEL_ID;
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

// 创建一个获取OpenRouter客户端的函数，包含环境变量检查
if (!OPENROUTER_MODEL_ID) {
  throw new Error("OPENROUTER_MODEL_ID is not set");
}
if (!OPENROUTER_API_KEY) {
  throw new Error("OPENROUTER_API_KEY is not set");
}

const deepseek = createDeepSeek({
  apiKey: OPENROUTER_API_KEY,
});

export class createUiTool extends BaseTool {
  name = "create-ui";
  description = `create Web UI with tailwindcss components, Use this tool when mentions /ui`;

  // 参数定义
  schema = z.object({
    description: z.string().describe("description of the Web UI"),
  });

  async execute({ description }: z.infer<typeof this.schema>): Promise<{
    content: Array<{ type: "text"; text: string }>;
  }> {
    const components = await extractComponents();
    // // 使用AI模型来筛选适合用户需求的UI组件
    const transformedMessages = transformMessages([
      {
        role: "assistant",
        content: {
          type: "text",
          text: `<description>${description}</description>
          ### CoreComponents
          ${components.coreComponents.map((c) => `${c}`).join("\n")}
          ### Marketing
          ${components.marketing.map((c) => `${c}`).join("\n")}
          ### Application
          ${components.application.map((c) => `${c}`).join("\n")}
          `,
        },
      },
    ]);
    const { text } = await generateText({
      system: FILTER_COMPONENTS,
      messages: transformedMessages,
      model: deepseek(OPENROUTER_MODEL_ID || ""),
      maxTokens: 2000,
    });
    const responseJson = parseMessageToJson(text);

    if (responseJson.component) {
      responseJson.components = responseJson.component;
      delete responseJson.component;
    }
    const filteredComponents = ComponentsSchema.parse(responseJson);

    const resultComponents = filteredComponents.components.filter(
      createNecessityFilter("optional")
    );
    const filteredComponentsFiles = await Promise.all(resultComponents.map(fetchComponentFiles));

    const { text: uiCode } = await generateText({
      system: CREATE_UI,
      messages: filteredComponentsFiles,
      model: deepseek(OPENROUTER_MODEL_ID || ""),
      maxTokens: 8192,
      maxRetries: 2,
    });

    return {
      content: [
        {
          type: "text",
          text: `${JSON.stringify(filteredComponentsFiles)}`,
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
    userMessage: z.string().describe("Full user's message about UI refinement"),
    absolutePathToRefiningFile: z
      .string()
      .describe("Absolute path to the file that needs to be refined"),
    context: z
      .string()
      .describe(
        "Extract the specific UI elements and aspects that need improvement based on user messages, code, and conversation history. Identify exactly which components (buttons, forms, modals, etc.) the user is referring to and what aspects (styling, layout, responsiveness, etc.) they want to enhance. Do not include generic improvements - focus only on what the user explicitly mentions or what can be reasonably inferred from the available context. If nothing specific is mentioned or you cannot determine what needs improvement, return an empty string."
      ),
  });

  async execute({ userMessage, absolutePathToRefiningFile, context }: z.infer<typeof this.schema>) {
    try {
      const fileContent = await this.getContentOfFile(absolutePathToRefiningFile);

      const { text } = await generateText({
        system: REFINED_UI,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `<description>${userMessage}</description>
                <refining-component>${fileContent}</refining-component>
                ${context}
                `,
              },
            ],
          },
        ],
        model: deepseek(OPENROUTER_MODEL_ID || ""),
        maxTokens: 8192,
        maxRetries: 2,
      });

      return {
        content: [
          {
            type: "text" as const,
            text: text,
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
          text: JSON.stringify(componentData),
        },
      ],
    };
  }
}
