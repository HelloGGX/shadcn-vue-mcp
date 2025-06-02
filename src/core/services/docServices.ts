export class DocServices {
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
      tokens: DocServices.DEFAULT_MINIMUM_TOKENS,
      topic: "general",
      folders: "docs",
    }
  ): Promise<string | null> {
    try {
      if (libraryId.startsWith("/")) {
        libraryId = libraryId.slice(1);
      }
      const url = new URL(
        `${DocServices.CONTEXT7_API_BASE_URL}/v1/${libraryId}`
      );
      if (options.tokens)
        url.searchParams.set("tokens", options.tokens.toString());
      if (options.topic) url.searchParams.set("topic", options.topic);
      if (options.folders) url.searchParams.set("folders", options.folders);
      url.searchParams.set("type", DocServices.DEFAULT_TYPE);
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

  static async readFullComponentDoc({ name }: { name: string }) {
    const res = await fetch(
      `${DocServices.BASE_URL}/src/content/docs/components/${name}.md`
    );
    const content = await res.text();
    // 检查内容是否包含 404 错误信息
    if (content.includes('<div class="error-code">404</div>')) {
      return "No documentation found for this component";
    }
    return content;
  }
}

export default DocServices;
