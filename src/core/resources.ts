import { FastMCP } from "fastmcp";
import { getQualityStandard } from "./prompts/componentPrompts.js";

/**
 * Register all resources with the MCP server
 * @param server The FastMCP server instance
 */
export function registerResources(server: FastMCP) {
  
  // Component Quality Profile (Structured for AI consumption)
  server.addResource({
    uri: "standards://quality-profile",
    name: "Component Quality Profile",
    description: "Structured quality profile optimized for AI code generation",
    mimeType: "application/json",
    async load() {
      // 添加日志记录，用于验证客户端是否访问了此资源
      console.log("🔍 [MCP Resource] Quality Profile accessed by client at:", new Date().toISOString());
      console.log("📋 [MCP Resource] Client is reading standards://quality-profile");
      
      const standards = getQualityStandard();
      return {
        text: JSON.stringify(standards.qualityProfile, null, 2)
      };
    }
  });
} 