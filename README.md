# Recall – AI Relationship Intelligence Agent

Next.js 15 (App Router) + TypeScript + Tailwind + Supabase + the Hindsight memory engine.
Recall remembers what was discussed, promised and left unfinished with each contact.

## Quick start

Requires Node.js 18.18 or newer.

```bash
npm install
cp .env.example .env.local     # then fill in your own keys
npm run dev
```

Open http://localhost:3000.

The app runs even with placeholder keys, because nothing calls Supabase or Hindsight over the network yet (see "What is mocked").

## Pages and API routes

| Route | What it does |
|---|---|
| `/` | Home page with links to everything |
| `/meeting-assistant` | Live speech-to-text (browser Web Speech API, Chrome/Edge) + memory classification + scenario simulator |
| `/chat` | Ask questions about past interactions |
| `/evolution` | Memory timeline (static sample events) |
| `/graph` | Relationship graph (static sample nodes) |
| `POST /api/chat` | Recalls memories from Hindsight, returns a reply |
| `POST /api/memory/live-meeting` | Classifies a transcript chunk into memories |
| `POST /api/memory/store` | Stores an explicit memory |
| `POST /api/memory/search` | Semantic search over memories |

## Where the code came from

**Copied verbatim from the specification document:** all four pages, all four API routes, `lib/hindsight.ts`, `supabase/schema.sql` (9 tables, 9 RLS policies, 3 indexes, 2 extensions), and the env variable list.

**Newly constructed (the document did not contain them; each file says so in a comment):** `app/layout.tsx`, `app/page.tsx`, `app/globals.css`, `components/navigation.tsx`, `components/ui/*`, `lib/utils.ts`, `lib/supabaseClient.ts`, `types/index.ts`, `middleware.ts`, `package.json`, `tsconfig.json`, `next.config.js`, `tailwind.config.js`, `postcss.config.js`, `.gitignore`, `.env.example`.

**Small edits made to document code:**
1. `app/meeting-assistant/page.tsx`: the `LiveMemory` interface in the document was corrupted (the `content: string;` line was replaced by a stray `|---|`). The page uses `mem.content`, so the line was restored.
2. `app/chat/page.tsx`: `h-screen` became `h-[calc(100vh-3.5rem)]` so the new 56px navigation bar doesn't push the page into scrolling.
3. `lib/hindsight.ts`: only a header comment was added, no logic changes.

## What is mocked (be honest with judges)

- **`lib/hindsight.ts` is a stub.** `retain`, `retainExplicit`, `recall` and `reflect` return hard-coded data and make no network calls. `HINDSIGHT_API_KEY` is read but never used. No Hindsight endpoints were invented. To go real, replace those four method bodies using Hindsight's official docs; the routes and pages need no changes as long as the return shapes stay the same.
- **`/api/chat` does not call an LLM.** The reply is a fixed sentence built from the recall result; `systemPrompt` is built but unused. `OPENAI_API_KEY` is in `.env.example` but no code uses it.
- **Simulator** on the meeting page is a `setTimeout` with canned text.
- **Evolution and Graph pages** show hard-coded sample data.
- **Supabase is not used by any page or route yet.** The schema and a lazy client (`lib/supabaseClient.ts`) exist; nothing reads or writes tables.
- **Pages send `contactId: 'demo-contact-uuid'`**, which is not a valid UUID, so it will fail against the schema once Supabase is wired in.

## Supabase

1. Create a project at https://supabase.com.
2. Run `supabase/schema.sql` in the SQL Editor.
3. Put the project URL and anon key in `.env.local`.

**Auth:** the document only implies auth (RLS uses `auth.uid()`). The minimum was added: `middleware.ts` refreshes the Supabase session cookie and does nothing until real keys are set. It never redirects or blocks anyone. There is **no login page** yet.

**Schema notes (left unchanged, as instructed):**
- `public.users.id` defaults to `uuid_generate_v4()` and is not linked to `auth.users(id)`. With the RLS policy `auth.uid() = id`, a user's profile row must be inserted with their auth user id, and nothing does that automatically (a trigger on `auth.users` is the usual fix).
- The `ivfflat` vector index with `lists = 100` works best after the table has data; on an empty table it is not useful yet.
- The RLS policies use `FOR ALL USING (...)` without `WITH CHECK`; Postgres applies the `USING` condition to inserts and updates in that case, so this is fine.
- Server code using `SUPABASE_SERVICE_ROLE_KEY` bypasses RLS. Never expose that key to the browser.

## Security

No real keys are in this repo. `.env`, `.env.local` and `.env.*.local` are git-ignored. Only commit `.env.example`.

## Verification status

The code was extracted programmatically and checked for syntax errors and leftover corruption (none). A full `npm install` / `next build` could not be run in the environment where this project was assembled (no network), so run `npm install && npm run dev` on your machine and report any errors.
