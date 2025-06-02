import { FastMCP } from "fastmcp";
import startServer from "./server/server.js";

// Start the server
async function main() {
  try {
    const server = await startServer();
    
    server.start({
      transportType: "stdio",
    });
    
    console.error("MCP Server running on stdio");
  } catch (error) {
    console.error("Error starting MCP server:", error);
    process.exit(1);
  }
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
}); 