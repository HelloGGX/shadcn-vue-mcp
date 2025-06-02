import { FastMCP } from "fastmcp";
import { registerComponentPrompts } from './componentPrompts.js';

/**
 * Register all prompts with the MCP server
 * @param server The FastMCP server instance
 */
export function registerPrompts(server: FastMCP) {
  // Register component-related prompts
  registerComponentPrompts(server);

}