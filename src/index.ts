import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { registerFlowTools } from "./tools/flows.js";
import { registerUserTools } from "./tools/users.js";

const server = new McpServer({
  name: "wiseflow",
  version: "1.0.0",
});

registerFlowTools(server);
registerUserTools(server);

const transport = new StdioServerTransport();
server.connect(transport).catch((err) => {
  process.stderr.write(`Fatal: ${err}\n`);
  process.exit(1);
});
