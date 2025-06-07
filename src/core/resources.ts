import { FastMCP } from "fastmcp";
import * as services from "./services/index.js";
import { getQualityStandard } from "./prompts/componentPrompts.js";

/**
 * Register all resources with the MCP server
 * @param server The FastMCP server instance
 */
export function registerResources(server: FastMCP) {
  
  // Component Quality Profile (Structured for AI consumption)
  server.addResourceTemplate({
    uriTemplate: "standards://quality-profile",
    name: "Component Quality Profile",
    description: "Structured quality profile optimized for AI code generation",
    mimeType: "application/json",
    arguments: [],
    async load() {
      const standards = getQualityStandard();
      return {
        text: JSON.stringify(standards.qualityProfile, null, 2)
      };
    }
  });
} 