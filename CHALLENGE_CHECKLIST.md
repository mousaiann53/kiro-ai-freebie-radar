# Kiro University Challenge 2026 — Checklist

Checked against https://kiro.dev/2026/university/ and https://kiro.dev/2026/university/terms/ on 2026-09-26.

> Note: the official lesson numbering differs from the early draft syllabus.
> Official order: 1 Specs · 2 Steering · 3 Hooks · 4 Property-based testing (IDE only) · 5 Powers · 6 MCP · 7 Custom agents.
> Bonus 1 = Kiro Web / cloud sessions / cloud configuration (paid plans only). Bonus 2 = Package a Kiro power (all users).

## General Final requirements

| Requirement | Status |
|---|---|
| New project, first commit on/after 2026-09-21 09:00 PT, no earlier commits | ✅ fresh `git init`, no imported history |
| Public GitHub repo owned by you | ⏳ local repo committed; you create the public repo and push (no `gh` CLI on this machine) |
| `.kiro/` folder committed with lesson content | ✅ |
| Working project (not a static mockup) | ✅ React + TS + Vite + localStorage |
| Demo video 30s–3min | ⏳ user records (script in FINAL_SUBMISSION.md) |
| X or LinkedIn post with #KiroUniversity #BuildWithKiro + tag | ⏳ user posts (copy in FINAL_SUBMISSION.md) |
| Entry form with repo, video, post link, per-lesson writeup | ⏳ user submits (text in FINAL_SUBMISSION.md) |
| No commits after 2026-10-05 23:59 PT until judging ends | ⚠️ remember to freeze the repo |

## Lessons

| Lesson | Official requirement | How this project satisfies it | Files | Demo | Status |
|---|---|---|---|---|---|
| 1 Spec-driven development | Feature Spec: requirements → design → tasks (EARS encouraged) | Feature spec with EARS requirements for status, filter, sort, CRUD, persistence; design with correctness properties; task list executed to build the app | `.kiro/specs/ai-freebie-radar/requirements.md`, `design.md`, `tasks.md` | Open the spec, show EARS reqs + checked tasks | ✅ PASS |
| 2 Steering documents | Markdown steering files in `.kiro/steering/` that define a convention, the intent, and a code example | `project-standards.md` (always included) with good/bad code examples; `offer-data.md` (fileMatch on data files) | `.kiro/steering/project-standards.md`, `.kiro/steering/offer-data.md` | Open steering, point at good/bad examples, show pure functions in `src/lib/offers.ts` | ✅ PASS |
| 3 Hooks | JSON hook in `.kiro/hooks/` with trigger, matcher, action | `PostFileSave` on `src/**/*.ts(x)` runs `npm run check` (typecheck + tests) and logs output | `.kiro/hooks/typecheck-on-save.json`, `scripts/hook-check.mjs`, `docs/evidence/hook-run.log` | Ask Kiro to edit a file in `src/`, show the log updating | ✅ PASS |
| 4 Property-based testing | IDE only: Kiro extracts properties from spec requirements and generates/runs PBTs | Properties 1–7 in design.md turned into fast-check tests via spec tasks 7.1–7.7 (100 runs each); all pass | `.kiro/specs/ai-freebie-radar/design.md`, `tasks.md` (task 7), `src/lib/offers.property.test.ts`, `src/lib/storage.property.test.ts` | Show task 7 marked done/PBT passed in tasks.md, run `npm run check` (27 passed) | ✅ PASS |
| 5 Powers | Install/use a Kiro power, loaded on keyword | Project power `ai-freebie` (Agent Plugins format) with keywords "freebie", "AI credits", "trial", "羊毛"; its skill is also loaded by the custom agent | `powers/ai-freebie/plugin.json`, `powers/ai-freebie/skills/add-offer/SKILL.md` | Powers panel → Add Custom Power → Import from folder; say "add an AI freebie" | ⏳ Files done; you import + trigger once in the Powers panel |
| 6 MCP | Configure an MCP server in `mcp.json` (example: `fetch` via `uvx mcp-server-fetch`) | `fetch` MCP server; real `initialize` → `tools/list` → `tools/call fetch` on two public pages; output used to create the Gemini record | `docs/mcp/mcp.json` → copy to `.kiro/settings/mcp.json`, `scripts/mcp-fetch-smoke.mjs`, `docs/evidence/mcp-fetch.md` | MCP panel shows `fetch`; ask Kiro to fetch an offer URL | ✅ PASS (you copy config into `.kiro/settings/`) |
| 7 Custom agents | Agent config in `.kiro/agents/` with tools, permissions, resources, prompt | `freebie-curator`: read/write + fetch only, writes limited to `src/data` + `docs/evidence`, pre-approved `npm run check`, preloaded spec/steering/types/skill; added + verified the Gemini record | `.kiro/agents/freebie-curator.json`, `docs/evidence/custom-agent-run.md` | Switch to the agent, show config and evidence | ✅ PASS |
| Bonus 1 Cloud | Kiro Web / cloud sessions / cloud config — Pro+ plans only | Skipped unless account is on a paid plan | — | — | ⏭️ SKIPPED (paid only) |
| Bonus 2 Package a power | Create a power with `plugin.json` (+ skills) and include it in the submission | `ai-freebie` power, packaged in-repo, importable from folder or GitHub | `powers/ai-freebie/` | Show `plugin.json` + import | ✅ PASS (after import in step above) |
