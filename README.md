# Sports Game Hub

A hub for sports trivia / connection games, starting with **Player Connections**:
Player 1 names a player. Player 2 responds with a college, team, or jersey
number that links to the next player, and play continues from there
(e.g. "DeVonta Smith" → "Alabama" → "Jaylen Waddle" → "Miami Dolphins" → ...).

## Games

- **Player Connections** (`/games/connections`)
  - **Vs. Computer**: play until you or the computer runs out of valid
    connections. Your longest streak is saved as a personal best (per
    browser, via `localStorage`).
  - **1v1 Online**: create a room, share the code with a friend, and take
    turns extending the chain in real time.

More games can be added under `src/app/games/<slug>` and listed in
`src/app/page.tsx`.

## Player database

The player database is fully built into the app — no external service is
needed to play offline/vs-computer. It lives in `src/data/players.ts` as a
plain TypeScript array (name, colleges, teams, every jersey number worn).
Add more players by appending to that array; the game engine
(`src/lib/connections.ts`) automatically finds valid links between any two
entries.

## Online multiplayer backend

1v1 online rooms use a small Supabase project (Postgres + Realtime) purely
to sync turns between two browsers — it does **not** store any player data,
which stays built into the app. Schema: `rooms` (one row per game room) and
`moves` (one row per turn), see the migration applied to project
`sports-game` (id `jnczvvmuoqcglpratfqa`), kept separate from any other
Supabase project on this account.

Environment variables (see `.env.local`):

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

If unset, the app still works — only the "1v1 Online" mode is disabled.

## Development

```bash
npm install
npm run dev
```

## Deployment

Deploy on Vercel like any Next.js app. Set the two `NEXT_PUBLIC_SUPABASE_*`
environment variables in the project settings to enable online play.
