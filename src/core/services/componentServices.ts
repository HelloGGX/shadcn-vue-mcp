import z from "zod";

export class ComponentServices {
  private static readonly BASE_URL = `https://cdn.jsdelivr.net/gh/unovue/shadcn-vue@dev/apps/www`;
  private static readonly CONTEXT7_API_BASE_URL = "https://context7.com/api";
  private static readonly DEFAULT_TYPE = "txt";
  private static readonly DEFAULT_MINIMUM_TOKENS = 1000;

  constructor() {}

  static async fetchLibraryDocumentation(
    libraryId: string,
    options: {
      tokens?: number;
      topic?: string;
      folders?: string;
    } = {
      tokens: ComponentServices.DEFAULT_MINIMUM_TOKENS,
      topic: "general",
      folders: "docs",
    }
  ): Promise<string | null> {
    try {
      if (libraryId.startsWith("/")) {
        libraryId = libraryId.slice(1);
      }
      const url = new URL(
        `${ComponentServices.CONTEXT7_API_BASE_URL}/v1/${libraryId}`
      );
      if (options.tokens)
        url.searchParams.set("tokens", options.tokens.toString());
      if (options.topic) url.searchParams.set("topic", options.topic);
      if (options.folders) url.searchParams.set("folders", options.folders);
      url.searchParams.set("type", ComponentServices.DEFAULT_TYPE);
      const response = await fetch(url, {
        headers: {
          "X-Context7-Source": "mcp-server",
        },
      });
      if (!response.ok) {
        console.error(`Failed to fetch documentation: ${response.status}`);
        return null;
      }
      const text = await response.text();
      if (
        !text ||
        text === "No content available" ||
        text === "No context data available"
      ) {
        return null;
      }
      return text;
    } catch (error) {
      console.error("Error fetching library documentation:", error);
      return null;
    }
  }

  static async readFullComponentDoc({
    name,
    type,
  }: {
    name: string;
    type: string;
  }) {
    const res = await fetch(
      `${ComponentServices.BASE_URL}/src/content/docs/${type}/${name}.md`
    );
    const content = await res.text();
    // 检查内容是否包含 404 错误信息
    if (content.includes('<div class="error-code">404</div>')) {
      return "No documentation found for this component";
    }
    return content;
  }
  static createNecessityFilter(necessity: string) {
    return (component: { necessity: string }) => {
      const score: Record<string, number> = {
        critical: 3,
        important: 2,
        optional: 1,
      };
      return (score[component.necessity] ?? 0) >= (score[necessity] ?? 0);
    };
  }
}

export const ComponentSchema = z.object({
  name: z.string(),
  necessity: z.enum(["critical", "important", "optional"]),
  justification: z.string(),
});

export const ComponentsSchema = z.object({
  components: z.array(ComponentSchema),
  charts: z.array(ComponentSchema),
});

export default ComponentServices;
