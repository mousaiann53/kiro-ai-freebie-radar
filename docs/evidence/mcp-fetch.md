# Lesson 6 evidence: fetch MCP server

Config: `.kiro/settings/mcp.json` (template copy in `docs/mcp/mcp.json`), server `fetch` = `uvx mcp-server-fetch`, no API key.

Run on 2026-09-26 with `node scripts/mcp-fetch-smoke.mjs <url>`: the script starts the configured server over stdio, does the MCP `initialize` handshake, calls `tools/list` and then `tools/call fetch`.

## Call 1: https://education.github.com/pack

Returned the page as markdown ("GitHub Student Developer Pack … Intro to Copilot …"), used to confirm the `demo-github-student-pack` record.

## Call 2: https://ai.google.dev/gemini-api/docs/pricing

```
config: docs/mcp/mcp.json
server: { name: 'mcp-fetch', version: '1.30.0' }
tools: [ 'fetch' ]
fetch https://ai.google.dev/gemini-api/docs/pricing ->
<p>Gemini Developer API pricing | Gemini API | Google AI for Developers</p>
# Gemini Developer API pricing
Start building free of charge with generous limits, then scale up with prepaid then pay-as-you-go pricing for your production ready applications.
### Free
For developers and small projects getting started with the Gemini API.
```

Used by the `freebie-curator` custom agent to add the `demo-gemini-api-free-tier` record (see `docs/evidence/custom-agent-run.md`).

## Demo in Kiro

After `.kiro/settings/mcp.json` is in place, the MCP panel shows `fetch` connected. Ask in chat:

> Use the fetch MCP tool to read https://ai.google.dev/gemini-api/docs/pricing and draft an AI Freebie Radar offer from it.
