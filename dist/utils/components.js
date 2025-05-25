import { fromMarkdown } from "mdast-util-from-markdown";
import { visitParents } from "unist-util-visit-parents";
import { z } from "zod";
const BASE_URL = `https://cdn.jsdelivr.net/gh/unovue/shadcn-vue@dev/apps/www`;
const CONTEXT7_API_BASE_URL = "https://context7.com/api";
const DEFAULT_TYPE = "txt";
const DEFAULT_MINIMUM_TOKENS = 1000;
function extractVueCodeBlocks(markdownContent) {
    // Parse the markdown into an AST
    const ast = fromMarkdown(markdownContent);
    // 初始化变量用于存储 "Usage" 部分的信息
    // usageHeadingNode: 存储 "Usage" 标题节点
    // usageSectionStart: 存储 "Usage" 部分开始的行号
    // usageSectionEnd: 存储 "Usage" 部分结束的行号，初始设为无穷大
    // let usageHeadingNode = null;
    let usageSectionStart = -1;
    let usageSectionEnd = Infinity;
    // 使用 unist-util-visit-parents 库遍历 AST，查找 "Usage" 标题
    // visitParents 函数接收三个参数：AST、要查找的节点类型、回调函数
    visitParents(ast, "heading", (node) => {
        // 检查当前节点是否为二级标题(## Usage)
        // 并且标题文本为 "Usage"
        if (node.depth === 2 && // 检查是否为二级标题
            node.children &&
            node.children[0] &&
            node.children[0].type === "text" &&
            node.children[0].value === "Usage") {
            // usageHeadingNode = node;
            usageSectionStart = node.position?.end?.line || -1;
        }
    });
    // If no Usage section, return empty array
    if (usageSectionStart === -1) {
        console.log("No Usage section found in the markdown");
        return [];
    }
    // 再次遍历 AST，查找 "Usage" 部分之后的下一个二级标题
    // 这用于确定 "Usage" 部分的结束位置
    visitParents(ast, "heading", (node) => {
        const headingLine = node.position?.start?.line || Infinity;
        if (node.depth === 2 && headingLine > usageSectionStart && headingLine < usageSectionEnd) {
            usageSectionEnd = headingLine;
        }
    });
    // 初始化数组用于存储提取的 Vue 代码块
    const tsxBlocks = [];
    visitParents(ast, "code", (node) => {
        const nodeLine = node.position?.start?.line || 0;
        // 检查代码块是否在 "Usage" 部分内，且语言为 "vue"
        if (nodeLine > usageSectionStart && nodeLine < usageSectionEnd && node.lang === "vue") {
            tsxBlocks.push(node.value);
        }
    });
    return tsxBlocks;
}
export async function readFullComponentDoc({ name }) {
    const res = await fetch(`${BASE_URL}/src/content/docs/components/${name}.md`);
    const content = await res.text();
    // 检查内容是否包含 404 错误信息
    if (content.includes('<div class="error-code">404</div>')) {
        return "No documentation found for this component";
    }
    return content;
}
export async function readUsageComponentDoc({ name }) {
    const fileContent = await readFullComponentDoc({ name });
    const usageBlocks = extractVueCodeBlocks(fileContent);
    return `\`\`\`\`vue
${usageBlocks.join("\n")}
\`\`\`\``;
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
export function createNecessityFilter(necessity) {
    return (component) => {
        const score = {
            critical: 3,
            important: 2,
            optional: 1,
        };
        return (score[component.necessity] ?? 0) >= (score[necessity] ?? 0);
    };
}
export function transformMessages(messages) {
    return messages.map((m) => ({
        role: m.role,
        content: [
            {
                type: m.content.type,
                text: m.content.text,
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
export async function fetchLibraryDocumentation(libraryId, options = {
    tokens: DEFAULT_MINIMUM_TOKENS,
    topic: "general",
    folders: "docs",
}) {
    try {
        if (libraryId.startsWith("/")) {
            libraryId = libraryId.slice(1);
        }
        const url = new URL(`${CONTEXT7_API_BASE_URL}/v1/${libraryId}`);
        if (options.tokens)
            url.searchParams.set("tokens", options.tokens.toString());
        if (options.topic)
            url.searchParams.set("topic", options.topic);
        if (options.folders)
            url.searchParams.set("folders", options.folders);
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
    }
    catch (error) {
        console.error("Error fetching library documentation:", error);
        return null;
    }
}
