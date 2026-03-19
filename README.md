# mcp-wiseflow

A [Model Context Protocol (MCP)](https://modelcontextprotocol.io) server that exposes the [WISEflow exam API](https://help.wiseflow.net/service-centre/api) as tools for Claude Code and other MCP-compatible AI clients.

---

## Tools

| Tool | Description |
|---|---|
| `search_flows` | Search flows by marking date range (Unix ms) with optional title/subtitle filters |
| `get_flow` | Get full details of a flow by ID |
| `get_flow_metadata` | Get metadata for a flow |
| `get_flow_assignments` | Get assignments on a flow |
| `get_flow_assessors` | Get assessors on a flow |
| `get_flow_participants` | Get participants on a flow (includes `submissionId` and `externalIds`) |
| `get_flow_managers` | Get managers on a flow |
| `get_submission` | Get a single submission (includes `handedIn` status and final grade) |
| `get_submission_responses` | Get all responses for a submission |
| `get_user_emails` | Get email addresses for a user by their user ID |

---

## Prerequisites

- [Node.js](https://nodejs.org) v20 or later
- A WISEflow API key (get one from your WISEflow License Administration page)
- [Claude Code](https://claude.ai/code) or another MCP-compatible client

---

## Installation

### 1. Register with Claude Code

From inside your project directory, run:

```bash
claude mcp add-json -s project wiseflow '{
  "type": "stdio",
  "command": "npx",
  "args": ["-y", "@flowcore/mcp-wiseflow"],
  "env": {
    "WISEFLOW_API_KEY": "your-api-key-here",
    "WISEFLOW_BASE_URL": "https://europe-api.wiseflow.net/v1",
    "WISEFLOW_LICENSE_ID": ""
  }
}'
```

This creates a `.mcp.json` file in your project root that Claude Code reads on startup. No cloning or building required — `npx` handles everything.

> **Tip:** Use `-s user` instead of `-s project` to register the server globally across all projects.

### 2. Restart Claude Code

After registration, restart Claude Code. Verify the server is running with:

```
/mcp
```

You should see `wiseflow` listed with 10 tools available.

---

## Configuration

The server is configured via environment variables:

| Variable | Required | Default | Description |
|---|---|---|---|
| `WISEFLOW_API_KEY` | ✅ | — | Your WISEflow API key (`x-api-key` header) |
| `WISEFLOW_BASE_URL` | ❌ | `https://europe-api.wiseflow.net/v1` | WISEflow API base URL |
| `WISEFLOW_LICENSE_ID` | ❌ | `""` | License ID (`x-wiseflow-license-id` header) |

---

## Usage Examples

### Search for flows in a date range

```
Search for Wiseflow flows from January 2025
```

Claude will call `search_flows` with the appropriate Unix ms timestamps. Only flows in `CONCLUDED` or `ARCHIVED` state are returned.

### Inspect a specific flow

```
Get the participants and assessors for flow 7464798
```

### Trace a submission

```
Show me the submission responses for submission 65253469 in flow 7464798
```

### Common workflow

1. `search_flows(start, end)` → find flow IDs
2. `get_flow_participants(id)` → get participants with their `submissionId`
3. `get_submission(flowId, submissionId)` → check `handedIn` + final grade
4. `get_submission_responses(flowId, submissionId)` → read full responses
5. `get_flow_assessors(id)` + `get_user_emails(userId)` → enrich assessors with emails

---

## Development

```bash
npm run dev   # watch mode
npm run build # one-off build
```

Source layout:

```
src/
  index.ts         ← STDIO server entry point
  client.ts        ← Axios HTTP client
  tools/
    flows.ts       ← 9 flow/submission tools
    users.ts       ← get_user_emails tool
```

---

## License

MIT
