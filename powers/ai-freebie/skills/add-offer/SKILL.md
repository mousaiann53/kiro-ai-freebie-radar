---
name: add-offer
description: Add or check one AI freebie / AI credits / trial record in AI Freebie Radar's demo data and verify field completeness. Use when the user mentions a freebie, AI credits, a trial, early access, a student perk or 羊毛.
---

# Add and check an AI freebie record

Follow these steps exactly. Keep the change to one record unless the user asks for more.

## Step 1: Read the rules

- Data model: `src/types.ts` (`Offer`, `CATEGORIES`)
- Data rules: `.kiro/steering/offer-data.md`
- Spec: `.kiro/specs/ai-freebie-radar/requirements.md` (Requirements 1, 4, 6)

## Step 2: Collect the facts

- If the user gives a public URL and the `fetch` MCP server is available, call it to read the page. Never invent a value, deadline or URL.
- If a fact is unknown, use `''` and say so in `notes`.

## Step 3: Build the record

All ten fields are required:

| Field | Rule |
|---|---|
| `id` | unique kebab-case, prefix `demo-` |
| `title`, `provider` | non-empty |
| `category` | one of `api-credits`, `free-trial`, `early-access`, `student-dev`, `model-event`, `tool-discount` |
| `value` | short, e.g. `$300 credits` |
| `deadline` | `YYYY-MM-DD` or `''` |
| `requirements`, `region`, `notes` | strings, may be `''` |
| `url` | official `https://` page |

## Step 4: Save

Append the record to `DEMO_OFFERS` in `src/data/demoOffers.ts`. Do not change other records. Keep at least one active and one expired offer.

## Step 5: Verify

Run `npm run check`. The `demo data` test in `src/lib/storage.test.ts` fails if any record is missing a field, has a bad category/date/URL, or duplicates an `id`.

## Step 6: Report

Reply with a checklist: each field ✅/⚠️, computed status (Active/Expired) for today, and the test result.
