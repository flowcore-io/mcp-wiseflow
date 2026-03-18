/* eslint-disable @typescript-eslint/no-explicit-any */
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { wfGet } from "../client.js";

export function registerUserTools(server: McpServer): void {
  server.registerTool("get_user_emails", {
    description: "Get email addresses for a Wiseflow user by their user ID",
    inputSchema: z.object({ userId: z.string() }),
    handler: async ({ userId }: any) =>
      ({
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(
              await wfGet<unknown>(`users/${userId}/emails`),
              null,
              2,
            ),
          },
        ],
      }),
  });
}
