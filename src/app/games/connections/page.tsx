import Link from "next/link";

export default function ConnectionsHome() {
  return (
    <div className="mx-auto flex min-h-screen max-w-2xl flex-col gap-8 px-6 py-16">
      <div>
        <Link href="/" className="text-sm text-white/50 hover:text-white">
          ← Back to hub
        </Link>
        <h1 className="mt-3 text-3xl font-bold">Player Connections</h1>
        <p className="mt-2 text-white/60">
          Player 1 names a player. Player 2 responds with a college, team, or jersey number that
          connects to the next player. Keep going until someone can&apos;t continue the chain.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Link
          href="/games/connections/cpu"
          className="rounded-2xl border border-white/10 bg-white/5 p-6 hover:border-emerald-400 hover:bg-white/10"
        >
          <h2 className="text-xl font-semibold">Vs. Computer</h2>
          <p className="mt-2 text-sm text-white/60">
            See how long you can keep the chain going. Try to beat your personal best.
          </p>
        </Link>
        <Link
          href="/games/connections/online"
          className="rounded-2xl border border-white/10 bg-white/5 p-6 hover:border-emerald-400 hover:bg-white/10"
        >
          <h2 className="text-xl font-semibold">1v1 Online</h2>
          <p className="mt-2 text-sm text-white/60">
            Create a room, send the code to a friend, and take turns extending the chain.
          </p>
        </Link>
      </div>
    </div>
  );
}
