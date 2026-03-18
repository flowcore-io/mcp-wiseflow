/* eslint-disable @typescript-eslint/no-explicit-any */
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { wfGet, wfPost } from "../client.js";

const text = (data: unknown) => ({
  content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }],
});

export function registerFlowTools(server: McpServer): void {
  server.registerTool("search_flows", {
    description:
      "Search Wiseflow flows by marking date range (Unix ms). Returns flows in CONCLUDED/ARCHIVED state.",
    inputSchema: z.object({
      start: z.number(),
      end: z.number(),
      offset: z.number(),
      limit: z.number(),
      title: z.string().optional(),
      subtitle: z.string().optional(),
    }),
    handler: async ({ start, end, offset, limit, title, subtitle }: any) => {
      const result = await wfPost<unknown, object>(
        `flows/search?offset=${offset}&limit=${limit}`,
        {
          metadata: {
            states: ["CONCLUDED", "ARCHIVED"],
            title: title ?? "",
            subtitle: subtitle ?? "",
          },
          dates: {
            marking: {
              start,
              startComparator: "GREATER_EQUAL",
              end,
              endComparator: "LESS_EQUAL",
            },
          },
        },
      );
      return text(result);
    },
  });

  server.registerTool("get_flow", {
    description: "Get details of a Wiseflow flow by ID",
    inputSchema: z.object({ id: z.string() }),
    handler: async ({ id }: any) => text(await wfGet<unknown>(`flow/${id}`)),
  });

  server.registerTool("get_flow_metadata", {
    description: "Get metadata for a Wiseflow flow",
    inputSchema: z.object({ id: z.string() }),
    handler: async ({ id }: any) => {
      const r = await wfGet<{ data: unknown }>(`flows/${id}/metadata`);
      return text(r.data);
    },
  });

  server.registerTool("get_flow_assignments", {
    description: "Get assignments for a Wiseflow flow",
    inputSchema: z.object({ id: z.string() }),
    handler: async ({ id }: any) =>
      text(await wfGet<unknown[]>(`flow/${id}/assignments`)),
  });

  server.registerTool("get_flow_assessors", {
    description: "Get assessors for a Wiseflow flow",
    inputSchema: z.object({ id: z.string() }),
    handler: async ({ id }: any) =>
      text(await wfGet<unknown[]>(`flow/${id}/assessors`)),
  });

  server.registerTool("get_flow_participants", {
    description:
      "Get participants for a Wiseflow flow. Each participant includes submissionId and externalIds (Skulin-id = email, SkoleID = student ID).",
    inputSchema: z.object({ id: z.string() }),
    handler: async ({ id }: any) =>
      text(await wfGet<{ data: unknown[] }>(`flows/${id}/participants`)),
  });

  server.registerTool("get_flow_managers", {
    description: "Get managers for a Wiseflow flow",
    inputSchema: z.object({ id: z.string() }),
    handler: async ({ id }: any) =>
      text(await wfGet<{ data: unknown[] }>(`flows/${id}/managers`)),
  });

  server.registerTool("get_submission", {
    description:
      "Get details of a specific submission within a flow (includes handedIn status)",
    inputSchema: z.object({ flowId: z.string(), submissionId: z.string() }),
    handler: async ({ flowId, submissionId }: any) =>
      text(
        await wfGet<{ data: unknown }>(
          `flows/${flowId}/submissions/${submissionId}`,
        ),
      ),
  });

  server.registerTool("get_submission_responses", {
    description: "Get responses for a specific submission within a flow",
    inputSchema: z.object({ flowId: z.string(), submissionId: z.string() }),
    handler: async ({ flowId, submissionId }: any) =>
      text(
        await wfGet<{ data: unknown }>(
          `flows/${flowId}/submissions/${submissionId}/responses`,
        ),
      ),
  });
}
