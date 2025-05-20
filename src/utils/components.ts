import { PromptMessage } from "@modelcontextprotocol/sdk/types.js";
import { CoreMessage } from "ai";
import { z } from "zod";

const CONTEXT7_API_BASE_URL = "https://context7.com/api";
const DEFAULT_TYPE = "txt";
const DEFAULT_MINIMUM_TOKENS = 500;

type ComponentDirectory = {
  application: string[];
  coreComponents: string[];
  marketing: string[];
};

type GithubApiResponse = Array<{ name: string }>;

export async function extractComponents(): Promise<ComponentDirectory> {
  const componentPaths = ["Application", "CoreComponents", "Marketing"];

  try {
    const results = await Promise.all(
      componentPaths.map((path) =>
        fetch(
          `https://api.github.com/repos/TailGrids/tailgrids-vue/contents/src/components/${path}`
        )
          .then((res) => res.json())
          .then((data: GithubApiResponse) => data.map((item) => item.name))
      )
    );

    return {
      application: results[0],
      coreComponents: results[1],
      marketing: results[2],
    };
  } catch (error) {
    console.error("Error fetching component directories:", error);
    return { application: [], coreComponents: [], marketing: [] };
  }
}

export const ComponentSchema = z.object({
  name: z.string(),
  type: z.enum(["CoreComponents", "Application", "Marketing"]),
  necessity: z.enum(["critical", "important", "optional"]),
  justification: z.string(),
});

export const ComponentsSchema = z.object({
  components: z.array(ComponentSchema),
});

export const fetchComponentFiles = async (component: any) => {
  const vueFiles = await fetch(
    `https://api.github.com/repos/TailGrids/tailgrids-vue/contents/src/components/${component.type}/${component.name}`
  );
  const files = await vueFiles.json();
  // 只筛选.vue后缀的文件
  const vues = files.filter((file: any) => file.name.endsWith(".vue"));
  return { ...component, files: vues.map((file: any) => file.name) };
};

export function createNecessityFilter(necessity: string) {
  return (component: { necessity: string }) => {
    const score: Record<string, number> = {
      critical: 3,
      important: 2,
      optional: 1,
    };
    return (score[component.necessity] ?? 0) >= (score[necessity] ?? 0);
  };
}

export function transformMessages(messages: PromptMessage[]): CoreMessage[] {
  return messages.map((m) => ({
    role: m.role,
    content: [
      {
        type: m.content.type as "text",
        text: m.content.text as string,
      },
    ],
  }));
}

/**
 * Fetches documentation context for a specific library
 * @param libraryId The library ID to fetch documentation for
 * @param options Options for the request
 * @returns The documentation text or null if the request fails
 */
export async function fetchLibraryDocumentation(
  libraryId: string,
  options: {
    tokens?: number;
    topic?: string;
    folders?: string;
  } = {
    tokens: DEFAULT_MINIMUM_TOKENS,
    topic: "general",
    folders: "docs",
  }
): Promise<string | null> {
  try {
    if (libraryId.startsWith("/")) {
      libraryId = libraryId.slice(1);
    }
    const url = new URL(`${CONTEXT7_API_BASE_URL}/v1/${libraryId}`);
    if (options.tokens) url.searchParams.set("tokens", options.tokens.toString());
    if (options.topic) url.searchParams.set("topic", options.topic);
    if (options.folders) url.searchParams.set("folders", options.folders);
    url.searchParams.set("type", DEFAULT_TYPE);
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
    if (!text || text === "No content available" || text === "No context data available") {
      return null;
    }
    return text;
  } catch (error) {
    console.error("Error fetching library documentation:", error);
    return null;
  }
}
