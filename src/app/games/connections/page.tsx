"use client";

import { useState } from "react";
import Link from "next/link";
import type { PlayerPool } from "@/lib/players-db";

export default function ConnectionsHome() {
  const [pool, setPool] = useState<PlayerPool>("all-time");
  const suffix = pool === "current" ? "?pool=current" : "";

  return (
    <div className="flex min-h-screen flex-col">
      <header className="px-6 pt-10 pb-8">
        <div className="mx-auto max-w-2xl">
          <Link href="/" className="font-eyebrow text-sm text-cream-dim hover:text-cream">
            ← Back to hub
          </Link>
          <p className="mt-3 font-eyebrow text-sm font-semibold tracking-[0.2em] text-sky uppercase">
            Sports Game Hub
          </p>
          <h1 className="mt-1 font-display text-5xl text-cream uppercase">The Sports Game</h1>
          <p className="mt-3 max-w-xl font-body text-lg text-cream-dim">
            Player 1 names a player. Player 2 responds with a college, team, or jersey number that
            connects to the next player. Keep going until someone can&apos;t continue the chain.
          </p>
        </div>
      </header>

      <main className="mx-auto w-full max-w-2xl flex-1 px-6 pb-14">
        <div className="mb-7">
          <p className="mb-2 font-eyebrow text-xs font-semibold tracking-[0.14em] text-cream-faint uppercase">
            Player pool
          </p>
          <div className="inline-flex rounded-full border border-sky/30 bg-navy p-1">
            <button
              type="button"
              onClick={() => setPool("all-time")}
              className={`rounded-full px-4 py-1.5 font-eyebrow text-sm font-bold tracking-wide uppercase transition ${
                pool === "all-time" ? "bg-sky text-navy-deep" : "text-cream-dim hover:text-cream"
              }`}
            >
              All-Time
            </button>
            <button
              type="button"
              onClick={() => setPool("current")}
              className={`rounded-full px-4 py-1.5 font-eyebrow text-sm font-bold tracking-wide uppercase transition ${
                pool === "current" ? "bg-sky text-navy-deep" : "text-cream-dim hover:text-cream"
              }`}
            >
              Current Players
            </button>
          </div>
          <p className="mt-2 font-body text-sm text-cream-dim">
            {pool === "current"
              ? "Only players on an active roster or who played in 2025 or later."
              : "Every Super Bowl-era NFL player, 1966 to today."}
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <Link
            href={`/games/connections/cpu${suffix}`}
            className="foil-border relative bg-navy p-6 transition hover:-translate-y-0.5 hover:shadow-[0_10px_28px_rgba(91,194,232,0.18)]"
          >
            <span className="mb-3 inline-block rounded bg-crimson px-2.5 py-1 font-eyebrow text-[10.5px] font-bold tracking-[0.14em] text-cream uppercase">
              Solo
            </span>
            <h2 className="font-display text-2xl text-cream uppercase">Solo Endless</h2>
            <p className="mt-2 font-body text-sm text-cream-dim">
              See how long you can keep the chain going. Try to beat your personal best.
            </p>
          </Link>
          <Link
            href={`/games/connections/online${suffix}`}
            className="foil-border relative bg-navy p-6 transition hover:-translate-y-0.5 hover:shadow-[0_10px_28px_rgba(91,194,232,0.18)]"
          >
            <span className="mb-3 inline-block rounded bg-sky-deep px-2.5 py-1 font-eyebrow text-[10.5px] font-bold tracking-[0.14em] text-cream uppercase">
              1v1
            </span>
            <h2 className="font-display text-2xl text-cream uppercase">1v1 Online</h2>
            <p className="mt-2 font-body text-sm text-cream-dim">
              Create a room, send the code to a friend, and take turns extending the chain.
            </p>
          </Link>
        </div>
      </main>
    </div>
  );
}
