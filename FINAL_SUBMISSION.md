# Final Submission — AI Freebie Radar

Replace `<GITHUB_USER>`, `<VIDEO_URL>` and `<POST_URL>` before submitting.

- Repo: https://github.com/<GITHUB_USER>/kiro-ai-freebie-radar
- Demo video: <VIDEO_URL>
- Social post: <POST_URL>

## 1. Project description (2–3 sentences)

AI Freebie Radar is a lightweight React + TypeScript web app for tracking AI perks: free API credits, trials, early access, student/developer benefits and limited-time model events. You can add, edit, delete, filter and sort offers; each offer's Active/Expired status is computed from its deadline, and everything persists in localStorage with no backend. It was built spec-first with Kiro, using steering, hooks, property-based tests, a custom power, a fetch MCP server and a dedicated custom agent.

## 2. How each lesson was applied

1. **Specs:** a requirements-first Feature Spec with EARS acceptance criteria (status, filtering, sorting, CRUD, persistence, demo data), a design with 7 correctness properties, and a task list executed to build the app. `.kiro/specs/ai-freebie-radar/`
2. **Steering:** an always-included project standard (strict TS, pure logic in `src/lib`, small components, no backend or extra dependencies, accessible mobile UI, demo-first) and a fileMatch rule for offer data, each with good/bad code examples. `.kiro/steering/`
3. **Hooks:** a `PostFileSave` hook on `src/**/*.ts(x)` runs typecheck + all tests after every agent save and logs the result. `.kiro/hooks/typecheck-on-save.json`, `docs/evidence/hook-run.log`
4. **Property-based testing:** Kiro turned the spec's properties into fast-check tests (100+ runs each) for `getOfferStatus`, `filterOffers`, `sortOffersByDeadline` and storage parsing, e.g. "any past deadline is expired" and "deadline sort is monotonic". All pass. `src/lib/*.property.test.ts`
5. **Powers:** a custom `ai-freebie` power (plugin.json + `add-offer` skill) that activates on "freebie", "AI credits", "trial", "羊毛" and guides Kiro through adding and validating a record. `powers/ai-freebie/`
6. **MCP:** a key-free `fetch` MCP server reads public offer pages; it read the Gemini API pricing page used to create a new record. `.kiro/settings/mcp.json`, `docs/evidence/mcp-fetch.md`
7. **Custom agents:** `freebie-curator` only has read/write + fetch, can write only to `src/data` and `docs/evidence`, is pre-approved for `npm run check` only, and is preloaded with the spec, steering, types and skill. It added and verified the Gemini record. `.kiro/agents/freebie-curator.json`, `docs/evidence/custom-agent-run.md`

## 3. Bonus

- **Bonus 2 — Package a Kiro power:** `powers/ai-freebie/` is a complete Agent Plugins power, importable from the repo.
- **Bonus 1 — Cloud:** not attempted (requires a paid plan).

## 4. Demo script (~2:30)

| Time | Show | Say |
|---|---|---|
| 0:00–0:15 | App home | "AI Freebie Radar tracks AI credits, trials and early access. Status is computed from the deadline." |
| 0:15–0:45 | + New offer → fill in → Add; Edit one; Delete one | "Full CRUD with validation." (Show the error when Title is empty.) |
| 0:45–1:00 | Category = API credits; Status = Expired; toggle sort | "Filter and sort are pure functions." |
| 1:00–1:10 | Reload page | "Saved in localStorage." |
| 1:10–1:25 | `.kiro/specs/ai-freebie-radar` requirements (EARS) + tasks | Lesson 1 |
| 1:25–1:35 | `.kiro/steering/project-standards.md` good/bad examples | Lesson 2 |
| 1:35–1:50 | Agent Hooks panel + `docs/evidence/hook-run.log` | Lesson 3 |
| 1:50–2:05 | tasks.md task 7 (PBT passed) + terminal `npm run check` (27 passed) | Lesson 4 |
| 2:05–2:15 | Powers panel showing `ai-freebie`; chat "add an AI freebie" → power activates | Lesson 5 + Bonus 2 |
| 2:15–2:25 | MCP panel `fetch` connected; `docs/evidence/mcp-fetch.md` | Lesson 6 |
| 2:25–2:40 | Switch agent to `freebie-curator`, show config + evidence | Lesson 7 |

## 5. Recording order

1. Run `npm run check` in a terminal and leave the output visible.
2. Open the app in the browser (run the dev server), click "Reset demo data".
3. Record the app part in one take (0:00–1:10).
4. Switch to Kiro and walk through the panels and files in lesson order (1 → 7).
5. Keep it under 3:00; trim pauses.

## 6. Social post (X / LinkedIn)

> I built AI Freebie Radar for the #KiroUniversity Final: a small React + TypeScript app to track AI credits, free trials and early-access perks, with automatic Active/Expired status, filters, deadline sorting and localStorage. Built with @kirodotdev using specs, steering, hooks, property-based tests, a custom power, a fetch MCP server and a custom agent. #BuildWithKiro
>
> Repo: https://github.com/<GITHUB_USER>/kiro-ai-freebie-radar
> Demo: <VIDEO_URL>

(On LinkedIn, tag @kiro instead of @kirodotdev.)

## 7. Entry form text

**Description:** AI Freebie Radar is a lightweight React + TypeScript web app for tracking AI perks (API credits, trials, early access, student benefits, model events). Users can create, edit, delete, filter and sort offers; status is computed from the deadline and data persists in localStorage. It was built spec-first with Kiro.

**How each lesson was incorporated:** paste section 2 above.
