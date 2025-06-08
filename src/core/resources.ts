import { FastMCP } from "fastmcp";
import { getQualityStandard } from "./prompts/componentPrompts.js";

/**
 * Register all resources with the MCP server
 * @param server The FastMCP server instance
 */
export function registerResources(server: FastMCP) {
  // Component Quality Profile (Structured for AI consumption)
  server.addResource({
    uri: "standards://component-quality",
    name: "Component Quality Standards",
    description: "Structured quality profile optimized for AI code generation",
    mimeType: "application/json",
    async load() {
      const standards = getQualityStandard();
      return {
        text: JSON.stringify(standards.qualityProfile, null, 2),
      };
    },
  });
}
