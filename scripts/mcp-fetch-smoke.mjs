// Smoke test for the workspace MCP server in .kiro/settings/mcp.json.
// Starts the configured `fetch` server over stdio, performs the MCP handshake,
// lists tools and calls `fetch` on a public URL. Usage: node scripts/mcp-fetch-smoke.mjs [url]
import { spawn } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';

const url = process.argv[2] ?? 'https://kiro.dev/2026/university/';
// Prefer the live workspace config; fall back to the template copy in docs/mcp/.
const configPath = existsSync('.kiro/settings/mcp.json') ? '.kiro/settings/mcp.json' : 'docs/mcp/mcp.json';
console.log('config:', configPath);
const { mcpServers } = JSON.parse(readFileSync(configPath, 'utf8'));
const { command, args } = mcpServers.fetch;

const child = spawn(command, args, { stdio: ['pipe', 'pipe', 'inherit'], shell: process.platform === 'win32' });
const pending = new Map();
let buffer = '';
let nextId = 1;

child.stdout.on('data', (chunk) => {
  buffer += chunk;
  let newline;
  while ((newline = buffer.indexOf('\n')) >= 0) {
    const line = buffer.slice(0, newline).trim();
    buffer = buffer.slice(newline + 1);
    if (!line) continue;
    const msg = JSON.parse(line);
    pending.get(msg.id)?.(msg);
  }
});

function request(method, params) {
  const id = nextId++;
  child.stdin.write(`${JSON.stringify({ jsonrpc: '2.0', id, method, params })}\n`);
  return new Promise((resolve) => pending.set(id, resolve));
}

const timer = setTimeout(() => {
  console.error('Timed out');
  child.kill();
  process.exit(1);
}, 120_000);

const init = await request('initialize', {
  protocolVersion: '2025-06-18',
  capabilities: {},
  clientInfo: { name: 'ai-freebie-radar-smoke', version: '1.0.0' },
});
console.log('server:', init.result?.serverInfo);
child.stdin.write(`${JSON.stringify({ jsonrpc: '2.0', method: 'notifications/initialized' })}\n`);

const tools = await request('tools/list', {});
console.log('tools:', tools.result?.tools.map((t) => t.name));

const res = await request('tools/call', { name: 'fetch', arguments: { url, max_length: 1500 } });
const text = res.result?.content?.map((c) => c.text).join('\n') ?? JSON.stringify(res.error);
console.log(`fetch ${url} ->\n${text.slice(0, 1500)}`);

clearTimeout(timer);
child.kill();
process.exit(res.result && !res.result.isError ? 0 : 1);
