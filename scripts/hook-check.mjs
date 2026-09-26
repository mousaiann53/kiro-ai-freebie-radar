// Run by the Kiro PostFileSave hook (.kiro/hooks/typecheck-on-save.json).
// Reads the hook event JSON from stdin, runs typecheck + unit/property tests,
// and appends a timestamped result to docs/evidence/hook-run.log as proof of execution.
import { execSync } from 'node:child_process';
import { appendFileSync, closeSync, mkdirSync, openSync, readFileSync, rmSync, statSync } from 'node:fs';

let event = {};
try {
  const raw = readFileSync(0, 'utf8');
  event = raw.trim() ? JSON.parse(raw) : {};
} catch {
  // No or invalid stdin (manual run) — continue with an empty event.
}

// Serialize runs: rapid consecutive saves would otherwise start overlapping vitest processes.
const LOCK = 'node_modules/.hook-check.lock';
const sleep = (ms) => Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
for (let waited = 0; ; waited += 250) {
  try {
    closeSync(openSync(LOCK, 'wx'));
    break;
  } catch {
    let stale = false;
    try { stale = Date.now() - statSync(LOCK).mtimeMs > 120_000; } catch { /* lock just released */ }
    if (stale || waited > 120_000) rmSync(LOCK, { force: true });
    sleep(250);
  }
}
process.on('exit', () => rmSync(LOCK, { force: true }));

const file = event.file_path ?? event.filePath ?? event.path ?? event.tool_input?.path ?? '(unknown)';
const started = new Date().toISOString();
let ok = true;
let output = '';
try {
  output = execSync('npx tsc --noEmit && npx vitest --run', {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
    env: { ...process.env, NO_COLOR: '1', FORCE_COLOR: '0' },
  });
} catch (error) {
  ok = false;
  output = `${error.stdout ?? ''}${error.stderr ?? ''}`;
}

// Strip ANSI colour codes so the evidence log stays readable.
output = output.replace(/\u001b\[[0-9;]*m/g, '');

const summary = output
  .split(/\r?\n/)
  .filter((line) => /Test Files|Tests |error TS|FAIL|Error:/.test(line))
  .slice(0, 6)
  .map((line) => line.trim())
  .join(' | ');

mkdirSync('docs/evidence', { recursive: true });
appendFileSync(
  'docs/evidence/hook-run.log',
  `${started} trigger=${event.hook_event_name ?? event.trigger ?? 'PostFileSave'} file=${file} result=${ok ? 'PASS' : 'FAIL'} ${summary}\n`,
);

console.log(`[typecheck-on-save] ${ok ? 'PASS' : 'FAIL'} ${summary}`);
if (!ok) {
  console.error(output);
  process.exit(1);
}
