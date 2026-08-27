import Link from "next/link";

export default function ConnectionsHome() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b-4 border-gold bg-gradient-to-br from-navy to-navy-deep px-6 py-10 text-white">
        <div className="mx-auto max-w-2xl">
          <Link href="/" className="font-eyebrow text-sm text-[#cfd6e4] hover:text-white">
            ← Back to hub
          </Link>
          <p className="mt-3 font-eyebrow text-sm font-semibold tracking-[0.2em] text-gold uppercase">
            Sports Game Hub
          </p>
          <h1 className="mt-1 font-display text-5xl font-black italic">Player Connections</h1>
          <p className="mt-3 max-w-xl font-eyebrow text-lg text-[#cfd6e4]">
            Player 1 names a player. Player 2 responds with a college, team, or jersey number that
            connects to the next player. Keep going until someone can&apos;t continue the chain.
          </p>
        </div>
      </header>

      <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-10">
        <div className="grid gap-4 sm:grid-cols-2">
          <Link
            href="/games/connections/cpu"
            className="relative border-2 border-ink bg-paper-2 p-6 transition hover:-translate-y-0.5 hover:shadow-[4px_4px_0_var(--red)]"
          >
            <span className="absolute top-[-2px] left-[-2px] right-[-2px] h-[5px] bg-red" />
            <h2 className="font-display text-2xl font-bold">Solo Endless</h2>
            <p className="mt-2 font-body text-sm text-ink-dim">
              See how long you can keep the chain going. Try to beat your personal best.
            </p>
          </Link>
          <Link
            href="/games/connections/online"
            className="relative border-2 border-ink bg-paper-2 p-6 transition hover:-translate-y-0.5 hover:shadow-[4px_4px_0_var(--navy)]"
          >
            <span className="absolute top-[-2px] left-[-2px] right-[-2px] h-[5px] bg-gold" />
            <h2 className="font-display text-2xl font-bold">1v1 Online</h2>
            <p className="mt-2 font-body text-sm text-ink-dim">
              Create a room, send the code to a friend, and take turns extending the chain.
            </p>
          </Link>
        </div>
      </main>
    </div>
  );
}
